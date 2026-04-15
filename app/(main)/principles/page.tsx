import { Metadata } from 'next'
import PageShell from '@/components/PageShell'
import { TEXT_COLOURS, FONT_SIZE, CATEGORY_COLOURS } from '@/lib/design-tokens'

export const metadata: Metadata = {
  title: 'Principles — How Solace thinks about mental clarity',
  description: 'The ideas behind Solace: why calm design helps people think more clearly, make better decisions, and feel less overwhelmed. Simple principles for a quieter mind.',
}

const principles = [
  {
    number: '01',
    colour: CATEGORY_COLOURS.calm.hex,
    heading: 'One thing at a time',
    body: "Overwhelm doesn't come from having too much to do. It comes from trying to hold everything in your head at once. Solace is built around a single idea: narrow your attention to one thing, and clarity follows. Every tool in Solace focuses on one question, one moment, one breath.",
  },
  {
    number: '02',
    colour: CATEGORY_COLOURS.clarity.hex,
    heading: 'The atmosphere changes how you think',
    body: "A cluttered, noisy interface raises your cortisol before you've typed a single word. Soft contrast, breathing room, and quiet design help your nervous system stay open instead of defensive. Solace is dark, calm, and unhurried — because the environment is part of the thinking.",
  },
  {
    number: '03',
    colour: CATEGORY_COLOURS.decide.hex,
    heading: 'Reflection before response',
    body: "Most digital tools push you toward speed — more inputs, faster outputs, instant answers. Solace does the opposite. It asks you to slow down, write something honest, and sit with it for a moment. The goal isn't a quick answer. It's a clearer one.",
  },
  {
    number: '04',
    colour: CATEGORY_COLOURS.calm.hex,
    heading: "Privacy is not a feature — it's the foundation",
    body: "When you're writing about what's actually bothering you, you need to know nobody is watching. Solace does not sell your data, share it, or use it to train models. Your sessions are private by default. You can delete them. They belong to you.",
  },
  {
    number: '05',
    colour: CATEGORY_COLOURS.clarity.hex,
    heading: 'Gentleness is not weakness',
    body: "A calm interface doesn't mean a soft product. Solace is designed to help you face hard things — decisions you've been avoiding, feelings you haven't named, thoughts that circle at 2am. It meets you gently because that's what actually works. Not because it's trying to coddle you.",
  },
  {
    number: '06',
    colour: CATEGORY_COLOURS.decide.hex,
    heading: 'No guilt, no streaks, no pressure',
    body: "Come back every day. Come back once a month. Come back when things fall apart. Solace doesn't track your consistency or remind you that you've been absent. It's here when you need it — and quiet when you don't.",
  },
]

export default function PrinciplesPage() {
  return (
    <PageShell>
      <div style={{
        width: '100%',
        maxWidth: 1100,
        margin: '0 auto',
        padding: '120px 40px 120px',
        boxSizing: 'border-box',
      }}>

        {/* Eyebrow */}
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontWeight: 400,
          fontSize: `${FONT_SIZE.eyebrow}px`,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: TEXT_COLOURS.secondary,
          margin: '0 0 24px',
        }}>
          How Solace thinks
        </p>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize: 'clamp(40px, 5.5vw, 68px)',
          lineHeight: 1.12,
          letterSpacing: '-0.02em',
          color: TEXT_COLOURS.primary,
          margin: '0 0 24px',
          maxWidth: 700,
        }}>
          The principles behind<br />
          a quieter mind.
        </h1>

        {/* Subheading */}
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontWeight: 300,
          fontSize: `${FONT_SIZE.body}px`,
          lineHeight: 1.8,
          color: TEXT_COLOURS.body,
          margin: '0 0 80px',
          maxWidth: 560,
        }}>
          These are the ideas that shaped every decision in Solace — how it looks, how it works, and what it refuses to do.
        </p>

        {/* Principles list */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}>
          {principles.map(p => (
            <div key={p.number} style={{
              display: 'grid',
              gridTemplateColumns: '64px 1fr',
              gap: 32,
              padding: '36px 0 36px 24px',
              borderTop: '0.5px solid rgba(255,255,255,0.07)',
              borderLeft: `2px solid ${p.colour}`,
              marginLeft: -24,
              alignItems: 'start',
            }}>
              {/* Number */}
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: 32,
                lineHeight: 1,
                color: p.colour,
                margin: '4px 0 0',
                opacity: 0.9,
              }}>
                {p.number}
              </p>
              {/* Content */}
              <div>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: 'clamp(22px, 2.5vw, 30px)',
                  lineHeight: 1.15,
                  color: TEXT_COLOURS.primary,
                  margin: '0 0 16px',
                }}>
                  {p.heading}
                </h2>
                <p style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 300,
                  fontSize: `${FONT_SIZE.body}px`,
                  lineHeight: 1.8,
                  color: TEXT_COLOURS.body,
                  margin: 0,
                  maxWidth: 640,
                }}>
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom disclaimer */}
        <div style={{
          marginTop: 4,
          padding: '32px 28px',
          borderRadius: 14,
          background: 'rgba(255,255,255,0.02)',
          border: '0.5px solid rgba(255,255,255,0.06)',
        }}>
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 300,
            fontSize: `${FONT_SIZE.metadata}px`,
            lineHeight: 1.7,
            color: TEXT_COLOURS.secondary,
            margin: 0,
            maxWidth: 560,
          }}>
            Solace is not a medical product. It provides reflective support only. If you are going through something serious, please reach out to a qualified professional.
          </p>
        </div>

      </div>
    </PageShell>
  )
}
