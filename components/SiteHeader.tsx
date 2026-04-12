import Link from "next/link";
import SiteHeaderMobileMenu from "@/components/SiteHeaderMobileMenu";

const navItems = [
  { label: "Tools", href: "/tools" },
  { label: "Principles", href: "/principles" },
  { label: "Lab", href: "/lab" },
  { label: "About", href: "/about" },
];

export default function SiteHeader() {
  return (
    <>
      <style>{`
        .site-header-wordmark:hover {
          color: rgba(240,236,255,1) !important;
        }
        .site-header-nav-link:hover {
          color: rgba(240,236,255,1) !important;
        }
        .site-header-auth-link:hover {
          color: rgba(240,236,255,1) !important;
        }
        .site-header-auth-button:hover {
          color: rgba(240,236,255,1) !important;
          border-color: rgba(220,215,250,0.38) !important;
          background: rgba(255,255,255,0.04) !important;
        }
        .site-header-mobile-link:hover {
          color: rgba(240,236,255,1) !important;
        }
        .site-header-mobile-auth-link:hover {
          color: rgba(240,236,255,1) !important;
        }
        .site-header-mobile-auth-button:hover {
          color: rgba(240,236,255,1) !important;
          border-color: rgba(220,215,250,0.38) !important;
          background: rgba(255,255,255,0.04) !important;
        }
        @media (max-width: 767px) {
          .site-header-bar { padding: 0 20px !important; }
        }
      `}</style>

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 80,
          pointerEvents: "none",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: "max(24px, calc(50% - 696px))",
            right: "max(24px, calc(50% - 696px))",
            height: "80px",
            background:
              "linear-gradient(180deg, rgba(9,13,20,0.85) 0%, rgba(9,13,20,0.60) 50%, rgba(9,13,20,0.0) 100%)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            pointerEvents: "none",
          }}
        />

        <div
          className="site-header-bar"
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "1440px",
            margin: "0 auto",
            height: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 40px",
            pointerEvents: "auto",
          }}
        >
          <Link
            href="/"
            aria-label="Solace home"
            className="site-header-wordmark"
            style={{
              display: "inline-flex",
              textDecoration: "none",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: "28px",
              letterSpacing: "0.18em",
              color: "rgba(220,215,245,0.92)",
              textTransform: "uppercase",
              transition: "color 280ms ease, opacity 280ms ease",
            }}
          >
            Solace
          </Link>

          <nav
            className="hidden md:flex"
            style={{ alignItems: "center", gap: "32px" }}
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="site-header-nav-link"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: "13px",
                  letterSpacing: "0.04em",
                  color: "rgba(215,210,240,0.72)",
                  textDecoration: "none",
                  transition: "color 220ms ease",
                }}
              >
                {item.label}
              </Link>
            ))}

            <div
              style={{
                width: "0.5px",
                height: "16px",
                background: "rgba(255,255,255,0.12)",
              }}
            />

            <Link
              href="/sign-in"
              className="site-header-auth-link"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: "13px",
                letterSpacing: "0.04em",
                color: "rgba(215,210,240,0.65)",
                textDecoration: "none",
                transition: "color 220ms ease",
              }}
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="site-header-auth-button"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: "13px",
                letterSpacing: "0.04em",
                color: "rgba(215,210,240,0.9)",
                textDecoration: "none",
                padding: "7px 18px",
                borderRadius: "4px",
                border: "0.5px solid rgba(200,195,235,0.22)",
                background: "transparent",
                transition: "color 220ms ease, border-color 220ms ease, background 220ms ease",
              }}
            >
              Start free
            </Link>
          </nav>
        </div>

        <SiteHeaderMobileMenu navItems={navItems} isSignedIn={false} />
      </header>
    </>
  );
}
