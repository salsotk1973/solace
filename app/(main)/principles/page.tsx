import PageShell from "@/components/PageShell";

const principleCards = [
  {
    title: "One thing at a time",
    description:
      "Solace reduces pressure by narrowing attention to one calm step instead of making the mind hold everything at once.",
    background: "rgba(244, 240, 240, 0.72)",
    border: "rgba(214, 206, 221, 0.45)",
  },
  {
    title: "Atmosphere matters",
    description:
      "Soft gradients, breathing room, gentle colour and quiet contrast help the nervous system stay open instead of defensive.",
    background: "rgba(241, 234, 248, 0.72)",
    border: "rgba(205, 182, 236, 0.45)",
  },
  {
    title: "Reflection before response",
    description:
      "The goal is not speed alone. The goal is a gentler moment of insight that actually helps someone think more clearly.",
    background: "rgba(226, 234, 228, 0.72)",
    border: "rgba(176, 205, 182, 0.45)",
  },
];

export default function PrinciplesPage() {
  return (
    <PageShell>
      <div
        style={{
          width: "100%",
          maxWidth: 1120,
          margin: "0 auto",
          padding: "86px 40px 96px",
          boxSizing: "border-box",
          display: "grid",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          columnGap: 24,
        }}
      >
      <div style={{ gridColumn: "1 / span 8" }}>
        <div
          style={{
            display: "inline-flex",
            padding: "10px 16px",
            borderRadius: 999,
            border: "1px solid rgba(112,123,157,0.18)",
            background: "rgba(255,255,255,0.34)",
            color: "#566482",
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          Principles
        </div>

        <h1
          style={{
            margin: "26px 0 0 0",
            fontSize: "clamp(54px, 6vw, 76px)",
            lineHeight: 0.94,
            letterSpacing: "-0.055em",
            fontWeight: 700,
            color: "#4f5c84",
            maxWidth: 760,
          }}
        >
          How Solace is
          <br />
          shaped
        </h1>

        <p
          style={{
            marginTop: 24,
            marginBottom: 0,
            fontSize: 18,
            lineHeight: 1.9,
            color: "rgba(79,92,132,0.82)",
            maxWidth: 840,
          }}
        >
          A calm system for helping people slow down, focus, and think more clearly.
        </p>
      </div>

      <div
        style={{
          gridColumn: "1 / -1",
          marginTop: 44,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 18,
        }}
      >
        {principleCards.map((card) => (
          <article
            key={card.title}
            style={{
              minHeight: 254,
              borderRadius: 30,
              padding: "24px 24px 24px",
              background: card.background,
              border: `1px solid ${card.border}`,
              boxShadow: "0 18px 40px rgba(168, 154, 228, 0.08)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 999,
                background:
                  "radial-gradient(circle at 34% 30%, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.72) 16%, rgba(202,184,241,0.9) 18%, rgba(198,182,236,0.9) 100%)",
                border: "1px solid rgba(189, 170, 228, 0.6)",
                boxShadow: "0 10px 24px rgba(168, 154, 228, 0.14)",
              }}
            />

            <h3
              style={{
                margin: "20px 0 0 0",
                fontSize: 20,
                lineHeight: 1.18,
                fontWeight: 700,
                color: "#2d3448",
              }}
            >
              {card.title}
            </h3>

            <p
              style={{
                marginTop: 16,
                marginBottom: 0,
                fontSize: 16,
                lineHeight: 1.8,
                color: "rgba(79,92,132,0.9)",
              }}
            >
              {card.description}
            </p>
          </article>
        ))}
      </div>

      <section
        style={{
          gridColumn: "1 / span 9",
          marginTop: 20,
          borderRadius: 30,
          padding: "26px 28px",
          background: "rgba(243, 238, 246, 0.72)",
          border: "1px solid rgba(205, 182, 236, 0.45)",
          boxShadow: "0 18px 40px rgba(168, 154, 228, 0.08)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 24,
            lineHeight: 1.2,
            fontWeight: 700,
            color: "#2d3448",
          }}
        >
          The design intention
        </h2>

        <p
          style={{
            marginTop: 16,
            marginBottom: 0,
            fontSize: 16,
            lineHeight: 1.8,
            color: "rgba(79,92,132,0.9)",
            maxWidth: 900,
          }}
        >
          Every part of Solace should feel spacious, supportive, and calm enough
          that someone wants to stay a little longer instead of escaping quickly.
        </p>
      </section>
      </div>
    </PageShell>
  );
}
