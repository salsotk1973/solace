import Link from "next/link";
import ToolCard     from "@/components/tools/ToolCard";
import FamilyGroup  from "@/components/tools/FamilyGroup";
import FaqAccordion from "@/components/tools/FaqAccordion";
import PageShell from "@/components/PageShell";
import BgSubtle from "@/components/backgrounds/BgSubtle";
import { CATEGORY_COLOURS, TEXT_COLOURS, FONT_SIZE, glassBackground } from "@/lib/design-tokens";

// ─── Colour helpers — no-space rgb strings for ToolCard's glass() function ────
const cRgb = CATEGORY_COLOURS.calm.rgb.replace(/, /g, ',')     // '60,192,212'
const xRgb = CATEGORY_COLOURS.clarity.rgb.replace(/, /g, ',')  // '232,168,62'
const dRgb = CATEGORY_COLOURS.decide.rgb.replace(/, /g, ',')   // '124,111,205'

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata = {
  title: "Mental Wellness Tools | Solace",
  description:
    "Nine tools for breathing, focus, sleep, thought reframing, mood tracking, gratitude, and AI-powered reflection. No account needed. Start anywhere.",
  keywords: [
    "free breathing exercise online",
    "pomodoro timer",
    "mood tracker",
    "gratitude journal online",
    "thought reframing",
    "sleep wind down",
    "mental wellness tools free",
    "clear your mind",
    "decision making tool",
  ],
  openGraph: {
    title: "Mental Wellness Tools | Solace",
    description:
      "Nine tools for the moments that matter. Free to try, no account needed.",
    url: "https://solace.app/tools",
  },
};

// ─── FAQ JSON-LD — enables Google FAQ rich results ────────────────────────────

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is box breathing and does it actually work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Box breathing is a simple pattern — 4 seconds in, 4 hold, 4 out, 4 hold. It gives your nervous system something to follow. Most people notice a shift within a few cycles.",
      },
    },
    {
      "@type": "Question",
      name: "Is Solace a therapy app?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Solace is designed for adults as a reflective support tool — not medical, psychological, or professional advice. If you're experiencing a mental health crisis, please reach out to a qualified professional or crisis service.",
      },
    },
    {
      "@type": "Question",
      name: "How is the Pomodoro technique different on Solace?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The mechanics are the same — 25 minutes of work, 5 of rest. The difference is the experience. Solace's Focus Timer is designed to feel like a calm container for your attention, not a productivity machine counting down at you.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need an account to use these tools?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Every tool is free to use without an account. An account lets you save your history, track streaks, and see patterns over time — but the core experience is always available.",
      },
    },
    {
      "@type": "Question",
      name: "What is cognitive reframing and is it safe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cognitive reframing is the practice of looking at a thought from a different angle — not to dismiss it, but to see it more clearly. Solace's Thought Reframer guides you through four gentle questions. It works best for everyday thinking patterns rather than clinical conditions.",
      },
    },
    {
      "@type": "Question",
      name: "What's the difference between free and paid?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All nine tools are free to try. A free account gives you 7 days of session history and one AI session per day with Choose. A paid account (A$9/month or A$79/year) unlocks full history, unlimited AI sessions, and mood patterns over time. Most people upgrade around day 8 — the moment history starts to matter.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data private?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Your sessions are stored only for you — we don't read them, sell them, or use them to train AI. AI tool sessions are processed in real time and not retained after your session ends. You can delete your account and all data at any time.",
      },
    },
    {
      "@type": "Question",
      name: "How do the AI tools work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Choose, Clear Your Mind, and Break It Down are powered by a language model. You type — the tool responds. Nothing is stored after your session. Free accounts get one Choose session per day. Clear Your Mind and Break It Down are available on a paid plan.",
      },
    },
  ],
};

// ─── Tool data ────────────────────────────────────────────────────────────────

// ─── Tool data — colours sourced from design tokens ──────────────────────────

const AI_REALMS = [
  {
    tag:      "When my mind won't stop",
    name:     "Clear Your Mind",
    line:     "Your thoughts are circling and you can't find the floor. Release them one by one and find what's actually there.",
    href:     "/tools/clear-your-mind",
    colour:   `rgba(${xRgb},1)`,   // clarity / gold
    bg:       glassBackground('clear'),
    minHeight: "260px",
  },
  {
    tag:      "When I can't decide",
    name:     "Choose",
    line:     "A decision keeps turning over in your mind. See it more clearly when the noise is removed.",
    href:     "/tools/choose",
    colour:   `rgba(${dRgb},1)`,   // decide / violet
    bg:       glassBackground('choose'),
    minHeight: "260px",
  },
  {
    tag:      "When I feel overwhelmed",
    name:     "Break It Down",
    line:     "Something feels too large to begin. Watch what seemed impossible become a sequence of steps.",
    href:     "/tools/break-it-down",
    colour:   `rgba(${dRgb},1)`,   // decide / violet
    bg:       glassBackground('breakdown'),
    minHeight: "260px",
  },
];

const CALM_YOUR_STATE = [
  {
    tag:       "Breathing",
    name:      "Breathing",
    line:      "Box breathing and 4-7-8. Calm your nervous system in minutes.",
    href:      "/breathing",
    colour:    `rgba(${cRgb},0.85)`,  // calm / teal
    tagColour: `rgba(${cRgb},0.75)`,
  },
  {
    tag:       "Focus",
    name:      "Focus Timer",
    line:      "25 minutes of work, 5 of rest. Four sessions and a long break.",
    href:      "/focus",
    colour:    `rgba(${xRgb},0.85)`,  // clarity / gold
    tagColour: `rgba(${xRgb},0.75)`,
  },
  {
    tag:       "Sleep",
    name:      "Sleep Wind-Down",
    line:      "4-8 breathing for the end of the day. Let the day go.",
    href:      "/sleep",
    colour:    `rgba(${cRgb},0.85)`,  // calm / teal
    tagColour: `rgba(${cRgb},0.75)`,
  },
];

const CLEAR_YOUR_MIND = [
  {
    tag:       "Thought Reframing",
    name:      "Thought Reframer",
    line:      "Four gentle questions that shift the angle on a thought that's stuck.",
    href:      "/reframe",
    colour:    `rgba(${xRgb},0.85)`,  // clarity / gold
    tagColour: `rgba(${xRgb},0.75)`,
  },
];

const NOTICE_WHATS_GOOD = [
  {
    tag:       "Mood",
    name:      "Mood Tracker",
    line:      "Check in once a day. Notice patterns over time.",
    href:      "/mood",
    colour:    `rgba(${xRgb},0.85)`,  // clarity / gold
    tagColour: `rgba(${xRgb},0.75)`,
  },
  {
    tag:       "Gratitude",
    name:      "Gratitude Log",
    line:      "Three things. Every day. Nothing more, nothing less.",
    href:      "/gratitude",
    colour:    `rgba(${xRgb},0.85)`,  // clarity / gold
    tagColour: `rgba(${xRgb},0.75)`,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ToolsPage() {
  return (
    <PageShell particles={false}>
      <BgSubtle>
        {/* FAQ JSON-LD — Google reads this from anywhere in the document */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        <div className="max-w-[900px] mx-auto px-6">

          {/* ── Hero ──────────────────────────────────────────────────────── */}
          <header className="text-center pt-[180px] pb-[48px]">
            <p
              className="text-[11px] tracking-[0.26em] uppercase mb-4"
              style={{ fontFamily: "var(--font-jost)", color: TEXT_COLOURS.secondary }}
            >
              Human Behaviour Lab
            </p>
            <h1
              className="font-light text-[clamp(38px,4.5vw,52px)] leading-tight mb-6"
              style={{ fontFamily: "var(--font-display)", color: TEXT_COLOURS.primary }}
            >
              Nine tools for the moments{" "}
              <em className="italic font-light" style={{ color: TEXT_COLOURS.secondary }}>
                that matter.
              </em>
            </h1>
            <p
              className="font-[300] text-[14px] max-w-[480px] mx-auto leading-relaxed"
              style={{ fontFamily: "var(--font-jost)", color: TEXT_COLOURS.body }}
            >
              Each tool is designed around a single moment — the anxious breath,
              the scattered mind, the end of a hard day. Start anywhere.
              Everything is free to try.
            </p>
          </header>

          {/* ── Tool families ─────────────────────────────────────────────── */}
          <section aria-label="Tools" className="flex flex-col gap-[40px] mb-24">

            <FamilyGroup label="AI-powered reflection" cols={3}>
              {AI_REALMS.map((t) => <ToolCard key={t.href} {...t} />)}
            </FamilyGroup>

            <FamilyGroup label="Calm your state" cols={3}>
              {CALM_YOUR_STATE.map((t) => <ToolCard key={t.href} {...t} />)}
            </FamilyGroup>

            <FamilyGroup label="Clear your mind" cols={1}>
              {CLEAR_YOUR_MIND.map((t) => <ToolCard key={t.href} {...t} />)}
            </FamilyGroup>

            <FamilyGroup label="Notice what's good" cols={2}>
              {NOTICE_WHATS_GOOD.map((t) => <ToolCard key={t.href} {...t} />)}
            </FamilyGroup>

          </section>

          {/* ── SEO content ───────────────────────────────────────────────── */}
          <section className="max-w-[680px] mx-auto mb-24">
            <h2
              className="font-light text-[32px] leading-snug mb-8"
              style={{ fontFamily: "var(--font-display)", color: TEXT_COLOURS.body }}
            >
              Nine mental wellness tools, designed around real moments.
            </h2>
            <div
              className="text-[14px] font-[300] leading-[1.9] space-y-5"
              style={{ fontFamily: "var(--font-jost)", color: TEXT_COLOURS.body }}
            >
              <p>
                Solace is a{" "}
                <strong className="font-[400]" style={{ color: TEXT_COLOURS.primary }}>
                  Human Behaviour Lab
                </strong>{" "}
                — a set of tools built around the specific moments when people
                need support most. Not therapy. Not journaling prompts. Tools
                that work in the moment you&apos;re in, whether that&apos;s
                anxiety before a meeting, a racing mind at midnight, or a low
                Tuesday afternoon with no obvious cause.
              </p>
              <p>
                Each tool is free to use. No account needed to start. The core
                experience — the breathing rhythm, the focus timer, the thought
                reframe — is always available. An account unlocks history,
                patterns, and streaks for the tools that benefit from them.
              </p>
            </div>
          </section>

          {/* ── FAQ ───────────────────────────────────────────────────────── */}
          <section className="max-w-[680px] mx-auto mb-24">
            <p
              className="text-[11px] tracking-[0.24em] uppercase mb-8"
              style={{ fontFamily: "var(--font-jost)", color: TEXT_COLOURS.secondary }}
            >
              Common questions
            </p>
            <FaqAccordion />
          </section>

          {/* ── Upgrade strip ─────────────────────────────────────────────── */}
          <p
            className="text-center text-[13px] font-[300] mb-24 max-w-[800px] mx-auto leading-relaxed whitespace-nowrap"
            style={{ fontFamily: "var(--font-jost)", color: TEXT_COLOURS.body }}
          >
            The free tools above are always free.{" "}
            <Link
              href="/pricing"
              className="underline underline-offset-2 transition-colors duration-200 text-white/80 hover:text-white"
            >
              A Solace account
            </Link>{" "}
            adds history, patterns, and streaks — A$9/month or A$79/year.
          </p>

        </div>
      </BgSubtle>
    </PageShell>
  );
}
