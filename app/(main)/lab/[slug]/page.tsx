import { notFound }          from 'next/navigation'
import { compileMDX }        from 'next-mdx-remote/rsc'
import Link                  from 'next/link'
import type { Metadata }     from 'next'
import { getAllArticles, getArticleBySlug, getArticlesByCategory } from '@/lib/lab'
import LabToolCta            from '@/components/lab/LabToolCta'
import RelatedArticles       from '@/components/lab/RelatedArticles'
import PageShell             from '@/components/PageShell'
import BgFlat                from '@/components/backgrounds/BgFlat'
import { getLabCategoryRgb, getToolRgb } from '@/lib/design-tokens'

// ─── Static params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllArticles().map(a => ({ slug: a.slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const article  = getArticleBySlug(slug)
  if (!article) return {}

  return {
    title:       `${article.title} | Solace Lab`,
    description: article.excerpt,
    openGraph: {
      title:         article.title,
      description:   article.excerpt,
      type:          'article',
      publishedTime: article.publishedAt,
    },
  }
}

// ─── MDX components — styled to match Solace aesthetic ───────────────────────

const MDX_COMPONENTS = {
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      {...props}
      style={{
        fontFamily:  "'Jost', sans-serif",
        fontWeight:  300,
        fontSize:    '16px',
        lineHeight:  1.85,
        color:       'rgba(175,168,215,0.72)',
        margin:      '0 0 28px',
      }}
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong
      {...props}
      style={{ fontWeight: 500, color: 'rgba(210,205,240,0.85)' }}
    />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em
      {...props}
      style={{ fontStyle: 'italic', color: 'rgba(192,178,240,0.75)' }}
    />
  ),
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ArticlePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug }  = await params
  const article   = getArticleBySlug(slug)
  if (!article) notFound()

  // Split paragraphs for mid-article CTA injection
  const rawParagraphs = article.content.trim().split(/\n\n+/).filter(Boolean)
  const splitAt       = 3
  const beforeSource  = rawParagraphs.slice(0, splitAt).join('\n\n')
  const afterSource   = rawParagraphs.slice(splitAt).join('\n\n')

  const [{ content: beforeContent }, { content: afterContent }] = await Promise.all([
    compileMDX({ source: beforeSource, components: MDX_COMPONENTS }),
    compileMDX({ source: afterSource.length ? afterSource : ' ', components: MDX_COMPONENTS }),
  ])

  // Related articles — same category, exclude current, max 2
  const related = getArticlesByCategory(article.category)
    .filter(a => a.slug !== slug)
    .slice(0, 2)

  // Category accent colour — used for article header pill
  const _rgb     = getLabCategoryRgb(article.category).replace(/, /g, ',')
  const accent   = `rgba(${_rgb},1)`
  const accentBg = `rgba(${_rgb},0.08)`

  // Determine whether a specific tool CTA should show
  const hasTool = !!article.toolCta && article.toolCta.href !== '/tools'

  // Derive CTA button color from the linked TOOL's category (not the article's)
  const HREF_TO_TOOL_SLUG: Record<string, string> = {
    'clear-your-mind': 'clear',
    'choose':          'choose',
    'break-it-down':   'breakdown',
    'breathing':       'breathing',
    'sleep':           'sleep',
    'focus':           'focus',
    'mood':            'mood',
    'gratitude':       'gratitude',
  }
  const toolHrefSegment  = article.toolCta?.href.replace(/^\/tools\//, '').replace(/^\//, '') ?? ''
  const toolSlugForColor = HREF_TO_TOOL_SLUG[toolHrefSegment] ?? null
  const ctaRgb    = toolSlugForColor ? getToolRgb(toolSlugForColor).replace(/, /g, ',') : _rgb
  const ctaAccent   = `rgba(${ctaRgb},1)`
  const ctaAccentBg = `rgba(${ctaRgb},0.08)`

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-GB', {
    day:   'numeric',
    month: 'long',
    year:  'numeric',
  })

  // JSON-LD Article schema
  const jsonLd = {
    '@context':       'https://schema.org',
    '@type':          'Article',
    headline:         article.title,
    description:      article.excerpt,
    datePublished:    article.publishedAt,
    author: {
      '@type': 'Organization',
      name:    'Solace',
    },
  }

  return (
    <PageShell particles={false} style={{ color: 'rgba(225,218,252,0.85)' }}>
      <BgFlat>
      <style dangerouslySetInnerHTML={{ __html: `
        .article-end-cta-btn {
          transition: background 200ms ease-out, border-color 200ms ease-out, box-shadow 220ms ease-out;
        }
        .article-end-cta-btn:hover {
          background: rgba(${ctaRgb}, 0.14) !important;
          border-color: rgba(${ctaRgb}, 0.55) !important;
          box-shadow: 0 0 18px 2px rgba(${ctaRgb}, 0.25);
        }
        @media (prefers-reduced-motion: no-preference) {
          .article-end-cta-btn {
            transition: background 200ms ease-out, border-color 200ms ease-out, box-shadow 220ms ease-out, transform 200ms ease-out;
          }
          .article-end-cta-btn:hover {
            transform: translateY(-1px);
          }
        }
        @media (max-width: 360px) {
          .article-end-cta-btn {
            font-size: 11px !important;
            padding: 9px 18px !important;
            letter-spacing: 0.10em !important;
          }
        }
        .article-back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          padding-bottom: 2px;
          border-bottom: 1px solid transparent;
          transition: color 0.2s ease-out, border-bottom-color 0.2s ease-out;
        }
        .article-back-link:hover {
          color: rgba(200,185,255,0.90);
          border-bottom-color: rgba(200,185,255,0.35);
        }
        .article-back-link:hover .article-back-arrow {
          transform: translateX(-4px);
        }
        .article-back-arrow {
          font-size: 14px;
          display: inline-block;
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
        }
      `}} />
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

        <div
          style={{
            maxWidth:  '680px',
            margin:    '0 auto',
            padding:   '140px 40px 100px',
            boxSizing: 'border-box',
          }}
        >

          {/* ── 1. Back link ──────────────────────────────────────────────── */}
          <div style={{ marginBottom: '48px' }}>
            <Link href="/lab" className="article-back-link">
              <span className="article-back-arrow">←</span>
              The Lab
            </Link>
          </div>

          {/* ── 2. Article header ─────────────────────────────────────────── */}
          <header style={{ marginBottom: '48px' }}>
            {/* Category pill */}
            <div style={{ marginBottom: '20px' }}>
              <span
                style={{
                  display:       'inline-block',
                  padding:       '5px 14px',
                  borderRadius:  '100px',
                  background:    accentBg,
                  border:        `0.5px solid ${accent.replace('1)', '0.2)')}`,
                  fontFamily:    "'Jost', sans-serif",
                  fontWeight:    400,
                  fontSize:      '10px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color:         accent,
                }}
              >
                {article.category.replace(/-/g, ' ')}
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily:    "'Cormorant Garamond', serif",
                fontWeight:    300,
                fontSize:      'clamp(34px, 4.5vw, 52px)',
                lineHeight:    1.12,
                letterSpacing: '-0.01em',
                color:         'rgba(240,234,255,0.95)',
                margin:        '0 0 24px',
              }}
            >
              {article.title}
            </h1>

            {/* Meta — reading time + date */}
            <div
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        '16px',
                marginBottom: '32px',
              }}
            >
              <span
                style={{
                  fontFamily:    "'Jost', sans-serif",
                  fontWeight:    400,
                  fontSize:      '12px',
                  letterSpacing: '0.06em',
                  color:         'rgba(110,102,158,0.45)',
                }}
              >
                {article.readingTime} min read
              </span>
              <span style={{ color: 'rgba(110,102,158,0.2)', fontSize: '10px' }}>·</span>
              <span
                style={{
                  fontFamily:    "'Jost', sans-serif",
                  fontWeight:    400,
                  fontSize:      '12px',
                  letterSpacing: '0.06em',
                  color:         'rgba(110,102,158,0.45)',
                }}
              >
                {formattedDate}
              </span>
            </div>

            {/* Divider */}
            <div
              style={{
                height:     '0.5px',
                background: 'rgba(255,255,255,0.06)',
                width:      '100%',
              }}
            />
          </header>

          {/* ── 3. Article body ───────────────────────────────────────────── */}
          <div>
            {/* Paragraphs 1–3 */}
            <div>{beforeContent}</div>

            {/* Mid-article tool CTA — hidden when no specific tool linked */}
            {hasTool && (
              <LabToolCta
                label={article.toolCta!.label}
                href={article.toolCta!.href}
                category={article.category}
                subtitle={article.toolCta!.description}
              />
            )}

            {/* Remaining paragraphs */}
            {afterSource.length > 0 && (
              <div>{afterContent}</div>
            )}
          </div>

          {/* ── 4. End of article — only when a specific tool is linked ──── */}
          {hasTool && (
            <div
              style={{
                marginTop:    '56px',
                paddingTop:   '40px',
                borderTop:    '0.5px solid rgba(255,255,255,0.06)',
              }}
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontStyle:  'italic',
                  fontSize:   '20px',
                  lineHeight: 1.5,
                  color:      'rgba(255,255,255,0.72)',
                  margin:     '0 0 20px',
                  textWrap:   'pretty',
                }}
              >
                This is what {article.toolCta!.label.replace(/^Try\s+/i, '')} was built for.
              </p>
              <Link
                href={article.toolCta!.href}
                className="article-end-cta-btn"
                style={{
                  display:        'inline-flex',
                  alignItems:     'center',
                  padding:        '10px 24px',
                  borderRadius:   '4px',
                  border:         `0.5px solid ${ctaAccent.replace('1)', '0.28)')}`,
                  background:     ctaAccentBg,
                  fontFamily:     "'Jost', sans-serif",
                  fontWeight:     400,
                  fontSize:       '12px',
                  letterSpacing:  '0.12em',
                  textTransform:  'uppercase',
                  color:          ctaAccent,
                  textDecoration: 'none',
                  whiteSpace:     'nowrap',
                  maxWidth:       '100%',
                }}
              >
                {article.toolCta!.label} →
              </Link>
            </div>
          )}

          {/* ── 5. Related articles ───────────────────────────────────────── */}
          <RelatedArticles articles={related} />

          {/* ── 6. Back to Lab ────────────────────────────────────────────── */}
          <div style={{ marginTop: '64px', textAlign: 'center' }}>
            <Link href="/lab" className="article-back-link">
              <span className="article-back-arrow">←</span>
              The Lab
            </Link>
          </div>

        </div>
      </BgFlat>
    </PageShell>
  )
}
