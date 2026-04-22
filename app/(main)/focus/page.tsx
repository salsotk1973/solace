import Link from "next/link";
import FocusTimer   from "@/components/focus/FocusTimer";
import { getCurrentUserId } from "@/lib/auth-user";
import { SOLACE_ROUTES }  from "@/lib/solace/routes";
import PageShell from "@/components/PageShell";
import { ToolSeoContent, SeoH2, SeoDisclaimer } from "@/components/ToolSeoContent";
import { glassBackground, getToolRgb } from "@/lib/design-tokens";

export const metadata = {
  title: "Deep Work Focus Timer | Focus Without Distraction — Solace",
  description:
    "A focus timer for deep work, time management, and focus without distraction. Built for demanding seasons when your attention is pulled in too many directions.",
  openGraph: {
    title: "Focus Timer — Solace",
    description:
      "Deep work without distraction with a focus timer designed for real life, real interruptions, and real mental load.",
    url: "https://solace.digital/tools/focus-timer",
  },
};

export default async function FocusPage() {
  const userId = await getCurrentUserId();

  return (
    <PageShell>
      <div className="relative z-10 max-w-[780px] mx-auto px-6 pt-[140px] pb-28">

        {/* ── Tool header ──────────────────────────────────────────────── */}
        <header className="text-center mb-5">
          <p className="[font-family:var(--font-jost)] text-[10px] tracking-[0.26em] uppercase text-[rgba(240,170,70,0.38)] mb-3">
            Calm your state
          </p>
          <h1 className="[font-family:var(--font-display)] font-light text-[clamp(36px,5vw,56px)] text-[rgba(250,240,225,0.92)] leading-tight mb-4">
            One thing. Done well.
          </h1>
          <p className="[font-family:var(--font-jost)] font-[300] text-[14px] text-[rgba(160,170,180,0.48)] max-w-[440px] mx-auto leading-relaxed">
            A Pomodoro timer for people who actually want to focus. 25 minutes of
            work, 5 of rest. Repeated until it&apos;s done.
          </p>
        </header>

        {/* ── Interactive timer — client component ──────────────────────── */}
        <div className="flex flex-col items-center mt-12">
          <FocusTimer userId={userId ?? null} />
        </div>

        {/* ── Human line ──────────────────────────────────────────────── */}
        <p className="text-center [font-family:var(--font-display)] italic font-light text-[clamp(16px,2.2vw,22px)] text-[rgba(255,255,255,0.65)] mb-20 max-w-[440px] mx-auto leading-relaxed">
          The work doesn&apos;t get easier. But the resistance does.
        </p>

        {/* ── Other tools cross-links — desktop only ─────────────────── */}
        <section className="hidden md:block">
          <p className="text-center [font-family:var(--font-jost)] text-[12px] tracking-[0.24em] uppercase text-[rgba(130,145,158,0.3)] mb-6">
            Other tools
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/breathing"
              className="rounded-[14px] p-7 border border-[rgba(60,192,212,0.1)] hover:border-[rgba(60,192,212,0.26)] transition-all duration-500"
              style={{ background: glassBackground('breathing') }}
            >
              <p className="[font-family:var(--font-jost)] text-[12px] tracking-[0.18em] uppercase mb-2.5"
                 style={{ color: `rgba(${getToolRgb('breathing').replace(/, /g, ',')},0.42)` }}>
                When I can&apos;t breathe
              </p>
              <p className="[font-family:var(--font-display)] font-light text-[21px] text-[rgba(225,240,245,0.85)]">
                Breathing
              </p>
            </Link>
            <Link
              href={SOLACE_ROUTES.breakItDown}
              className="rounded-[14px] p-7 border border-[rgba(124,111,205,0.1)] hover:border-[rgba(124,111,205,0.26)] transition-all duration-500"
              style={{ background: glassBackground('breakdown') }}
            >
              <p className="[font-family:var(--font-jost)] text-[12px] tracking-[0.18em] uppercase mb-2.5"
                 style={{ color: `rgba(${getToolRgb('breakdown').replace(/, /g, ',')},0.42)` }}>
                When I feel overwhelmed
              </p>
              <p className="[font-family:var(--font-display)] font-light text-[21px] text-[rgba(230,225,250,0.85)]">
                Break It Down
              </p>
            </Link>
          </div>
        </section>

      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Focus Timer — Solace",
            applicationCategory: "HealthApplication",
            operatingSystem: "Web browser",
            offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
          }),
        }}
      />

      <ToolSeoContent h1="Deep work without distraction — focus timer for anyone managing complex responsibilities">
        <p>
          When life is complex and demanding, work pressure, multiple
          responsibilities, competing needs, uninterrupted focus feels
          impossible. Your attention gets fragmented by context-switching,
          notifications, and the mental load of everything you&apos;re holding.
          A focus timer isn&apos;t about willpower. It&apos;s about structure
          that protects your time.
        </p>
        <p>
          Most focus timers are generic. This one is built for reality: real
          interruptions, real responsibilities, real distractions. It
          doesn&apos;t shame you for needing breaks. It helps you reclaim the
          focus you know you&apos;re capable of.
        </p>
        <SeoH2>Why deep work matters when you&apos;re overwhelmed</SeoH2>
        <p>
          Fragmented attention compounds stress. When you can&apos;t finish a
          thought, decisions take longer, mistakes creep in, and the mental
          load grows. One session of uninterrupted focus, 25 or 45 minutes,
          creates enough momentum to finish something real. Completion itself is
          calming.
        </p>
        <SeoH2>How to use the focus timer</SeoH2>
        <p>
          Set a duration. Remove distractions you can control. Honour the
          session. When it ends, take a real break. The structure isn&apos;t
          rigid, adjust duration to what works for your day. One good session
          beats a distracted afternoon.
        </p>
        <SeoH2>When to use this tool</SeoH2>
        <p>
          When you need to finish something important but keep getting pulled
          away. When you have limited time and need to make it count. When
          you&apos;ve been putting something off because everything feels too
          fragmented. When reclaiming focus feels like an act of self-respect.
        </p>
        <SeoDisclaimer>
          This tool provides time management support only. It is not a
          replacement for addressing underlying attention difficulties or sleep
          deprivation. If focus problems persist despite good sleep and reduced
          stress, consult a healthcare provider.
        </SeoDisclaimer>
      </ToolSeoContent>
    </PageShell>
  );
}
