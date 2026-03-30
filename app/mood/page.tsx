import Link from "next/link";
import MoodSession from "@/components/mood/MoodSession";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Mood Tracker — Solace",
  description: "Check in with how you're feeling. One number, one word, every day.",
};

export default async function MoodPage() {
  const { userId } = await getCurrentUser();

  return (
    <main className="min-h-screen bg-[#090d14] text-white">
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

    </main>
  );
}
