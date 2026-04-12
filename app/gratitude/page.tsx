import Link from "next/link";
import GratitudeSession from "@/components/gratitude/GratitudeSession";
import { getCurrentUser } from "@/lib/auth";
import PageShell from "@/components/PageShell";
import { ToolSeoContent, SeoH2, SeoDisclaimer } from "@/components/ToolSeoContent";

export const metadata = {
  title: "Gratitude Practice | Daily Gratitude Log — Solace",
  description:
    "A daily gratitude log for when life feels heavy. Build a gratitude practice that helps you notice what still matters without forcing positivity.",
  openGraph: {
    title: "Gratitude Log — Solace",
    description:
      "Find what still matters with a gratitude practice designed for hard seasons, not perfect days.",
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

      <ToolSeoContent h1="Find what still matters — gratitude practice for when life feels heavy">
        <p>
          When you&apos;re overwhelmed, gratitude can feel hollow. &quot;Be
          grateful&quot; sounds dismissive when you&apos;re drowning. But
          gratitude isn&apos;t about ignoring hard things. It&apos;s about
          noticing what&apos;s still good, what you&apos;re doing right, who
          shows up, what you&apos;ve built, so the weight doesn&apos;t consume
          all the light. Gratitude Log isn&apos;t forced positivity. It&apos;s
          remembering what&apos;s real alongside what&apos;s hard.
        </p>
        <p>
          This tool helps you anchor to what you value when circumstances are
          difficult. Not as a way to dismiss struggle, but as a way to stay
          grounded in the whole picture.
        </p>
        <SeoH2>Why gratitude practice shifts perspective</SeoH2>
        <p>
          Your brain&apos;s negativity bias evolved to keep you safe, it scans
          for threats. But in a complex life, that scan misses everything good.
          Gratitude practice isn&apos;t rewiring your brain to be fake-happy.
          It&apos;s deliberately widening your aperture so you see accurate
          data: the good is real too.
        </p>
        <SeoH2>How to use the gratitude log</SeoH2>
        <p>
          Daily, write 1-3 things. They don&apos;t have to be big. A good
          moment. A text from someone who matters. Work going smoothly. Your
          body cooperating. Someone believing in you. The practice isn&apos;t
          about forcing feeling grateful, it&apos;s about noticing what&apos;s
          there when you look.
        </p>
        <SeoH2>When to use this tool</SeoH2>
        <p>
          When overwhelm is making you forget what matters. When everything
          feels like failure. When you&apos;re in a hard season and need to
          remember you&apos;re not alone. When you need to re-anchor to what
          you&apos;re building and who matters. When gratitude feels harder
          than usual, that&apos;s actually when it matters most.
        </p>
        <SeoDisclaimer>
          This tool provides gratitude practice support only. It is not a
          replacement for therapy or professional mental health care. If you are
          experiencing depression, persistent low mood, or thoughts of
          self-harm, contact a qualified mental health professional or crisis
          service immediately.
        </SeoDisclaimer>
      </ToolSeoContent>
    </PageShell>
  );
}
