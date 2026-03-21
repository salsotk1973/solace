// lib/solace/safety/classify.ts

import {
  getRedFlagCategories,
  getRedFlagScore,
  hasHardEscalationMatch,
  isLikelyClarityInput,
  isShortHighRiskForm,
  matchRedFlagGroups,
  normalizeSafetyText,
  type SafetyCategory,
} from "./red-flags";

export type SafetyMode = "support" | "normal" | "clarity";

export type SafetyThoughtInput = {
  text: string;
};

export type ThoughtSafetyAssessment = {
  original: string;
  normalized: string;
  isEmpty: boolean;
  isClarityLike: boolean;
  hasHardMatch: boolean;
  hasShortHighRiskForm: boolean;
  categories: SafetyCategory[];
  matchedGroupIds: string[];
  score: number;
};

export type SafetyClassification = {
  mode: SafetyMode;
  trigger: "hard" | "combined-strong" | "clarity" | "none";
  totalScore: number;
  supportThoughtIndexes: number[];
  clarityThoughtIndexes: number[];
  categories: SafetyCategory[];
  assessments: ThoughtSafetyAssessment[];
};

const SUPPORT_SCORE_THRESHOLD = 70;
const SUPPORT_CATEGORY_COUNT_THRESHOLD = 2;

function uniqueCategories(items: SafetyCategory[][]): SafetyCategory[] {
  return Array.from(new Set(items.flat()));
}

function assessThought(text: string): ThoughtSafetyAssessment {
  const normalized = normalizeSafetyText(text);
  const matches = normalized ? matchRedFlagGroups(normalized) : [];
  const categories = Array.from(new Set(matches.map((group) => group.category)));
  const matchedGroupIds = matches.map((group) => group.id);
  const score = matches.reduce((sum, group) => sum + group.weight, 0);
  const hasHardMatch = normalized ? hasHardEscalationMatch(normalized) : false;
  const hasShortHighRiskForm = normalized ? isShortHighRiskForm(normalized) : false;
  const isClarityLike = normalized ? isLikelyClarityInput(normalized) : true;

  return {
    original: text,
    normalized,
    isEmpty: normalized.length === 0,
    isClarityLike,
    hasHardMatch,
    hasShortHighRiskForm,
    categories,
    matchedGroupIds,
    score,
  };
}

export function classifySafetyThoughts(input: SafetyThoughtInput[]): SafetyClassification {
  const trimmedInput = (input ?? []).map((item) => item?.text ?? "");
  const assessments = trimmedInput.map(assessThought);

  const supportThoughtIndexes: number[] = [];
  const clarityThoughtIndexes: number[] = [];

  for (let index = 0; index < assessments.length; index += 1) {
    const assessment = assessments[index];

    if (assessment.hasHardMatch || assessment.hasShortHighRiskForm) {
      supportThoughtIndexes.push(index);
    } else if (assessment.isClarityLike) {
      clarityThoughtIndexes.push(index);
    }
  }

  if (supportThoughtIndexes.length > 0) {
    return {
      mode: "support",
      trigger: "hard",
      totalScore: assessments.reduce((sum, item) => sum + item.score, 0),
      supportThoughtIndexes,
      clarityThoughtIndexes,
      categories: uniqueCategories(assessments.map((item) => item.categories)),
      assessments,
    };
  }

  const totalScore = assessments.reduce((sum, item) => sum + item.score, 0);
  const allCategories = uniqueCategories(assessments.map((item) => item.categories));
  const hasEnoughCombinedSignal =
    totalScore >= SUPPORT_SCORE_THRESHOLD ||
    allCategories.length >= SUPPORT_CATEGORY_COUNT_THRESHOLD;

  if (hasEnoughCombinedSignal) {
    const combinedIndexes = assessments
      .map((assessment, index) => ({ assessment, index }))
      .filter(({ assessment }) => assessment.score > 0)
      .map(({ index }) => index);

    return {
      mode: "support",
      trigger: "combined-strong",
      totalScore,
      supportThoughtIndexes: combinedIndexes,
      clarityThoughtIndexes,
      categories: allCategories,
      assessments,
    };
  }

  const nonEmptyAssessments = assessments.filter((item) => !item.isEmpty);
  const allNonEmptyAreClarityLike =
    nonEmptyAssessments.length > 0 &&
    nonEmptyAssessments.every((item) => item.isClarityLike && item.score === 0);

  if (allNonEmptyAreClarityLike) {
    return {
      mode: "clarity",
      trigger: "clarity",
      totalScore,
      supportThoughtIndexes,
      clarityThoughtIndexes:
        clarityThoughtIndexes.length > 0
          ? clarityThoughtIndexes
          : assessments
              .map((assessment, index) => ({ assessment, index }))
              .filter(({ assessment }) => !assessment.isEmpty)
              .map(({ index }) => index),
      categories: allCategories,
      assessments,
    };
  }

  return {
    mode: "normal",
    trigger: "none",
    totalScore,
    supportThoughtIndexes,
    clarityThoughtIndexes,
    categories: allCategories,
    assessments,
  };
}