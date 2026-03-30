import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  applySlidingWindowRateLimit,
  getClientIdentifierFromHeaders,
} from "@/lib/solace/rate-limit";
import {
  buildSharedClarityPayload,
  classifySharedSolaceThoughts,
} from "@/lib/solace/safety/shared";
import { classifySolaceToolIntent } from "@/lib/solace/routing/tool-intent";
import { buildContextLead } from "@/lib/solace/break-it-down/context";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ResponseType =
  | {
      type: "normal";
      lead: string;
      steps: string[];
    }
  | {
      type: "gibberish";
      lead: string;
      steps: string[];
    }
  | {
      type: "redirect";
      lead: string;
      steps: string[];
      redirectTarget?: "choose" | "clear-your-mind" | "break-it-down";
      redirectTitle?: string;
    }
  | {
      type: "support";
      lead: string;
      message: string;
      steps?: string[];
    };

type Intent =
  | "buy"
  | "sell"
  | "find"
  | "plan"
  | "start"
  | "learn"
  | "clean"
  | "renovate"
  | "move"
  | "fix"
  | "general";

type Tone =
  | "everyday"
  | "interesting"
  | "big"
  | "heavy"
  | "gentle";

const BREAK_IT_DOWN_RATE_LIMIT = 5;
const BREAK_IT_DOWN_RATE_WINDOW_MS = 60_000;

function extractInputFromUnknown(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  const body = value as Record<string, unknown>;

  const directCandidates = [
    body.input,
    body.text,
    body.problem,
    body.message,
    body.prompt,
    body.value,
    body.query,
    body.content,
  ];

  for (const candidate of directCandidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  const nestedCandidates = [body.data, body.payload, body.body, body.form, body.fields];

  for (const nested of nestedCandidates) {
    const nestedResult = extractInputFromUnknown(nested);
    if (nestedResult) {
      return nestedResult;
    }
  }

  return "";
}

function normalizeInput(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

function looksLikeGibberish(text: string) {
  const clean = text.toLowerCase().trim();

  if (clean.length < 3) return true;

  const words = clean.split(/\s+/);
  const onlySymbols = /^[^a-zA-Z]+$/.test(clean);
  const noVowel = !/[aeiou]/i.test(clean);
  const repeatedNoise = /^([a-z]{1,3})\1{2,}$/i.test(clean.replace(/\s/g, ""));
  const longRandomChunk =
    words.length <= 3 &&
    words.every((w) => w.length > 6) &&
    !/[aeiou]{2,}/i.test(clean);

  return onlySymbols || noVowel || repeatedNoise || longRandomChunk;
}

function looksLikeDecision(text: string) {
  const clean = text.toLowerCase();

  // "better" and "between" alone are too broad — only treat as decision signals
  // when paired with clear choice language (or/vs/whether/which)
  const hasBetterInChoiceContext =
    /\bbetter\b/.test(clean) && /\b(or|vs|which|whether)\b/.test(clean);
  const hasBetweenInChoiceContext =
    /\bbetween\b/.test(clean) && /\b(or|vs|which|choose|decide|option)\b/.test(clean);

  return (
    /\bshould i\b/.test(clean) ||
    /\bwhich (is|one|option|do)\b/.test(clean) ||
    /\bchoose\b/.test(clean) ||
    /\bdecide\b/.test(clean) ||
    hasBetterInChoiceContext ||
    hasBetweenInChoiceContext ||
    /\boption\b/.test(clean) ||
    /\bvs\b/.test(clean)
  );
}

function isInterpersonalHarmRisk(text: string) {
  const clean = text.toLowerCase();

  return (
    /\bget rid of someone\b/.test(clean) ||
    /\bget rid of him\b/.test(clean) ||
    /\bget rid of her\b/.test(clean) ||
    /\bremove someone\b/.test(clean) ||
    /\beliminate someone\b/.test(clean) ||
    /\bhurt someone\b/.test(clean) ||
    /\bkill him\b/.test(clean) ||
    /\bkill her\b/.test(clean) ||
    /\bkill them\b/.test(clean) ||
    /\bmake .* disappear\b/.test(clean)
  );
}

function isEmergencyRisk(text: string) {
  const clean = text.toLowerCase();

  return (
    /\bno breathing\b/.test(clean) ||
    /\bnot breathing\b/.test(clean) ||
    /\bisn't breathing\b/.test(clean) ||
    /\bisnt breathing\b/.test(clean) ||
    /\bnot able to breathe\b/.test(clean) ||
    /\bcan't breathe\b/.test(clean) ||
    /\bcant breathe\b/.test(clean) ||
    /\bdifficult breathing\b/.test(clean) ||
    /\btrouble breathing\b/.test(clean) ||
    /\bstruggling to breathe\b/.test(clean) ||
    /\bshortness of breath\b/.test(clean) ||
    /\bhard to breathe\b/.test(clean) ||
    /\bstop breathing\b/.test(clean)
  );
}

function isUnrealisticGoal(text: string) {
  const clean = text.toLowerCase();

  return (
    /\bgo to the moon\b/.test(clean) ||
    /\bgo to moon\b/.test(clean) ||
    /\bgo to mars\b/.test(clean) ||
    /\blive on mars\b/.test(clean) ||
    /\bbecome immortal\b/.test(clean) ||
    /\blive forever\b/.test(clean) ||
    /\btime travel\b/.test(clean) ||
    /\bfly without\b/.test(clean)
  );
}

function classifyIntent(text: string): Intent {
  const clean = text.toLowerCase();

  if (/\bbuy\b|\bpurchase\b/.test(clean)) return "buy";
  if (/\bsell\b/.test(clean)) return "sell";
  if (/\bfind\b|\blook for\b/.test(clean)) return "find";
  if (/\bplan\b|\borganis(e|ing)\b/.test(clean)) return "plan";
  if (/\bstart\b|\bbegin\b|\blaunch\b|\bbuild\b|\bcreate\b/.test(clean)) return "start";
  if (/\blearn\b|\bstudy\b|\bunderstand\b/.test(clean)) return "learn";
  if (/\bclean\b|\btidy\b/.test(clean)) return "clean";
  if (/\brenovat(e|ion|ing)\b|\bremodel\b/.test(clean)) return "renovate";
  if (/\bmove\b|\bmoving\b/.test(clean)) return "move";
  if (/\bfix\b|\bimprove\b|\bsort out\b/.test(clean)) return "fix";

  return "general";
}

function isHighComplexity(text: string) {
  const clean = text.toLowerCase();

  return (
    /\bhouse\b/.test(clean) ||
    /\bhome\b/.test(clean) ||
    /\bmortgage\b/.test(clean) ||
    /\bbusiness\b/.test(clean) ||
    /\bcareer\b/.test(clean) ||
    /\bdivorce\b/.test(clean) ||
    /\bfuneral\b/.test(clean) ||
    /\bcancer\b/.test(clean) ||
    /\bwedding\b/.test(clean) ||
    /\brenovat(e|ion|ing)\b/.test(clean) ||
    /\bbathroom\b/.test(clean) ||
    /\bkitchen\b/.test(clean) ||
    /\bhorse\b/.test(clean) ||
    /\btractor\b/.test(clean) ||
    /\bfarm\b/.test(clean) ||
    /\bplanet\b/.test(clean) ||
    /\bpurpose of life\b/.test(clean)
  );
}

function getDepth(text: string) {
  const clean = text.toLowerCase();

  if (isHighComplexity(clean)) return 4;

  const moderateSignals = [
    /\bfor my\b/,
    /\bwith\b/,
    /\bon a tight budget\b/,
    /\bfrom scratch\b/,
    /\bbasic\b/,
    /\bnew\b/,
    /\bbetter\b/,
  ].filter((pattern) => pattern.test(clean)).length;

  if (moderateSignals >= 2) return 3;
  return 2;
}

function getTone(text: string): Tone {
  const clean = text.toLowerCase();

  if (
    /\bfuneral\b|\bbury\b|\bdad\b|\bpassed away\b|\bdeath\b/.test(clean) ||
    /\bdivorce\b/.test(clean) ||
    /\bcancer\b|\bstage 4\b|\bterminal\b/.test(clean)
  ) {
    return "heavy";
  }

  if (
    /\bhorse\b|\btractor\b|\bchicken farm\b|\bplanet\b|\bpurpose of life\b|\bai\b/.test(clean)
  ) {
    return "interesting";
  }

  if (
    /\bhouse\b|\bhome\b|\bbusiness\b|\bcareer\b|\bwedding\b|\brenovat(e|ion|ing)\b/.test(clean)
  ) {
    return "big";
  }

  if (/\bgrief\b|\bloss\b|\bsick\b|\bwife\b|\bhusband\b/.test(clean)) {
    return "gentle";
  }

  return "everyday";
}

function capSteps(steps: string[], max: number) {
  return steps.slice(0, max);
}

function buildHeavyResponse(lower: string, depth: number): ResponseType | null {
  if (/\bfuneral\b|\bbury\b/.test(lower)) {
    return {
      type: "normal",
      lead:
        "I’m really sorry you’re having to hold this right now, so let’s keep it simple and do the next few things first.",
      steps: capSteps(
        [
          "Get the key details in one place: full name, date of birth, date of death, where he is now, any wishes he left, and who in the family needs to help make decisions.",
          "Choose a funeral director today and ask them to walk you through what must happen first, what papers are needed, and what they can handle for you.",
          "Decide the basics: burial or cremation, religious or non-religious, location, and a rough date, then tell close family so the main decisions are settled.",
          "Make one short list for the service: who will speak, what music to use, what clothes he should wear, and any notice or message that needs to be shared.",
          "Ask two people to take jobs off your hands, like calling relatives, dealing with flowers, food, transport, or paperwork, so you are not carrying all of it alone.",
        ],
        depth,
      ),
    };
  }

  if (/\bdivorce\b/.test(lower)) {
    return {
      type: "normal",
      lead: "This is a lot, so start with clarity and protection before anything else.",
      steps: capSteps(
        [
          "Get clear on the immediate practical issues: money, living arrangements, and children if relevant.",
          "Gather the key documents before emotions make that harder.",
          "Get proper legal advice early so you know where you stand.",
          "Tell only the people who need to know first.",
        ],
        depth,
      ),
    };
  }

  if (/\bcancer\b|\bstage 4\b|\bterminal\b/.test(lower)) {
    return {
      type: "normal",
      lead: "I’m really sorry. You do not need to carry all of this at once.",
      steps: capSteps(
        [
          "Focus first on the medical conversations and what the next few months may look like.",
          "Write down the practical things that need attention: support, paperwork, finances, and care.",
          "Ask one or two trusted people to help with specific jobs instead of trying to hold everything yourself.",
          "Make space for the time that matters most, not just the admin.",
        ],
        depth,
      ),
    };
  }

  return null;
}

function buildInterestingResponse(lower: string, depth: number): ResponseType | null {
  if (/\bhorse\b/.test(lower)) {
    return {
      type: "normal",
      lead: "This is an interesting one. Start with purpose and cost before looking at actual horses.",
      steps: capSteps(
        [
          "Decide what the horse is for: riding, competition, learning, or companionship.",
          "Work out both the buying budget and the ongoing costs.",
          "Get advice from someone experienced before choosing a specific horse.",
          "Only shortlist options that fit your level, purpose, and budget.",
        ],
        depth,
      ),
    };
  }

  if (/\btractor\b/.test(lower)) {
    return {
      type: "normal",
      lead: "A used tractor can save you a lot of money, but only if you buy one that fits your field and won’t keep breaking down.",
      steps: capSteps(
        [
          "Start with the jobs you need it for: bed prep, hauling, spraying, mowing, or running tools, then choose the right size, horsepower, and 2WD or 4WD for your land.",
          "Set a full budget before shopping, including repairs, new tires, transport, and any tools or attachments you still need.",
          "Look for models that are common in your area, because parts and mechanics will be easier to find when something goes wrong.",
          "Check the machine in person: start it cold, watch for smoke, test the gears, steering, brakes, hydraulics, PTO, and look underneath for leaks or bad welds.",
          "If it seems close to right, bring a trusted mechanic or experienced farmer to inspect it before you pay, and ask for service records or proof of ownership.",
        ],
        depth,
      ),
    };
  }

  if (/\bai\b/.test(lower)) {
    return {
      type: "normal",
      lead: "This is a great area to learn, but it gets easier if you keep it simple at the start.",
      steps: capSteps(
        [
          "Start with the basic ideas: what AI is, what models do, and where people use it.",
          "Learn the common terms before going deeper.",
          "Use one beginner-friendly source instead of jumping between ten.",
          "Test what you learn with simple real examples.",
        ],
        depth,
      ),
    };
  }

  if (/\bchicken farm\b|\bfarm\b/.test(lower)) {
    return {
      type: "normal",
      lead:
        "This is a big and interesting project. Start with scale, setup, and viability before dreaming too far ahead.",
      steps: capSteps(
        [
          "Decide whether this is small-scale, side-income, or full business.",
          "Check land, local rules, and the basic setup you would need.",
          "Work out the real costs before thinking about growth.",
          "Start with a simple first version, not the finished dream.",
        ],
        depth,
      ),
    };
  }

  if (/\bpurpose of life\b|\bmeaning of life\b/.test(lower)) {
    return {
      type: "normal",
      lead:
        "That’s a deep one. Don’t try to solve it all at once — start by getting closer to what matters to you.",
      steps: capSteps(
        [
          "Write down the moments in life that have felt most real or meaningful to you.",
          "Notice what you care about enough to keep coming back to.",
          "Stop looking for one giant answer and look for direction instead.",
          "Choose one small thing that feels worth building your life around right now.",
        ],
        depth,
      ),
    };
  }

  if (/\bplanet\b/.test(lower)) {
    return {
      type: "normal",
      lead: "This is a fascinating one. Start by turning the huge idea into a smaller, workable question.",
      steps: capSteps(
        [
          "Decide what you actually mean: discovery, research, life conditions, or public information.",
          "Choose one angle only instead of chasing the whole topic.",
          "Find the best source for that one angle.",
          "Build from there step by step.",
        ],
        depth,
      ),
    };
  }

  return null;
}

function buildIntentResponse(
  intent: Intent,
  tone: Tone,
  lower: string,
  depth: number,
): ResponseType {
  if (intent === "buy" && /\bhouse\b|\bhome\b/.test(lower)) {
    return {
      type: "normal",
      lead:
        tone === "big"
          ? "Buying a house is a big one. Start with your numbers and your non-negotiables before looking too far ahead."
          : "Start with budget and must-haves first.",
      steps: capSteps(
        [
          "Work out your real budget, including fees and buffer.",
          "Check what you can actually borrow before falling in love with a place.",
          "Decide your non-negotiables like area, size, layout, or future suitability.",
          "Only shortlist homes that fit both your finances and your life.",
        ],
        depth,
      ),
    };
  }

  if (intent === "buy") {
    return {
      type: "normal",
      lead:
        tone === "interesting"
          ? "This is an interesting purchase. Start with purpose and limits before comparing options."
          : "Start with budget and what matters most.",
      steps: capSteps(
        [
          "Set your budget first.",
          "Decide what this needs to do well.",
          "List your non-negotiables.",
          "Compare only a few realistic options.",
        ],
        depth,
      ),
    };
  }

  if (intent === "sell" && /\bhouse\b|\bhome\b/.test(lower)) {
    return {
      type: "normal",
      lead: "If you want the best price possible, preparation matters just as much as timing.",
      steps: capSteps(
        [
          "Check what similar properties have actually sold for.",
          "Fix anything obvious that weakens first impressions.",
          "Make the place look clean, bright, and simple.",
          "Choose the selling strategy that fits your timing and market.",
        ],
        depth,
      ),
    };
  }

  if (intent === "sell") {
    return {
      type: "normal",
      lead: "Start with value, presentation, and timing.",
      steps: capSteps(
        [
          "Work out the realistic value first.",
          "Improve what will affect first impressions most.",
          "Make the offer or item easy to understand.",
          "Choose the right time and strategy to sell.",
        ],
        depth,
      ),
    };
  }

  if (intent === "find" && /\bgym\b/.test(lower)) {
    return {
      type: "normal",
      lead: "The best gym is usually the one you’ll actually keep using.",
      steps: capSteps(
        [
          "Decide your non-negotiables like location, price, and opening hours.",
          "Check which gyms match those basics.",
          "Shortlist 2 or 3 realistic options.",
          "Visit one before signing up.",
        ],
        depth,
      ),
    };
  }

  if (intent === "find" && /\bgirlfriend\b|\bboyfriend\b|\bpartner\b|\bdating\b/.test(lower)) {
    return {
      type: "normal",
      lead: "This is personal, so start by improving the chances, not by forcing quick results.",
      steps: capSteps(
        [
          "Get clear on what kind of person and relationship you actually want.",
          "Spend more time in places where meeting people naturally makes sense.",
          "Make one improvement to how you present yourself.",
          "Talk to more people without putting too much pressure on each interaction.",
        ],
        depth,
      ),
    };
  }

  if (intent === "find") {
    return {
      type: "normal",
      lead:
        tone === "interesting"
          ? "This is an interesting search. Narrow the field before you try to solve all of it."
          : "Start by narrowing the search.",
      steps: capSteps(
        [
          "Decide the 2 or 3 things that matter most.",
          "Limit yourself to a few realistic options only.",
          "Compare those options instead of everything available.",
          "Choose the best fit and move forward.",
        ],
        depth,
      ),
    };
  }

  if (intent === "plan" && /\bwedding\b/.test(lower)) {
    return {
      type: "normal",
      lead: "Planning a wedding gets much lighter once the big decisions are fixed first.",
      steps: capSteps(
        [
          "Set the most you can realistically spend.",
          "Work out roughly how many people you want there.",
          "Choose the kind of wedding you want before looking at details.",
          "Shortlist 2 or 3 venues that fit your budget and size.",
        ],
        depth,
      ),
    };
  }

  if (intent === "plan") {
    return {
      type: "normal",
      lead:
        tone === "interesting"
          ? "This is a fun one, but it still gets easier when the big pieces are locked first."
          : "Start with the basics before the details.",
      steps: capSteps(
        [
          "Set the budget or limits first.",
          "Decide the key people, dates, or scope.",
          "Shortlist the main options.",
          "Leave smaller details until those are clear.",
        ],
        depth,
      ),
    };
  }

  if (intent === "start" && /\bcareer\b/.test(lower)) {
    return {
      type: "normal",
      lead: "Starting a new career is a big move. Begin with direction, not with panic.",
      steps: capSteps(
        [
          "Work out what kind of work you actually want to move toward.",
          "Check what skills or experience are missing.",
          "Choose the shortest realistic way to close the biggest gap.",
          "Start building evidence that matches the new direction.",
        ],
        depth,
      ),
    };
  }

  if (intent === "start" && /\bbusiness\b|\bcompany\b/.test(lower)) {
    return {
      type: "normal",
      lead:
        "Starting a business gets easier once you stop thinking about everything at once and focus on what must work first.",
      steps: capSteps(
        [
          "Get clear on what problem it solves and for whom.",
          "Define a simple offer before building extras.",
          "Work out how the first customers would find you.",
          "Test the idea before investing heavily in branding or systems.",
        ],
        depth,
      ),
    };
  }

  if (intent === "start") {
    return {
      type: "normal",
      lead:
        tone === "big"
          ? "This is a big change, so start with the foundation, not the extras."
          : "Start with the first pieces that make the rest possible.",
      steps: capSteps(
        [
          "Get clear on what you are really trying to begin.",
          "Work out what needs to exist first.",
          "Ignore the nice-to-have parts for now.",
          "Build the simplest first version that lets you move.",
        ],
        depth,
      ),
    };
  }

  if (intent === "learn") {
    return {
      type: "normal",
      lead:
        tone === "interesting"
          ? "This is worth learning, but keep the first step simple."
          : "Start with the basics, then build from there.",
      steps: capSteps(
        [
          "Choose one beginner-friendly source.",
          "Learn the core terms before trying to go deep.",
          "Use real examples to test what you are understanding.",
          "Only then go further.",
        ],
        depth,
      ),
    };
  }

  if (intent === "clean" && /\bhouse\b|\bhome\b/.test(lower)) {
    return {
      type: "normal",
      lead: "Cleaning the whole house gets easier once you stop treating it like one giant job.",
      steps: capSteps(
        [
          "Start with the room that will make the biggest visible difference.",
          "Clear clutter before deep cleaning anything.",
          "Work one zone at a time instead of bouncing around.",
          "Leave low-impact areas until the end.",
        ],
        depth,
      ),
    };
  }

  if (intent === "clean") {
    return {
      type: "normal",
      lead: "Start with the area that will change the feeling fastest.",
      steps: capSteps(
        [
          "Choose one zone only.",
          "Remove what does not belong there.",
          "Clean the visible surfaces next.",
          "Leave the rest until that area feels done.",
        ],
        depth,
      ),
    };
  }

  if (intent === "renovate" && /\bbathroom\b/.test(lower)) {
    return {
      type: "normal",
      lead:
        "Bathroom renovations feel heavy because they mix cost, layout, trades, and finishes. Start with the core constraints first.",
      steps: capSteps(
        [
          "Set a realistic budget range.",
          "Decide what must stay and what must change in the layout.",
          "Separate essential work from nice-to-have upgrades.",
          "Only then start selecting products and finishes.",
        ],
        depth,
      ),
    };
  }

  if (intent === "renovate") {
    return {
      type: "normal",
      lead: "Start with scope, budget, and what really needs to change.",
      steps: capSteps(
        [
          "Get clear on what must change.",
          "Set the budget before looking at too many options.",
          "Separate essential work from extras.",
          "Handle layout and practicality before aesthetics.",
        ],
        depth,
      ),
    };
  }

  if (intent === "move") {
    return {
      type: "normal",
      lead: "Moving feels less chaotic when the main jobs are visible in one place.",
      steps: capSteps(
        [
          "Lock the moving date first.",
          "List the big jobs: packing, transport, cleaning, and address changes.",
          "Pack essentials separately.",
          "Leave non-urgent sorting until after the move.",
        ],
        depth,
      ),
    };
  }

  if (intent === "fix") {
    return {
      type: "normal",
      lead: "Start with what is causing the most pressure.",
      steps: capSteps(
        [
          "Work out what is creating the biggest problem.",
          "Focus on the one change that would help most.",
          "Test that first before changing everything else.",
          "Review after a few days and adjust.",
        ],
        depth,
      ),
    };
  }

  return {
    type: "normal",
    lead:
      tone === "interesting"
        ? "This is an interesting one. Start by turning it into a few workable parts."
        : tone === "big"
          ? "This is a bigger task, so the first step is to narrow it properly."
          : "Start with the part that will make the rest easier.",
    steps: capSteps(
      [
        "Get clear on what a good result would look like.",
        "List the 2 or 3 parts that matter most.",
        "Start with the part that will unblock the rest.",
        "Leave the extras until the basics are moving.",
      ],
      depth,
    ),
  };
}

async function generateAiBreakdown(input: string): Promise<{ lead: string; steps: string[] } | null> {
  try {
    const prompt = `
You are Solace.

You sound like a very close friend who truly cares.
You are calm, clear, grounded, and practical.
You do not sound robotic, clinical, corporate, dramatic, or salesy.

The user gives one thing they need to deal with.

Your job:
- understand what is really going on
- write one short lead sentence that feels human and specific
- write exactly 3 simple steps for the free version
- do not repeat the user's exact words unless absolutely necessary
- keep the language very easy to understand
- no fluff
- no therapy tone
- no questions
- no encouragement of harmful, illegal, violent, deceptive, or abusive behaviour
- no advice that helps harm a person
- no emergency or medical instructions
- no headings inside the content
- no bullet symbols
- no long paragraphs

Return exactly in this format:

LEAD: one sentence here
STEPS:
1. first step
2. second step
3. third step

User input:
${input}
`;

    const aiCall = openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: prompt,
      max_output_tokens: 200,
    });
    const aiTimeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("AI_UNAVAILABLE")), 10_000),
    );
    const response = await Promise.race([aiCall, aiTimeout]);

    const text = (response.output_text || "").trim();
    if (!text) return null;

    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const leadLine = lines.find((line) => /^LEAD:/i.test(line));
    const stepsStart = lines.findIndex((line) => /^STEPS:/i.test(line));

    const lead = leadLine ? leadLine.replace(/^LEAD:\s*/i, "").trim() : "";
    const steps =
      stepsStart >= 0
        ? lines
            .slice(stepsStart + 1)
            .map((line) => line.replace(/^\d+[\.\)]\s*/, "").trim())
            .filter(Boolean)
            .slice(0, 3)
        : [];

    if (!lead || steps.length === 0) {
      return null;
    }

    return { lead, steps };
  } catch (err) {
    const e = err as { status?: number };
    if (e.status === 429) console.warn("[solace] Break It Down: OpenAI rate limit (429)");
    throw new Error("AI_UNAVAILABLE");
  }
}

async function buildResponse(rawInput: string): Promise<ResponseType> {
  const input = normalizeInput(rawInput);
  const lower = input.toLowerCase();

  if (isEmergencyRisk(lower)) {
    return {
      type: "support",
      lead: "Take a moment",
      message:
        "This sounds urgent and needs real-world help right now. Please contact emergency services or immediate local support right now.",
    };
  }

  if (isInterpersonalHarmRisk(lower)) {
    return {
      type: "support",
      lead: "Take a moment",
      message:
        "This sounds like a situation involving harm. Solace cannot help with that. Please pause and reach out to someone you trust or a qualified professional.",
    };
  }

  const sharedSafety = classifySharedSolaceThoughts([input]);

  if (sharedSafety.mode === "support") {
    return {
      type: "support",
      lead: "Take a moment",
      message:
        "It sounds like you may be going through something very difficult. Solace is not equipped for crisis support. Please reach out to a trusted person or a qualified professional who can support you right now.",
    };
  }

  if (sharedSafety.mode === "clarity" || looksLikeGibberish(lower)) {
    const clarity = buildSharedClarityPayload();

    return {
      type: "gibberish",
      lead: clarity.title,
      steps: [clarity.message],
    };
  }

  if (isUnrealisticGoal(lower)) {
    return {
      type: "redirect",
      lead:
        "If you mean this seriously, the first move is turning a huge idea into the next real step you can take here.",
      steps: [],
      redirectTarget: "choose",
      redirectTitle: "This may need a different kind of tool",
    };
  }

  const routing = classifySolaceToolIntent({
    currentTool: "break-it-down",
    text: input,
  });

  if (
    routing.shouldRedirect &&
    routing.redirectTarget &&
    routing.title &&
    routing.message
  ) {
    return {
      type: "redirect",
      lead: routing.message,
      steps: [],
      redirectTarget: routing.redirectTarget,
      redirectTitle: routing.title,
    };
  }

  if (looksLikeDecision(lower)) {
    return {
      type: "redirect",
      lead: "This sounds more like a decision than something to break into steps.",
      steps: [],
      redirectTarget: "choose",
      redirectTitle: "This sounds more like a decision",
    };
  }

  const aiBreakdown = await generateAiBreakdown(input);
  if (aiBreakdown) {
    const contextLead = buildContextLead(input);

    return {
      type: "normal",
      lead: contextLead || aiBreakdown.lead,
      steps: aiBreakdown.steps,
    };
  }

  const depth = getDepth(input);

  const heavyResponse = buildHeavyResponse(lower, depth);
  if (heavyResponse) {
    return {
      ...heavyResponse,
      type: "normal",
      steps: (heavyResponse.steps ?? []).slice(0, 3),
    };
  }

  const interestingResponse = buildInterestingResponse(lower, depth);
  if (interestingResponse) {
    return {
      ...interestingResponse,
      type: "normal",
      steps: (interestingResponse.steps ?? []).slice(0, 3),
    };
  }

  const intent = classifyIntent(lower);
  const tone = getTone(lower);
  const base = buildIntentResponse(intent, tone, lower, depth);
  const contextLead = buildContextLead(input);

  return {
    ...base,
    steps: (base.steps ?? []).slice(0, 3),
    lead: contextLead || base.lead,
  };
}

function buildRateLimitResponse(resetAt: number): NextResponse {
  const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));

  const response = NextResponse.json(
    {
      error: "Too many reflections in a short time. Please wait a minute and try again.",
    },
    { status: 429 },
  );

  response.headers.set("Retry-After", String(retryAfterSeconds));
  response.headers.set("X-RateLimit-Limit", String(BREAK_IT_DOWN_RATE_LIMIT));
  response.headers.set("X-RateLimit-Remaining", "0");
  response.headers.set("X-RateLimit-Reset", String(resetAt));

  return response;
}

function applyRateLimitHeaders(response: NextResponse, remaining: number, resetAt: number) {
  response.headers.set("X-RateLimit-Limit", String(BREAK_IT_DOWN_RATE_LIMIT));
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  response.headers.set("X-RateLimit-Reset", String(resetAt));

  return response;
}

export async function POST(req: Request) {
  try {
    if (req.headers.get("X-Solace-Age-Confirmed") !== "1") {
      return NextResponse.json(
        { error: "This tool is designed for adults only." },
        { status: 403 },
      );
    }

    const clientKey = getClientIdentifierFromHeaders(req.headers);
    const rateLimit = applySlidingWindowRateLimit(
      clientKey,
      BREAK_IT_DOWN_RATE_LIMIT,
      BREAK_IT_DOWN_RATE_WINDOW_MS,
    );

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit.resetAt);
    }

    const rawBodyText = await req.text();

    let parsedBody: unknown = null;

    try {
      parsedBody = rawBodyText ? JSON.parse(rawBodyText) : null;
    } catch {
      parsedBody = rawBodyText;
    }

    const input = extractInputFromUnknown(parsedBody);

    if (!input) {
      const response = NextResponse.json(
        {
          error: "No usable input was found in the request body.",
        },
        { status: 400 },
      );

      return applyRateLimitHeaders(response, rateLimit.remaining, rateLimit.resetAt);
    }

    const result = await buildResponse(input);
    const response = NextResponse.json(result, { status: 200 });

    return applyRateLimitHeaders(response, rateLimit.remaining, rateLimit.resetAt);
  } catch (error) {
    if (error instanceof Error && error.message === "AI_UNAVAILABLE") {
      return NextResponse.json(
        { error: "unavailable", message: "This tool is temporarily resting." },
        { status: 503 },
      );
    }

    console.error("Solace Break It Down API error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while generating the reflection.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}