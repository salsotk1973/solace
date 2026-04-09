import type {
  ClearYourMindInput,
  ClearYourMindResponse,
  SafetyAssessment,
} from "./types";
import {
  buildSharedClarityPayload,
  classifySharedSolaceThoughts,
  SOLACE_SHARED_CLARITY_MESSAGE,
  SOLACE_SHARED_CLARITY_TITLE,
} from "@/lib/solace/safety/shared";
import { classifySolaceToolIntent } from "@/lib/solace/routing/tool-intent";
import { getOpenAIClient } from "@/lib/server/openai";
import {
  SOLACE_AI_UNAVAILABLE_ERROR,
  SOLACE_SERVER_AI_TIMEOUT_MS,
  withTimeout,
} from "@/lib/solace/runtime";

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/\s+/g, " ");
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .replace(/[^a-z0-9\s?'-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function extractResponseText(data: unknown): string {
  if (!data || typeof data !== "object") return "";

  const record = data as Record<string, unknown>;

  if (typeof record.output_text === "string" && record.output_text.trim()) {
    return record.output_text.trim();
  }

  if (Array.isArray(record.output)) {
    const pieces: string[] = [];

    for (const outputItem of record.output) {
      if (!outputItem || typeof outputItem !== "object") continue;

      const outputRecord = outputItem as Record<string, unknown>;
      const content = outputRecord.content;

      if (!Array.isArray(content)) continue;

      for (const contentItem of content) {
        if (!contentItem || typeof contentItem !== "object") continue;

        const contentRecord = contentItem as Record<string, unknown>;

        if (typeof contentRecord.text === "string" && contentRecord.text.trim()) {
          pieces.push(contentRecord.text.trim());
        }
      }
    }

    return pieces.join("\n").trim();
  }

  return "";
}

function splitIntoThreeLines(text: string): [string, string, string] {
  const cleaned = text.trim();

  if (!cleaned) {
    return [
      "",
      "",
      "",
    ];
  }

  const numberedLines = cleaned
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^\d+[\.\)]\s*/, "").trim())
    .filter(Boolean);

  if (numberedLines.length >= 3) {
    return [
      numberedLines[0] || "",
      numberedLines[1] || "",
      numberedLines[2] || "",
    ];
  }

  const sentenceParts = cleaned
    .split(/(?<=[.?!])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return [
    sentenceParts[0] || "",
    sentenceParts[1] || "",
    sentenceParts[2] || "",
  ];
}

async function generateAIReflection(thoughts: string[]): Promise<[string, string, string]> {
  const prompt = `
You are Solace.

You are writing a reflection for the "Clear Your Mind" tool.

The user has entered several thoughts that are sitting in their mind at the same time.
Your job is to write a short reflection that feels:
- very human
- calm
- emotionally accurate
- specific to what they shared
- easy to understand
- like a very close friend who truly cares

Hard rules:
- Write exactly 3 short paragraphs
- Each paragraph must be 1 sentence only
- Do not use labels
- Do not use bullet points
- Do not use numbered lists in the final answer
- Do not sound clinical, robotic, poetic, vague, or corporate
- Do not repeat the user's exact wording unless absolutely necessary
- Do not give emergency, legal, financial, or medical advice
- Do not end with a question
- Do not use filler like "it's understandable" or "take a breath"
- Do not be generic

What each sentence must do:
1. Name what seems to be landing all at once, based specifically on the thoughts
2. Say what may be sitting underneath all that pressure
3. Offer one gentle, grounded next direction

Important:
- The reflection must clearly reflect the actual combination of thoughts
- If the thoughts involve work + money + family, the reflection should feel like that exact mix
- If the thoughts are gibberish or unclear, do not guess

User thoughts:
${thoughts.map((thought, index) => `${index + 1}. ${thought}`).join("\n")}

Return exactly 3 lines, nothing else.
`;

  const client = getOpenAIClient();

  try {
    const response = await withTimeout(
      client.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: prompt,
        max_output_tokens: 180,
      }),
      SOLACE_SERVER_AI_TIMEOUT_MS,
      SOLACE_AI_UNAVAILABLE_ERROR,
    );

    const text = extractResponseText(response);
    const [line1, line2, line3] = splitIntoThreeLines(text);

    return [
      line1 || "A lot seems to be landing at once.",
      line2 || "That kind of pressure can make everything feel heavier than it looks from the outside.",
      line3 || "Try to steady the one part that would make today feel a little more manageable.",
    ];
  } catch (err) {
    const e = err as { status?: number; message?: string };
    if (e.status === 429) {
      console.warn("[solace] Clear Your Mind: OpenAI rate limit (429)");
    }
    if (e.message === SOLACE_AI_UNAVAILABLE_ERROR) {
      console.warn("[solace] Clear Your Mind: OpenAI timeout (8s)");
    }
    throw new Error(SOLACE_AI_UNAVAILABLE_ERROR);
  }
}

function buildSafetyAssessment(input: ClearYourMindInput): SafetyAssessment {
  const thoughts = (input.thoughts ?? [])
    .map((item) => item?.text ?? "")
    .map((text) => text.trim())
    .filter(Boolean)
    .slice(0, 7);

  const sharedSafety = classifySharedSolaceThoughts(thoughts);
  const classification = sharedSafety.classification;

  return {
    riskScore: classification.totalScore,
    isCrisis: sharedSafety.mode === "support",
    clarityFallback: sharedSafety.mode === "clarity",
    signals: {
      directIntent: classification.categories.some((category) =>
        [
          "direct_self_harm_intent",
          "desire_to_die_or_not_live",
          "passive_death_wishes",
          "short_form_high_risk",
        ].includes(category),
      ),
      indirectIntent: classification.categories.some((category) =>
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
      gibberish: sharedSafety.mode === "clarity" && sharedSafety.hasGibberish,
    },
    matchedRules: classification.assessments.flatMap((assessment) => assessment.matchedGroupIds),
  };
}

function buildCrisisFallback(assessment: SafetyAssessment): ClearYourMindResponse {
  return {
    ok: true,
    isCrisisFallback: true,
    clarityFallback: false,
    title: "Take a moment",
    message:
      "It sounds like you may be going through something very difficult.\n\nSolace is not equipped for crisis support.\n\nPlease reach out to a trusted person or a qualified professional who can support you right now.",
    safetyAssessment: assessment,
  };
}

function buildClarityFallback(assessment: SafetyAssessment): ClearYourMindResponse {
  const shared = buildSharedClarityPayload();

  return {
    ok: true,
    isCrisisFallback: shared.isCrisisFallback,
    clarityFallback: shared.clarityFallback,
    title: SOLACE_SHARED_CLARITY_TITLE,
    message: SOLACE_SHARED_CLARITY_MESSAGE,
    safetyAssessment: assessment,
  };
}

function buildRedirectResponse(params: {
  title: string;
  message: string;
  ctaLabel: string;
  targetTool: "choose" | "break-it-down";
  assessment: SafetyAssessment;
}): ClearYourMindResponse {
  return {
    ok: true,
    isCrisisFallback: false,
    clarityFallback: false,
    reflection: {
      title: params.title,
      summary: params.message,
      structure: {
        recognition: params.ctaLabel,
        untangling: params.targetTool,
        gentleFrame: "",
      },
    },
    safetyAssessment: params.assessment,
  };
}

async function buildNormalReflection(
  thoughts: string[],
  assessment: SafetyAssessment,
): Promise<ClearYourMindResponse> {
  const cleanThoughts = thoughts
    .map((thought) => thought.trim())
    .filter(Boolean)
    .slice(0, 7);

  const lines = await generateAIReflection(cleanThoughts);

  return {
    ok: true,
    isCrisisFallback: false,
    clarityFallback: false,
    reflection: {
      title: "",
      summary: lines[0] || "",
      structure: {
        recognition: lines[1] || "",
        untangling: lines[2] || "",
        gentleFrame: "",
      },
    },
    safetyAssessment: assessment,
  };
}

function looksLikeDecisionInput(thoughts: string[]): boolean {
  const combined = normalizeText(thoughts.join(" "));

  const decisionPatterns = [
    /\bshould i\b/i,
    /\bshould we\b/i,
    /\bcan i\b/i,
    /\bis it better\b/i,
    /\bwhich is better\b/i,
    /\bor\b/i,
  ];

  if (thoughts.length === 1 && decisionPatterns.some((pattern) => pattern.test(combined))) {
    return true;
  }

  return false;
}

function looksOffDomain(thoughts: string[]): boolean {
  const combined = normalizeText(thoughts.join(" "));
  const tokens = tokenize(combined);

  const aiHeavy =
    /\b(ai|artificial intelligence)\b/i.test(combined) &&
    !/\b(i feel|i am|i'm|me|my|worthless|stuck|lost|sad|anxious|panic|stress|stressed)\b/i.test(
      combined,
    );

  const petDebate =
    /\b(cats?|dogs?)\b/i.test(combined) &&
    /\b(question|better|vs|versus|or)\b/i.test(combined) &&
    !/\b(i feel|i am|i'm|me|my)\b/i.test(combined);

  const metaRant =
    /\bi hate ai\b/i.test(combined) ||
    /\bwhy ai is so bad\b/i.test(combined) ||
    /\bmy cat is more intelligent than ai\b/i.test(combined);

  const mostlyTopical =
    tokens.length > 0 &&
    tokens.every((token) =>
      [
        "ai",
        "cats",
        "cat",
        "dogs",
        "dog",
        "question",
        "hate",
        "bad",
        "why",
        "more",
        "than",
        "the",
        "is",
        "or",
        "vs",
      ].includes(token),
    );

  return aiHeavy || petDebate || metaRant || mostlyTopical;
}

export async function evaluateClearYourMind(
  input: ClearYourMindInput,
): Promise<ClearYourMindResponse> {
  const thoughts = (input.thoughts ?? [])
    .map((item) => item?.text ?? "")
    .map((text) => text.trim())
    .filter(Boolean)
    .slice(0, 7);

  const sharedSafety = classifySharedSolaceThoughts(thoughts);
  const assessment = buildSafetyAssessment(input);

  if (sharedSafety.mode === "support") {
    return buildCrisisFallback({ ...assessment, isCrisis: true });
  }

  if (
    sharedSafety.mode === "clarity" ||
    looksLikeDecisionInput(thoughts) ||
    looksOffDomain(thoughts)
  ) {
    return buildClarityFallback({ ...assessment, clarityFallback: true });
  }

  const routing = classifySolaceToolIntent({
    currentTool: "clear-your-mind",
    thoughts,
  });

  if (
    routing.shouldRedirect &&
    routing.redirectTarget &&
    routing.title &&
    routing.message &&
    routing.ctaLabel
  ) {
    if (routing.redirectTarget === "choose" || routing.redirectTarget === "break-it-down") {
      return buildRedirectResponse({
        title: routing.title,
        message: routing.message,
        ctaLabel: routing.ctaLabel,
        targetTool: routing.redirectTarget,
        assessment,
      });
    }
  }

  return await buildNormalReflection(thoughts, assessment);
}
