"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import HeroPresence from "@/components/hero/HeroPresence";
import Link from "next/link";
import { tools, type SolaceToolSlug } from "@/lib/solace-content/tools";

type CardSlug = SolaceToolSlug | null;

const cardTitleStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 26,
  lineHeight: 1.02,
  letterSpacing: "-0.04em",
  fontWeight: 700,
  color: "#161b29",
};

const feelingStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  lineHeight: 1.4,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "rgba(22,27,41,0.5)",
};

const cardDescriptionStyle: CSSProperties = {
  marginTop: 14,
  marginBottom: 0,
  fontSize: 15,
  lineHeight: 1.75,
  color: "rgba(22,27,41,0.82)",
};

function getCardRestStyle(slug: SolaceToolSlug): CSSProperties {
  if (slug === "choose") {
    return {
      border: "1px solid rgba(139,173,242,0.45)",
      background: "rgba(219,232,255,0.55)",
      boxShadow: "0 18px 40px rgba(168,154,228,0.08)",
      transform: "translateY(0)",
    };
  }

  if (slug === "slow-down") {
    return {
      border: "1px solid rgba(152,190,160,0.42)",
      background: "rgba(221,232,224,0.72)",
      boxShadow: "0 18px 40px rgba(168,154,228,0.08)",
      transform: "translateY(0)",
    };
  }

  return {
    border: "1px solid rgba(223,169,123,0.46)",
    background: "rgba(249,234,223,0.78)",
    boxShadow: "0 18px 40px rgba(168,154,228,0.08)",
    transform: "translateY(0)",
  };
}

function getCardHoverStyle(slug: SolaceToolSlug): CSSProperties {
  if (slug === "choose") {
    return {
      border: "1px solid rgba(109,156,246,0.68)",
      background: "rgba(223,235,255,0.78)",
      boxShadow:
        "0 18px 40px rgba(168,154,228,0.08), 0 14px 34px rgba(139,173,242,0.16), 0 0 26px rgba(139,173,242,0.28)",
      transform: "translateY(-6px)",
    };
  }

  if (slug === "slow-down") {
    return {
      border: "1px solid rgba(122,175,137,0.62)",
      background: "rgba(225,235,228,0.84)",
      boxShadow:
        "0 18px 40px rgba(168,154,228,0.08), 0 14px 34px rgba(152,190,160,0.14), 0 0 26px rgba(152,190,160,0.24)",
      transform: "translateY(-6px)",
    };
  }

  return {
    border: "1px solid rgba(230,150,84,0.72)",
    background: "rgba(252,237,227,0.9)",
    boxShadow:
      "0 18px 40px rgba(168,154,228,0.08), 0 14px 34px rgba(230,150,84,0.16), 0 0 26px rgba(230,150,84,0.28)",
    transform: "translateY(-6px)",
  };
}

function getCardStyle(slug: SolaceToolSlug, hovered: boolean): CSSProperties {
  return {
    minHeight: 212,
    borderRadius: 30,
    padding: "24px 26px 24px",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    transition:
      "transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease, background 240ms ease",
    ...(hovered ? getCardHoverStyle(slug) : getCardRestStyle(slug)),
  };
}

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<CardSlug>(null);

  const orderedTools = useMemo(
    () => [...tools].sort((a, b) => a.order - b.order),
    []
  );

  return (
    <main
      style={{
        width: "100%",
        paddingTop: 28,
        paddingBottom: 72,
        position: "relative",
      }}
    >
      <section
        style={{
          minHeight: 720,
          display: "grid",
          gridTemplateColumns: "repeat(12,minmax(0,1fr))",
          columnGap: 24,
          alignItems: "center",
        }}
      >
        <div
          style={{
            gridColumn: "1 / span 4",
            maxWidth: 360,
            paddingTop: 178,
          }}
        >
          <h1
            className="solace-hero-headline"
            style={{
              margin: 0,
              fontSize: "clamp(72px,7vw,96px)",
              lineHeight: 0.86,
              letterSpacing: "-0.06em",
              fontWeight: 700,
            }}
          >
            Clear
            <br />
            your
            <br />
            mind
          </h1>
        </div>

        <div
          style={{
            gridColumn: "6 / -1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 720,
          }}
        >
          <HeroPresence />
        </div>
      </section>

      <section
        style={{
          marginTop: 28,
          display: "grid",
          gridTemplateColumns: "repeat(12,minmax(0,1fr))",
          columnGap: 24,
        }}
      >
        <div style={{ gridColumn: "1 / -1" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(44px,4.2vw,62px)",
              lineHeight: 0.98,
              letterSpacing: "-0.045em",
              fontWeight: 700,
              color: "#4f5c84",
            }}
          >
            Start from how it feels
          </h2>

          <p
            style={{
              marginTop: 14,
              marginBottom: 0,
              fontSize: 16,
              lineHeight: 1.6,
              color: "rgba(79,92,132,0.82)",
            }}
          >
            Begin with the state that feels closest.
          </p>
        </div>

        <div
          style={{
            gridColumn: "1 / -1",
            marginTop: 32,
            display: "grid",
            gridTemplateColumns: "repeat(3,minmax(0,1fr))",
            gap: 18,
          }}
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
              </article>
            </Link>
          ))}
        </div>
      </section>

      <style jsx>{`
        .solace-hero-headline {
          color: #4f5c84;
          animation: solaceHeadlineBreathSync 10s linear infinite;
          transform-origin: left center;
        }

        @keyframes solaceHeadlineBreathSync {
          0% {
            opacity: 0.82;
            transform: scale(0.955);
          }
          50% {
            opacity: 1;
            transform: scale(1.08);
          }
          100% {
            opacity: 0.82;
            transform: scale(0.955);
          }
        }
      `}</style>
    </main>
  );
}