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
    <div
      style={{
        borderRadius: "22px",
        background: featBg,
        border: `0.5px solid ${accent.replace("1)", "0.18)")}`,
        boxShadow: `0 0 8px 1px ${accent.replace("1)", "0.12)")}`,
        position: "relative",
        marginBottom: "28px",
      }}
    >
      <Link
        href={`/lab/${article.slug}`}
        style={{
          display: "block",
          borderRadius: "22px",
          padding: "34px 38px",
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <span
              style={{
                ...PILL_BASE,
                background: accent.replace("1)", "0.10)"),
                border: `0.5px solid ${accent.replace("1)", "0.30)")}`,
                color: accent,
              }}
            >
              Editor&apos;s pick
            </span>
            <span
              style={{
                ...PILL_BASE,
                background: catBg,
                border: `0.5px solid ${accent.replace("1)", "0.2)")}`,
                color: accent,
              }}
            >
              {article.category.replace(/-/g, " ")}
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: "clamp(28px, 3.1vw, 42px)",
              lineHeight: 1.15,
              color: "rgba(240,234,255,0.92)",
              margin: "0 0 16px",
              maxWidth: "520px",
            }}
          >
            {article.title}
          </h2>

          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              fontSize: "13px",
              lineHeight: 1.8,
              color: "rgba(135,128,178,0.48)",
              margin: "0 0 20px",
              maxWidth: "440px",
            }}
          >
            {article.excerpt}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
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
  );
}
