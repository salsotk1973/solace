export type SolaceToolSlug = "choose" | "clear-your-mind" | "sort";
export type SolaceToolTheme = "blue" | "green" | "sand";

export type SolaceTool = {
  slug: SolaceToolSlug;
  name: string;
  feeling: string;
  description: string;
  shortDescription: string;
  introTitle: string;
  introText: string;
  theme: SolaceToolTheme;
  order: number;
};

export const tools: readonly SolaceTool[] = [
  {
    slug: "choose",
    name: "Choose",
    feeling: "I can't decide",
    description: "Compare options and move forward.",
    shortDescription: "For moments of indecision.",
    introTitle: "Choose",
    introText: "Compare options calmly and find a clearer way forward.",
    theme: "blue",
    order: 1,
  },
  {
    slug: "clear-your-mind",
    name: "Clear Your Mind",
    feeling: "My mind won't stop thinking",
    description: "Untangle overthinking and regain perspective.",
    shortDescription: "For moments of overthinking.",
    introTitle: "Clear Your Mind",
    introText:
      "Untangle mental loops and create a little more space to think clearly.",
    theme: "green",
    order: 2,
  },
  {
    slug: "sort",
    name: "Sort",
    feeling: "Everything feels noisy",
    description: "Separate what deserves attention from what doesn't.",
    shortDescription: "For moments of overwhelm.",
    introTitle: "Sort",
    introText:
      "Clear mental clutter and focus on what actually matters right now.",
    theme: "sand",
    order: 3,
  },
] as const;