import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  CLEAR_YOUR_MIND_PROMPT,
  buildClearYourMindUserPrompt,
} from "@/lib/solace/clear-your-mind-prompts";
import {
  applySlidingWindowRateLimit,
  getClientIdentifierFromHeaders,
} from "@/lib/solace/rate-limit";
import {
  isSolaceCrisisInput,
  SOLACE_CRISIS_FALLBACK,
} from "@/lib/solace/safety";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;
const MAX_THOUGHTS = 12;

function cleanThoughts(thoughts: unknown): string[] {
  if (!Array.isArray(thoughts)) {
    return [];
  }

  return thoughts
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .slice(0, MAX_THOUGHTS);
}

function thoughtsToInput(thoughts: string[]): string {
  return thoughts.join("\n");
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\r\n/g, "\n").trim();
}

function splitIntoSentences(text: string): string[] {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function formatThreeParagraphs(rawText: string): string {
  const cleaned = normalizeWhitespace(rawText);

  if (!cleaned) {
    return [
      "A lot seems to be sitting together at once here.",
      "Part of this may be the thoughts themselves, and part of it may be how they have started stacking on top of each other.",
      "This may be several different things arriving at once.",
    ].join("\n\n");
  }

  const paragraphParts = cleaned
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (paragraphParts.length >= 3) {
    return paragraphParts.slice(0, 3).join("\n\n");
  }

  const sentenceParts = splitIntoSentences(cleaned);

  if (sentenceParts.length >= 3) {
    return sentenceParts.slice(0, 3).join("\n\n");
  }

  return [
    "A lot seems to be sitting together at once here.",
    "Part of this may be the thoughts themselves, and part of it may be how they have started stacking on top of each other.",
    "This may be several different things arriving at once.",
  ].join("\n\n");
}

function buildRateLimitResponse(resetAt: number) {
  const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));

  const response = NextResponse.json(
    {
      ok: false,
      message: "Too many reflections in a short time. Please wait a minute and try again.",
    },
    { status: 429 }
  );

  response.headers.set("Retry-After", String(retryAfterSeconds));
  response.headers.set("X-RateLimit-Limit", String(RATE_LIMIT));
  response.headers.set("X-RateLimit-Remaining", "0");
  response.headers.set("X-RateLimit-Reset", String(resetAt));

  return response;
}

function applyRateLimitHeaders(response: NextResponse, remaining: number, resetAt: number) {
  response.headers.set("X-RateLimit-Limit", String(RATE_LIMIT));
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  response.headers.set("X-RateLimit-Reset", String(resetAt));

  return response;
}

async function getModelResponse(input: string): Promise<string> {
  const model = process.env.SOLACE_OPENAI_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini";

  const response = await client.responses.create({
    model,
    max_output_tokens: 170,
    input: [
      {
        role: "system",
        content: [{ type: "input_text", text: CLEAR_YOUR_MIND_PROMPT }],
      },
      {
        role: "user",
        content: [{ type: "input_text", text: buildClearYourMindUserPrompt(input) }],
      },
    ],
  });

  return (response.output_text || "").trim();
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          ok: false,
          message: "OPENAI_API_KEY is missing from .env.local.",
        },
        { status: 500 }
      );
    }

    const clientKey = getClientIdentifierFromHeaders(request.headers);
    const rateLimit = applySlidingWindowRateLimit(clientKey, RATE_LIMIT, RATE_WINDOW_MS);

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit.resetAt);
    }

    const body = await request.json().catch(() => null);
    const thoughts = cleanThoughts(body?.thoughts);
    const input = thoughtsToInput(thoughts);

    if (!input) {
      const response = NextResponse.json(
        {
          ok: false,
          message:
            "I’m not quite seeing what’s running through your mind yet. Try dropping one thought at a time.",
        },
        { status: 400 }
      );

      return applyRateLimitHeaders(response, rateLimit.remaining, rateLimit.resetAt);
    }

    if (isSolaceCrisisInput(input)) {
      const response = NextResponse.json({
        ok: true,
        message: SOLACE_CRISIS_FALLBACK,
        isCrisisFallback: true,
      });

      return applyRateLimitHeaders(response, rateLimit.remaining, rateLimit.resetAt);
    }

    const rawText = await getModelResponse(input);
    const message = formatThreeParagraphs(rawText);

    const response = NextResponse.json({
      ok: true,
      message,
      isCrisisFallback: false,
    });

    return applyRateLimitHeaders(response, rateLimit.remaining, rateLimit.resetAt);
  } catch (error) {
    console.error("Legacy slow-down compatibility route error:", error);

    const response = NextResponse.json(
      {
        ok: false,
        message: "Something interrupted the reflection for a moment. Please try again.",
      },
      { status: 500 }
    );

    return response;
  }
}