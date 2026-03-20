import { NextResponse } from "next/server";
import type {
  ClearYourMindBubbleInput,
  ClearYourMindClusterResult,
  ClearYourMindImportanceBreakdown,
  ClearYourMindRequest,
  ClearYourMindResponse,
  ClearYourMindThoughtResult,
  SolaceCategory,
} from "@/lib/solace/clear-your-mind/types";

type ProcessedThought = {
  id: string;
  text: string;
  normalizedText: string;
  mainCategory: SolaceCategory;
  secondaryCategory?: SolaceCategory;
  importance: ClearYourMindImportanceBreakdown;
  isGibberish: boolean;
  matchedSignals: string[];
};

type Cluster = {
  category: SolaceCategory;
  thoughts: ProcessedThought[];
  averageImportance: number;
};

const MAX_THOUGHTS = 7;

const CATEGORY_PRIORITY: SolaceCategory[] = [
  "Money / Stability",
  "Relationships / Home Dynamics",
  "Health / Body / Self",
  "Environment / External Noise",
  "Work / Performance",
  "Internal Mental Loops",
  "Logistics / Immediate Problems",
  "Unclear",
];

const CATEGORY_KEYWORDS: Record<
  Exclude<SolaceCategory, "Unclear">,
  { primary: string[] }
> = {
  "Money / Stability": {
    primary: [
      "money",
      "rent",
      "mortgage",
      "debt",
      "loan",
      "loans",
      "bill",
      "bills",
      "overdue",
      "payment",
      "payments",
      "income",
      "salary",
      "wage",
      "wages",
      "budget",
      "afford",
      "affording",
      "financial",
      "finance",
      "cost",
      "costs",
      "expensive",
      "broke",
      "not enough money",
      "need more money",
      "savings",
      "saving",
      "tax",
      "taxes",
      "car broken",
      "car broke",
      "car too old",
    ],
  },
  "Relationships / Home Dynamics": {
    primary: [
      "wife",
      "husband",
      "partner",
      "marriage",
      "relationship",
      "family",
      "home",
      "house",
      "kids",
      "child",
      "children",
      "mother",
      "father",
      "mum",
      "dad",
      "argue",
      "arguing",
      "tension",
      "pregnant",
      "pregnancy",
      "baby",
      "lonely",
      "alone",
      "disconnect",
      "disconnected",
      "nagging",
      "mother in law",
      "mother-in-law",
      "living at home",
      "living with us",
      "family oversea",
      "family overseas",
      "want to leave",
      "hate my partner",
      "wife nagging",
      "distant to me",
      "too distant",
      "people don't need me",
      "people do not need me",
      "nobody needs me",
      "no one needs me",
      "better without me",
      "burden",
      "problem for anyone",
      "problem anymore",
    ],
  },
  "Health / Body / Self": {
    primary: [
      "health",
      "body",
      "sick",
      "ill",
      "doctor",
      "hospital",
      "pain",
      "sleep",
      "tired",
      "fatigue",
      "burnout",
      "anxious",
      "anxiety",
      "panic",
      "stress",
      "stressed",
      "weight",
      "exercise",
      "injury",
      "injured",
      "breathing",
      "breath",
      "breathe",
      "headache",
      "need time off",
      "worthless",
      "no future",
      "don't want to live",
      "do not want to live",
      "don't want to live anymore",
      "do not want to live anymore",
      "stop breathing",
      "stop existing",
      "not be here",
      "should not be here",
      "should have never been born",
      "should've never been born",
      "never be born",
      "never been born",
      "what's the point of living",
      "what is the point of living",
      "why living anyway",
      "why live anyway",
      "why am i alive",
      "i don't matter",
      "i do not matter",
      "better off without me",
      "finish all now",
      "finish all right now",
      "end all for good",
    ],
  },
  "Environment / External Noise": {
    primary: [
      "noise",
      "loud",
      "mess",
      "clutter",
      "chaos",
      "chaotic",
      "crowded",
      "interruptions",
      "interruption",
      "traffic",
      "room",
      "space",
      "environment",
      "surroundings",
      "construction",
      "neighbour",
      "neighbors",
      "neighbours",
      "barking",
      "dog barking",
      "dogs barking",
      "kids playing",
      "kids playing at night",
      "barking at night",
      "annoying kids",
    ],
  },
  "Work / Performance": {
    primary: [
      "work",
      "job",
      "career",
      "boss",
      "deadline",
      "deadlines",
      "meeting",
      "meetings",
      "project",
      "projects",
      "client",
      "performance",
      "pressure",
      "productive",
      "productivity",
      "promotion",
      "office",
      "email",
      "emails",
      "presentation",
      "responsibility",
      "responsibilities",
      "lost my job",
      "lost job",
      "i lost my job",
      "work pressure",
      "workload",
      "hate my boss",
    ],
  },
  "Internal Mental Loops": {
    primary: [
      "overthinking",
      "overthink",
      "thinking",
      "thoughts",
      "mind",
      "loop",
      "loops",
      "spiral",
      "spiralling",
      "spiraling",
      "stuck",
      "can't stop",
      "cannot stop",
      "worry",
      "worried",
      "what if",
      "uncertain",
      "confused",
      "confusion",
      "obsessing",
      "obsessive",
      "ruminating",
      "rumination",
      "loneliness",
      "lonely",
      "worthless",
      "no future",
      "want to leave",
      "hate",
      "what's the point",
      "what is the point",
      "keep going",
      "why living anyway",
      "why live anyway",
      "finish it all",
      "finish all now",
      "finish all right now",
      "done with everything",
      "nobody needs me",
      "no one needs me",
      "problem for anyone anymore",
      "should i end it",
      "should i end all",
      "why me",
    ],
  },
  "Logistics / Immediate Problems": {
    primary: [
      "today",
      "tomorrow",
      "tonight",
      "urgent",
      "asap",
      "late",
      "schedule",
      "scheduled",
      "booking",
      "appointment",
      "pickup",
      "drop off",
      "dropoff",
      "car",
      "train",
      "flight",
      "travel",
      "internet",
      "wifi",
      "broken",
      "fix",
      "replace",
      "delivery",
      "deliver",
      "form",
      "forms",
      "paperwork",
      "call",
      "needs to be fixed",
      "fix up",
      "car broken",
      "my car is broken",
      "my car is not working",
      "car not working",
    ],
  },
};

const EMOTIONAL_KEYWORDS = [
  "overwhelmed",
  "heavy",
  "drained",
  "exhausted",
  "scared",
  "afraid",
  "terrified",
  "panic",
  "anxious",
  "anxiety",
  "stressed",
  "hopeless",
  "ashamed",
  "guilty",
  "hurt",
  "angry",
  "furious",
  "sad",
  "lonely",
  "trapped",
  "breaking",
  "falling apart",
  "can't cope",
  "cannot cope",
  "worthless",
  "no future",
  "hate",
  "done",
  "finished",
  "numb",
  "empty",
  "don't matter",
  "do not matter",
  "nobody needs me",
  "no one needs me",
  "problem for anyone anymore",
  "better without me",
];

const PRACTICAL_KEYWORDS = [
  "rent",
  "mortgage",
  "bill",
  "bills",
  "debt",
  "loan",
  "money",
  "payment",
  "payments",
  "job",
  "deadline",
  "meeting",
  "client",
  "appointment",
  "doctor",
  "hospital",
  "travel",
  "car",
  "legal",
  "contract",
  "food",
  "baby",
  "pregnancy",
  "broken",
  "overdue",
];

const URGENCY_KEYWORDS = [
  "now",
  "today",
  "tonight",
  "tomorrow",
  "urgent",
  "asap",
  "immediately",
  "soon",
  "running out",
  "late",
  "overdue",
  "this week",
  "before",
];

const DIRECT_CRISIS_PATTERNS = [
  /\bkill myself\b/i,
  /\bi want to kill myself\b/i,
  /\bi wanna kill myself\b/i,
  /\bwant to kill myself\b/i,
  /\bend my life\b/i,
  /\bend it all\b/i,
  /\bfinish it all\b/i,
  /\bfinish all now\b/i,
  /\bfinish all right now\b/i,
  /\bfinish everything now\b/i,
  /\bshould i end it\b/i,
  /\bshould i end all\b/i,
  /\bshould i end all for good\b/i,
  /\bdon'?t want to live\b/i,
  /\bdo not want to live\b/i,
  /\bdon'?t want to live anymore\b/i,
  /\bdo not want to live anymore\b/i,
  /\bwant to die\b/i,
  /\bi should die\b/i,
  /\bi wish i was dead\b/i,
  /\bi wish i were dead\b/i,
  /\bsuicide\b/i,
  /\bself harm\b/i,
  /\bhurt myself\b/i,
  /\bcut myself\b/i,
  /\boverdose\b/i,
  /\bno reason to live\b/i,
  /\bcan'?t go on\b/i,
  /\bcannot go on\b/i,
  /\bworthless\b/i,
  /\bno future\b/i,
  /\bstop breathing\b/i,
  /\bi want to stop breathing\b/i,
  /\bi do not want to breathe anymore\b/i,
  /\bi do not want to breath anymore\b/i,
  /\bi dont want to breathe anymore\b/i,
  /\bi dont want to breath anymore\b/i,
  /\bshould have never been born\b/i,
  /\bshould've never been born\b/i,
  /\bshould never have been born\b/i,
  /\bnever be born\b/i,
  /\bbetter off dead\b/i,
  /\bbetter off without me\b/i,
  /\bthey will be better without me\b/i,
  /\bpeople don'?t need me\b/i,
  /\bnobody needs me\b/i,
  /\bno one needs me\b/i,
  /\bi won'?t be a problem\b/i,
  /\bi would not be a problem\b/i,
  /\bwhat'?s the point of living\b/i,
  /\bwhat is the point of living\b/i,
  /\bwhat'?s the point in keep going\b/i,
  /\bwhat is the point in keep going\b/i,
  /\bwhat'?s the point of keep going\b/i,
  /\bwhat is the point of keep going\b/i,
  /\bwhat'?s the point in going on\b/i,
  /\bwhy live anyway\b/i,
  /\bwhy living anyway\b/i,
  /\bwhy am i alive\b/i,
];

const CRISIS_SIGNAL_WORDS = [
  "kill",
  "suicide",
  "dead",
  "die",
  "worthless",
  "hopeless",
  "no future",
  "no reason to live",
  "end it",
  "end my life",
  "don't want to live",
  "do not want to live",
  "stop breathing",
  "never been born",
  "never be born",
  "nobody needs me",
  "no one needs me",
  "people don't need me",
  "people do not need me",
  "better without me",
  "they will be better without me",
  "what's the point of living",
  "what is the point of living",
  "what's the point in keep going",
  "what is the point in keep going",
  "why live anyway",
  "why living anyway",
  "finish all now",
  "finish all right now",
  "end all for good",
];

const RECOGNITION_OPENERS = [
  "This feels like",
  "What comes through here is",
  "There seems to be",
  "A lot of this feels like",
];

const SEPARATION_LINES = {
  single: [
    "One pressure seems to be carrying most of the weight here.",
    "Beneath the noise, one issue looks heavier than the rest.",
    "Underneath everything else, one strain appears to be doing most of the pulling.",
  ],
  double: [
    "One part seems central, while another is feeding into it and making it harder to settle.",
    "There looks to be one main strain, with a second pressure tightening around it.",
    "One issue seems to sit in the middle, while another keeps adding force to it.",
  ],
  triple: [
    "There seems to be one central strain, with other pressures feeding into it from different angles.",
    "One burden looks central, while the others are gathering around it and making it harder to breathe around.",
    "This does not read like one single issue. It feels like one main pressure with other strains locking onto it.",
  ],
};

const REFRAME_BY_CATEGORY: Record<SolaceCategory, string[]> = {
  "Money / Stability": [
    "When money pressure stays active for too long, it can start tinting everything else and make unrelated things feel more final than they are.",
    "Financial strain often spreads beyond the numbers and starts shaping mood, energy, and perspective at the same time.",
    "Money pressure can make the whole landscape feel smaller, even when the real problem is still only one part of life.",
  ],
  "Relationships / Home Dynamics": [
    "When home or connection feels strained, even small things can land with more force than they normally would.",
    "Relational strain tends to blur into the rest of life, so everything begins to feel more personal and less workable.",
    "When the emotional atmosphere around you feels tense, it becomes harder for the mind to sort what is actually happening from what it fears next.",
  ],
  "Health / Body / Self": [
    "When your body or energy is under pressure, the rest of life often starts to feel louder, harsher, and less manageable.",
    "Low energy and emotional strain can make the whole world feel narrower than it is.",
    "When wellbeing is under strain, the mind becomes less spacious and more likely to treat pain as proof.",
  ],
  "Environment / External Noise": [
    "When there is no real quiet around you, even manageable problems can begin to feel relentless.",
    "Constant external friction can make the nervous system act as if everything is urgent.",
    "When the environment never really lets you settle, the mind stops getting a clean reset.",
  ],
  "Work / Performance": [
    "When work pressure stays switched on too long, it spreads into the rest of life and tightens everything around it.",
    "Performance pressure often makes the mind read every other problem through the same tense lens.",
    "When responsibility feels endless, the whole day can start to feel like one long threat signal.",
  ],
  "Internal Mental Loops": [
    "When the mind keeps circling the same ground, separate worries begin to merge into one solid wall.",
    "Mental looping tends to remove proportion, so everything starts sounding equally loud.",
    "Once a loop takes hold, the mind often repeats the heaviest interpretation instead of the most accurate one.",
  ],
  "Logistics / Immediate Problems": [
    "When practical problems stack up quickly, they can create more pressure than any one of them deserves on its own.",
    "Small urgent tasks can crowd the mind until everything starts feeling bigger and more dramatic than it is.",
    "Practical overload often steals mental space first, then starts distorting perspective.",
  ],
  Unclear: [
    "Not everything here deserves the same weight right now.",
    "The mind may be blending several different pressures into one single feeling.",
    "This may be more tangled than unclear — which means it can still be separated.",
  ],
};

const DIRECTION_BY_CATEGORY: Record<SolaceCategory, string[]> = {
  "Money / Stability": [
    "Start with the one money issue that feels most exposed right now, and turn it into one concrete next move.",
    "Pick the financial pressure with the nearest consequence and work only on that first.",
    "Reduce this to one specific money problem, not the whole future at once.",
  ],
  "Relationships / Home Dynamics": [
    "Separate what needs an actual conversation from what is emotional spillover, so you are not carrying both as one thing.",
    "Name the relationship strain as clearly as you can before trying to solve it.",
    "Focus first on the part that needs understanding, not the part that wants to react.",
  ],
  "Health / Body / Self": [
    "Choose one step that reduces strain on your body or nervous system today, instead of trying to repair everything at once.",
    "Treat your energy as part of the problem, not as proof about your life.",
    "Start with the smallest action that creates a little more steadiness in your body or environment.",
  ],
  "Environment / External Noise": [
    "Reduce one source of friction around you first, so your mind has a little less to push against.",
    "Create one cleaner pocket of space before trying to think through everything.",
    "Lower one piece of external noise first, then reassess what still feels heavy.",
  ],
  "Work / Performance": [
    "Choose the work pressure with the biggest consequence and make the first move on that before touching the rest.",
    "Shrink work pressure into one concrete action, instead of holding the whole burden in your head.",
    "Handle the task with the clearest consequence first and let the rest wait their turn.",
  ],
  "Internal Mental Loops": [
    "Pull out the thought that keeps repeating and ask whether it is a fact, a fear, or an unfinished decision.",
    "Name the loop in one sentence, then question whether it is predicting or observing.",
    "Choose one recurring thought and slow it down enough to see what category it actually belongs to.",
  ],
  "Logistics / Immediate Problems": [
    "Handle the practical task with the nearest time consequence first and let the rest wait their turn.",
    "Do the next real-world action first, then come back to the emotional noise around it.",
    "Shrink this to the first task that changes the situation in concrete terms.",
  ],
  Unclear: [
    "Start by naming the single thought that feels most exposed, and leave the rest untouched for a moment.",
    "Try separating what is practical from what is emotional before doing anything else.",
    "Give the heaviest thought its own sentence, away from the rest.",
  ],
};

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function splitThoughts(
  rawThoughts: Array<string | ClearYourMindBubbleInput>,
): ClearYourMindBubbleInput[] {
  return rawThoughts
    .map((item, index) => {
      if (typeof item === "string") {
        return {
          id: `thought-${index + 1}`,
          text: item.trim(),
        };
      }

      return {
        id: item.id?.trim() || `thought-${index + 1}`,
        text: item.text?.trim() || "",
      };
    })
    .filter((item) => item.text.length > 0)
    .slice(0, MAX_THOUGHTS);
}

function containsPhrase(text: string, phrase: string): boolean {
  return text.includes(phrase);
}

function countKeywordHits(text: string, keywords: string[]): number {
  let hits = 0;

  for (const keyword of keywords) {
    if (containsPhrase(text, keyword)) {
      hits += 1;
    }
  }

  return hits;
}

function countCrisisSignals(thoughts: string[]): number {
  let count = 0;

  for (const thought of thoughts) {
    for (const signal of CRISIS_SIGNAL_WORDS) {
      if (containsPhrase(thought, signal)) {
        count += 1;
        break;
      }
    }
  }

  return count;
}

function hasBurdenLanguage(text: string): boolean {
  return (
    containsPhrase(text, "problem for anyone") ||
    containsPhrase(text, "problem for everyone") ||
    containsPhrase(text, "burden") ||
    containsPhrase(text, "better without me") ||
    containsPhrase(text, "they will be better without me") ||
    containsPhrase(text, "don't need me") ||
    containsPhrase(text, "do not need me") ||
    containsPhrase(text, "nobody needs me") ||
    containsPhrase(text, "no one needs me")
  );
}

function hasExistentialCollapseLanguage(text: string): boolean {
  return (
    containsPhrase(text, "what's the point") ||
    containsPhrase(text, "what is the point") ||
    containsPhrase(text, "why live") ||
    containsPhrase(text, "why living") ||
    containsPhrase(text, "keep going") ||
    containsPhrase(text, "should have never been born") ||
    containsPhrase(text, "should've never been born") ||
    containsPhrase(text, "never been born") ||
    containsPhrase(text, "never be born") ||
    containsPhrase(text, "stop breathing") ||
    containsPhrase(text, "end all for good") ||
    containsPhrase(text, "finish all now") ||
    containsPhrase(text, "finish all right now") ||
    containsPhrase(text, "don't want to be here") ||
    containsPhrase(text, "do not want to be here")
  );
}

function detectCrisis(thoughts: string[]): boolean {
  const joined = thoughts.join(" || ");

  if (DIRECT_CRISIS_PATTERNS.some((pattern) => pattern.test(joined))) {
    return true;
  }

  if (countCrisisSignals(thoughts) >= 1) {
    return true;
  }

  const burdenSignals = thoughts.filter(hasBurdenLanguage).length;
  const collapseSignals = thoughts.filter(hasExistentialCollapseLanguage).length;
  const hopelessSignals = thoughts.filter(
    (t) =>
      containsPhrase(t, "no future") ||
      containsPhrase(t, "worthless") ||
      containsPhrase(t, "hopeless") ||
      containsPhrase(t, "can't go on") ||
      containsPhrase(t, "cannot go on"),
  ).length;

  if (burdenSignals >= 1 && collapseSignals >= 1) {
    return true;
  }

  if (burdenSignals >= 1 && hopelessSignals >= 1) {
    return true;
  }

  const hostilePlusCollapse =
    thoughts.some((t) => containsPhrase(t, "hate")) &&
    thoughts.some(
      (t) =>
        containsPhrase(t, "kill") ||
        containsPhrase(t, "no future") ||
        containsPhrase(t, "don't want to live") ||
        containsPhrase(t, "do not want to live") ||
        hasExistentialCollapseLanguage(t),
    );

  if (hostilePlusCollapse) {
    return true;
  }

  const multipleIndirectSignals =
    thoughts.filter(
      (t) => hasBurdenLanguage(t) || hasExistentialCollapseLanguage(t),
    ).length >= 2;

  return multipleIndirectSignals;
}

function tokenHasLikelyMeaning(token: string): boolean {
  const cleaned = token.toLowerCase().replace(/[^a-z]/g, "");
  if (!cleaned) return false;

  const commonShortWords = new Set([
    "i",
    "a",
    "am",
    "an",
    "to",
    "do",
    "go",
    "no",
    "my",
    "me",
    "we",
    "he",
    "she",
    "it",
    "us",
    "up",
    "on",
    "in",
    "at",
    "if",
    "of",
    "or",
    "is",
    "be",
  ]);

  if (commonShortWords.has(cleaned)) return true;
  if (cleaned.length <= 2) return false;
  if (/[aeiou]/.test(cleaned)) return true;

  return false;
}

function isLikelyGibberish(text: string): boolean {
  const trimmed = text.trim();

  if (trimmed.length < 2) return true;

  const words = trimmed.split(/\s+/).filter(Boolean);
  const lettersOnly = trimmed.replace(/[^a-zA-Z]/g, "");
  const cleanedWords = words.map((word) => word.replace(/[^a-zA-Z]/g, ""));
  const vowelCount = (lettersOnly.match(/[aeiou]/gi) || []).length;
  const uniqueChars = new Set(lettersOnly.toLowerCase()).size;

  const veryShortAndMeaningless =
    words.length <= 2 &&
    cleanedWords.every((word) => word.length <= 3) &&
    cleanedWords.every((word) => !tokenHasLikelyMeaning(word));

  const repeatedSingleLetters =
    cleanedWords.filter(Boolean).length >= 2 &&
    cleanedWords.every((word) => /^([a-zA-Z])\1*$/.test(word));

  const longConsonantRun = /[bcdfghjklmnpqrstvwxyz]{5,}/i.test(trimmed);
  const excessiveSymbols =
    (trimmed.match(/[^a-zA-Z0-9\s]/g) || []).length > trimmed.length * 0.35;
  const veryLowVowels = lettersOnly.length >= 5 && vowelCount <= 1;
  const lowVariationSpam = lettersOnly.length >= 5 && uniqueChars <= 2;

  return (
    veryShortAndMeaningless ||
    repeatedSingleLetters ||
    longConsonantRun ||
    excessiveSymbols ||
    veryLowVowels ||
    lowVariationSpam
  );
}

function detectCategories(text: string): {
  mainCategory: SolaceCategory;
  secondaryCategory?: SolaceCategory;
  matchedSignals: string[];
} {
  const scores: Array<{
    category: SolaceCategory;
    score: number;
    matches: string[];
  }> = [];

  for (const category of CATEGORY_PRIORITY) {
    if (category === "Unclear") continue;

    const config = CATEGORY_KEYWORDS[category];
    const matches = config.primary.filter((keyword) => containsPhrase(text, keyword));
    const score = matches.length;

    if (score > 0) {
      scores.push({ category, score, matches });
    }
  }

  scores.sort(
    (a, b) =>
      b.score - a.score ||
      CATEGORY_PRIORITY.indexOf(a.category) - CATEGORY_PRIORITY.indexOf(b.category),
  );

  if (scores.length === 0) {
    return {
      mainCategory: "Unclear",
      matchedSignals: [],
    };
  }

  return {
    mainCategory: scores[0].category,
    secondaryCategory: scores[1]?.category,
    matchedSignals: [...scores[0].matches, ...(scores[1]?.matches || [])].slice(0, 6),
  };
}

function scoreEmotionalWeight(text: string): number {
  let score = 0;

  score += Math.min(countKeywordHits(text, EMOTIONAL_KEYWORDS) * 10, 28);

  if (/\b(can't|cannot|won't|never|always|nothing|everything)\b/i.test(text)) {
    score += 6;
  }

  if (/[!?]{1,}/.test(text)) {
    score += 4;
  }

  if (/\b(really|so|too|very)\b/i.test(text)) {
    score += 4;
  }

  if (text.length > 60) {
    score += 4;
  }

  if (hasBurdenLanguage(text)) {
    score += 8;
  }

  if (hasExistentialCollapseLanguage(text)) {
    score += 12;
  }

  return Math.min(score, 40);
}

function scorePracticalConsequence(
  text: string,
  mainCategory: SolaceCategory,
): number {
  let score = 0;

  score += Math.min(countKeywordHits(text, PRACTICAL_KEYWORDS) * 6, 16);

  if (
    mainCategory === "Money / Stability" ||
    mainCategory === "Health / Body / Self" ||
    mainCategory === "Work / Performance" ||
    mainCategory === "Logistics / Immediate Problems"
  ) {
    score += 5;
  }

  if (/\b(need to|have to|must|required|important|overdue)\b/i.test(text)) {
    score += 4;
  }

  return Math.min(score, 25);
}

function scoreUrgency(text: string): number {
  let score = 0;

  score += Math.min(countKeywordHits(text, URGENCY_KEYWORDS) * 4, 12);

  if (/\b(today|tonight|tomorrow|urgent|asap|immediately|overdue|now)\b/i.test(text)) {
    score += 3;
  }

  if (containsPhrase(text, "all now") || containsPhrase(text, "right now")) {
    score += 4;
  }

  return Math.min(score, 15);
}

function computeRepetitionScore(current: string, allThoughts: string[]): number {
  const currentWords = new Set(
    current
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .map((word) => word.replace(/[^a-z]/g, ""))
      .filter(Boolean),
  );

  if (currentWords.size === 0) return 0;

  let overlaps = 0;

  for (const other of allThoughts) {
    if (other === current) continue;

    const otherWords = new Set(
      other
        .split(/\s+/)
        .filter((word) => word.length > 3)
        .map((word) => word.replace(/[^a-z]/g, ""))
        .filter(Boolean),
    );

    let shared = 0;
    currentWords.forEach((word) => {
      if (otherWords.has(word)) shared += 1;
    });

    if (shared >= 1) overlaps += 1;
  }

  return Math.min(overlaps * 8, 20);
}

function scoreThought(
  text: string,
  mainCategory: SolaceCategory,
  allThoughts: string[],
  isGibberish: boolean,
): ClearYourMindImportanceBreakdown {
  if (isGibberish) {
    return {
      emotionalWeight: 0,
      practicalConsequence: 0,
      urgency: 0,
      repetition: 0,
      total: 8,
    };
  }

  let emotionalWeight = scoreEmotionalWeight(text);
  let practicalConsequence = scorePracticalConsequence(text, mainCategory);
  let urgency = scoreUrgency(text);
  let repetition = computeRepetitionScore(text, allThoughts);

  if (mainCategory === "Money / Stability") practicalConsequence += 4;
  if (mainCategory === "Relationships / Home Dynamics") emotionalWeight += 3;
  if (mainCategory === "Internal Mental Loops") emotionalWeight += 3;
  if (mainCategory === "Work / Performance") practicalConsequence += 2;
  if (mainCategory === "Unclear") {
    emotionalWeight = Math.max(0, emotionalWeight - 4);
    practicalConsequence = Math.max(0, practicalConsequence - 4);
  }

  const total = emotionalWeight + practicalConsequence + urgency + repetition;

  return {
    emotionalWeight: Math.min(emotionalWeight, 40),
    practicalConsequence: Math.min(practicalConsequence, 25),
    urgency: Math.min(urgency, 15),
    repetition: Math.min(repetition, 20),
    total: Math.min(total, 100),
  };
}

function averageImportance(thoughts: ProcessedThought[]): number {
  if (thoughts.length === 0) return 0;
  const total = thoughts.reduce((sum, item) => sum + item.importance.total, 0);
  return total / thoughts.length;
}

function buildClusters(thoughts: ProcessedThought[]): Cluster[] {
  const grouped = new Map<SolaceCategory, ProcessedThought[]>();

  for (const thought of thoughts) {
    const key = thought.mainCategory;
    const bucket = grouped.get(key) || [];
    bucket.push(thought);
    grouped.set(key, bucket);
  }

  const clusters = Array.from(grouped.entries()).map(([category, clusterThoughts]) => ({
    category,
    thoughts: clusterThoughts.sort((a, b) => b.importance.total - a.importance.total),
    averageImportance: averageImportance(clusterThoughts),
  }));

  return clusters.sort((a, b) => b.averageImportance - a.averageImportance);
}

function formatCategoryPhrase(category: SolaceCategory): string {
  switch (category) {
    case "Money / Stability":
      return "financial pressure";
    case "Relationships / Home Dynamics":
      return "strain around home and relationships";
    case "Health / Body / Self":
      return "pressure on your body, energy, or wellbeing";
    case "Environment / External Noise":
      return "constant friction from the space around you";
    case "Work / Performance":
      return "pressure tied to work and responsibility";
    case "Internal Mental Loops":
      return "an internal loop that keeps circling";
    case "Logistics / Immediate Problems":
      return "practical problems that keep demanding attention";
    default:
      return "something that still has not taken a clear shape";
  }
}

function joinPhrases(parts: string[]): string {
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
}

function pickVariant<T>(items: T[], seed: number): T {
  return items[Math.abs(seed) % items.length];
}

function buildRecognition(clusters: Cluster[]): string {
  const topCategories = clusters
    .slice(0, 3)
    .map((cluster) => formatCategoryPhrase(cluster.category));
  const opener = pickVariant(
    RECOGNITION_OPENERS,
    clusters.length + Math.round(clusters[0]?.averageImportance || 0),
  );

  if (topCategories.length === 0) {
    return "There is pressure here, but it has not separated into a clean shape yet.";
  }

  if (topCategories.length === 1) {
    return `${opener} ${topCategories[0]} carrying most of the weight right now.`;
  }

  return `${opener} ${joinPhrases(topCategories)} all pressing at the same time.`;
}

function buildSeparation(clusters: Cluster[]): string {
  if (clusters.length <= 1) {
    return pickVariant(
      SEPARATION_LINES.single,
      Math.round(clusters[0]?.averageImportance || 0),
    );
  }

  if (clusters.length === 2) {
    return pickVariant(
      SEPARATION_LINES.double,
      Math.round(clusters[1]?.averageImportance || 0),
    );
  }

  return pickVariant(
    SEPARATION_LINES.triple,
    Math.round(
      (clusters[0]?.averageImportance || 0) + (clusters[1]?.averageImportance || 0),
    ),
  );
}

function buildReframing(clusters: Cluster[]): string {
  const topCluster = clusters[0];

  if (!topCluster) {
    return "Not everything here deserves the same level of attention right now.";
  }

  return pickVariant(
    REFRAME_BY_CATEGORY[topCluster.category],
    Math.round(topCluster.averageImportance + topCluster.thoughts.length * 3),
  );
}

function buildDirection(clusters: Cluster[]): string {
  const topCluster = clusters[0];

  if (!topCluster) {
    return "Start by naming the single thought that feels most exposed, and leave the rest untouched for a moment.";
  }

  return pickVariant(
    DIRECTION_BY_CATEGORY[topCluster.category],
    Math.round(topCluster.averageImportance + topCluster.thoughts.length * 7),
  );
}

function generateClarityFallback(): string {
  return [
    "I’m not getting a clear enough shape yet.",
    "Try again with simple, complete thoughts — one thought per bubble.",
  ].join("\n\n");
}

function generateCrisisFallback(): string {
  return [
    "It sounds like things feel very heavy right now.",
    "Some of what you wrote suggests you may be close to the edge, and this is a moment to bring in real human support around you.",
    "Please reach out right now to someone who can be with you in real time — a trusted person nearby, a crisis line, or a mental health professional.",
    "If you feel you might act on these thoughts, or you are not safe, call local emergency services now.",
    "For this moment, keep it simple: move closer to another person, or send one short message saying you need help right now.",
  ].join("\n\n");
}

function generateReflection(clusters: Cluster[]): string {
  const recognition = buildRecognition(clusters);
  const separation = buildSeparation(clusters);
  const reframing = buildReframing(clusters);
  const direction = buildDirection(clusters);

  return [recognition, separation, reframing, direction].join("\n\n");
}

function processThoughts(input: ClearYourMindBubbleInput[]): ProcessedThought[] {
  const normalizedList = input.map((item) => normalizeText(item.text));

  return input.map((item, index) => {
    const normalizedText = normalizedList[index];
    const isGibberish = isLikelyGibberish(normalizedText);
    const { mainCategory, secondaryCategory, matchedSignals } = detectCategories(
      normalizedText,
    );

    const importance = scoreThought(
      normalizedText,
      mainCategory,
      normalizedList,
      isGibberish,
    );

    return {
      id: item.id || `thought-${index + 1}`,
      text: item.text,
      normalizedText,
      mainCategory,
      secondaryCategory,
      importance,
      isGibberish,
      matchedSignals,
    };
  });
}

function toThoughtResults(thoughts: ProcessedThought[]): ClearYourMindThoughtResult[] {
  return thoughts.map((thought) => ({
    id: thought.id,
    text: thought.text,
    mainCategory: thought.mainCategory,
    secondaryCategory: thought.secondaryCategory,
    importance: thought.importance,
    isGibberish: thought.isGibberish,
  }));
}

function toClusterResults(clusters: Cluster[]): ClearYourMindClusterResult[] {
  return clusters.map((cluster) => ({
    category: cluster.category,
    averageImportance: Math.round(cluster.averageImportance),
    thoughtIds: cluster.thoughts.map((thought) => thought.id),
  }));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ClearYourMindRequest;
    const rawThoughts = Array.isArray(body.thoughts) ? body.thoughts : [];
    const thoughts = splitThoughts(rawThoughts);

    if (thoughts.length === 0) {
      const response: ClearYourMindResponse = {
        ok: false,
        error: "Please provide at least one thought.",
      };

      return NextResponse.json(response, { status: 400 });
    }

    const normalizedTexts = thoughts.map((item) => normalizeText(item.text));
    const hasCrisisLanguage = detectCrisis(normalizedTexts);

    if (hasCrisisLanguage) {
      const processedThoughts = processThoughts(thoughts);
      const sortedThoughts = [...processedThoughts].sort(
        (a, b) => b.importance.total - a.importance.total,
      );

      const response: ClearYourMindResponse = {
        ok: true,
        text: generateCrisisFallback(),
        isCrisisFallback: true,
        clarityFallback: false,
        thoughts: toThoughtResults(sortedThoughts),
        clusters: [],
      };

      return NextResponse.json(response, { status: 200 });
    }

    const processedThoughts = processThoughts(thoughts);
    const gibberishThoughts = processedThoughts.filter((item) => item.isGibberish);
    const meaningfulThoughts = processedThoughts.filter((item) => !item.isGibberish);

    const allGibberish = meaningfulThoughts.length === 0;
    const mostlyGibberish =
      gibberishThoughts.length >= Math.ceil(processedThoughts.length * 0.5);

    if (allGibberish || mostlyGibberish) {
      const response: ClearYourMindResponse = {
        ok: true,
        text: generateClarityFallback(),
        isCrisisFallback: false,
        clarityFallback: true,
        thoughts: toThoughtResults(
          [...processedThoughts].sort((a, b) => b.importance.total - a.importance.total),
        ),
        clusters: [],
      };

      return NextResponse.json(response, { status: 200 });
    }

    const sortedMeaningfulThoughts = [...meaningfulThoughts].sort(
      (a, b) => b.importance.total - a.importance.total,
    );

    const sortedAllThoughts = [
      ...sortedMeaningfulThoughts,
      ...gibberishThoughts.sort((a, b) => b.importance.total - a.importance.total),
    ];

    const clusters = buildClusters(sortedMeaningfulThoughts);

    const response: ClearYourMindResponse = {
      ok: true,
      text: generateReflection(clusters),
      isCrisisFallback: false,
      clarityFallback: false,
      thoughts: toThoughtResults(sortedAllThoughts),
      clusters: toClusterResults(clusters),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[solace.clear-your-mind]", error);

    const response: ClearYourMindResponse = {
      ok: false,
      error: "Something went wrong while processing the reflection.",
    };

    return NextResponse.json(response, { status: 500 });
  }
}