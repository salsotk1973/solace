"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Tools",      href: "/tools"      },
  { label: "Principles", href: "/principles" },
  { label: "Lab",        href: "/lab"        },
  { label: "About",      href: "/about"      },
];

function DesktopAuthLinks() {
  return (
    <>
      <Link
        href="/sign-in"
        style={{
          fontFamily:     "'DM Sans', sans-serif",
          fontWeight:     400,
          fontSize:       "13px",
          letterSpacing:  "0.04em",
          color:          "rgba(215,210,240,0.65)",
          textDecoration: "none",
          transition:     "color 220ms ease",
        }}
        onMouseEnter={e => { e.currentTarget.style.color = "rgba(240,236,255,1)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "rgba(215,210,240,0.65)"; }}
      >
        Sign in
      </Link>
      <Link
        href="/sign-up"
        style={{
          fontFamily:     "'DM Sans', sans-serif",
          fontWeight:     400,
          fontSize:       "13px",
          letterSpacing:  "0.04em",
          color:          "rgba(215,210,240,0.9)",
          textDecoration: "none",
          padding:        "7px 18px",
          borderRadius:   "4px",
          border:         "0.5px solid rgba(200,195,235,0.22)",
          background:     "transparent",
          transition:     "color 220ms ease, border-color 220ms ease, background 220ms ease",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = "rgba(240,236,255,1)";
          e.currentTarget.style.borderColor = "rgba(220,215,250,0.38)";
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = "rgba(215,210,240,0.9)";
          e.currentTarget.style.borderColor = "rgba(200,195,235,0.22)";
          e.currentTarget.style.background = "transparent";
        }}
      >
        Start free
      </Link>
    </>
  );
}

function MobileAuthLinks({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      <Link
        href="/sign-in"
        onClick={onNavigate}
        style={{
          fontFamily:     "'DM Sans', sans-serif",
          fontWeight:     400,
          fontSize:       "14px",
          color:          "rgba(215,210,240,0.60)",
          textDecoration: "none",
          transition:     "color 220ms ease",
        }}
        onMouseEnter={e => { e.currentTarget.style.color = "rgba(240,236,255,1)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "rgba(215,210,240,0.60)"; }}
      >
        Sign in
      </Link>
      <Link
        href="/sign-up"
        onClick={onNavigate}
        style={{
          fontFamily:     "'DM Sans', sans-serif",
          fontWeight:     400,
          fontSize:       "14px",
          color:          "rgba(215,210,240,0.9)",
          textDecoration: "none",
          padding:        "8px 20px",
          borderRadius:   "4px",
          border:         "0.5px solid rgba(200,195,235,0.22)",
          background:     "transparent",
        }}
      >
        Start free
      </Link>
    </>
  );
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .site-header-bar { padding: 0 20px !important; }
        }
      `}</style>

      <header
        style={{
          position:      "fixed",
          top:           0,
          left:          0,
          right:         0,
          zIndex:        80,
          pointerEvents: "none",
        }}
      >
        {/* Atmospheric fade — covers header bar only */}
        <div
          aria-hidden="true"
          style={{
            position:             "absolute",
            top:                  0,
            left:                 "max(24px, calc(50% - 696px))",
            right:                "max(24px, calc(50% - 696px))",
            height:               "80px",
            background:           "linear-gradient(180deg, rgba(9,13,20,0.85) 0%, rgba(9,13,20,0.60) 50%, rgba(9,13,20,0.0) 100%)",
            backdropFilter:       "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            pointerEvents:        "none",
          }}
        />

        {/* Content row */}
        <div
          className="site-header-bar"
          style={{
            position:       "relative",
            zIndex:         2,
            maxWidth:       "1440px",
            margin:         "0 auto",
            height:         "80px",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            padding:        "0 40px",
            pointerEvents:  "auto",
          }}
        >
          {/* Wordmark */}
          <Link
            href="/"
            aria-label="Solace home"
            style={{
              display:        "inline-flex",
              textDecoration: "none",
              fontFamily:     "'Cormorant Garamond', serif",
              fontWeight:     300,
              fontSize:       "28px",
              letterSpacing:  "0.18em",
              color:          "rgba(220,215,245,0.92)",
              textTransform:  "uppercase",
              transition:     "color 280ms ease, opacity 280ms ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "rgba(240,236,255,1)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(220,215,245,0.92)"; }}
          >
            Solace
          </Link>

          {/* Desktop nav + auth */}
          <nav
            className="hidden md:flex"
            style={{ alignItems: "center", gap: "32px" }}
          >
            {navItems.map(item => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  fontFamily:     "'DM Sans', sans-serif",
                  fontWeight:     400,
                  fontSize:       "13px",
                  letterSpacing:  "0.04em",
                  color:          "rgba(215,210,240,0.72)",
                  textDecoration: "none",
                  transition:     "color 220ms ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "rgba(240,236,255,1)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(215,210,240,0.72)"; }}
              >
                {item.label}
              </Link>
            ))}

            <div style={{ width: "0.5px", height: "16px", background: "rgba(255,255,255,0.12)" }} />

            <DesktopAuthLinks />
          </nav>

          {/* Hamburger — mobile only, absolutely positioned, same element in both states */}
          <button
            className="flex items-center justify-center md:hidden"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            style={{
              position:  "absolute",
              right:     "16px",
              top:       "50%",
              transform: "translateY(-50%)",
              background:"none",
              border:    "none",
              cursor:    "pointer",
              padding:   "8px",
              width:     "48px",
              height:    "48px",
              zIndex:    3,
              fontSize:  "30px",
              lineHeight:1,
              color:     "rgba(220,215,245,0.85)",
              transition:"color 200ms ease",
              pointerEvents: "auto",
            }}
          >
            {menuOpen ? "×" : "≡"}
          </button>
        </div>

        {/* Mobile dropdown */}
        <div
          className="md:hidden"
          style={{
            position:             "relative",
            zIndex:               2,
            overflow:             "hidden",
            maxHeight:            menuOpen ? "480px" : "0",
            transition:           "max-height 0.42s cubic-bezier(0.22,1,0.36,1)",
            pointerEvents:        menuOpen ? "auto" : "none",
            background:           "rgba(9,13,20,0.96)",
            backdropFilter:       "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <nav style={{
            display:        "flex",
            flexDirection:  "column",
            padding:        "8px 24px 28px",
            borderTop:      "0.5px solid rgba(255,255,255,0.06)",
          }}>
            {navItems.map(item => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily:     "'DM Sans', sans-serif",
                  fontWeight:     400,
                  fontSize:       "16px",
                  letterSpacing:  "0.02em",
                  color:          "rgba(215,210,240,0.82)",
                  textDecoration: "none",
                  padding:        "14px 0",
                  borderBottom:   "0.5px solid rgba(255,255,255,0.05)",
                  transition:     "color 200ms ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "rgba(240,236,255,1)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(215,210,240,0.82)"; }}
              >
                {item.label}
              </Link>
            ))}

            <div style={{ height: "0.5px", background: "rgba(255,255,255,0.08)", margin: "16px 0" }} />

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <MobileAuthLinks onNavigate={() => setMenuOpen(false)} />
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
