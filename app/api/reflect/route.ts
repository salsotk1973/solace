import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  isSolaceCrisisInput,
  SOLACE_CRISIS_FALLBACK,
} from "@/lib/solace/safety";

type ReflectRequestBody = {
  question?: string;
  toolSlug?: string;
};

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  return new OpenAI({ apiKey });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ReflectRequestBody;
    const question = body.question?.trim() ?? "";
    const toolSlug = body.toolSlug ?? "clarity";

    if (!question) {
      return NextResponse.json(
        { error: "Question is required." },
        { status: 400 },
      );
    }

    if (isSolaceCrisisInput(question)) {
      return NextResponse.json({
        text: SOLACE_CRISIS_FALLBACK,
        isCrisisFallback: true,
      });
    }

    const client = getOpenAIClient();

    const systemPrompt = `
You are Solace.

Solace is a calm reflection tool.
Solace is not a chatbot.
Solace is not a financial advisor.
Solace is not a therapist.
Solace is not a productivity coach.

Your task is to help the user see their question more clearly.

Style:
- calm
- brief
- human
- grounded
- warm
- clear
- never robotic
- never corporate
- never overly analytical
- never generic

Very important:
- keep the whole answer short
- do not repeat the user's question directly
- do not paraphrase the full question back to them
- do not begin with "you're wondering whether"
- do not begin with "you are deciding whether"
- do not give step-by-step advice
- do not sound like an expert blog
- do not sound like a consultant
- do not use bullet points
- do not use headings
- do not use markdown
- do not overload the user

Stay tightly anchored to the actual question.

Output:
- exactly 2 short paragraphs
- each paragraph must be 1 sentence only
- each sentence should be compact
- plain text only

Structure:
Paragraph 1:
Name the kind of tension or trade-off underneath the question.

Paragraph 2:
Offer one calm lens that helps the user see it more clearly.

For money questions:
Reflect the trade-off first, not the answer.

For career questions:
Reflect the tension first, not the strategy.

For emotional questions:
Stay grounded and simple.
`;

    const toolPrompt =
      toolSlug === "clarity"
        ? "This is the Clarity Tool. Help the user untangle one decision calmly."
        : toolSlug === "overthinking-reset"
          ? "This is the Overthinking Reset Tool. Help the user reduce mental looping."
          : "This is the Decision Filter Tool. Help the user separate what matters from what is just noise.";

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      store: false,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: systemPrompt,
            },
          ],
        },
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: toolPrompt,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: question,
            },
          ],
        },
      ],
    });

    const rawText = response.output_text.trim();

    const reflection = rawText
      .split(/\n\s*\n/)
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(0, 2);

    return NextResponse.json({
      reflection: reflection.length > 0 ? reflection : [rawText],
      followUpPrompts: [],
      relatedToolSlug: "clarity",
      matchedContext: "solace-reflection",
      state: "ready_for_next_question",
      needsClarification: false,
      previousResponseId: response.id,
      isCrisisFallback: false,
    });
  } catch (error: unknown) {
    const err =
      error instanceof Error
        ? error
        : new Error(typeof error === "string" ? error : "Unknown error");

    console.error("Reflect route failed:", err);

    const isMissingKey = err.message.includes("OPENAI_API_KEY is missing");

    return NextResponse.json(
      {
        error: isMissingKey
          ? "OPENAI_API_KEY is missing from the server environment."
          : "OpenAI request failed.",
        details: err.message,
      },
      { status: 500 },
    );
  }
}