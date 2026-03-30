"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Dot {
  id:            number;
  size:          number;
  left:          number;
  bottom:        number;
  alpha:         number;
  duration:      number;
  delay:         number;
  ty:            number;
  tx:            number;
  rgb:           string;
  pulseDuration: number;
  pulseDelay:    number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PURPLE_SHADES = [
  "148,110,220",
  "120,88,198",
  "178,148,240",
  "100,78,185",
  "195,165,248",
];

const FREE_FEATURES = [
  "Access to all 6 tools",
  "One full session per tool",
  "No account required",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Unlimited sessions across all tools",
  "Session history and patterns",
  "AI-powered tools (Clear Your Mind, Choose, Break It Down)",
  "Export your data",
  "Early access to new tools",
];

const COMPARISON_ROWS = [
  { feature: "All 6 wellness tools",   free: true,  pro: true  },
  { feature: "One session per tool",   free: true,  pro: true  },
  { feature: "Unlimited sessions",     free: false, pro: true  },
  { feature: "Session history",        free: false, pro: true  },
  { feature: "AI-powered tools",       free: false, pro: true  },
  { feature: "Mood patterns & trends", free: false, pro: true  },
  { feature: "Gratitude archive",      free: false, pro: true  },
  { feature: "Export data",            free: false, pro: true  },
];

const FAQS = [
  {
    q: "Can I really use Solace for free?",
    a: "Yes. Every tool has a full free session with no account needed. You only need to sign up when you want to save your history or access unlimited sessions.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your data stays in your account. You can export everything before you cancel, and we never delete your history.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "Yes — you can start free and upgrade when you're ready. No credit card required to create an account.",
  },
  {
    q: "Do you offer refunds?",
    a: "If you upgrade and change your mind within 7 days, contact us and we'll refund in full, no questions asked.",
  },
];

// JSON-LD FAQ schema for SEO
const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: {
      "@type": "Answer",
      text: a,
    },
  })),
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [dots, setDots]             = useState<Dot[]>([]);
  const [isAnnual, setIsAnnual]     = useState(true);
  const [openFaq, setOpenFaq]       = useState<number | null>(null);
  const [cardHovered, setCardHovered] = useState<"free" | "pro" | null>(null);
  const [freeCtaHovered, setFreeCtaHovered] = useState(false);
  const [proCtaHovered, setProCtaHovered]   = useState(false);
  const [footerCtaHovered, setFooterCtaHovered] = useState(false);

  useEffect(() => {
    setDots(
      Array.from({ length: 120 }, (_, id) => ({
        id,
        size:          0.8  + Math.random() * 3.0,
        left:          2    + Math.random() * 96,
        bottom:        Math.random() * 20,
        alpha:         0.10 + Math.random() * 0.35,
        duration:      12   + Math.random() * 20,
        delay:         -(Math.random() * 32),
        ty:            40   + Math.random() * 50,
        tx:            -50  + Math.random() * 100,
        rgb:           PURPLE_SHADES[Math.floor(Math.random() * PURPLE_SHADES.length)],
        pulseDuration: 2    + Math.random() * 3,
        pulseDelay:    -(Math.random() * 5),
      }))
    );
  }, []);

  const monthlyPrice  = "A$14";
  const annualMonthly = "A$9.92";
  const annualTotal   = "A$119";

  return (
    <>
      {/* JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <main className="min-h-screen bg-[#050508] text-white">

        {/* ── Atmospheric background ──────────────────────────────────── */}
        <div
          aria-hidden="true"
          style={{
            position:      "fixed",
            top:           0,
            left:          0,
            width:         "100vw",
            height:        "100vh",
            background:    "radial-gradient(ellipse 80% 65% at 50% 38%, #0e0c1e 0%, #070610 52%, #050508 100%)",
            zIndex:        1,
            pointerEvents: "none",
          }}
        />

        {/* ── Ambient dots ────────────────────────────────────────────── */}
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
          {dots.map((dot) => (
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
                  animation:       "riseUp var(--d) ease-in-out infinite var(--dl)",
                  "--ty":          `-${dot.ty}vh`,
                  "--tx":          `${dot.tx}px`,
                  "--d":           `${dot.duration}s`,
                  "--dl":          `${dot.delay}s`,
                  "--rgb":         dot.rgb,
                  "--a":           `${dot.alpha}`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* ── Page content ────────────────────────────────────────────── */}
        <div style={{ position: "relative", zIndex: 3 }}>

          {/* ══════════════════════════════════════════════════════════════
              SECTION 1 — HERO
          ══════════════════════════════════════════════════════════════ */}
          <section
            style={{
              width:          "100%",
              padding:        "160px 40px 80px",
              boxSizing:      "border-box",
              textAlign:      "center",
            }}
          >
            <p
              style={{
                fontFamily:    "'DM Sans', sans-serif",
                fontWeight:    400,
                fontSize:      "10px",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color:         "rgba(155,145,198,0.45)",
                margin:        "0 0 20px",
              }}
            >
              Simple pricing
            </p>

            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize:   "clamp(36px, 5vw, 62px)",
                lineHeight: 1.15,
                color:      "rgba(235,228,255,0.92)",
                margin:     "0 0 20px",
              }}
            >
              One plan.{" "}
              <em style={{ fontStyle: "italic", color: "rgba(195,178,255,0.72)" }}>
                Everything included.
              </em>
            </h1>

            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize:   "15px",
                color:      "rgba(148,140,188,0.62)",
                lineHeight: 1.7,
                margin:     0,
              }}
            >
              Start free. Upgrade when you're ready. Cancel anytime.
            </p>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              SECTION 2 — PRICING CARDS
          ══════════════════════════════════════════════════════════════ */}
          <section
            style={{
              width:     "100%",
              padding:   "0 40px 100px",
              boxSizing: "border-box",
            }}
          >
            {/* Billing toggle */}
            <div
              style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                gap:            "12px",
                marginBottom:   "48px",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize:   "13px",
                  color:      isAnnual ? "rgba(148,140,188,0.45)" : "rgba(215,208,248,0.88)",
                  transition: "color 0.3s ease",
                }}
              >
                Monthly
              </span>

              {/* Toggle pill */}
              <button
                type="button"
                onClick={() => setIsAnnual((v) => !v)}
                aria-label={isAnnual ? "Switch to monthly billing" : "Switch to annual billing"}
                style={{
                  position:       "relative",
                  width:          "44px",
                  height:         "24px",
                  borderRadius:   "100px",
                  background:     isAnnual
                    ? "linear-gradient(135deg, rgba(123,111,160,0.7), rgba(100,88,148,0.5))"
                    : "rgba(60,55,90,0.4)",
                  border:         isAnnual
                    ? "0.5px solid rgba(160,140,210,0.3)"
                    : "0.5px solid rgba(100,92,148,0.2)",
                  cursor:         "pointer",
                  transition:     "background 0.3s ease, border-color 0.3s ease",
                  padding:        0,
                  flexShrink:     0,
                }}
              >
                <span
                  style={{
                    position:     "absolute",
                    top:          "3px",
                    left:         isAnnual ? "calc(100% - 21px)" : "3px",
                    width:        "18px",
                    height:       "18px",
                    borderRadius: "50%",
                    background:   "rgba(235,228,255,0.92)",
                    transition:   "left 0.3s cubic-bezier(0.22,1,0.36,1)",
                  }}
                />
              </button>

              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize:   "13px",
                  color:      isAnnual ? "rgba(215,208,248,0.88)" : "rgba(148,140,188,0.45)",
                  transition: "color 0.3s ease",
                  display:    "flex",
                  alignItems: "center",
                  gap:        "8px",
                }}
              >
                Annual
                <span
                  style={{
                    fontFamily:    "'DM Sans', sans-serif",
                    fontWeight:    400,
                    fontSize:      "9px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color:         "rgba(123,210,148,0.88)",
                    background:    "rgba(40,100,60,0.2)",
                    border:        "0.5px solid rgba(68,200,110,0.2)",
                    borderRadius:  "100px",
                    padding:       "3px 8px",
                    opacity:       isAnnual ? 1 : 0,
                    transition:    "opacity 0.3s ease",
                  }}
                >
                  Save 30%
                </span>
              </span>
            </div>

            {/* Cards grid */}
            <div
              style={{
                display:             "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap:                 "14px",
                maxWidth:            "820px",
                margin:              "0 auto",
              }}
            >
              {/* FREE CARD */}
              <div
                onMouseEnter={() => setCardHovered("free")}
                onMouseLeave={() => setCardHovered(null)}
                style={{
                  position:      "relative",
                  borderRadius:  "20px",
                  padding:       "40px 36px",
                  background:    "linear-gradient(145deg, #0c0a1e, #08091a, #0a0818)",
                  border:        `0.5px solid ${cardHovered === "free" ? "rgba(100,92,148,0.28)" : "rgba(80,72,128,0.14)"}`,
                  boxShadow:     cardHovered === "free" ? "0 12px 50px rgba(20,15,50,0.4)" : "none",
                  transform:     cardHovered === "free" ? "translateY(-4px)" : "translateY(0)",
                  transition:    "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.5s cubic-bezier(0.22,1,0.36,1)",
                  boxSizing:     "border-box",
                  overflow:      "hidden",
                  display:       "flex",
                  flexDirection: "column",
                }}
              >
                {/* Top shimmer */}
                <div
                  aria-hidden="true"
                  style={{
                    position:      "absolute",
                    top:           0,
                    left:          "20%",
                    right:         "20%",
                    height:        "1px",
                    background:    "linear-gradient(90deg, transparent, rgba(120,110,180,0.3), transparent)",
                    opacity:       cardHovered === "free" ? 0.7 : 0.35,
                    transition:    "opacity 0.5s ease",
                    pointerEvents: "none",
                  }}
                />

                <p
                  style={{
                    fontFamily:    "'DM Sans', sans-serif",
                    fontWeight:    400,
                    fontSize:      "10px",
                    letterSpacing: "0.20em",
                    textTransform: "uppercase",
                    color:         "rgba(148,140,188,0.45)",
                    margin:        "0 0 24px",
                  }}
                >
                  Always free
                </p>

                <div style={{ marginBottom: "32px" }}>
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 300,
                      fontSize:   "52px",
                      lineHeight: 1,
                      color:      "rgba(215,208,248,0.88)",
                      margin:     "0 0 6px",
                    }}
                  >
                    A$0
                  </p>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 300,
                      fontSize:   "12px",
                      color:      "rgba(120,112,165,0.5)",
                      margin:     0,
                    }}
                  >
                    Free forever
                  </p>
                </div>

                {/* Features */}
                <ul
                  style={{
                    listStyle: "none",
                    padding:   0,
                    margin:    "0 0 36px",
                    display:   "flex",
                    flexDirection: "column",
                    gap:       "12px",
                    flex:      1,
                  }}
                >
                  {FREE_FEATURES.map((feature) => (
                    <li
                      key={feature}
                      style={{
                        display:    "flex",
                        alignItems: "flex-start",
                        gap:        "10px",
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 300,
                        fontSize:   "13px",
                        color:      "rgba(148,140,188,0.72)",
                        lineHeight: 1.55,
                      }}
                    >
                      <span
                        style={{
                          color:      "rgba(148,140,188,0.4)",
                          flexShrink: 0,
                          marginTop:  "1px",
                          fontSize:   "14px",
                        }}
                      >
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* TODO: Replace /sign-up href with Stripe free tier link when Stripe is live */}
                <Link
                  href="/sign-up"
                  onMouseEnter={() => setFreeCtaHovered(true)}
                  onMouseLeave={() => setFreeCtaHovered(false)}
                  style={{
                    display:        "block",
                    textAlign:      "center",
                    padding:        "13px 24px",
                    borderRadius:   "2px",
                    border:         freeCtaHovered
                      ? "0.5px solid rgba(130,120,180,0.35)"
                      : "0.5px solid rgba(100,92,148,0.2)",
                    background:     freeCtaHovered
                      ? "rgba(80,72,128,0.12)"
                      : "transparent",
                    fontFamily:    "'DM Sans', sans-serif",
                    fontWeight:    400,
                    fontSize:      "12px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color:         freeCtaHovered
                      ? "rgba(215,208,248,0.75)"
                      : "rgba(160,152,210,0.55)",
                    textDecoration: "none",
                    transition:    "background 0.3s ease, border-color 0.3s ease, color 0.3s ease",
                  }}
                >
                  Start free
                </Link>
              </div>

              {/* PRO CARD */}
              <div
                onMouseEnter={() => setCardHovered("pro")}
                onMouseLeave={() => setCardHovered(null)}
                style={{
                  position:      "relative",
                  borderRadius:  "20px",
                  padding:       "40px 36px",
                  background:    "linear-gradient(145deg, #0e0c22, #0a0818, #100d24)",
                  border:        `0.5px solid ${cardHovered === "pro" ? "rgba(140,120,210,0.45)" : "rgba(123,111,160,0.28)"}`,
                  boxShadow:     cardHovered === "pro"
                    ? "0 16px 60px rgba(60,40,120,0.28), 0 0 40px rgba(100,80,180,0.08)"
                    : "0 8px 40px rgba(40,25,90,0.2)",
                  transform:     cardHovered === "pro" ? "translateY(-4px)" : "translateY(0)",
                  transition:    "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.5s cubic-bezier(0.22,1,0.36,1)",
                  boxSizing:     "border-box",
                  overflow:      "hidden",
                  display:       "flex",
                  flexDirection: "column",
                }}
              >
                {/* Top shimmer — purple accent */}
                <div
                  aria-hidden="true"
                  style={{
                    position:      "absolute",
                    top:           0,
                    left:          "15%",
                    right:         "15%",
                    height:        "1px",
                    background:    "linear-gradient(90deg, transparent, rgba(155,130,230,0.6), transparent)",
                    opacity:       cardHovered === "pro" ? 0.9 : 0.5,
                    transition:    "opacity 0.5s ease",
                    pointerEvents: "none",
                  }}
                />

                {/* Recommended badge */}
                <div
                  style={{
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "space-between",
                    marginBottom:   "24px",
                  }}
                >
                  <p
                    style={{
                      fontFamily:    "'DM Sans', sans-serif",
                      fontWeight:    400,
                      fontSize:      "10px",
                      letterSpacing: "0.20em",
                      textTransform: "uppercase",
                      color:         "rgba(168,148,225,0.72)",
                      margin:        0,
                    }}
                  >
                    Most popular
                  </p>
                  <span
                    style={{
                      fontFamily:    "'DM Sans', sans-serif",
                      fontWeight:    400,
                      fontSize:      "9px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color:         "rgba(168,148,225,0.88)",
                      background:    "rgba(80,60,140,0.2)",
                      border:        "0.5px solid rgba(123,111,160,0.3)",
                      borderRadius:  "100px",
                      padding:       "4px 10px",
                    }}
                  >
                    Recommended
                  </span>
                </div>

                {/* Price */}
                <div style={{ marginBottom: "32px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 300,
                        fontSize:   "52px",
                        lineHeight: 1,
                        color:      "rgba(215,208,248,0.95)",
                        margin:     0,
                        transition: "opacity 0.25s ease",
                      }}
                    >
                      {isAnnual ? annualMonthly : monthlyPrice}
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 300,
                        fontSize:   "13px",
                        color:      "rgba(148,140,188,0.55)",
                        margin:     0,
                      }}
                    >
                      /month
                    </p>
                  </div>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 300,
                      fontSize:   "12px",
                      color:      "rgba(120,112,165,0.55)",
                      margin:     "6px 0 0",
                      transition: "opacity 0.25s ease",
                    }}
                  >
                    {isAnnual ? `Billed ${annualTotal}/year` : "Billed monthly"}
                  </p>
                </div>

                {/* Features */}
                <ul
                  style={{
                    listStyle:     "none",
                    padding:       0,
                    margin:        "0 0 36px",
                    display:       "flex",
                    flexDirection: "column",
                    gap:           "12px",
                    flex:          1,
                  }}
                >
                  {PRO_FEATURES.map((feature) => (
                    <li
                      key={feature}
                      style={{
                        display:    "flex",
                        alignItems: "flex-start",
                        gap:        "10px",
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 300,
                        fontSize:   "13px",
                        color:      "rgba(195,188,238,0.78)",
                        lineHeight: 1.55,
                      }}
                    >
                      <span
                        style={{
                          color:      "rgba(168,148,225,0.72)",
                          flexShrink: 0,
                          marginTop:  "1px",
                          fontSize:   "14px",
                        }}
                      >
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* TODO: Replace /sign-up href with Stripe Pro checkout link when Stripe is live */}
                <Link
                  href="/sign-up"
                  onMouseEnter={() => setProCtaHovered(true)}
                  onMouseLeave={() => setProCtaHovered(false)}
                  style={{
                    display:        "block",
                    textAlign:      "center",
                    padding:        "14px 24px",
                    borderRadius:   "2px",
                    border:         proCtaHovered
                      ? "0.5px solid rgba(168,148,225,0.6)"
                      : "0.5px solid rgba(140,120,200,0.38)",
                    background:     proCtaHovered
                      ? "linear-gradient(135deg, rgba(100,80,168,0.28), rgba(80,60,140,0.2))"
                      : "linear-gradient(135deg, rgba(80,60,148,0.18), rgba(60,45,120,0.12))",
                    fontFamily:    "'DM Sans', sans-serif",
                    fontWeight:    400,
                    fontSize:      "12px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color:         proCtaHovered
                      ? "rgba(225,215,255,0.95)"
                      : "rgba(195,180,245,0.8)",
                    textDecoration: "none",
                    transition:    "background 0.3s ease, border-color 0.3s ease, color 0.3s ease",
                    marginBottom:  "12px",
                  }}
                >
                  Start free trial
                </Link>

                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 300,
                    fontSize:   "11px",
                    color:      "rgba(120,112,165,0.42)",
                    textAlign:  "center",
                    margin:     0,
                  }}
                >
                  No credit card required to start
                </p>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              SECTION 3 — COMPARISON TABLE
          ══════════════════════════════════════════════════════════════ */}
          <section
            style={{
              width:     "100%",
              padding:   "0 40px 100px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                maxWidth: "820px",
                margin:   "0 auto",
              }}
            >
              <p
                style={{
                  fontFamily:    "'DM Sans', sans-serif",
                  fontWeight:    400,
                  fontSize:      "10px",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color:         "rgba(155,145,198,0.38)",
                  margin:        "0 0 32px",
                  textAlign:     "center",
                }}
              >
                Free vs Pro
              </p>

              <div
                style={{
                  borderRadius: "16px",
                  border:       "0.5px solid rgba(100,92,148,0.14)",
                  overflow:     "hidden",
                  background:   "linear-gradient(145deg, rgba(14,12,30,0.6), rgba(8,8,24,0.4))",
                }}
              >
                {/* Table header */}
                <div
                  style={{
                    display:             "grid",
                    gridTemplateColumns: "1fr 100px 100px",
                    padding:             "16px 28px",
                    borderBottom:        "0.5px solid rgba(100,92,148,0.12)",
                  }}
                >
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(120,112,165,0.4)" }}>
                    Feature
                  </span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(120,112,165,0.4)", textAlign: "center" }}>
                    Free
                  </span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(168,148,225,0.6)", textAlign: "center" }}>
                    Pro
                  </span>
                </div>

                {/* Table rows */}
                {COMPARISON_ROWS.map((row, i) => (
                  <div
                    key={row.feature}
                    style={{
                      display:             "grid",
                      gridTemplateColumns: "1fr 100px 100px",
                      padding:             "14px 28px",
                      borderBottom:        i < COMPARISON_ROWS.length - 1
                        ? "0.5px solid rgba(100,92,148,0.08)"
                        : "none",
                      alignItems:          "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 300,
                        fontSize:   "13px",
                        color:      "rgba(168,160,215,0.7)",
                      }}
                    >
                      {row.feature}
                    </span>
                    <span style={{ textAlign: "center", fontSize: "15px" }}>
                      {row.free
                        ? <span style={{ color: "rgba(148,140,188,0.55)" }}>✓</span>
                        : <span style={{ color: "rgba(80,75,115,0.4)", fontSize: "12px" }}>—</span>
                      }
                    </span>
                    <span style={{ textAlign: "center", fontSize: "15px" }}>
                      {row.pro
                        ? <span style={{ color: "rgba(168,148,225,0.75)" }}>✓</span>
                        : <span style={{ color: "rgba(80,75,115,0.4)", fontSize: "12px" }}>—</span>
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              SECTION 4 — FAQ
          ══════════════════════════════════════════════════════════════ */}
          <section
            style={{
              width:     "100%",
              padding:   "0 40px 100px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                maxWidth: "640px",
                margin:   "0 auto",
              }}
            >
              <p
                style={{
                  fontFamily:    "'DM Sans', sans-serif",
                  fontWeight:    400,
                  fontSize:      "10px",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color:         "rgba(155,145,198,0.38)",
                  margin:        "0 0 32px",
                  textAlign:     "center",
                }}
              >
                Common questions
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {FAQS.map((faq, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div
                      key={i}
                      style={{
                        borderRadius: "12px",
                        border:       isOpen
                          ? "0.5px solid rgba(123,111,160,0.2)"
                          : "0.5px solid rgba(80,75,115,0.1)",
                        overflow:     "hidden",
                        background:   isOpen
                          ? "rgba(14,12,30,0.5)"
                          : "transparent",
                        transition:   "background 0.3s ease, border-color 0.3s ease",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        style={{
                          width:          "100%",
                          display:        "flex",
                          alignItems:     "center",
                          justifyContent: "space-between",
                          gap:            "16px",
                          padding:        "18px 22px",
                          background:     "transparent",
                          border:         "none",
                          cursor:         "pointer",
                          textAlign:      "left",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 400,
                            fontSize:   "14px",
                            color:      isOpen
                              ? "rgba(215,208,248,0.9)"
                              : "rgba(185,178,225,0.72)",
                            lineHeight: 1.5,
                            transition: "color 0.3s ease",
                          }}
                        >
                          {faq.q}
                        </span>
                        <span
                          style={{
                            color:      "rgba(148,140,188,0.45)",
                            fontSize:   "18px",
                            lineHeight: 1,
                            flexShrink: 0,
                            transform:  isOpen ? "rotate(45deg)" : "rotate(0deg)",
                            transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
                            display:    "inline-block",
                          }}
                        >
                          +
                        </span>
                      </button>

                      {isOpen && (
                        <div style={{ padding: "0 22px 18px" }}>
                          <p
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontWeight: 300,
                              fontSize:   "13px",
                              color:      "rgba(148,140,188,0.65)",
                              lineHeight: 1.75,
                              margin:     0,
                            }}
                          >
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              SECTION 5 — FOOTER CTA
          ══════════════════════════════════════════════════════════════ */}
          <section
            style={{
              width:          "100%",
              padding:        "0 40px 100px",
              boxSizing:      "border-box",
              textAlign:      "center",
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              gap:            "16px",
            }}
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontStyle:  "italic",
                fontSize:   "clamp(20px, 2.5vw, 28px)",
                color:      "rgba(195,185,240,0.55)",
                margin:     0,
              }}
            >
              Still not sure? Try a tool first.
            </p>

            <Link
              href="/tools"
              onMouseEnter={() => setFooterCtaHovered(true)}
              onMouseLeave={() => setFooterCtaHovered(false)}
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            "10px",
                textDecoration: "none",
                color:          footerCtaHovered ? "rgba(195,185,240,0.75)" : "rgba(148,140,188,0.42)",
                transition:     "color 0.35s ease",
              }}
            >
              <span
                style={{
                  fontFamily:    "'DM Sans', sans-serif",
                  fontWeight:    400,
                  fontSize:      "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  transform:     footerCtaHovered ? "translateX(-2px)" : "translateX(0)",
                  transition:    "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                  display:       "inline-block",
                }}
              >
                See the tools
              </span>
              <span
                style={{
                  fontSize:   "16px",
                  lineHeight: 1,
                  display:    "inline-block",
                  opacity:    footerCtaHovered ? 1 : 0.5,
                  transform:  footerCtaHovered ? "translateX(6px)" : "translateX(0)",
                  transition: "opacity 0.45s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                →
              </span>
            </Link>
          </section>

        </div>{/* end content wrapper */}
      </main>
    </>
  );
}
