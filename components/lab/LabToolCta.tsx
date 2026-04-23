import Link from 'next/link'
import type { LabArticle } from '@/lib/lab'
import { getLabCategoryRgb, getToolRgb, TOOL_CATEGORY } from '@/lib/design-tokens'

interface Props {
  label:     string
  href:      string
  category:  LabArticle['category']
  toolSlug?: string   // when present, drives colour from tool token instead of category
  subtitle?: string   // override the default "Free to use. No account needed." copy
}

// Map URL path segments to TOOL_CATEGORY slugs
const PATH_TO_SLUG: Record<string, string> = {
  'clear-your-mind': 'clear',
  'choose':          'choose',
  'break-it-down':   'breakdown',
  'breathing':       'breathing',
  'sleep':           'sleep',
  'focus':           'focus',
  'mood':            'mood',
  'gratitude':       'gratitude',
}

function resolveSlug(href: string): string | null {
  const segment = href.replace(/^\/tools\//, '').replace(/^\//, '')
  return PATH_TO_SLUG[segment] ?? null
}

export default function LabToolCta({ label, href, category, toolSlug, subtitle }: Props) {
  // Resolve tool slug from href if not explicitly passed
  const slug = toolSlug ?? resolveSlug(href)

  // Hide card when no specific tool is linked (e.g. href="/tools")
  if (!slug || !(slug in TOOL_CATEGORY)) return null

  const _rgb   = getToolRgb(slug).replace(/, /g, ',')
  const accent = `rgba(${_rgb},1)`
  const accentDim    = accent.replace('1)', '0.45)')
  const accentBorder = accent.replace('1)', '0.18)')
  const accentBg     = accent.replace('1)', '0.08)')
  const accentShimmer= accent.replace('1)', '0.2)')

  const toolName = label.replace(/^Try\s+/i, '')

  return (
    <div
      style={{
        margin:       '48px 0',
        padding:      '36px 40px',
        borderRadius: '16px',
        background:   'linear-gradient(145deg, #0d0b1e, #090714, #0e0b1d)',
        border:       `0.5px solid ${accentBorder}`,
        position:     'relative',
        overflow:     'hidden',
        boxSizing:    'border-box',
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
          background:    `linear-gradient(90deg, transparent, ${accentShimmer}, transparent)`,
          pointerEvents: 'none',
        }}
      />

      {/* Eyebrow */}
      <p
        style={{
          fontFamily:    "'Jost', sans-serif",
          fontWeight:    400,
          fontSize:      '10px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color:         accentDim,
          margin:        '0 0 12px',
        }}
      >
        Try it yourself
      </p>

      {/* Tool name */}
      <h3
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize:   '26px',
          lineHeight: 1.2,
          color:      'rgba(235,228,255,0.9)',
          margin:     '0 0 10px',
        }}
      >
        {toolName}
      </h3>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: "'Jost', sans-serif",
          fontWeight: 300,
          fontSize:   '13px',
          lineHeight: 1.72,
          color:      'rgba(255,255,255,0.65)',
          margin:     '0 0 24px',
        }}
      >
        {subtitle ?? 'Free to use. No account needed.'}
      </p>

      {/* CTA button */}
      <Link
        href={href}
        style={{
          display:        'inline-flex',
          alignItems:     'center',
          padding:        '10px 24px',
          borderRadius:   '4px',
          border:         `0.5px solid ${accent.replace('1)', '0.28)')}`,
          background:     accentBg,
          fontFamily:     "'Jost', sans-serif",
          fontWeight:     400,
          fontSize:       '12px',
          letterSpacing:  '0.12em',
          textTransform:  'uppercase',
          color:          accent,
          textDecoration: 'none',
        }}
      >
        {label} →
      </Link>
    </div>
  )
}
