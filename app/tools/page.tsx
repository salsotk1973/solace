import Link from "next/link";

const tools = [
  {
    slug: "clarity",
    title: "Clarity Tool",
    description:
      "Untangle difficult decisions with a calmer, clearer frame.",
    surface:
      "linear-gradient(180deg, rgba(107,139,170,0.08), rgba(255,255,255,0.74))",
  },
  {
    slug: "overthinking-breaker",
    title: "Overthinking Breaker",
    description:
      "Slow the mental loop and see what actually needs attention.",
    surface:
      "linear-gradient(180deg, rgba(156,175,164,0.08), rgba(255,255,255,0.74))",
  },
  {
    slug: "decision-filter",
    title: "Decision Filter",
    description:
      "Separate what matters from what is only adding pressure.",
    surface:
      "linear-gradient(180deg, rgba(154,140,210,0.08), rgba(255,255,255,0.74))",
  },
];

export default function ToolsPage() {
  return (
    <main className="solace-shell section-space">
      <div
        style={{
          display: "grid",
          gap: "1rem",
          marginBottom: "2rem",
          maxWidth: "44rem",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(2.5rem, 6vw, 4.2rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.06em",
            color: "var(--color-text)",
            maxWidth: "12ch",
          }}
        >
          What brings you here today?
        </h1>

        <p
          style={{
            margin: 0,
            maxWidth: "38rem",
            fontSize: "1.08rem",
            lineHeight: 1.85,
            color: "var(--color-text-muted)",
          }}
        >
          Choose a tool and start with one clear question.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "block",
            }}
          >
            <div
              className="surface-card"
              style={{
                minHeight: "215px",
                padding: "1.35rem",
                display: "grid",
                gap: "0.9rem",
                alignContent: "start",
                background: tool.surface,
                border: "1px solid rgba(55,65,81,0.05)",
                boxShadow: "0 10px 28px rgba(31,41,55,0.03)",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.35rem",
                  lineHeight: 1.12,
                  letterSpacing: "-0.035em",
                  color: "var(--color-text)",
                }}
              >
                {tool.title}
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: "0.98rem",
                  lineHeight: 1.75,
                  color: "var(--color-text-muted)",
                }}
              >
                {tool.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}