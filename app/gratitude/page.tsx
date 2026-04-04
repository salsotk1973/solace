import Link from "next/link";
import GratitudeSession from "@/components/gratitude/GratitudeSession";
import { getCurrentUser } from "@/lib/auth";
import PageShell from "@/components/PageShell";
import { ToolSeoContent, SeoH2, SeoDisclaimer } from "@/components/ToolSeoContent";

export const metadata = {
  title: "Gratitude Journal Online | Daily Gratitude Log — Solace",
  description: "Free online gratitude journal. Log three things you are grateful for each day and build a searchable archive of good moments.",
  openGraph: {
    title: "Gratitude Log — Solace",
    description: "Daily gratitude journal to log and revisit what is good.",
    url: "https://solace.digital/tools/gratitude-log",
  },
};

export default async function GratitudePage() {
  const { userId } = await getCurrentUser();

  return (
    <PageShell>
      <div className="relative z-10 max-w-[780px] mx-auto px-6 pt-[140px] pb-28">

        {/* ── Tool header ──────────────────────────────────────────────────── */}
        <header className="text-center mb-14">
          <p className="[font-family:var(--font-jost)] text-[10px] tracking-[0.26em] uppercase text-[rgba(220,175,80,0.42)] mb-3">
            Notice what&apos;s good
          </p>
          <h1 className="[font-family:var(--font-display)] font-light text-[clamp(36px,5vw,56px)] text-[rgba(240,225,190,0.92)] leading-tight mb-5">
            One thing worth keeping.
          </h1>
          <p className="[font-family:var(--font-jost)] text-[14px] font-light text-[rgba(220,175,80,0.42)] max-w-[460px] mx-auto leading-relaxed">
            One small thing, every day. Watch them collect. Over time you&apos;ll
            have proof that good things were always there.
          </p>
        </header>

        {/* ── Interactive session — client component ────────────────────────── */}
        <GratitudeSession userId={userId ?? null} />

        {/* ── Human line ───────────────────────────────────────────────────── */}
        <p className="text-center [font-family:var(--font-display)] italic font-light text-[clamp(16px,2.2vw,20px)] text-[rgba(220,175,80,0.26)] mt-4 mb-20 max-w-[480px] mx-auto leading-relaxed">
          Gratitude isn&apos;t about pretending everything is fine. It&apos;s
          about finding what&apos;s real and good, even when it&apos;s small.
        </p>

        {/* ── Other tools cross-links ───────────────────────────────────────── */}
        <section>
          <p className="text-center [font-family:var(--font-jost)] text-[9px] tracking-[0.24em] uppercase text-[rgba(180,160,100,0.28)] mb-6">
            Other tools
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/mood"
              className="group rounded-[14px] p-7 border border-[rgba(220,175,80,0.1)] bg-[linear-gradient(145deg,#1a1408,#201808,#161004)] hover:border-[rgba(220,175,80,0.26)] transition-all duration-500"
            >
              <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.18em] uppercase text-[rgba(220,175,80,0.42)] mb-2.5">
                When I feel low
              </p>
              <p className="[font-family:var(--font-display)] font-light text-[21px] text-[rgba(240,225,185,0.85)]">
                Mood Tracker
              </p>
            </Link>
            <Link
              href="/reframe"
              className="group rounded-[14px] p-7 border border-[rgba(220,175,80,0.1)] bg-[linear-gradient(145deg,#1a1408,#201808,#161004)] hover:border-[rgba(220,175,80,0.26)] transition-all duration-500"
            >
              <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.18em] uppercase text-[rgba(220,175,80,0.42)] mb-2.5">
                When a thought won&apos;t leave
              </p>
              <p className="[font-family:var(--font-display)] font-light text-[21px] text-[rgba(240,225,185,0.85)]">
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
            name: "Gratitude Log — Solace",
            applicationCategory: "HealthApplication",
            operatingSystem: "Web browser",
            offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
          }),
        }}
      />

      <ToolSeoContent h1="Gratitude journal — a daily log of what is good">
        <p>Gratitude practice has a reputation problem. Strip away the candles and motivational quotes and what remains is genuinely useful: a daily practice of directing attention toward what is working, rather than defaulting to what is not.</p>
        <SeoH2>What the research actually says</SeoH2>
        <p>Studies consistently show that people who regularly write down things they are grateful for report higher life satisfaction, better sleep, and lower stress — not because their circumstances improve, but because their attention does. Your brain has a negativity bias — it notices threats more readily than positives. Gratitude practice is a deliberate counter to that bias. It trains your attention to give equal time to what is good.</p>
        <SeoH2>How to make it work</SeoH2>
        <p>Three things, once a day. The time matters less than the consistency. The one mistake people make is staying on the surface. &quot;Good coffee&quot; counts — but &quot;the conversation where my friend actually listened&quot; goes deeper and works better. Specificity is the active ingredient.</p>
        <SeoH2>What happens over time</SeoH2>
        <p>After a few weeks, something subtle shifts. You start noticing things during the day that you might put in tonight&apos;s entry. The practice moves from reactive to proactive — you are not just recording good things, you are looking for them. This is the real benefit.</p>
        <SeoDisclaimer>This tool provides reflective support only. It is not a substitute for professional support if you are going through a significant difficulty.</SeoDisclaimer>
      </ToolSeoContent>
    </PageShell>
  );
}
