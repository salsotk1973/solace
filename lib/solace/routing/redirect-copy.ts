export type SolaceToolIntent = "choose" | "clear-your-mind" | "break-it-down" | "unknown";

export type SolaceRedirectCopy = {
  title: string;
  message: string;
  ctaLabel: string;
};

const REDIRECT_COPY: Record<
  Exclude<SolaceToolIntent, "unknown">,
  Record<Exclude<SolaceToolIntent, "unknown">, SolaceRedirectCopy | null>
> = {
  choose: {
    choose: null,
    "clear-your-mind": {
      title: "This sounds more like a lot on your mind",
      message:
        "This feels less like a choice between two paths and more like several things weighing on you at once. Clear Your Mind may give you a better result here.",
      ctaLabel: "Go to Clear Your Mind",
    },
    "break-it-down": {
      title: "This sounds like one thing that needs untangling",
      message:
        "This feels less like a decision and more like one heavy thing that needs to be broken into smaller parts. Break It Down may help more here.",
      ctaLabel: "Go to Break It Down",
    },
  },
  "clear-your-mind": {
    choose: {
      title: "This sounds more like a decision",
      message:
        "This reads more like a choice between two directions than a mind dump. Choose may help you see the decision more clearly.",
      ctaLabel: "Go to Choose",
    },
    "clear-your-mind": null,
    "break-it-down": {
      title: "This sounds like one main thing",
      message:
        "This feels less like lots of separate thoughts and more like one thing that needs to be made manageable. Break It Down may fit better.",
      ctaLabel: "Go to Break It Down",
    },
  },
  "break-it-down": {
    choose: {
      title: "This sounds more like a decision",
      message:
        "This looks more like a choice between options than one overwhelming thing to split up. Choose may be the better fit.",
      ctaLabel: "Go to Choose",
    },
    "clear-your-mind": {
      title: "This sounds more like a mind full of different things",
      message:
        "This feels less like one thing to break apart and more like several thoughts sitting on you at once. Clear Your Mind may help more here.",
      ctaLabel: "Go to Clear Your Mind",
    },
    "break-it-down": null,
  },
};

export function getSolaceRedirectCopy(
  currentTool: Exclude<SolaceToolIntent, "unknown">,
  suggestedTool: Exclude<SolaceToolIntent, "unknown">,
): SolaceRedirectCopy | null {
  return REDIRECT_COPY[currentTool][suggestedTool];
}