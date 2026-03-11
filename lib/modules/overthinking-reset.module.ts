export const overthinkingResetModule = {
  id: "overthinking-reset",
  purpose: "Help users step out of repetitive thought loops.",
  detects: [
    "rumination_loop",
    "conversation_replay",
    "future_projection",
    "second_guessing",
  ],
  tensionPatterns: [
    "certainty_vs_uncertainty",
    "control_vs_acceptance",
    "signal_vs_repetition",
  ],
  preferredStrategies: [
    "loop_identification",
    "narrowing_focus",
    "mental_decompression",
  ],
  clarificationQuestions: [
    "What thought keeps replaying most often?",
    "What part of this still feels unresolved?",
    "Are you trying to solve something, or trying to feel certain?",
  ],
  recoveryPrompts: [
    "Focus on the repeated thought",
    "Focus on what is unresolved",
    "This feels more emotional than mental",
  ],
} as const;