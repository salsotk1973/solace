// /app/api/solace/choose/route.ts

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { CHOOSE_SYSTEM_PROMPT, getChooseUserPrompt } from "@/lib/solace/prompts";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

  if (hasTwoClauseChoice) return true;
  if (hasStructuredChoice) return true;
  if (hasTradeoffStructure) return true;
  if (hasDecisionLanguage && hasQuestionMark) return true;

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

function cleanupSentenceText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim();
}

function splitIntoSentences(text: string): string[] {
  const normalized = text
    .replace(/\r/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();

  if (!normalized) return [];

  const rawParts = normalized
    .split(/(?<=[.!?])\s+(?=[A-Z“"'])/)
    .map((part) => cleanupSentenceText(part))
    .filter(Boolean);

  return rawParts;
}

function formatReflectionText(text: string): string {
  const sentences = splitIntoSentences(text);

  if (sentences.length === 0) {
    return cleanupSentenceText(text);
  }

  return sentences.join("\n\n");
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is missing from .env.local." },
        { status: 500 }
      );
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
      return NextResponse.json(
        {
          error: "No usable input was found in the request body.",
        },
        { status: 400 }
      );
    }

    const validationReflection = getValidationReflection(input);

    if (validationReflection) {
      return NextResponse.json({ text: validationReflection });
    }

    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

    const response = await client.responses.create({
      model,
      max_output_tokens: 140,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: CHOOSE_SYSTEM_PROMPT }],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: getChooseUserPrompt(input) }],
        },
      ],
    });

    const rawText = (response.output_text || "").trim();
    const text = formatReflectionText(rawText);

    if (!text) {
      return NextResponse.json(
        { error: "No response text was returned by the model." },
        { status: 500 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Solace Choose API error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while generating the reflection.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}