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
          display: flex;
          justify-content: space-between;
          gap: 40px;
        }
        .footer-bottom-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .footer-bottom-disclaimer {
          flex: 1;
          text-align: center;
        }
        .footer-bottom-left,
        .footer-bottom-right {
          flex: 1;
        }
        .footer-bottom-right {
          text-align: right;
        }
        @media (max-width: 640px) {
          .footer-grid { flex-direction: column; gap: 28px; }
          .footer-bottom-bar { flex-direction: column; align-items: flex-start; gap: 10px; }
          .footer-bottom-disclaimer { text-align: left; }
          .footer-bottom-right { text-align: left; }
        }
      `}</style>

      <footer
        style={{
          width:    '100%',
          position: 'relative',
          zIndex:   10,
        }}
      >
        {/* Glass wrapper — matches header horizontal extent */}
        <div
          style={{
            margin:               '0 auto',
            maxWidth:             '1440px',
            padding:              '8px 24px 28px',
            background:           'linear-gradient(0deg, rgba(9,13,20,0.85) 0%, rgba(9,13,20,0.60) 50%, rgba(9,13,20,0.0) 100%)',
            backdropFilter:       'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          {/* Nav columns */}
          <div
            style={{
              padding:   '48px 16px 32px',
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
              padding:   '0 16px 16px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.08)', marginBottom: '20px' }} />

            <div className="footer-bottom-bar">
              <p
                className="footer-bottom-left"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 300,
                  fontSize:   '11px',
                  color:      'rgba(255,255,255,0.28)',
                  margin:     0,
                }}
              >
                © 2026 Solace. All rights reserved.
              </p>
              <p
                className="footer-bottom-disclaimer"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 300,
                  fontSize:   '11px',
                  lineHeight: 1.7,
                  color:      'rgba(255,255,255,0.40)',
                  margin:     0,
                  maxWidth:   '500px',
                  textAlign:  'center',
                }}
              >
                Solace is designed for adults only. It provides reflective support — not medical, psychological, legal, financial, or professional advice.
              </p>
              <p
                className="footer-bottom-right"
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
          </div>
        </div>
      </footer>
    </>
  )
}
