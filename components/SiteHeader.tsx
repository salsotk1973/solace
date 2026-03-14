"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useState } from "react";

type NavKey = "tools" | "principles" | "lab" | "about" | null;

const basePillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px 18px",
  borderRadius: 999,
  textDecoration: "none",
  fontSize: 16,
  fontWeight: 500,
  lineHeight: 1,
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  transition:
    "transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease, background 220ms ease, color 220ms ease",
  transform: "translateY(0)",
};

function getPillStyle(
  key: Exclude<NavKey, null>,
  hovered: boolean
): CSSProperties {
  const rest: Record<Exclude<NavKey, null>, CSSProperties> = {
    tools: {
      border: "1px solid rgba(112,123,157,0.22)",
      color: "#566482",
      background: "rgba(255,255,255,0.22)",
      boxShadow: "0 6px 20px rgba(169,153,228,0.04)",
    },
    principles: {
      border: "1px solid rgba(112,123,157,0.22)",
      color: "#566482",
      background: "rgba(255,255,255,0.22)",
      boxShadow: "0 6px 20px rgba(169,153,228,0.04)",
    },
    lab: {
      border: "1px solid rgba(112,123,157,0.22)",
      color: "#566482",
      background: "rgba(255,255,255,0.22)",
      boxShadow: "0 6px 20px rgba(169,153,228,0.04)",
    },
    about: {
      border: "1px solid rgba(112,123,157,0.22)",
      color: "#566482",
      background: "rgba(255,255,255,0.22)",
      boxShadow: "0 6px 20px rgba(169,153,228,0.04)",
    },
  };

  const hover: Record<Exclude<NavKey, null>, CSSProperties> = {
    tools: {
      border: "1px solid rgba(171,163,229,0.65)",
      color: "#5b6386",
      background: "rgba(255,255,255,0.48)",
      boxShadow:
        "0 6px 10px rgba(0,0,0,0.05), 0 14px 28px rgba(140,130,220,0.18), 0 0 28px rgba(171,163,229,0.32)",
      transform: "translateY(-3px)",
    },
    principles: {
      border: "1px solid rgba(171,163,229,0.65)",
      color: "#5b6386",
      background: "rgba(255,255,255,0.48)",
      boxShadow:
        "0 6px 10px rgba(0,0,0,0.05), 0 14px 28px rgba(140,130,220,0.18), 0 0 28px rgba(171,163,229,0.32)",
      transform: "translateY(-3px)",
    },
    lab: {
      border: "1px solid rgba(171,163,229,0.65)",
      color: "#5b6386",
      background: "rgba(255,255,255,0.48)",
      boxShadow:
        "0 6px 10px rgba(0,0,0,0.05), 0 14px 28px rgba(140,130,220,0.18), 0 0 28px rgba(171,163,229,0.32)",
      transform: "translateY(-3px)",
    },
    about: {
      border: "1px solid rgba(171,163,229,0.65)",
      color: "#5b6386",
      background: "rgba(255,255,255,0.48)",
      boxShadow:
        "0 6px 10px rgba(0,0,0,0.05), 0 14px 28px rgba(140,130,220,0.18), 0 0 28px rgba(171,163,229,0.32)",
      transform: "translateY(-3px)",
    },
  };

  return {
    ...basePillStyle,
    ...(hovered ? hover[key] : rest[key]),
  };
}

export default function SiteHeader() {
  const [hovered, setHovered] = useState<NavKey>(null);

  return (
    <header
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px 24px 0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 430,
            height: 130,
            pointerEvents: "auto",
          }}
        >
          <Link
            href="/"
            style={{
              position: "absolute",
              top: -38,
              left: -38,
              width: 130,
              height: 130,
              display: "block",
            }}
          >
            <Image
              src="/hero/solace-orb.png"
              alt="Solace orb"
              width={130}
              height={130}
              priority
              style={{
                display: "block",
                width: "130px",
                height: "130px",
                objectFit: "contain",
              }}
            />
          </Link>

          <Link
            href="/"
            style={{
              position: "absolute",
              top: 0,
              left: 65,
              textDecoration: "none",
              display: "block",
            }}
          >
            <div
              style={{
                fontFamily:
                  'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: 40,
                lineHeight: 0.9,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#5A6685",
                whiteSpace: "nowrap",
              }}
            >
              SOLACE
            </div>
          </Link>
        </div>

        <nav
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            flexShrink: 0,
            pointerEvents: "auto",
          }}
        >
          <Link
            href="/tools"
            style={getPillStyle("tools", hovered === "tools")}
            onMouseEnter={() => setHovered("tools")}
            onMouseLeave={() => setHovered(null)}
          >
            Tools
          </Link>

          <Link
            href="/principles"
            style={getPillStyle("principles", hovered === "principles")}
            onMouseEnter={() => setHovered("principles")}
            onMouseLeave={() => setHovered(null)}
          >
            Principles
          </Link>

          <Link
            href="/lab"
            style={getPillStyle("lab", hovered === "lab")}
            onMouseEnter={() => setHovered("lab")}
            onMouseLeave={() => setHovered(null)}
          >
            Lab
          </Link>

          <Link
            href="/about"
            style={getPillStyle("about", hovered === "about")}
            onMouseEnter={() => setHovered("about")}
            onMouseLeave={() => setHovered(null)}
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}