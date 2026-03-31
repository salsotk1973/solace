'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Props {
  href:  string
  label: string   // text only — arrow is rendered internally and animated
}

/**
 * Ghost-pill CTA button with animated arrow.
 * This is the GLOBAL STANDARD for all arrow CTA buttons:
 *   → arrow slides translateX(4px) on hover, returns on mouse-out
 *   → 0.35s cubic-bezier(0.22,1,0.36,1) easing
 *   → background darkens, text brightens, blue glow
 * For CSS-driven contexts use .arrow-link + .arrow classes (globals.css).
 */
export default function LabCtaButton({ href, label }: Props) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        gap:            '10px',
        padding:        '14px 40px',
        borderRadius:   '100px',
        border:         `0.5px solid ${hovered ? 'rgba(68,138,228,0.52)' : 'rgba(68,138,228,0.28)'}`,
        background:     hovered ? 'rgba(68,138,228,0.18)' : 'rgba(68,138,228,0.07)',
        fontFamily:     "'Jost', sans-serif",
        fontWeight:     400,
        fontSize:       '11px',
        letterSpacing:  '0.16em',
        color:          hovered ? 'rgba(148,196,252,0.98)' : 'rgba(120,175,240,0.70)',
        textDecoration: 'none',
        boxShadow:      hovered
          ? '0 0 32px rgba(68,138,228,0.28), 0 0 8px rgba(68,138,228,0.14)'
          : 'none',
        transition:     'border-color 0.3s ease, background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
        position:       'relative',
        zIndex:         1,
      }}
    >
      <span>{label}</span>
      <span
        style={{
          display:    'inline-block',
          lineHeight: 1,
          transform:  hovered ? 'translateX(4px)' : 'translateX(0)',
          transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        →
      </span>
    </Link>
  )
}
