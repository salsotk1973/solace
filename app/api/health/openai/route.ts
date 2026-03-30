import { NextResponse } from "next/server";

export async function GET() {
  const checkedAt = new Date().toISOString();
  const model = process.env.OPENAI_MODEL || "gpt-4o";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8_000);

  const start = Date.now();

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        input: "ping",
        max_output_tokens: 16,
      }),
    });

    clearTimeout(timeoutId);

    const latencyMs = Date.now() - start;

    if (!response.ok) {
      const errorText = await response.text().catch(() => String(response.status));
      console.error("[OpenAI Health] DOWN:", errorText);
      return NextResponse.json(
        { status: "down", error: errorText, checked_at: checkedAt },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { status: "ok", latency_ms: latencyMs, checked_at: checkedAt },
      { status: 200 },
    );
  } catch (err) {
    clearTimeout(timeoutId);

    const isTimeout = err instanceof Error && err.name === "AbortError";
    const message = isTimeout ? "timeout" : err instanceof Error ? err.message : "unknown error";

    console.error("[OpenAI Health] DOWN:", message);

    return NextResponse.json(
      { status: "down", error: message, checked_at: checkedAt },
      { status: 200 },
    );
  }
}
