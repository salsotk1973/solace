"use client";

import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import HeroPresence from "@/components/hero/HeroPresence";
import { SOLACE_ROUTES } from "@/lib/solace/routes";

const emotionalEntryCards = [
  {
    eyebrow: "I CAN’T DECIDE",
    title: "Choose",
    description: "Compare options and move forward.",
    subtext: "For moments of indecision.",
    href: SOLACE_ROUTES.choose,
    border: "rgba(176, 204, 255, 0.34)",
    tintTop: "rgba(162, 190, 255, 0.42)",
    tintBody: "rgba(174, 198, 255, 0.2)",
    glow: "rgba(144, 180, 255, 0.3)",
    glare: "rgba(242, 247, 255, 0.34)",
  },
  {
    eyebrow: "MY MIND WON’T STOP THINKING",
    title: "Clear Your Mind",
    description: "Untangle overthinking and regain perspective.",
    subtext: "For moments of overthinking.",
    href: SOLACE_ROUTES.clearYourMind,
    border: "rgba(196, 214, 198, 0.34)",
    tintTop: "rgba(212, 222, 214, 0.42)",
    tintBody: "rgba(198, 210, 202, 0.18)",
    glow: "rgba(188, 206, 192, 0.22)",
    glare: "rgba(250, 255, 250, 0.3)",
  },
  {
    eyebrow: "EVERYTHING FEELS NOISY",
    title: "Sort",
    description: "Separate what deserves attention from what doesn’t.",
    subtext: "For moments of overwhelm.",
    href: SOLACE_ROUTES.sort,
    border: "rgba(244, 214, 188, 0.34)",
    tintTop: "rgba(246, 224, 208, 0.42)",
    tintBody: "rgba(238, 214, 198, 0.18)",
    glow: "rgba(236, 206, 182, 0.2)",
    glare: "rgba(255, 248, 240, 0.28)",
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
    <main className="relative min-h-screen overflow-hidden bg-[#03050b] text-white">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/solaverse/master-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <div className="sola-haze sola-haze-a" />
        <div className="sola-haze sola-haze-b" />
        <div className="sola-haze sola-haze-c" />
        <div className="sola-light sola-light-left" />
        <div className="sola-light sola-light-right" />
        <div className="sola-horizon-shimmer" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_16%_26%,rgba(92,142,255,0.24),transparent_34%),radial-gradient(circle_at_84%_24%,rgba(162,120,255,0.18),transparent_34%),radial-gradient(circle_at_50%_16%,rgba(208,220,255,0.18),transparent_22%),radial-gradient(circle_at_50%_82%,rgba(255,230,244,0.14),transparent_18%)]" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(3,5,11,0.16)_0%,rgba(3,5,11,0.10)_18%,rgba(3,5,11,0.18)_36%,rgba(3,5,11,0.34)_56%,rgba(3,5,11,0.68)_82%,rgba(3,5,11,0.86)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_34%,rgba(6,8,14,0.06)_0%,rgba(6,8,14,0.18)_34%,rgba(6,8,14,0.42)_58%,rgba(0,0,0,0.54)_78%,rgba(0,0,0,0.68)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-[24%] z-10 h-[280px] bg-[radial-gradient(ellipse_at_center,rgba(8,11,19,0.16)_0%,rgba(8,11,19,0.28)_38%,rgba(8,11,19,0.44)_60%,rgba(8,11,19,0)_78%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-[43%] z-10 h-[220px] bg-[linear-gradient(180deg,rgba(8,11,19,0.34)_0%,rgba(8,11,19,0.14)_18%,rgba(8,11,19,0.14)_82%,rgba(8,11,19,0.34)_100%)]" />

      <SiteHeader />

      <div className="relative z-20">
        <section className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-6 pb-12 pt-[112px] sm:px-8 lg:px-10">
          <div className="relative flex w-full flex-col items-center">
            <div className="mb-0 scale-[0.92] origin-top sm:scale-[0.96] md:scale-100">
              <HeroPresence />
            </div>

            <div className="-mt-12 mx-auto flex max-w-[980px] flex-col items-center text-center sm:-mt-16 md:-mt-20">
              <h1 className="text-[44px] font-light tracking-[-0.04em] text-white sm:text-[58px] md:text-[70px]">
                Breathe
              </h1>

              <p className="mt-5 max-w-[760px] text-[16px] leading-7 text-white/76 sm:text-[19px]">
                A calmer digital space for when your thoughts feel tangled, loud, or hard to sort.
              </p>
            </div>
          </div>
        </section>

        <section
          id="start-from-how-it-feels"
          className="mx-auto w-full max-w-[1280px] px-6 pb-16 pt-6 sm:px-8 lg:px-10"
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
                className="group relative cursor-pointer overflow-hidden rounded-[32px] border p-0 backdrop-blur-[34px] transition duration-300 hover:-translate-y-[6px] hover:scale-[1.015]"
                style={{
                  borderColor: card.border,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
                  boxShadow: `0 30px 88px rgba(0,0,0,0.36), 0 0 120px ${card.glow}, inset 0 1px 0 rgba(255,255,255,0.24), inset 0 -24px 48px rgba(255,255,255,0.025)`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-100"
                  style={{
                    background: `linear-gradient(180deg, ${card.tintTop} 0%, ${card.tintBody} 34%, rgba(255,255,255,0.03) 54%, rgba(8,11,19,0.44) 100%)`,
                  }}
                />

                <div
                  className="pointer-events-none absolute inset-0 opacity-95 transition duration-300 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(135deg, ${card.glare} 0%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0) 58%)`,
                  }}
                />

                <div
                  className="pointer-events-none absolute inset-x-[8%] top-[-24%] h-[62%] blur-3xl"
                  style={{
                    background: `radial-gradient(circle, ${card.glow} 0%, transparent 72%)`,
                  }}
                />

                <div
                  className="pointer-events-none absolute -bottom-10 left-1/2 h-28 w-[82%] -translate-x-1/2 rounded-full blur-3xl opacity-95 transition duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle, ${card.glow} 0%, transparent 72%)`,
                  }}
                />

                <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.12)_18%,transparent_36%,rgba(255,255,255,0.08)_52%,transparent_68%)]" />

                <div className="relative flex h-full min-h-[214px] flex-col justify-between px-7 py-7">
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.22em] text-black/35">
                      {card.eyebrow}
                    </p>
                    <h3 className="mt-5 text-[28px] font-semibold tracking-[-0.04em] text-black/85">
                      {card.title}
                    </h3>
                    <p className="mt-5 max-w-[30ch] text-[15px] leading-7 text-black/68">
                      {card.description}
                    </p>
                    <p className="mt-8 text-[14px] text-black/35">
                      {card.subtext}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[980px] px-6 pb-16 pt-8 text-center sm:px-8 lg:px-10">
          <p className="text-[12px] uppercase tracking-[0.28em] text-white/28">
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
                  index !== helpSteps.length - 1 ? "border-b border-white/8" : ""
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

        <section className="mx-auto w-full max-w-[1160px] px-6 pb-16 pt-6 sm:px-8 lg:px-10">
          <div
            className="group relative overflow-hidden rounded-[40px] border px-7 py-10 backdrop-blur-[36px] transition duration-300 sm:px-10 sm:py-12"
            style={{
              borderColor: "rgba(215,205,255,0.24)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))",
              boxShadow:
                "0 48px 124px rgba(0,0,0,0.4), 0 0 150px rgba(145,120,255,0.22), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -24px 48px rgba(255,255,255,0.02)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(238,228,255,0.26)_0%,rgba(255,255,255,0.08)_24%,rgba(255,255,255,0)_56%)] opacity-90" />
            <div className="pointer-events-none absolute -right-14 top-[-48px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(150,120,255,0.34),transparent_62%)] blur-3xl" />
            <div className="pointer-events-none absolute -left-12 bottom-[-46px] h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(96,144,255,0.18),transparent_62%)] blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-34px] left-1/2 h-32 w-[74%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(150,120,255,0.18),transparent_72%)] blur-3xl opacity-95" />
            <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.12)_18%,transparent_36%,rgba(255,255,255,0.08)_52%,transparent_68%)]" />

            <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-[760px]">
                <p className="text-[12px] uppercase tracking-[0.28em] text-white/34">
                  Inside the Lab
                </p>
                <h2 className="mt-5 max-w-[18ch] text-[34px] font-light tracking-[-0.04em] text-white sm:text-[46px]">
                  A growing space for studying how people think, feel, decide, and respond online
                </h2>
                <p className="mt-5 max-w-[58ch] text-[16px] leading-8 text-white/66">
                  The Digital Human Behaviour Lab sits behind Solace — helping shape calmer digital experiences through observation, pattern recognition, and thoughtful design.
                </p>
              </div>

              <div className="flex shrink-0 md:self-end">
                <Link
                  href="/lab"
                  className="group/button relative inline-flex min-h-[52px] items-center justify-center overflow-hidden rounded-full border border-[rgba(255,255,255,0.2)] bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.07))] px-6 text-[14px] font-medium text-white/94 backdrop-blur-[26px] shadow-[0_16px_38px_rgba(0,0,0,0.26),0_0_40px_rgba(170,140,255,0.18),inset_0_1px_0_rgba(255,255,255,0.28)] transition duration-300 hover:-translate-y-[2px] hover:scale-[1.01] hover:text-white hover:shadow-[0_20px_44px_rgba(0,0,0,0.3),0_0_52px_rgba(170,140,255,0.26),inset_0_1px_0_rgba(255,255,255,0.32)]"
                >
                  <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(244,234,255,0.28)_0%,rgba(255,255,255,0.1)_34%,rgba(255,255,255,0)_58%)] opacity-90 transition duration-300 group-hover/button:opacity-100" />
                  <span className="pointer-events-none absolute -bottom-7 left-1/2 h-14 w-[72%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(170,140,255,0.32),transparent_72%)] blur-2xl opacity-95 transition duration-300 group-hover/button:opacity-100" />
                  <span className="relative z-10">Enter the Lab</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="mx-auto w-full max-w-[1100px] px-6 pb-10 pt-8 text-center sm:px-8 lg:px-10">
          <p className="text-[12px] leading-6 text-white/38">
            Solace is for adults 18+ and offers calm reflective support only. It does not provide medical, psychological, legal, financial, or other professional advice.
          </p>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes solaDriftA {
          0% {
            transform: translate3d(-2%, 0, 0) scale(1.03);
            opacity: 0.46;
          }
          50% {
            transform: translate3d(2%, -1%, 0) scale(1.06);
            opacity: 0.64;
          }
          100% {
            transform: translate3d(-2%, 0, 0) scale(1.03);
            opacity: 0.46;
          }
        }

        @keyframes solaDriftB {
          0% {
            transform: translate3d(2%, 0, 0) scale(1.02);
            opacity: 0.34;
          }
          50% {
            transform: translate3d(-2%, 1%, 0) scale(1.05);
            opacity: 0.5;
          }
          100% {
            transform: translate3d(2%, 0, 0) scale(1.02);
            opacity: 0.34;
          }
        }

        @keyframes solaBreath {
          0%,
          100% {
            opacity: 0.24;
          }
          50% {
            opacity: 0.4;
          }
        }

        @keyframes solaShimmer {
          0% {
            opacity: 0.12;
            transform: translateX(-3%);
          }
          50% {
            opacity: 0.24;
            transform: translateX(3%);
          }
          100% {
            opacity: 0.12;
            transform: translateX(-3%);
          }
        }

        .sola-haze {
          position: absolute;
          inset: 0;
          pointer-events: none;
          filter: blur(38px);
          will-change: transform, opacity;
        }

        .sola-haze-a {
          background:
            radial-gradient(circle at 28% 56%, rgba(92, 142, 255, 0.16), transparent 26%),
            radial-gradient(circle at 72% 46%, rgba(164, 120, 255, 0.12), transparent 24%),
            radial-gradient(circle at 50% 80%, rgba(255, 230, 244, 0.08), transparent 18%);
          animation: solaDriftA 18s ease-in-out infinite;
        }

        .sola-haze-b {
          background:
            radial-gradient(circle at 18% 30%, rgba(80, 120, 220, 0.1), transparent 22%),
            radial-gradient(circle at 82% 32%, rgba(140, 118, 220, 0.08), transparent 22%);
          animation: solaDriftB 24s ease-in-out infinite;
        }

        .sola-haze-c {
          background:
            radial-gradient(circle at 50% 18%, rgba(220, 228, 255, 0.1), transparent 18%),
            radial-gradient(circle at 50% 72%, rgba(120, 100, 180, 0.06), transparent 18%);
          animation: solaBreath 12s ease-in-out infinite;
        }

        .sola-light {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 22%;
          pointer-events: none;
          filter: blur(42px);
          will-change: transform, opacity;
        }

        .sola-light-left {
          left: 5%;
          background: radial-gradient(circle at 50% 28%, rgba(100, 132, 222, 0.14), transparent 62%);
          animation: solaDriftA 22s ease-in-out infinite;
        }

        .sola-light-right {
          right: 5%;
          background: radial-gradient(circle at 50% 26%, rgba(150, 122, 222, 0.12), transparent 62%);
          animation: solaDriftB 26s ease-in-out infinite;
        }

        .sola-horizon-shimmer {
          position: absolute;
          left: 10%;
          right: 10%;
          top: 46%;
          height: 8%;
          pointer-events: none;
          background: radial-gradient(circle at 50% 50%, rgba(255, 240, 248, 0.08), transparent 58%);
          filter: blur(22px);
          animation: solaShimmer 14s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}