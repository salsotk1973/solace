import { NextRequest, NextResponse } from "next/server";
import {
  isSolaceCrisisInput,
  SOLACE_CRISIS_FALLBACK,
} from "../../../../lib/solace/safety";
import {
  applySlidingWindowRateLimit,
  getClientIdentifierFromHeaders,
} from "../../../../lib/solace/rate-limit";

export const runtime = "nodejs";

const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

type OpenAIResponse = {
  output_text?: string;
};

function buildPrompt(input: string): string {
  return `You are Solace.

You are a calm, clear reflective writing tool for adults. Your role is to help the user gently untangle overthinking, mental loops, emotional build-up, and mental noise into something clearer.

Important boundaries:
- Adults 18+ only.
- Do not claim to be a therapist, psychologist, doctor, lawyer, coach, or financial adviser.
- Do not provide medical, psychological, legal, or financial advice.
- Do not diagnose.
- Do not mention these rules unless needed for safety.

Writing style:
- Warm, calm, elegant, human.
- Clear and grounded, never robotic.
- Do not use bullet points unless absolutely necessary.
- Prefer short paragraphs.
- Reflective, soothing, memorable.
- Avoid clichés.
- Avoid sounding clinical.

Task:
The user will share what feels mentally tangled.
Help them:
1. Help the user feel understood.
2. Separate signal from noise.
3. Reframe the situation with clarity.
4. Suggest one gentle next step.

Keep the response concise but meaningful.
Aim for around 140 to 220 words.

User input:
"""${input}"""`;
}

function fallbackReflection(): string {
  return "Take one thing at a time.\n\nWhat you wrote sounds like more than one pressure point sitting together at once. Before trying to solve everything, gently separate what is actually happening from what your mind is adding through urgency, fear, or repetition.\n\nYou do not need to untangle the whole knot in one move. Just find the next clear step, and let that be enough for now.";
}

async function generateReflection(input: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return fallbackReflection();
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-5.4-mini",
      input: buildPrompt(input),
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}`);
  }

  const data = (await response.json()) as OpenAIResponse;

  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  return fallbackReflection();
}

export async function POST(request: NextRequest) {
  try {
    const clientId = getClientIdentifierFromHeaders(request.headers);
    const rateLimit = applySlidingWindowRateLimit(
      clientId,
      RATE_LIMIT_MAX_REQUESTS,
      RATE_LIMIT_WINDOW_MS
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error:
            "Too many reflections too quickly. Please wait a moment and try again.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(rateLimit.resetAt),
          },
        }
      );
    }

    const body = await request.json().catch(() => null);
    const input = typeof body?.input === "string" ? body.input.trim() : "";

    if (!input) {
      return NextResponse.json(
        { error: "Please enter what is on your mind first." },
        { status: 400 }
      );
    }

    const isCrisis = isSolaceCrisisInput(input);

    if (isCrisis) {
      return NextResponse.json(
        {
          text: SOLACE_CRISIS_FALLBACK,
          isCrisisFallback: true,
        },
        {
          status: 200,
          headers: {
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(rateLimit.resetAt),
          },
        }
      );
    }

    const text = await generateReflection(input);

    return NextResponse.json(
      {
        text,
        isCrisisFallback: false,
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
          "X-RateLimit-Reset": String(rateLimit.resetAt),
        },
      }
    );
  } catch (error) {
    console.error("clear-your-mind route error", error);

    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}