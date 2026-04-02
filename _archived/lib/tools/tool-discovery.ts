import { ToolSlug } from "../thread/thread-types";

export type DiscoveryEntry = {
  id: string;
  stateLabel: string;
  toolSlug: ToolSlug;
  supportingText: string;
};

export const DISCOVERY_ENTRIES: DiscoveryEntry[] = [
  {
    id: "cant-decide",
    stateLabel: "I can’t decide",
    toolSlug: "clarity",
    supportingText: "Untangle difficult decisions with a calmer frame.",
  },
  {
    id: "mind-wont-stop",
    stateLabel: "My mind won’t stop thinking",
    toolSlug: "overthinking-reset",
    supportingText: "Step out of mental loops and regain perspective.",
  },
  {
    id: "everything-feels-noisy",
    stateLabel: "Everything feels noisy",
    toolSlug: "decision-filter",
    supportingText: "Sort what matters from what is only adding pressure.",
  },
];

export function getDiscoveryEntries(): DiscoveryEntry[] {
  return DISCOVERY_ENTRIES;
}