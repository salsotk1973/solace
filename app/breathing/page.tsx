import Link from "next/link";
import BreathingSession from "@/components/breathing/BreathingSession";
import { getCurrentUser }   from "@/lib/auth";
import { SOLACE_ROUTES }    from "@/lib/solace/routes";
import PageShell from "@/components/PageShell";
import { ToolSeoContent, SeoH2, SeoDisclaimer } from "@/components/ToolSeoContent";

export const metadata = {
  title: "Box Breathing Exercise Online | Breathing Tool — Solace",
  description: "Free box breathing and 4-7-8 breathing exercises online. Calm anxiety, reduce stress, and regain focus in minutes. No account needed.",
  openGraph: {
    title: "Box Breathing Exercise — Solace",
    description: "Calm your nervous system in minutes with guided breathing patterns.",
    url: "https://solace.digital/tools/breathing",
  },
};

export default async function BreathingPage() {
  const { userId } = await getCurrentUser();

  return (
    <PageShell>
      <div className="relative z-10 max-w-[780px] mx-auto px-6 pt-[140px] pb-28">

        {/* ── Tool header ───────────────────────────────────────────────── */}
        <header className="text-center mb-14">
          <p className="[font-family:var(--font-jost)] text-[10px] tracking-[0.26em] uppercase text-[rgba(100,195,218,0.38)] mb-3">
            Calm your state
          </p>
          <h1 className="[font-family:var(--font-display)] font-light text-[clamp(36px,5vw,56px)] text-[rgba(225,242,248,0.92)] leading-tight">
            Breathe with intention.
          </h1>
        </header>

        {/* ── Interactive session — client component ────────────────────── */}
        <BreathingSession userId={userId ?? null} />

        {/* ── Human line ───────────────────────────────────────────────── */}
        <p className="text-center [font-family:var(--font-display)] italic font-light text-[clamp(16px,2.2vw,22px)] text-[rgba(130,200,220,0.38)] mt-4 mb-20 max-w-[440px] mx-auto leading-relaxed">
          Something settles when you breathe slowly. You already know this.
        </p>

        {/* ── Other tools cross-links ──────────────────────────────────── */}
        <section>
          <p className="text-center [font-family:var(--font-jost)] text-[9px] tracking-[0.24em] uppercase text-[rgba(130,155,168,0.32)] mb-6">
            Other tools
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href={SOLACE_ROUTES.clearYourMind}
              className="group rounded-[14px] p-7 border border-[rgba(68,200,110,0.1)] bg-[linear-gradient(145deg,#0a1a12,#0d2018,#081610)] hover:border-[rgba(68,200,110,0.26)] transition-all duration-500"
            >
              <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.18em] uppercase text-[rgba(68,200,110,0.42)] mb-2.5">
                When my mind won&apos;t stop
              </p>
              <p className="[font-family:var(--font-display)] font-light text-[21px] text-[rgba(225,245,228,0.85)]">
                Clear Your Mind
              </p>
            </Link>
            <Link
              href={SOLACE_ROUTES.breakItDown}
              className="group rounded-[14px] p-7 border border-[rgba(218,148,48,0.1)] bg-[linear-gradient(145deg,#1a1008,#281808,#180e04)] hover:border-[rgba(218,148,48,0.26)] transition-all duration-500"
            >
              <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.18em] uppercase text-[rgba(218,148,48,0.42)] mb-2.5">
                When I feel overwhelmed
              </p>
              <p className="[font-family:var(--font-display)] font-light text-[21px] text-[rgba(245,232,215,0.85)]">
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

      <ToolSeoContent h1="Breathing exercises for anxiety, focus, and calm">
        <p>Your breath is one of the few things in your body you can consciously control — and that control reaches places most techniques cannot. When you slow your breathing deliberately, your nervous system follows. Heart rate drops. Cortisol falls. The part of your brain that has been screaming quiets down.</p>
        <p>This breathing tool offers three patterns, each designed for a different moment. You do not need experience. You just need to breathe along.</p>
        <SeoH2>Box breathing — the 4-4-4-4 technique</SeoH2>
        <p>Box breathing is used by Navy SEALs, surgeons, and anyone who needs to perform under pressure. Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. The hold phases activate the parasympathetic nervous system — the part of your body that signals safety. Four rounds is enough to feel a difference. Eight rounds is a reset.</p>
        <SeoH2>The 4-7-8 breathing method</SeoH2>
        <p>Inhale for 4, hold for 7, exhale for 8. The extended exhale directly stimulates the vagus nerve, triggering a calm response almost immediately. Many people find 4-7-8 more powerful for acute anxiety. The extended hold can feel uncomfortable at first. Stick with it.</p>
        <SeoH2>When to use breathing exercises</SeoH2>
        <p>Breathing exercises work best used before you need them — a daily five minutes builds baseline calm. But they work reactively too. The most common mistake is stopping too soon. Three to four complete cycles is where the shift begins.</p>
        <SeoDisclaimer>This tool provides reflective support only. It is not medical advice. If you are experiencing a mental health crisis, please contact a qualified professional or crisis service in your area.</SeoDisclaimer>
      </ToolSeoContent>
    </PageShell>
  );
}
