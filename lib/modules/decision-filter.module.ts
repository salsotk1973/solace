export const decisionFilterModule = {
  id: "decision-filter",
  purpose: "Help users sort essential factors from noise and pressure.",
  detects: [
    "priority_conflict",
    "too_many_factors",
    "overwhelm",
    "external_pressure",
  ],
  tensionPatterns: [
    "essential_vs_nonessential",
    "important_vs_urgent",
    "internal_values_vs_external_pressure",
    "signal_vs_noise",
  ],
  preferredStrategies: [
    "frame_reduction",
    "factor_sorting",
    "priority_narrowing",
  ],
  clarificationQuestions: [
    "What are the main factors competing here?",
    "Which factor feels truly essential?",
    "What might be important, but not actually decisive?",
  ],
  recoveryPrompts: [
    "Focus on what matters most",
    "Focus on external pressure",
    "There are too many competing factors",
  ],
} as const;