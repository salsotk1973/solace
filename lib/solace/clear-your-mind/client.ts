// lib/solace/clear-your-mind/client.ts

export type SubmitThought = {
  id: string;
  text: string;
};

export type ClearYourMindClientResult =
  | {
      ok: true;
      text: string;
      isCrisisFallback: boolean;
      clarityFallback: boolean;
      thoughts?: Array<{
        id: string;
        text: string;
        importance: {
          total: number;
        };
      }>;
    }
  | {
      ok: false;
      error: string;
    };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function submitClearYourMindThoughts(
  thoughts: SubmitThought[],
): Promise<ClearYourMindClientResult> {
  try {
    const res = await fetch("/api/solace/clear-your-mind", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ thoughts }),
    });

    const data: unknown = await res.json();

    // 🚨 Basic shape check
    if (!isObject(data)) {
      return {
        ok: false,
        error: "Invalid response from Solace.",
      };
    }

    if (data.ok === false) {
      return {
        ok: false,
        error:
          typeof data.error === "string"
            ? data.error
            : "Something went wrong. Please try again.",
      };
    }

    if (data.ok !== true) {
      return {
        ok: false,
        error: "Invalid response from Solace.",
      };
    }

    // 🟢 CASE 1 — CRISIS
    if (data.isCrisisFallback === true) {
      const title = typeof data.title === "string" ? data.title : "";
      const message = typeof data.message === "string" ? data.message : "";

      if (!message) {
        return {
          ok: false,
          error: "The crisis response was not in the expected format.",
        };
      }

      return {
        ok: true,
        text: [title, message].filter(Boolean).join("\n\n"),
        isCrisisFallback: true,
        clarityFallback: false,
      };
    }

    // 🟡 CASE 2 — CLARITY
    if (data.clarityFallback === true) {
      const title = typeof data.title === "string" ? data.title : "";
      const message = typeof data.message === "string" ? data.message : "";

      if (!message) {
        return {
          ok: false,
          error: "The clarity response was not in the expected format.",
        };
      }

      return {
        ok: true,
        text: [title, message].filter(Boolean).join("\n\n"),
        isCrisisFallback: false,
        clarityFallback: true,
      };
    }

    // 🟢 CASE 3 — NORMAL REFLECTION
    if (isObject(data.reflection)) {
      const reflection = data.reflection;

      const title =
        typeof reflection.title === "string" ? reflection.title : "";

      const summary =
        typeof reflection.summary === "string" ? reflection.summary : "";

      let recognition = "";
      let untangling = "";
      let gentleFrame = "";

      if (isObject(reflection.structure)) {
        recognition =
          typeof reflection.structure.recognition === "string"
            ? reflection.structure.recognition
            : "";

        untangling =
          typeof reflection.structure.untangling === "string"
            ? reflection.structure.untangling
            : "";

        gentleFrame =
          typeof reflection.structure.gentleFrame === "string"
            ? reflection.structure.gentleFrame
            : "";
      }

      const parts = [
        title,
        summary,
        recognition,
        untangling,
        gentleFrame,
      ].filter(Boolean);

      if (parts.length === 0) {
        return {
          ok: false,
          error: "The reflection response was not in the expected format.",
        };
      }

      return {
        ok: true,
        text: parts.join("\n\n"),
        isCrisisFallback: false,
        clarityFallback: false,
      };
    }

    // ❌ FINAL FALLBACK
    return {
      ok: false,
      error: "The reflection response was not in the expected format.",
    };
  } catch (error) {
    console.error("Client error:", error);

    return {
      ok: false,
      error: "Something went wrong. Please try again.",
    };
  }
}