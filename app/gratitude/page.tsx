import Link from "next/link";
import GratitudeSession from "@/components/gratitude/GratitudeSession";
import { getCurrentUser } from "@/lib/auth";
import PageShell from "@/components/PageShell";

export const metadata = {
  title: "Gratitude Log — Solace",
  description:
    "One small thing, every day. Watch them collect. Over time you'll have proof that good things were always there.",
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
    </PageShell>
  );
}
