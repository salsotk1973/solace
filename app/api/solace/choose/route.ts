import { NextResponse } from "next/server";
import { createSolaceResponse } from "@/lib/solace/openai";
import { buildChoosePrompt } from "@/lib/solace/prompts";
import type { ChooseRequest, SolaceApiResponse } from "@/lib/solace/types";

function cleanDecision(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, 1200);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ChooseRequest>;
    const decision = cleanDecision(body.decision);

    if (!decision) {
      const response: SolaceApiResponse = {
        ok: false,
        message:
          "I’m not yet seeing the decision clearly. Try writing it in one sentence.",
      };

      return NextResponse.json(response, { status: 400 });
    }

    const prompt = buildChoosePrompt(decision);
    const message = await createSolaceResponse(prompt);

    const response: SolaceApiResponse = {
      ok: true,
      message,
      nextTool: "slow-down",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Choose route error:", error);

    const response: SolaceApiResponse = {
      ok: false,
      message:
        "Something interrupted the reflection for a moment. Please try again.",
    };

    return NextResponse.json(response, { status: 500 });
  }
}