"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function BreakItDownPage() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<string[] | null>(null);

  const handleSubmit = () => {
    if (!input.trim()) return;

    setResponse([
      "This is not one big problem. It’s a few smaller parts.",
      "Understand what this really involves",
      "Identify the main pressure point",
      "Break it into simple steps",
      "Start with one small action",
    ]);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#03050b] text-white">
      {/* Amber Realm background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 58% 34%, rgba(255, 224, 186, 0.10), transparent 42%),
            url('/realms/amber/break-it-down-bg.jpg')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Global atmospheric overlays */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_55%_38%,rgba(255,210,140,0.10),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_24%,rgba(255,244,224,0.06),transparent_20%),radial-gradient(circle_at_18%_74%,rgba(255,190,120,0.04),transparent_18%),radial-gradient(circle_at_84%_30%,rgba(255,210,160,0.03),transparent_16%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(6,6,10,0.38)_0%,rgba(6,6,10,0.32)_18%,rgba(6,6,10,0.40)_38%,rgba(6,6,10,0.52)_58%,rgba(6,6,10,0.68)_78%,rgba(6,6,10,0.82)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_44%,rgba(8,8,14,0.14)_0%,rgba(8,8,14,0.28)_40%,rgba(8,8,14,0.48)_74%,rgba(8,8,14,0.66)_100%)]" />

      {/* Realm-specific amber glass light */}
      <div className="pointer-events-none absolute inset-x-[8%] top-[18%] z-[1] h-[260px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,214,150,0.14)_0%,rgba(255,214,150,0.08)_30%,rgba(255,214,150,0.03)_54%,rgba(255,214,150,0)_74%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-[16%] top-[46%] z-[1] h-[180px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,236,208,0.06)_0%,rgba(255,236,208,0.03)_38%,rgba(255,236,208,0)_72%)] blur-2xl" />

      <SiteHeader />

      <div className="relative z-10 mx-auto flex w-full max-w-[900px] flex-col px-6 pb-20 pt-[130px]">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[42px] font-light tracking-[-0.04em] text-white sm:text-[56px]">
            Break It Down
          </h1>

          <p className="mt-4 max-w-[620px] text-[15px] leading-7 text-white/72 sm:text-[17px]">
            Write one thing you need to deal with. We’ll break it into simple,
            manageable parts.
          </p>
        </div>

        <div className="mt-10 w-full">
          <div
            className="relative overflow-hidden rounded-[20px] border border-[rgba(255,235,214,0.12)]"
            style={{
              background: `
                linear-gradient(
                  180deg,
                  rgba(255,235,214,0.08) 0%,
                  rgba(180,128,76,0.06) 38%,
                  rgba(34,24,18,0.44) 100%
                )
              `,
              boxShadow:
                "0 24px 52px rgba(0,0,0,0.30), 0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 opacity-70 bg-[linear-gradient(135deg,rgba(255,245,232,0.12)_0%,rgba(255,255,255,0.04)_26%,rgba(255,255,255,0.02)_48%,rgba(255,255,255,0)_72%)]" />
            <div className="pointer-events-none absolute inset-x-[14%] top-0 h-[1px] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.26)_50%,transparent_100%)]" />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write one thing you need to deal with..."
              className="relative h-[120px] w-full resize-none bg-transparent px-5 py-4 text-[16px] text-white outline-none placeholder:text-white/40"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="mt-5 w-full rounded-full border border-[rgba(255,255,255,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.10))] py-4 text-[15px] text-white shadow-[0_12px_30px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.25)] transition hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.14))]"
          >
            Break it down
          </button>
        </div>

        {response && (
          <div className="mt-16">
            <p className="mb-5 text-[12px] uppercase tracking-[0.26em] text-white/44">
              Solace
            </p>

            <div className="space-y-4">
              {response.map((item, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-[18px] border border-[rgba(255,235,214,0.10)] px-5 py-5 text-[15px] leading-7 text-white/92"
                  style={{
                    background: `
                      linear-gradient(
                        180deg,
                        rgba(255,235,214,0.06) 0%,
                        rgba(176,126,76,0.04) 36%,
                        rgba(12,12,16,0.62) 100%
                      )
                    `,
                    boxShadow:
                      "0 16px 36px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 opacity-[0.58] bg-[linear-gradient(135deg,rgba(255,245,232,0.08)_0%,rgba(255,255,255,0.025)_28%,rgba(255,255,255,0.012)_50%,rgba(255,255,255,0)_76%)]" />
                  <div className="pointer-events-none absolute inset-x-[16%] top-0 h-[1px] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.18)_50%,transparent_100%)]" />
                  <div className="relative">
                    {index === 0 ? (
                      <p>{item}</p>
                    ) : (
                      <p>
                        <span className="mr-2 text-white/38">
                          {String(index).padStart(2, "0")}
                        </span>
                        {item}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}