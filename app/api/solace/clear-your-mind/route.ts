// /app/api/solace/clear-your-mind/route.ts

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

import {
  CLEAR_YOUR_MIND_PROMPT,
  buildClearYourMindUserPrompt,
} from "../../../../lib/solace/clear-your-mind-prompts";
import {
  isSolaceCrisisInput,
  SOLACE_CRISIS_FALLBACK,
} from "../../../../lib/solace/safety";
import { checkRateLimit } from "../../../../lib/solace/rate-limit";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_INPUT_LENGTH = 1200;

const FALLBACK_RESPONSE = [
  "A lot seems to be sitting together at once here.",
  "Part of this may be the issue itself, and part of it may be everything gathering around it.",
  "This may be several different things arriving at once.",
].join("\n\n");

function getClientIdentifier(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();

    if (firstIp) {
      return firstIp;
    }
  }

  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
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

function enforceThreeParagraphResponse(rawText: string): string {
  const cleaned = normalizeWhitespace(rawText);

  if (!cleaned) {
    return FALLBACK_RESPONSE;
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

  return FALLBACK_RESPONSE;
}

async function getModelResponse(input: string): Promise<string> {
  const response = await client.responses.create({
    model: process.env.SOLACE_OPENAI_MODEL || "gpt-5-mini",
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: CLEAR_YOUR_MIND_PROMPT,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: buildClearYourMindUserPrompt(input),
          },
        ],
      },
    ],
  });

  return response.output_text?.trim() || "";
}

export async function POST(request: NextRequest) {
  try {
    const clientId = getClientIdentifier(request);

    const rateLimitResult = await checkRateLimit(clientId, {
      windowMs: 60_000,
      maxRequests: 5,
    });

    const allowed =
      typeof rateLimitResult === "boolean"
        ? rateLimitResult
        : rateLimitResult?.success ?? true;

    if (!allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait a moment before trying again.",
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    const input = typeof body?.input === "string" ? body.input.trim() : "";

    if (!input) {
      return NextResponse.json(
        {
          error: "Please enter something first.",
        },
        { status: 400 }
      );
    }

    if (input.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        {
          error: `Please keep your message under ${MAX_INPUT_LENGTH} characters.`,
        },
        { status: 400 }
      );
    }

    if (isSolaceCrisisInput(input)) {
      return NextResponse.json(
        {
          text: SOLACE_CRISIS_FALLBACK,
          isCrisisFallback: true,
        },
        { status: 200 }
      );
    }

    const rawText = await getModelResponse(input);
    const text = enforceThreeParagraphResponse(rawText);

    return NextResponse.json(
      {
        text,
        isCrisisFallback: false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Clear Your Mind route error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}