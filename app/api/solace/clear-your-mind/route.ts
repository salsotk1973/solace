import { NextResponse } from "next/server";
import { evaluateClearYourMind } from "@/lib/solace/clear-your-mind/engine";
import { ClearYourMindInput } from "@/lib/solace/clear-your-mind/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ClearYourMindInput>;

    const input: ClearYourMindInput = {
      thoughts: Array.isArray(body?.thoughts) ? body.thoughts : [],
    };

    const result = evaluateClearYourMind(input);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
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