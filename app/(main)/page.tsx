import Link from "next/link";
import { HeroSection } from "@/components/HeroSection";
import FeaturedLabCard, { type FeaturedLabArticle } from "@/components/home/FeaturedLabCard";
import { CATEGORY_COLOURS } from "@/lib/design-tokens";

// ─── Colour helpers derived from design tokens ────────────────────────────────
// Tailwind className strings must be static — values below mirror CATEGORY_COLOURS exactly.
// Inline style values (borderLeftColor, etc.) use template literals for live derivation.

const { calm, clarity, decide } = CATEGORY_COLOURS;

type AiTool = {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  themeClass: string;
  borderLeftColor: string;
  eyebrowColor: string;
  ctaColor: string;
};

// Static Tailwind class strings — rgb values match CATEGORY_COLOURS tokens
const AI_TOOLS: AiTool[] = [
  {
    eyebrow: "WHEN MY MIND WON'T STOP",
    title: "Clear Your Mind",
    body: "Your thoughts are circling and you can't find the floor. Release them one by one, watch them take shape, and find what's actually there.",
    href: "/tools/clear-your-mind",
    // clarity / gold — rgba(232,168,62)
    themeClass:
      "border-[rgba(232,168,62,0.20)] bg-[rgba(232,168,62,0.06)] hover:border-[rgba(232,168,62,0.35)] hover:bg-[rgba(232,168,62,0.09)] hover:shadow-[0_12px_36px_rgba(232,168,62,0.10)]",
    borderLeftColor: `rgba(${clarity.rgb},0.5)`,
    eyebrowColor:    `rgba(${clarity.rgb},0.7)`,
    ctaColor:        `rgba(${clarity.rgb},0.78)`,
  },
  {
    eyebrow: "WHEN I CAN'T DECIDE",
    title: "Choose",
    body: "A decision keeps turning over in your mind. Two paths, one answer — seen with more clarity when the noise is removed.",
    href: "/tools/choose",
    // decide / violet — rgba(124,111,205)
    themeClass:
      "border-[rgba(124,111,205,0.20)] bg-[rgba(124,111,205,0.06)] hover:border-[rgba(124,111,205,0.35)] hover:bg-[rgba(124,111,205,0.09)] hover:shadow-[0_12px_36px_rgba(124,111,205,0.10)]",
    borderLeftColor: `rgba(${decide.rgb},0.5)`,
    eyebrowColor:    `rgba(${decide.rgb},0.7)`,
    ctaColor:        `rgba(${decide.rgb},0.78)`,
  },
  {
    eyebrow: "WHEN I FEEL OVERWHELMED",
    title: "Break It Down",
    body: "Something feels too large to begin. Watch what seemed impossible become a sequence of steps you can actually take.",
    href: "/tools/break-it-down",
    // decide / violet — rgba(124,111,205)
    themeClass:
      "border-[rgba(124,111,205,0.20)] bg-[rgba(124,111,205,0.06)] hover:border-[rgba(124,111,205,0.35)] hover:bg-[rgba(124,111,205,0.09)] hover:shadow-[0_12px_36px_rgba(124,111,205,0.10)]",
    borderLeftColor: `rgba(${decide.rgb},0.5)`,
    eyebrowColor:    `rgba(${decide.rgb},0.7)`,
    ctaColor:        `rgba(${decide.rgb},0.78)`,
  },
];

const FREE_TOOLS = [
  { name: "Breathing",        href: "/tools/breathing",        tone: "calm"    as const },
  { name: "Focus Timer",      href: "/tools/focus-timer",      tone: "clarity" as const },
  { name: "Sleep Wind-Down",  href: "/tools/sleep-wind-down",  tone: "calm"    as const },
  { name: "Thought Reframer", href: "/tools/thought-reframer", tone: "clarity" as const },
  { name: "Mood Tracker",     href: "/tools/mood-tracker",     tone: "clarity" as const },
  { name: "Gratitude Log",    href: "/tools/gratitude-log",    tone: "clarity" as const },
];

// Static Tailwind className strings — rgb values match CATEGORY_COLOURS tokens
const FREE_TOOL_THEME: Record<
  "calm" | "clarity" | "decide",
  { className: string; accent: string; arrow: string }
> = {
  // calm / teal — rgba(60,192,212)
  calm: {
    className:
      "border-[rgba(60,192,212,0.22)] bg-[rgba(60,192,212,0.045)] hover:border-[rgba(60,192,212,0.34)] hover:bg-[rgba(60,192,212,0.07)]",
    accent: `rgba(${calm.rgb},0.55)`,
    arrow:  `rgba(${calm.rgb},0.72)`,
  },
  // clarity / gold — rgba(232,168,62)
  clarity: {
    className:
      "border-[rgba(232,168,62,0.22)] bg-[rgba(232,168,62,0.045)] hover:border-[rgba(232,168,62,0.34)] hover:bg-[rgba(232,168,62,0.07)]",
    accent: `rgba(${clarity.rgb},0.55)`,
    arrow:  `rgba(${clarity.rgb},0.72)`,
  },
  // decide / violet — rgba(124,111,205)
  decide: {
    className:
      "border-[rgba(124,111,205,0.22)] bg-[rgba(124,111,205,0.045)] hover:border-[rgba(124,111,205,0.34)] hover:bg-[rgba(124,111,205,0.07)]",
    accent: `rgba(${decide.rgb},0.55)`,
    arrow:  `rgba(${decide.rgb},0.72)`,
  },
};

const FEATURED_LAB: FeaturedLabArticle = {
  title: "Why you can't stop overthinking",
  slug: "why-you-cant-stop-overthinking",
  category: "think-clearly",
  excerpt: "Your brain isn't broken. It's doing exactly what it was designed to do — just at the wrong moment.",
  readingTime: 6,
};

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#030712",
        color: "white",
        position: "relative",
        isolation: "isolate",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 18%, rgba(57,84,138,0.148) 0%, rgba(57,84,138,0.087) 28%, rgba(57,84,138,0.029) 54%, rgba(3,7,18,0) 78%), radial-gradient(ellipse 44% 38% at 18% 72%, rgba(45,212,191,0.040) 0%, rgba(45,212,191,0.018) 42%, rgba(3,7,18,0) 76%), radial-gradient(ellipse 42% 38% at 82% 74%, rgba(99,102,241,0.045) 0%, rgba(99,102,241,0.020) 42%, rgba(3,7,18,0) 76%), linear-gradient(180deg, #030712 0%, #050a14 48%, #030712 100%)",
        }}
      />
      <div
        className="relative z-10"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto",
        }}
      >
        <HeroSection />

        <section id="tools" className="ai-tools-section pt-12 pb-10 md:pt-16 md:pb-14">
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
            <p
              className="text-[10px] tracking-[0.24em] uppercase text-[rgba(174,168,205,0.62)]"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400 }}
            >
              WHEN YOU NEED CLARITY
            </p>

            <h3
              className="ai-section-headline mt-5 text-4xl md:text-5xl font-light leading-[1.15] text-[rgba(236,232,248,0.92)]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Start from <em className="italic">how it feels</em> — not what it is.
            </h3>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {AI_TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`ai-tool-card group relative rounded-2xl border border-l-2 backdrop-blur-sm p-6 min-h-[280px] flex flex-col transform-gpu transition-all duration-300 ease-out hover:-translate-y-1.5 ${tool.themeClass}`}
                  style={{ borderLeftColor: tool.borderLeftColor }}
                >
                  <p
                    className="text-[10px] tracking-[0.16em] uppercase"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 400,
                      color: tool.eyebrowColor,
                    }}
                  >
                    {tool.eyebrow}
                  </p>
                  <p
                    className="mt-4 text-[34px] leading-[1.02] text-[rgba(240,236,252,0.95)]"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 300,
                    }}
                  >
                    {tool.title}
                  </p>
                  <p
                    className="mt-4 text-[14px] leading-[1.85] text-[rgba(203,197,228,0.76)]"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    {tool.body}
                  </p>
                  <span
                    className="mt-auto pt-6 text-[12px] tracking-[0.1em] uppercase transition-all duration-200 opacity-50 group-hover:opacity-90 group-hover:translate-x-1"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 400,
                      color: tool.ctaColor,
                    }}
                  >
                    Open tool →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="free-tools" className="free-tools-section pb-16 md:pb-24">
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
            <p
              className="text-[10px] tracking-[0.2em] uppercase text-[rgba(174,168,205,0.5)]"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400 }}
            >
              FREE — START HERE
            </p>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FREE_TOOLS.map((tool) => (
                <a
                  key={tool.href}
                  href={tool.href}
                  className={`free-tool-card group relative overflow-hidden rounded-xl border px-5 py-4 text-[rgba(217,211,238,0.88)] transition-all duration-200 ease-out hover:-translate-y-0.5 flex items-center justify-between gap-4 ${FREE_TOOL_THEME[tool.tone].className}`}
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 300,
                    fontSize: "14px",
                  }}
                >
                  <span>{tool.name}</span>
                  <span
                    aria-hidden="true"
                    className="transition-all duration-200 opacity-45 group-hover:opacity-80 group-hover:translate-x-1"
                    style={{ color: FREE_TOOL_THEME[tool.tone].arrow }}
                  >
                    →
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 left-4 right-4 h-px"
                    style={{ background: FREE_TOOL_THEME[tool.tone].accent }}
                  />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="lab-teaser" className="py-8 md:py-10">
          <div className="max-w-[860px] mx-auto px-6 md:px-12 lg:px-24">
            <p
              className="mb-4 text-[10px] tracking-[0.24em] uppercase text-[rgba(174,168,205,0.62)]"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400 }}
            >
              From the Lab
            </p>
            <FeaturedLabCard article={FEATURED_LAB} />
          </div>
        </section>
      </div>
    </main>
  );
}
