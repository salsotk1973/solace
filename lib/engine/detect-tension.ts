export type TensionContext =
  | "career"
  | "relationship"
  | "place"
  | "identity"
  | "money"
  | "overthinking"
  | "noise"
  | "general";

export type TensionDetectionResult = {
  primary: string;
  secondary: string | null;
  context: TensionContext;
  anchors: string[];
};

type Rule = {
  id: string;
  context: TensionContext;
  primary: string;
  secondary?: string | null;
  anchors: string[];
  score: (q: string) => number;
};

function includesAny(q: string, phrases: string[]) {
  return phrases.some((phrase) => q.includes(phrase));
}

function countAny(q: string, phrases: string[]) {
  return phrases.reduce((count, phrase) => count + (q.includes(phrase) ? 1 : 0), 0);
}

const careerWords = [
  "job",
  "work",
  "career",
  "quit",
  "leave my job",
  "stay in my job",
  "salary",
  "pay",
  "boss",
  "promotion",
  "role",
  "company",
  "burnout",
  "office",
  "profession",
  "don't like what i do",
  "dont like what i do",
  "hate my job",
  "unhappy at work",
];

const placeWords = [
  "move",
  "relocate",
  "stay in",
  "live in",
  "country",
  "city",
  "town",
  "suburb",
  "colombia",
  "australia",
  "england",
  "melbourne",
  "sydney",
  "europe",
  "where to live",
];

const relationshipWords = [
  "marriage",
  "married",
  "single",
  "wife",
  "husband",
  "partner",
  "boyfriend",
  "girlfriend",
  "relationship",
  "break up",
  "divorce",
  "dating",
];

const moneyWords = [
  "money",
  "pay",
  "salary",
  "income",
  "financial",
  "mortgage",
  "rent",
  "afford",
  "expensive",
  "cheap",
  "cost",
  "savings",
  "debt",
];

const overthinkingWords = [
  "overthinking",
  "can't stop thinking",
  "cant stop thinking",
  "loop",
  "spiral",
  "same thought",
  "again and again",
  "obsessing",
  "ruminating",
  "rumination",
];

const noiseWords = [
  "too much",
  "overwhelmed",
  "overwhelm",
  "noisy",
  "noise",
  "clutter",
  "everything at once",
  "too many options",
  "too many things",
  "pressure",
  "confused",
];

const identityWords = [
  "who i am",
  "version of my life",
  "identity",
  "purpose",
  "meaning",
  "direction",
  "aligned",
  "alignment",
  "values",
  "what matters",
];

const rules: Rule[] = [
  {
    id: "career-dissatisfaction",
    context: "career",
    primary: "career dissatisfaction versus financial safety",
    secondary: "staying can feel secure while slowly costing meaning",
    anchors: ["job", "quit", "pay", "don't like what i do"],
    score: (q) => {
      let score = countAny(q, careerWords) * 4;
      if (includesAny(q, ["quit", "leave my job", "stay in my job"])) score += 6;
      if (includesAny(q, ["pay", "salary", "money"])) score += 4;
      if (includesAny(q, ["don't like what i do", "dont like what i do", "hate my job", "unhappy at work"])) score += 8;
      return score;
    },
  },
  {
    id: "place-direction",
    context: "place",
    primary: "place choice and life direction",
    secondary: "location can carry belonging, identity, and future direction",
    anchors: ["move", "city", "country"],
    score: (q) => {
      let score = countAny(q, placeWords) * 4;
      if (includesAny(q, ["move", "relocate", "where to live"])) score += 6;
      return score;
    },
  },
  {
    id: "relationship-commitment",
    context: "relationship",
    primary: "relationship commitment and emotional direction",
    secondary: "the question may carry attachment, fear, and future identity",
    anchors: ["relationship", "marriage", "partner"],
    score: (q) => {
      let score = countAny(q, relationshipWords) * 4;
      if (includesAny(q, ["married", "marriage", "single", "relationship"])) score += 6;
      return score;
    },
  },
  {
    id: "overthinking-loop",
    context: "overthinking",
    primary: "mental looping and unresolved uncertainty",
    secondary: "the mind may be circling because something still feels unclosed",
    anchors: ["loop", "overthinking", "same thought"],
    score: (q) => {
      let score = countAny(q, overthinkingWords) * 5;
      if (includesAny(q, ["can't stop thinking", "cant stop thinking", "same thought"])) score += 7;
      return score;
    },
  },
  {
    id: "noise-overload",
    context: "noise",
    primary: "too many inputs competing at once",
    secondary: "clarity may need less pressure before it needs more analysis",
    anchors: ["too much", "overwhelmed", "pressure"],
    score: (q) => {
      let score = countAny(q, noiseWords) * 4;
      if (includesAny(q, ["too many options", "everything at once", "overwhelmed"])) score += 6;
      return score;
    },
  },
  {
    id: "money-meaning",
    context: "money",
    primary: "financial safety versus personal fit",
    secondary: "security can be real without being enough",
    anchors: ["money", "salary", "afford"],
    score: (q) => {
      let score = countAny(q, moneyWords) * 3;
      if (includesAny(q, ["money", "salary", "afford"])) score += 3;
      return score;
    },
  },
  {
    id: "identity-direction",
    context: "identity",
    primary: "identity direction and values alignment",
    secondary: "the real question may be about who you are becoming",
    anchors: ["identity", "purpose", "aligned"],
    score: (q) => {
      let score = countAny(q, identityWords) * 4;
      if (includesAny(q, ["who i am", "purpose", "values"])) score += 5;
      return score;
    },
  },
];

export function detectTension(question: string): TensionDetectionResult {
  const q = question.toLowerCase().trim();

  const scored = rules
    .map((rule) => ({
      rule,
      score: rule.score(q),
    }))
    .sort((a, b) => b.score - a.score);

  const winner = scored[0];

  if (!winner || winner.score <= 0) {
    return {
      primary: "competing priorities that do not yet feel clearly separated",
      secondary: "the question may need one calmer layer at a time",
      context: "general",
      anchors: [],
    };
  }

  const runnerUp = scored[1];
  const secondary =
    runnerUp && runnerUp.score >= Math.max(6, winner.score * 0.55)
      ? runnerUp.rule.primary
      : winner.rule.secondary ?? null;

  return {
    primary: winner.rule.primary,
    secondary,
    context: winner.rule.context,
    anchors: winner.rule.anchors.filter((anchor) => q.includes(anchor)),
  };
}