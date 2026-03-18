// /lib/solace/safety.ts

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

export const SOLACE_CRISIS_FALLBACK =
  "It sounds like you may be going through something very difficult.\n\nSolace is not equipped for crisis support.\n\nPlease reach out to a trusted person or a qualified professional who can support you right now.";

/**
 * These patterns are intentionally broad for v1.
 * We can refine them later, but they give us a safe foundation before launch.
 */
export const SOLACE_CRISIS_PATTERNS: RegExp[] = [
  /\bkill myself\b/i,
  /\bwant to die\b/i,
  /\bi want to die\b/i,
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
  /\bcan’t go on\b/i,
  /\bcant go on\b/i,
  /\bdo not want to live\b/i,
  /\bdon't want to live\b/i,
  /\bim going to kill myself\b/i,
  /\bi'm going to kill myself\b/i,
  /\bthinking about killing myself\b/i,
  /\bthinking of killing myself\b/i,
  /\bthinking about suicide\b/i,
  /\bsevere crisis\b/i,
];

export function isSolaceCrisisInput(input: string): boolean {
  if (!input || typeof input !== "string") {
    return false;
  }

  const normalized = input.trim();

  if (!normalized) {
    return false;
  }

  return SOLACE_CRISIS_PATTERNS.some((pattern) => pattern.test(normalized));
}