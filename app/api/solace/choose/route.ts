// /app/api/solace/choose/route.ts

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { CHOOSE_SYSTEM_PROMPT, buildChooseUserPrompt } from "@/lib/solace/prompts";

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

  const nestedCandidates = [
    body.data,
    body.payload,
    body.body,
    body.form,
    body.fields,
  ];

  for (const nested of nestedCandidates) {
    const nestedResult = extractInputFromUnknown(nested);
    if (nestedResult) {
      return nestedResult;
    }
  }

  return "";
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
      console.error("Solace Choose API: no input found.", {
        rawBodyText,
        parsedBody,
      });

      return NextResponse.json(
        {
          error: "No usable input was found in the request body.",
          debugRawBody: rawBodyText || "(empty body)",
          debugParsedBody: parsedBody,
        },
        { status: 400 }
      );
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
          content: [{ type: "input_text", text: buildChooseUserPrompt(input) }],
        },
      ],
    });

    const text = (response.output_text || "").trim();

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