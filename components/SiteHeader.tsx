"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Tools", href: "/tools" },
  { label: "Principles", href: "/principles" },
  { label: "Lab", href: "/lab" },
  { label: "About", href: "/about" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-logo" aria-label="Go to Solace home">
          SOLACE
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`site-nav-pill ${isActive ? "site-nav-pill-active" : ""}`}
              >
                <span className="site-nav-pill-sheen" />
                <span className="site-nav-pill-glow" />
                <span className="site-nav-pill-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <style jsx>{`
        .site-header {
          position: relative;
          width: 100%;
          padding: 0 28px;
        }

        .site-header-inner {
          max-width: 1320px;
          margin: 0 auto;
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .site-logo {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          font-size: clamp(3rem, 4.25vw, 4.5rem);
          font-weight: 560;
          line-height: 0.88;
          letter-spacing: -0.075em;
          color: rgba(150, 175, 255, 0.98);
          text-shadow:
            0 0 16px rgba(104, 136, 255, 0.16),
            0 0 40px rgba(104, 136, 255, 0.06);
          transition:
            color 180ms ease,
            text-shadow 180ms ease,
            transform 180ms ease;
        }

        .site-logo:hover {
          color: rgba(174, 196, 255, 1);
          text-shadow:
            0 0 20px rgba(124, 152, 255, 0.2),
            0 0 52px rgba(124, 152, 255, 0.08);
          transform: translateY(-0.5px);
        }

        .site-nav {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 14px;
          flex-wrap: wrap;
        }

        .site-nav-pill {
          position: relative;
          min-height: 50px;
          padding: 0 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 999px;
          text-decoration: none;
          border: 1px solid rgba(202, 214, 255, 0.2);
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.16) 0%,
              rgba(160, 178, 255, 0.12) 38%,
              rgba(64, 80, 132, 0.16) 100%
            );
          box-shadow:
            0 16px 36px rgba(0, 0, 0, 0.18),
            0 0 24px rgba(114, 142, 255, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.26),
            inset 0 -12px 20px rgba(18, 28, 62, 0.22);
          backdrop-filter: blur(18px) saturate(132%);
          -webkit-backdrop-filter: blur(18px) saturate(132%);
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .site-nav-pill:hover {
          transform: translateY(-1px);
          border-color: rgba(224, 232, 255, 0.28);
          box-shadow:
            0 18px 40px rgba(0, 0, 0, 0.2),
            0 0 34px rgba(132, 158, 255, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.32),
            inset 0 -12px 20px rgba(18, 28, 62, 0.24);
        }

        .site-nav-pill-active {
          border-color: rgba(228, 236, 255, 0.32);
          box-shadow:
            0 18px 40px rgba(0, 0, 0, 0.2),
            0 0 40px rgba(136, 162, 255, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.34),
            inset 0 -12px 20px rgba(18, 28, 62, 0.26);
        }

        .site-nav-pill-sheen,
        .site-nav-pill-glow {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
        }

        .site-nav-pill-sheen {
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.26) 0%,
              rgba(255, 255, 255, 0.12) 24%,
              rgba(255, 255, 255, 0.03) 44%,
              rgba(255, 255, 255, 0) 64%
            );
          opacity: 0.94;
        }

        .site-nav-pill-glow {
          background:
            radial-gradient(
              ellipse at 50% 118%,
              rgba(118, 146, 255, 0.22) 0%,
              rgba(118, 146, 255, 0.06) 42%,
              rgba(118, 146, 255, 0) 74%
            );
          opacity: 0.82;
        }

        .site-nav-pill-label {
          position: relative;
          z-index: 2;
          font-size: 14px;
          font-weight: 560;
          letter-spacing: -0.01em;
          color: rgba(246, 248, 255, 0.96);
          text-shadow: 0 1px 0 rgba(0, 0, 0, 0.16);
        }

        @media (max-width: 900px) {
          .site-header {
            padding: 0 18px;
          }

          .site-header-inner {
            min-height: auto;
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
          }

          .site-nav {
            width: 100%;
            justify-content: flex-start;
          }

          .site-logo {
            font-size: clamp(2.45rem, 10vw, 3.8rem);
          }
        }
      `}</style>
    </header>
  );
}