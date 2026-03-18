"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Tools", href: "/tools" },
  { label: "Principles", href: "/principles" },
  { label: "Lab", href: "/lab" },
  { label: "About", href: "/about" },
];

const headerWrapStyle: CSSProperties = {
  width: "100%",
  position: "sticky",
  top: 0,
  zIndex: 40,
  paddingTop: 14,
};

const headerInnerStyle: CSSProperties = {
  maxWidth: 1240,
  margin: "0 auto",
  padding: "0 24px",
};

const headerBarStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 24,
};

const brandWrapStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 16,
  textDecoration: "none",
};

const brandTextStyle: CSSProperties = {
  margin: 0,
  fontSize: 57,
  lineHeight: 0.9,
  letterSpacing: "-0.055em",
  fontWeight: 700,
  color: "#4f5c84",
};

const navWrapStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
};

function getPillStyle(isActive: boolean): CSSProperties {
  if (isActive) {
    return {
      minHeight: 46,
      padding: "0 18px",
      borderRadius: 999,
      border: "1px solid rgba(212,166,255,0.78)",
      background: `
        linear-gradient(180deg, rgba(255,255,255,0.84) 0%, rgba(255,255,255,0.7) 100%),
        radial-gradient(circle at 28% 22%, rgba(214,168,255,0.16) 0%, rgba(214,168,255,0.02) 62%, transparent 78%)
      `,
      color: "#4f5c84",
      fontSize: 16,
      lineHeight: 1.2,
      fontWeight: 650,
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow:
        "0 8px 18px rgba(193,149,255,0.12), 0 0 0 1px rgba(212,166,255,0.16) inset",
      transition:
        "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease, background 180ms ease",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
    };
  }

  return {
    minHeight: 46,
    padding: "0 18px",
    borderRadius: 999,
    border: "1px solid rgba(212,166,255,0.38)",
    background: `
      linear-gradient(180deg, rgba(255,255,255,0.76) 0%, rgba(255,255,255,0.62) 100%),
      radial-gradient(circle at 28% 22%, rgba(214,168,255,0.08) 0%, rgba(214,168,255,0.015) 60%, transparent 78%)
    `,
    color: "#4f5c84",
    fontSize: 16,
    lineHeight: 1.2,
    fontWeight: 600,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow:
      "0 6px 14px rgba(193,149,255,0.05), 0 0 0 1px rgba(212,166,255,0.05) inset",
    transition:
      "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease, background 180ms ease",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  };
}

function getHoverPillStyle(isActive: boolean): CSSProperties {
  if (isActive) {
    return {
      border: "1px solid rgba(212,166,255,0.9)",
      background: `
        linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.74) 100%),
        radial-gradient(circle at 28% 22%, rgba(214,168,255,0.22) 0%, rgba(214,168,255,0.03) 62%, transparent 78%)
      `,
      boxShadow:
        "0 12px 22px rgba(193,149,255,0.16), 0 0 0 1px rgba(212,166,255,0.22) inset",
      transform: "translateY(-1px)",
    };
  }

  return {
    border: "1px solid rgba(212,166,255,0.74)",
    background: `
      linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.68) 100%),
      radial-gradient(circle at 28% 22%, rgba(214,168,255,0.18) 0%, rgba(214,168,255,0.025) 60%, transparent 78%)
    `,
    boxShadow:
      "0 10px 20px rgba(193,149,255,0.14), 0 0 0 1px rgba(212,166,255,0.16) inset",
    transform: "translateY(-1px)",
  };
}

function isItemActive(pathname: string, href: string): boolean {
  if (href === "/tools") {
    return pathname === "/tools" || pathname.startsWith("/tools/");
  }

  return pathname === href;
}

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header style={headerWrapStyle}>
      <div style={headerInnerStyle}>
        <div style={headerBarStyle}>
          <Link href="/" style={brandWrapStyle} aria-label="Solace home">
            <div className="solace-header-orb" aria-hidden="true" />
            <p style={brandTextStyle}>SOLACE</p>
          </Link>

          <nav style={navWrapStyle} aria-label="Primary">
            {navItems.map((item) => {
              const active = isItemActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? "solace-pill active" : "solace-pill"}
                  style={getPillStyle(active)}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <style jsx>{`
        .solace-header-orb {
          width: 42px;
          height: 42px;
          border-radius: 999px;
          background:
            radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95) 0%, rgba(243,219,255,0.92) 14%, rgba(214,168,255,0.88) 34%, rgba(190,145,255,0.54) 58%, rgba(190,145,255,0.08) 84%, transparent 100%);
          box-shadow:
            0 0 22px rgba(214,168,255,0.38),
            0 0 44px rgba(214,168,255,0.16),
            inset 0 0 20px rgba(255,255,255,0.22);
          position: relative;
          overflow: hidden;
        }

        .solace-header-orb::after {
          content: "";
          position: absolute;
          inset: 10% 12% auto auto;
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: rgba(255,255,255,0.82);
          filter: blur(0.2px);
          opacity: 0.9;
        }

        .solace-pill:hover {
          text-decoration: none;
        }

        .solace-pill:not(.active):hover {
          border-color: rgba(212,166,255,0.74) !important;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.68) 100%),
            radial-gradient(circle at 28% 22%, rgba(214,168,255,0.18) 0%, rgba(214,168,255,0.025) 60%, transparent 78%) !important;
          box-shadow:
            0 10px 20px rgba(193,149,255,0.14),
            0 0 0 1px rgba(212,166,255,0.16) inset !important;
          transform: translateY(-1px);
        }

        .solace-pill.active:hover {
          border-color: rgba(212,166,255,0.9) !important;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.74) 100%),
            radial-gradient(circle at 28% 22%, rgba(214,168,255,0.22) 0%, rgba(214,168,255,0.03) 62%, transparent 78%) !important;
          box-shadow:
            0 12px 22px rgba(193,149,255,0.16),
            0 0 0 1px rgba(212,166,255,0.22) inset !important;
          transform: translateY(-1px);
        }

        @media (max-width: 980px) {
          .solace-pill {
            min-height: 42px !important;
            padding: 0 16px !important;
          }
        }

        @media (max-width: 760px) {
          header {
            padding-top: 12px;
          }

          .solace-header-orb {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </header>
  );
}