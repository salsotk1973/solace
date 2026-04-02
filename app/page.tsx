"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeroSection from "@/components/hero/HeroSection";
import ToolCard from "@/components/tools/ToolCard";
import { SOLACE_ROUTES } from "@/lib/solace/routes";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Dot {
  id:           number;
  size:         number;
  left:         number;
  bottom:       number;
  alpha:        number;
  duration:     number;
  delay:        number;
  ty:           number;
  tx:           number;
  rgb:          string;
  pulseDuration: number;
  pulseDelay:   number;
}

const PURPLE_SHADES = [
  "148,110,220",  // aura purple
  "120,88,198",   // deep purple
  "178,148,240",  // light lavender
  "100,78,185",   // dark purple
  "195,165,248",  // soft lilac
];

// ─── Data ─────────────────────────────────────────────────────────────────────

const REALMS = [
  {
    id:      "emerald",
    tag:     "When my mind won't stop",
    name:    "Clear Your Mind",
    line:    "Your thoughts are circling and you can't find the floor. Release them one by one, watch them take shape, and find what's actually there.",
    href:    SOLACE_ROUTES.clearYourMind,
    colour:  "rgba(68,200,110,1)",
    bg:      "linear-gradient(145deg, #0a1a12, #0d2018, #081610)",
  },
  {
    id:      "azure",
    tag:     "When I can't decide",
    name:    "Choose",
    line:    "A decision keeps turning over in your mind. Two paths, one answer — seen with more clarity when the noise is removed.",
    href:    SOLACE_ROUTES.choose,
    colour:  "rgba(68,138,228,1)",
    bg:      "linear-gradient(145deg, #080e1a, #0c1428, #080c18)",
  },
  {
    id:      "amber",
    tag:     "When I feel overwhelmed",
    name:    "Break It Down",
    line:    "Something feels too large to begin. Watch what seemed impossible become a sequence of steps you can actually take.",
    href:    SOLACE_ROUTES.breakItDown,
    colour:  "rgba(218,148,48,1)",
    bg:      "linear-gradient(145deg, #1a1008, #281808, #180e04)",
  },
];

const FREE_TOOLS = [
  { name: 'Breathing',       href: '/breathing', accent: 'rgba(60,190,210,1)' },
  { name: 'Focus Timer',     href: '/focus',     accent: 'rgba(240,170,70,1)' },
  { name: 'Sleep Wind-Down', href: '/sleep',     accent: 'rgba(140,120,210,1)' },
  { name: 'Thought Reframer',href: '/reframe',   accent: 'rgba(130,185,140,1)' },
  { name: 'Mood Tracker',    href: '/mood',      accent: 'rgba(210,150,165,1)' },
  { name: 'Gratitude Log',   href: '/gratitude', accent: 'rgba(220,175,80,1)' },
]

const PILLS = [
  "Not medical advice",
  "Private by design",
  "No data sold",
  "Adult use only",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [labCtaHovered, setLabCtaHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    let isActive = true;
    const frameId = window.requestAnimationFrame(() => {
      if (!isActive) return;

      setIsMounted(true);
      setDots(
        Array.from({ length: 160 }, (_, id) => ({
          id,
          size:         0.8  + Math.random() * 3.0,
          left:         2    + Math.random() * 96,
          bottom:       Math.random() * 20,
          alpha:        0.10 + Math.random() * 0.35,
          duration:     12   + Math.random() * 20,
          delay:        -(Math.random() * 32),
          ty:           40   + Math.random() * 50,
          tx:           -50  + Math.random() * 100,
          rgb:          PURPLE_SHADES[Math.floor(Math.random() * PURPLE_SHADES.length)],
          pulseDuration: 2   + Math.random() * 3,
          pulseDelay:   -(Math.random() * 5),
        })),
      );
    });

    return () => {
      isActive = false;
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#050508] text-white">
      {/* ── Ambient dots — fixed, z-index 2, above background, below content */}
      <div
        aria-hidden="true"
        style={{
          position:      "fixed",
          top:           0,
          left:          0,
          width:         "100vw",
          height:        "100vh",
          pointerEvents: "none",
          zIndex:        2,
          overflow:      "hidden",
        }}
      >
        {isMounted && dots.map((dot) => (
          <div
            key={dot.id}
            style={
              {
                position:        "absolute",
                width:           `${dot.size}px`,
                height:          `${dot.size}px`,
                borderRadius:    "50%",
                backgroundColor: "rgba(var(--rgb), var(--a))",
                left:            `${dot.left}%`,
                bottom:          `${dot.bottom}%`,
                animation:       "riseUp var(--d) ease-in-out infinite var(--dl), purplePulse var(--pd) ease-in-out infinite var(--poff)",
                "--ty":          `-${dot.ty}vh`,
                "--tx":          `${dot.tx}px`,
                "--d":           `${dot.duration}s`,
                "--dl":          `${dot.delay}s`,
                "--rgb":         dot.rgb,
                "--a":           `${dot.alpha}`,
                "--size":        `${dot.size}`,
                "--pd":          `${dot.pulseDuration}s`,
                "--poff":        `${dot.pulseDelay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* ── All page content — z-index 3, sits above dots ─────────────────── */}
      <div style={{ position: "relative", zIndex: 3 }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — THREE REALMS
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          width:     "100%",
          padding:   "0 40px 120px",
          boxSizing: "border-box",
        }}
      >
        {/* Intro */}
        <div style={{ textAlign: "center", marginTop: "24px", marginBottom: "32px" }}>
          <p
            style={{
              fontFamily:    "'Jost', sans-serif",
              fontWeight:    400,
              fontSize:      "10px",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color:         "rgba(185,175,220,0.65)",
              margin:        "0 0 18px",
            }}
          >
            Three realms. One for each kind of moment.
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize:   "clamp(26px, 3.2vw, 40px)",
              color:      "rgba(235,228,255,0.85)",
              lineHeight: 1.25,
              margin:     0,
            }}
          >
            Start from{" "}
            <em style={{ fontStyle: "italic" }}>how it feels</em>
            {" "}— not what it is.
          </h2>
        </div>

        {/* ── Free tools compact grid ──────────────────────────────────── */}
        <div style={{ maxWidth: "1000px", margin: "0 auto 52px" }}>
          <p
            style={{
              fontFamily:    "'Jost', sans-serif",
              fontWeight:    400,
              fontSize:      "9px",
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color:         "rgba(155,145,200,0.42)",
              textAlign:     "center",
              margin:        "0 0 16px",
            }}
          >
            Free tools — start here
          </p>
          <div
            style={{
              display:             "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap:                 "10px",
            }}
          >
            {FREE_TOOLS.map(tool => {
              const bg     = tool.accent.replace(/,[\d.]+\)$/, ',0.09)')
              const border = tool.accent.replace(/,[\d.]+\)$/, ',0.18)')
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  style={{
                    display:         "flex",
                    alignItems:      "center",
                    justifyContent:  "space-between",
                    borderRadius:    "10px",
                    padding:         "14px 18px",
                    background:      bg,
                    border:          `0.5px solid ${border}`,
                    backdropFilter:  "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    textDecoration:  "none",
                    transition:      "border-color 0.3s ease, background 0.3s ease",
                    boxSizing:       "border-box",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = tool.accent.replace(/,[\d.]+\)$/, ',0.32)')
                    e.currentTarget.style.background = tool.accent.replace(/,[\d.]+\)$/, ',0.14)')
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = border
                    e.currentTarget.style.background = bg
                  }}
                >
                  <span
                    style={{
                      fontFamily:    "'Jost', sans-serif",
                      fontWeight:    400,
                      fontSize:      "12px",
                      letterSpacing: "0.02em",
                      color:         "rgba(210,204,240,0.82)",
                    }}
                  >
                    {tool.name}
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      color:    tool.accent.replace(/,[\d.]+\)$/, ',0.55)'),
                    }}
                  >
                    →
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Three-column grid */}
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap:                 "14px",
            maxWidth:            "1000px",
            margin:              "0 auto",
          }}
        >
          {REALMS.map((card) => (
            <ToolCard
              key={card.id}
              tag={card.tag}
              name={card.name}
              line={card.line}
              href={card.href}
              colour={card.colour}
              bg={card.bg}
              minHeight="300px"
            />
          ))}
        </div>

        {/* See all tools link */}
        <div style={{ textAlign: "center", marginTop: "28px" }}>
          <Link
            href="/tools"
            style={{
              fontFamily:    "'Jost', sans-serif",
              fontWeight:    300,
              fontSize:      "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color:         "rgba(148,140,188,0.38)",
              textDecoration: "none",
            }}
          >
            See all tools →
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2 — TRUST MOMENT
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          width:      "100%",
          padding:    "100px 40px",
          boxSizing:  "border-box",
        }}
      >
        {/* Quote + pills block */}
        <div
          style={{
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            justifyContent: "center",
            gap:            "36px",
            textAlign:      "center",
            maxWidth:       "560px",
            margin:         "0 auto",
          }}
        >
          <blockquote
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontStyle:  "italic",
              fontSize:   "clamp(28px, 3.4vw, 42px)",
              lineHeight: 1.45,
              color:      "rgba(215,208,248,0.72)",
              margin:     0,
              padding:    0,
            }}
          >
            <span style={{ display: "block" }}>
              Solace doesn&apos;t give you{" "}
              <em style={{ fontStyle: "normal", fontWeight: 300, color: "rgba(238,232,255,0.94)" }}>
                answers.
              </em>
            </span>
            <span style={{ display: "block" }}>
              It helps you find{" "}
              <em style={{ fontStyle: "normal", fontWeight: 300, color: "rgba(238,232,255,0.94)" }}>
                your own.
              </em>
            </span>
          </blockquote>

          <div
            style={{
              display:        "flex",
              flexDirection:  "row",
              justifyContent: "center",
              gap:            "10px",
              flexWrap:       "wrap",
            }}
          >
            {PILLS.map((pill) => (
              <span
                key={pill}
                style={{
                  fontFamily:    "'Jost', sans-serif",
                  fontWeight:    400,
                  fontSize:      "10px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color:         "rgba(138,130,182,0.38)",
                  border:        "0.5px solid rgba(138,130,182,0.11)",
                  padding:       "6px 14px",
                  borderRadius:  "100px",
                }}
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3 — THE LAB
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          width:          "100%",
          padding:        "0 40px 100px",
          boxSizing:      "border-box",
          display:        "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position:     "relative",
            maxWidth:     "1000px",
            width:        "100%",
            borderRadius: "22px",
            padding:      "60px 64px",
            background:   "linear-gradient(135deg, #0e0c22, #0a0818, #0c0a1e)",
            border:       "0.5px solid rgba(120,100,195,0.13)",
            overflow:     "hidden",
            boxSizing:    "border-box",
          }}
        >
          {/* Top shimmer */}
          <div
            aria-hidden="true"
            style={{
              position:      "absolute",
              top:           0,
              left:          "15%",
              right:         "15%",
              height:        "1px",
              background:    "linear-gradient(90deg, transparent, rgba(138,116,212,0.2), transparent)",
              pointerEvents: "none",
            }}
          />

          {/* Content */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <p
              style={{
                fontFamily:    "'Jost', sans-serif",
                fontWeight:    400,
                fontSize:      "10px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color:         "rgba(130,112,200,0.42)",
                margin:        "0 0 20px",
              }}
            >
              Inside the Lab
            </p>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize:   "clamp(26px, 2.8vw, 38px)",
                lineHeight: 1.28,
                margin:     "0 0 18px",
                maxWidth:   "520px",
              }}
            >
              <span style={{ color: "rgba(230,222,255,0.9)", display: "block" }}>
                A growing space for understanding
              </span>
              <em style={{ color: "rgba(192,172,248,0.65)", fontStyle: "italic", display: "block" }}>
                how people think, feel, and decide.
              </em>
            </h2>

            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 300,
                fontSize:   "13px",
                color:      "rgba(135,128,178,0.52)",
                lineHeight: 1.8,
                margin:     "0 0 36px",
                maxWidth:   "440px",
              }}
            >
              The Digital Human Behaviour Lab sits behind Solace — observing patterns,
              studying responses, and using what it learns to make every interaction
              calmer and more useful.
            </p>

            <Link
              href="/lab"
              onMouseEnter={() => setLabCtaHovered(true)}
              onMouseLeave={() => setLabCtaHovered(false)}
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            "10px",
                cursor:         "pointer",
                textDecoration: "none",
                color:          labCtaHovered ? "rgba(200,185,245,0.82)" : "rgba(168,152,225,0.45)",
                transition:     "color 0.4s ease",
              }}
            >
              <span
                style={{
                  fontFamily:    "'Jost', sans-serif",
                  fontWeight:    400,
                  fontSize:      "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  display:       "inline-block",
                  transform:     labCtaHovered ? "translateX(-2px)" : "translateX(0)",
                  transition:    "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                Enter the Lab
              </span>
              <span
                style={{
                  fontSize:   "16px",
                  display:    "inline-block",
                  lineHeight: 1,
                  opacity:    labCtaHovered ? 1 : 0.4,
                  transform:  labCtaHovered ? "translateX(6px)" : "translateX(0)",
                  transition: "opacity 0.45s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      </div>{/* end content wrapper */}
    </main>
  );
}
