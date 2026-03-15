import { NextResponse } from "next/server";
import { createSolaceResponse } from "@/lib/solace/openai";
import { buildSlowDownPrompt } from "@/lib/solace/prompts";
import type { SlowDownRequest, SolaceApiResponse } from "@/lib/solace/types";

function cleanThoughts(thoughts: unknown): string[] {
  if (!Array.isArray(thoughts)) {
    return [];
  }

  return thoughts
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .slice(0, 12);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<SlowDownRequest>;
    const thoughts = cleanThoughts(body.thoughts);

    if (thoughts.length === 0) {
      const response: SolaceApiResponse = {
        ok: false,
        message:
          "I’m not quite seeing what’s running through your mind yet. Try dropping one thought at a time.",
      };

      return NextResponse.json(response, { status: 400 });
    }

    const prompt = buildSlowDownPrompt(thoughts);
    const message = await createSolaceResponse(prompt);

    const response: SolaceApiResponse = {
      ok: true,
      message,
      nextTool: "signal-vs-noise",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Slow Down route error:", error);

    const response: SolaceApiResponse = {
      ok: false,
      message:
        "Something interrupted the reflection for a moment. Please try again.",
    };

    return NextResponse.json(response, { status: 500 });
  }
}