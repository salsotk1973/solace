'use client'

import Link from 'next/link'

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

export default function SiteFooter() {
  return (
    <>
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 28px; }
        }
        @media (max-width: 400px) {
          .footer-grid { grid-template-columns: 1fr; gap: 24px; }
        }
        .footer-bottom-bar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        @media (max-width: 640px) {
          .footer-bottom-bar { flex-direction: column; gap: 12px; }
        }
      `}</style>

      <footer
        style={{
          width:                '100%',
          background:           'rgba(255, 255, 255, 0.04)',
          backdropFilter:       'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          position:             'relative',
          zIndex:               10,
        }}
      >
        {/* Nav columns */}
        <div
          style={{
            maxWidth:  '1440px',
            margin:    '0 auto',
            padding:   '56px 40px 40px',
            boxSizing: 'border-box',
          }}
        >
          <div className="footer-grid">
            {FOOTER_NAV.map(col => (
              <div key={col.heading}>
                <p
                  style={{
                    fontFamily:    "'Jost', sans-serif",
                    fontWeight:    400,
                    fontSize:      '10px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color:         'rgba(255,255,255,0.35)',
                    margin:        '0 0 14px',
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
                          fontFamily:     "'Jost', sans-serif",
                          fontWeight:     300,
                          fontSize:       '13px',
                          color:          'rgba(255,255,255,0.60)',
                          textDecoration: 'none',
                          transition:     'color 200ms ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.90)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.60)')}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider + bottom bar */}
        <div
          style={{
            maxWidth:  '1440px',
            margin:    '0 auto',
            padding:   '0 40px 32px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.08)', marginBottom: '20px' }} />

          <div className="footer-bottom-bar">
            <p
              style={{
                fontFamily:  "'Jost', sans-serif",
                fontWeight:  300,
                fontSize:    '11px',
                lineHeight:  1.7,
                color:       'rgba(255,255,255,0.40)',
                margin:      0,
                maxWidth:    '560px',
              }}
            >
              Solace is designed for adults only. It provides reflective support — not medical, psychological, legal, financial, or professional advice.
            </p>
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 300,
                fontSize:   '11px',
                color:      'rgba(255,255,255,0.35)',
                margin:     0,
                flexShrink: 0,
              }}
            >
              Built with care.
            </p>
          </div>

          <p
            style={{
              fontFamily:  "'Jost', sans-serif",
              fontWeight:  300,
              fontSize:    '11px',
              color:       'rgba(255,255,255,0.28)',
              margin:      '14px 0 0',
            }}
          >
            © 2026 Solace. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
