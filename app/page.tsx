"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import HeroSection from "@/components/hero/HeroSection";
import { SOLACE_ROUTES } from "@/lib/solace/routes";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Dot {
  id:       number;
  size:     number;
  left:     number;
  bottom:   number;
  alpha:    number;
  duration: number;
  delay:    number;
  ty:       number;
  tx:       number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const REALMS = [
  {
    id: "emerald",
    feeling: "When my mind won't stop",
    name: "Clear Your Mind",
    desc: "Your thoughts are circling and you can't find the floor. Release them one by one, watch them take shape, and find what's actually there.",
    href: SOLACE_ROUTES.clearYourMind,
    accent: "rgba(68,200,110,1)",
    bg: "linear-gradient(145deg, #0a1a12, #0d2018, #081610)",
    border: "rgba(48,160,88,0.14)",
    borderHover: "rgba(48,160,88,0.3)",
    shimmer: "linear-gradient(90deg, transparent, rgba(48,200,100,1), transparent)",
    shadow: "0 12px 60px rgba(28,120,60,0.16)",
  },
  {
    id: "azure",
    feeling: "When I can't decide",
    name: "Choose",
    desc: "A decision keeps turning over in your mind. Two paths, one answer — seen with more clarity when the noise is removed.",
    href: SOLACE_ROUTES.choose,
    accent: "rgba(68,138,228,1)",
    bg: "linear-gradient(145deg, #080e1a, #0c1428, #080c18)",
    border: "rgba(48,100,210,0.14)",
    borderHover: "rgba(48,100,210,0.3)",
    shimmer: "linear-gradient(90deg, transparent, rgba(48,120,240,1), transparent)",
    shadow: "0 12px 60px rgba(28,80,180,0.16)",
  },
  {
    id: "amber",
    feeling: "When I feel overwhelmed",
    name: "Break It Down",
    desc: "Something feels too large to begin. Watch what seemed impossible become a sequence of steps you can actually take.",
    href: SOLACE_ROUTES.breakItDown,
    accent: "rgba(218,148,48,1)",
    bg: "linear-gradient(145deg, #1a1008, #281808, #180e04)",
    border: "rgba(200,130,40,0.14)",
    borderHover: "rgba(200,130,40,0.3)",
    shimmer: "linear-gradient(90deg, transparent, rgba(220,150,40,1), transparent)",
    shadow: "0 12px 60px rgba(160,100,20,0.16)",
  },
] as const;

const PILLS = [
  "Not medical advice",
  "Private by design",
  "No data sold",
  "Adult use only",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [dots, setDots]                       = useState<Dot[]>([]);
  const [hoveredRealm, setHoveredRealm]       = useState<string | null>(null);
  const [labCtaHovered, setLabCtaHovered]     = useState(false);
  const [footerLinkHovered, setFooterLinkHovered] = useState(false);

  useEffect(() => {
    setDots(
      Array.from({ length: 160 }, (_, id) => ({
        id,
        size:     0.8  + Math.random() * 3.0,
        left:     2    + Math.random() * 96,
        bottom:   Math.random() * 20,
        alpha:    0.10 + Math.random() * 0.35,
        duration: 12   + Math.random() * 20,
        delay:    -(Math.random() * 32),
        ty:       40   + Math.random() * 50,
        tx:       -50  + Math.random() * 100,
      }))
    );
  }, []);

  return (
    <main className="relative min-h-screen bg-[#050508] text-white">
      {/* ── Ambient dots — fixed, full viewport, behind all content ────────── */}
      <div
        aria-hidden="true"
        style={{
          position:      "fixed",
          top:           0,
          left:          0,
          width:         "100vw",
          height:        "100vh",
          pointerEvents: "none",
          zIndex:        0,
          overflow:      "hidden",
        }}
      >
        {dots.map((dot) => (
          <div
            key={dot.id}
            style={
              {
                position:        "absolute",
                width:           `${dot.size}px`,
                height:          `${dot.size}px`,
                borderRadius:    "50%",
                backgroundColor: `rgba(178,162,232,${dot.alpha})`,
                left:            `${dot.left}%`,
                bottom:          `${dot.bottom}%`,
                animation:       `riseUp ${dot.duration}s linear ${dot.delay}s infinite`,
                "--ty":          `-${dot.ty}vh`,
                "--tx":          `${dot.tx}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* ── Hero — untouched ──────────────────────────────────────────────── */}
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
              fontFamily:    "'DM Sans', sans-serif",
              fontWeight:    400,
              fontSize:      "10px",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color:         "rgba(155,145,198,0.38)",
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
          {REALMS.map((card) => {
            const hov = hoveredRealm === card.id;
            return (
              <Link
                key={card.id}
                href={card.href}
                onMouseEnter={() => setHoveredRealm(card.id)}
                onMouseLeave={() => setHoveredRealm(null)}
                style={{
                  position:       "relative",
                  display:        "flex",
                  flexDirection:  "column",
                  borderRadius:   "18px",
                  padding:        "40px 36px 36px",
                  minHeight:      "300px",
                  cursor:         "pointer",
                  textDecoration: "none",
                  overflow:       "hidden",
                  background:     card.bg,
                  border:         `0.5px solid ${hov ? card.borderHover : card.border}`,
                  boxShadow:      hov ? card.shadow : "none",
                  transform:      hov ? "translateY(-5px)" : "translateY(0)",
                  transition:
                    "transform 0.55s cubic-bezier(0.22,1,0.36,1), box-shadow 0.55s cubic-bezier(0.22,1,0.36,1), border-color 0.55s cubic-bezier(0.22,1,0.36,1)",
                  boxSizing: "border-box",
                }}
              >
                {/* Shimmer line */}
                <div
                  aria-hidden="true"
                  style={{
                    position:      "absolute",
                    top:           0,
                    left:          "20%",
                    right:         "20%",
                    height:        "1px",
                    background:    card.shimmer,
                    opacity:       hov ? 0.7 : 0.35,
                    transition:    "opacity 0.55s ease",
                    pointerEvents: "none",
                  }}
                />

                {/* Feeling label */}
                <p
                  style={{
                    fontFamily:    "'DM Sans', sans-serif",
                    fontWeight:    400,
                    fontSize:      "10px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color:         card.accent,
                    margin:        "0 0 14px",
                    opacity:       hov ? 0.7 : 0.42,
                    transition:    "opacity 0.4s ease",
                  }}
                >
                  {card.feeling}
                </p>

                {/* Realm name */}
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300,
                    fontSize:   "28px",
                    color:      hov ? "rgba(245,240,255,1)" : "rgba(235,228,255,0.9)",
                    margin:     "0 0 16px",
                    lineHeight: 1.2,
                    transition: "color 0.4s ease",
                  }}
                >
                  {card.name}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 300,
                    fontSize:   "13px",
                    color:      hov ? "rgba(165,155,205,0.7)" : "rgba(148,140,188,0.55)",
                    lineHeight: 1.75,
                    margin:     0,
                    flex:       1,
                    transition: "color 0.4s ease",
                  }}
                >
                  {card.desc}
                </p>

                {/* Bottom row */}
                <div
                  style={{
                    marginTop:  "32px",
                    paddingTop: "18px",
                    borderTop:  `0.5px solid ${hov ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"}`,
                    display:    "flex",
                    alignItems: "center",
                    gap:        "8px",
                    transition: "border-color 0.4s ease",
                  }}
                >
                  <span
                    style={{
                      fontFamily:    "'DM Sans', sans-serif",
                      fontWeight:    400,
                      fontSize:      "10px",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color:         card.accent,
                      opacity:       hov ? 0.62 : 0,
                      transform:     hov ? "translateX(0)" : "translateX(-6px)",
                      transition:    "opacity 0.45s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    Begin
                  </span>
                  <span
                    style={{
                      fontSize:   "16px",
                      color:      card.accent,
                      opacity:    hov ? 0.72 : 0.22,
                      transform:  hov ? "translateX(2px)" : "translateX(-4px)",
                      transition: "opacity 0.45s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)",
                      lineHeight: 1,
                      display:    "inline-block",
                    }}
                  >
                    ›
                  </span>
                </div>
              </Link>
            );
          })}
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
              Solace doesn't give you{" "}
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
                  fontFamily:    "'DM Sans', sans-serif",
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
                fontFamily:    "'DM Sans', sans-serif",
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
                fontFamily: "'DM Sans', sans-serif",
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
                  fontFamily:    "'DM Sans', sans-serif",
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

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════════ */}
      <footer style={{ width: "100%" }}>
        <div
          style={{
            maxWidth:       "1100px",
            margin:         "0 auto",
            width:          "100%",
            padding:        "18px 40px",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            gap:            "24px",
            boxSizing:      "border-box",
            borderTop:      "0.5px solid rgba(255,255,255,0.04)",
          }}
        >
        <p
          style={{
            fontFamily:     "'DM Sans', sans-serif",
            fontWeight:     300,
            fontSize:       "10px",
            color:          "rgba(108,100,148,0.32)",
            letterSpacing:  "0.03em",
            margin:         0,
            whiteSpace:     "nowrap",
            overflow:       "hidden",
            textOverflow:   "ellipsis",
          }}
        >
          Solace is designed for adults and offers reflective support — not medical,
          psychological, legal, financial, or professional advice.
        </p>

        <Link
          href="/scope"
          onMouseEnter={() => setFooterLinkHovered(true)}
          onMouseLeave={() => setFooterLinkHovered(false)}
          style={{
            fontFamily:     "'DM Sans', sans-serif",
            fontWeight:     400,
            fontSize:       "10px",
            letterSpacing:  "0.12em",
            textTransform:  "uppercase",
            color:          footerLinkHovered ? "rgba(180,168,228,0.72)" : "rgba(135,125,180,0.38)",
            textDecoration: "none",
            cursor:         "pointer",
            whiteSpace:     "nowrap",
            flexShrink:     0,
            transition:     "color 0.3s ease",
          }}
        >
          Read scope →
        </Link>
        </div>
      </footer>
    </main>
  );
}
