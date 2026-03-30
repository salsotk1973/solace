'use client'

import Link from "next/link";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ToolCardProps {
  tag:       string;
  name:      string;
  line:      string;
  href:      string;
  colour:    string; // accent colour  e.g. "rgba(60,190,210,0.6)"
  tagColour: string; // tag text colour e.g. "rgba(80,200,218,0.5)"
}

// Derive glass colours from the accent by replacing the alpha channel
function glass(colour: string, alpha: number): string {
  return colour.replace(/,[\d.]+\)$/, `,${alpha})`)
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ToolCard({ tag, name, line, href, colour, tagColour }: ToolCardProps) {
  const [hovered, setHovered] = useState(false)

  const bg           = glass(colour, 0.10)
  const borderNormal = glass(colour, 0.22)
  const borderHover  = glass(colour, 0.38)

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:        "relative",
        display:         "flex",
        flexDirection:   "column",
        borderRadius:    "16px",
        padding:         "28px 28px 24px",
        background:      bg,
        border:          `1px solid ${hovered ? borderHover : borderNormal}`,
        backdropFilter:  "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transform:       hovered ? "scale(1.01)" : "scale(1)",
        transition:      "transform 0.4s cubic-bezier(0.22,1,0.36,1), border-color 0.4s ease",
        textDecoration:  "none",
        overflow:        "hidden",
        boxSizing:       "border-box",
      }}
    >
      {/* Top accent line — appears on hover */}
      <div
        aria-hidden="true"
        style={{
          position:   "absolute",
          top:        0,
          left:       "15%",
          right:      "15%",
          height:     "1px",
          background: `linear-gradient(90deg, transparent, ${glass(colour, 0.5)}, transparent)`,
          opacity:    hovered ? 0.8 : 0.25,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      />

      {/* Tag */}
      <p
        style={{
          fontFamily:    "var(--font-jost, 'Jost', sans-serif)",
          fontWeight:    400,
          fontSize:      "9px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color:         tagColour,
          margin:        "0 0 12px",
        }}
      >
        {tag}
      </p>

      {/* Name */}
      <p
        style={{
          fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
          fontWeight: 300,
          fontSize:   "24px",
          lineHeight: 1.2,
          color:      "rgba(200,215,225,0.85)",
          margin:     "0 0 8px",
        }}
      >
        {name}
      </p>

      {/* Line */}
      <p
        style={{
          fontFamily: "var(--font-jost, 'Jost', sans-serif)",
          fontWeight: 300,
          fontSize:   "13px",
          lineHeight: 1.6,
          color:      "rgba(200,210,220,0.72)",
          margin:     "0 0 24px",
          flex:       1,
        }}
      >
        {line}
      </p>

      {/* Begin → */}
      <span
        style={{
          fontFamily:    "var(--font-jost, 'Jost', sans-serif)",
          fontWeight:    400,
          fontSize:      "11px",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color:         hovered ? "rgba(200,210,220,0.9)" : "rgba(200,210,220,0.65)",
          transition:    "color 0.3s ease",
          alignSelf:     "flex-start",
        }}
      >
        Begin →
      </span>
    </Link>
  );
}
