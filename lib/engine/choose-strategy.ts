import { ToolSlug } from "../thread/thread-types";
import { IntentDetectionResult } from "./detect-intent";

export type ReflectionStrategy =
  | "clarifying_frame"
  | "naming_the_tension"
  | "narrowing_focus"
  | "mental_decompression"
  | "gentle_reframe"
  | "clarification_needed";

export function chooseStrategy(
  toolSlug: ToolSlug,
  intent: IntentDetectionResult
): ReflectionStrategy {
  if (intent.category === "unclear") {
    return "clarification_needed";
  }

  if (toolSlug === "clarity") {
    if (intent.category === "decision_dilemma") return "naming_the_tension";
    return "clarifying_frame";
  }

  if (toolSlug === "overthinking-reset") {
    if (intent.category === "rumination_loop") return "mental_decompression";
    return "narrowing_focus";
  }

  if (toolSlug === "decision-filter") {
    if (intent.category === "priority_conflict") return "narrowing_focus";
    return "clarifying_frame";
  }

  return "gentle_reframe";
}