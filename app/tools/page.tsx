"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { tools, type SolaceToolSlug } from "@/lib/solace-content/tools";

type CardSlug = SolaceToolSlug | null;

const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: 12,
  lineHeight: 1.4,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "rgba(79,92,132,0.6)",
};

const titleStyle: CSSProperties = {
  margin: "22px 0 0",
  fontSize: "clamp(44px,4.6vw,68px)",
  lineHeight: 0.94,
  letterSpacing: "-0.06em",
  fontWeight: 700,
  color: "#4f5c84",
  maxWidth: 760,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(30px,2.6vw,38px)",
  lineHeight: 1.06,
  letterSpacing: "-0.045em",
  fontWeight: 700,
  color: "#4f5c84",
  maxWidth: 640,
};

const sectionTextStyle: CSSProperties = {
  maxWidth: 580,
  margin: "22px 0 0",
  fontSize: 17,
  lineHeight: 1.9,
  color: "rgba(79,92,132,0.78)",
};

const feelingStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  lineHeight: 1.4,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "rgba(22,27,41,0.44)",
};

const cardTitleStyle: CSSProperties = {
  margin: "14px 0 0",
  fontSize: 26,
  lineHeight: 1.04,
  letterSpacing: "-0.04em",
  fontWeight: 700,
  color: "#161b29",
};

const cardDescriptionStyle: CSSProperties = {
  marginTop: 18,
  marginBottom: 0,
  fontSize: 15,
  lineHeight: 1.85,
  color: "rgba(22,27,41,0.8)",
};

const cardShortStyle: CSSProperties = {
  marginTop: 24,
  marginBottom: 0,
  fontSize: 13,
  lineHeight: 1.7,
  color: "rgba(22,27,41,0.46)",
};

function getCardRestStyle(slug: SolaceToolSlug): CSSProperties {
  if (slug === "choose") {
    return {
      border: "1px solid rgba(139,173,242,0.42)",
      background: "rgba(219,232,255,0.48)",
      boxShadow: "0 18px 40px rgba(168,154,228,0.07)",
      transform: "translateY(0)",
    };
  }

  if (slug === "clear-your-mind") {
    return {
      border: "1px solid rgba(152,190,160,0.4)",
      background: "rgba(221,232,224,0.62)",
      boxShadow: "0 18px 40px rgba(168,154,228,0.07)",
      transform: "translateY(0)",
    };
  }

  return {
    border: "1px solid rgba(223,169,123,0.42)",
    background: "rgba(249,234,223,0.68)",
    boxShadow: "0 18px 40px rgba(168,154,228,0.07)",
    transform: "translateY(0)",
  };
}

function getCardHoverStyle(slug: SolaceToolSlug): CSSProperties {
  if (slug === "choose") {
    return {
      border: "1px solid rgba(109,156,246,0.62)",
      background: "rgba(223,235,255,0.72)",
      boxShadow:
        "0 18px 40px rgba(168,154,228,0.08), 0 14px 34px rgba(139,173,242,0.14), 0 0 24px rgba(139,173,242,0.22)",
      transform: "translateY(-6px)",
    };
  }

  if (slug === "clear-your-mind") {
    return {
      border: "1px solid rgba(122,175,137,0.56)",
      background: "rgba(225,235,228,0.76)",
      boxShadow:
        "0 18px 40px rgba(168,154,228,0.08), 0 14px 34px rgba(152,190,160,0.12), 0 0 24px rgba(152,190,160,0.2)",
      transform: "translateY(-6px)",
    };
  }

  return {
    border: "1px solid rgba(230,150,84,0.64)",
    background: "rgba(252,237,227,0.82)",
    boxShadow:
      "0 18px 40px rgba(168,154,228,0.08), 0 14px 34px rgba(230,150,84,0.14), 0 0 24px rgba(230,150,84,0.22)",
    transform: "translateY(-6px)",
  };
}

function getCardStyle(slug: SolaceToolSlug, hovered: boolean): CSSProperties {
  return {
    minHeight: 244,
    borderRadius: 34,
    padding: "28px 28px 26px",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    transition:
      "transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease, background 240ms ease",
    ...(hovered ? getCardHoverStyle(slug) : getCardRestStyle(slug)),
  };
}

export default function ToolsPage() {
  const [hoveredCard, setHoveredCard] = useState<CardSlug>(null);

  const orderedTools = useMemo(
    () => [...tools].sort((a, b) => a.order - b.order),
    []
  );

  return (
    <main
      style={{
        width: "100%",
        paddingTop: 120,
        paddingBottom: 120,
      }}
    >
      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div style={{ maxWidth: 820 }}>
          <p style={eyebrowStyle}>Tools</p>

          <h1 style={titleStyle}>
            Find the right
            <br />
            place to begin
          </h1>
        </div>
      </section>

      <section
        style={{
          position: "relative",
          maxWidth: 1240,
          margin: "100px auto 0",
          padding: "0 24px",
        }}
      >
        <div className="breathing-band" />

        <div style={{ maxWidth: 700, position: "relative", zIndex: 1 }}>
          <h2 style={sectionTitleStyle}>Three ways Solace can help</h2>

          <p style={sectionTextStyle}>
            Most people arrive here feeling one of these things. Choose the one
            that sounds most like your current state.
          </p>
        </div>

        <div
          className="tools-card-grid"
          style={{ marginTop: 46, position: "relative", zIndex: 1 }}
        >
          {orderedTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
              }}
              onMouseEnter={() => setHoveredCard(tool.slug)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <article style={getCardStyle(tool.slug, hoveredCard === tool.slug)}>
                <p style={feelingStyle}>{tool.feeling}</p>
                <h3 style={cardTitleStyle}>{tool.name}</h3>
                <p style={cardDescriptionStyle}>{tool.description}</p>
                <p style={cardShortStyle}>{tool.shortDescription}</p>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <section
        style={{
          maxWidth: 1240,
          margin: "120px auto 0",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            borderRadius: 36,
            border: "1px solid rgba(255,255,255,0.44)",
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            boxShadow: "0 18px 40px rgba(168,154,228,0.06)",
            padding: "34px 32px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(79,92,132,0.5)",
            }}
          >
            A calmer way to begin
          </p>

          <h3
            style={{
              margin: "16px 0 0",
              fontSize: "clamp(24px,2.2vw,32px)",
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              color: "#4f5c84",
              fontWeight: 600,
            }}
          >
            You do not need to solve everything at once.
          </h3>

          <p
            style={{
              maxWidth: 720,
              margin: "18px 0 0",
              fontSize: 16,
              lineHeight: 1.9,
              color: "rgba(79,92,132,0.76)",
            }}
          >
            Start with the part that feels most true right now. Solace will help
            you narrow the noise, organise the question, and make the next step
            feel lighter.
          </p>
        </div>
      </section>

      <style jsx>{`
        .tools-card-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .breathing-band {
          position: absolute;
          left: 50%;
          top: 284px;
          width: min(1500px, calc(100% + 260px));
          height: 210px;
          transform: translateX(-50%);
          pointer-events: none;
          border-radius: 999px;
          background: radial-gradient(
            ellipse at center,
            rgba(184, 148, 255, 0.26) 0%,
            rgba(184, 148, 255, 0.19) 22%,
            rgba(184, 148, 255, 0.11) 42%,
            rgba(184, 148, 255, 0.05) 62%,
            rgba(184, 148, 255, 0.018) 76%,
            transparent 89%
          );
          filter: blur(44px);
          opacity: 0.9;
          animation: toolsBandBreath 7.5s ease-in-out infinite;
        }

        @keyframes toolsBandBreath {
          0% {
            transform: translateX(-50%) scaleX(0.985) scaleY(0.94);
            opacity: 0.7;
          }

          50% {
            transform: translateX(-50%) scaleX(1.035) scaleY(1);
            opacity: 0.94;
          }

          100% {
            transform: translateX(-50%) scaleX(0.985) scaleY(0.94);
            opacity: 0.7;
          }
        }

        @media (max-width: 980px) {
          .tools-card-grid {
            grid-template-columns: 1fr;
          }

          .breathing-band {
            top: 330px;
            width: min(860px, calc(100% + 80px));
            height: 700px;
            filter: blur(68px);
          }
        }

        @media (max-width: 720px) {
          main {
            padding-top: 80px !important;
            padding-bottom: 80px !important;
          }

          .breathing-band {
            top: 350px;
            width: min(580px, calc(100% + 36px));
            height: 840px;
            filter: blur(58px);
          }
        }
      `}</style>
    </main>
  );
}