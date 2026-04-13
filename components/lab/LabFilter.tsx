'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { LabArticle } from '@/lib/lab'

// ─── Category config ──────────────────────────────────────────────────────────

type Category = 'all' | LabArticle['category']

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all',               label: 'All' },
  { id: 'calm-your-state',   label: 'Calm your state' },
  { id: 'think-clearly',     label: 'Think clearly' },
  { id: 'notice-whats-good', label: "Notice what's good" },
]

const CATEGORY_ACCENT: Record<LabArticle['category'], string> = {
  'calm-your-state':   'rgba(68,200,110,1)',
  'think-clearly':     'rgba(125,211,252,1)',
  'notice-whats-good': 'rgba(218,148,48,1)',
}

const CATEGORY_BG: Record<LabArticle['category'], string> = {
  'calm-your-state':   'rgba(68,200,110,0.08)',
  'think-clearly':     'rgba(125,211,252,0.08)',
  'notice-whats-good': 'rgba(218,148,48,0.08)',
}

const FEATURED_BG: Record<string, string> = {
  'calm-your-state':   '#0e1c1b',
  'think-clearly':     '#121d27',
  'notice-whats-good': '#1a1816',
}

// ─── Shared pill style ────────────────────────────────────────────────────────

const PILL_BASE = {
  display:        'inline-block',
  padding:        '4px 12px',
  borderRadius:   '100px',
  fontFamily:     "'Jost', sans-serif",
  fontWeight:     400,
  fontSize:       '10px',
  letterSpacing:  '0.14em',
  textTransform:  'uppercase' as const,
  whiteSpace:     'nowrap' as const,
}

// ─── Responsive CSS ───────────────────────────────────────────────────────────

const RESPONSIVE_CSS = `
  .lab-article-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .lab-article-card {
    flex-direction: column;
  }
  .lab-card-left {
    display: contents;
  }
  .lab-card-right {
    display: contents;
  }

  @media (max-width: 768px) {
    .lab-article-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 639px) {
    .lab-article-grid {
      grid-template-columns: 1fr;
    }
    .lab-article-card {
      flex-direction: row !important;
      align-items: flex-start;
      padding: 20px 18px !important;
      gap: 16px;
    }
    .lab-card-left {
      display: flex !important;
      flex-direction: column;
      flex: 0 0 44%;
      min-width: 0;
    }
    .lab-card-right {
      display: flex !important;
      flex-direction: column;
      flex: 1;
      min-width: 0;
      justify-content: space-between;
    }
  }

  .lab-filter-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    align-items: center;
    margin-bottom: 48px;
    width: 100%;
  }

  /* Fit all 4 pills on one row at small screens */
  @media (max-width: 479px) {
    .lab-filter-pills {
      gap: 6px;
      justify-content: center;
    }
    .lab-filter-pills button {
      padding: 6px 10px !important;
      font-size: 10px !important;
      letter-spacing: 0.04em !important;
    }
  }
`

// ─── Article grid card ────────────────────────────────────────────────────────

function ArticleCard({ article }: { article: LabArticle }) {
  const [hovered, setHovered] = useState(false)
  const accent  = CATEGORY_ACCENT[article.category] ?? 'rgba(148,130,210,1)'
  const catBg   = CATEGORY_BG[article.category]     ?? 'rgba(148,130,210,0.08)'
  const router  = useRouter()

  return (
    <div
      role="link"
      tabIndex={0}
      className="lab-article-card"
      onClick={() => router.push(`/lab/${article.slug}`)}
      onKeyDown={e => { if (e.key === 'Enter') router.push(`/lab/${article.slug}`) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:             'flex',
        borderRadius:        '18px',
        padding:             '32px 28px',
        background:          catBg,
        border:              `0.5px solid ${hovered ? accent.replace('1)', '0.35)') : accent.replace('1)', '0.20)')}`,
        backdropFilter:      'blur(12px)',
        WebkitBackdropFilter:'blur(12px)',
        transform:           hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow:           hovered ? `0 8px 36px ${accent.replace('1)', '0.18)')}` : 'none',
        transition:          'transform 0.4s cubic-bezier(0.22,1,0.36,1), border-color 0.4s ease, box-shadow 0.4s ease',
        boxSizing:           'border-box',
        overflow:            'hidden',
        position:            'relative',
        cursor:              'pointer',
      }}
    >
      {/* Top shimmer */}
      <div
        aria-hidden="true"
        style={{
          position:   'absolute',
          top:        0,
          left:       '20%',
          right:      '20%',
          height:     '1px',
          background: `linear-gradient(90deg, transparent, ${accent.replace('1)', '0.22)')}, transparent)`,
          opacity:    hovered ? 0.9 : 0.35,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Left column (mobile) / normal flow (desktop) */}
      <div className="lab-card-left">
        {/* Category pill */}
        <div style={{ marginBottom: '14px' }}>
          <span
            style={{
              ...PILL_BASE,
              background: accent.replace('1)', '0.12)'),
              border:     `0.5px solid ${accent.replace('1)', '0.22)')}`,
              color:      accent,
            }}
          >
            {article.category.replace(/-/g, ' ')}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize:   '20px',
            lineHeight: 1.3,
            color:      hovered ? 'rgba(240,234,255,0.95)' : 'rgba(225,218,252,0.85)',
            margin:     '0 0 12px',
            transition: 'color 0.4s ease',
          }}
        >
          {article.title}
        </h3>
      </div>

      {/* Right column (mobile) / normal flow (desktop) */}
      <div className="lab-card-right" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Excerpt */}
        <p
          style={{
            fontFamily:      "'Jost', sans-serif",
            fontWeight:      300,
            fontSize:        '13px',
            lineHeight:      1.72,
            color:           'rgba(175,168,215,0.80)',
            margin:          '0 0 20px',
            display:         '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
            overflow:        'hidden',
            flex:            1,
          }}
        >
          {article.excerpt}
        </p>

        {/* Bottom row — animated arrow on hover */}
        <div
          style={{
            paddingTop:  '14px',
            borderTop:   `0.5px solid ${hovered ? accent.replace('1)', '0.12)') : accent.replace('1)', '0.08)')}`,
            display:     'flex',
            alignItems:  'center',
            gap:         '8px',
            transition:  'border-color 0.4s ease',
            marginTop:   'auto',
          }}
        >
          <span
            style={{
              fontFamily:    "'Jost', sans-serif",
              fontWeight:    400,
              fontSize:      '10px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase' as const,
              color:         hovered ? accent.replace('1)', '0.72)') : accent.replace('1)', '0.45)'),
              transition:    'color 0.4s ease',
            }}
          >
            {article.readingTime} min read
          </span>
          <span
            style={{
              fontSize:   '14px',
              color:      accent,
              opacity:    hovered ? 0.75 : 0,
              transform:  hovered ? 'translateX(2px)' : 'translateX(-8px)',
              transition: 'opacity 0.45s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)',
              lineHeight: 1,
              display:    'inline-block',
            }}
          >
            →
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Featured card ────────────────────────────────────────────────────────────

export function FeaturedCard({
  article,
  variant = 'default',
}: {
  article: LabArticle
  variant?: 'default' | 'compact'
}) {
  const [hovered, setHovered] = useState(false)
  const accent = CATEGORY_ACCENT[article.category] ?? 'rgba(148,130,210,1)'
  const catBg  = CATEGORY_BG[article.category]     ?? 'rgba(148,130,210,0.08)'
  const isCompact = variant === 'compact'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '22px',
        background:   FEATURED_BG[article.category] ?? catBg,
        border:       `0.5px solid ${hovered ? accent.replace('1)', '0.35)') : accent.replace('1)', '0.18)')}`,
        boxShadow:    hovered
          ? `0 0 ${isCompact ? '18px 4px' : '24px 6px'} ${accent.replace('1)', isCompact ? '0.24)' : '0.35)')}`
          : `0 0 ${isCompact ? '8px 1px' : '12px 2px'} ${accent.replace('1)', isCompact ? '0.12)' : '0.18)')}`,
        transition:   'border-color 0.4s ease, box-shadow 0.4s ease',
        position:     'relative',
        marginBottom: isCompact ? '28px' : '48px',
      }}
    >
    <Link
      href={`/lab/${article.slug}`}
      style={{
        display:        'block',
        borderRadius:   '22px',
        padding:        isCompact ? '34px 38px' : '48px 56px',
        background:     'transparent',
        textDecoration: 'none',
        boxSizing:      'border-box',
        transform:      hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition:     'transform 0.4s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {/* Top shimmer */}
      <div
        aria-hidden="true"
        style={{
          position:      'absolute',
          top:           0,
          left:          '10%',
          right:         '10%',
          height:        '1px',
          background:    `linear-gradient(90deg, transparent, ${accent.replace('1)', '0.2)')}, transparent)`,
          opacity:       hovered ? 0.9 : 0.4,
          transition:    'opacity 0.4s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div>
        {/* Pills row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{ ...PILL_BASE, background: accent.replace('1)', '0.10)'), border: `0.5px solid ${accent.replace('1)', '0.30)')}`, color: accent }}>
            Editor&apos;s pick
          </span>
          <span style={{ ...PILL_BASE, background: catBg, border: `0.5px solid ${accent.replace('1)', '0.2)')}`, color: accent }}>
            {article.category.replace(/-/g, ' ')}
          </span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize:   isCompact ? 'clamp(28px, 3.1vw, 42px)' : 'clamp(32px, 3.8vw, 52px)',
            lineHeight: 1.15,
            color:      hovered ? 'rgba(250,246,255,0.98)' : 'rgba(240,234,255,0.92)',
            margin:     isCompact ? '0 0 16px' : '0 0 20px',
            maxWidth:   isCompact ? '520px' : '580px',
            transition: 'color 0.4s ease',
          }}
        >
          {article.title}
        </h2>

        {/* Excerpt */}
        <p
          style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 300,
            fontSize:   isCompact ? '13px' : '14px',
            lineHeight: 1.8,
            color:      'rgba(255,255,255,0.65)',
            margin:     isCompact ? '0 0 20px' : '0 0 28px',
            maxWidth:   isCompact ? '440px' : '480px',
          }}
        >
          {article.excerpt}
        </p>

        {/* Reading time + animated Read → */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span
            style={{
              fontFamily:    "'Jost', sans-serif",
              fontWeight:    400,
              fontSize:      '11px',
              letterSpacing: '0.08em',
              color:         'rgba(155,145,200,0.70)',
            }}
          >
            {article.readingTime} min read
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontFamily:    "'Jost', sans-serif",
                fontWeight:    400,
                fontSize:      '10px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase' as const,
                color:         accent,
                opacity:       hovered ? 0.62 : 0,
                transform:     hovered ? 'translateX(0)' : 'translateX(-6px)',
                transition:    'opacity 0.45s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              Read
            </span>
            <span
              style={{
                fontSize:   '16px',
                color:      accent,
                opacity:    hovered ? 0.75 : 0,
                transform:  hovered ? 'translateX(2px)' : 'translateX(-8px)',
                transition: 'opacity 0.45s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)',
                lineHeight: 1,
                display:    'inline-block',
              }}
            >
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
    </div>
  )
}

// ─── LabFilter ─────────────────────────────────────────────────────────────────

export default function LabFilter({
  featured,
  articles,
}: {
  featured: LabArticle | null
  articles: LabArticle[]
}) {
  const [active, setActive] = useState<Category>('all')

  const filtered = active === 'all'
    ? articles
    : articles.filter(a => a.category === active)

  return (
    <>
      <style>{RESPONSIVE_CSS}</style>

      <div>
        {/* ── Filter pills ─────────────────────────────────────────────── */}
        <div className="lab-filter-pills">
          {CATEGORIES.map(cat => {
            const isActive    = active === cat.id
            const accentColor = cat.id === 'all'
              ? 'rgba(148,130,210,1)'
              : CATEGORY_ACCENT[cat.id as LabArticle['category']]

            return (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                style={{
                  padding:       '8px 20px',
                  borderRadius:  '100px',
                  border:        `0.5px solid ${isActive ? accentColor.replace('1)', '0.35)') : 'rgba(110,95,180,0.14)'}`,
                  background:    isActive ? accentColor.replace('1)', '0.1)') : 'transparent',
                  fontFamily:    "'Jost', sans-serif",
                  fontWeight:    400,
                  fontSize:      '12px',
                  letterSpacing: '0.08em',
                  color:         isActive ? accentColor : 'rgba(130,118,185,0.45)',
                  cursor:        'pointer',
                  transition:    'all 0.3s ease',
                  whiteSpace:    'nowrap',
                }}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* ── Featured article ─────────────────────────────────────────── */}
        {featured && <FeaturedCard article={featured} />}

        {/* ── Article grid ─────────────────────────────────────────────── */}
        <div className="lab-article-grid">
          {filtered.map(article => (
            <ArticleCard key={article.slug ?? article.title} article={article} />
          ))}
          {filtered.length === 0 && (
            <p
              style={{
                gridColumn: '1 / -1',
                textAlign:  'center',
                fontFamily: "'Jost', sans-serif",
                fontWeight: 300,
                fontSize:   '13px',
                color:      'rgba(110,102,158,0.4)',
                padding:    '48px 0',
              }}
            >
              No articles in this category yet.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
