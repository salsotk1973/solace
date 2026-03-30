import Link from "next/link";
import BreathingSession from "@/components/breathing/BreathingSession";
import { getCurrentUser }   from "@/lib/auth";
import { SOLACE_ROUTES }    from "@/lib/solace/routes";

export const metadata = {
  title: "Breathe — Solace",
  description: "Calm your state with intentional breathing.",
};

export default async function BreathingPage() {
  const { userId } = await getCurrentUser();

  return (
    <main className="min-h-screen bg-[#090d14] text-white">
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

    </main>
  );
}
