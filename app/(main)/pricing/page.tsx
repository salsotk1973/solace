"use client";

import { useState } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import CheckoutButton from "@/components/pricing/CheckoutButton";
import BgSubtle from "@/components/backgrounds/BgSubtle";
import { TEXT_COLOURS, FONT_SIZE, CATEGORY_COLOURS } from "@/lib/design-tokens";

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
  const [isAnnual, setIsAnnual]     = useState(true);
  const [openFaq, setOpenFaq]       = useState<number | null>(null);
  const [cardHovered, setCardHovered] = useState<"free" | "pro" | null>(null);
  const [freeCtaHovered, setFreeCtaHovered] = useState(false);
  const [proCtaHovered, setProCtaHovered]   = useState(false);
  const [footerCtaHovered, setFooterCtaHovered] = useState(false);

  const monthlyPrice  = "A$9";
  const annualMonthly = "A$6.58";
  const annualTotal   = "A$79";

  return (
    <PageShell particles={false}>
      <BgSubtle>
        {/* JSON-LD FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
        />

        <div style={{ position: "relative", zIndex: 3 }}>

          {/* ══════════════════════════════════════════════════════════════
              SECTION 1 — HERO
          ══════════════════════════════════════════════════════════════ */}
          <section
            style={{
              width:          "100%",
              padding:        "clamp(100px, 12vw, 160px) clamp(20px, 5vw, 40px) 80px",
              boxSizing:      "border-box",
              textAlign:      "center",
            }}
          >
            <p
              style={{
                fontFamily:    "'Jost', sans-serif",
                fontWeight:    400,
                fontSize:      `${FONT_SIZE.eyebrow}px`,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color:         CATEGORY_COLOURS.decide.hex,
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
              <em style={{ fontStyle: "italic", color: "rgba(195,178,255,0.72)", whiteSpace: "nowrap" }}>
                Everything included.
              </em>
            </h1>

            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 300,
                fontSize:   `${FONT_SIZE.body}px`,
                color:      TEXT_COLOURS.body,
                lineHeight: 1.7,
                margin:     0,
              }}
            >
              Start free. Upgrade when you&apos;re ready. Cancel anytime.
            </p>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              SECTION 2 — PRICING CARDS
          ══════════════════════════════════════════════════════════════ */}
          <section
            style={{
              width:     "100%",
              padding:   "0 clamp(20px, 5vw, 40px) 100px",
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
                  fontFamily: "'Jost', sans-serif",
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
                  fontFamily: "'Jost', sans-serif",
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
                    fontFamily:    "'Jost', sans-serif",
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
                  Save 26%
                </span>
              </span>
            </div>

            {/* Cards grid */}
            <div
              style={{
                display:             "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
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
                  padding:       "clamp(24px, 5vw, 40px) clamp(20px, 4vw, 36px)",
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
                    fontFamily:    "'Jost', sans-serif",
                    fontWeight:    400,
                    fontSize:      `${FONT_SIZE.eyebrow}px`,
                    letterSpacing: "0.20em",
                    textTransform: "uppercase",
                    color:         TEXT_COLOURS.secondary,
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
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 300,
                      fontSize:   "12px",
                      color:      TEXT_COLOURS.secondary,
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
                        fontFamily: "'Jost', sans-serif",
                        fontWeight: 300,
                        fontSize:   "13px",
                        color:      TEXT_COLOURS.body,
                        lineHeight: 1.55,
                      }}
                    >
                      <span
                        style={{
                          color:      TEXT_COLOURS.secondary,
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
                    fontFamily:    "'Jost', sans-serif",
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
                  padding:       "clamp(24px, 5vw, 40px) clamp(20px, 4vw, 36px)",
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
                      fontFamily:    "'Jost', sans-serif",
                      fontWeight:    400,
                      fontSize:      `${FONT_SIZE.eyebrow}px`,
                      letterSpacing: "0.20em",
                      textTransform: "uppercase",
                      color:         CATEGORY_COLOURS.decide.hex,
                      margin:        0,
                    }}
                  >
                    Most popular
                  </p>
                  <span
                    style={{
                      fontFamily:    "'Jost', sans-serif",
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
                        fontFamily: "'Jost', sans-serif",
                        fontWeight: 300,
                        fontSize:   "13px",
                        color:      TEXT_COLOURS.secondary,
                        margin:     0,
                      }}
                    >
                      /month
                    </p>
                  </div>
                  <p
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 300,
                      fontSize:   "12px",
                      color:      TEXT_COLOURS.secondary,
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
                        fontFamily: "'Jost', sans-serif",
                        fontWeight: 300,
                        fontSize:   "13px",
                        color:      TEXT_COLOURS.body,
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

                <CheckoutButton
                  priceId={
                    isAnnual
                      ? process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID!
                      : process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!
                  }
                  onMouseEnter={() => setProCtaHovered(true)}
                  onMouseLeave={() => setProCtaHovered(false)}
                  style={{
                    display:        "block",
                    width:          "100%",
                    textAlign:      "center",
                    padding:        "14px 24px",
                    borderRadius:   "2px",
                    border:         proCtaHovered
                      ? "0.5px solid rgba(168,148,225,0.6)"
                      : "0.5px solid rgba(140,120,200,0.38)",
                    background:     proCtaHovered
                      ? "linear-gradient(135deg, rgba(100,80,168,0.28), rgba(80,60,140,0.2))"
                      : "linear-gradient(135deg, rgba(80,60,148,0.18), rgba(60,45,120,0.12))",
                    fontFamily:    "'Jost', sans-serif",
                    fontWeight:    400,
                    fontSize:      "12px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color:         proCtaHovered
                      ? "rgba(225,215,255,0.95)"
                      : "rgba(195,180,245,0.8)",
                    transition:    "background 0.3s ease, border-color 0.3s ease, color 0.3s ease",
                    marginBottom:  "12px",
                    boxSizing:     "border-box" as const,
                  }}
                >
                  Upgrade to Pro
                </CheckoutButton>

                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 300,
                    fontSize:   `${FONT_SIZE.eyebrow}px`,
                    color:      TEXT_COLOURS.secondary,
                    textAlign:  "center",
                    margin:     0,
                  }}
                >
                  Cancel anytime. Billed annually.
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
              padding:   "0 clamp(20px, 5vw, 40px) 100px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                maxWidth:  "820px",
                margin:    "0 auto",
                width:     "100%",
                boxSizing: "border-box",
              }}
            >
              <p
                style={{
                  fontFamily:    "'Jost', sans-serif",
                  fontWeight:    400,
                  fontSize:      `${FONT_SIZE.eyebrow}px`,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color:         TEXT_COLOURS.secondary,
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
                    gridTemplateColumns: "1fr 72px 72px",
                    padding:             "16px clamp(12px, 3vw, 28px)",
                    borderBottom:        "0.5px solid rgba(100,92,148,0.12)",
                  }}
                >
                  <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: `${FONT_SIZE.eyebrow}px`, letterSpacing: "0.18em", textTransform: "uppercase", color: TEXT_COLOURS.secondary }}>
                    Feature
                  </span>
                  <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: `${FONT_SIZE.eyebrow}px`, letterSpacing: "0.18em", textTransform: "uppercase", color: TEXT_COLOURS.secondary, textAlign: "center" }}>
                    Free
                  </span>
                  <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(168,148,225,0.6)", textAlign: "center" }}>
                    Pro
                  </span>
                </div>

                {/* Table rows */}
                {COMPARISON_ROWS.map((row, i) => (
                  <div
                    key={row.feature}
                    style={{
                      display:             "grid",
                      gridTemplateColumns: "1fr 72px 72px",
                      padding:             "14px clamp(12px, 3vw, 28px)",
                      borderBottom:        i < COMPARISON_ROWS.length - 1
                        ? "0.5px solid rgba(100,92,148,0.08)"
                        : "none",
                      alignItems:          "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        fontWeight: 300,
                        fontSize:   "13px",
                        color:      TEXT_COLOURS.body,
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
              padding:   "0 clamp(20px, 5vw, 40px) 100px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                maxWidth:  "640px",
                margin:    "0 auto",
                width:     "100%",
                boxSizing: "border-box",
              }}
            >
              <p
                style={{
                  fontFamily:    "'Jost', sans-serif",
                  fontWeight:    400,
                  fontSize:      `${FONT_SIZE.eyebrow}px`,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color:         TEXT_COLOURS.secondary,
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
                            fontFamily: "'Jost', sans-serif",
                            fontWeight: 400,
                            fontSize:   "14px",
                            color:      isOpen
                              ? TEXT_COLOURS.primary
                              : TEXT_COLOURS.body,
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
                              fontFamily: "'Jost', sans-serif",
                              fontWeight: 300,
                              fontSize:   `${FONT_SIZE.body}px`,
                              color:      TEXT_COLOURS.body,
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
                color:      TEXT_COLOURS.secondary,
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
                  fontFamily:    "'Jost', sans-serif",
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
      </BgSubtle>
    </PageShell>
  );
}
