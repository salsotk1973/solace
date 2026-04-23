import Link from "next/link";
import type { CSSProperties } from "react";
import FooterAuthLink from "@/components/FooterAuthLink";

const FOOTER_NAV = [
  {
    heading: "Product",
    links: [
      { label: "Tools", href: "/tools" },
      { label: "Pricing", href: "/pricing" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "Lab", href: "/lab" },
      { label: "Principles", href: "/principles" },
      { label: "About", href: "/about" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Sign in", href: "/sign-in" },
    ],
  },
];

const navLinkStyle: CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontWeight: 300,
  fontSize: "13px",
  color: "rgba(255,255,255,0.60)",
  textDecoration: "none",
  transition: "color 200ms ease",
};

export default function SiteFooter() {
  return (
    <>
      <style>{`
        .footer-grid {
          display: flex;
          justify-content: space-between;
          gap: 40px;
        }
        .footer-bottom-bar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }
        .footer-bottom-disclaimer {
          flex: 2;
          text-align: center;
          min-width: 0;
        }
        .footer-bottom-left {
          flex: 1;
          min-width: 0;
        }
        .footer-bottom-right {
          flex: 1;
          text-align: right;
          min-width: 0;
        }
        .footer-nav-link:hover {
          color: rgba(255,255,255,0.90) !important;
        }
        @media (max-width: 900px) {
          .footer-bottom-bar { align-items: flex-start; flex-wrap: wrap; }
          .footer-bottom-disclaimer { flex: 100%; text-align: left; order: -1; }
          .footer-bottom-left { flex: 1; }
          .footer-bottom-right { flex: 1; }
        }
        @media (max-width: 640px) {
          .footer-mobile-structured {
            display: block !important;
          }
          .footer-grid {
            display: none;
          }
          .footer-mobile-padding {
            padding: 32px 16px 24px !important;
          }
          .footer-bottom-bar {
            display: none !important;
          }
          .footer-mobile-bottom {
            display: block !important;
          }
          .footer-mobile-divider {
            display: block !important;
          }
          .footer-desktop-divider {
            display: none !important;
          }
          .footer-desktop-wordmark {
            display: none !important;
          }
        }
      `}</style>

      <footer
        style={{
          width: "100%",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            margin: "0 auto",
            maxWidth: "1440px",
            padding: "8px 24px 28px",
          }}
        >
          <div
            className="footer-mobile-padding"
            style={{
              padding: "48px 16px 32px",
              boxSizing: "border-box",
            }}
          >
            {/* Mobile-only structured footer (<=640px). Replaces the 3-column grid below. */}
            <div className="footer-mobile-structured" style={{ display: "none" }}>
              <nav
                aria-label="Footer navigation"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px 18px",
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 300,
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.60)",
                  marginBottom: "16px",
                }}
              >
                <Link href="/tools" className="footer-nav-link" style={navLinkStyle}>Tools</Link>
                <Link href="/pricing" className="footer-nav-link" style={navLinkStyle}>Pricing</Link>
                <Link href="/lab" className="footer-nav-link" style={navLinkStyle}>Lab</Link>
                <Link href="/principles" className="footer-nav-link" style={navLinkStyle}>Principles</Link>
                <Link href="/about" className="footer-nav-link" style={navLinkStyle}>About</Link>
              </nav>
              <nav
                aria-label="Legal navigation"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "24px",
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 300,
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.60)",
                }}
              >
                <Link href="/privacy" className="footer-nav-link" style={navLinkStyle}>Privacy</Link>
                <Link href="/terms" className="footer-nav-link" style={navLinkStyle}>Terms</Link>
              </nav>
            </div>

            {/* Mobile-only hairline divider — soft, centered, ceremonial */}
            <div
              className="footer-mobile-divider"
              aria-hidden="true"
              style={{
                display: "none",
                width: "32px",
                height: "0.5px",
                background: "rgba(255,255,255,0.18)",
                margin: "32px auto 24px",
              }}
            />

            <div className="footer-grid">
              {FOOTER_NAV.map((col) => (
                <div key={col.heading}>
                  <p
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 400,
                      fontSize: "10px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.65)",
                      margin: "0 0 14px",
                    }}
                  >
                    {col.heading}
                  </p>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {col.links.map((link) => (
                      <li key={link.href}>
                        {link.href === "/sign-in" ? (
                          <FooterAuthLink />
                        ) : (
                          <Link href={link.href} className="footer-nav-link" style={navLinkStyle}>
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: "0 16px 16px",
              boxSizing: "border-box",
            }}
          >
            {/* Desktop bottom bar (existing) — hidden on mobile via media query */}
            <div
              className="footer-desktop-divider"
              style={{
                height: "0.5px",
                background: "rgba(255,255,255,0.08)",
                marginBottom: "20px",
              }}
            />
            <div className="footer-bottom-bar">
              <p
                className="footer-bottom-left"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 300,
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.50)",
                  margin: 0,
                }}
              >
                © 2026 Solace. All rights reserved.
              </p>
              <p
                className="footer-bottom-disclaimer"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 300,
                  fontSize: "12px",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.75)",
                  margin: 0,
                }}
              >
                Solace is designed for adults only. It provides reflective support
                {" — "}not medical, psychological, legal, financial, or professional advice.
              </p>
              <p
                className="footer-bottom-right"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 300,
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.50)",
                  margin: 0,
                  flexShrink: 0,
                }}
              >
                Built with care.
              </p>
            </div>
            <p
              aria-hidden="true"
              className="footer-desktop-wordmark"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                fontSize: "18px",
                letterSpacing: "0.32em",
                color: "rgba(255,255,255,0.12)",
                margin: "28px 0 0",
                textAlign: "center",
                paddingLeft: "0.32em",
              }}
            >
              SOLACE
            </p>

            {/* Mobile-only bottom block — centered disclaimer, copyright on one line, SOLACE wordmark closing */}
            <div className="footer-mobile-bottom" style={{ display: "none", textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 300,
                  fontSize: "12px",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.65)",
                  margin: "0 auto 20px",
                  maxWidth: "320px",
                }}
              >
                Solace is designed for adults only. It provides reflective support
                {" — "}not medical, psychological, legal, financial, or professional advice.
              </p>
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 300,
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.65)",
                  margin: "0 0 32px",
                }}
              >
                © 2026 · Built with care.
              </p>
              <p
                aria-hidden="true"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 300,
                  fontSize: "18px",
                  letterSpacing: "0.32em",
                  color: "rgba(255,255,255,0.55)",
                  margin: 0,
                  paddingLeft: "0.32em",
                }}
              >
                SOLACE
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
