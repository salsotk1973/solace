import Link from "next/link";
import MoodSession from "@/components/mood/MoodSession";
import { getCurrentUser } from "@/lib/auth";
import PageShell from "@/components/PageShell";
import { ToolSeoContent, SeoH2, SeoDisclaimer } from "@/components/ToolSeoContent";

export const metadata = {
  title: "Mood Tracking to Understand Emotional Patterns — Solace",
  description:
    "Mood tracking that helps you understand patterns in stress, sleep, and wellbeing. Track your mood and connect it to real life context.",
  openGraph: {
    title: "Mood Tracker — Solace",
    description:
      "Understand your emotional patterns with mood tracking that reveals what actually affects your wellbeing.",
    url: "https://solace.digital/tools/mood-tracker",
  },
};

export default async function MoodPage() {
  const { userId } = await getCurrentUser();

  return (
    <PageShell>
      <div className="relative z-10 max-w-[780px] mx-auto px-6 pt-[140px] pb-28">

        {/* ── Tool header ──────────────────────────────────────────────────── */}
        <header className="text-center mb-14">
          <p className="[font-family:var(--font-jost)] text-[10px] tracking-[0.26em] uppercase text-[rgba(160,130,210,0.42)] mb-3">
            Check in
          </p>
          <h1 className="[font-family:var(--font-display)] font-light text-[clamp(36px,5vw,56px)] text-[rgba(215,200,240,0.92)] leading-tight mb-5">
            How are you, right now?
          </h1>
          <p className="[font-family:var(--font-jost)] text-[14px] font-light text-[rgba(160,130,210,0.48)] max-w-[420px] mx-auto leading-relaxed">
            One number. One word. A small act of noticing — done every day, it
            becomes a map of where you&apos;ve been.
          </p>
        </header>

        {/* ── Interactive session — client component ────────────────────────── */}
        <MoodSession userId={userId ?? null} />

        {/* ── Human line ───────────────────────────────────────────────────── */}
        <p className="text-center [font-family:var(--font-display)] italic font-light text-[clamp(16px,2.2vw,20px)] text-[rgba(255,255,255,0.65)] mt-4 mb-20 max-w-[460px] mx-auto leading-relaxed">
          What you feel right now isn&apos;t permanent. But it&apos;s worth
          noticing.
        </p>

        {/* ── Other tools cross-links ───────────────────────────────────────── */}
        <section>
          <p className="text-center [font-family:var(--font-jost)] text-[12px] tracking-[0.24em] uppercase text-[rgba(140,120,180,0.28)] mb-6">
            Other tools
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/gratitude"
              className="group rounded-[14px] p-7 border border-[rgba(160,130,210,0.1)] bg-[linear-gradient(145deg,#100c1a,#140e20,#0e0a16)] hover:border-[rgba(160,130,210,0.26)] transition-all duration-500"
            >
              <p className="[font-family:var(--font-jost)] text-[12px] tracking-[0.18em] uppercase text-[rgba(160,130,210,0.42)] mb-2.5">
                When I want to find the good
              </p>
              <p className="[font-family:var(--font-display)] font-light text-[21px] text-[rgba(215,200,240,0.85)]">
                Gratitude Log
              </p>
            </Link>
            <Link
              href="/reframe"
              className="group rounded-[14px] p-7 border border-[rgba(160,130,210,0.1)] bg-[linear-gradient(145deg,#100c1a,#140e20,#0e0a16)] hover:border-[rgba(160,130,210,0.26)] transition-all duration-500"
            >
              <p className="[font-family:var(--font-jost)] text-[12px] tracking-[0.18em] uppercase text-[rgba(160,130,210,0.42)] mb-2.5">
                When a thought won&apos;t go away
              </p>
              <p className="[font-family:var(--font-display)] font-light text-[21px] text-[rgba(215,200,240,0.85)]">
                Thought Reframer
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
            name: "Mood Tracker — Solace",
            applicationCategory: "HealthApplication",
            operatingSystem: "Web browser",
            offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
          }),
        }}
      />

      <ToolSeoContent h1="Understand your patterns — mood tracking that reveals what actually affects your wellbeing">
        <p>
          You know your mood fluctuates, but you might not know why. One day
          you&apos;re steady, the next you&apos;re overwhelmed. Is it sleep?
          Stress? Unmet needs? When you&apos;re managing multiple demands, mood
          tracking feels like one more thing. But it&apos;s actually the
          opposite. It&apos;s the clarity tool that shows you what actually
          matters for your steadiness.
        </p>
        <p>
          Most mood trackers ask &quot;how do you feel?&quot; and leave you
          hanging. This one helps you connect mood to context, so patterns
          emerge. Over time, you see what genuinely affects you, and what you
          can influence.
        </p>
        <SeoH2>Why understanding your patterns matters</SeoH2>
        <p>
          When life is complex, you lose track of what triggers and stabilises
          you. Mood tracking creates the data you need to make better choices.
          You see that sleep matters more than you thought. That certain
          conversations drain you more than others. That some people energise
          you and others leave you empty. That&apos;s not weakness,
          that&apos;s information.
        </p>
        <SeoH2>How to use the mood tracker</SeoH2>
        <p>
          Check in once or twice daily. Rate your mood simply. Add one note if
          you want: sleep quality, what happened, what you need. Over weeks,
          patterns show up. You&apos;ll notice what stabilises you and what
          destabilises you. Use that knowledge to protect yourself.
        </p>
        <SeoH2>When to use this tool</SeoH2>
        <p>
          If mood shifts feel unpredictable. If you&apos;re not sure what
          helps. If you want to connect your feelings to your life
          circumstances. If you&apos;re trying to understand whether something
          is a phase or a pattern. If you want data for conversations with
          healthcare providers.
        </p>
        <SeoDisclaimer>
          This tool provides mood tracking support only. It is not a diagnostic
          tool and does not replace professional mental health assessment. If
          you experience persistent low mood, unusual mood changes, or thoughts
          of self-harm, contact a qualified mental health professional or crisis
          service.
        </SeoDisclaimer>
      </ToolSeoContent>
    </PageShell>
  );
}
