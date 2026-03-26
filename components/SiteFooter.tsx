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
          padding: 12px 24px 30px;
        }

        .site-footer-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding-top: 18px;

          /* FIX: clearer divider */
          border-top: 1px solid rgba(255, 255, 255, 0.14);
        }

        .site-footer-copy {
          margin: 0;
          font-size: 12px;
          line-height: 1.6;

          /* FIX: readable white */
          color: rgba(255, 255, 255, 0.78);

          letter-spacing: 0.01em;
        }

        .site-footer-link {
          flex-shrink: 0;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;

          /* FIX: visible white */
          color: rgba(255, 255, 255, 0.92);

          border-bottom: 1px solid rgba(255, 255, 255, 0.28);

          transition: all 160ms ease;
        }

        .site-footer-link:hover {
          color: rgba(255, 255, 255, 1);
          border-color: rgba(255, 255, 255, 0.5);
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