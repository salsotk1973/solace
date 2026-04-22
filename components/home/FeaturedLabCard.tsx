import Link from "next/link";
import { getLabCategoryRgb } from "@/lib/design-tokens";

export type FeaturedLabArticle = {
  title: string;
  slug: string;
  category: "calm-your-state" | "think-clearly" | "notice-whats-good";
  excerpt: string;
  readingTime: number;
};

const PILL_BASE = {
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: "100px",
  fontFamily: "'Jost', sans-serif",
  fontWeight: 400,
  fontSize: "10px",
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
  whiteSpace: "nowrap" as const,
};

export default function FeaturedLabCard({ article }: { article: FeaturedLabArticle }) {
  const _rgb   = getLabCategoryRgb(article.category).replace(/, /g, ',')
  const accent = `rgba(${_rgb},1)`
  const catBg  = `rgba(${_rgb},0.08)`
  const featBg = `rgba(${_rgb},0.05)`

  return (
    <>
      <style>{`
        .featured-lab-card-link {
          padding: 20px 22px;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        .featured-lab-card-link > div:last-of-type {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .featured-lab-card-link > div:last-of-type > div:last-of-type {
          margin-top: auto;
        }
        .featured-lab-card-wrapper {
          height: 100%;
          transition: transform 220ms ease, background 220ms ease, border-color 220ms ease;
          will-change: transform;
        }
        @media (hover: hover) {
          .featured-lab-card-wrapper:hover {
            transform: translateY(-2px);
            background: rgba(${_rgb},0.08) !important;
            border-color: ${accent.replace("1)", "0.30)")} !important;
          }
        }
        @media (max-width: 640px) {
          .featured-lab-card-link {
            padding: 22px 22px;
          }
          .featured-lab-pill-editors-pick {
            display: none !important;
          }
        }
      `}</style>
      <div
        className="featured-lab-card-wrapper"
        style={{
          borderRadius: "22px",
          background: featBg,
          border: `0.5px solid ${accent.replace("1)", "0.18)")}`,
          boxShadow: `0 0 8px 1px ${accent.replace("1)", "0.12)")}`,
          position: "relative",
        }}
      >
        <Link
          href={`/lab/${article.slug}`}
          className="featured-lab-card-link"
          style={{
            borderRadius: "22px",
            background: "transparent",
            textDecoration: "none",
            boxSizing: "border-box",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: "10%",
              right: "10%",
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${accent.replace("1)", "0.2)")}, transparent)`,
              opacity: 0.4,
              pointerEvents: "none",
            }}
          />

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
              <span
                className="featured-lab-pill-editors-pick"
                style={{
                  ...PILL_BASE,
                  background: accent.replace("1)", "0.10)"),
                  border: `0.5px solid ${accent.replace("1)", "0.30)")}`,
                  color: accent,
                }}
              >
                Editor&apos;s pick
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: "20px",
                lineHeight: 1.2,
                color: "rgba(240,234,255,0.92)",
                margin: "0 0 12px",
                maxWidth: "560px",
              }}
            >
              {article.title}
            </h2>

            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 300,
                fontSize: "13px",
                lineHeight: 1.65,
                color: "rgba(200,192,230,0.70)",
                margin: "0 0 16px",
                maxWidth: "540px",
              }}
            >
              {article.excerpt}
            </p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
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
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 400,
                  fontSize: "10px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: accent,
                  opacity: 0.72,
                }}
              >
                Read →
              </span>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
