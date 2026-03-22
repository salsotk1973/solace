import { detectTension } from "./detect-tension";

export type SolaceState =
  | "new_question"
  | "awaiting_clarification"
  | "clarification_received";

export type ComposeResponseResult = {
  reflection: string[];
  followUpPrompts: string[];
  relatedToolSlug: string;
  matchedContext: string;
  state: SolaceState;
  needsClarification: boolean;
};

function cleanQuestion(question: string) {
  return question.trim().replace(/\s+/g, " ");
}

function lower(question: string) {
  return cleanQuestion(question).toLowerCase();
}

function hasAny(text: string, phrases: string[]) {
  return phrases.some((phrase) => text.includes(phrase));
}

function buildCareerResponse(q: string): ComposeResponseResult {
  if (
    hasAny(q, ["pay is good", "good pay", "good salary", "salary is good"]) &&
    hasAny(q, [
      "don't like what i do",
      "dont like what i do",
      "hate my job",
      "unhappy at work",
      "don't enjoy it",
      "dont enjoy it",
    ])
  ) {
    return {
      reflection: [
        "This feels like a pull between financial safety and the cost of staying in work that no longer feels right.",
        "Good pay can keep a role looking sensible on paper, even while it keeps taking energy from you.",
        "The clearer question may be what matters more right now: protecting stability or protecting yourself.",
      ],
      followUpPrompts: [
        "Money matters more right now",
        "Meaning matters more right now",
        "I’m trying to balance both",
      ],
      relatedToolSlug: "decision-filter",
      matchedContext: "career",
      state: "awaiting_clarification",
      needsClarification: true,
    };
  }

  return {
    reflection: [
      "This feels less like a job question and more like a question about what this role is quietly costing you.",
      "Sometimes work becomes heavy not because it is objectively wrong, but because it no longer fits the person you are now.",
      "The next useful step may be to name what matters most here: stability, energy, or direction.",
    ],
    followUpPrompts: [
      "Stability matters more right now",
      "Energy matters more right now",
      "Long-term direction matters more right now",
    ],
    relatedToolSlug: "decision-filter",
    matchedContext: "career",
    state: "awaiting_clarification",
    needsClarification: true,
  };
}

function buildPlaceResponse(): ComposeResponseResult {
  return {
    reflection: [
      "This feels bigger than geography alone.",
      "Place decisions often carry belonging, identity, and future direction all at once, which is why they can feel so heavy.",
      "The next useful step may be to name what matters most here: belonging, practicality, or the life you want next.",
    ],
    followUpPrompts: [
      "Belonging matters more",
      "Practicality matters more",
      "Future direction matters more",
    ],
    relatedToolSlug: "decision-filter",
    matchedContext: "place",
    state: "awaiting_clarification",
    needsClarification: true,
  };
}

function buildRelationshipResponse(): ComposeResponseResult {
  return {
    reflection: [
      "This feels like more than a surface choice.",
      "Relationship decisions usually feel heavy because attachment, identity, and future all start pressing at once.",
      "The next useful step may be to name what matters most here: emotion, practicality, or where this leads.",
    ],
    followUpPrompts: [
      "The emotional side matters more",
      "The practical side matters more",
      "The future matters more",
    ],
    relatedToolSlug: "decision-filter",
    matchedContext: "relationship",
    state: "awaiting_clarification",
    needsClarification: true,
  };
}

function buildOverthinkingResponse(): ComposeResponseResult {
  return {
    reflection: [
      "This feels like a question your mind has not been able to settle yet.",
      "When something keeps circling, it is often because the real tension underneath it still has not been named clearly enough.",
      "The next useful step may be to name what kind of pressure this really is: emotional, practical, or both.",
    ],
    followUpPrompts: [
      "It feels emotional",
      "It feels practical",
      "It feels like both",
    ],
    relatedToolSlug: "clarity",
    matchedContext: "overthinking",
    state: "awaiting_clarification",
    needsClarification: true,
  };
}

function buildNoiseResponse(): ComposeResponseResult {
  return {
    reflection: [
      "This feels like several pressures arriving at once.",
      "When everything gets loud at the same time, the mind often loses its sense of where to begin.",
      "The next useful step may be to name the main kind of pressure here: options, emotions, or weight from too many things at once.",
    ],
    followUpPrompts: [
      "Too many options",
      "Too much pressure",
      "Too many emotions at once",
    ],
    relatedToolSlug: "clarity",
    matchedContext: "noise",
    state: "awaiting_clarification",
    needsClarification: true,
  };
}

function buildGeneralResponse(question: string): ComposeResponseResult {
  return {
    reflection: [
      `This feels like more than a simple decision: ${cleanQuestion(question)}`,
      "The weight here may be coming less from the options themselves and more from what each one represents underneath.",
      "The next useful step may be to name what matters most here: the emotional side, the practical side, or something you have not fully named yet.",
    ],
    followUpPrompts: [
      "The emotional side matters more",
      "The practical side matters more",
      "I’m not sure yet",
    ],
    relatedToolSlug: "decision-filter",
    matchedContext: "general",
    state: "awaiting_clarification",
    needsClarification: true,
  };
}

function buildClarificationResponse(
  originalQuestion: string,
  clarification: string,
  context: string,
): ComposeResponseResult {
  const answer = lower(clarification);

  if (context === "career") {
    if (hasAny(answer, ["money", "pay", "salary", "stability"])) {
      return {
        reflection: [
          "That makes sense. Financial stability feels central here.",
          "So the real question may be less about whether the job is ideal, and more about how much dissatisfaction is sustainable while you still need that stability.",
          "The next useful step may be to ask what feels temporary here, and what is starting to cost too much of you.",
        ],
        followUpPrompts: [],
        relatedToolSlug: "decision-filter",
        matchedContext: "career",
        state: "clarification_received",
        needsClarification: false,
      };
    }

    if (hasAny(answer, ["meaning", "energy", "direction"])) {
      return {
        reflection: [
          "That helps. The deeper weight here seems to be whether your work still fits the life you want.",
          "When meaning matters more, staying in the wrong role can become expensive in ways that do not show up on paper.",
          "The next useful step may be to ask whether you need a full exit now, or a clearer path out over time.",
        ],
        followUpPrompts: [],
        relatedToolSlug: "decision-filter",
        matchedContext: "career",
        state: "clarification_received",
        needsClarification: false,
      };
    }

    return {
      reflection: [
        "That makes sense. This feels like a real balance between financial safety and personal fit.",
        "So the question may be less about staying or leaving blindly, and more about how to reduce the cost of staying while preparing a better direction.",
        "The next useful step may be to ask what would make change feel grounded rather than reactive.",
      ],
      followUpPrompts: [],
      relatedToolSlug: "decision-filter",
      matchedContext: "career",
      state: "clarification_received",
      needsClarification: false,
    };
  }

  return {
    reflection: [
      "That helps narrow it.",
      "Now the real tension feels easier to see, which usually makes the next step feel less foggy.",
      "The next useful step may be to keep following the part that feels most true, most alive, or hardest to ignore.",
    ],
    followUpPrompts: [],
    relatedToolSlug: "clarity",
    matchedContext: context,
    state: "clarification_received",
    needsClarification: false,
  };
}

export function composeResponse(
  question: string,
  options?: {
    previousQuestion?: string;
    previousContext?: string;
    isClarification?: boolean;
  },
): ComposeResponseResult {
  const clean = cleanQuestion(question);

  if (options?.isClarification && options.previousQuestion) {
    return buildClarificationResponse(
      options.previousQuestion,
      clean,
      options.previousContext ?? "general",
    );
  }

  const tension = detectTension(clean);

  switch (tension.context) {
    case "career":
      return buildCareerResponse(lower(clean));
    case "place":
      return buildPlaceResponse();
    case "relationship":
      return buildRelationshipResponse();
    case "overthinking":
      return buildOverthinkingResponse();
    case "noise":
      return buildNoiseResponse();
    default:
      return buildGeneralResponse(clean);
  }
}