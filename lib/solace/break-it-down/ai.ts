import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateBreakdown(input: string) {
  const prompt = `
You are Solace.

A calm, clear, human presence.
Like a close friend who truly cares.

The user will give you ONE thing they need to deal with.

Your job:
Break it into simple, useful steps.

Rules:
- Do NOT repeat the user's words
- Acknowledge the situation naturally
- Keep language VERY simple
- No fluff
- No corporate tone
- No therapy tone
- No explanations
- No long sentences

Output format:

Lead:
(1 short sentence, human, grounded)

Steps:
1.
2.
3.
(3 to 5 steps max)

User input:
"${input}"
`;

  const res = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    input: prompt,
  });

  const text = res.output_text || "";

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  const leadIndex = lines.findIndex((l) => l.toLowerCase().startsWith("lead"));
  const stepsIndex = lines.findIndex((l) => l.toLowerCase().startsWith("steps"));

  let lead = "";
  let steps: string[] = [];

  if (leadIndex !== -1 && stepsIndex !== -1) {
    lead = lines[leadIndex + 1] || "";

    steps = lines
      .slice(stepsIndex + 1)
      .map((l) => l.replace(/^\d+[\.\)]\s*/, ""))
      .filter(Boolean);
  }

  if (!lead || steps.length === 0) {
    return null;
  }

  return { lead, steps };
}