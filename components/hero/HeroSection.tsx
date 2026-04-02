"use client";

import { useEffect, useRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const LINE1          = "When your mind is too full";
const LINE2          = "to think clearly.";
const SUBHEAD        = "Solace helps you find the next right step — through thought, not noise.";
const TAGLINE        = "Where would you like to begin?";

const LINE1_CHARS    = LINE1.split("");
const LINE2_CHARS    = LINE2.split("");
const TAGLINE_CHARS  = TAGLINE.split("");


// ─── Component ────────────────────────────────────────────────────────────────

export default function HeroSection() {
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Element refs for JS-driven class additions
  const headlineRefs   = useRef<(HTMLSpanElement | null)[]>([]);
  const taglineRefs    = useRef<(HTMLSpanElement | null)[]>([]);
  const subheadRef     = useRef<HTMLParagraphElement>(null);
  const taglineWrapRef = useRef<HTMLDivElement>(null);
  const ctaRef         = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // Helper: schedule a callback and track the timer for cleanup
    const schedule = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timers.current.push(t);
    };

    // ── Headline — line 1, character by character ─────────────────────────────
    // Starts at 2500 ms, 100 ms per character (spaces included in timing)
    const l1 = LINE1_CHARS.length;
    LINE1_CHARS.forEach((_, i) => {
      schedule(
        () => headlineRefs.current[i]?.classList.add("lit"),
        2500 + i * 100
      );
    });

    // ── Headline — line 2 ─────────────────────────────────────────────────────
    // Starts 200 ms after last line-1 character
    const l2          = LINE2_CHARS.length;
    const line2Start  = 2500 + (l1 - 1) * 100 + 200;
    LINE2_CHARS.forEach((_, i) => {
      schedule(
        () => headlineRefs.current[l1 + i]?.classList.add("lit"),
        line2Start + i * 100
      );
    });

    // ── Sub-headline ──────────────────────────────────────────────────────────
    // Fades in 200 ms after the last headline character lands
    const subStart = line2Start + (l2 - 1) * 100 + 200;
    schedule(() => subheadRef.current?.classList.add("visible"), subStart);

    // Keep CTA immediately interactive to avoid click interception.
    ctaRef.current?.classList.add("visible");

    // ── Tagline — letter by letter ────────────────────────────────────────────
    // Starts 2200 ms after sub-headline fade begins, 68 ms per character
    const tagStart = subStart + 2200;
    TAGLINE_CHARS.forEach((_, i) => {
      schedule(
        () => taglineRefs.current[i]?.classList.add("lit"),
        tagStart + i * 68
      );
    });

    // ── Float wrapper ─────────────────────────────────────────────────────────
    // 500 ms after the last tagline character lands
    const lastTagMs  = tagStart + (TAGLINE_CHARS.length - 1) * 68;
    const floatStart = lastTagMs + 500;
    schedule(
      () => taglineWrapRef.current?.classList.add("floating"),
      floatStart
    );

    // Cleanup: cancel every pending timer on unmount
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <>
      {/*
        Keyframes are mirrored here (as well as globals.css) to guarantee they
        are in the document regardless of Tailwind/Turbopack CSS ordering.
      */}
      <style jsx global>{`
        @keyframes riseUp {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { transform: translateY(var(--ty)) translateX(var(--tx)); opacity: 0; }
        }
        @keyframes appear {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes letterLand {
          0%   { opacity: 0; text-shadow: none; }
          30%  { opacity: 1; text-shadow: 0 0 18px rgba(230,218,255,0.95), 0 0 6px rgba(210,195,255,0.7); }
          70%  { opacity: 1; text-shadow: 0 0 10px rgba(220,208,255,0.6), 0 0 3px rgba(210,195,255,0.4); }
          100% { opacity: 1; text-shadow: 0 0 8px rgba(215,202,255,0.35), 0 0 2px rgba(205,190,255,0.2); }
        }
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes breatheReveal {
          from { color: rgba(190,178,238,0);    letter-spacing: 0.9em; }
          to   { color: rgba(190,178,238,0.32); letter-spacing: 0.5em; }
        }
        @keyframes breathePulse {
          0%   { color: rgba(190,178,238,0.32); letter-spacing: 0.5em;  }
          42%  { color: rgba(215,200,255,0.5);  letter-spacing: 0.58em; }
          62%  { color: rgba(190,178,238,0.2);  letter-spacing: 0.5em;  }
          100% { color: rgba(190,178,238,0.32); letter-spacing: 0.5em;  }
        }
        @keyframes heroColorFadeIn {
          from { color: rgba(155,147,200,0);    }
          to   { color: rgba(155,147,200,0.52); }
        }

        /* Headline characters — opacity-only reveal, no movement */
        .hero-char       { display: inline; opacity: 0; }
        .hero-char.lit   { animation: appear 1.4s ease forwards; }

        /* Tagline characters — illuminate on land, stay lit */
        .hero-tchar      { display: inline; opacity: 0; }
        .hero-tchar.lit  { animation: letterLand 0.35s cubic-bezier(0.12,0.8,0.4,1) forwards; }

        /* Sub-headline colour fade */
        .hero-subhead         { color: rgba(155,147,200,0); }
        .hero-subhead.visible { animation: heroColorFadeIn 2s ease forwards; }

        /* Tagline float */
        .hero-tagline-wrap.floating { animation: floatUpDown 4s ease-in-out infinite; }

        /* Ensure no underline / border appears on the tagline */
        .hero-tagline-wrap p,
        .hero-tagline-wrap p * {
          text-decoration: none !important;
          border-bottom: none !important;
        }

        /* Start free CTA */
        .hero-cta { opacity: 1; pointer-events: auto; }
        .hero-cta.visible {
          animation: none;
          pointer-events: auto;
        }
      `}</style>

      <div
        style={{
          position: "relative",
        }}
      >
        {/* ── Hero content ──────────────────────────────────────────────────── */}
        <div
          style={{
            position:      "relative",
            zIndex:        10,
            display:       "flex",
            flexDirection: "column",
            alignItems:    "center",
            textAlign:     "center",
            maxWidth:      "820px",
            margin:        "15vh auto 0",
            padding:       "0 24px 0",
          }}
        >
          {/* ── "Breathe" ──────────────────────────────────────────────────── */}
          <p
            style={{
              fontFamily:    "'Cormorant Garamond', serif",
              fontWeight:    300,
              fontStyle:     "italic",
              fontSize:      "clamp(12px, 1.5vw, 17px)",
              textTransform: "uppercase",
              letterSpacing: "0.9em",
              color:         "rgba(190,178,238,0)",
              margin:        "0 0 52px 0",
              animation:
                "breatheReveal 2s ease 0.3s both, breathePulse 5.5s ease-in-out 2.3s infinite",
            }}
          >
            Breathe
          </p>

          {/* ── Headline ───────────────────────────────────────────────────── */}
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize:   "clamp(38px, 5.8vw, 70px)",
              lineHeight: 1.18,
              margin:     0,
              padding:    0,
            }}
          >
            {/* Line 1 — normal weight */}
            <span style={{ display: "block" }}>
              {LINE1_CHARS.map((char, i) =>
                char === " " ? (
                  <span key={i}>{" "}</span>
                ) : (
                  <span
                    key={i}
                    ref={(el) => { headlineRefs.current[i] = el; }}
                    className="hero-char"
                    style={{ color: "rgba(238,232,255,0.9)" }}
                  >
                    {char}
                  </span>
                )
              )}
            </span>

            {/* Line 2 — italic */}
            <span style={{ display: "block" }}>
              {LINE2_CHARS.map((char, i) =>
                char === " " ? (
                  <span key={i}>{" "}</span>
                ) : (
                  <span
                    key={i}
                    ref={(el) => { headlineRefs.current[LINE1_CHARS.length + i] = el; }}
                    className="hero-char"
                    style={{
                      color:     "rgba(200,182,248,0.65)",
                      fontStyle: "italic",
                    }}
                  >
                    {char}
                  </span>
                )
              )}
            </span>
          </h1>

          {/* ── Sub-headline ───────────────────────────────────────────────── */}
          <p
            ref={subheadRef}
            className="hero-subhead"
            style={{
              fontFamily:    "'Jost', sans-serif",
              fontWeight:    300,
              fontSize:      "14px",
              letterSpacing: "0.025em",
              lineHeight:    1.72,
              maxWidth:      "460px",
              marginTop:     "26px",
            }}
          >
            {SUBHEAD}
          </p>

          {/* ── Start free CTA ─────────────────────────────────────────────── */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            ref={ctaRef}
            href="/sign-up"
            className="hero-cta"
            style={{
              fontFamily:     "'Jost', sans-serif",
              fontWeight:     400,
              fontSize:       "11px",
              letterSpacing:  "0.18em",
              textTransform:  "uppercase",
              color:          "rgba(185,175,230,0.42)",
              textDecoration: "none",
              border:         "0.5px solid rgba(192,184,232,0.18)",
              padding:        "11px 32px",
              borderRadius:   "2px",
              display:        "inline-block",
              marginTop:      "36px",
              transition:     "color 300ms ease, border-color 300ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(215,205,252,0.82)";
              e.currentTarget.style.borderColor = "rgba(192,184,232,0.38)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(185,175,230,0.42)";
              e.currentTarget.style.borderColor = "rgba(192,184,232,0.18)";
            }}
          >
            Start free
          </a>

          {/* ── Tagline ────────────────────────────────────────────────────── */}
          <div
            ref={taglineWrapRef}
            className="hero-tagline-wrap"
            style={{ marginTop: "120px" }}
          >
            <p
              style={{
                fontFamily:     "'Jost', sans-serif",
                fontWeight:     400,
                fontSize:       "11px",
                letterSpacing:  "0.22em",
                textTransform:  "uppercase",
                textDecoration: "none",
                borderBottom:   "none",
                margin:         0,
              }}
            >
              {TAGLINE_CHARS.map((char, i) =>
                char === " " ? (
                  <span key={i}>{" "}</span>
                ) : (
                  <span
                    key={i}
                    ref={(el) => { taglineRefs.current[i] = el; }}
                    className="hero-tchar"
                  >
                    {char}
                  </span>
                )
              )}
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
