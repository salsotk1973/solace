"use client";

import { useCallback, useMemo, useState } from "react";
import {
  getBubbleOrderMap,
  getPrimaryThought,
  submitClearYourMindThoughts,
} from "./client";

export function useClearYourMind() {
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const primaryThought = useMemo(() => {
    return getPrimaryThought(thoughts);
  }, [thoughts]);

  const orderedThoughts = useMemo(() => {
    const orderMap = getBubbleOrderMap(thoughts);
    return [...thoughts].sort((a, b) => orderMap[b] - orderMap[a]);
  }, [thoughts]);

  const addThought = useCallback((thought: string) => {
    if (!thought.trim()) return;
    setThoughts((prev) => [...prev, thought.trim()]);
  }, []);

  const removeThought = useCallback((index: number) => {
    setThoughts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearAll = useCallback(() => {
    setThoughts([]);
    setResult(null);
  }, []);

  const submit = useCallback(async () => {
    if (thoughts.length === 0) return;

    const response = await submitClearYourMindThoughts(thoughts);
    setResult(response);
  }, [thoughts]);

  return {
    thoughts,
    orderedThoughts,
    primaryThought,
    result,
    addThought,
    removeThought,
    clearAll,
    submit,
  };
}