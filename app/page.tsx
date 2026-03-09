import Link from "next/link";

const entryCards = [
  {
    href: "/tools/clarity",
    eyebrow: "Decision clarity",
    title: "I can’t decide",
    description:
      "Untangle competing priorities and see what is actually making the decision feel heavy.",
    accent: "linear-gradient(135deg, rgba(107,139,170,0.18), rgba(107,139,170,0.04))",
  },
  {
    href: "/tools/overthinking-breaker",
    eyebrow: "Overthinking reset",
    title: "My mind won’t stop thinking",
    description:
      "Slow the loop, reduce repetition, and bring the real issue back into focus.",
    accent: "linear-gradient(135deg, rgba(156,175,164,0.18), rgba(156,175,164,0.04))",
  },
  {
    href: "/tools/decision-filter",
    eyebrow: "Noise reduction",
    title: "I need to filter the noise",
    description:
      "Separate what matters from what is only adding pressure and mental clutter.",
    accent: "linear-gradient(135deg, rgba(154,140,210,0.16), rgba(154,140,210,0.04))",
  },
];

export default function HomePage() {
  return (
    <main className="solace-shell section-space">
      <section
        style={{
          display: "grid",
          gap: "1.4rem",
          justifyItems: "center",
          textAlign: "center",
          paddingTop: "3.5rem",
          paddingBottom: "4.75rem",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.94rem",
            color: "var(--color-text-muted)",
            letterSpacing: "-0.01em",
          }}
        >
          Calm thinking tools for noisy moments
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(3rem, 8vw, 5.6rem)",
            lineHeight: 0.96,
            letterSpacing: "-0.07em",
            color: "var(--color-text)",
            maxWidth: "10ch",
          }}
        >
          A calm place to think clearly.
        </h1>

        <p
          style={{
            margin: 0,
            maxWidth: "40rem",
            fontSize: "1.08rem",
            lineHeight: 1.9,
            color: "var(--color-text-muted)",
          }}
        >
          Solace helps people slow down, untangle what feels heavy, and see
          their situation with greater clarity.
        </p>

        <div
          style={{
            display: "flex",
            gap: "0.85rem",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "0.35rem",
          }}
        >
          <Link
            href="/tools"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.98rem 1.45rem",
              borderRadius: "999px",
              background: "rgba(107,139,170,0.16)",
              color: "var(--color-text)",
              textDecoration: "none",
              fontSize: "0.98rem",
              lineHeight: 1,
              border: "1px solid rgba(107,139,170,0.12)",
              boxShadow: "var(--shadow-soft)",
              backdropFilter: "blur(8px)",
            }}
          >
            Enter the tools
          </Link>

          <Link
            href="/principles"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.98rem 1.45rem",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.68)",
              color: "var(--color-text)",
              textDecoration: "none",
              fontSize: "0.98rem",
              lineHeight: 1,
              border: "1px solid var(--color-border)",
            }}
          >
            Read the principles
          </Link>
        </div>
      </section>

      <section
        className="surface-card"
        style={{
          padding: "2.15rem",
          display: "grid",
          gap: "1.5rem",
          marginBottom: "2rem",
          background: "rgba(255,255,255,0.58)",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "0.9rem",
            maxWidth: "40rem",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.94rem",
              color: "var(--color-text-muted)",
            }}
          >
            Start gently
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: "clamp(2rem, 5vw, 3.3rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.055em",
              color: "var(--color-text)",
              maxWidth: "12ch",
            }}
          >
            What feels closest to what you’re experiencing right now?
          </h2>

          <p
            style={{
              margin: 0,
              maxWidth: "34rem",
              fontSize: "1.03rem",
              lineHeight: 1.85,
              color: "var(--color-text-muted)",
            }}
          >
            Solace is designed to help people who feel stuck, mentally noisy, or
            emotionally heavy find a calmer starting point.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
          }}
        >
          {entryCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                className="surface-card"
                style={{
                  minHeight: "210px",
                  padding: "1.35rem",
                  display: "grid",
                  gap: "0.8rem",
                  alignContent: "start",
                  background: card.accent,
                  border: "1px solid rgba(55,65,81,0.06)",
                }}
              >
                <div
                  style={{
                    width: "2.25rem",
                    height: "2.25rem",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.62)",
                    border: "1px solid rgba(255,255,255,0.5)",
                    boxShadow: "0 8px 20px rgba(31,41,55,0.04)",
                  }}
                />

                <p
                  style={{
                    margin: 0,
                    fontSize: "0.88rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {card.eyebrow}
                </p>

                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.35rem",
                    lineHeight: 1.12,
                    letterSpacing: "-0.035em",
                    color: "var(--color-text)",
                    maxWidth: "14ch",
                  }}
                >
                  {card.title}
                </h3>

                <p
                  style={{
                    margin: 0,
                    fontSize: "0.98rem",
                    lineHeight: 1.75,
                    color: "var(--color-text-muted)",
                  }}
                >
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}