"use client";

import { useCallback, useMemo, useState } from "react";
import {
  getBubbleImportanceMap,
  getBubbleOrderMap,
  getPrimaryThought,
  submitClearYourMindThoughts,
} from "@/lib/solace/clear-your-mind/client";
import type {
  ClearYourMindBubbleInput,
  ClearYourMindSuccessResponse,
} from "@/lib/solace/clear-your-mind/types";

export type ClearYourMindUiBubble = {
  id: string;
  text: string;
};

export type ClearYourMindPhase =
  | "idle"
  | "collecting"
  | "processing"
  | "resolved"
  | "error";

type UseClearYourMindOptions = {
  maxThoughts?: number;
};

type SubmitResult =
  | {
      ok: true;
      response: ClearYourMindSuccessResponse;
    }
  | {
      ok: false;
      error: string;
    };

export function useClearYourMind(options: UseClearYourMindOptions = {}) {
  const maxThoughts = options.maxThoughts ?? 7;

  const [bubbles, setBubbles] = useState<ClearYourMindUiBubble[]>([]);
  const [phase, setPhase] = useState<ClearYourMindPhase>("idle");
  const [reflectionText, setReflectionText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [isCrisisFallback, setIsCrisisFallback] = useState(false);
  const [clarityFallback, setClarityFallback] = useState(false);
  const [lastResponse, setLastResponse] =
    useState<ClearYourMindSuccessResponse | null>(null);

  const canAddMore = bubbles.length < maxThoughts;
  const hasBubbles = bubbles.length > 0;
  const isProcessing = phase === "processing";
  const isResolved = phase === "resolved";

  const bubbleOrderMap = useMemo(() => {
    if (!lastResponse) return {};
    return getBubbleOrderMap(lastResponse);
  }, [lastResponse]);

  const bubbleImportanceMap = useMemo(() => {
    if (!lastResponse) return {};
    return getBubbleImportanceMap(lastResponse);
  }, [lastResponse]);

  const primaryThought = useMemo(() => {
    if (!lastResponse) return null;
    return getPrimaryThought(lastResponse);
  }, [lastResponse]);

  const addThought = useCallback(
    (text: string) => {
      const trimmed = text.trim();

      if (!trimmed) {
        return {
          ok: false as const,
          error: "Please write a thought first.",
        };
      }

      if (isProcessing) {
        return {
          ok: false as const,
          error: "Please wait while Solace finishes reflecting.",
        };
      }

      if (bubbles.length >= maxThoughts) {
        return {
          ok: false as const,
          error: `You can only add up to ${maxThoughts} thoughts.`,
        };
      }

      const nextBubble: ClearYourMindUiBubble = {
        id: crypto.randomUUID(),
        text: trimmed,
      };

      setBubbles((current) => [...current, nextBubble]);
      setPhase("collecting");
      setErrorText("");
      setReflectionText("");
      setIsCrisisFallback(false);
      setClarityFallback(false);
      setLastResponse(null);

      return {
        ok: true as const,
        bubble: nextBubble,
      };
    },
    [bubbles.length, isProcessing, maxThoughts],
  );

  const removeThought = useCallback(
    (id: string) => {
      if (isProcessing) return;

      setBubbles((current) => {
        const next = current.filter((bubble) => bubble.id !== id);

        if (next.length === 0) {
          setPhase("idle");
          setReflectionText("");
          setErrorText("");
          setIsCrisisFallback(false);
          setClarityFallback(false);
          setLastResponse(null);
        } else if (phase !== "resolved") {
          setPhase("collecting");
        }

        return next;
      });
    },
    [isProcessing, phase],
  );

  const clearAllThoughts = useCallback(() => {
    if (isProcessing) return;

    setBubbles([]);
    setPhase("idle");
    setReflectionText("");
    setErrorText("");
    setIsCrisisFallback(false);
    setClarityFallback(false);
    setLastResponse(null);
  }, [isProcessing]);

  const replaceBubblesFromResponse = useCallback(
    (response: ClearYourMindSuccessResponse) => {
      const ordered = response.thoughts.map((thought) => ({
        id: thought.id,
        text: thought.text,
      }));

      setBubbles(ordered);
    },
    [],
  );

  const submitThoughts = useCallback(async (): Promise<SubmitResult> => {
    if (isProcessing) {
      return {
        ok: false,
        error: "Reflection already in progress.",
      };
    }

    if (bubbles.length === 0) {
      setPhase("error");
      setErrorText("Please add at least one thought.");
      return {
        ok: false,
        error: "Please add at least one thought.",
      };
    }

    setPhase("processing");
    setErrorText("");
    setReflectionText("");
    setIsCrisisFallback(false);
    setClarityFallback(false);

    const payload: ClearYourMindBubbleInput[] = bubbles.map((bubble) => ({
      id: bubble.id,
      text: bubble.text,
    }));

    const result = await submitClearYourMindThoughts(payload);

    if (!result.ok) {
      setPhase("error");
      setErrorText(result.error);

      return {
        ok: false,
        error: result.error,
      };
    }

    setLastResponse(result);
    setReflectionText(result.text);
    setIsCrisisFallback(result.isCrisisFallback);
    setClarityFallback(result.clarityFallback);
    replaceBubblesFromResponse(result);
    setPhase("resolved");

    return {
      ok: true,
      response: result,
    };
  }, [bubbles, isProcessing, replaceBubblesFromResponse]);

  const getBubbleImportance = useCallback(
    (id: string) => {
      return bubbleImportanceMap[id] ?? null;
    },
    [bubbleImportanceMap],
  );

  const getBubbleOrder = useCallback(
    (id: string) => {
      return bubbleOrderMap[id] ?? null;
    },
    [bubbleOrderMap],
  );

  const getResolvedBubbleScale = useCallback(
    (id: string) => {
      const score = bubbleImportanceMap[id];

      if (typeof score !== "number") return 1;

      if (score >= 75) return 1.26;
      if (score >= 60) return 1.18;
      if (score >= 45) return 1.1;
      if (score >= 30) return 1.02;
      return 0.94;
    },
    [bubbleImportanceMap],
  );

  const getResolvedBubbleTone = useCallback(
    (id: string) => {
      const score = bubbleImportanceMap[id];

      if (typeof score !== "number") return "light";

      if (score >= 75) return "deep";
      if (score >= 55) return "mid";
      return "light";
    },
    [bubbleImportanceMap],
  );

  return {
    bubbles,
    phase,
    reflectionText,
    errorText,
    isProcessing,
    isResolved,
    isCrisisFallback,
    clarityFallback,
    hasBubbles,
    canAddMore,
    maxThoughts,
    primaryThought,
    lastResponse,

    addThought,
    removeThought,
    clearAllThoughts,
    submitThoughts,

    getBubbleImportance,
    getBubbleOrder,
    getResolvedBubbleScale,
    getResolvedBubbleTone,
  };
}