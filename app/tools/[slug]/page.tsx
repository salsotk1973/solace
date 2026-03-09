import ToolContainer from "@/components/solace/ToolContainer";

type ToolPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const toolContent = {
  clarity: {
    title: "Clarity Tool",
    subtitle: "A quiet space to untangle difficult decisions.",
    placeholder: "Write your decision question here...",
    mode: "clarity" as const,
    surface:
      "linear-gradient(180deg, rgba(107,139,170,0.06), rgba(255,255,255,0.78))",
  },
  "overthinking-breaker": {
    title: "Overthinking Breaker",
    subtitle: "A calmer space for thoughts that keep circling.",
    placeholder: "Write the thought that keeps repeating...",
    mode: "overthinking-breaker" as const,
    surface:
      "linear-gradient(180deg, rgba(156,175,164,0.06), rgba(255,255,255,0.78))",
  },
  "decision-filter": {
    title: "Decision Filter",
    subtitle: "Reduce noise and see what truly matters.",
    placeholder: "Write the question that feels noisy or crowded...",
    mode: "decision-filter" as const,
    surface:
      "linear-gradient(180deg, rgba(154,140,210,0.06), rgba(255,255,255,0.78))",
  },
};

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = toolContent[slug as keyof typeof toolContent];

  if (!tool) {
    return (
      <main className="solace-shell--narrow section-space">
        <div className="surface-card" style={{ padding: "2rem" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "2rem",
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              color: "var(--color-text)",
            }}
          >
            Tool not found
          </h1>

          <p
            style={{
              marginTop: "1rem",
              marginBottom: 0,
              fontSize: "1rem",
              lineHeight: 1.8,
              color: "var(--color-text-muted)",
            }}
          >
            This Solace tool does not exist yet.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="solace-shell--narrow section-space">
      <div
        style={{
          display: "grid",
          gap: "1.4rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "0.7rem",
            maxWidth: "42rem",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2.5rem, 6vw, 4.1rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.065em",
              color: "var(--color-text)",
            }}
          >
            {tool.title}
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "1.08rem",
              lineHeight: 1.8,
              color: "var(--color-text-muted)",
            }}
          >
            {tool.subtitle}
          </p>
        </div>

        <div
          className="surface-card"
          style={{
            padding: "1rem",
            background: tool.surface,
            border: "1px solid rgba(55,65,81,0.04)",
            boxShadow: "0 8px 18px rgba(31,41,55,0.025)",
          }}
        >
          <ToolContainer placeholder={tool.placeholder} mode={tool.mode} />
        </div>
      </div>
    </main>
  );
}