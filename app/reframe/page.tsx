import Link from "next/link";
import ReframeSession from "@/components/reframe/ReframeSession";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Thought Reframer — Solace",
  description:
    "Write the thought that keeps showing up. We'll look at it together — carefully, without judgment.",
};

export default async function ReframePage() {
  const { userId } = await getCurrentUser();

  return (
    <main className="min-h-screen bg-[#090d14] text-white">
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

    </main>
  );
}
