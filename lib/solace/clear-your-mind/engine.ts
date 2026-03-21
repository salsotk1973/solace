import {
  ClearYourMindInput,
  ClearYourMindResponse,
  SafetyAssessment,
} from "./types";
import { classifySafetyThoughts } from "@/lib/solace/safety/classify";
import { composeReflection } from "./composer";

function buildSafetyAssessment(input: ClearYourMindInput): SafetyAssessment {
  const thoughts = (input.thoughts ?? [])
    .map((item) => item?.text ?? "")
    .map((text) => text.trim())
    .filter(Boolean)
    .slice(0, 7);

  const classification = classifySafetyThoughts(
    thoughts.map((text) => ({
      text,
    })),
  );

  return {
    riskScore: classification.totalScore,
    isCrisis: classification.mode === "support",
    clarityFallback: classification.mode === "clarity",
    signals: {
      directIntent: classification.categories.some((category) =>
        [
          "direct_self_harm_intent",
          "desire_to_die_or_not_live",
          "passive_death_wishes",
          "short_form_high_risk",
        ].includes(category),
      ),
      indirectIntent: classification.categories.some((category) =>
        [
          "desire_to_disappear_or_not_exist",
          "life_worth_collapse",
          "hopelessness_no_point",
          "cant_go_on_language",
          "burden_language",
          "self_worth_collapse",
          "emotional_exhaustion_done",
          "ambiguous_high_risk",
        ].includes(category),
      ),
      existentialLanguage: classification.categories.some((category) =>
        [
          "desire_to_die_or_not_live",
          "desire_to_disappear_or_not_exist",
          "life_worth_collapse",
          "hopelessness_no_point",
          "passive_death_wishes",
        ].includes(category),
      ),
      burdenLanguage: classification.categories.includes("burden_language"),
      selfWorthCollapse: classification.categories.some((category) =>
        ["life_worth_collapse", "self_worth_collapse"].includes(category),
      ),
      gibberish: classification.mode === "clarity",
    },
    matchedRules: classification.assessments.flatMap((assessment) => assessment.matchedGroupIds),
  };
}

function buildCrisisFallback(assessment: SafetyAssessment): ClearYourMindResponse {
  return {
    ok: true,
    isCrisisFallback: true,
    clarityFallback: false,
    title: "Stay with this moment",
    message:
      "Something in what you shared feels very heavy.\n\nBefore anything else, take a small pause here. You do not need to solve everything right now.\n\nYou deserve support in moments like this. If you can, reach out to someone you trust, or a local crisis or mental health support service.\n\nIf you feel like you might act on these thoughts or you are in immediate danger, please call emergency services now.",
    safetyAssessment: assessment,
  };
}

function buildClarityFallback(assessment: SafetyAssessment): ClearYourMindResponse {
  return {
    ok: true,
    isCrisisFallback: false,
    clarityFallback: true,
    title: "Try one clearer thought",
    message:
      "I could not find enough clear meaning in what was written. Try entering one or two simple thoughts in plain language, and I will help untangle them.",
    safetyAssessment: assessment,
  };
}

function buildNormalReflection(
  thoughts: string[],
  assessment: SafetyAssessment,
): ClearYourMindResponse {
  const cleanThoughts = thoughts
    .map((thought) => thought.trim())
    .filter(Boolean)
    .slice(0, 7);

  const reflection = composeReflection(cleanThoughts);

  return {
    ok: true,
    isCrisisFallback: false,
    clarityFallback: false,
    reflection: {
      title: reflection.title,
      summary: reflection.lines[0],
      structure: {
        recognition: reflection.lines[1],
        untangling: reflection.lines[2],
        gentleFrame: "",
      },
    },
    safetyAssessment: assessment,
  };
}

export function evaluateClearYourMind(input: ClearYourMindInput): ClearYourMindResponse {
  const thoughts = (input.thoughts ?? [])
    .map((item) => item?.text ?? "")
    .map((text) => text.trim())
    .filter(Boolean)
    .slice(0, 7);

  const assessment = buildSafetyAssessment(input);

  if (assessment.isCrisis) {
    return buildCrisisFallback(assessment);
  }

  if (assessment.clarityFallback) {
    return buildClarityFallback(assessment);
  }

  return buildNormalReflection(thoughts, assessment);
}

export function _internalForTestsOnly() {
  return {
    buildSafetyAssessment,
  };
}