import Link from "next/link";
import MoodSession from "@/components/mood/MoodSession";
import { getCurrentUser } from "@/lib/auth";
import PageShell from "@/components/PageShell";
import { ToolSeoContent, SeoH2, SeoDisclaimer } from "@/components/ToolSeoContent";

export const metadata = {
  title: "Daily Mood Tracker Online | Emotional Wellbeing Journal — Solace",
  description: "Track your daily mood and emotional patterns online. Free mood tracking with history and insights. Understand how you feel — and why.",
  openGraph: {
    title: "Mood Tracker — Solace",
    description: "Track your daily mood and discover patterns over time.",
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
        <p className="text-center [font-family:var(--font-display)] italic font-light text-[clamp(16px,2.2vw,20px)] text-[rgba(160,130,210,0.28)] mt-4 mb-20 max-w-[460px] mx-auto leading-relaxed">
          What you feel right now isn&apos;t permanent. But it&apos;s worth
          noticing.
        </p>

        {/* ── Other tools cross-links ───────────────────────────────────────── */}
        <section>
          <p className="text-center [font-family:var(--font-jost)] text-[9px] tracking-[0.24em] uppercase text-[rgba(140,120,180,0.28)] mb-6">
            Other tools
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/gratitude"
              className="group rounded-[14px] p-7 border border-[rgba(160,130,210,0.1)] bg-[linear-gradient(145deg,#100c1a,#140e20,#0e0a16)] hover:border-[rgba(160,130,210,0.26)] transition-all duration-500"
            >
              <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.18em] uppercase text-[rgba(160,130,210,0.42)] mb-2.5">
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
              <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.18em] uppercase text-[rgba(160,130,210,0.42)] mb-2.5">
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

      <ToolSeoContent h1="Daily mood tracker — understand your emotional patterns">
        <p>You cannot manage what you cannot see. Most people have a rough sense of how they have been feeling lately — good week, hard month — but the details are lost almost immediately. The bad afternoon disappears into the good morning. A mood tracker gives you back the details.</p>
        <SeoH2>Why tracking your mood matters</SeoH2>
        <p>Emotional patterns are real and legible — but only if you record them. Many people discover after a few weeks that their mood follows patterns they had never noticed: consistently lower on Sundays, better after exercise, worse in certain seasons. You cannot act on &quot;I have been feeling off&quot; but you can act on &quot;my mood drops every Sunday evening.&quot;</p>
        <SeoH2>How to use the mood tracker</SeoH2>
        <p>Check in once a day — the same time works best. Choose a number that reflects how you have felt in the last few hours, not just right now. Add a brief note if anything significant happened. The value is in the accumulation, not the precision of any single entry. With a week of entries, patterns start to emerge. With a month, they become clear.</p>
        <SeoH2>What to do with your mood data</SeoH2>
        <p>Look for correlations. Sleep, exercise, social contact, and work stress are the most common influences. When you have a low-mood stretch, look back at what was happening. Your own data is more accurate than any generalisation about what affects wellbeing.</p>
        <SeoDisclaimer>This tool provides reflective support only. If your mood has been significantly low for an extended period, please speak with a healthcare professional.</SeoDisclaimer>
      </ToolSeoContent>
    </PageShell>
  );
}
