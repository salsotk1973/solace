import Link from "next/link";
import { getLabCategoryRgb } from "@/lib/design-tokens";

export type LabSecondaryArticle = {
  title: string;
  slug: string;
  category: "calm-your-state" | "think-clearly" | "notice-whats-good";
  readingTime: number;
  excerpt: string;
};

const PILL_BASE = {
  display: "inline-block",
  padding: "3px 10px",
  borderRadius: "100px",
  fontFamily: "'Jost', sans-serif",
  fontWeight: 400,
  fontSize: "10px",
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
  whiteSpace: "nowrap" as const,
};

export default function LabSecondaryCard({ article }: { article: LabSecondaryArticle }) {
  const _rgb = getLabCategoryRgb(article.category).replace(/, /g, ",");
  const accent = `rgba(${_rgb},1)`;
  const catBg = `rgba(${_rgb},0.08)`;

  // Per-instance scoped class — different categories on the same page need their own hover colour
  const scopeClass = `lab-secondary-${article.category}`;

  return (
    <>
      <style>{`
        .${scopeClass} {
          padding: 20px 22px;
          border-radius: 16px;
          background: rgba(${_rgb},0.035);
          border: 0.5px solid rgba(${_rgb},0.16);
          text-decoration: none;
          height: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 16px;
          transition: transform 220ms ease, background 220ms ease, border-color 220ms ease;
          will-change: transform;
        }
        @media (hover: hover) {
          .${scopeClass}:hover {
            transform: translateY(-2px);
            background: rgba(${_rgb},0.06);
            border-color: rgba(${_rgb},0.28);
          }
        }
        @media (max-width: 767px) {
          .${scopeClass} {
            padding: 14px 18px 14px !important;
            min-height: auto !important;
          }
          .${scopeClass} .lab-home-secondary-pill {
            background: transparent !important;
            border: none !important;
            padding: 0 !important;
            border-radius: 0 !important;
            font-size: 11px !important;
            letter-spacing: 0.18em !important;
          }
          .${scopeClass} h3 {
            font-size: 22px !important;
          }
          .${scopeClass} .lab-home-secondary-excerpt {
            display: none !important;
          }
          .${scopeClass} .lab-home-secondary-footer {
            display: none !important;
          }
        }
      `}</style>
      <Link
        href={`/lab/${article.slug}`}
        className={`${scopeClass} group block`}
      >
        <div>
          <span
            className="lab-home-secondary-pill"
            style={{
              ...PILL_BASE,
              background: catBg,
              border: `0.5px solid ${accent.replace("1)", "0.2)")}`,
              color: accent,
              marginBottom: "12px",
            }}
          >
            {article.category.replace(/-/g, " ")}
          </span>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: "20px",
              lineHeight: 1.2,
              color: "rgba(240,234,255,0.92)",
              margin: "12px 0 0",
            }}
          >
            {article.title}
          </h3>
          <p
            className="lab-home-secondary-excerpt"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              fontSize: "12px",
              lineHeight: 1.6,
              color: "rgba(200,192,230,0.60)",
              margin: "10px 0 0",
            }}
          >
            {article.excerpt}
          </p>
        </div>
        <div
          className="lab-home-secondary-footer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 400,
              fontSize: "11px",
              letterSpacing: "0.08em",
              color: "rgba(155,145,200,0.70)",
            }}
          >
            {article.readingTime} min read
          </span>
          <span
            className="lab-secondary-cta"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 400,
              fontSize: "10px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: accent,
              opacity: 0.72,
              transition: "opacity 220ms ease, transform 220ms ease",
            }}
          >
            Read →
          </span>
        </div>
      </Link>
    </>
  );
}
