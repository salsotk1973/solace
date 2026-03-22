"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { label: "Tools", href: "/tools" },
  { label: "Principles", href: "/principles" },
  { label: "Lab", href: "/lab" },
  { label: "About", href: "/about" },
];

export default function SiteHeader() {
  const [logoHovered, setLogoHovered] = useState(false);
  const [hoveredPill, setHoveredPill] = useState<string | null>(null);

  const HEADER_HEIGHT = 120;

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 80,
        pointerEvents: "none",
        height: `${HEADER_HEIGHT}px`,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          height: `${HEADER_HEIGHT}px`,
          background: `
            linear-gradient(
              180deg,
              rgba(18, 22, 36, 0.60) 0%,
              rgba(18, 22, 36, 0.52) 26%,
              rgba(18, 22, 36, 0.38) 52%,
              rgba(18, 22, 36, 0.18) 78%,
              rgba(18, 22, 36, 0.00) 100%
            ),
            linear-gradient(
              90deg,
              rgba(120,146,255,0.06) 0%,
              rgba(255,255,255,0.014) 50%,
              rgba(158,128,255,0.06) 100%
            )
          `,
          backdropFilter: "blur(20px) saturate(135%) brightness(0.78)",
          WebkitBackdropFilter: "blur(20px) saturate(135%) brightness(0.78)",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 78%, rgba(0,0,0,0.38) 92%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 78%, rgba(0,0,0,0.38) 92%, rgba(0,0,0,0) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1440px",
          margin: "0 auto",
          height: `${HEADER_HEIGHT}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          pointerEvents: "auto",
          transform: "translateY(-10px)",
        }}
      >
        <Link
          href="/"
          aria-label="Solace home"
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
          style={{
            display: "inline-flex",
            textDecoration: "none",
            color: logoHovered
              ? "rgba(172,194,255,1)"
              : "rgba(136,166,255,0.98)",
            fontSize: "56px",
            fontWeight: 500,
            letterSpacing: "-0.06em",
            lineHeight: 0.9,
            textShadow: logoHovered
              ? "0 0 30px rgba(132,166,255,0.36)"
              : "0 0 18px rgba(116,146,255,0.20)",
            transform: logoHovered ? "translateY(-1px)" : "translateY(0)",
            transition:
              "color 220ms ease, text-shadow 220ms ease, transform 220ms ease",
          }}
        >
          SOLACE
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {navItems.map((item) => {
            const isHovered = hoveredPill === item.label;

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-label={item.label}
                onMouseEnter={() => setHoveredPill(item.label)}
                onMouseLeave={() => setHoveredPill(null)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "50px",
                  padding: "0 19px",
                  borderRadius: "999px",
                  textDecoration: "none",
                  color: isHovered
                    ? "rgba(255,255,255,0.99)"
                    : "rgba(248,250,255,0.95)",
                  fontSize: "14px",
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  background: isHovered
                    ? `
                      linear-gradient(180deg,
                        rgba(255,255,255,0.24) 0%,
                        rgba(190,206,255,0.14) 42%,
                        rgba(82,98,154,0.22) 100%
                      )
                    `
                    : `
                      linear-gradient(180deg,
                        rgba(255,255,255,0.20) 0%,
                        rgba(176,196,255,0.10) 42%,
                        rgba(70,84,136,0.16) 100%
                      )
                    `,
                  border: isHovered
                    ? "1px solid rgba(222,232,255,0.28)"
                    : "1px solid rgba(205,218,255,0.18)",
                  boxShadow: isHovered
                    ? `
                      0 16px 34px rgba(0,0,0,0.24),
                      0 0 24px rgba(136,166,255,0.12),
                      inset 0 1px 0 rgba(255,255,255,0.30)
                    `
                    : `
                      0 12px 28px rgba(0,0,0,0.22),
                      0 0 18px rgba(116,146,255,0.06),
                      inset 0 1px 0 rgba(255,255,255,0.24)
                    `,
                  backdropFilter: "blur(12px) saturate(125%)",
                  WebkitBackdropFilter: "blur(12px) saturate(125%)",
                  transform: isHovered ? "translateY(-1px)" : "translateY(0)",
                  transition:
                    "transform 220ms ease, color 220ms ease, background 220ms ease, border 220ms ease, box-shadow 220ms ease",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}