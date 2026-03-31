import { getAllArticles, getFeaturedArticle } from '@/lib/lab'
import LabParticles   from '@/components/lab/LabParticles'
import LabFilter      from '@/components/lab/LabFilter'
import NewsletterForm from '@/components/lab/NewsletterForm'
import LabCtaButton   from '@/components/lab/LabCtaButton'

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
      {/* ── Ambient particles (client) ──────────────────────────────────────── */}
      <LabParticles />

      {/* ── Page content ────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 3 }}>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 1 — HERO
        ════════════════════════════════════════════════════════════════════ */}
        <section
          style={{
            width:         '100%',
            padding:       '140px 40px 80px',
            boxSizing:     'border-box',
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'center',
            textAlign:     'center',
          }}
        >
          <p
            style={{
              fontFamily:    "'Jost', sans-serif",
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

          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              fontSize:   '15px',
              lineHeight: 1.8,
              color:      'rgba(175,168,215,0.75)',
              margin:     0,
              maxWidth:   '440px',
            }}
          >
            Research, ideas, and honest writing about how we think, feel, and behave —<br />
            and the small things that help.
          </p>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTIONS 2–4 — FILTER PILLS + FEATURED + ARTICLE GRID
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
            SECTION 5 — TOOLS CTA
        ════════════════════════════════════════════════════════════════════ */}
        <section
          style={{
            width:     '100%',
            padding:   '120px 40px',
            boxSizing: 'border-box',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <p
              style={{
                fontFamily:    "'Jost', sans-serif",
                fontWeight:    400,
                fontSize:      '10px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color:         'rgba(68,138,228,0.50)',
                margin:        '0 0 28px',
              }}
            >
              Human Behaviour Lab
            </p>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize:   'clamp(36px, 4.5vw, 62px)',
                lineHeight: 1.1,
                color:      'rgba(210,228,255,0.93)',
                margin:     '0 0 22px',
              }}
            >
              These ideas come to life{' '}
              <em style={{ fontStyle: 'italic', color: 'rgba(90,168,250,0.52)', whiteSpace: 'nowrap' }}>
                in the tools.
              </em>
            </h2>

            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 300,
                fontSize:   '15px',
                lineHeight: 1.85,
                color:      'rgba(140,180,225,0.50)',
                margin:     '0 0 48px',
                maxWidth:   '480px',
                marginLeft: 'auto',
                marginRight:'auto',
              }}
            >
              Nine tools for breathing, focus, sleep, thought reframing, and AI‑powered reflection.
            </p>

            <LabCtaButton href="/tools" label="Explore the tools" />
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 6 — NEWSLETTER
            Fully transparent — no background, no borders, no shadows
        ════════════════════════════════════════════════════════════════════ */}
        <section
          style={{
            width:         '100%',
            padding:       '100px 40px 110px',
            boxSizing:     'border-box',
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'center',
            textAlign:     'center',
          }}
        >
          <p
            style={{
              fontFamily:    "'Jost', sans-serif",
              fontWeight:    400,
              fontSize:      '10px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color:         'rgba(200,168,80,0.48)',
              margin:        '0 0 20px',
            }}
          >
            Weekly dispatch
          </p>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize:   'clamp(30px, 3.4vw, 46px)',
              lineHeight: 1.12,
              color:      'rgba(238,226,196,0.85)',
              margin:     '0 0 16px',
              maxWidth:   '480px',
            }}
          >
            New thinking,{' '}
            <em style={{ fontStyle: 'italic', color: 'rgba(210,175,90,0.52)' }}>
              weekly.
            </em>
          </h2>

          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              fontSize:   '14px',
              lineHeight: 1.85,
              color:      'rgba(185,172,140,0.58)',
              margin:     '0 0 36px',
              maxWidth:   '380px',
            }}
          >
            No noise. One piece of honest writing about how we think and feel — straight to your inbox.
          </p>

          <div style={{ width: '100%', maxWidth: '460px' }}>
            <NewsletterForm />
          </div>
        </section>

      </div>
    </main>
  )
}
