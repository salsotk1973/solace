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
                <span className="site-nav-pill-tint" />
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
          min-height: 64px;
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
          font-size: clamp(3.4rem, 4.35vw, 4.9rem);
          font-weight: 560;
          line-height: 0.86;
          letter-spacing: -0.078em;
          color: rgba(147, 173, 255, 0.98);
          text-shadow:
            0 0 16px rgba(104, 136, 255, 0.16),
            0 0 40px rgba(104, 136, 255, 0.06);
          transition:
            color 180ms ease,
            text-shadow 180ms ease,
            transform 180ms ease;
        }

        .site-logo:hover {
          color: rgba(172, 194, 255, 1);
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
          min-height: 52px;
          padding: 0 21px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 999px;
          text-decoration: none;
          border: 1px solid rgba(198, 212, 255, 0.22);
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.16) 0%,
              rgba(170, 188, 255, 0.1) 40%,
              rgba(48, 66, 128, 0.16) 100%
            );
          box-shadow:
            0 16px 36px rgba(0, 0, 0, 0.18),
            0 0 22px rgba(116, 144, 255, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.26),
            inset 0 -12px 18px rgba(18, 28, 62, 0.22);
          backdrop-filter: blur(16px) saturate(128%);
          -webkit-backdrop-filter: blur(16px) saturate(128%);
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .site-nav-pill:hover {
          transform: translateY(-1px);
          border-color: rgba(220, 230, 255, 0.3);
          box-shadow:
            0 18px 40px rgba(0, 0, 0, 0.2),
            0 0 32px rgba(132, 158, 255, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.32),
            inset 0 -12px 18px rgba(18, 28, 62, 0.24);
        }

        .site-nav-pill-active {
          border-color: rgba(228, 236, 255, 0.32);
        }

        .site-nav-pill-sheen,
        .site-nav-pill-tint {
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

        .site-nav-pill-tint {
          background:
            radial-gradient(
              ellipse at 50% 118%,
              rgba(118, 146, 255, 0.18) 0%,
              rgba(118, 146, 255, 0.05) 42%,
              rgba(118, 146, 255, 0) 74%
            );
          opacity: 0.84;
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