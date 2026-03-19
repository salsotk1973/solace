import type {
  ClearYourMindBubbleInput,
  ClearYourMindRequest,
  ClearYourMindResponse,
  ClearYourMindSuccessResponse,
} from "@/lib/solace/clear-your-mind/types";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isThoughtArray(value: unknown): boolean {
  if (!Array.isArray(value)) return false;

  return value.every((item) => {
    if (!isObject(item)) return false;

    const importance = item.importance;
    if (!isObject(importance)) return false;

    return (
      isString(item.id) &&
      isString(item.text) &&
      isString(item.mainCategory) &&
      (item.secondaryCategory === undefined || isString(item.secondaryCategory)) &&
      isBoolean(item.isGibberish) &&
      typeof importance.emotionalWeight === "number" &&
      typeof importance.practicalConsequence === "number" &&
      typeof importance.repetition === "number" &&
      typeof importance.urgency === "number" &&
      typeof importance.total === "number"
    );
  });
}

function isClusterArray(value: unknown): boolean {
  if (!Array.isArray(value)) return false;

  return value.every((item) => {
    if (!isObject(item)) return false;

    return (
      isString(item.category) &&
      typeof item.averageImportance === "number" &&
      Array.isArray(item.thoughtIds) &&
      item.thoughtIds.every(isString)
    );
  });
}

function isClearYourMindResponse(value: unknown): value is ClearYourMindResponse {
  if (!isObject(value)) return false;
  if (!("ok" in value) || !isBoolean(value.ok)) return false;

  if (value.ok === false) {
    return isString(value.error);
  }

  return (
    isString(value.text) &&
    isBoolean(value.isCrisisFallback) &&
    isBoolean(value.clarityFallback) &&
    isThoughtArray(value.thoughts) &&
    isClusterArray(value.clusters)
  );
}

export function normalizeClearYourMindInput(
  thoughts: Array<string | ClearYourMindBubbleInput>,
): ClearYourMindBubbleInput[] {
  return thoughts
    .map((item, index) => {
      if (typeof item === "string") {
        return {
          id: `thought-${index + 1}`,
          text: item.trim(),
        };
      }

      return {
        id: item.id?.trim() || `thought-${index + 1}`,
        text: item.text.trim(),
      };
    })
    .filter((item) => item.text.length > 0)
    .slice(0, 7);
}

export async function submitClearYourMindThoughts(
  thoughts: Array<string | ClearYourMindBubbleInput>,
): Promise<ClearYourMindResponse> {
  const normalizedThoughts = normalizeClearYourMindInput(thoughts);

  if (normalizedThoughts.length === 0) {
    return {
      ok: false,
      error: "Please provide at least one thought.",
    };
  }

  const payload: ClearYourMindRequest = {
    thoughts: normalizedThoughts,
  };

  try {
    const response = await fetch("/api/solace/clear-your-mind", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data: unknown = await response.json();

    if (!isClearYourMindResponse(data)) {
      return {
        ok: false,
        error: "The reflection response was not in the expected format.",
      };
    }

    if (!response.ok && data.ok === false) {
      return data;
    }

    if (!response.ok && data.ok === true) {
      return {
        ok: false,
        error: "The reflection request failed unexpectedly.",
      };
    }

    return data;
  } catch (error) {
    console.error("[solace.clear-your-mind.client]", error);

    return {
      ok: false,
      error: "Unable to reach the reflection service right now.",
    };
  }
}

export function getPrimaryThought(
  response: ClearYourMindSuccessResponse,
) {
  return response.thoughts[0] ?? null;
}

export function getBubbleOrderMap(
  response: ClearYourMindSuccessResponse,
): Record<string, number> {
  return response.thoughts.reduce<Record<string, number>>((acc, thought, index) => {
    acc[thought.id] = index;
    return acc;
  }, {});
}

export function getBubbleImportanceMap(
  response: ClearYourMindSuccessResponse,
): Record<string, number> {
  return response.thoughts.reduce<Record<string, number>>((acc, thought) => {
    acc[thought.id] = thought.importance.total;
    return acc;
  }, {});
}