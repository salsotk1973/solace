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
          .footer-mobile-inline {
            display: flex !important;
          }
          .footer-grid {
            display: none;
          }
          .footer-mobile-padding {
            padding: 28px 16px 20px !important;
          }
          .footer-bottom-bar { flex-direction: column; align-items: flex-start; gap: 10px; }
          .footer-bottom-disclaimer { flex: unset; width: 100%; }
          .footer-bottom-right { text-align: left; }
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
            background:
              "linear-gradient(0deg, rgba(9,13,20,0.85) 0%, rgba(9,13,20,0.60) 50%, rgba(9,13,20,0.0) 100%)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div
            className="footer-mobile-padding"
            style={{
              padding: "48px 16px 32px",
              boxSizing: "border-box",
            }}
          >
            {/* Mobile-only inline nav (<=640px). Replaces the 3-column grid below. */}
            <nav
              className="footer-mobile-inline"
              aria-label="Footer navigation"
              style={{
                display: "none",
                flexWrap: "wrap",
                gap: "8px 14px",
                fontFamily: "'Jost', sans-serif",
                fontWeight: 300,
                fontSize: "12px",
                color: "rgba(255,255,255,0.60)",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Link href="/tools" className="footer-nav-link" style={navLinkStyle}>Tools</Link>
              <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.20)" }}>·</span>
              <Link href="/pricing" className="footer-nav-link" style={navLinkStyle}>Pricing</Link>
              <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.20)" }}>·</span>
              <Link href="/lab" className="footer-nav-link" style={navLinkStyle}>Lab</Link>
              <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.20)" }}>·</span>
              <Link href="/principles" className="footer-nav-link" style={navLinkStyle}>Principles</Link>
              <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.20)" }}>·</span>
              <Link href="/about" className="footer-nav-link" style={navLinkStyle}>About</Link>
              <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.20)" }}>·</span>
              <Link href="/privacy" className="footer-nav-link" style={navLinkStyle}>Privacy</Link>
              <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.20)" }}>·</span>
              <Link href="/terms" className="footer-nav-link" style={navLinkStyle}>Terms</Link>
            </nav>

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
            <div
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
          </div>
        </div>
      </footer>
    </>
  );
}
