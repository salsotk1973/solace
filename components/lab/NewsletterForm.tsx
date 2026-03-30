'use client'

import { useState } from 'react'

export default function NewsletterForm() {
  const [email,     setEmail]     = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)

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
        You're in. See you next week.
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display:   'flex',
        gap:       '10px',
        maxWidth:  '440px',
        width:     '100%',
        flexWrap:  'wrap' as const,
      }}
    >
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{
          flex:          1,
          minWidth:      '200px',
          padding:       '12px 18px',
          borderRadius:  '4px',
          border:        '0.5px solid rgba(110,95,180,0.2)',
          background:    'rgba(255,255,255,0.03)',
          fontFamily:    "'DM Sans', sans-serif",
          fontWeight:    300,
          fontSize:      '13px',
          color:         'rgba(200,192,235,0.8)',
          outline:       'none',
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          padding:       '12px 24px',
          borderRadius:  '4px',
          border:        '0.5px solid rgba(148,130,210,0.25)',
          background:    'rgba(148,130,210,0.08)',
          fontFamily:    "'DM Sans', sans-serif",
          fontWeight:    400,
          fontSize:      '12px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color:         loading ? 'rgba(148,130,210,0.3)' : 'rgba(168,152,228,0.65)',
          cursor:        loading ? 'default' : 'pointer',
          transition:    'all 0.3s ease',
          whiteSpace:    'nowrap' as const,
        }}
      >
        {loading ? '...' : 'Subscribe'}
      </button>
    </form>
  )
}
