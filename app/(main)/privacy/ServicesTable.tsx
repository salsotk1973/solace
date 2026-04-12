'use client'

const SERVICES = [
  {
    name: 'Clerk',
    href: 'https://clerk.com/privacy',
    desc: 'handles your account login and authentication. They never see your session content.',
  },
  {
    name: 'Supabase',
    href: 'https://supabase.com/privacy',
    desc: 'Supabase — stores your session history and account data securely.',
  },
  {
    name: 'Vercel',
    href: 'https://vercel.com/legal/privacy-policy',
    desc: 'hosts the Solace platform and processes web requests. They log standard request data such as IP addresses.',
  },
  {
    name: 'Stripe',
    href: 'https://stripe.com/privacy',
    desc: 'processes payments if you upgrade to Pro. We never see or store your card details — Stripe handles all payment data directly.',
  },
  {
    name: 'OpenAI',
    href: 'https://openai.com/privacy',
    desc: "the three AI-powered tools (Clear Your Mind, Choose, and Break It Down) send your input to OpenAI to generate responses. We do not store the content of these conversations beyond your session. OpenAI's privacy policy governs this processing.",
  },
  {
    name: 'Brevo',
    href: 'https://www.brevo.com/legal/privacypolicy',
    desc: "sends the Lab newsletter if you subscribed. Your email address is stored in Brevo's system.",
  },
]

export default function ServicesTable() {
  return (
    <ul style={{ paddingLeft: 0, margin: '0 0 20px', listStyle: 'none' }}>
      {SERVICES.map(s => (
        <li key={s.name} style={{ marginBottom: '14px', paddingLeft: '16px', borderLeft: '1px solid rgba(185,175,225,0.12)' }}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontWeight:     400,
              color:          'rgba(185,175,225,0.85)',
              textDecoration: 'none',
              borderBottom:   '0.5px solid rgba(185,175,225,0)',
              transition:     'border-color 200ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderBottomColor = 'rgba(185,175,225,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.borderBottomColor = 'rgba(185,175,225,0)' }}
          >
            {s.name}
          </a>
          {' '}— {s.desc}
        </li>
      ))}
    </ul>
  )
}
