// lib/solace/safety/red-flags.ts

export const GIBBERISH_MIN_LETTERS = 12;
export const GIBBERISH_VOWEL_RATIO_MIN = 0.18;

export type SafetyCategory =
  | "direct_self_harm_intent"
  | "desire_to_die_or_not_live"
  | "desire_to_disappear_or_not_exist"
  | "life_worth_collapse"
  | "hopelessness_no_point"
  | "cant_go_on_language"
  | "burden_language"
  | "self_worth_collapse"
  | "emotional_exhaustion_done"
  | "passive_death_wishes"
  | "ambiguous_high_risk"
  | "short_form_high_risk";

export type RedFlagPatternGroup = {
  id: string;
  category: SafetyCategory;
  weight: number;
  escalation: "hard" | "strong" | "moderate";
  patterns: RegExp[];
};

export function normalizeSafetyText(input: string): string {
  return input
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^a-z0-9\s'?-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenizeSafetyText(input: string): string[] {
  return normalizeSafetyText(input)
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean);
}

export function buildBigrams(tokens: string[]): string[] {
  const bigrams: string[] = [];

  for (let index = 0; index < tokens.length - 1; index += 1) {
    bigrams.push(`${tokens[index]} ${tokens[index + 1]}`);
  }

  return bigrams;
}

export function buildTrigrams(tokens: string[]): string[] {
  const trigrams: string[] = [];

  for (let index = 0; index < tokens.length - 2; index += 1) {
    trigrams.push(`${tokens[index]} ${tokens[index + 1]} ${tokens[index + 2]}`);
  }

  return trigrams;
}

export function looksLikeGibberish(input: string): boolean {
  const normalized = normalizeSafetyText(input).replace(/\s+/g, "");
  if (normalized.length < GIBBERISH_MIN_LETTERS) return false;

  const lettersOnly = normalized.replace(/[^a-z]/g, "");
  if (lettersOnly.length < GIBBERISH_MIN_LETTERS) return false;

  const vowels = (lettersOnly.match(/[aeiou]/g) || []).length;
  const vowelRatio = vowels / lettersOnly.length;

  const repeatedConsonantBlocks = /(bcdf|cdfg|fghj|hjkl|jklm|qwr|zxq|xzc|qzx)/i.test(
    lettersOnly,
  );

  const tokenCount = tokenizeSafetyText(input).length;
  const noRealWordSpacing =
    tokenCount <= 2 && lettersOnly.length >= 14 && vowelRatio < GIBBERISH_VOWEL_RATIO_MIN;

  return (
    vowelRatio < GIBBERISH_VOWEL_RATIO_MIN || repeatedConsonantBlocks || noRealWordSpacing
  );
}

export function matchAnyPattern(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

export const HIGH_RISK_SINGLE_TOKENS = new Set<string>([
  "die",
  "dead",
  "kill",
  "suicide",
  "goodbye",
  "good-bye",
  "good bye",
]);

export const HIGH_RISK_BIGRAMS = new Set<string>([
  "end it",
  "give up",
  "not live",
  "stop breathing",
  "stop living",
  "stop existing",
  "hurt myself",
  "harm myself",
  "not wake",
  "stop waking",
  "no point",
  "worthless life",
  "better off",
]);

export const HIGH_RISK_TRIGRAMS = new Set<string>([
  "end it all",
  "kill my self",
  "kill myself now",
  "dont want live",
  "don't want live",
  "do not live",
  "not worth living",
  "wish i died",
  "better off dead",
]);

export function isShortHighRiskForm(input: string): boolean {
  const tokens = tokenizeSafetyText(input);
  if (tokens.length === 0 || tokens.length > 8) return false;

  if (tokens.some((token) => HIGH_RISK_SINGLE_TOKENS.has(token))) {
    return true;
  }

  const bigrams = buildBigrams(tokens);
  if (bigrams.some((bigram) => HIGH_RISK_BIGRAMS.has(bigram))) {
    return true;
  }

  const trigrams = buildTrigrams(tokens);
  if (trigrams.some((trigram) => HIGH_RISK_TRIGRAMS.has(trigram))) {
    return true;
  }

  return false;
}

export const RED_FLAG_GROUPS: RedFlagPatternGroup[] = [
  {
    id: "direct-self-harm-intent",
    category: "direct_self_harm_intent",
    weight: 100,
    escalation: "hard",
    patterns: [
      /\bi want to kill myself\b/i,
      /\bi wanna kill myself\b/i,
      /\bi am going to kill myself\b/i,
      /\bi'm going to kill myself\b/i,
      /\bi should kill myself\b/i,
      /\bkill myself\b/i,
      /\btake my own life\b/i,
      /\bend my life\b/i,
      /\bend it all\b/i,
      /\bshould i end it all\b/i,
      /\bshould i just end it all\b/i,
      /\bshould i just end it\b/i,
      /\bshould i end it\b/i,
      /\bshould i die\b/i,
      /\bshould i kill myself\b/i,
      /\bsuicide\b/i,
      /\bkys\b/i,
      /\bshould i hurt myself\b/i,
      /\bshould i harm myself\b/i,
      /\bi want to hurt myself\b/i,
      /\bi want to harm myself\b/i,
      /\bshould i cut myself\b/i,
      /\bi want to cut myself\b/i,
    ],
  },
  {
    id: "desire-to-die-or-not-live",
    category: "desire_to_die_or_not_live",
    weight: 100,
    escalation: "hard",
    patterns: [
      /\bi want to die\b/i,
      /\bi wanna die\b/i,
      /\bi wish i was dead\b/i,
      /\bi wish i were dead\b/i,
      /\bi want to be dead\b/i,
      /\bi do not want to live\b/i,
      /\bi don't want to live\b/i,
      /\bi dont want to live\b/i,
      /\bi do not want to live anymore\b/i,
      /\bi don't want to live anymore\b/i,
      /\bi dont want to live anymore\b/i,
      /\bi no longer want to live\b/i,
      /\bi do not feel like living anymore\b/i,
      /\bi don't feel like living anymore\b/i,
      /\bi dont feel like living anymore\b/i,
      /\bi do not feel like being alive anymore\b/i,
      /\bi don't feel like being alive anymore\b/i,
      /\bi dont feel like being alive anymore\b/i,
      /\bi don't feel like living\b/i,
      /\bi dont feel like living\b/i,
      /\bi do not feel like living\b/i,
      /\bshould i stop breathing\b/i,
      /\bshould i stop breathing or not\b/i,
      /\bi want to stop breathing\b/i,
      /\bi want to stop existing\b/i,
      /\bshould i just stop breathing\b/i,
      /\bshould i stop living\b/i,
      /\bshould i just stop living\b/i,
      /\bi want to stop living\b/i,
      /\bshould i stop waking up\b/i,
      /\bshould i not wake up\b/i,
    ],
  },
  {
    id: "desire-to-disappear-or-not-exist",
    category: "desire_to_disappear_or_not_exist",
    weight: 90,
    escalation: "hard",
    patterns: [
      /\bi do not want to exist\b/i,
      /\bi don't want to exist\b/i,
      /\bi dont want to exist\b/i,
      /\bi wish i could disappear\b/i,
      /\bi wish i would disappear\b/i,
      /\bi want to disappear\b/i,
      /\bi wanna disappear\b/i,
      /\bi wish i could vanish\b/i,
      /\bi do not want to be here\b/i,
      /\bi don't want to be here\b/i,
      /\bi dont want to be here\b/i,
      /\bi do not want to be around\b/i,
      /\bi don't want to be around\b/i,
      /\bi dont want to be around\b/i,
      /\bbetter if i wasn't here\b/i,
      /\bbetter if i wasnt here\b/i,
      /\bbetter off if i wasn't here\b/i,
      /\bbetter off if i wasnt here\b/i,
      /\bwould be better if i disappeared\b/i,
    ],
  },
  {
    id: "life-worth-collapse",
    category: "life_worth_collapse",
    weight: 90,
    escalation: "hard",
    patterns: [
      /\bmy life is not worth it\b/i,
      /\bmy life isn't worth it\b/i,
      /\bmy life isnt worth it\b/i,
      /\blife is not worth it\b/i,
      /\blife isn't worth it\b/i,
      /\blife isnt worth it\b/i,
      /\bmy life is not worth living\b/i,
      /\bmy life isn't worth living\b/i,
      /\bmy life isnt worth living\b/i,
      /\blife is not worth living\b/i,
      /\blife isn't worth living\b/i,
      /\blife isnt worth living\b/i,
      /\bmy life has no value\b/i,
      /\bmy life has no meaning\b/i,
      /\bmy life means nothing\b/i,
      /\bthere is no value in my life\b/i,
      /\bi am not worth saving\b/i,
      /\bi'm not worth saving\b/i,
    ],
  },
  {
    id: "hopelessness-no-point",
    category: "hopelessness_no_point",
    weight: 45,
    escalation: "strong",
    patterns: [
      /\bwhat is the point\b/i,
      /\bwhat's the point\b/i,
      /\bwhats the point\b/i,
      /\bno point anymore\b/i,
      /\bthere is no point anymore\b/i,
      /\bthere's no point anymore\b/i,
      /\bno point in living\b/i,
      /\bthere is no point in living\b/i,
      /\bthere's no point in living\b/i,
      /\bi feel hopeless\b/i,
      /\bi am hopeless\b/i,
      /\bi'm hopeless\b/i,
      /\beverything is hopeless\b/i,
      /\bnothing will get better\b/i,
      /\bnothing is ever going to get better\b/i,
      /\bi see no way out\b/i,
      /\bthere is no way out\b/i,
      /\bthere's no way out\b/i,
    ],
  },
  {
    id: "cant-go-on-language",
    category: "cant_go_on_language",
    weight: 45,
    escalation: "strong",
    patterns: [
      /\bi can't go on\b/i,
      /\bi cant go on\b/i,
      /\bi cannot go on\b/i,
      /\bi can't keep going\b/i,
      /\bi cant keep going\b/i,
      /\bi cannot keep going\b/i,
      /\bi can't do this anymore\b/i,
      /\bi cant do this anymore\b/i,
      /\bi cannot do this anymore\b/i,
      /\bi can't keep doing this\b/i,
      /\bi cant keep doing this\b/i,
      /\bi cannot keep doing this\b/i,
      /\bi give up\b/i,
      /\bi'm giving up\b/i,
      /\bim giving up\b/i,
      /\bi am giving up\b/i,
      /\bit's too much\b/i,
      /\bits too much\b/i,
    ],
  },
  {
    id: "burden-language",
    category: "burden_language",
    weight: 40,
    escalation: "strong",
    patterns: [
      /\bi am a burden\b/i,
      /\bi'm a burden\b/i,
      /\beveryone would be better off without me\b/i,
      /\bpeople would be better off without me\b/i,
      /\bmy family would be better off without me\b/i,
      /\bthey would be better off without me\b/i,
      /\bbetter off without me\b/i,
      /\bi only make things worse\b/i,
      /\bi ruin everything\b/i,
      /\bi just drag everyone down\b/i,
      /\bi make life worse for everyone\b/i,
      /\bi only cause problems\b/i,
    ],
  },
  {
    id: "self-worth-collapse",
    category: "self_worth_collapse",
    weight: 35,
    escalation: "strong",
    patterns: [
      /\bi am worthless\b/i,
      /\bi'm worthless\b/i,
      /\bi feel worthless\b/i,
      /\bi am useless\b/i,
      /\bi'm useless\b/i,
      /\bi hate myself\b/i,
      /\bi am broken\b/i,
      /\bi'm broken\b/i,
      /\bnothing about me matters\b/i,
      /\bi do not matter\b/i,
      /\bi don't matter\b/i,
      /\bi dont matter\b/i,
      /\bi am beyond help\b/i,
      /\bi'm beyond help\b/i,
      /\bi am a mess\b/i,
      /\bi'm a mess\b/i,
      /\bi am nothing\b/i,
      /\bi'm nothing\b/i,
    ],
  },
  {
    id: "emotional-exhaustion-done",
    category: "emotional_exhaustion_done",
    weight: 28,
    escalation: "moderate",
    patterns: [
      /\bi am done\b/i,
      /\bi'm done\b/i,
      /\bi am so done\b/i,
      /\bi'm so done\b/i,
      /\bi am exhausted\b/i,
      /\bi'm exhausted\b/i,
      /\bi am tired of everything\b/i,
      /\bi'm tired of everything\b/i,
      /\bi cannot take this anymore\b/i,
      /\bi can't take this anymore\b/i,
      /\bi cant take this anymore\b/i,
      /\ball i want is peace\b/i,
      /\bnothing feels okay anymore\b/i,
    ],
  },
  {
    id: "passive-death-wishes",
    category: "passive_death_wishes",
    weight: 80,
    escalation: "hard",
    patterns: [
      /\bi wish i would not wake up\b/i,
      /\bi wish i wouldn't wake up\b/i,
      /\bi wish i wouldnt wake up\b/i,
      /\bi wish i could go to sleep and not wake up\b/i,
      /\bi hope i do not wake up\b/i,
      /\bi hope i don't wake up\b/i,
      /\bi hope i dont wake up\b/i,
      /\bit would be easier if i were dead\b/i,
      /\bit would be easier if i was dead\b/i,
      /\bbetter off dead\b/i,
      /\bmaybe i should just die\b/i,
      /\bmaybe i should disappear\b/i,
    ],
  },
  {
    id: "ambiguous-high-risk",
    category: "ambiguous_high_risk",
    weight: 32,
    escalation: "strong",
    patterns: [
      /\bshould i end it\b/i,
      /\bshould i just end it\b/i,
      /\bmaybe i should end it\b/i,
      /\bmaybe i should just end it\b/i,
      /\bmaybe i should die\b/i,
      /\bmaybe i should disappear\b/i,
      /\bmaybe everyone would be better without me\b/i,
      /\bno one would miss me\b/i,
      /\bno one cares anyway\b/i,
      /\bit doesn't matter what i do\b/i,
      /\bit doesnt matter what i do\b/i,
    ],
  },
  {
    id: "short-form-high-risk",
    category: "short_form_high_risk",
    weight: 100,
    escalation: "hard",
    patterns: [
      /^\s*die\s*$/i,
      /^\s*dead\s*$/i,
      /^\s*kill\s*$/i,
      /^\s*suicide\s*$/i,
      /^\s*goodbye\s*$/i,
      /^\s*end it\s*$/i,
      /^\s*end it all\s*$/i,
      /^\s*give up\s*$/i,
      /^\s*no point\s*$/i,
      /^\s*done\s*$/i,
      /^\s*help\s*$/i,
      /^\s*trapped\s*$/i,
    ],
  },
];

export const HARD_ESCALATION_GROUP_IDS = new Set<string>(
  RED_FLAG_GROUPS.filter((group) => group.escalation === "hard").map((group) => group.id),
);

export function matchRedFlagGroups(input: string): RedFlagPatternGroup[] {
  const normalized = normalizeSafetyText(input);
  if (!normalized) return [];

  return RED_FLAG_GROUPS.filter((group) => matchAnyPattern(normalized, group.patterns));
}

export function hasHardEscalationMatch(input: string): boolean {
  const matches = matchRedFlagGroups(input);
  return matches.some((group) => HARD_ESCALATION_GROUP_IDS.has(group.id));
}

export function getRedFlagCategories(input: string): SafetyCategory[] {
  const matches = matchRedFlagGroups(input);
  return Array.from(new Set(matches.map((group) => group.category)));
}

export function getRedFlagScore(input: string): number {
  const matches = matchRedFlagGroups(input);
  return matches.reduce((sum, group) => sum + group.weight, 0);
}

export function isLikelyClarityInput(input: string): boolean {
  const normalized = normalizeSafetyText(input);
  if (!normalized) return true;

  if (hasHardEscalationMatch(normalized)) return false;
  if (isShortHighRiskForm(normalized)) return false;

  return looksLikeGibberish(normalized);
}