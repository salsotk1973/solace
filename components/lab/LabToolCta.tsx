import Link from 'next/link'
import type { LabArticle } from '@/lib/lab'

const CATEGORY_ACCENT: Record<LabArticle['category'], string> = {
  'calm-your-state':   'rgba(68,200,110,1)',
  'think-clearly':     'rgba(99,129,228,1)',
  'notice-whats-good': 'rgba(218,148,48,1)',
}

interface Props {
  label:    string
  href:     string
  category: LabArticle['category']
}

export default function LabToolCta({ label, href, category }: Props) {
  const accent = CATEGORY_ACCENT[category]
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
          fontFamily:    "'DM Sans', sans-serif",
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
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize:   '13px',
          lineHeight: 1.72,
          color:      'rgba(135,128,178,0.52)',
          margin:     '0 0 24px',
        }}
      >
        Free to use. No account needed.
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
          fontFamily:     "'DM Sans', sans-serif",
          fontWeight:     400,
          fontSize:       '12px',
          letterSpacing:  '0.12em',
          textTransform:  'uppercase',
          color:          accent,
          textDecoration: 'none',
        }}
      >
        Try it free →
      </Link>
    </div>
  )
}
