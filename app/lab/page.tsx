import Link from 'next/link'
import { getAllArticles, getFeaturedArticle } from '@/lib/lab'
import LabParticles   from '@/components/lab/LabParticles'
import LabFilter      from '@/components/lab/LabFilter'
import NewsletterForm from '@/components/lab/NewsletterForm'

export default function LabPage() {
  const featured    = getFeaturedArticle()
  const allArticles = getAllArticles()
  const nonFeatured = allArticles.filter(a => !a.featured)

  return (
    <main
      style={{
        minHeight:  '100vh',
        background: '#090d14',
        color:      'rgba(225,218,252,0.85)',
        position:   'relative',
      }}
    >
      {/* ── Atmospheric background ──────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         '100vw',
          height:        '100vh',
          background:    'radial-gradient(ellipse 80% 65% at 50% 38%, #0e0c1e 0%, #070610 52%, #050508 100%)',
          zIndex:        1,
          pointerEvents: 'none',
        }}
      />

      {/* ── Ambient particles (client) ──────────────────────────────────────── */}
      <LabParticles />

      {/* ── Page content ────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 3 }}>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 1 — HERO
        ════════════════════════════════════════════════════════════════════ */}
        <section
          style={{
            width:          '100%',
            padding:        '140px 40px 80px',
            boxSizing:      'border-box',
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            textAlign:      'center',
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontFamily:    "'DM Sans', sans-serif",
              fontWeight:    400,
              fontSize:      '10px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color:         'rgba(130,112,200,0.42)',
              margin:        '0 0 24px',
            }}
          >
            Human Behaviour Lab
          </p>

          {/* H1 */}
          <h1
            style={{
              fontFamily:    "'Cormorant Garamond', serif",
              fontWeight:    300,
              fontSize:      'clamp(38px, 5.2vw, 68px)',
              lineHeight:    1.12,
              letterSpacing: '-0.01em',
              color:         'rgba(235,228,255,0.9)',
              margin:        '0 0 24px',
              maxWidth:      '720px',
            }}
          >
            Understand yourself<br />
            <em style={{ fontStyle: 'italic', color: 'rgba(192,172,248,0.65)' }}>
              a little better.
            </em>
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize:   '15px',
              lineHeight: 1.8,
              color:      'rgba(175,168,215,0.75)',
              margin:     0,
              maxWidth:   '520px',
            }}
          >
            Research, ideas, and honest writing about how we think, feel, and
            behave — and the small things that help.
          </p>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTIONS 2–4 — FILTER PILLS + FEATURED + ARTICLE GRID (client)
        ════════════════════════════════════════════════════════════════════ */}
        <section
          style={{
            width:     '100%',
            padding:   '0 40px 80px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <LabFilter featured={featured} articles={nonFeatured} />
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 5 — NEWSLETTER
        ════════════════════════════════════════════════════════════════════ */}
        <section
          style={{
            width:          '100%',
            padding:        '0 40px 80px',
            boxSizing:      'border-box',
            display:        'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              maxWidth:     '1000px',
              width:        '100%',
              borderRadius: '22px',
              padding:      '60px 64px',
              background:   'linear-gradient(135deg, #0e0c22, #0a0818, #0c0a1e)',
              border:       '0.5px solid rgba(120,100,195,0.13)',
              overflow:     'hidden',
              position:     'relative',
              boxSizing:    'border-box',
            }}
          >
            {/* Top shimmer */}
            <div
              aria-hidden="true"
              style={{
                position:      'absolute',
                top:           0,
                left:          '15%',
                right:         '15%',
                height:        '1px',
                background:    'linear-gradient(90deg, transparent, rgba(138,116,212,0.2), transparent)',
                pointerEvents: 'none',
              }}
            />

            <div
              style={{
                display:       'flex',
                flexDirection: 'column',
                alignItems:    'flex-start',
                gap:           '16px',
                position:      'relative',
                zIndex:        1,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize:   'clamp(26px, 2.8vw, 36px)',
                  lineHeight: 1.2,
                  color:      'rgba(230,222,255,0.9)',
                  margin:     0,
                }}
              >
                New thinking, weekly.
              </h2>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                  fontSize:   '14px',
                  lineHeight: 1.8,
                  color:      'rgba(175,168,215,0.75)',
                  margin:     '0 0 8px',
                  maxWidth:   '400px',
                }}
              >
                No noise. Just one piece of honest writing about how we think and
                feel — straight to your inbox.
              </p>
              <NewsletterForm />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 6 — FOOTER BRIDGE
        ════════════════════════════════════════════════════════════════════ */}
        <section
          style={{
            width:      '100%',
            padding:    '0 40px 100px',
            boxSizing:  'border-box',
            textAlign:  'center',
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize:   '13px',
              color:      'rgba(155,145,200,0.65)',
              margin:     '0 0 12px',
            }}
          >
            These ideas come to life in the tools.
          </p>
          <Link
            href="/tools"
            style={{
              fontFamily:     "'DM Sans', sans-serif",
              fontWeight:     400,
              fontSize:       '11px',
              letterSpacing:  '0.16em',
              textTransform:  'uppercase',
              color:          'rgba(148,130,210,0.42)',
              textDecoration: 'none',
            }}
          >
            Explore the tools →
          </Link>
        </section>

      </div>
    </main>
  )
}
