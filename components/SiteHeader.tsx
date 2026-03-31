"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";

const navItems = [
  { label: "Tools",      href: "/tools"      },
  { label: "Principles", href: "/principles" },
  { label: "Lab",        href: "/lab"        },
  { label: "About",      href: "/about"      },
];

export default function SiteHeader() {
  const { isSignedIn } = useAuth();

  return (
    <header
      style={{
        position:      "fixed",
        top:           0,
        left:          0,
        right:         0,
        zIndex:        80,
        pointerEvents: "none",
        height:        "80px",
      }}
    >
      {/* Atmospheric fade behind the header */}
      <div
        aria-hidden="true"
        style={{
          position:              "absolute",
          top:                   0,
          bottom:                0,
          left:                  "max(24px, calc(50% - 696px))",
          right:                 "max(24px, calc(50% - 696px))",
          background:            "linear-gradient(180deg, rgba(9,13,20,0.85) 0%, rgba(9,13,20,0.60) 50%, rgba(9,13,20,0.0) 100%)",
          backdropFilter:        "blur(12px)",
          WebkitBackdropFilter:  "blur(12px)",
          pointerEvents:         "none",
        }}
      />

      {/* Content row */}
      <div
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
          onMouseEnter={e => { e.currentTarget.style.color = "rgba(240,236,255,1)" }}
          onMouseLeave={e => { e.currentTarget.style.color = "rgba(220,215,245,0.92)" }}
        >
          Solace
        </Link>

        {/* Nav + auth */}
        <nav
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        "32px",
          }}
        >
          {/* Nav links — plain text, no pills */}
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
              onMouseEnter={e => { e.currentTarget.style.color = "rgba(240,236,255,1)" }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(215,210,240,0.72)" }}
            >
              {item.label}
            </Link>
          ))}

          {/* Thin separator */}
          <div style={{ width: "0.5px", height: "16px", background: "rgba(255,255,255,0.12)" }} />

          {/* Auth */}
          {isSignedIn ? (
            <UserButton
              appearance={{
                elements: { avatarBox: { width: 30, height: 30 } },
              }}
            />
          ) : (
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
                onMouseEnter={e => { e.currentTarget.style.color = "rgba(240,236,255,1)" }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(215,210,240,0.65)" }}
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
                  e.currentTarget.style.color = "rgba(240,236,255,1)"
                  e.currentTarget.style.borderColor = "rgba(220,215,250,0.38)"
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "rgba(215,210,240,0.9)"
                  e.currentTarget.style.borderColor = "rgba(200,195,235,0.22)"
                  e.currentTarget.style.background = "transparent"
                }}
              >
                Start free
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
