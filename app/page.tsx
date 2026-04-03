"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageShell from "@/components/PageShell";
import { HeroSection } from "@/components/HeroSection";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type AiTool = {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cardClass: string;
  eyebrowClass: string;
  leftBorder: string;
};

const AI_TOOLS: AiTool[] = [
  {
    eyebrow: "WHEN MY MIND WON'T STOP",
    title: "Clear Your Mind",
    body: "Your thoughts are circling and you can't find the floor. Release them one by one, watch them take shape, and find what's actually there.",
    href: "/tools/clear-your-mind",
    cardClass:
      "border-teal-500/25 bg-teal-500/[0.07] hover:border-teal-500/50 hover:bg-teal-500/[0.12] hover:shadow-[0_8px_32px_rgba(45,212,191,0.1)] transition-all duration-300 hover:-translate-y-0.5",
    eyebrowClass: "text-teal-400/70",
    leftBorder: "2px solid rgba(45,212,191,0.5)",
  },
  {
    eyebrow: "WHEN I CAN'T DECIDE",
    title: "Choose",
    body: "A decision keeps turning over in your mind. Two paths, one answer — seen with more clarity when the noise is removed.",
    href: "/tools/choose",
    cardClass:
      "border-amber-500/25 bg-amber-500/[0.07] hover:border-amber-500/50 hover:bg-amber-500/[0.12] hover:shadow-[0_8px_32px_rgba(245,158,11,0.1)] transition-all duration-300 hover:-translate-y-0.5",
    eyebrowClass: "text-amber-400/70",
    leftBorder: "2px solid rgba(245,158,11,0.5)",
  },
  {
    eyebrow: "WHEN I FEEL OVERWHELMED",
    title: "Break It Down",
    body: "Something feels too large to begin. Watch what seemed impossible become a sequence of steps you can actually take.",
    href: "/tools/break-it-down",
    cardClass:
      "border-indigo-400/25 bg-indigo-400/[0.07] hover:border-indigo-400/50 hover:bg-indigo-400/[0.12] hover:shadow-[0_8px_32px_rgba(129,140,248,0.1)] transition-all duration-300 hover:-translate-y-0.5",
    eyebrowClass: "text-indigo-400/70",
    leftBorder: "2px solid rgba(129,140,248,0.5)",
  },
];

const FREE_TOOLS = [
  { name: "Breathing", href: "/tools/breathing" },
  { name: "Focus Timer", href: "/tools/focus-timer" },
  { name: "Sleep Wind-Down", href: "/tools/sleep-wind-down" },
  { name: "Thought Reframer", href: "/tools/thought-reframer" },
  { name: "Mood Tracker", href: "/tools/mood-tracker" },
  { name: "Gratitude Log", href: "/tools/gratitude-log" },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement | null>(null);

  // ── Section headline parallax ────────────────────────────────────────
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".ai-section-headline", {
          y: -24,
          ease: "none",
          scrollTrigger: {
            trigger: ".ai-tools-section",
            start: "top bottom",
            end: "center center",
            scrub: 1.5,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: heroRef },
  );

  return (
    <PageShell particles={false}>
      <div ref={heroRef}>
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <HeroSection />

        {/* ── AI Tools ─────────────────────────────────────────────── */}
        <section id="tools" className="ai-tools-section py-24 md:py-32">
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
            <p
              className="text-[10px] tracking-[0.24em] uppercase text-[rgba(174,168,205,0.62)]"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400 }}
            >
              WHEN YOU NEED CLARITY
            </p>

            <h3
              className="ai-section-headline mt-5 text-4xl md:text-5xl font-light leading-[1.15] text-[rgba(236,232,248,0.92)]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Start from <em className="italic">how it feels</em> — not what
              it is.
            </h3>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {AI_TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`ai-tool-card group rounded-2xl border backdrop-blur-md p-6 min-h-[280px] flex flex-col transform-gpu ${tool.cardClass}`}
                  style={{ borderLeft: tool.leftBorder }}
                >
                  <p
                    className={`text-[10px] tracking-[0.16em] uppercase ${tool.eyebrowClass}`}
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    {tool.eyebrow}
                  </p>
                  <p
                    className="mt-4 text-[34px] leading-[1.02] text-[rgba(240,236,252,0.95)]"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 300,
                    }}
                  >
                    {tool.title}
                  </p>
                  <p
                    className="mt-4 text-[14px] leading-[1.85] text-[rgba(203,197,228,0.76)]"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    {tool.body}
                  </p>
                  <span
                    className="mt-auto pt-6 text-[12px] tracking-[0.1em] uppercase text-[rgba(214,206,238,0.82)] opacity-40 transition-all duration-200 group-hover:translate-x-1.5 group-hover:opacity-100"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    Open tool →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Free Tools ───────────────────────────────────────────── */}
        <section className="free-tools-section py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
            <p
              className="text-[10px] tracking-[0.24em] uppercase text-[rgba(174,168,205,0.62)]"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400 }}
            >
              FREE — START HERE
            </p>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FREE_TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="free-tool-card rounded-xl border border-white/10 bg-[rgba(255,255,255,0.02)] backdrop-blur-md px-5 py-4 text-[rgba(217,211,238,0.88)] hover:border-white/20 transition-colors duration-200 flex items-center justify-between gap-4"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 300,
                    fontSize: "14px",
                  }}
                >
                  <span>{tool.name}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Lab link ─────────────────────────────────────────────── */}
        <section className="py-10">
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 text-center">
            <Link
              href="/lab"
              className="text-[14px] text-[rgba(203,197,228,0.74)] hover:text-[rgba(221,215,242,0.9)] transition-colors duration-200"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
            >
              From the Lab: How to calm an anxious mind →
            </Link>
          </div>
        </section>

        {/* ── Pricing nudge ────────────────────────────────────────── */}
        <section className="py-16 text-center">
          <div className="max-w-3xl mx-auto px-6">
            <p
              className="text-[15px] leading-[1.8] text-[rgba(206,199,232,0.78)]"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
            >
              Full access from A$9.92/month — less than a coffee.
            </p>
            <div className="mt-6">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-2.5 text-[11px] tracking-[0.16em] uppercase text-[rgba(214,206,238,0.82)] transition-colors duration-200 hover:text-[rgba(233,228,250,0.98)] hover:border-white/35"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                See plans →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
