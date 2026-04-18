import { getSolaceRedirectCopy, type SolaceToolIntent } from "./redirect-copy";

export type SolaceToolIntentResult = {
  detectedTool: SolaceToolIntent;
  confidence: number;
  reason:
    | "decision-language"
    | "multi-thought-overload"
    | "single-overwhelm"
    | "weak-signal"
    | "unknown";
  shouldRedirect: boolean;
  redirectTarget: Exclude<SolaceToolIntent, "unknown"> | null;
  title: string | null;
  message: string | null;
  ctaLabel: string | null;
};

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/\s+/g, " ");
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .replace(/[^a-z0-9\s?'/-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function countMeaningfulThoughts(thoughts: string[]): number {
  return thoughts.map((item) => item.trim()).filter(Boolean).length;
}

function looksLikeDecisionLanguage(text: string): boolean {
  const patterns = [
    /\bshould i\b/i,
    /\bshould we\b/i,
    /\bcan i\b/i,
    /\bwhich should i\b/i,
    /\bwhich is better\b/i,
    /\bis it better\b/i,
    /\bbetween\b/i,
    /\bwhether\b/i,
    /\bchoose\b/i,
    /\bdecision\b/i,
  ];

  return patterns.some((pattern) => pattern.test(text));
}

function hasEitherOrStructure(text: string): boolean {
  const patterns = [
    /\b.+\s+or\s+.+\b/i,
    /\bthis or that\b/i,
    /\bstay or leave\b/i,
    /\bgo or stay\b/i,
    /\bleave or stay\b/i,
  ];

  return patterns.some((pattern) => pattern.test(text));
}

function looksLikeBreakItDownInput(text: string, thoughts: string[]): boolean {
  const combined = normalizeText(text);
  const thoughtCount = countMeaningfulThoughts(thoughts);

  const singleHeavyThingPatterns = [
    /\bhow do i deal with\b/i,
    /\bhow do i handle\b/i,
    /\bi don't know how to\b/i,
    /\bi do not know how to\b/i,
    /\bone thing\b/i,
    /\bthis one thing\b/i,
    /\bi need to deal with\b/i,
    /\bi need to sort out\b/i,
    /\bi need help breaking this down\b/i,
    /\btoo overwhelming\b/i,
    /\boverwhelming\b/i,
    /\bwhere do i even start\b/i,
    /\bhow do i start\b/i,
    /\bhow do i even begin\b/i,
    /\bi need to (organize|sort|plan|handle|manage|fix|deal with|get through)\b/i,
    /\bi have to (organize|sort|plan|handle|manage|fix|deal with|get through)\b/i,
    /\bi need to do (so much|everything|all of this|all this)\b/i,
    /\btoo many things\b/i,
    /\bso many things\b/i,
    /\bso much to do\b/i,
    /\btoo much to do\b/i,
    /\bi don't know how to (start|begin|tackle|approach)\b/i,
    /\bi do not know how to (start|begin|tackle|approach)\b/i,
    /\bdon't know where to (start|begin)\b/i,
    /\bdo not know where to (start|begin)\b/i,
  ];

  if (thoughtCount === 1 && singleHeavyThingPatterns.some((pattern) => pattern.test(combined))) {
    return true;
  }

  if (
    thoughtCount === 1 &&
    /\b(overwhelmed|stuck|too much|can't cope|cannot cope|don't know where to start)\b/i.test(
      combined,
    )
  ) {
    return true;
  }

  // Detect task-list input: "I need to X, Y and Z"
  const taskListPattern = /\b(i need to|i have to|i must|i should)\b.{0,200}\b(and|also|plus)\b/i;
  if (thoughtCount === 1 && taskListPattern.test(combined) && !looksLikeDecisionLanguage(combined)) {
    return true;
  }

  return false;
}

function looksLikeClearYourMindInput(text: string, thoughts: string[]): boolean {
  const combined = normalizeText(text);
  const thoughtCount = countMeaningfulThoughts(thoughts);

  const multiThoughtPatterns = [
    /\band\b/i,
    /\balso\b/i,
    /\bon top of that\b/i,
    /\bat the same time\b/i,
    /\bplus\b/i,
    /\bmeanwhile\b/i,
  ];

  const emotionalDumpPatterns = [
    /\bi feel\b/i,
    /\bi'm feeling\b/i,
    /\bim feeling\b/i,
    /\btoo much\b/i,
    /\boverwhelmed\b/i,
    /\bstressed\b/i,
    /\banxious\b/i,
    /\bstuck\b/i,
    /\blost\b/i,
  ];

  if (thoughtCount >= 2) return true;
  if (thoughtCount === 1 && multiThoughtPatterns.some((pattern) => pattern.test(combined))) {
    return true;
  }
  if (thoughtCount === 1 && emotionalDumpPatterns.some((pattern) => pattern.test(combined))) {
    return true;
  }

  return false;
}

function detectBestTool(text: string, thoughts: string[]): {
  detectedTool: SolaceToolIntent;
  confidence: number;
  reason: SolaceToolIntentResult["reason"];
} {
  const normalized = normalizeText(text);
  const thoughtCount = countMeaningfulThoughts(thoughts);

  if (looksLikeDecisionLanguage(normalized) || hasEitherOrStructure(normalized)) {
    return {
      detectedTool: "choose",
      confidence: 0.94,
      reason: "decision-language",
    };
  }

  if (looksLikeBreakItDownInput(normalized, thoughts)) {
    return {
      detectedTool: "break-it-down",
      confidence: 0.88,
      reason: "single-overwhelm",
    };
  }

  if (looksLikeClearYourMindInput(normalized, thoughts)) {
    return {
      detectedTool: "clear-your-mind",
      confidence: thoughtCount >= 2 ? 0.92 : 0.75,
      reason: "multi-thought-overload",
    };
  }

  const tokens = tokenize(normalized);
  if (tokens.length <= 2) {
    return {
      detectedTool: "unknown",
      confidence: 0.28,
      reason: "weak-signal",
    };
  }

  return {
    detectedTool: "unknown",
    confidence: 0.4,
    reason: "unknown",
  };
}

export function classifySolaceToolIntent(params: {
  currentTool: Exclude<SolaceToolIntent, "unknown">;
  text?: string;
  thoughts?: string[];
}): SolaceToolIntentResult {
  const currentTool = params.currentTool;
  const thoughts = (params.thoughts ?? []).map((item) => item.trim()).filter(Boolean);
  const combinedText =
    typeof params.text === "string" && params.text.trim().length > 0
      ? params.text.trim()
      : thoughts.join(" ");

  const detection = detectBestTool(combinedText, thoughts);

  // If the user is already on clear-your-mind and the input also looks like a
  // clear-your-mind input, do not redirect — the overwhelm routing logic runs
  // first in detectBestTool and can steal inputs that belong here.
  const alreadyOnCorrectTool =
    currentTool === "clear-your-mind" &&
    looksLikeClearYourMindInput(combinedText, thoughts);

  if (
    detection.detectedTool === "unknown" ||
    detection.detectedTool === currentTool ||
    detection.confidence < 0.72 ||
    alreadyOnCorrectTool
  ) {
    return {
      detectedTool: detection.detectedTool,
      confidence: detection.confidence,
      reason: detection.reason,
      shouldRedirect: false,
      redirectTarget: null,
      title: null,
      message: null,
      ctaLabel: null,
    };
  }

  const copy = getSolaceRedirectCopy(currentTool, detection.detectedTool);

  return {
    detectedTool: detection.detectedTool,
    confidence: detection.confidence,
    reason: detection.reason,
    shouldRedirect: Boolean(copy),
    redirectTarget: detection.detectedTool,
    title: copy?.title ?? null,
    message: copy?.message ?? null,
    ctaLabel: copy?.ctaLabel ?? null,
  };
}