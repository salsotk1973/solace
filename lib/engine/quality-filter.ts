export type QualityFilterResult = {
  passed: boolean;
  reasons: string[];
};

export function qualityFilter(
  question: string,
  reflection: string
): QualityFilterResult {
  const reasons: string[] = [];
  const q = question.toLowerCase();
  const r = reflection.toLowerCase();

  if (reflection.trim().length < 80) {
    reasons.push("Response too short.");
  }

  if (
    q.includes("job") &&
    !r.includes("job") &&
    !r.includes("work") &&
    !r.includes("career")
  ) {
    reasons.push("Response does not anchor to the user's topic.");
  }

  if (
    q.includes("australia") &&
    !r.includes("australia") &&
    !r.includes("move") &&
    !r.includes("place")
  ) {
    reasons.push("Response may be too generic for the user's question.");
  }

  if (!r.includes("you may ask yourself")) {
    reasons.push("Response is missing a reflective next thought.");
  }

  return {
    passed: reasons.length === 0,
    reasons,
  };
}