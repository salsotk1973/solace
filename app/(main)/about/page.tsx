import { Metadata } from 'next'
import PageShell from '@/components/PageShell'
import {
  TEXT_COLOURS,
  FONT_SIZE,
  CATEGORY_COLOURS,
  getToolColour,
  glassBackground,
  glassBorder,
} from '@/lib/design-tokens'

export const metadata: Metadata = {
  title: 'About Solace — A calmer way to think clearly',
  description: 'Solace is a private digital space to help you think more clearly, make decisions with less noise, and check in with yourself — without judgment.',
}

const cards = [
  {
    slug: 'breathing',
    heading: 'Private by design',
    body: 'Nothing you write in Solace is shared, sold, or used to train anything. Your sessions are yours. They stay with you, or they disappear when you close the tab.',
  },
  {
    slug: 'choose',
    heading: 'Not a replacement for support',
    body: "Solace is a thinking tool — not a substitute for therapy, medical care, or talking to someone you trust. If you're going through something serious, please reach out to a professional.",
  },
  {
    slug: 'focus',
    heading: 'Built without noise',
    body: 'No notifications. No streaks that guilt you. No leaderboards. Just a few simple tools designed to slow things down, not speed them up.',
  },
]

export default function AboutPage() {
  return (
    <PageShell>
      <div style={{
        width: '100%',
        maxWidth: 1100,
        margin: '0 auto',
        padding: '120px 40px 120px',
        boxSizing: 'border-box',
      }}>

        {/* Eyebrow pill */}
        <div style={{
          display: 'inline-flex',
          padding: '6px 16px',
          borderRadius: 999,
          border: `0.5px solid rgba(${CATEGORY_COLOURS.clarity.rgb}, 0.25)`,
          background: `rgba(${CATEGORY_COLOURS.clarity.rgb}, 0.08)`,
          fontFamily: "'Jost', sans-serif",
          fontWeight: 400,
          fontSize: `${FONT_SIZE.eyebrow}px`,
          letterSpacing: '0.22em',
          textTransform: 'uppercase' as const,
          color: CATEGORY_COLOURS.clarity.hex,
          margin: '0 0 24px',
        }}>
          About Solace
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize: 'clamp(40px, 5.5vw, 68px)',
          lineHeight: 1.12,
          letterSpacing: '-0.02em',
          color: TEXT_COLOURS.primary,
          margin: '0 0 28px',
          maxWidth: 700,
        }}>
          A quieter place<br />
          to think things through.
        </h1>

        {/* Intro paragraph */}
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontWeight: 300,
          fontSize: `${FONT_SIZE.body}px`,
          lineHeight: 1.8,
          color: TEXT_COLOURS.body,
          margin: '0 0 64px',
          maxWidth: 580,
        }}>
          Solace exists for the moments when your mind won&apos;t settle — when you have a decision to make, a feeling you can&apos;t name, or a thought that keeps circling. It&apos;s not a therapy app. It&apos;s not a productivity dashboard. It&apos;s a private space to think more clearly, at your own pace, without judgment.
        </p>

        {/* 3 info cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
          marginBottom: 64,
        }}>
          {cards.map(card => (
            <div key={card.heading} style={{
              borderRadius: 14,
              padding: '28px 28px 24px',
              background: glassBackground(card.slug, 0.07),
              border: `0.5px solid ${glassBorder(card.slug, 0.18)}`,
              borderTop: `2px solid ${getToolColour(card.slug)}`,
              boxSizing: 'border-box',
            }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: 22,
                lineHeight: 1.2,
                color: TEXT_COLOURS.primary,
                margin: '0 0 14px',
              }}>
                {card.heading}
              </h2>
              <p style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 300,
                fontSize: `${FONT_SIZE.body}px`,
                lineHeight: 1.75,
                color: TEXT_COLOURS.body,
                margin: 0,
              }}>
                {card.body}
              </p>
            </div>
          ))}
        </div>

        {/* Who is Solace for? */}
        <div style={{
          maxWidth: 640,
          borderRadius: 14,
          padding: '32px 36px',
          background: glassBackground('choose', 0.05),
          border: `0.5px solid ${glassBorder('choose', 0.15)}`,
          borderTop: `2px solid ${CATEGORY_COLOURS.decide.hex}`,
          marginBottom: 64,
        }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 26,
            lineHeight: 1.2,
            color: TEXT_COLOURS.primary,
            margin: '0 0 16px',
          }}>
            Who is Solace for?
          </h2>
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 300,
            fontSize: `${FONT_SIZE.body}px`,
            lineHeight: 1.8,
            color: TEXT_COLOURS.body,
            margin: '0 0 16px',
          }}>
            People who feel overwhelmed by decisions. People who can&apos;t sleep because their mind won&apos;t stop. People who want to check in with themselves but don&apos;t know where to start. People who&apos;ve tried journalling and given up. People who just need a moment of quiet.
          </p>
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 300,
            fontSize: `${FONT_SIZE.body}px`,
            lineHeight: 1.8,
            color: TEXT_COLOURS.body,
            margin: 0,
          }}>
            If any of that sounds familiar — you&apos;re in the right place.
          </p>
        </div>

        {/* Disclaimer */}
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontWeight: 300,
          fontSize: `${FONT_SIZE.metadata}px`,
          lineHeight: 1.7,
          color: TEXT_COLOURS.secondary,
          margin: 0,
          maxWidth: 560,
        }}>
          Solace is designed for adults only. It provides reflective support — not medical, psychological, legal, financial, or professional advice. If you are in crisis or need immediate support, please contact a qualified professional or crisis service in your area.
        </p>

      </div>
    </PageShell>
  )
}
