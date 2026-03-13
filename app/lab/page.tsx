const labCards = [
  {
    title: "Why difficult decisions feel heavier than they are",
    description:
      "A quiet look at why some choices expand in the mind and how calmer framing helps.",
  },
  {
    title: "Why the same thought repeats",
    description:
      "A simple explanation of loops, unresolved tension, and the search for certainty.",
  },
  {
    title: "Why clarity often needs less, not more",
    description:
      "How reducing inputs can create a better path to insight than adding more information.",
  },
];

export default function LabPage() {
  return (
    <main
      style={{
        width: "100%",
        paddingTop: 86,
        paddingBottom: 96,
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
          Human Behaviour Lab
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
          Patterns
          <br />
          behind the
          <br />
          questions
          <br />
          people ask
          <br />
          online.
        </h1>

        <p
          style={{
            marginTop: 24,
            marginBottom: 0,
            fontSize: 18,
            lineHeight: 1.9,
            color: "rgba(79,92,132,0.82)",
            maxWidth: 920,
          }}
        >
          One interesting behaviour that keeps appearing online is how often
          people do not search for information alone. They search for relief,
          permission, and a way to reduce internal noise.
        </p>
      </div>

      <section
        style={{
          gridColumn: "1 / span 9",
          marginTop: 32,
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
          What Solace is studying
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
          Decision fatigue. Overthinking loops. Competing priorities. Emotional
          friction. Solace turns those patterns into calmer digital environments
          that help people think more clearly.
        </p>
      </section>

      <div
        style={{
          gridColumn: "1 / -1",
          marginTop: 22,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 18,
        }}
      >
        {labCards.map((card) => (
          <article
            key={card.title}
            style={{
              minHeight: 228,
              borderRadius: 30,
              padding: "24px 20px 24px",
              background: "rgba(243, 238, 246, 0.72)",
              border: "1px solid rgba(205, 182, 236, 0.45)",
              boxShadow: "0 18px 40px rgba(168, 154, 228, 0.08)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                background:
                  "radial-gradient(circle at 34% 30%, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.72) 16%, rgba(202,184,241,0.9) 18%, rgba(198,182,236,0.9) 100%)",
                border: "1px solid rgba(189, 170, 228, 0.6)",
                boxShadow: "0 10px 24px rgba(168, 154, 228, 0.14)",
              }}
            />

            <h3
              style={{
                margin: "18px 0 0 0",
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
    </main>
  );
}