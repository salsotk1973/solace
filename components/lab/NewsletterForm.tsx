'use client'

import { useState } from 'react'

export default function NewsletterForm() {
  const [email,          setEmail]          = useState('')
  const [submitted,      setSubmitted]      = useState(false)
  const [loading,        setLoading]        = useState(false)
  const [btnHovered,     setBtnHovered]     = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await fetch('/api/newsletter', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      setSubmitted(true)
    } catch {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontStyle:  'italic',
          fontSize:   'clamp(18px, 2vw, 22px)',
          color:      'rgba(192,178,240,0.7)',
          margin:     0,
          textAlign:  'center',
        }}
      >
        You&apos;re in. See you next week.
      </p>
    )
  }

  return (
    <>
      <style>{`
        .newsletter-form {
          display:   flex;
          gap:       10px;
          width:     100%;
          flex-wrap: wrap;
        }
        .newsletter-form input  { flex: 1; min-width: 180px; }
        .newsletter-form button { flex-shrink: 0; }
        .newsletter-form input::placeholder {
          color: rgba(255, 255, 255, 0.65);
        }

        @media (max-width: 480px) {
          .newsletter-form         { flex-direction: column; gap: 8px; }
          .newsletter-form input   { width: 100%; min-width: unset; flex: none; }
          .newsletter-form button  { width: 100%; }
        }
      `}</style>

      <form onSubmit={handleSubmit} className="newsletter-form">
        <input
          type="email"
          required
          placeholder="enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            padding:      '12px 18px',
            borderRadius: '100px',
            border:       '0.5px solid rgba(110,95,180,0.2)',
            background:   'rgba(255,255,255,0.03)',
            fontFamily:   "'Jost', sans-serif",
            fontWeight:   300,
            fontSize:     '14px',
            color:        'rgba(200,192,235,0.8)',
            outline:      'none',
            boxSizing:    'border-box',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          onMouseEnter={() => !loading && setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            padding:       '12px 28px',
            borderRadius:  '100px',
            border:        `0.5px solid ${btnHovered && !loading ? 'rgba(148,130,210,0.48)' : 'rgba(148,130,210,0.22)'}`,
            background:    btnHovered && !loading ? 'rgba(148,130,210,0.16)' : 'rgba(148,130,210,0.06)',
            fontFamily:    "'Jost', sans-serif",
            fontWeight:    400,
            fontSize:      '12px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color:         loading
              ? 'rgba(148,130,210,0.3)'
              : btnHovered
                ? 'rgba(210,200,252,0.95)'
                : 'rgba(168,152,228,0.65)',
            cursor:        loading ? 'default' : 'pointer',
            boxShadow:     btnHovered && !loading
              ? '0 0 24px rgba(148,130,210,0.18)'
              : 'none',
            transition:    'border-color 0.3s ease, background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
            whiteSpace:    'nowrap' as const,
            boxSizing:     'border-box',
          }}
        >
          {loading ? '...' : 'Subscribe'}
        </button>
      </form>
    </>
  )
}
