'use client'

import Link from "next/link";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ToolCardProps {
  tag:        string;   // feeling label ("When my mind won't stop") or category ("Breathing")
  name:       string;   // card title
  line:       string;   // description
  href:       string;   // destination route
  colour:     string;   // accent colour, e.g. "rgba(68,200,110,1)"
  tagColour?: string;   // tag text colour — derived from colour if omitted
  bg?:        string;   // custom background (gradient string) — falls back to tinted glass
  minHeight?: string;   // optional min-height override
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function glass(colour: string, alpha: number): string {
  return colour.replace(/,[\d.]+\)$/, `,${alpha})`)
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ToolCard({
  tag,
  name,
  line,
  href,
  colour,
  tagColour,
  bg,
  minHeight,
}: ToolCardProps) {
  const [hovered, setHovered] = useState(false)

  const accent       = glass(colour, 1)
  const tagCol       = tagColour ?? glass(colour, 0.48)
  const background   = bg ?? glass(colour, 0.10)
  const borderNormal = glass(colour, 0.18)
  const borderHover  = glass(colour, 0.32)
  const shadow       = `0 12px 60px ${glass(colour, 0.18)}`

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .tool-card-link {
            padding: 18px 18px 18px !important;
            min-height: auto !important;
          }
          .tool-card-hover-row {
            display: none !important;
          }
        }
      `}</style>
    <Link
      href={href}
      prefetch={false}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="tool-card-link"
      style={{
        position:             "relative",
        display:              "flex",
        flexDirection:        "column",
        borderRadius:         "18px",
        padding:              "36px 32px 32px",
        minHeight:            minHeight ?? "auto",
        background:           background,
        borderTopWidth:       "0.5px",
        borderRightWidth:     "0.5px",
        borderBottomWidth:    "0.5px",
        borderTopStyle:       "solid",
        borderRightStyle:     "solid",
        borderBottomStyle:    "solid",
        borderTopColor:       hovered ? borderHover : borderNormal,
        borderRightColor:     hovered ? borderHover : borderNormal,
        borderBottomColor:    hovered ? borderHover : borderNormal,
        borderLeftWidth:      "2px",
        borderLeftStyle:      "solid",
        borderLeftColor:      glass(colour, 0.5),
        backdropFilter:       "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow:            hovered ? shadow : "none",
        transform:            hovered ? "translateY(-5px)" : "translateY(0)",
        transition: [
          "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
          "box-shadow 0.55s cubic-bezier(0.22,1,0.36,1)",
          "border-color 0.55s cubic-bezier(0.22,1,0.36,1)",
        ].join(", "),
        textDecoration: "none",
        overflow:       "hidden",
        boxSizing:      "border-box",
        cursor:         "pointer",
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
          background:    `linear-gradient(90deg, transparent, ${glass(colour, 0.8)}, transparent)`,
          opacity:       hovered ? 0.7 : 0.3,
          transition:    "opacity 0.55s ease",
          pointerEvents: "none",
        }}
      />

      {/* Tag / feeling label */}
      <p
        style={{
          fontFamily:    "var(--font-jost, 'Jost', sans-serif)",
          fontWeight:    400,
          fontSize:      "11px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color:         tagCol,
          margin:        "0 0 14px",
          opacity:       hovered ? 1.0 : 0.85,
          transition:    "opacity 0.4s ease",
        }}
      >
        {tag}
      </p>

      {/* Name */}
      <h3
        style={{
          fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
          fontWeight: 300,
          fontSize:   "clamp(22px, 2.4vw, 28px)",
          lineHeight: 1.2,
          color:      hovered ? "rgba(245,240,255,1)" : "rgba(235,228,255,0.9)",
          margin:     "0 0 14px",
          transition: "color 0.4s ease",
        }}
      >
        {name}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-jost, 'Jost', sans-serif)",
          fontWeight: 300,
          fontSize:   "14px",
          lineHeight: 1.72,
          color:      hovered ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.80)",
          margin:     0,
          flex:       1,
          transition: "color 0.4s ease",
        }}
      >
        {line}
      </p>

      {/* Bottom row — "Begin ›" appears only on hover */}
      <div
        className="tool-card-hover-row"
        style={{
          marginTop:  "28px",
          paddingTop: "16px",
          borderTop:  `0.5px solid ${hovered ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"}`,
          display:    "flex",
          alignItems: "center",
          gap:        "8px",
          transition: "border-color 0.4s ease",
        }}
      >
        <span
          style={{
            fontFamily:    "var(--font-jost, 'Jost', sans-serif)",
            fontWeight:    400,
            fontSize:      "11px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color:         accent,
            opacity:       hovered ? 0.62 : 0,
            transform:     hovered ? "translateX(0)" : "translateX(-6px)",
            transition:    "opacity 0.45s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          Begin
        </span>
        <span
          style={{
            fontSize:   "16px",
            color:      accent,
            opacity:    hovered ? 0.75 : 0,
            transform:  hovered ? "translateX(2px)" : "translateX(-8px)",
            transition: "opacity 0.45s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)",
            lineHeight: 1,
            display:    "inline-block",
          }}
        >
          ›
        </span>
      </div>
    </Link>
    </>
  )
}
