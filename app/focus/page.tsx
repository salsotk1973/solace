import Link from "next/link";
import FocusTimer   from "@/components/focus/FocusTimer";
import { getCurrentUser } from "@/lib/auth";
import { SOLACE_ROUTES }  from "@/lib/solace/routes";
import PageShell from "@/components/PageShell";

export const metadata = {
  title: "Focus Timer — Solace",
  description: "One thing. Done well.",
};

export default async function FocusPage() {
  const { userId } = await getCurrentUser();

  return (
    <PageShell>
      <div className="relative z-10 max-w-[780px] mx-auto px-6 pt-[140px] pb-28">

        {/* ── Tool header ──────────────────────────────────────────────── */}
        <header className="text-center mb-5">
          <p className="[font-family:var(--font-jost)] text-[10px] tracking-[0.26em] uppercase text-[rgba(240,170,70,0.38)] mb-3">
            Calm your state
          </p>
          <h1 className="[font-family:var(--font-display)] font-light text-[clamp(36px,5vw,56px)] text-[rgba(250,240,225,0.92)] leading-tight mb-4">
            One thing. Done well.
          </h1>
          <p className="[font-family:var(--font-jost)] font-[300] text-[14px] text-[rgba(160,170,180,0.48)] max-w-[440px] mx-auto leading-relaxed">
            A Pomodoro timer for people who actually want to focus. 25 minutes of
            work, 5 of rest. Repeated until it&apos;s done.
          </p>
        </header>

        {/* ── Interactive timer — client component ──────────────────────── */}
        <div className="flex flex-col items-center mt-12">
          <FocusTimer userId={userId ?? null} />
        </div>

        {/* ── Info cards ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 max-w-[520px] mx-auto mb-20">
          {[
            { label: "Work",     value: "25 min",  sub: "per session"      },
            { label: "Rest",     value: "5 min",   sub: "between sessions" },
            { label: "Sessions", value: "4",        sub: "then long break"  },
          ].map(({ label, value, sub }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 px-4 py-4 rounded-[12px] border border-[rgba(240,170,70,0.07)] bg-[rgba(240,170,70,0.025)]"
            >
              <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.2em] uppercase text-[rgba(240,170,70,0.35)]">
                {label}
              </p>
              <p className="[font-family:var(--font-display)] font-light text-[18px] text-[rgba(255,215,150,0.8)] leading-none">
                {value}
              </p>
              <p className="[font-family:var(--font-jost)] text-[9px] text-[rgba(180,170,155,0.35)] tracking-[0.06em]">
                {sub}
              </p>
            </div>
          ))}
        </div>

        {/* ── Human line ──────────────────────────────────────────────── */}
        <p className="text-center [font-family:var(--font-display)] italic font-light text-[clamp(16px,2.2vw,22px)] text-[rgba(200,185,155,0.35)] mb-20 max-w-[440px] mx-auto leading-relaxed">
          The work doesn&apos;t get easier. But the resistance does.
        </p>

        {/* ── Other tools cross-links ─────────────────────────────────── */}
        <section>
          <p className="text-center [font-family:var(--font-jost)] text-[9px] tracking-[0.24em] uppercase text-[rgba(130,145,158,0.3)] mb-6">
            Other tools
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/breathing"
              className="rounded-[14px] p-7 border border-[rgba(80,195,215,0.1)] bg-[linear-gradient(145deg,#080e18,#0a1420,#070c14)] hover:border-[rgba(80,195,215,0.26)] transition-all duration-500"
            >
              <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.18em] uppercase text-[rgba(80,195,215,0.42)] mb-2.5">
                When I can&apos;t breathe
              </p>
              <p className="[font-family:var(--font-display)] font-light text-[21px] text-[rgba(210,240,248,0.85)]">
                Breathing
              </p>
            </Link>
            <Link
              href={SOLACE_ROUTES.breakItDown}
              className="rounded-[14px] p-7 border border-[rgba(218,148,48,0.1)] bg-[linear-gradient(145deg,#1a1008,#281808,#180e04)] hover:border-[rgba(218,148,48,0.26)] transition-all duration-500"
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
    </PageShell>
  );
}
