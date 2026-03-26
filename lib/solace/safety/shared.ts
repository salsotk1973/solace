import { SOLACE_CRISIS_FALLBACK } from "../safety";
import {
  classifySafetyThoughts,
  type SafetyClassification,
  type SafetyThoughtInput,
} from "./classify";

export const SOLACE_SHARED_CLARITY_TITLE = "Try one clearer thought";

export const SOLACE_SHARED_CLARITY_MESSAGE =
  "I could not find enough clear meaning in what was written. Try entering one or two simple thoughts in plain language, and I will help untangle them.";

export type SharedSolaceSafetyMode = "support" | "clarity" | "normal";

export type SharedSolaceSafetyResult = {
  mode: SharedSolaceSafetyMode;
  classification: SafetyClassification;
  hasForcedCrisis: boolean;
  hasGibberish: boolean;
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
    .replace(/[^a-z0-9\s?'-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function hasKnownMeaningfulToken(token: string): boolean {
  const patterns = [
    /^(money|bill|bills|rent|mortgage|debt|loan|cash|job|jobs|work|career|office|boss|deadline|deadlines|income|family|wife|husband|partner|pregnant|baby|kids|children|mother|father|mum|mom|parents|health|doctor|hospital|pain|panic|anxiety|stress|stressed|tired|exhausted|car|broken|repair|repairs|food|home|relationship|marriage|future|sad|lost|stuck|worthless|ugly|calm|rest|peace|quiet|vacation|holiday|travel|escape|breathe|breathing|alive|live|die|dead|keep|going|why|me|change|changing|cat|cats|dog|dogs|ai|hate|question|working|not|enough|phone|boyfriend|girlfriend|cheated|cheat|dad|mum|mom|worthless)$/i,
  ];

  return patterns.some((pattern) => pattern.test(token));
}

function isSingleJunkThought(thought: string): boolean {
  const tokens = tokenize(thought);

  if (tokens.length === 0) return true;
  if (tokens.length > 2) return false;

  return tokens.every((token) => !hasKnownMeaningfulToken(token));
}

function looksLikeGibberishThoughtSet(thoughts: string[]): boolean {
  if (thoughts.length === 0) return true;

  const normalized = thoughts
    .map((thought) => normalizeText(thought))
    .filter(Boolean)
    .slice(0, 7);

  if (normalized.length === 0) return true;

  const singleThought = normalized.length === 1;
  const tokenized = normalized.map(tokenize);
  const allTokens = tokenized.flat();

  if (allTokens.length === 0) return true;

  if (singleThought && isSingleJunkThought(normalized[0])) {
    return true;
  }

  const allVeryShortUnknown =
    normalized.length >= 2 &&
    allTokens.every((token) => token.length <= 5 && !hasKnownMeaningfulToken(token));

  if (allVeryShortUnknown) {
    return true;
  }

  const repeatedNoise =
    normalized.length >= 2 &&
    allTokens.filter((token) => !hasKnownMeaningfulToken(token)).length >= 2 &&
    allTokens.every(
      (token) => /(.)\1{1,}/.test(token) || !/[aeiou]/.test(token) || token.length <= 5,
    );

  if (repeatedNoise) {
    return true;
  }

  return false;
}

function hasForcedCrisisLanguage(thoughts: string[]): boolean {
  const combined = normalizeText(thoughts.join(" "));

  const forcedPatterns = [
    /\bdo not want to breathe anymore\b/i,
    /\bdon't want to breathe anymore\b/i,
    /\bwhy keep breathing\b/i,
    /\bwhy should i keep breathing\b/i,
    /\bwhy should i keep going\b/i,
    /\bwhy keep going\b/i,
    /\bi can't keep going\b/i,
    /\bi cannot keep going\b/i,
    /\bdo not want to be here anymore\b/i,
    /\bdon't want to be here anymore\b/i,
    /\bdo not want to live anymore\b/i,
    /\bdon't want to live anymore\b/i,
    /\bi do not want to live\b/i,
    /\bi don't want to live\b/i,
    /\bnot want to live anymore\b/i,
    /\bnot want to breathe anymore\b/i,
  ];

  return forcedPatterns.some((pattern) => pattern.test(combined));
}

function hasViolenceOrHomicideLanguage(input: string): boolean {
  const text = normalizeText(input);

  if (!text) return false;

  const violentIntentPatterns = [
    /\bkill\s+(him|her|them|someone|somebody|my\s+\w+|our\s+\w+|a\s+\w+|that\s+\w+)\b/i,
    /\bmurder\s+(him|her|them|someone|somebody|my\s+\w+|our\s+\w+|a\s+\w+|that\s+\w+)\b/i,
    /\bstab\s+(him|her|them|someone|somebody|my\s+\w+|our\s+\w+|a\s+\w+|that\s+\w+)\b/i,
    /\bshoot\s+(him|her|them|someone|somebody|my\s+\w+|our\s+\w+|a\s+\w+|that\s+\w+)\b/i,
    /\bstrangle\s+(him|her|them|someone|somebody|my\s+\w+|our\s+\w+|a\s+\w+|that\s+\w+)\b/i,
    /\bpoison\s+(him|her|them|someone|somebody|my\s+\w+|our\s+\w+|a\s+\w+|that\s+\w+)\b/i,
    /\bhurt\s+(him|her|them|someone|somebody|my\s+\w+|our\s+\w+|a\s+\w+|that\s+\w+)\b/i,
    /\battack\s+(him|her|them|someone|somebody|my\s+\w+|our\s+\w+|a\s+\w+|that\s+\w+)\b/i,
    /\bbeat\s+up\s+(him|her|them|someone|somebody|my\s+\w+|our\s+\w+|a\s+\w+|that\s+\w+)\b/i,
    /\bset\s+fire\s+to\b/i,
    /\bget\s+rid\s+of\s+(him|her|them|my\s+\w+|our\s+\w+)\b/i,
  ];

  const firstPersonViolentDecisionPatterns = [
    /\bshould\s+i\s+kill\b/i,
    /\bdo\s+i\s+kill\b/i,
    /\bcan\s+i\s+kill\b/i,
    /\bshould\s+i\s+murder\b/i,
    /\bdo\s+i\s+murder\b/i,
    /\bcan\s+i\s+murder\b/i,
    /\bshould\s+i\s+stab\b/i,
    /\bshould\s+i\s+shoot\b/i,
    /\bshould\s+i\s+strangle\b/i,
    /\bshould\s+i\s+poison\b/i,
    /\bshould\s+i\s+hurt\b/i,
    /\bshould\s+i\s+attack\b/i,
    /\bshould\s+i\s+beat\s+up\b/i,
    /\bi\s+want\s+to\s+kill\b/i,
    /\bi\s+want\s+to\s+murder\b/i,
    /\bi\s+feel\s+like\s+killing\b/i,
    /\bi\s+feel\s+like\s+hurting\b/i,
    /\bi\s+am\s+going\s+to\s+kill\b/i,
    /\bi\s+am\s+going\s+to\s+hurt\b/i,
    /\bi'm\s+going\s+to\s+kill\b/i,
    /\bi'm\s+going\s+to\s+hurt\b/i,
  ];

  const threatPatterns = [
    /\bhe\s+deserves\s+to\s+die\b/i,
    /\bshe\s+deserves\s+to\s+die\b/i,
    /\bthey\s+deserve\s+to\s+die\b/i,
    /\bmake\s+him\s+pay\b/i,
    /\bmake\s+her\s+pay\b/i,
    /\bmake\s+them\s+pay\b/i,
  ];

  return (
    violentIntentPatterns.some((pattern) => pattern.test(text)) ||
    firstPersonViolentDecisionPatterns.some((pattern) => pattern.test(text)) ||
    threatPatterns.some((pattern) => pattern.test(text))
  );
}

export function buildSharedCrisisTextPayload() {
  return {
    text: SOLACE_CRISIS_FALLBACK,
    isCrisisFallback: true as const,
  };
}

export function buildSharedClarityPayload() {
  return {
    title: SOLACE_SHARED_CLARITY_TITLE,
    message: SOLACE_SHARED_CLARITY_MESSAGE,
    isCrisisFallback: false as const,
    clarityFallback: true as const,
  };
}

export function isSharedSolaceRedFlagText(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed) return false;

  return classifySharedSolaceThoughts([trimmed]).mode === "support";
}

export function classifySharedSolaceThoughts(thoughts: string[]): SharedSolaceSafetyResult {
  const cleanThoughts = thoughts
    .map((thought) => thought.trim())
    .filter(Boolean)
    .slice(0, 7);

  const classification = classifySafetyThoughts(
    cleanThoughts.map(
      (text): SafetyThoughtInput => ({
        text,
      }),
    ),
  );

  const hasForcedCrisis =
    hasForcedCrisisLanguage(cleanThoughts) ||
    cleanThoughts.some((thought) => hasViolenceOrHomicideLanguage(thought));

  if (classification.mode === "support" || hasForcedCrisis) {
    return {
      mode: "support",
      classification,
      hasForcedCrisis,
      hasGibberish: false,
    };
  }

  const hasGibberish = looksLikeGibberishThoughtSet(cleanThoughts);

  if (classification.mode === "clarity" || hasGibberish) {
    return {
      mode: "clarity",
      classification,
      hasForcedCrisis: false,
      hasGibberish,
    };
  }

  return {
    mode: "normal",
    classification,
    hasForcedCrisis: false,
    hasGibberish: false,
  };
}