"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageShell from "@/components/PageShell";
import { HeroSection } from "@/components/HeroSection";
import { SolaceShaderBg } from "@/components/SolaceShaderBg";
import { SolaceAmbientDust } from "@/components/SolaceAmbientDust";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type AiTool = {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  themeClass: string;
  borderLeftColor: string;
  eyebrowColor: string;
  ctaColor: string;
};

const AI_TOOLS: AiTool[] = [
  {
    eyebrow: "WHEN MY MIND WON'T STOP",
    title: "Clear Your Mind",
    body: "Your thoughts are circling and you can't find the floor. Release them one by one, watch them take shape, and find what's actually there.",
    href: "/tools/clear-your-mind",
    themeClass:
      "border-teal-500/20 bg-teal-500/[0.06] hover:border-teal-500/35 hover:bg-teal-500/[0.09] hover:shadow-[0_12px_36px_rgba(45,212,191,0.10)]",
    borderLeftColor: "rgba(45,212,191,0.5)",
    eyebrowColor: "rgba(45,212,191,0.7)",
    ctaColor: "rgba(45,212,191,0.78)",
  },
  {
    eyebrow: "WHEN I CAN'T DECIDE",
    title: "Choose",
    body: "A decision keeps turning over in your mind. Two paths, one answer — seen with more clarity when the noise is removed.",
    href: "/tools/choose",
    themeClass:
      "border-amber-500/20 bg-amber-500/[0.06] hover:border-amber-500/35 hover:bg-amber-500/[0.09] hover:shadow-[0_12px_36px_rgba(245,158,11,0.10)]",
    borderLeftColor: "rgba(245,158,11,0.5)",
    eyebrowColor: "rgba(245,158,11,0.7)",
    ctaColor: "rgba(245,158,11,0.78)",
  },
  {
    eyebrow: "WHEN I FEEL OVERWHELMED",
    title: "Break It Down",
    body: "Something feels too large to begin. Watch what seemed impossible become a sequence of steps you can actually take.",
    href: "/tools/break-it-down",
    themeClass:
      "border-indigo-400/20 bg-indigo-400/[0.06] hover:border-indigo-400/35 hover:bg-indigo-400/[0.09] hover:shadow-[0_12px_36px_rgba(129,140,248,0.10)]",
    borderLeftColor: "rgba(129,140,248,0.5)",
    eyebrowColor: "rgba(129,140,248,0.7)",
    ctaColor: "rgba(129,140,248,0.78)",
  },
];

const FREE_TOOLS = [
  { name: "Breathing", href: "/tools/breathing", tone: "teal" as const },
  { name: "Focus Timer", href: "/tools/focus-timer", tone: "indigo" as const },
  { name: "Sleep Wind-Down", href: "/tools/sleep-wind-down", tone: "amber" as const },
  { name: "Thought Reframer", href: "/tools/thought-reframer", tone: "teal" as const },
  { name: "Mood Tracker", href: "/tools/mood-tracker", tone: "indigo" as const },
  { name: "Gratitude Log", href: "/tools/gratitude-log", tone: "amber" as const },
];

const FREE_TOOL_THEME: Record<
  "teal" | "indigo" | "amber",
  { className: string; accent: string; arrow: string }
> = {
  teal: {
    className: "border-[rgba(45,212,191,0.22)] bg-[rgba(45,212,191,0.045)] hover:border-[rgba(45,212,191,0.34)] hover:bg-[rgba(45,212,191,0.07)]",
    accent: "rgba(45,212,191,0.55)",
    arrow: "rgba(45,212,191,0.72)",
  },
  indigo: {
    className: "border-[rgba(129,140,248,0.22)] bg-[rgba(129,140,248,0.045)] hover:border-[rgba(129,140,248,0.34)] hover:bg-[rgba(129,140,248,0.07)]",
    accent: "rgba(129,140,248,0.55)",
    arrow: "rgba(129,140,248,0.72)",
  },
  amber: {
    className: "border-[rgba(245,158,11,0.22)] bg-[rgba(245,158,11,0.045)] hover:border-[rgba(245,158,11,0.34)] hover:bg-[rgba(245,158,11,0.07)]",
    accent: "rgba(245,158,11,0.55)",
    arrow: "rgba(245,158,11,0.72)",
  },
};

export default function HomePage() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [latestLab, setLatestLab] = useState<{ title: string; slug: string } | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch("/api/lab/latest", { signal: controller.signal });
        if (!res.ok) return;
        const data = (await res.json()) as { title?: string; slug?: string };
        if (data.title && data.slug) {
          setLatestLab({ title: data.title, slug: data.slug });
        }
      } catch {
        // Keep fallback teaser copy if latest article lookup fails.
      }
    })();

    return () => controller.abort();
  }, []);

  // ── Section headline parallax ────────────────────────────────────────
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

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

      gsap.from(".ai-tool-card", {
        opacity: 0,
        y: 28,
        duration: 0.75,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".ai-tools-section",
          start: "top 82%",
          once: true,
        },
      });

      gsap.from(".free-tool-card", {
        opacity: 0,
        y: 16,
        duration: 0.5,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".free-tools-section",
          start: "top 88%",
          once: true,
        },
      });
    },
    { scope: pageRef },
  );

  return (
    <PageShell particles={false}>
      <SolaceShaderBg enabled />
      <SolaceAmbientDust />
      <div ref={pageRef} className="relative z-10">
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <HeroSection />

        {/* ── AI Tools ─────────────────────────────────────────────── */}
        <section id="tools" className="ai-tools-section pt-12 pb-10 md:pt-16 md:pb-14">
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
                  className={`ai-tool-card group relative rounded-2xl border border-l-2 backdrop-blur-sm p-6 min-h-[280px] flex flex-col transition-all duration-300 ease-out hover:-translate-y-1.5 ${tool.themeClass}`}
                  style={{ borderLeftColor: tool.borderLeftColor }}
                >
                  <p
                    className="text-[10px] tracking-[0.16em] uppercase"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 400,
                      color: tool.eyebrowColor,
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
                    className="mt-auto pt-6 text-[12px] tracking-[0.1em] uppercase transition-all duration-200 opacity-50 group-hover:opacity-90 group-hover:translate-x-1"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 400,
                      color: tool.ctaColor,
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
        <section id="free-tools" className="free-tools-section pb-16 md:pb-24">
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
            <p
              className="text-[10px] tracking-[0.2em] uppercase text-[rgba(174,168,205,0.5)]"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400 }}
            >
              FREE — START HERE
            </p>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FREE_TOOLS.map((tool) => (
                <a
                  key={tool.href}
                  href={tool.href}
                  className={`free-tool-card group relative overflow-hidden rounded-xl border px-5 py-4 text-[rgba(217,211,238,0.88)] transition-all duration-200 ease-out hover:-translate-y-0.5 flex items-center justify-between gap-4 ${FREE_TOOL_THEME[tool.tone].className}`}
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 300,
                    fontSize: "14px",
                  }}
                >
                  <span>{tool.name}</span>
                  <span
                    aria-hidden="true"
                    className="transition-all duration-200 opacity-45 group-hover:opacity-80 group-hover:translate-x-1"
                    style={{ color: FREE_TOOL_THEME[tool.tone].arrow }}
                  >
                    →
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 left-4 right-4 h-px"
                    style={{ background: FREE_TOOL_THEME[tool.tone].accent }}
                  />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Lab link ─────────────────────────────────────────────── */}
        <section id="lab-teaser" className="py-10">
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 text-center">
            <Link
              href={latestLab ? `/lab/${latestLab.slug}` : "/lab"}
              className="text-[14px] text-[rgba(203,197,228,0.74)] hover:text-[rgba(221,215,242,0.9)] transition-colors duration-200"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
            >
              From the Lab: {latestLab?.title ?? "How to calm an anxious mind"} →
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
              Full access from A$9.92/month — less noise, more direction.
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
