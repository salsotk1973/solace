import { ToolSlug } from "../thread/thread-types";

export type ToolDefinition = {
  slug: ToolSlug;
  title: string;
  subtitle: string;
  placeholder: string;
  discoveryStateLabel: string;
  description: string;
  moduleId: ToolSlug;
  relatedTools: ToolSlug[];
  colorToken: "clarity" | "overthinking" | "decision";
};

export const TOOL_REGISTRY: Record<ToolSlug, ToolDefinition> = {
  clarity: {
    slug: "clarity",
    title: "Clarity Tool",
    subtitle: "A quiet space to untangle difficult decisions.",
    placeholder: "Should I stay where I am or make a change?",
    discoveryStateLabel: "I can’t decide",
    description: "Untangle difficult decisions with a calmer frame.",
    moduleId: "clarity",
    relatedTools: ["decision-filter"],
    colorToken: "clarity",
  },
  "overthinking-reset": {
    slug: "overthinking-reset",
    title: "Overthinking Reset",
    subtitle: "A calmer space for thoughts that keep circling.",
    placeholder: "Why does this thought keep repeating in my mind?",
    discoveryStateLabel: "My mind won’t stop thinking",
    description: "Step out of mental loops and regain perspective.",
    moduleId: "overthinking-reset",
    relatedTools: ["decision-filter"],
    colorToken: "overthinking",
  },
  "decision-filter": {
    slug: "decision-filter",
    title: "Decision Filter",
    subtitle: "Reduce noise and see what truly matters.",
    placeholder: "There are too many factors. What actually matters here?",
    discoveryStateLabel: "Everything feels noisy",
    description: "Sort what matters from what is only adding pressure.",
    moduleId: "decision-filter",
    relatedTools: ["clarity", "overthinking-reset"],
    colorToken: "decision",
  },
};

export function getToolDefinition(slug: ToolSlug): ToolDefinition {
  return TOOL_REGISTRY[slug];
}

export function getAllToolDefinitions(): ToolDefinition[] {
  return Object.values(TOOL_REGISTRY);
}