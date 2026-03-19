import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import HeroPresence from "@/components/hero/HeroPresence";

const emotionalEntryCards = [
  {
    title: "I can’t decide",
    description: "Untangle difficult decisions with a calmer frame.",
    href: "/tools/i-cant-decide",
    tone: "rgba(165, 190, 255, 0.14)",
    border: "rgba(214, 226, 255, 0.18)",
    glow: "rgba(120, 150, 235, 0.16)",
  },
  {
    title: "My mind won’t stop",
    description: "Step out of mental loops and regain perspective.",
    href: "/tools/clear-your-mind",
    tone: "rgba(212, 190, 255, 0.14)",
    border: "rgba(232, 220, 255, 0.18)",
    glow: "rgba(175, 140, 235, 0.16)",
  },
  {
    title: "Everything feels noisy",
    description: "Sort what matters from what is only adding pressure.",
    href: "/tools/everything-feels-noisy",
    tone: "rgba(198, 214, 255, 0.12)",
    border: "rgba(220, 232, 255, 0.16)",
    glow: "rgba(132, 155, 220, 0.14)",
  },
];

const helpSteps = [
  {
    title: "Notice what’s actually happening",
    description: "See the pressure, noise, or loop more clearly.",
  },
  {
    title: "Separate signal from noise",
    description: "Find what matters and what is only adding weight.",
  },
  {
    title: "Take one calmer next step",
    description: "Move forward without forcing certainty.",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070d] text-white">
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0b1422_0%,#07101b_28%,#05070d_60%,#04060b_100%)]" />

        <div className="absolute inset-x-0 top-[120px] h-[420px] bg-[radial-gradient(circle_at_50%_30%,rgba(160,180,255,0.18),transparent_55%)] blur-3xl" />

        <div className="absolute inset-x-0 top-[420px] h-[500px] bg-[radial-gradient(circle_at_50%_40%,rgba(110,120,190,0.12),transparent_60%)] blur-3xl" />

        <div className="absolute left-[-10%] top-[20%] h-[500px] w-[40%] bg-[radial-gradient(circle,rgba(60,90,170,0.12),transparent_60%)] blur-3xl" />

        <div className="absolute right-[-10%] top-[25%] h-[500px] w-[40%] bg-[radial-gradient(circle,rgba(140,100,180,0.1),transparent_60%)] blur-3xl" />

        <div className="absolute inset-x-0 bottom-[-60px] h-[320px] bg-[radial-gradient(circle_at_50%_100%,rgba(80,60,130,0.12),transparent_60%)] blur-3xl" />
      </div>

      <SiteHeader />

      <div className="relative z-10">
        {/* Hero */}
        <section className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-6 pb-10 pt-24 sm:px-8 md:pt-28 lg:px-10">
          <div className="relative flex w-full flex-col items-center">
            <div className="pointer-events-none absolute top-[-10px] h-[320px] w-[520px] max-w-full bg-[radial-gradient(circle_at_50%_50%,rgba(165,184,255,0.12),transparent_56%)] blur-3xl" />

            <div className="mb-4">
              <HeroPresence />
            </div>

            <div className="mx-auto flex max-w-[760px] flex-col items-center text-center">
              <h1 className="text-[44px] font-light tracking-[-0.04em] text-white sm:text-[58px] md:text-[70px]">
                Clear your mind
              </h1>

              <p className="mt-5 max-w-[660px] text-[16px] leading-7 text-white/70 sm:text-[19px]">
                A calmer digital space for when your thoughts feel tangled,
                loud, or hard to sort.
              </p>

              <div className="mt-8 flex items-center justify-center">
                <Link
                  href="#start-from-how-it-feels"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/14 bg-white/[0.08] px-6 text-[14px] font-medium text-white/92 backdrop-blur-xl transition duration-500 hover:-translate-y-[1px] hover:border-white/24 hover:bg-white/[0.12] hover:shadow-[0_10px_30px_rgba(145,170,255,0.18),0_4px_14px_rgba(0,0,0,0.26),inset_0_1px_0_rgba(255,255,255,0.1)]"
                >
                  Start from how it feels
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Emotional entry cards - clearly interactive */}
        <section
          id="start-from-how-it-feels"
          className="mx-auto w-full max-w-[1280px] px-6 pb-18 pt-10 sm:px-8 lg:px-10"
        >
          <div className="mx-auto max-w-[760px] text-center">
            <p className="text-[12px] uppercase tracking-[0.28em] text-white/32">
              Start from how it feels
            </p>
            <h2 className="mt-4 text-[28px] font-light tracking-[-0.03em] text-white sm:text-[40px]">
              You don’t need the perfect words to begin
            </h2>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {emotionalEntryCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                aria-label={`Open ${card.title}`}
                className="group relative cursor-pointer overflow-hidden rounded-[26px] border bg-white/[0.03] p-0 backdrop-blur-xl transition duration-500 hover:-translate-y-[4px] hover:scale-[1.01]"
                style={{
                  borderColor: card.border,
                  boxShadow: `0 0 0 1px rgba(255,255,255,0.02), 0 24px 70px rgba(0,0,0,0.28), 0 10px 24px rgba(0,0,0,0.2), 0 0 60px ${card.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-90"
                  style={{
                    background: `linear-gradient(180deg, ${card.tone} 0%, rgba(255,255,255,0.03) 42%, rgba(8,11,19,0.42) 100%)`,
                  }}
                />
                <div className="pointer-events-none absolute inset-x-8 bottom-0 h-20 rounded-full bg-white/[0.04] blur-2xl transition duration-500 group-hover:bg-white/[0.07]" />
                <div className="relative flex h-full min-h-[182px] flex-col justify-between px-7 py-7">
                  <div>
                    <h3 className="text-[22px] font-light tracking-[-0.02em] text-white">
                      {card.title}
                    </h3>
                    <p className="mt-4 max-w-[30ch] text-[15px] leading-7 text-white/68">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-7 inline-flex items-center gap-2 text-[14px] font-medium text-white/84 transition duration-500 group-hover:text-white">
                    Open tool
                    <span className="transition duration-500 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Plain informational text - not cards */}
        <section className="mx-auto w-full max-w-[980px] px-6 pb-16 pt-8 text-center sm:px-8 lg:px-10">
          <p className="text-[12px] uppercase tracking-[0.28em] text-white/30">
            How Solace helps
          </p>
          <h2 className="mt-5 text-[30px] font-light tracking-[-0.03em] text-white sm:text-[42px]">
            A quieter way to move forward
          </h2>

          <div className="mx-auto mt-9 max-w-[620px]">
            {helpSteps.map((step, index) => (
              <div
                key={step.title}
                className={`flex items-start gap-4 py-4 text-left ${
                  index !== helpSteps.length - 1
                    ? "border-b border-white/8"
                    : ""
                }`}
              >
                <div className="mt-[2px] w-[42px] shrink-0 text-[12px] tracking-[0.22em] text-white/28">
                  0{index + 1}
                </div>
                <div>
                  <h3 className="text-[18px] font-light tracking-[-0.02em] text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-7 text-white/58">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Lab panel - informative panel with single clear CTA */}
        <section className="mx-auto w-full max-w-[1160px] px-6 pb-16 pt-6 sm:px-8 lg:px-10">
          <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-7 py-10 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.28),0_10px_24px_rgba(0,0,0,0.2),0_0_80px_rgba(140,120,200,0.08),inset_0_1px_0_rgba(255,255,255,0.05)] sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute -right-10 top-[-20px] h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(150,130,210,0.14),transparent_62%)] blur-3xl" />
            <div className="pointer-events-none absolute -left-8 bottom-[-30px] h-[220px] w-[220px] rounded-full bg-[radial-gradient(circle,rgba(90,130,180,0.1),transparent_62%)] blur-3xl" />

            <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-[760px]">
                <p className="text-[12px] uppercase tracking-[0.28em] text-white/30">
                  Inside the Lab
                </p>
                <h2 className="mt-5 max-w-[18ch] text-[34px] font-light tracking-[-0.04em] text-white sm:text-[46px]">
                  A growing space for studying how people think, feel, decide,
                  and respond online
                </h2>
                <p className="mt-5 max-w-[58ch] text-[16px] leading-8 text-white/60">
                  The Digital Human Behaviour Lab sits behind Solace — helping
                  shape calmer digital experiences through observation, pattern
                  recognition, and thoughtful design.
                </p>
              </div>

              <div className="flex shrink-0 md:self-end">
                <Link
                  href="/lab"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/12 bg-white/[0.08] px-6 text-[14px] font-medium text-white/90 backdrop-blur-xl transition duration-500 hover:-translate-y-[1px] hover:border-white/22 hover:bg-white/[0.12] hover:shadow-[0_10px_30px_rgba(160,180,255,0.14),0_4px_14px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.08)]"
                >
                  Enter the Lab
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quiet footer line */}
        <footer className="mx-auto w-full max-w-[1100px] px-6 pb-10 pt-8 text-center sm:px-8 lg:px-10">
          <p className="text-[12px] leading-6 text-white/38">
            Solace is for adults 18+ and offers calm reflective support only. It
            does not provide medical, psychological, legal, financial, or other
            professional advice.
          </p>
        </footer>
      </div>
    </main>
  );
}