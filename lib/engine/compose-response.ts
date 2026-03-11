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
        "It sounds like this decision sits between financial safety and the cost of staying in work that no longer feels right.",
        "Good pay can make a role look safe from the outside, but it does not remove the weight of doing something that drains you.",
        "Before trying to solve it all at once, it may help to clarify what matters more right now.",
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
      "It sounds like this question may be less about work alone, and more about what this role is costing you over time.",
      "Sometimes a job becomes hard not because it is objectively bad, but because it no longer fits the person you are becoming.",
      "Before trying to solve it all at once, it may help to clarify what matters more right now.",
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
      "It sounds like this decision may be carrying more than geography.",
      "Place choices often feel heavy because they quietly shape belonging, identity, and the direction of life.",
      "Before going further, it may help to clarify what matters most in this decision.",
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
      "It sounds like this question may be less about one surface choice and more about what each option means emotionally.",
      "Relationship questions often feel heavy because they carry attachment, identity, and future at the same time.",
      "Before going further, it may help to clarify what feels most important right now.",
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
      "It sounds like the mind may still be circling because something important does not yet feel settled.",
      "When a question keeps repeating, it is often because the real tension has not been named clearly enough yet.",
      "Before going further, it may help to name what kind of pressure this is.",
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
      "It sounds like several pressures may be arriving at the same time, making it harder to see what matters most.",
      "When everything feels equally loud, the mind often struggles to decide where to begin.",
      "Before going further, it may help to identify the kind of pressure you are under.",
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
      `It sounds like this question may be carrying more than one layer: ${cleanQuestion(question)}`,
      "Sometimes the weight of a decision comes from what each option represents underneath.",
      "Before going further, it may help to clarify what matters most right now.",
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
  context: string
): ComposeResponseResult {
  const answer = lower(clarification);

  if (context === "career") {
    if (hasAny(answer, ["money", "pay", "salary", "stability"])) {
      return {
        reflection: [
          "That makes sense. Financial stability clearly matters in this decision.",
          "So the real question may not be whether the job is ideal, but how much dissatisfaction is sustainable while protecting the stability you still need.",
          "A useful next step may be to ask what level of dissatisfaction feels temporary, and what level would cost too much of you over time.",
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
          "That helps. It sounds like the deeper issue is not salary alone, but whether your work still feels aligned with the life you want.",
          "When meaning matters more, staying in the wrong role can become expensive in ways that do not appear on paper.",
          "A useful next step may be to ask whether you need to leave immediately, or whether you need a clear transition path out.",
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
        "That makes sense. It sounds like you are trying to balance financial safety with personal fit, rather than choosing one blindly.",
        "That usually means the question is not simply whether to stay or leave, but how to reduce the cost of staying while preparing for a better direction.",
        "A useful next step may be to ask what would make leaving feel realistic rather than impulsive.",
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
      "That helps narrow the question.",
      "Now the real tension feels a little clearer, which usually makes the next step easier to see.",
      "A useful next step may be to keep following the part that feels most alive, true, or costly to ignore.",
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
  }
): ComposeResponseResult {
  const clean = cleanQuestion(question);

  if (options?.isClarification && options.previousQuestion) {
    return buildClarificationResponse(
      options.previousQuestion,
      clean,
      options.previousContext ?? "general"
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