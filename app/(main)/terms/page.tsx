import type { Metadata } from 'next'
import PageShell from '@/components/PageShell'
import { TEXT_COLOURS, FONT_SIZE } from '@/lib/design-tokens'

export const metadata: Metadata = {
  title: 'Terms of Use | Solace',
  description: 'The honest version of our terms. Plain English, no legal fog.',
}

// ─── Section component ────────────────────────────────────────────────────────

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section style={{
      marginBottom: '48px',
      paddingLeft:  '20px',
      borderLeft:   '2px solid rgba(124, 111, 205, 0.35)',
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

export default function TermsPage() {
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
            Terms of Use
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
            The honest version.
          </p>
        </header>

        {/* Divider */}
        <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.07)', marginBottom: '56px' }} />

        {/* Sections */}
        <Section number="01" title="What Solace is">
          <p style={{ margin: 0 }}>
            Solace is a digital wellness tool designed for adults (18+). It provides
            reflective support — not medical, psychological, legal, financial, or professional
            advice. It is not a substitute for therapy or professional care. If you&apos;re
            in crisis, please contact a qualified professional or emergency service.
          </p>
        </Section>

        <Section number="02" title="Your account">
          <p style={{ margin: '0 0 14px' }}>
            You&apos;re responsible for keeping your account credentials secure. One account per person — accounts are not transferable.
          </p>
          <p style={{ margin: 0 }}>
            If you suspect unauthorised access to your account, contact us immediately at{' '}
            <a
              href="mailto:legal@try-solace.app"
              style={{ color: 'rgba(185,175,225,0.85)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              legal@try-solace.app
            </a>.
          </p>
        </Section>

        <Section number="03" title="Payments and refunds">
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              Subscriptions are billed monthly or annually, depending on the plan you choose.
            </li>
            <li style={{ marginBottom: '10px' }}>
              You can cancel any time — your access continues until the end of the billing period.
            </li>
            <li style={{ marginBottom: '10px' }}>
              Changed your mind within 7 days of upgrading? Contact us for a full refund. No questions asked.
            </li>
          </ul>
        </Section>

        <Section number="04" title="Acceptable use">
          <p style={{ margin: '0 0 14px' }}>
            Solace is for personal use only. You agree not to:
          </p>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={{ marginBottom: '10px' }}>Use Solace in ways that harm or deceive others.</li>
            <li style={{ marginBottom: '10px' }}>Attempt to access other users&apos; data.</li>
            <li style={{ marginBottom: '10px' }}>Use Solace for any unlawful purpose.</li>
          </ul>
        </Section>

        <Section number="05" title="Limitation of liability">
          <p style={{ margin: '0 0 14px' }}>
            We do our best to keep Solace running reliably, but we can&apos;t guarantee
            uninterrupted service.
          </p>
          <p style={{ margin: 0 }}>
            Solace is not liable for decisions you make based on content in the app.
            The tools are designed to help you think — not to think for you.
          </p>
        </Section>

        <Section number="06" title="Changes">
          <p style={{ margin: 0 }}>
            We&apos;ll notify you of any significant changes to these terms — either by
            email or a notice in the app. Continuing to use Solace after that notification
            means you accept the updated terms.
          </p>
        </Section>

        <Section number="07" title="Contact">
          <p style={{ margin: 0 }}>
            Legal questions?{' '}
            <a
              href="mailto:legal@try-solace.app"
              style={{ color: 'rgba(185,175,225,0.85)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              legal@try-solace.app
            </a>
            {' '}— we&apos;ll get back to you.
          </p>
        </Section>
      </div>
    </PageShell>
  )
}
