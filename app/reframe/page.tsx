import Link from "next/link";
import ReframeSession from "@/components/reframe/ReframeSession";
import { getCurrentUser } from "@/lib/auth";
import PageShell from "@/components/PageShell";
import { ToolSeoContent, SeoH2, SeoDisclaimer } from "@/components/ToolSeoContent";

export const metadata = {
  title: "Thought Reframer — Challenge Negative Thoughts Online | Solace",
  description: "Free online tool to reframe negative thoughts. Challenge unhelpful thinking patterns and find a more balanced, accurate perspective.",
  openGraph: {
    title: "Thought Reframer — Solace",
    description: "Reframe negative thoughts and find clearer perspective.",
    url: "https://solace.digital/tools/thought-reframer",
  },
};

export default async function ReframePage() {
  const { userId } = await getCurrentUser();

  return (
    <PageShell>
      <div className="relative z-10 max-w-[780px] mx-auto px-6 pt-[140px] pb-28">

        {/* ── Tool header ──────────────────────────────────────────────────── */}
        <header className="text-center mb-14">
          <p className="[font-family:var(--font-jost)] text-[10px] tracking-[0.26em] uppercase text-[rgba(130,185,140,0.42)] mb-3">
            Clear your mind
          </p>
          <h1 className="[font-family:var(--font-display)] font-light text-[clamp(36px,5vw,56px)] text-[rgba(210,235,215,0.92)] leading-tight mb-5">
            One thought. Seen clearly.
          </h1>
          <p className="[font-family:var(--font-jost)] text-[14px] font-light text-[rgba(130,185,140,0.5)] max-w-[460px] mx-auto leading-relaxed">
            Write the thought that keeps showing up. We&apos;ll look at it together
            — carefully, without judgment.
          </p>
        </header>

        {/* ── Interactive session — client component ────────────────────────── */}
        <ReframeSession userId={userId ?? null} />

        {/* ── Human line ───────────────────────────────────────────────────── */}
        <p className="text-center [font-family:var(--font-display)] italic font-light text-[clamp(16px,2.2vw,20px)] text-[rgba(130,185,140,0.32)] mt-4 mb-20 max-w-[440px] mx-auto leading-relaxed">
          You can&apos;t think your way out of every feeling. But you can see it
          more clearly.
        </p>

        {/* ── Other tools cross-links ───────────────────────────────────────── */}
        <section>
          <p className="text-center [font-family:var(--font-jost)] text-[9px] tracking-[0.24em] uppercase text-[rgba(130,155,145,0.32)] mb-6">
            Other tools
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/breathing"
              className="group rounded-[14px] p-7 border border-[rgba(130,185,140,0.1)] bg-[linear-gradient(145deg,#0a1812,#0c1e14,#081410)] hover:border-[rgba(130,185,140,0.26)] transition-all duration-500"
            >
              <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.18em] uppercase text-[rgba(130,185,140,0.42)] mb-2.5">
                When I need to calm down
              </p>
              <p className="[font-family:var(--font-display)] font-light text-[21px] text-[rgba(210,235,215,0.85)]">
                Breathing
              </p>
            </Link>
            <Link
              href="/sleep"
              className="group rounded-[14px] p-7 border border-[rgba(130,185,140,0.1)] bg-[linear-gradient(145deg,#0a1812,#0c1e14,#081410)] hover:border-[rgba(130,185,140,0.26)] transition-all duration-500"
            >
              <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.18em] uppercase text-[rgba(130,185,140,0.42)] mb-2.5">
                Before sleep
              </p>
              <p className="[font-family:var(--font-display)] font-light text-[21px] text-[rgba(210,235,215,0.85)]">
                Sleep Wind-Down
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
            name: "Thought Reframer — Solace",
            applicationCategory: "HealthApplication",
            operatingSystem: "Web browser",
            offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
          }),
        }}
      />

      <ToolSeoContent h1="Thought reframing — challenge negative thoughts and find clarity">
        <p>A thought is not a fact. This sounds obvious until you are inside one. When your mind produces &quot;I always fail at this&quot; or &quot;nobody wants me around,&quot; those statements feel like observations, not interpretations. The job of thought reframing is not to replace them with false positives — it is to look at them clearly and ask: is this actually true?</p>
        <SeoH2>What thought reframing is — and what it is not</SeoH2>
        <p>Reframing is not positive thinking. It is the practice of examining a thought with the same scepticism you would apply to a claim someone else made. The most common unhelpful patterns have names: catastrophising (assuming the worst), all-or-nothing thinking (everything is good or bad), mind-reading (assuming you know what others think), and personalisation (taking responsibility for things outside your control). Naming the pattern is half the work.</p>
        <SeoH2>How to use this tool</SeoH2>
        <p>Write the thought exactly as it appears in your head — not a polished version, the raw one. Then work through the questions: What evidence supports this thought? What contradicts it? What would you say to a friend who thought this? What is a more complete version of the truth? You will not eliminate the thought. But you may loosen its grip.</p>
        <SeoH2>When thought reframing helps most</SeoH2>
        <p>Reframing works best on repetitive thoughts — the ones that keep returning. The thought that wakes you at 3am, the one that surfaces whenever you face something difficult. These are the ones worth examining.</p>
        <SeoDisclaimer>This tool provides reflective support only. It is not therapy. If you are experiencing persistent distressing thoughts, please speak with a qualified mental health professional.</SeoDisclaimer>
      </ToolSeoContent>
    </PageShell>
  );
}
