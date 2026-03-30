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
  'think-clearly':     'rgba(99,129,228,1)',
  'notice-whats-good': 'rgba(218,148,48,1)',
}

const CATEGORY_BG: Record<LabArticle['category'], string> = {
  'calm-your-state':   'rgba(68,200,110,0.08)',
  'think-clearly':     'rgba(99,129,228,0.08)',
  'notice-whats-good': 'rgba(218,148,48,0.08)',
}

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
      onClick={() => router.push(`/lab/${article.slug}`)}
      onKeyDown={e => { if (e.key === 'Enter') router.push(`/lab/${article.slug}`) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:             'flex',
        flexDirection:       'column',
        borderRadius:        '18px',
        padding:             '32px 28px',
        background:          catBg,
        border:              `1px solid ${hovered ? accent.replace('1)', '0.35)') : accent.replace('1)', '0.20)')}`,
        backdropFilter:      'blur(12px)',
        WebkitBackdropFilter:'blur(12px)',
        transform:           hovered ? 'scale(1.01)' : 'scale(1)',
        transition:          'transform 0.4s cubic-bezier(0.22,1,0.36,1), border-color 0.4s ease',
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

      {/* Category pill */}
      <div style={{ marginBottom: '16px' }}>
        <span
          style={{
            display:       'inline-block',
            padding:       '4px 12px',
            borderRadius:  '100px',
            background:    accent.replace('1)', '0.12)'),
            border:        `0.5px solid ${accent.replace('1)', '0.22)')}`,
            fontFamily:    "'DM Sans', sans-serif",
            fontWeight:    400,
            fontSize:      '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase' as const,
            color:         accent,
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

      {/* Excerpt — 2 lines truncated */}
      <p
        style={{
          fontFamily:      "'DM Sans', sans-serif",
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

      {/* Bottom: X MIN READ → */}
      <div
        style={{
          paddingTop:  '16px',
          borderTop:   `0.5px solid ${accent.replace('1)', '0.08)')}`,
        }}
      >
        <span
          className="arrow-link"
          style={{
            fontFamily:    "'DM Sans', sans-serif",
            fontWeight:    400,
            fontSize:      '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase' as const,
            color:         hovered ? accent.replace('1)', '0.72)') : accent.replace('1)', '0.45)'),
            transition:    'color 0.4s ease',
          }}
        >
          {article.readingTime} min read <span className="arrow">→</span>
        </span>
      </div>
    </div>
  )
}

// ─── Featured card ────────────────────────────────────────────────────────────

function FeaturedCard({ article }: { article: LabArticle }) {
  const [hovered, setHovered] = useState(false)
  const accent = CATEGORY_ACCENT[article.category] ?? 'rgba(148,130,210,1)'
  const catBg  = CATEGORY_BG[article.category]     ?? 'rgba(148,130,210,0.08)'

  return (
    <Link
      href={`/lab/${article.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:             'grid',
        gridTemplateColumns: '1fr auto',
        gap:                 '48px',
        alignItems:          'center',
        borderRadius:        '22px',
        padding:             '48px 56px',
        background:          'linear-gradient(145deg, #0c0a1e, #090714, #0d0a1c)',
        border:              `0.5px solid ${hovered ? accent.replace('1)', '0.2)') : accent.replace('1)', '0.1)')}`,
        overflow:            'hidden',
        position:            'relative',
        textDecoration:      'none',
        marginBottom:        '48px',
        boxSizing:           'border-box',
        transform:           hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition:          'transform 0.4s cubic-bezier(0.22,1,0.36,1), border-color 0.4s ease',
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

      {/* Left content */}
      <div>
        {/* Editor's pick + category pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span
            style={{
              display:       'inline-block',
              padding:       '5px 12px',
              borderRadius:  '100px',
              background:    'rgba(200,168,80,0.12)',
              border:        '0.5px solid rgba(200,168,80,0.32)',
              fontFamily:    "'DM Sans', sans-serif",
              fontWeight:    400,
              fontSize:      '9px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase' as const,
              color:         'rgba(218,185,90,0.85)',
            }}
          >
            Editor's pick
          </span>
          <span
            style={{
              display:       'inline-block',
              padding:       '5px 14px',
              borderRadius:  '100px',
              background:    catBg,
              border:        `0.5px solid ${accent.replace('1)', '0.2)')}`,
              fontFamily:    "'DM Sans', sans-serif",
              fontWeight:    400,
              fontSize:      '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase' as const,
              color:         accent,
            }}
          >
            {article.category.replace(/-/g, ' ')}
          </span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize:   'clamp(28px, 3.2vw, 42px)',
            lineHeight: 1.18,
            color:      hovered ? 'rgba(245,240,255,0.95)' : 'rgba(240,234,255,0.92)',
            margin:     '0 0 18px',
            maxWidth:   '520px',
            transition: 'color 0.4s ease',
          }}
        >
          {article.title}
        </h2>

        {/* Excerpt */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize:   '14px',
            lineHeight: 1.8,
            color:      'rgba(135,128,178,0.52)',
            margin:     '0 0 24px',
            maxWidth:   '480px',
          }}
        >
          {article.excerpt}
        </p>

        {/* Reading time + Read link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span
            style={{
              fontFamily:    "'DM Sans', sans-serif",
              fontWeight:    400,
              fontSize:      '11px',
              letterSpacing: '0.08em',
              color:         'rgba(155,145,200,0.70)',
            }}
          >
            {article.readingTime} min read
          </span>
          <span
            style={{
              fontFamily:    "'DM Sans', sans-serif",
              fontWeight:    400,
              fontSize:      '12px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              color:         hovered ? 'rgba(178,162,228,0.72)' : 'rgba(148,132,215,0.45)',
              transition:    'color 0.4s ease',
            }}
          >
            Read →
          </span>
        </div>
      </div>

      {/* Right: ambient orb glow */}
      <div
        aria-hidden="true"
        style={{
          width:        '200px',
          height:       '200px',
          borderRadius: '50%',
          background:   `radial-gradient(circle at 40% 40%, ${accent.replace('1)', '0.14)')}, transparent 70%)`,
          flexShrink:   0,
          filter:       `blur(32px)`,
          opacity:      hovered ? 0.9 : 0.6,
          transition:   'opacity 0.4s ease',
          transform:    'translateX(20px)',
        }}
      />
    </Link>
  )
}

// ─── LabFilter — filter pills + featured + article grid ───────────────────────

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
    <div>
      {/* ── Section 2: Filter pills ───────────────────────────────────── */}
      <div
        style={{
          display:        'flex',
          flexWrap:       'wrap' as const,
          gap:            '10px',
          justifyContent: 'center',
          marginBottom:   '48px',
        }}
      >
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
                fontFamily:    "'DM Sans', sans-serif",
                fontWeight:    400,
                fontSize:      '12px',
                letterSpacing: '0.08em',
                color:         isActive ? accentColor : 'rgba(130,118,185,0.45)',
                cursor:        'pointer',
                transition:    'all 0.3s ease',
              }}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* ── Section 3: Featured article (always shown) ───────────────── */}
      {featured && <FeaturedCard article={featured} />}

      {/* ── Section 4: Article grid (filtered) ───────────────────────── */}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap:                 '16px',
        }}
      >
        {filtered.map(article => (
          <ArticleCard key={article.slug ?? article.title} article={article} />
        ))}
        {filtered.length === 0 && (
          <p
            style={{
              gridColumn:  '1 / -1',
              textAlign:   'center',
              fontFamily:  "'DM Sans', sans-serif",
              fontWeight:  300,
              fontSize:    '13px',
              color:       'rgba(110,102,158,0.4)',
              padding:     '48px 0',
            }}
          >
            No articles in this category yet.
          </p>
        )}
      </div>
    </div>
  )
}
