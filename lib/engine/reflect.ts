import { ToolSlug, ReflectionResponse } from "../thread/thread-types";
import { detectIntent } from "./detect-intent";
import { detectTension } from "./detect-tension";
import { chooseStrategy } from "./choose-strategy";
import { composeResponse } from "./compose-response";
import { qualityFilter } from "./quality-filter";

type ReflectArgs = {
  toolSlug: ToolSlug;
  question: string;
};

export async function reflect({
  toolSlug,
  question,
}: ReflectArgs): Promise<ReflectionResponse> {
  const intent = detectIntent(question);
  const tension = detectTension(question);
  const strategy = chooseStrategy(toolSlug, intent);

  const reflection = composeResponse({
    toolSlug,
    question,
    intent,
    tension,
    strategy,
  });

  const quality = qualityFilter(question, reflection);

  const finalReflection = quality.passed
    ? reflection
    : `It sounds like there may be more than one layer inside this question.

A calmer way to approach it may be to focus first on the deepest tension rather than trying to solve everything at once.

You may ask yourself: what feels most important about this decision right now?`;

  return {
    reflection: finalReflection,
    relatedToolSuggestion:
      toolSlug === "clarity" ? "decision-filter" : null,
    recoveryOptions: [
      "Focus more on the emotional side",
      "Focus more on the practical side",
      "That’s not the real tension",
    ],
  };
}