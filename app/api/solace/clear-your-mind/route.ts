import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { evaluateClearYourMind } from "@/lib/solace/clear-your-mind/engine";
import {
  type ClearYourMindResponse,
  type ClearYourMindInput,
  type SafetyAssessment,
} from "@/lib/solace/clear-your-mind/types";
import { classifySafetyThoughts } from "@/lib/solace/safety/classify";
import { applySlidingWindowRateLimit } from "@/lib/solace/rate-limit";
import { isPaidUser } from "@/lib/auth-plan";
import {
  isAiUnavailableError,
  SOLACE_UNAVAILABLE_ERROR,
  SOLACE_UNAVAILABLE_MESSAGE,
} from "@/lib/solace/runtime";
import { isSolaceCrisisInput, SOLACE_CRISIS_FALLBACK } from "@/lib/solace/safety";
import { classifySolaceToolIntent } from "@/lib/solace/routing/tool-intent";
import { supabaseAdmin } from "@/lib/supabase/server";

const CYM_RATE_LIMIT = 5;
const CYM_RATE_WINDOW_MS = 60_000;

function getCymClientKey(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  const realIp = headers.get("x-real-ip");
  const vercelForwardedFor = headers.get("x-vercel-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ||
    vercelForwardedFor?.split(",")[0]?.trim() ||
    realIp ||
    "unknown-client";
  return `clear-your-mind:${ip}`;
}

function buildRateLimitResponse(resetAt: number): NextResponse {
  const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
  const response = NextResponse.json(
    { error: "Too many reflections in a short time. Please wait a minute and try again." },
    { status: 429 },
  );
  response.headers.set("Retry-After", String(retryAfterSeconds));
  response.headers.set("X-RateLimit-Limit", String(CYM_RATE_LIMIT));
  response.headers.set("X-RateLimit-Remaining", "0");
  response.headers.set("X-RateLimit-Reset", String(resetAt));
  return response;
}

function applyRateLimitHeaders(response: NextResponse, remaining: number, resetAt: number) {
  response.headers.set("X-RateLimit-Limit", String(CYM_RATE_LIMIT));
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  response.headers.set("X-RateLimit-Reset", String(resetAt));
  return response;
}

type ThoughtLike =
  | string
  | {
      id?: string;
      text?: string;
    };

type NormalizedThought = {
  id: string;
  text: string;
};

function normalizeThoughts(value: unknown): NormalizedThought[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index): NormalizedThought | null => {
      if (typeof item === "string") {
        const text = item.trim();
        if (!text) return null;

        return {
          id: `thought-${index + 1}`,
          text,
        };
      }

      if (item && typeof item === "object" && typeof item.text === "string") {
        const text = item.text.trim();
        if (!text) return null;

        return {
          id:
            typeof item.id === "string" && item.id.trim().length > 0
              ? item.id.trim()
              : `thought-${index + 1}`,
          text,
        };
      }

      return null;
    })
    .filter((item): item is NormalizedThought => item !== null)
    .slice(0, 7);
}

function isEmergencyBreathingRisk(thoughts: string[]): boolean {
  const text = thoughts.join(" ").toLowerCase();

  return (
    /\bnot breathing\b/.test(text) ||
    /\bno breathing\b/.test(text) ||
    /\bisn't breathing\b/.test(text) ||
    /\bisnt breathing\b/.test(text) ||
    /\bcan't breathe\b/.test(text) ||
    /\bcant breathe\b/.test(text) ||
    /\bnot able to breathe\b/.test(text) ||
    /\bdifficult breathing\b/.test(text) ||
    /\btrouble breathing\b/.test(text) ||
    /\bshortness of breath\b/.test(text) ||
    /\bstruggling to breathe\b/.test(text) ||
    /\bhard to breathe\b/.test(text) ||
    /\bstop breathing\b/.test(text)
  );
}

function buildSafetyAssessment(thoughts: string[], options?: { urgentMedical?: boolean }): SafetyAssessment {
  const classification = classifySafetyThoughts(thoughts.map((text) => ({ text })));
  const directIntent =
    options?.urgentMedical === true || thoughts.some((text) => isSolaceCrisisInput(text));

  return {
    riskScore: options?.urgentMedical ? Math.max(classification.totalScore, 100) : classification.totalScore,
    isCrisis: directIntent || classification.mode === "support",
    clarityFallback: false,
    signals: {
      directIntent,
      indirectIntent:
        !directIntent &&
        classification.categories.some((category) =>
          [
            "desire_to_disappear_or_not_exist",
            "life_worth_collapse",
            "hopelessness_no_point",
            "cant_go_on_language",
            "burden_language",
            "self_worth_collapse",
            "emotional_exhaustion_done",
            "ambiguous_high_risk",
          ].includes(category),
        ),
      existentialLanguage: classification.categories.some((category) =>
        [
          "desire_to_die_or_not_live",
          "desire_to_disappear_or_not_exist",
          "life_worth_collapse",
          "hopelessness_no_point",
          "passive_death_wishes",
        ].includes(category),
      ),
      burdenLanguage: classification.categories.includes("burden_language"),
      selfWorthCollapse: classification.categories.some((category) =>
        ["life_worth_collapse", "self_worth_collapse"].includes(category),
      ),
      gibberish: false,
    },
    matchedRules: classification.assessments.flatMap((assessment) => assessment.matchedGroupIds),
  };
}

function buildDeterministicCrisisResponse(thoughts: string[]): ClearYourMindResponse {
  return {
    ok: true,
    isCrisisFallback: true,
    clarityFallback: false,
    title: "Take a moment",
    message: SOLACE_CRISIS_FALLBACK,
    safetyAssessment: buildSafetyAssessment(thoughts),
  };
}

function buildEmergencySupportResponse(thoughts: string[]): ClearYourMindResponse {
  return {
    ok: true,
    isCrisisFallback: true,
    clarityFallback: false,
    title: "Take a moment",
    message:
      "This sounds urgent and needs real-world help right now. Please contact emergency services or immediate local support right now.",
    safetyAssessment: buildSafetyAssessment(thoughts, { urgentMedical: true }),
  };
}

export async function POST(request: Request) {
  let thoughtTexts: string[] = [];
  let rateLimitHeaders: { remaining: number; resetAt: number } | null = null;

  try {
    if (request.headers.get("X-Solace-Age-Confirmed") !== "1") {
      return NextResponse.json(
        { ok: false, error: "This tool is designed for adults only." },
        { status: 403 },
      );
    }

    const rateLimit = applySlidingWindowRateLimit(
      getCymClientKey(request.headers),
      CYM_RATE_LIMIT,
      CYM_RATE_WINDOW_MS,
    );

    rateLimitHeaders = {
      remaining: rateLimit.remaining,
      resetAt: rateLimit.resetAt,
    };

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit.resetAt);
    }

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          ok: false,
          error: "auth_required",
          message: "Clear Your Mind is available to Solace members. Sign in to continue.",
          upgradeUrl: "/sign-in",
        },
        { status: 401 },
      );
    }

    const paid = await isPaidUser();
    if (!paid) {
      return NextResponse.json(
        {
          ok: false,
          error: "upgrade_required",
          message: "Clear Your Mind is a Solace Pro feature. Upgrade to access unlimited sessions.",
          upgradeUrl: "/pricing",
        },
        { status: 403 },
      );
    }

    let body: (Partial<ClearYourMindInput> & {
      thoughts?: ThoughtLike[];
    }) | null = null;

    try {
      body = (await request.json()) as Partial<ClearYourMindInput> & {
        thoughts?: ThoughtLike[];
      };
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid request body.",
        },
        { status: 400 },
      );
    }

    const normalizedThoughts = normalizeThoughts(body?.thoughts);
    thoughtTexts = normalizedThoughts.map((item) => item.text);

    if (normalizedThoughts.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please add at least one thought first.",
        },
        { status: 400 },
      );
    }

    const input: ClearYourMindInput = {
      thoughts: normalizedThoughts,
    };

    // Deterministic server short-circuit for direct crisis language.
    if (thoughtTexts.some((text) => isSolaceCrisisInput(text))) {
      const response = NextResponse.json(buildDeterministicCrisisResponse(thoughtTexts), {
        status: 200,
      });

      return applyRateLimitHeaders(response, rateLimit.remaining, rateLimit.resetAt);
    }

    if (isEmergencyBreathingRisk(thoughtTexts)) {
      const response = NextResponse.json(buildEmergencySupportResponse(thoughtTexts), {
        status: 200,
      });

      return applyRateLimitHeaders(response, rateLimit.remaining, rateLimit.resetAt);
    }

    const safety = classifySafetyThoughts(thoughtTexts.map((text) => ({ text })));

    if (safety.mode === "support") {
      const response = NextResponse.json(buildDeterministicCrisisResponse(thoughtTexts), {
        status: 200,
      });

      return applyRateLimitHeaders(response, rateLimit.remaining, rateLimit.resetAt);
    }

    // Cross-tool routing — redirect if input clearly belongs to another tool
    const routing = classifySolaceToolIntent({
      currentTool: 'clear-your-mind',
      text: thoughtTexts.join(' '),
      thoughts: thoughtTexts,
    });

    if (
      routing.shouldRedirect &&
      routing.redirectTarget &&
      routing.title &&
      routing.message &&
      routing.ctaLabel
    ) {
      const response = NextResponse.json({
        ok: true,
        isCrisisFallback: false,
        isToolRedirect: true,
        redirectTarget: routing.redirectTarget,
        redirectTitle: routing.title,
        text: `${routing.message}\n\n${routing.ctaLabel}`,
      }, { status: 200 });
      return applyRateLimitHeaders(response, rateLimit.remaining, rateLimit.resetAt);
    }

    const result = await evaluateClearYourMind(input);

    // Log session to dashboard (fire-and-forget — never block the response)
    if (userId && result.ok && !result.isCrisisFallback) {
      void supabaseAdmin
        .from('tool_sessions')
        .insert({
          user_id: userId,
          tool: 'clear-your-mind',
          completed: true,
        })
    }

    return applyRateLimitHeaders(
      NextResponse.json(result, { status: 200 }),
      rateLimit.remaining,
      rateLimit.resetAt,
    );
  } catch (error) {
    const isDirectCrisis = thoughtTexts.some((text) => isSolaceCrisisInput(text));

    if (isDirectCrisis) {
      const response = NextResponse.json(buildDeterministicCrisisResponse(thoughtTexts), {
        status: 200,
      });

      if (rateLimitHeaders) {
        return applyRateLimitHeaders(response, rateLimitHeaders.remaining, rateLimitHeaders.resetAt);
      }

      return response;
    }

    if (isAiUnavailableError(error)) {
      return NextResponse.json(
        { ok: false, error: SOLACE_UNAVAILABLE_ERROR, message: SOLACE_UNAVAILABLE_MESSAGE },
        { status: 503 },
      );
    }

    console.error("Clear Your Mind route error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Something went wrong while processing the reflection.",
      },
      { status: 500 },
    );
  }
}
