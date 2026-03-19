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
      "headache",
      "need time off",
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
      "work pressure",
      "workload",
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

const CRISIS_PATTERNS = [
  /\bkill myself\b/i,
  /\bend my life\b/i,
  /\bdon'?t want to live\b/i,
  /\bdo not want to live\b/i,
  /\bdon'?t want to live anymore\b/i,
  /\bdo not want to live anymore\b/i,
  /\bwant to die\b/i,
  /\bi should die\b/i,
  /\bi wish i was dead\b/i,
  /\bsuicide\b/i,
  /\bself harm\b/i,
  /\bhurt myself\b/i,
  /\bcut myself\b/i,
  /\boverdose\b/i,
  /\bno reason to live\b/i,
  /\bcan'?t go on\b/i,
  /\bcannot go on\b/i,
];

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

function detectCrisis(thoughts: string[]): boolean {
  const joined = thoughts.join(" || ");
  return CRISIS_PATTERNS.some((pattern) => pattern.test(joined));
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

  const allCapsFragments =
    words.length >= 2 &&
    cleanedWords.filter(Boolean).length >= 2 &&
    cleanedWords.every(
      (word) =>
        word.length <= 4 &&
        word === word.toUpperCase() &&
        !tokenHasLikelyMeaning(word),
    );

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
    allCapsFragments ||
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
    const matches = config.primary.filter((keyword) =>
      containsPhrase(text, keyword),
    );
    const score = matches.length;

    if (score > 0) {
      scores.push({ category, score, matches });
    }
  }

  scores.sort(
    (a, b) =>
      b.score - a.score ||
      CATEGORY_PRIORITY.indexOf(a.category) -
        CATEGORY_PRIORITY.indexOf(b.category),
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
    matchedSignals: [...scores[0].matches, ...(scores[1]?.matches || [])].slice(
      0,
      6,
    ),
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

  if (/\b(today|tonight|tomorrow|urgent|asap|immediately|overdue)\b/i.test(text)) {
    score += 3;
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

  const clusters = Array.from(grouped.entries()).map(
    ([category, clusterThoughts]) => ({
      category,
      thoughts: clusterThoughts.sort(
        (a, b) => b.importance.total - a.importance.total,
      ),
      averageImportance: averageImportance(clusterThoughts),
    }),
  );

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

function buildRecognition(clusters: Cluster[]): string {
  const topCategories = clusters
    .slice(0, 3)
    .map((cluster) => formatCategoryPhrase(cluster.category));

  if (topCategories.length === 0) {
    return "There is pressure here, but it has not separated into a clean shape yet.";
  }

  if (topCategories.length === 1) {
    return `What seems to be weighing on you most is ${topCategories[0]}.`;
  }

  return `This feels like ${joinPhrases(topCategories)} all pressing at the same time.`;
}

function buildSeparation(clusters: Cluster[]): string {
  const top = clusters[0];
  const second = clusters[1];
  const third = clusters[2];

  if (!top) {
    return "The clearest move is to slow it down and identify the heaviest part first.";
  }

  if (!second) {
    return `Underneath the noise, one pressure appears to be carrying most of the load.`;
  }

  if (!third) {
    return `One part looks central, while another is feeding into it and making it harder to settle.`;
  }

  return `There seems to be one central strain, with two other pressures feeding into it from different angles.`;
}

function buildReframing(clusters: Cluster[]): string {
  const topCluster = clusters[0];

  if (!topCluster) {
    return "Not everything here deserves the same level of attention right now.";
  }

  switch (topCluster.category) {
    case "Money / Stability":
      return "That often happens when money pressure starts colouring everything else around it.";
    case "Relationships / Home Dynamics":
      return "When home feels strained, even unrelated things can start landing harder than they normally would.";
    case "Health / Body / Self":
      return "When your energy is under pressure, the rest of life often starts to feel louder than it really is.";
    case "Environment / External Noise":
      return "When there is no real quiet around you, even manageable problems can begin to feel relentless.";
    case "Work / Performance":
      return "When work pressure stays switched on for too long, it can spread into the rest of life and make everything feel tighter.";
    case "Internal Mental Loops":
      return "When your mind keeps circling the same ground, separate worries can start to feel like one solid wall.";
    case "Logistics / Immediate Problems":
      return "When small practical problems stack up, they can create more pressure than any one of them deserves on its own.";
    default:
      return "Not everything here deserves the same level of attention right now.";
  }
}

function buildDirection(clusters: Cluster[]): string {
  const topCluster = clusters[0];

  if (!topCluster) {
    return "Start by naming the single thought that feels most exposed, and leave the rest untouched for a moment.";
  }

  switch (topCluster.category) {
    case "Money / Stability":
      return "Start with the one money issue that feels most exposed right now, and turn that into one concrete action.";
    case "Relationships / Home Dynamics":
      return "Separate what needs an actual conversation from what is emotional spillover, so you are not carrying both as one thing.";
    case "Health / Body / Self":
      return "Pick one thing today that reduces strain on your body or energy, instead of trying to repair everything at once.";
    case "Environment / External Noise":
      return "Reduce one source of friction around you first, so your mind has a little less to push against.";
    case "Work / Performance":
      return "Choose the work pressure with the biggest consequence and make the first move on that, before touching the rest.";
    case "Internal Mental Loops":
      return "Pull out the thought that keeps repeating and ask whether it is a real problem, a fear, or an unfinished decision.";
    case "Logistics / Immediate Problems":
      return "Handle the practical task with the nearest time consequence first, and let the rest wait their turn.";
    default:
      return "Start with the clearest pressure first and let the rest stay in the background for a moment.";
  }
}

function generateClarityFallback(): string {
  return "I’m not getting a clear enough shape yet. Try again with one simple thought per bubble.";
}

function generateCrisisFallback(): string {
  return "What you wrote sounds too serious for Solace to hold safely here.\n\nPlease do not stay alone with this right now. Reach out immediately to local emergency services if you may act on these thoughts, or contact a trusted person, a crisis line, or a mental health professional who can be with you in real time.";
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
    const { mainCategory, secondaryCategory, matchedSignals } =
      detectCategories(normalizedText);

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

function toThoughtResults(
  thoughts: ProcessedThought[],
): ClearYourMindThoughtResult[] {
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
      const response: ClearYourMindResponse = {
        ok: true,
        text: generateCrisisFallback(),
        isCrisisFallback: true,
        clarityFallback: false,
        thoughts: [],
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
          [...processedThoughts].sort(
            (a, b) => b.importance.total - a.importance.total,
          ),
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