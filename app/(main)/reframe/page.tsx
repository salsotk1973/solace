import Link from "next/link";
import ReframeSession from "@/components/reframe/ReframeSession";
import { getCurrentUserId } from "@/lib/auth-user";
import PageShell from "@/components/PageShell";
import { ToolSeoContent, SeoH2, SeoDisclaimer } from "@/components/ToolSeoContent";

export const metadata = {
  title: "Reframe Anxious Thoughts | Cognitive Reframing Tool — Solace",
  description:
    "Reframe thoughts when anxious thinking, self-doubt, or catastrophising takes over. A cognitive reframing tool for clearer perspective and steadier thinking.",
  openGraph: {
    title: "Thought Reframer — Solace",
    description:
      "Shift perspective when self-doubt and anxious thinking get loud with guided cognitive reframing.",
    url: "https://solace.digital/tools/thought-reframer",
  },
};

export default async function ReframePage() {
  const userId = await getCurrentUserId();

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

      <ToolSeoContent h1="Reframe anxious thoughts — shift perspective when self-doubt takes over">
        <p>
          Anxious thinking follows patterns. You imagine the worst. You
          catastrophise small mistakes. You assume others are judging you. These
          thought spirals feel like facts, but they&apos;re habits your brain
          learned under stress. Reframing isn&apos;t positive thinking. It&apos;s
          stepping back from the spiral to see what&apos;s actually true.
        </p>
        <p>
          When you&apos;re overwhelmed, anxious thoughts get louder. This tool
          helps you notice the pattern, question it, and find a steadier
          perspective. Not forced optimism, just clarity.
        </p>
        <SeoH2>Why anxious thinking intensifies under pressure</SeoH2>
        <p>
          Under stress and complexity, your brain learns to scan for danger.
          That same vigilance that once kept you safe now creates false alarms.
          Every possibility feels like a probability. Every small thing feels
          like evidence that you&apos;re failing. This tool helps you separate
          signal from noise.
        </p>
        <SeoH2>How to use the thought reframer</SeoH2>
        <p>
          Name the thought you&apos;re stuck in. Write it out. Then examine it:
          is this fact or story? What evidence contradicts it? What would I tell
          a friend in this situation? The reframe isn&apos;t dismissing your
          feeling, it&apos;s shifting from spiral to assessment.
        </p>
        <SeoH2>When to use this tool</SeoH2>
        <p>
          When you&apos;re catastrophising a conversation. When self-doubt is
          loud. When you&apos;re convinced something will go wrong. When
          anxiety is disguised as planning. When you need to separate real risk
          from imagined threat.
        </p>
        <SeoDisclaimer>
          This tool provides cognitive reframing support only. It is not
          therapy or mental health treatment. For diagnosed anxiety disorders or
          severe anxiety, work with a qualified mental health professional. This
          tool complements but does not replace professional care.
        </SeoDisclaimer>
      </ToolSeoContent>
    </PageShell>
  );
}
