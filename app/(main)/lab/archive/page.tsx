import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllArticles } from '@/lib/lab'
import LabArchiveFilter, { ARCHIVE_CSS } from '@/components/lab/LabArchiveFilter'
import PageShell from '@/components/PageShell'
import BgFlat from '@/components/backgrounds/BgFlat'
import { TEXT_COLOURS, FONT_SIZE, CATEGORY_COLOURS } from '@/lib/design-tokens'

export const metadata: Metadata = {
  title: 'All Articles | Solace Lab',
  description: 'Every article from the Human Behaviour Lab — research, ideas, and honest writing about how we think, feel, and behave.',
}

export default function LabArchivePage() {
  const articles = getAllArticles()

  return (
    <PageShell particles={false}>
      <BgFlat>
        <style dangerouslySetInnerHTML={{ __html: ARCHIVE_CSS }} />
        <style>{`
          .archive-back-link:hover {
            color: rgba(200,185,255,0.90) !important;
            border-bottom-color: rgba(200,185,255,0.35) !important;
          }
          .archive-back-link:hover .archive-back-arrow {
            transform: translateX(-4px);
          }
        `}</style>
        {/* Hero */}
        <section style={{
          width:         '100%',
          padding:       '140px 40px 64px',
          boxSizing:     'border-box',
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          textAlign:     'center',
        }}>
          {/* Back link */}
          <Link
            href="/lab"
            className="archive-back-link"
            style={{
              fontFamily:     "'Jost', sans-serif",
              fontWeight:     400,
              fontSize:       '12px',
              letterSpacing:  '0.14em',
              textTransform:  'uppercase',
              color:          'rgba(255,255,255,0.65)',
              textDecoration: 'none',
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '8px',
              marginBottom:   '32px',
              transition:     'color 0.3s ease, border-bottom-color 0.3s ease',
              paddingBottom:  '2px',
              borderBottom:   '1px solid transparent',
            }}
          >
            <span
              className="archive-back-arrow"
              style={{
                fontSize:   '14px',
                display:    'inline-block',
                transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
              }}
            >←</span>
            The Lab
          </Link>

          <p style={{
            fontFamily:    "'Jost', sans-serif",
            fontWeight:    400,
            fontSize:      `${FONT_SIZE.eyebrow}px`,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color:         CATEGORY_COLOURS.decide.hex,
            margin:        '0 0 20px',
          }}>
            Human Behaviour Lab
          </p>

          <h1 style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontWeight:    300,
            fontSize:      'clamp(32px, 4vw, 52px)',
            lineHeight:    1.12,
            letterSpacing: '-0.01em',
            color:         'rgba(235,228,255,0.9)',
            margin:        '0 0 20px',
            maxWidth:      '600px',
          }}>
            All articles
          </h1>

          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 300,
            fontSize:   `${FONT_SIZE.body}px`,
            lineHeight: 1.8,
            color:      TEXT_COLOURS.body,
            margin:     0,
            maxWidth:   '420px',
          }}>
            Everything from the Lab — filter by what you need right now.
          </p>
        </section>

        {/* Filter + Grid */}
        <section
          className="px-4 pb-16 md:px-10 md:pb-[100px]"
          style={{
            width:     '100%',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <LabArchiveFilter articles={articles} />
          </div>
        </section>
      </BgFlat>
    </PageShell>
  )
}
