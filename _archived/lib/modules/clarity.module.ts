export const clarityModule = {
  id: "clarity",
  purpose: "Help users untangle difficult decisions and competing values.",
  detects: [
    "decision_dilemma",
    "life_fork",
    "value_conflict",
    "stay_or_leave",
  ],
  tensionPatterns: [
    "security_vs_growth",
    "belonging_vs_opportunity",
    "certainty_vs_possibility",
    "peace_vs_ambition",
    "loyalty_vs_self_direction",
  ],
  preferredStrategies: [
    "clarifying_frame",
    "naming_the_tension",
    "gentle_reframe",
  ],
  clarificationQuestions: [
    "What feels most difficult about this decision right now?",
    "Which trade-off feels hardest to carry?",
    "Is this more about practicality, identity, or emotional cost?",
  ],
  recoveryPrompts: [
    "Focus more on the emotional side",
    "Focus more on the practical side",
    "The core tension is different",
  ],
} as const;