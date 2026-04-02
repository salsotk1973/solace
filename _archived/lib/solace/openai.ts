import type { OpenAIResponsesApiResult } from "./types";

type CreateSolaceResponseParams = {
  system: string;
  context: string;
  user: string;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function extractOutputText(data: OpenAIResponsesApiResult): string {
  if (typeof data.output_text === "string" && data.output_text.trim().length > 0) {
    return data.output_text.trim();
  }

  const textParts: string[] = [];

  for (const item of data.output ?? []) {
    for (const content of item.content ?? []) {
      if (typeof content.text === "string" && content.text.trim().length > 0) {
        textParts.push(content.text.trim());
      }
    }
  }

  return textParts.join("\n").trim();
}

export async function createSolaceResponse(
  params: CreateSolaceResponseParams
): Promise<string> {
  const apiKey = getRequiredEnv("OPENAI_API_KEY");
  const model = getRequiredEnv("OPENAI_MODEL");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: params.system,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `${params.context}\n\n${params.user}`,
            },
          ],
        },
      ],
    }),
  });

  const data = (await response.json()) as OpenAIResponsesApiResult;

  if (!response.ok) {
    const message =
      data?.error?.message || "OpenAI request failed while generating a Solace response.";
    throw new Error(message);
  }

  const text = extractOutputText(data);

  if (!text) {
    throw new Error("OpenAI returned an empty Solace response.");
  }

  return text;
}