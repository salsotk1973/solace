import { NextResponse } from "next/server";
import { evaluateClearYourMind } from "@/lib/solace/clear-your-mind/engine";
import { classifySafetyThoughts } from "@/lib/solace/safety/classify";
import { ClearYourMindInput } from "@/lib/solace/clear-your-mind/types";

type ThoughtLike =
  | string
  | {
      id?: string;
      text?: string;
    };

type NormalizedThought = {
  id: string;
  text: string;
};

function normalizeThoughts(value: unknown): NormalizedThought[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index): NormalizedThought | null => {
      if (typeof item === "string") {
        const text = item.trim();
        if (!text) return null;

        return {
          id: `thought-${index + 1}`,
          text,
        };
      }

      if (item && typeof item === "object" && typeof item.text === "string") {
        const text = item.text.trim();
        if (!text) return null;

        return {
          id:
            typeof item.id === "string" && item.id.trim().length > 0
              ? item.id.trim()
              : `thought-${index + 1}`,
          text,
        };
      }

      return null;
    })
    .filter((item): item is NormalizedThought => item !== null)
    .slice(0, 7);
}

function buildCrisisFallback(message: string) {
  return {
    ok: true,
    isCrisisFallback: true,
    clarityFallback: false,
    title: "Take a moment",
    message,
  };
}

function isEmergencyBreathingRisk(thoughts: string[]): boolean {
  const text = thoughts.join(" ").toLowerCase();

  return (
    /\bnot breathing\b/.test(text) ||
    /\bno breathing\b/.test(text) ||
    /\bisn't breathing\b/.test(text) ||
    /\bisnt breathing\b/.test(text) ||
    /\bcan't breathe\b/.test(text) ||
    /\bcant breathe\b/.test(text) ||
    /\bnot able to breathe\b/.test(text) ||
    /\bdifficult breathing\b/.test(text) ||
    /\btrouble breathing\b/.test(text) ||
    /\bshortness of breath\b/.test(text) ||
    /\bstruggling to breathe\b/.test(text) ||
    /\bhard to breathe\b/.test(text) ||
    /\bstop breathing\b/.test(text)
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ClearYourMindInput> & {
      thoughts?: ThoughtLike[];
    };

    const normalizedThoughts = normalizeThoughts(body?.thoughts);
    const thoughtTexts = normalizedThoughts.map((item) => item.text);

    const input: ClearYourMindInput = {
      thoughts: normalizedThoughts,
    };

    if (normalizedThoughts.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please add at least one thought first.",
        },
        { status: 400 },
      );
    }

    if (isEmergencyBreathingRisk(thoughtTexts)) {
      return NextResponse.json(
        buildCrisisFallback(
          "This sounds urgent and needs real-world help right now. Please contact emergency services or immediate local support right now.",
        ),
        { status: 200 },
      );
    }

    const safety = classifySafetyThoughts(
      thoughtTexts.map((text) => ({ text })),
    );

    if (safety.mode === "support") {
      return NextResponse.json(
        buildCrisisFallback(
          "It sounds like you may be going through something very difficult.\n\nSolace is not equipped for crisis support.\n\nPlease reach out to a trusted person or a qualified professional who can support you right now.",
        ),
        { status: 200 },
      );
    }

    // IMPORTANT: evaluateClearYourMind is async, so this must be awaited
    const result = await evaluateClearYourMind(input);

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