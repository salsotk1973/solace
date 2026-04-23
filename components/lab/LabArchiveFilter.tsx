'use client'

import { useState } from 'react'
import type { LabArticle } from '@/lib/lab'
import { ArticleCard } from '@/components/lab/LabFilter'
import { getLabCategoryRgb } from '@/lib/design-tokens'

type Category = 'all' | LabArticle['category']

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all',               label: 'All' },
  { id: 'calm-your-state',   label: 'Calm your state' },
  { id: 'think-clearly',     label: 'Think clearly' },
  { id: 'notice-whats-good', label: "Notice what's good" },
]

function labAccent(category: string): string {
  return `rgba(${getLabCategoryRgb(category).replace(/, /g, ',')},1)`
}

const CATEGORY_ACCENT: Record<string, string> = {
  'calm-your-state':   labAccent('calm-your-state'),
  'think-clearly':     labAccent('think-clearly'),
  'notice-whats-good': labAccent('notice-whats-good'),
}

export const ARCHIVE_CSS = `
  .archive-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  @media (max-width: 768px) {
    .archive-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 639px) {
    .archive-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }
  .archive-filter-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-bottom: 48px;
    width: 100%;
  }
  @media (max-width: 479px) {
    .archive-filter-pills {
      gap: 6px;
    }
    .archive-filter-pills button {
      padding: 6px 10px !important;
      font-size: 10px !important;
      letter-spacing: 0.04em !important;
    }
  }

  /* ── Base card layout ── */
  .lab-article-card {
    flex-direction: column;
  }
  .lab-card-left {
    display: contents;
  }
  .lab-card-right {
    display: contents;
  }

  @media (max-width: 639px) {
    .lab-article-card {
      flex-direction: column !important;
      padding: 12px 16px 12px !important;
      min-height: auto !important;
    }
    .lab-card-excerpt {
      display: none !important;
    }
    .lab-card-bottom-row {
      display: none !important;
    }
    .lab-card-pill-row {
      margin-bottom: 8px !important;
    }
    .lab-card-reading-time {
      display: none !important;
    }
    .lab-card-pill-row > span:first-child {
      background: transparent !important;
      border: none !important;
      padding: 0 !important;
      border-radius: 0 !important;
      font-size: 11px !important;
      letter-spacing: 0.18em !important;
    }
    .lab-article-card h3 {
      font-size: 18px !important;
    }
  }

  /* Desktop/tablet: reading time in pill row is hidden — shown in bottom row */
  .lab-card-reading-time {
    display: none;
  }
`

export default function LabArchiveFilter({ articles }: { articles: LabArticle[] }) {
  const [active, setActive] = useState<Category>('all')

  const filtered = active === 'all'
    ? articles
    : articles.filter(a => a.category === active)

  return (
    <div>
      {/* Filter pills */}
      <div className="archive-filter-pills">
        {CATEGORIES.map(cat => {
          const isActive = active === cat.id
          const accent = cat.id === 'all'
            ? 'rgba(148,130,210,1)'
            : CATEGORY_ACCENT[cat.id as LabArticle['category']]
          return (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              style={{
                padding:       '8px 20px',
                borderRadius:  '100px',
                border:        `0.5px solid ${isActive ? accent.replace('1)', '0.35)') : 'rgba(130,115,190,0.28)'}`,
                background:    isActive ? accent.replace('1)', '0.1)') : 'transparent',
                fontFamily:    "'Jost', sans-serif",
                fontWeight:    400,
                fontSize:      '12px',
                letterSpacing: '0.08em',
                color:         isActive ? accent : 'rgba(170,158,220,0.70)',
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

      {/* Article count */}
      <p style={{
        fontFamily:    "'Jost', sans-serif",
        fontWeight:    300,
        fontSize:      '12px',
        letterSpacing: '0.08em',
        color:         'rgba(170,158,220,0.50)',
        textAlign:     'center',
        marginBottom:  '32px',
        marginTop:     '-24px',
      }}>
        {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
      </p>

      {/* Grid */}
      <div className="archive-grid">
        {filtered.map(article => (
          <ArticleCard key={article.slug} article={article} />
        ))}
        {filtered.length === 0 && (
          <p style={{
            gridColumn: '1 / -1',
            textAlign:  'center',
            fontFamily: "'Jost', sans-serif",
            fontWeight: 300,
            fontSize:   '13px',
            color:      'rgba(110,102,158,0.4)',
            padding:    '48px 0',
          }}>
            No articles in this category yet.
          </p>
        )}
      </div>
    </div>
  )
}
