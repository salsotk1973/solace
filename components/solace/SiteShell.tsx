import Link from "next/link";
import { ReactNode } from "react";

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="solace-shell">
      <div className="solace-page">
        <div
          style={{
            paddingTop: 24,
            paddingBottom: 10,
            display: "grid",
            gridTemplateColumns: "max-content 1fr",
            alignItems: "start",
            columnGap: 24,
          }}
        >
          <Link
            href="/"
            aria-label="Go to Solace home"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 34,
              userSelect: "none",
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",
              width: "max-content",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "relative",
                width: 64,
                height: 64,
                flex: "0 0 auto",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "999px",
                  background:
                    "radial-gradient(circle at 35% 30%, #cbc7ff 0%, #a49bff 36%, #867cff 66%, #756ae8 100%)",
                  boxShadow:
                    "0 0 0 12px rgba(138,130,255,0.12), 0 24px 50px rgba(118,108,240,0.30)",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  inset: -8,
                  borderRadius: "999px",
                  border: "1.5px solid rgba(255,255,255,0.55)",
                  opacity: 0.9,
                  transform: "rotate(-18deg) scaleX(1.14) scaleY(0.9)",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  top: 8,
                  left: 10,
                  width: 16,
                  height: 16,
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.40)",
                  filter: "blur(0.4px)",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gap: 8,
                alignItems: "start",
              }}
            >
              <div
                style={{
                  fontSize: "2.3rem",
                  fontWeight: 800,
                  letterSpacing: "0.32em",
                  lineHeight: 0.9,
                  textTransform: "uppercase",
                  color: "#44506a",
                  textShadow: "0 10px 30px rgba(90,100,160,0.12)",
                  whiteSpace: "nowrap",
                }}
              >
                SOLACE
              </div>

              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.34em",
                  lineHeight: 1,
                  textTransform: "uppercase",
                  color: "rgba(86, 98, 126, 0.72)",
                  whiteSpace: "nowrap",
                  paddingLeft: 2,
                }}
              >
                Calm Digital Clarity
              </div>
            </div>
          </Link>

          <nav
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              justifySelf: "end",
              alignItems: "flex-start",
              paddingTop: 6,
              width: "max-content",
            }}
          >
            <Link href="/tools" className="solace-nav-link">
              Tools
            </Link>

            <Link href="/principles" className="solace-nav-link">
              Principles
            </Link>

            <Link href="/lab" className="solace-nav-link">
              Lab
            </Link>

            <Link href="/about" className="solace-nav-link">
              About
            </Link>
          </nav>
        </div>
      </div>

      {children}

      <div className="solace-page">
        <footer className="solace-footer">
          <div className="solace-divider" style={{ marginBottom: 24 }} />
          <p className="solace-body" style={{ margin: 0 }}>
            Solace is a calm collection of digital tools designed to reduce noise and guide
            people toward clarity.
          </p>
        </footer>
      </div>
    </div>
  );
}