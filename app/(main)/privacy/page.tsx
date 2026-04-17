import type { Metadata } from 'next'
import ServicesTable from './ServicesTable'
import PageShell from '@/components/PageShell'
import { TEXT_COLOURS, FONT_SIZE } from '@/lib/design-tokens'

export const metadata: Metadata = {
  title: 'Privacy Policy | Solace',
  description: 'How Solace handles your data. Simple, honest, no surprises.',
}

// ─── Section component ────────────────────────────────────────────────────────

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section style={{
      marginBottom: '48px',
      paddingLeft:  '20px',
      borderLeft:   '2px solid rgba(60, 192, 212, 0.35)',
    }}>
      <p
        style={{
          fontFamily:    "'Jost', sans-serif",
          fontWeight:    400,
          fontSize:      `${FONT_SIZE.eyebrow}px`,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color:         TEXT_COLOURS.secondary,
          margin:        '0 0 10px',
        }}
      >
        {number}
      </p>
      <h2
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize:   'clamp(22px, 2.5vw, 30px)',
          lineHeight: 1.2,
          color:      'rgba(235,228,255,0.92)',
          margin:     '0 0 20px',
        }}
      >
        {title}
      </h2>
      <div
        style={{
          fontFamily: "'Jost', sans-serif",
          fontWeight: 300,
          fontSize:   `${FONT_SIZE.body}px`,
          lineHeight: 1.85,
          color:      TEXT_COLOURS.body,
        }}
      >
        {children}
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PrivacyPage() {
  return (
    <PageShell style={{ color: 'rgba(225,218,252,0.85)' }}>
      <div
        style={{
          maxWidth:  '680px',
          margin:    '0 auto',
          padding:   '140px 40px 100px',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <header style={{ marginBottom: '64px' }}>
          <p
            style={{
              fontFamily:    "'Jost', sans-serif",
              fontWeight:    400,
              fontSize:      `${FONT_SIZE.eyebrow}px`,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color:         TEXT_COLOURS.secondary,
              margin:        '0 0 20px',
            }}
          >
            Last updated March 2026
          </p>
          <h1
            style={{
              fontFamily:    "'Cormorant Garamond', serif",
              fontWeight:    300,
              fontSize:      'clamp(36px, 4.5vw, 52px)',
              lineHeight:    1.1,
              color:         'rgba(240,234,255,0.95)',
              margin:        '0 0 16px',
            }}
          >
            Privacy Policy
          </h1>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              fontSize:   `${FONT_SIZE.body}px`,
              lineHeight: 1.8,
              color:      TEXT_COLOURS.body,
              margin:     0,
            }}
          >
            We keep this simple because it should be.
          </p>
        </header>

        {/* Divider */}
        <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.07)', marginBottom: '56px' }} />

        {/* Sections */}
        <Section number="01" title="What we collect">
          <p style={{ margin: '0 0 14px' }}>
            We collect only what we need — nothing more.
          </p>
          <ul style={{ paddingLeft: '20px', margin: '0 0 14px' }}>
            <li style={{ marginBottom: '10px' }}>
              <strong style={{ fontWeight: 400, color: 'rgba(220,215,245,0.9)' }}>Email address</strong> — when you create an account.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong style={{ fontWeight: 400, color: 'rgba(220,215,245,0.9)' }}>Usage data</strong> — which tools you use and session completions. This is how Solace learns to help you over time.
            </li>
          </ul>
          <p style={{ margin: 0 }}>
            We do not sell your data. Ever. Full stop.
          </p>
        </Section>

        <Section number="02" title="How we use it">
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              To save your session history and show you patterns over time (paid accounts).
            </li>
            <li style={{ marginBottom: '10px' }}>
              To send you the Lab newsletter — only if you subscribed. You can unsubscribe any time.
            </li>
            <li style={{ marginBottom: '10px' }}>
              To understand how people use the tools so we can improve them.
            </li>
          </ul>
        </Section>

        <Section number="03" title="Who we share it with">
          <p style={{ margin: '0 0 14px' }}>
            We use a small number of trusted services to run Solace:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '0 0 14px' }}>
            <li style={{ marginBottom: '10px' }}>
              <strong style={{ fontWeight: 400, color: 'rgba(220,215,245,0.9)' }}>Clerk</strong> — handles authentication securely.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong style={{ fontWeight: 400, color: 'rgba(220,215,245,0.9)' }}>Supabase</strong> — stores your session history and account data securely.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong style={{ fontWeight: 400, color: 'rgba(220,215,245,0.9)' }}>Stripe</strong> — processes payments if you upgrade. We never see your card details.
            </li>
          </ul>
          <p style={{ margin: 0 }}>
            No advertisers. No data brokers. No third-party analytics selling your behaviour.
          </p>
        </Section>

        <Section number="04" title="Services we use">
          <p style={{ margin: '0 0 20px' }}>
            Solace is built on a small set of trusted services. Here is who they are and what they do with your data:
          </p>
          <ServicesTable />
          <p style={{ margin: 0 }}>
            None of these services are permitted to sell your data. We selected each one because they meet high privacy and security standards.
          </p>
        </Section>

        <Section number="05" title="Your rights">
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={{ marginBottom: '10px' }}>You can request a copy of your data at any time.
            </li>
            <li style={{ marginBottom: '10px' }}>You can delete your account and all associated data.
            </li>
            <li style={{ marginBottom: '10px' }}>
              Solace complies with the <strong style={{ fontWeight: 400, color: 'rgba(220,215,245,0.9)' }}>Australian Privacy Act 1988</strong>.
            </li>
            <li style={{ marginBottom: '10px' }}>
              If you&apos;re in the EU, you have additional rights under <strong style={{ fontWeight: 400, color: 'rgba(220,215,245,0.9)' }}>GDPR</strong>.
            </li>
          </ul>
        </Section>

        <Section number="06" title="Contact">
          <p style={{ margin: 0 }}>
            Questions about your privacy?{' '}
            <a
              href="mailto:privacy@try-solace.app"
              style={{ color: 'rgba(185,175,225,0.85)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              privacy@try-solace.app
            </a>
            {' '}— we read every email.
          </p>
        </Section>
      </div>
    </PageShell>
  )
}
