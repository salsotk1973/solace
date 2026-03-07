export type Tool = {
  slug: string
  name: string
  tagline: string
  tag: string
}

export const TOOLS: Tool[] = [
  {
    slug: "clarity",
    name: "Clarity Calculator",
    tagline: "Turn mental noise into one next step in under 60 seconds.",
    tag: "Overthinking",
  },
  {
    slug: "overthinking-breaker",
    name: "Overthinking Breaker",
    tagline: "Break looping thoughts into one concrete next step.",
    tag: "Decision Support",
  },
  {
    slug: "priority-reset",
    name: "Priority Reset",
    tagline: "Sort what matters now from what can wait.",
    tag: "Prioritisation",
  },
]