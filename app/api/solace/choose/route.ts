// /app/api/solace/choose/route.ts

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { CHOOSE_SYSTEM_PROMPT, buildChooseUserPrompt } from "@/lib/solace/prompts";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ChooseRequestBody = {
  input?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChooseRequestBody;
    const input = body?.input?.trim();

    if (!input) {
      return NextResponse.json(
        { error: "Input is required." },
        { status: 400 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-5.4-mini",
      input: [
        {
          role: "system",
          content: CHOOSE_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: buildChooseUserPrompt(input),
        },
      ],
      max_output_tokens: 140,
    });

    const text = (response.output_text || "").trim();

    if (!text) {
      return NextResponse.json(
        { error: "No response generated." },
        { status: 500 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Solace Choose API error:", error);

    return NextResponse.json(
      { error: "Something went wrong while generating the reflection." },
      { status: 500 }
    );
  }
}