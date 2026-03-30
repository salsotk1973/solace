'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { LabArticle } from '@/lib/lab'

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

function RelatedCard({ article }: { article: LabArticle }) {
  const [hovered, setHovered] = useState(false)
  const accent = CATEGORY_ACCENT[article.category] ?? 'rgba(148,130,210,1)'
  const catBg  = CATEGORY_BG[article.category]     ?? 'rgba(148,130,210,0.08)'

  return (
    <Link
      href={`/lab/${article.slug}`}
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
        textDecoration:      'none',
      }}
    >
      {/* Top shimmer */}
      <div
        aria-hidden="true"
        style={{
          position:      'absolute',
          top:           0,
          left:          '20%',
          right:         '20%',
          height:        '1px',
          background:    `linear-gradient(90deg, transparent, ${accent.replace('1)', '0.22)')}, transparent)`,
          opacity:       hovered ? 0.9 : 0.35,
          transition:    'opacity 0.4s ease',
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

      {/* Excerpt — 2 lines */}
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
          paddingTop: '16px',
          borderTop:  `0.5px solid ${accent.replace('1)', '0.08)')}`,
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
    </Link>
  )
}

export default function RelatedArticles({ articles }: { articles: LabArticle[] }) {
  if (articles.length === 0) return null

  return (
    <section style={{ marginTop: '80px' }}>
      {/* Heading */}
      <p
        style={{
          fontFamily:    "'DM Sans', sans-serif",
          fontWeight:    400,
          fontSize:      '10px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color:         'rgba(130,112,200,0.42)',
          margin:        '0 0 28px',
        }}
      >
        More from the Lab
      </p>

      {/* Grid — 2 cols */}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap:                 '16px',
        }}
      >
        {articles.map(article => (
          <RelatedCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  )
}
