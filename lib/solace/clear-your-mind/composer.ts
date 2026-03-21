type Anchor =
  | "money_pressure"
  | "job_loss"
  | "work_pressure"
  | "family_distance"
  | "family_responsibility"
  | "relationship_tension"
  | "home_tension"
  | "self_image"
  | "practical_breakdown"
  | "health_strain"
  | "general_pressure";

type Reflection = {
  title: string;
  lines: [string, string, string];
};

type AnchorDescriptor = {
  id: Anchor;
  priority: number;
  fragment: string;
};

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function pushDescriptor(
  found: Map<Anchor, AnchorDescriptor>,
  id: Anchor,
  priority: number,
  fragment: string,
) {
  const existing = found.get(id);

  if (!existing || priority > existing.priority) {
    found.set(id, { id, priority, fragment });
  }
}

function extractAnchorDescriptors(thoughts: string[]): AnchorDescriptor[] {
  const found = new Map<Anchor, AnchorDescriptor>();

  for (const raw of thoughts) {
    const text = normalize(raw);

    if (
      hasAny(text, [
        /\b(bill|bills|rent|mortgage|debt|loan|money|cash|broke|financial|finance|expense|expenses|cost|costs|afford|affording)\b/i,
        /\bnot enough money\b/i,
      ])
    ) {
      const fragment = /\bbills?\b/i.test(text)
        ? "bills are piling up"
        : "money feels tight";
      pushDescriptor(found, "money_pressure", 90, fragment);
    }

    if (
      hasAny(text, [
        /\b(lost my job|lose my job|i lost my job|no job|jobless|unemployed|laid off|got fired|lost work)\b/i,
      ])
    ) {
      pushDescriptor(found, "job_loss", 100, "you've lost your job");
    }

    if (
      hasAny(text, [
        /\b(work|deadline|deadlines|workload|too much work|lots to do at work|too much at work|busy at work|office|client|clients|meeting|meetings|tasks)\b/i,
      ])
    ) {
      const fragment =
        /\b(too much work|lots to do at work|too much at work)\b/i.test(text)
          ? "work is piling up"
          : "work feels heavy";
      pushDescriptor(found, "work_pressure", 80, fragment);
    }

    if (
      hasAny(text, [
        /\b(family overseas|family far away|family abroad|miss my family|my family is overseas|mum overseas|mom overseas|parents overseas)\b/i,
        /\boverseas\b/i,
      ])
    ) {
      pushDescriptor(
        found,
        "family_distance",
        70,
        "part of your mind is still with family overseas",
      );
    }

    if (
      hasAny(text, [
        /\b(pregnant|baby on the way|new baby|kids|children|family responsibility|looking after family)\b/i,
        /\bwife pregnant\b/i,
        /\bpartner pregnant\b/i,
      ])
    ) {
      const fragment =
        /\b(pregnant|wife pregnant|partner pregnant|baby on the way)\b/i.test(text)
          ? "a baby is on the way too"
          : "family responsibility is sitting there as well";
      pushDescriptor(found, "family_responsibility", 75, fragment);
    }

    if (
      hasAny(text, [
        /\b(partner|relationship|marriage|husband|wife|boyfriend|girlfriend|breakup|divorce|arguing at home|relationship stress)\b/i,
      ])
    ) {
      pushDescriptor(found, "relationship_tension", 72, "there is strain close to home");
    }

    if (
      hasAny(text, [
        /\b(mother in law|mother-in-law|in law|in-law|living at home|crowded at home|no space at home|tension at home)\b/i,
      ])
    ) {
      pushDescriptor(found, "home_tension", 78, "home already feels full");
    }

    if (
      hasAny(text, [
        /\b(fat|ugly|body|look awful|hate my body|not fit|self conscious|feel gross|feel unattractive)\b/i,
      ])
    ) {
      pushDescriptor(
        found,
        "self_image",
        55,
        "some of this is landing on how you see yourself too",
      );
    }

    if (
      hasAny(text, [
        /\b(car broken|car is broken|broken car|house broken|something broken|washing machine broken|fridge broken|repair)\b/i,
      ])
    ) {
      pushDescriptor(found, "practical_breakdown", 60, "practical things keep breaking open");
    }

    if (
      hasAny(text, [
        /\b(health|sick|ill|doctor|hospital|pain|panic|anxiety|stressed|stress|tired|exhausted|breathing|hard to breathe)\b/i,
      ])
    ) {
      pushDescriptor(found, "health_strain", 85, "your system already sounds stretched");
    }
  }

  if (found.size === 0) {
    found.set("general_pressure", {
      id: "general_pressure",
      priority: 10,
      fragment: "a few things seem to be pressing on you at once",
    });
  }

  return Array.from(found.values()).sort((a, b) => b.priority - a.priority);
}

export function extractAnchors(thoughts: string[]): Anchor[] {
  return extractAnchorDescriptors(thoughts).map((item) => item.id);
}

function pickTopFragments(descriptors: AnchorDescriptor[], limit = 4): string[] {
  return descriptors.slice(0, limit).map((item) => item.fragment);
}

function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function joinWithFlow(fragments: string[]): string {
  if (fragments.length === 0) return "";
  if (fragments.length === 1) return fragments[0];
  if (fragments.length === 2) return `${fragments[0]}, and ${fragments[1]}`;
  return `${fragments[0]}, ${fragments[1]}, and ${fragments.slice(2).join(", ")}`;
}

function buildTitle(descriptors: AnchorDescriptor[]): string {
  const ids = descriptors.map((item) => item.id);

  if (ids.includes("job_loss") && ids.includes("money_pressure") && ids.length >= 3) {
    return "Too much is leaning on the same point";
  }

  if (ids.includes("money_pressure") && ids.includes("work_pressure")) {
    return "Money and work are colliding";
  }

  if (ids.includes("job_loss") && ids.includes("money_pressure")) {
    return "Losing work sharpens everything";
  }

  if (ids.includes("home_tension") && ids.includes("family_responsibility")) {
    return "Home already feels tight";
  }

  if (ids.length >= 4) {
    return "Too many things are sitting on top of each other";
  }

  if (ids.includes("money_pressure")) {
    return "Money pressure is taking up space";
  }

  if (ids.includes("work_pressure")) {
    return "Work pressure is following you around";
  }

  if (ids.includes("family_distance")) {
    return "Part of you is somewhere else";
  }

  return "This is carrying more weight than it should";
}

function buildLineOne(descriptors: AnchorDescriptor[]): string {
  const ids = descriptors.map((item) => item.id);

  if (
    ids.includes("money_pressure") &&
    ids.includes("job_loss") &&
    ids.includes("family_distance")
  ) {
    return "Bills are piling up, you've lost your job, and part of your mind is still with your family overseas.";
  }

  if (
    ids.includes("home_tension") &&
    ids.includes("money_pressure") &&
    ids.includes("family_responsibility")
  ) {
    return "Home already feels full, money pressure is there, and a baby is on the way too.";
  }

  if (
    ids.includes("money_pressure") &&
    ids.includes("job_loss") &&
    ids.includes("family_responsibility")
  ) {
    return "Bills are there, you've lost your job, and family responsibility is sitting on top of it all.";
  }

  if (ids.includes("money_pressure") && ids.includes("work_pressure")) {
    return "Money feels tight, and work is piling up at the same time.";
  }

  const fragments = pickTopFragments(descriptors, 4);
  return `${capitalize(joinWithFlow(fragments))}.`;
}

function buildLineTwo(descriptors: AnchorDescriptor[]): string {
  const ids = descriptors.map((item) => item.id);

  if (ids.includes("money_pressure") && ids.includes("job_loss")) {
    return "That kind of mix can make everything feel urgent, even before the day has properly begun.";
  }

  if (ids.includes("money_pressure") && ids.includes("work_pressure")) {
    return "When both stay loud together, even small things can start feeling like too much.";
  }

  if (ids.includes("home_tension") && ids.includes("family_responsibility")) {
    return "When home already feels tight, the pressure usually spreads into everything else as well.";
  }

  if (ids.length >= 4) {
    return "When several parts of life start pressing at once, it can feel like there is no clear place to stand.";
  }

  if (ids.includes("family_distance")) {
    return "That kind of distance can leave part of you emotionally elsewhere, even while life here keeps moving.";
  }

  if (ids.includes("self_image")) {
    return "That kind of weight often gets worse when it starts turning inward as well.";
  }

  return "That can make the whole situation feel heavier than any one part of it on its own.";
}

function buildLineThree(descriptors: AnchorDescriptor[]): string {
  const ids = descriptors.map((item) => item.id);

  if (ids.includes("job_loss") && ids.includes("money_pressure")) {
    return "Start with the one thing that gives you the most breathing room first, not the whole stack.";
  }

  if (ids.includes("money_pressure") && ids.includes("work_pressure")) {
    return "Pick one thing to steady first, and let the rest wait.";
  }

  if (ids.includes("home_tension") && ids.includes("family_responsibility")) {
    return "Try easing the one pressure point that would make home feel a little less tight first.";
  }

  if (ids.length >= 4) {
    return "You do not need to solve all of this at once — just choose the first piece that would ease the pressure a little.";
  }

  if (ids.includes("family_distance")) {
    return "It may help to focus on what is actually in front of you today, rather than everything your mind is carrying at once.";
  }

  return "Try to give your attention to the part that most needs it first, and leave the rest for later.";
}

export function composeReflection(thoughts: string[]): Reflection {
  const descriptors = extractAnchorDescriptors(thoughts);

  return {
    title: buildTitle(descriptors),
    lines: [
      buildLineOne(descriptors),
      buildLineTwo(descriptors),
      buildLineThree(descriptors),
    ],
  };
}