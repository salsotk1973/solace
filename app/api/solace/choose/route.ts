import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  CHOOSE_SYSTEM_PROMPT,
  getChooseUserPrompt,
  type ChooseDecisionContext,
  type ChooseDecisionType,
  type ChooseEmotionalWeight,
  type ChooseToneMode,
  type ChooseResponsePattern,
} from "@/lib/solace/prompts";
import {
  applySlidingWindowRateLimit,
  getClientIdentifierFromHeaders,
} from "@/lib/solace/rate-limit";
import { isPaidUser } from "@/lib/auth-plan";
import { supabaseAdmin } from "@/lib/supabase/server";
import {
  buildSharedCrisisTextPayload,
  isSharedSolaceRedFlagText,
} from "@/lib/solace/safety/shared";
import { classifySolaceToolIntent } from "@/lib/solace/routing/tool-intent";
import {
  SOLACE_AI_UNAVAILABLE_ERROR,
  SOLACE_SERVER_AI_TIMEOUT_MS,
  SOLACE_UNAVAILABLE_ERROR,
  SOLACE_UNAVAILABLE_MESSAGE,
  withTimeout,
} from "@/lib/solace/runtime";
import { getOpenAIClient } from "@/lib/server/openai";

const CHOOSE_RATE_LIMIT = 5;
const CHOOSE_RATE_WINDOW_MS = 60_000;
function extractInputFromUnknown(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  const body = value as Record<string, unknown>;

  const directCandidates = [
    body.input,
    body.text,
    body.decision,
    body.message,
    body.prompt,
    body.value,
    body.query,
    body.content,
  ];

  for (const candidate of directCandidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  const nestedCandidates = [body.data, body.payload, body.body, body.form, body.fields];

  for (const nested of nestedCandidates) {
    const nestedResult = extractInputFromUnknown(nested);
    if (nestedResult) {
      return nestedResult;
    }
  }

  return "";
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function getLetterStats(value: string) {
  const lettersOnly = value.replace(/[^a-zA-Z]/g, "");
  const uniqueLetters = new Set(lettersOnly.toLowerCase()).size;

  return {
    lettersOnly,
    uniqueLetters,
    length: lettersOnly.length,
  };
}

function looksLikeGibberish(input: string): boolean {
  const normalized = normalizeText(input);
  const { lettersOnly, uniqueLetters, length } = getLetterStats(input);

  if (!normalized) return true;
  if (length > 0 && length < 4) return true;

  const repeatedChunkPattern = /^([a-z]{1,4})\1{2,}$/i;
  if (repeatedChunkPattern.test(lettersOnly)) return true;

  const keyboardSmashPattern =
    /^(asdf|qwer|zxcv|asdfg|qwert|poiuy|lkjh|mnbv|hjkl|dfgh|sdfg|fdsa|jkl;|poi|wer|ert|tyu|uio)+$/i;
  if (keyboardSmashPattern.test(lettersOnly)) return true;

  const noVowelLongString = lettersOnly.length >= 7 && !/[aeiou]/i.test(lettersOnly);
  if (noVowelLongString) return true;

  const lowVarietyLongString = lettersOnly.length >= 10 && uniqueLetters <= 4;
  if (lowVarietyLongString) return true;

  const repeatedCharPattern = /(.)\1{5,}/i;
  if (repeatedCharPattern.test(lettersOnly)) return true;

  const randomTokenPattern = /\b[a-z]{8,}\b/i;
  const commonDecisionWords =
    /\b(should|stay|leave|move|go|choose|choice|decide|decision|between|whether|or|if|keep|quit|start|stop|tell|say|buy|sell|take|accept|decline)\b/i;

  if (
    randomTokenPattern.test(normalized) &&
    !commonDecisionWords.test(normalized) &&
    normalized.split(" ").length <= 4
  ) {
    return true;
  }

  return false;
}

function isIncompleteDecisionStart(input: string): boolean {
  const normalized = normalizeText(input);

  const incompleteStarts = [
    /^should\s+i\s+\w*$/,
    /^do\s+i\s+\w*$/,
    /^can\s+i\s+\w*$/,
    /^would\s+it\s+\w*$/,
    /^is\s+it\s+better\s+\w*$/,
  ];

  if (incompleteStarts.some((pattern) => pattern.test(normalized))) {
    return true;
  }

  const tokens = normalized.split(/\s+/);

  if (tokens.length <= 3) {
    const fragmentPatterns = [
      /^should\s+i$/,
      /^do\s+i$/,
      /^can\s+i$/,
      /^stay$/,
      /^go$/,
      /^leave$/,
      /^move$/,
      /^choose$/,
      /^decide$/,
      /^whether$/,
      /^or$/,
      /^stay\s+or$/,
      /^go\s+or$/,
      /^leave\s+or$/,
      /^move\s+or$/,
      /^miami\s+or\s+sydney$/,
      /^sydney\s+or\s+melbourne$/,
    ];

    if (fragmentPatterns.some((pattern) => pattern.test(normalized))) {
      return true;
    }
  }

  return false;
}

function looksLikeDecisionInput(input: string): boolean {
  const normalized = normalizeText(input);

  if (!normalized) return false;
  if (isIncompleteDecisionStart(normalized)) return false;

  const tokens = normalized.split(/\s+/);
  const wordCount = tokens.length;

  const hasQuestionMark = normalized.includes("?");
  const hasOr = /\bor\b/.test(normalized);
  const hasWhether = /\bwhether\b/.test(normalized);
  const hasBetween = /\bbetween\b/.test(normalized);
  const hasVersus = /\b(versus|vs\.?)\b/.test(normalized);

  const startsWithShouldI = /^should\s+i\b/.test(normalized);
  const startsWithDoI = /^do\s+i\b/.test(normalized);
  const startsWithCanI = /^can\s+i\b/.test(normalized);
  const startsWithWouldIt = /^would\s+it\b/.test(normalized);
  const startsWithIsItBetter = /^is\s+it\s+better\b/.test(normalized);

  const firstPersonPattern = /\b(i|my|me)\b/;

  const decisionVerbPattern =
    /\b(decide|decision|choose|choice|pick|keep|leave|stay|move|go|return|start|stop|change|accept|decline|tell|say|ask|buy|sell|take|wait|quit)\b/;

  const hasTwoClauseChoice =
    hasOr &&
    wordCount >= 4 &&
    (hasQuestionMark || startsWithShouldI || startsWithDoI || startsWithCanI);

  const hasStructuredChoice =
    (startsWithShouldI ||
      startsWithDoI ||
      startsWithCanI ||
      startsWithWouldIt ||
      startsWithIsItBetter) &&
    wordCount >= 4;

  const hasTradeoffStructure = (hasWhether || hasBetween || hasVersus) && wordCount >= 5;

  const hasDecisionLanguage =
    decisionVerbPattern.test(normalized) && firstPersonPattern.test(normalized) && wordCount >= 5;

  // Narrative decision inputs without question marks: "I don't know if X is worth it"
  const hasNarrativeDecision =
    /\bdon'?t know (if|whether)\b|\bnot sure (if|whether)\b|\bwondering (if|whether)\b|\btorn between\b|\bcan'?t decide\b/.test(
      normalized,
    ) && wordCount >= 8;

  if (hasTwoClauseChoice) return true;
  if (hasStructuredChoice) return true;
  if (hasTradeoffStructure) return true;
  if (hasDecisionLanguage && hasQuestionMark) return true;
  if (hasNarrativeDecision) return true;

  return false;
}

function getValidationReflection(input: string): string | null {
  if (looksLikeGibberish(input)) {
    return "That doesn’t look like a clear choice yet.\n\nTry writing it as a full decision, like “Should I stay or go?”";
  }

  if (isIncompleteDecisionStart(input)) {
    return "Finish the choice you’re weighing up.\n\nFor example: “Should I stay or leave?”";
  }

  if (!looksLikeDecisionInput(input)) {
    return "Write the decision as a clear choice.\n\nFor example: “Should I stay or leave?”";
  }

  return null;
}

function classifyDecisionType(input: string): ChooseDecisionType {
  const text = normalizeText(input);

  if (/\bforgive|forgiveness|hurt me|hurt you|betray|trust\b/.test(text)) {
    return "forgiveness";
  }

  if (
    /\bpartner|wife|husband|boyfriend|girlfriend|marry|marriage|relationship|love|feel about her|feel about him|text my ex|ex\b/.test(
      text,
    )
  ) {
    return "relationship";
  }

  if (/\bjob|career|work|quit|salary|income|promotion|startup\b/.test(text)) {
    return "career";
  }

  if (
    /\bchild|baby|have a child|have a baby|move to another city|move city|move overseas|another city|marry\b/.test(
      text,
    )
  ) {
    return "major-life";
  }

  if (
    /\bdog|cat|pet|wake up earlier|routine|cook|eat out|holiday|apartment|buy a home|buy a place\b/.test(
      text,
    )
  ) {
    return "lifestyle";
  }

  if (/\bbuy|wait|leave|stay|move|start|stop|change\b/.test(text)) {
    return "practical";
  }

  return "general";
}

function classifyEmotionalWeight(
  input: string,
  decisionType: ChooseDecisionType,
): ChooseEmotionalWeight {
  const text = normalizeText(input);

  if (
    decisionType === "forgiveness" ||
    /\bhurt|trust|betray|leave my partner|break up|marry|child|baby|forgive|love|wife|husband\b/.test(
      text,
    )
  ) {
    return "heavy";
  }

  if (
    decisionType === "relationship" ||
    decisionType === "career" ||
    decisionType === "major-life"
  ) {
    return "medium";
  }

  return "light";
}

function classifyToneMode(
  decisionType: ChooseDecisionType,
  emotionalWeight: ChooseEmotionalWeight,
): ChooseToneMode {
  if (emotionalWeight === "heavy") return "careful";
  if (
    emotionalWeight === "medium" ||
    decisionType === "relationship" ||
    decisionType === "career"
  ) {
    return "warm";
  }
  return "plain";
}

function hashString(value: string): number {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }

  return hash;
}

function selectResponsePattern(
  input: string,
  decisionType: ChooseDecisionType,
  emotionalWeight: ChooseEmotionalWeight,
): ChooseResponsePattern {
  const patterns: ChooseResponsePattern[] = [
    "anchor-tension-observation",
    "anchor-consequence-reflection",
    "anchor-contrast-insight",
  ];

  const seed = `${normalizeText(input)}|${decisionType}|${emotionalWeight}`;
  const index = hashString(seed) % patterns.length;

  return patterns[index];
}

function buildDecisionContext(input: string): ChooseDecisionContext {
  const decisionType = classifyDecisionType(input);
  const emotionalWeight = classifyEmotionalWeight(input, decisionType);
  const toneMode = classifyToneMode(decisionType, emotionalWeight);
  const responsePattern = selectResponsePattern(input, decisionType, emotionalWeight);

  return {
    decisionType,
    emotionalWeight,
    toneMode,
    responsePattern,
  };
}

function cleanupSentenceText(text: string): string {
  return text.replace(/\s+/g, " ").replace(/\s+([,.!?;:])/g, "$1").trim();
}

function splitIntoSentences(text: string): string[] {
  const normalized = text
    .replace(/\r/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();

  if (!normalized) return [];

  const paragraphLines = normalized
    .split(/\n+/)
    .map((line) => cleanupSentenceText(line))
    .filter(Boolean);

  const sentenceParts: string[] = [];

  for (const line of paragraphLines) {
    const parts = line
      .split(/(?<=[.!?])\s+(?=[A-Z“"'])/)
      .map((part) => cleanupSentenceText(part))
      .filter(Boolean);

    sentenceParts.push(...parts);
  }

  return sentenceParts;
}

function formatReflectionText(text: string): string {
  const sentences = splitIntoSentences(text);

  if (sentences.length === 0) {
    return cleanupSentenceText(text);
  }

  return sentences.slice(0, 3).join("\n\n");
}

function buildRateLimitResponse(resetAt: number): NextResponse {
  const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));

  const response = NextResponse.json(
    {
      error: "Too many reflections in a short time. Please wait a minute and try again.",
    },
    { status: 429 },
  );

  response.headers.set("Retry-After", String(retryAfterSeconds));
  response.headers.set("X-RateLimit-Limit", String(CHOOSE_RATE_LIMIT));
  response.headers.set("X-RateLimit-Remaining", "0");
  response.headers.set("X-RateLimit-Reset", String(resetAt));

  return response;
}

function applyRateLimitHeaders(response: NextResponse, remaining: number, resetAt: number) {
  response.headers.set("X-RateLimit-Limit", String(CHOOSE_RATE_LIMIT));
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  response.headers.set("X-RateLimit-Reset", String(resetAt));

  return response;
}

export async function POST(req: Request) {
  try {
    if (req.headers.get("X-Solace-Age-Confirmed") !== "1") {
      return NextResponse.json(
        { error: "This tool is designed for adults only." },
        { status: 403 },
      );
    }

    const clientKey = getClientIdentifierFromHeaders(req.headers);
    const rateLimit = applySlidingWindowRateLimit(
      clientKey,
      CHOOSE_RATE_LIMIT,
      CHOOSE_RATE_WINDOW_MS,
    );

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit.resetAt);
    }

    const { userId } = await auth();
    console.log('[choose-debug] userId:', userId);

    if (userId) {
      const paid = await isPaidUser();

      if (!paid) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { count } = await supabaseAdmin
          .from("tool_sessions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("tool", "choose")
          .gte("created_at", today.toISOString());

        if ((count ?? 0) >= 1) {
          return NextResponse.json(
            {
              error: "daily_limit_reached",
              message:
                "You've used your free session for today. Come back tomorrow or unlock unlimited sessions.",
              upgradeUrl: "/pricing",
            },
            { status: 429 },
          );
        }
      }
    }

    const rawBodyText = await req.text();

    let parsedBody: unknown = null;

    try {
      parsedBody = rawBodyText ? JSON.parse(rawBodyText) : null;
    } catch {
      parsedBody = rawBodyText;
    }

    const input = extractInputFromUnknown(parsedBody);

    if (!input) {
      const response = NextResponse.json(
        {
          error: "No usable input was found in the request body.",
        },
        { status: 400 },
      );

      return applyRateLimitHeaders(response, rateLimit.remaining, rateLimit.resetAt);
    }

    if (isSharedSolaceRedFlagText(input)) {
      const response = NextResponse.json(buildSharedCrisisTextPayload());
      return applyRateLimitHeaders(response, rateLimit.remaining, rateLimit.resetAt);
    }

    const routing = classifySolaceToolIntent({
      currentTool: "choose",
      text: input,
      thoughts: [input],
    });

    if (
      routing.shouldRedirect &&
      routing.redirectTarget &&
      routing.title &&
      routing.message &&
      routing.ctaLabel
    ) {
      const response = NextResponse.json({
        text: `${routing.message}\n\n${routing.ctaLabel}`,
        isCrisisFallback: false,
        isToolRedirect: true,
        redirectTarget: routing.redirectTarget,
        redirectTitle: routing.title,
      });

      return applyRateLimitHeaders(response, rateLimit.remaining, rateLimit.resetAt);
    }

    const validationReflection = getValidationReflection(input);

    if (validationReflection) {
      const response = NextResponse.json({
        text: validationReflection,
        isCrisisFallback: false,
      });

      return applyRateLimitHeaders(response, rateLimit.remaining, rateLimit.resetAt);
    }

    const client = getOpenAIClient();
    const context = buildDecisionContext(input);
    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

    let responseFromModel;
    try {
      responseFromModel = await withTimeout(
        client.responses.create({
          model,
          max_output_tokens: 150,
          input: [
            {
              role: "system",
              content: [{ type: "input_text", text: CHOOSE_SYSTEM_PROMPT }],
            },
            {
              role: "user",
              content: [{ type: "input_text", text: getChooseUserPrompt(input, context) }],
            },
          ],
        }),
        SOLACE_SERVER_AI_TIMEOUT_MS,
        SOLACE_AI_UNAVAILABLE_ERROR,
      );
    } catch (aiError) {
      const e = aiError as { status?: number };
      if (e.status === 429) console.warn("[solace] Choose: OpenAI rate limit (429)");
      return applyRateLimitHeaders(
        NextResponse.json(
          { error: SOLACE_UNAVAILABLE_ERROR, message: SOLACE_UNAVAILABLE_MESSAGE },
          { status: 503 },
        ),
        rateLimit.remaining,
        rateLimit.resetAt,
      );
    }

    const rawText = (responseFromModel.output_text || "").trim();
    const text = formatReflectionText(rawText);

    if (!text) {
      const response = NextResponse.json(
        { error: "No response text was returned by the model." },
        { status: 500 },
      );

      return applyRateLimitHeaders(response, rateLimit.remaining, rateLimit.resetAt);
    }

    if (userId) {
      void supabaseAdmin
        .from("tool_sessions")
        .insert({
          user_id: userId,
          tool: "choose",
          completed: true,
        });
    }

    const response = NextResponse.json({
      text,
      isCrisisFallback: false,
    });

    return applyRateLimitHeaders(response, rateLimit.remaining, rateLimit.resetAt);
  } catch (error) {
    console.error("Solace Choose API error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while generating the reflection.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
