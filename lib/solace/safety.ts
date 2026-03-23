// lib/solace/safety.ts

export const SOLACE_AGE_REQUIREMENT = "Adults only (18+).";

export const SOLACE_SCOPE_SHORT =
  "Solace offers reflective tools for clarity only and does not provide medical, psychological, coaching, legal, financial, or other professional advice.";

export const SOLACE_TOOL_NOTICE =
  "Solace is designed for adults (18+) and offers reflective tools for clarity only. It does not provide medical, psychological, coaching, legal, financial, or other professional advice.";

export const SOLACE_FOOTER_DISCLAIMER =
  "Solace is intended for adults (18+) and provides reflective tools only. It does not provide medical, psychological, coaching, legal, financial, or other professional advice.";

export const SOLACE_SCOPE_FULL = [
  "Solace is designed for adults (18+).",
  "Solace provides reflective tools to help people slow down and see thoughts and decisions more clearly.",
  "Solace does not provide medical, psychological, coaching, legal, financial, or other professional advice.",
  "Solace is not a therapy service, crisis service, diagnostic service, or substitute for qualified professional support.",
  "If you are dealing with severe distress or a crisis situation, Solace is not the right tool for that moment.",
];

/**
 * 🔒 LOCKED CRISIS MESSAGE
 */
export const SOLACE_CRISIS_FALLBACK =
  "It sounds like you may be going through something very difficult.\n\nSolace is not equipped for crisis support.\n\nPlease reach out to a trusted person or a qualified professional who can support you right now.";

/**
 * Direct / explicit self-harm or suicide language.
 */
export const SOLACE_DIRECT_CRISIS_PATTERNS: RegExp[] = [
  /\bkill myself\b/i,
  /\bi want to die\b/i,
  /\bwant to die\b/i,
  /\bend my life\b/i,
  /\bend it all\b/i,
  /\bsuicide\b/i,
  /\bsuicidal\b/i,
  /\bself[- ]?harm\b/i,
  /\bhurt myself\b/i,
  /\bcut myself\b/i,
  /\boverdose\b/i,
  /\bno reason to live\b/i,
  /\bi cannot go on\b/i,
  /\bi can['’]t go on\b/i,
  /\bdo not want to live\b/i,
  /\bdon['’]t want to live\b/i,
  /\bi(?:'|’)m going to kill myself\b/i,
  /\bim going to kill myself\b/i,
  /\bthinking about killing myself\b/i,
  /\bthinking of killing myself\b/i,
  /\bthinking about suicide\b/i,
  /\bsevere crisis\b/i,
];

/**
 * High-risk indirect language.
 */
export const SOLACE_INDIRECT_CRISIS_PATTERNS: RegExp[] = [
  /\bi do not see the point anymore\b/i,
  /\bi don['’]t see the point anymore\b/i,
  /\bdo not see the point anymore\b/i,
  /\bdon['’]t see the point anymore\b/i,
  /\bwhat['’]s the point anymore\b/i,
  /\bwhat is the point anymore\b/i,
  /\bwhat['’]s the point of anything\b/i,
  /\bwhat is the point of anything\b/i,
  /\bnothing matters anymore\b/i,
  /\bi can['’]t handle it\b/i,
  /\bi cannot handle it\b/i,
  /\bi can['’]t do this anymore\b/i,
  /\bi cannot do this anymore\b/i,
  /\beverything feels too much\b/i,
  /\bit all feels too much\b/i,
  /\btoo much to handle\b/i,
  /\bi am at my limit\b/i,
  /\bi'm at my limit\b/i,
  /\bi am done\b/i,
  /\bi'm done\b/i,
  /\bi am broken\b/i,
  /\bi'm broken\b/i,
  /\bi feel trapped and hopeless\b/i,
  /\bi feel hopeless\b/i,
  /\bi can['’]t keep going\b/i,
  /\bi cannot keep going\b/i,
];

/**
 * NEW: Ambiguous death-as-option language
 * (This fixes your exact bug)
 */
export const SOLACE_AMBIGUOUS_DEATH_PATTERNS: RegExp[] = [
  /\bor (die|dead)\b/i,
  /\bmaybe (die|dead)\b/i,
  /\bbetter to (die|be dead)\b/i,
  /\bjust (die|be dead)\b/i,
];

/**
 * Mild stress patterns (do NOT trigger crisis)
 */
export const SOLACE_NON_CRISIS_STRESS_PATTERNS: RegExp[] = [
  /\ba bit stressed\b/i,
  /\bstressed about work\b/i,
  /\bstressed with work\b/i,
  /\boverwhelmed at work\b/i,
  /\btired\b/i,
  /\bexhausted\b/i,
  /\bburnt out\b/i,
  /\bburned out\b/i,
  /\bi need a break\b/i,
  /\bi need rest\b/i,
];

function normalizeCrisisInput(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[’]/g, "'")
    .toLowerCase();
}

export function isSolaceCrisisInput(input: string): boolean {
  if (!input || typeof input !== "string") {
    return false;
  }

  const normalized = normalizeCrisisInput(input);

  if (!normalized) {
    return false;
  }

  // 🔴 Direct
  if (SOLACE_DIRECT_CRISIS_PATTERNS.some((p) => p.test(normalized))) {
    return true;
  }

  // 🟠 Indirect
  if (SOLACE_INDIRECT_CRISIS_PATTERNS.some((p) => p.test(normalized))) {
    return true;
  }

  // 🟡 NEW ambiguous (your bug fix)
  if (SOLACE_AMBIGUOUS_DEATH_PATTERNS.some((p) => p.test(normalized))) {
    return true;
  }

  // Combined signals
  if (
    /\beverything feels too much\b/i.test(normalized) &&
    /\bi can(?:not|'t) handle it\b/i.test(normalized)
  ) {
    return true;
  }

  if (
    /\bwhat(?:'s| is) the point\b/i.test(normalized) &&
    /\banymore\b/i.test(normalized)
  ) {
    return true;
  }

  if (
    /\bi can(?:not|'t) (?:go on|keep going|do this anymore|handle it)\b/i.test(normalized)
  ) {
    return true;
  }

  // 🟢 Explicitly NOT crisis
  if (SOLACE_NON_CRISIS_STRESS_PATTERNS.some((p) => p.test(normalized))) {
    return false;
  }

  return false;
}