'use client'

import Link from 'next/link'

// ─── Footer nav data ──────────────────────────────────────────────────────────

const FOOTER_NAV = [
  {
    heading: 'Product',
    links: [
      { label: 'Tools',     href: '/tools'     },
      { label: 'Pricing',   href: '/pricing'   },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    heading: 'Learn',
    links: [
      { label: 'Lab',        href: '/lab'        },
      { label: 'Principles', href: '/principles' },
      { label: 'About',      href: '/about'      },
      { label: 'Scope',      href: '/scope'      },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy'  },
      { label: 'Terms',   href: '/terms'    },
      { label: 'Sign in', href: '/sign-in'  },
    ],
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function SiteFooter() {
  return (
    <footer
      style={{
        width:      '100%',
        background: 'rgba(8,10,18,0.95)',
        borderTop:  '0.5px solid rgba(255,255,255,0.07)',
        position:   'relative',
        zIndex:     10,
      }}
    >
      {/* ── ROW 1: Navigation columns ───────────────────────────────────────── */}
      <div
        style={{
          maxWidth:  '1100px',
          margin:    '0 auto',
          padding:   '64px 40px 48px',
          display:   'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap:       '40px',
          boxSizing: 'border-box',
        }}
      >
        {FOOTER_NAV.map(col => (
          <div key={col.heading}>
            <p
              style={{
                fontFamily:    "'DM Sans', sans-serif",
                fontWeight:    400,
                fontSize:      '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color:         'rgba(255,255,255,0.42)',
                margin:        '0 0 16px',
              }}
            >
              {col.heading}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {col.links.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      fontFamily:     "'DM Sans', sans-serif",
                      fontWeight:     300,
                      fontSize:       '14px',
                      color:          'rgba(255,255,255,0.8)',
                      textDecoration: 'none',
                      transition:     'color 200ms ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,1)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div
        style={{
          maxWidth:  '1100px',
          margin:    '0 auto',
          padding:   '0 40px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.07)' }} />
      </div>

      {/* ── ROW 2: Legal disclaimer ──────────────────────────────────────────── */}
      <div
        style={{
          maxWidth:  '1100px',
          margin:    '0 auto',
          padding:   '24px 40px',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize:   '13px',
            lineHeight: 1.7,
            color:      'rgba(255,255,255,0.75)',
            margin:     0,
          }}
        >
          Solace is designed for adults only. It provides reflective support — not medical, psychological, legal, financial, or professional advice.
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          maxWidth:  '1100px',
          margin:    '0 auto',
          padding:   '0 40px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.05)' }} />
      </div>

      {/* ── ROW 3: Copyright bar ─────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth:       '1100px',
          margin:         '0 auto',
          padding:        '20px 40px',
          boxSizing:      'border-box',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          flexWrap:       'wrap',
          gap:            '8px',
        }}
      >
        <p
          style={{
            fontFamily:    "'DM Sans', sans-serif",
            fontWeight:    300,
            fontSize:      '11px',
            letterSpacing: '0.02em',
            color:         'rgba(255,255,255,0.6)',
            margin:        0,
          }}
        >
          © 2026 Solace. All rights reserved.
        </p>
        <p
          style={{
            fontFamily:    "'DM Sans', sans-serif",
            fontWeight:    300,
            fontSize:      '11px',
            letterSpacing: '0.02em',
            color:         'rgba(255,255,255,0.6)',
            margin:        0,
          }}
        >
          Built with care.
        </p>
      </div>
    </footer>
  )
}
