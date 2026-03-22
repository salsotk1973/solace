"use client";

import { useCallback, useMemo, useState } from "react";
import { submitClearYourMindThoughts } from "./client";

function scoreThought(text: string): number {
  const q = text.trim().toLowerCase();

  let score = 0;
  score += Math.min(q.length, 80);

  const weightedPatterns: Array<[RegExp, number]> = [
    [/\b(lost my job|lose my job|unemployed|laid off|fired|not working|out of work)\b/i, 60],
    [/\b(bills?|rent|mortgage|debt|loan|money|financial|not enough money|broke)\b/i, 40],
    [/\b(pregnant|baby|wife pregnant|partner pregnant|children|kids|family)\b/i, 32],
    [/\b(work|workload|deadline|too much work|office|career|boss)\b/i, 28],
    [/\b(mother in law|mother-in-law|noisy neighbours|noisy neighbors|noise|home tension)\b/i, 26],
    [/\b(sick|ill|doctor|hospital|anxiety|panic|stress|exhausted|tired)\b/i, 22],
    [/\b(car broken|broken car|repair|house broken|mess|dirty house)\b/i, 18],
  ];

  for (const [pattern, weight] of weightedPatterns) {
    if (pattern.test(q)) {
      score += weight;
    }
  }

  return score;
}

function buildOrderMap(thoughts: string[]): Record<string, number> {
  return thoughts.reduce<Record<string, number>>((acc, thought) => {
    acc[thought] = scoreThought(thought);
    return acc;
  }, {});
}

function pickPrimaryThought(thoughts: string[]): string | null {
  if (thoughts.length === 0) return null;

  return [...thoughts].sort((a, b) => scoreThought(b) - scoreThought(a))[0] ?? null;
}

export function useClearYourMind() {
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [result, setResult] = useState<unknown>(null);

  const primaryThought = useMemo(() => {
    return pickPrimaryThought(thoughts);
  }, [thoughts]);

  const orderedThoughts = useMemo(() => {
    const orderMap = buildOrderMap(thoughts);
    return [...thoughts].sort((a, b) => (orderMap[b] ?? 0) - (orderMap[a] ?? 0));
  }, [thoughts]);

  const addThought = useCallback((thought: string) => {
    const clean = thought.trim();
    if (!clean) return;

    setThoughts((prev) => [...prev, clean]);
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

    const response = await submitClearYourMindThoughts(
      thoughts.map((text, index) => ({
        id: `thought-${index + 1}`,
        text,
      })),
    );

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