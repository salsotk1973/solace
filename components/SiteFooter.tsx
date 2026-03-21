"use client";

import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p className="site-footer-copy">
          Solace is designed for adults and offers reflective support — not medical,
          psychological, legal, financial, or professional advice.
        </p>

        <Link href="/scope" className="site-footer-link">
          Read scope
        </Link>
      </div>

      <style jsx>{`
        .site-footer {
          position: relative;
          z-index: 30;
          width: 100%;
          padding: 8px 24px 28px;
        }

        .site-footer-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding-top: 18px;
          border-top: 1px solid rgba(184, 206, 255, 0.12);
        }

        .site-footer-copy {
          margin: 0;
          font-size: 12px;
          line-height: 1.6;
          color: rgba(220, 232, 255, 0.42);
          letter-spacing: 0.01em;
        }

        .site-footer-link {
          flex-shrink: 0;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          color: rgba(236, 244, 255, 0.72);
          border-bottom: 1px solid rgba(236, 244, 255, 0.18);
          transition: color 160ms ease, border-color 160ms ease;
        }

        .site-footer-link:hover {
          color: rgba(255, 255, 255, 0.92);
          border-color: rgba(255, 255, 255, 0.34);
        }

        @media (max-width: 640px) {
          .site-footer {
            padding-left: 18px;
            padding-right: 18px;
            padding-bottom: 24px;
          }

          .site-footer-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>
    </footer>
  );
}