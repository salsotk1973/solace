import Link from "next/link";

const toolCards = [
  {
    title: "I can’t decide",
    description: "Untangle difficult decisions with a calmer frame.",
    background: "rgba(219, 232, 255, 0.55)",
    border: "rgba(139, 173, 242, 0.45)",
  },
  {
    title: "My mind won’t stop thinking",
    description: "Step out of mental loops and regain perspective.",
    background: "rgba(221, 232, 224, 0.72)",
    border: "rgba(152, 190, 160, 0.42)",
  },
  {
    title: "Everything feels noisy",
    description: "Sort what matters from what is only adding pressure.",
    background: "rgba(236, 226, 246, 0.72)",
    border: "rgba(190, 170, 228, 0.45)",
  },
];

export default function ToolsPage() {
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
          Tools
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
          Start from how it feels
        </h1>

        <p
          style={{
            marginTop: 24,
            marginBottom: 0,
            fontSize: 18,
            lineHeight: 1.9,
            color: "rgba(79,92,132,0.82)",
            maxWidth: 820,
          }}
        >
          Each tool begins from a different mental state. Choose the one that feels
          closest and let the conversation unfold naturally.
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
        {toolCards.map((card) => (
          <Link
            key={card.title}
            href="/tools"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "block",
            }}
          >
            <article
              style={{
                minHeight: 228,
                borderRadius: 30,
                padding: "30px 30px 26px",
                background: card.background,
                border: `1px solid ${card.border}`,
                boxShadow: "0 18px 40px rgba(168, 154, 228, 0.08)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 22,
                  lineHeight: 1.2,
                  fontWeight: 700,
                  color: "#161b29",
                }}
              >
                {card.title}
              </h3>

              <p
                style={{
                  marginTop: 20,
                  marginBottom: 0,
                  fontSize: 16,
                  lineHeight: 1.8,
                  color: "rgba(22,27,41,0.82)",
                }}
              >
                {card.description}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}