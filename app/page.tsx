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
    <main
      className="relative min-h-screen overflow-hidden bg-[#03050b] text-white"
      style={
        {
          "--solace-breath-duration": "10s",
        } as React.CSSProperties
      }
    >
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
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_34%,rgba(6,8,14,0.06)_0%,rgba(6,8,14,0.18)_34%,rgba(6,8,14,0.38)_58%,rgba(0,0,0,0.52)_78%,rgba(0,0,0,0.66)_100%)]" />

      <div className="pointer-events-none absolute inset-x-[8%] top-[26%] z-10 h-[340px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(8,11,19,0.18)_0%,rgba(8,11,19,0.24)_28%,rgba(8,11,19,0.16)_52%,rgba(8,11,19,0.04)_70%,rgba(8,11,19,0)_82%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-[10%] top-[44%] z-10 h-[180px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(14,18,30,0.22)_0%,rgba(14,18,30,0.14)_34%,rgba(14,18,30,0.06)_58%,rgba(14,18,30,0)_78%)] blur-2xl" />

      <SiteHeader />

      <div className="relative z-20">
        <section className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-6 pb-4 pt-[118px] sm:px-8 lg:px-10">
          <div className="relative flex w-full flex-col items-center">
            <div className="mb-0 origin-top translate-y-0 scale-[0.72] sm:translate-y-1 sm:scale-[0.79] md:translate-y-2 md:scale-[0.85]">
              <HeroPresence />
            </div>

            <div className="-mt-16 mx-auto flex max-w-[980px] flex-col items-center text-center sm:-mt-[4.5rem] md:-mt-[5.25rem]">
              <h1 className="solace-breathe-word text-[44px] font-light text-white sm:text-[58px] md:text-[70px]">
                Breathe
              </h1>
            </div>
          </div>
        </section>

        <section
          id="start-from-how-it-feels"
          className="mx-auto w-full max-w-[1280px] px-6 pb-14 pt-3 sm:px-8 lg:px-10"
        >
          <div className="mx-auto max-w-[760px] text-center">
            <p className="solace-section-label">Start from how it feels</p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
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

        <section className="mx-auto w-full max-w-[980px] px-6 pb-16 pt-2 text-center sm:px-8 lg:px-10">
          <p className="solace-section-label">How Solace helps</p>
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

        <section className="mx-auto w-full max-w-[1160px] px-6 pb-16 pt-4 sm:px-8 lg:px-10">
          <div
            className="group relative isolate overflow-hidden rounded-[40px] border px-7 py-10 transition duration-300 sm:px-10 sm:py-12"
            style={{
              borderColor: "rgba(215,205,255,0.24)",
              background: `
                linear-gradient(180deg, rgba(38,42,58,0.82) 0%, rgba(24,28,40,0.78) 42%, rgba(14,17,26,0.76) 100%),
                linear-gradient(135deg, rgba(236,228,255,0.08) 0%, rgba(255,255,255,0.025) 24%, rgba(255,255,255,0.01) 52%, rgba(255,255,255,0) 76%)
              `,
              boxShadow:
                "0 48px 124px rgba(0,0,0,0.38), 0 0 0 1px rgba(255,255,255,0.03) inset, inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -20px 36px rgba(255,255,255,0.015)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.06)_18%,transparent_36%,rgba(255,255,255,0.04)_52%,transparent_68%)]" />
            <div className="pointer-events-none absolute inset-x-[18%] top-0 h-[1px] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.34)_50%,transparent_100%)]" />
            <div className="pointer-events-none absolute inset-x-[12%] bottom-0 h-[1px] bg-[linear-gradient(90deg,transparent_0%,rgba(180,170,255,0.18)_50%,transparent_100%)]" />
            <div
              className="pointer-events-none absolute right-[8%] top-[16%] h-[180px] w-[180px] rounded-full opacity-[0.16]"
              style={{
                background:
                  "radial-gradient(circle, rgba(150,120,255,0.7) 0%, rgba(150,120,255,0.18) 42%, transparent 72%)",
              }}
            />
            <div
              className="pointer-events-none absolute left-[18%] bottom-[12%] h-[140px] w-[240px] rounded-full opacity-[0.08]"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(96,144,255,0.52) 0%, rgba(96,144,255,0.12) 46%, transparent 76%)",
              }}
            />

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
                  className="group/button relative inline-flex min-h-[52px] items-center justify-center overflow-hidden rounded-full border border-[rgba(255,255,255,0.2)] px-6 text-[14px] font-medium text-white/94 shadow-[0_16px_38px_rgba(0,0,0,0.26),inset_0_1px_0_rgba(255,255,255,0.28)] transition duration-300 hover:-translate-y-[2px] hover:scale-[1.01] hover:text-white hover:shadow-[0_20px_44px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.32)]"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(210,214,230,0.12) 52%, rgba(120,126,154,0.12) 100%)",
                  }}
                >
                  <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(244,234,255,0.22)_0%,rgba(255,255,255,0.08)_34%,rgba(255,255,255,0)_58%)] opacity-90 transition duration-300 group-hover/button:opacity-100" />
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
            opacity: 0.08;
            transform: translateX(-2%);
          }
          50% {
            opacity: 0.15;
            transform: translateX(2%);
          }
          100% {
            opacity: 0.08;
            transform: translateX(-2%);
          }
        }

        @keyframes solaceWordPresenceSync {
          0% {
            transform: scale(0.996);
            opacity: 0.958;
            text-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
          }
          50% {
            transform: scale(1.018);
            opacity: 1;
            text-shadow: 0 12px 36px rgba(0, 0, 0, 0.23);
          }
          100% {
            transform: scale(0.996);
            opacity: 0.958;
            text-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
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
          background: radial-gradient(circle at 50% 50%, rgba(255, 240, 248, 0.045), transparent 58%);
          filter: blur(18px);
          animation: solaShimmer 14s ease-in-out infinite;
        }

        .solace-breathe-word {
          display: inline-block;
          transform-origin: 50% 72%;
          letter-spacing: -0.04em;
          line-height: 0.94;
          animation: solaceWordPresenceSync var(--solace-breath-duration, 10s)
            ease-in-out infinite;
          will-change: transform, opacity, text-shadow;
        }

        .solace-section-label {
          font-size: 14px;
          line-height: 1;
          text-transform: uppercase;
          letter-spacing: 0.32em;
          color: rgba(255, 255, 255, 0.42);
        }

        @media (min-width: 640px) {
          .solace-section-label {
            font-size: 15px;
          }
        }
      `}</style>
    </main>
  );
}