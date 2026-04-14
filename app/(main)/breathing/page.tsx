import Link from "next/link";
import BreathingSession from "@/components/breathing/BreathingSession";
import { getCurrentUserId } from "@/lib/auth-user";
import { SOLACE_ROUTES }    from "@/lib/solace/routes";
import PageShell from "@/components/PageShell";
import { ToolSeoContent, SeoH2, SeoDisclaimer } from "@/components/ToolSeoContent";
import { glassBackground, getToolRgb } from "@/lib/design-tokens";

export const metadata = {
  title: "Guided Breathing for Anxiety | Calm Your Nervous System — Solace",
  description:
    "Guided breathing for anxiety, stress, and overwhelm. Calm your nervous system in 3-5 minutes with breathing patterns designed for clarity and steadiness.",
  openGraph: {
    title: "Calm Your Nervous System — Solace",
    description:
      "Guided breathing for anxiety, stress, and overwhelm to help you feel steady enough to think clearly.",
    url: "https://solace.digital/tools/breathing",
  },
};

export default async function BreathingPage() {
  const userId = await getCurrentUserId();

  return (
    <PageShell particles={false}>
      <div className="relative z-10 max-w-[780px] mx-auto px-6 pt-[68px] md:pt-[140px] pb-28">

        {/* ── Tool header ───────────────────────────────────────────────── */}
        <header className="text-center mb-2 md:mb-14">
          <p className="[font-family:var(--font-jost)] text-[10px] tracking-[0.26em] uppercase text-[rgba(100,195,218,0.80)] mb-2 md:mb-3">
            Calm your state
          </p>
          <h1 className="[font-family:var(--font-display)] font-light text-[26px] md:text-[clamp(36px,5vw,56px)] text-[rgba(225,242,248,0.92)] leading-tight">
            Breathe with intention.
          </h1>
        </header>

        {/* ── Interactive session — client component ────────────────────── */}
        <BreathingSession userId={userId ?? null} />

        {/* ── Human line ───────────────────────────────────────────────── */}
        <p className="text-center [font-family:var(--font-display)] italic font-light text-[clamp(16px,2.2vw,22px)] text-[rgba(255,255,255,0.65)] mt-4 mb-20 max-w-[440px] mx-auto leading-relaxed">
          Something settles when you breathe slowly. You already know this.
        </p>

        {/* ── Other tools cross-links ──────────────────────────────────── */}
        <section>
          <p className="text-center [font-family:var(--font-jost)] text-[12px] tracking-[0.24em] uppercase text-[rgba(130,155,168,0.32)] mb-6">
            Other tools
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href={SOLACE_ROUTES.clearYourMind}
              prefetch={false}
              className="group rounded-[14px] p-7 border border-[rgba(232,168,62,0.1)] hover:border-[rgba(232,168,62,0.26)] transition-all duration-500"
              style={{ background: glassBackground('clear') }}
            >
              <p className="[font-family:var(--font-jost)] text-[12px] tracking-[0.18em] uppercase mb-2.5"
                 style={{ color: `rgba(${getToolRgb('clear').replace(/, /g, ',')},0.42)` }}>
                When my mind won&apos;t stop
              </p>
              <p className="[font-family:var(--font-display)] font-light text-[21px] text-[rgba(245,232,210,0.85)]">
                Clear Your Mind
              </p>
            </Link>
            <Link
              href={SOLACE_ROUTES.breakItDown}
              prefetch={false}
              className="group rounded-[14px] p-7 border border-[rgba(124,111,205,0.1)] hover:border-[rgba(124,111,205,0.26)] transition-all duration-500"
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
            "@type": "HowTo",
            name: "How to do box breathing",
            description: "A guided breathing exercise to calm anxiety in minutes.",
            step: [
              { "@type": "HowToStep", name: "Inhale", text: "Breathe in for 4 counts." },
              { "@type": "HowToStep", name: "Hold", text: "Hold for 4 counts." },
              { "@type": "HowToStep", name: "Exhale", text: "Breathe out for 4 counts." },
              { "@type": "HowToStep", name: "Hold", text: "Hold for 4 counts." },
            ],
          }),
        }}
      />

      <ToolSeoContent h1="Calm your nervous system — guided breathing for clarity and steadiness">
        <p>
          When stress rises, breathing becomes shallow and fast. Your nervous
          system reads this as a threat. Breathing slowly, deeply, and
          intentionally sends the opposite signal. Solace guides you through
          breathing patterns designed to lower activation, so your body knows
          it&apos;s safe enough to think clearly.
        </p>
        <p>
          This isn&apos;t meditation. It&apos;s a biological reset. In 3-5
          minutes, the right breathing pattern shifts you from reactive panic
          toward grounded decision-making. You stay in control.
        </p>
        <SeoH2>Why breathing works for stress and anxiety</SeoH2>
        <p>
          Your nervous system controls breathing automatically, but you can
          hijack that circuit intentionally. Slow, deep breathing activates the
          vagus nerve, which tells your body to downshift from fight-or-flight
          toward rest-and-digest. Research shows controlled breathing reduces
          stress hormones within minutes. When stress is high, breathing is
          your fastest tool.
        </p>
        <SeoH2>How to use Solace&apos;s breathing tool</SeoH2>
        <p>
          Choose your pace: slow for deep calm, moderate for gentle reset,
          faster for energy. Follow the guide. Breathe in rhythm. Most users
          feel noticeably different within 3-5 minutes. Use it before difficult
          conversations, after bad news, or when you feel overwhelm rising.
        </p>
        <SeoH2>When to use this tool</SeoH2>
        <p>
          Before you make a decision you&apos;ll regret. After a conflict. When
          anxiety is rising. When your mind is racing and you need 5 minutes of
          steadiness. When the weight of everything feels too much.
        </p>
        <SeoDisclaimer>
          This tool provides breathing guidance only. It is not medical or
          mental health advice. If you experience chest pain or serious
          breathing difficulty, seek medical attention immediately.
        </SeoDisclaimer>
      </ToolSeoContent>
    </PageShell>
  );
}
