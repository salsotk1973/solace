export type IntentCategory =
  | "decision_dilemma"
  | "rumination_loop"
  | "priority_conflict"
  | "emotional_overload"
  | "unclear";

export type IntentDetectionResult = {
  category: IntentCategory;
  confidence: number;
};

export function detectIntent(question: string): IntentDetectionResult {
  const q = question.toLowerCase();

  if (
    q.includes("should i") ||
    q.includes("do i stay") ||
    q.includes("do i leave") ||
    q.includes("which option") ||
    q.includes("decide")
  ) {
    return { category: "decision_dilemma", confidence: 0.9 };
  }

  if (
    q.includes("keep thinking") ||
    q.includes("can't stop thinking") ||
    q.includes("replaying") ||
    q.includes("overthinking") ||
    q.includes("loop")
  ) {
    return { category: "rumination_loop", confidence: 0.88 };
  }

  if (
    q.includes("too many factors") ||
    q.includes("everything feels noisy") ||
    q.includes("what matters most") ||
    q.includes("too much") ||
    q.includes("overwhelmed")
  ) {
    return { category: "priority_conflict", confidence: 0.85 };
  }

  if (
    q.includes("emotionally heavy") ||
    q.includes("everything feels overwhelming") ||
    q.includes("i feel heavy") ||
    q.includes("i feel lost")
  ) {
    return { category: "emotional_overload", confidence: 0.8 };
  }

  return { category: "unclear", confidence: 0.45 };
}