import {
  ClearYourMindInput,
  ClearYourMindResponse,
  SafetyAssessment,
} from "./types";
import { classifySafetyThoughts } from "@/lib/solace/safety/classify";

type ThoughtTheme =
  | "money"
  | "work"
  | "relationship"
  | "family"
  | "health"
  | "home"
  | "identity"
  | "general";

function detectThoughtTheme(text: string): ThoughtTheme {
  const normalized = text.trim().toLowerCase();

  if (
    /\b(bill|bills|rent|mortgage|debt|loan|money|cash|broke|financial|finance|expenses|cost|costs|afford|affording)\b/i.test(
      normalized,
    )
  ) {
    return "money";
  }

  if (
    /\b(work|job|career|boss|office|deadline|deadlines|workload|meeting|meetings|clients|client|tasks|pressure at work|too much work)\b/i.test(
      normalized,
    )
  ) {
    return "work";
  }

  if (
    /\b(partner|relationship|marriage|husband|wife|boyfriend|girlfriend|breakup|divorce)\b/i.test(
      normalized,
    )
  ) {
    return "relationship";
  }

  if (
    /\b(family|mum|mom|mother|dad|father|parents|kids|children|pregnant|baby|sister|brother)\b/i.test(
      normalized,
    )
  ) {
    return "family";
  }

  if (
    /\b(health|sick|ill|doctor|hospital|pain|panic|anxiety|depressed|stress|stressed|tired|exhausted|breath|breathing)\b/i.test(
      normalized,
    )
  ) {
    return "health";
  }

  if (
    /\b(house|home|dirty|mess|messy|car|broken|laundry|cleaning|moving|move|overseas)\b/i.test(
      normalized,
    )
  ) {
    return "home";
  }

  if (
    /\b(useless|worthless|mess|failure|broken|lost|stuck|not enough|not good enough)\b/i.test(
      normalized,
    )
  ) {
    return "identity";
  }

  return "general";
}

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

function buildReflectionTitle(themes: ThoughtTheme[]): string {
  if (themes.includes("money") && themes.includes("work")) {
    return "Money and work are colliding";
  }

  if (themes.includes("money")) {
    return "Money pressure is taking up space";
  }

  if (themes.includes("work")) {
    return "Work pressure is following you around";
  }

  if (themes.includes("relationship")) {
    return "This feels emotionally close to you";
  }

  if (themes.includes("family")) {
    return "Family pressure is sitting inside this";
  }

  if (themes.includes("health")) {
    return "Your system sounds stretched";
  }

  if (themes.includes("home")) {
    return "Life admin is getting loud";
  }

  if (themes.includes("identity")) {
    return "This is hitting your inner voice too";
  }

  return "This looks heavier than one simple thought";
}

function buildSummary(thoughts: string[], themes: ThoughtTheme[]): string {
  if (themes.includes("money") && themes.includes("work")) {
    return "That can feel like pressure coming from two directions at once.";
  }

  if (themes.includes("money")) {
    return "That kind of pressure can sit in the background all day.";
  }

  if (themes.includes("work")) {
    return "That can make it feel like there is no real off-switch.";
  }

  if (thoughts.length === 1) {
    return `This seems to be sitting at the centre: "${thoughts[0]}"`;
  }

  return "That can start to feel heavier than it looks on the surface.";
}

function buildRecognition(thoughts: string[], themes: ThoughtTheme[]): string {
  if (themes.includes("money") && themes.includes("work")) {
    return "When money feels tight and work feels relentless, the mind can start treating everything like it needs to be solved immediately.";
  }

  if (themes.includes("money")) {
    return "Money stress often lingers because the mind keeps scanning for risk and trying to fix uncertainty all at once.";
  }

  if (themes.includes("work")) {
    return "Work pressure can become mentally loud when it feels like there is no real off-switch.";
  }

  if (themes.includes("relationship") || themes.includes("family")) {
    return "This feels personal, not just practical, which is usually why it sits so heavily in the mind.";
  }

  if (themes.includes("health")) {
    return "When your body or nervous system already feels stretched, everything else usually starts feeling louder too.";
  }

  if (themes.includes("home")) {
    return "Practical life pressure can wear you down because it keeps sitting in the background, asking for attention.";
  }

  if (themes.includes("identity")) {
    return "Part of the weight here seems to be coming from how hard this is landing on you internally.";
  }

  return thoughts.length > 1
    ? "These thoughts seem connected by one bigger feeling of pressure."
    : "This does not feel like a small thought for you.";
}

function buildUntangling(thoughts: string[], themes: ThoughtTheme[]): string {
  if (themes.includes("money") && themes.includes("work")) {
    return "The weight may not be only the bills or only the workload — it may be the feeling that both are pressing at once and neither is giving you much room.";
  }

  if (themes.includes("money")) {
    return "The pressure may be coming less from one expense and more from the ongoing feeling that the whole picture needs attention.";
  }

  if (themes.includes("work")) {
    return "The hard part may be that the workload is not only busy — it is starting to take over your headspace.";
  }

  if (themes.includes("relationship") || themes.includes("family")) {
    return "The strain may be harder to untangle because feelings and responsibility are mixed together.";
  }

  if (themes.includes("health")) {
    return "The difficulty may be that this is no longer just a thought problem — it sounds like it is affecting your whole system.";
  }

  if (themes.includes("home")) {
    return "The pressure may be building because these practical things keep feeling unfinished and mentally open.";
  }

  if (themes.includes("identity")) {
    return "The knot here may be that the situation and your self-talk are starting to reinforce each other.";
  }

  return thoughts.length > 1
    ? "Not all of this needs the same response. Some parts may need action, and some may just need naming."
    : "It may help to separate what is actually happening from what your mind is adding on top of it.";
}

function buildNextStep(thoughts: string[], themes: ThoughtTheme[]): string {
  if (themes.includes("money") && themes.includes("work")) {
    return "A useful next step may be to split this into two lists: what needs attention first, and what can wait until later.";
  }

  if (themes.includes("money")) {
    return "A useful next step may be to name the one money issue that is most immediate, instead of carrying the whole financial picture at once.";
  }

  if (themes.includes("work")) {
    return "A useful next step may be to decide what is genuinely urgent, and what only feels urgent because you are already overloaded.";
  }

  if (themes.includes("relationship") || themes.includes("family")) {
    return "A useful next step may be to ask what part of this is yours to carry right now, and what part is not yours to solve alone.";
  }

  if (themes.includes("health")) {
    return "A useful next step may be to reduce the pressure on yourself before trying to think your way through everything.";
  }

  if (themes.includes("home")) {
    return "A useful next step may be to choose one small practical thing to close, rather than stare at the whole pile.";
  }

  if (themes.includes("identity")) {
    return "A useful next step may be to soften the self-judgment first, because clearer thinking usually returns after that.";
  }

  return "A useful next step may be to pick the loudest thread first, instead of trying to untangle everything in one go.";
}

function buildNormalReflection(
  thoughts: string[],
  assessment: SafetyAssessment,
): ClearYourMindResponse {
  const cleanThoughts = thoughts
    .map((thought) => thought.trim())
    .filter(Boolean)
    .slice(0, 7);

  const themes = cleanThoughts.map(detectThoughtTheme);

  return {
    ok: true,
    isCrisisFallback: false,
    clarityFallback: false,
    reflection: {
      title: buildReflectionTitle(themes),
      summary: buildSummary(cleanThoughts, themes),
      structure: {
        recognition: buildRecognition(cleanThoughts, themes),
        untangling: buildUntangling(cleanThoughts, themes),
        gentleFrame: buildNextStep(cleanThoughts, themes),
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
    detectThoughtTheme,
    buildReflectionTitle,
    buildSummary,
    buildRecognition,
    buildUntangling,
    buildNextStep,
  };
}