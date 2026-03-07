import Link from "next/link";

const toolCards = [
  {
    href: "/clarity",
    label: "CLARITY",
    title: "When the mind feels tangled",
    description:
      "Untangle crowded thoughts and bring one calmer next step into view.",
    cta: "Open Clarity Calculator",
    arrow: "→",
    background:
      "linear-gradient(180deg, rgba(244,239,255,0.92) 0%, rgba(255,255,255,0.72) 100%)",
    border: "rgba(221, 210, 255, 0.95)",
    shadow: "rgba(140, 120, 210, 0.10)",
  },
  {
    href: "/overthinking-breaker",
    label: "DIRECTION",
    title: "When a thought keeps looping",
    description:
      "A gentle way to loosen repetitive thinking and regain direction.",
    cta: "Open Overthinking Breaker",
    arrow: "→",
    background:
      "linear-gradient(180deg, rgba(232,247,239,0.92) 0%, rgba(255,255,255,0.72) 100%)",
    border: "rgba(203, 232, 214, 0.95)",
    shadow: "rgba(100, 160, 120, 0.10)",
  },
  {
    href: "/decision-filter",
    label: "FOCUS",
    title: "When everything feels urgent",
    description:
      "Separate what matters now from what can wait a little longer.",
    cta: "Open Decision Filter",
    arrow: "→",
    background:
      "linear-gradient(180deg, rgba(236,242,255,0.94) 0%, rgba(255,255,255,0.74) 100%)",
    border: "rgba(209, 223, 250, 0.95)",
    shadow: "rgba(100, 130, 190, 0.10)",
  },
];

export default function ToolsPage() {
  return (
    <main className="solace-page">
      <section className="solace-section">
        <div style={{ display: "grid", gap: 28, maxWidth: 860 }}>
          <div className="solace-badge">Calm digital tools for clearer thinking</div>

          <h1 className="solace-title">A few quiet tools for clearer thinking.</h1>

          <p className="solace-body-xl">
            Each tool focuses on one small shift: untangling thoughts, softening
            pressure, and helping the next step become visible.
          </p>
        </div>

        <div
          className="solace-grid"
          style={{
            marginTop: 60,
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            alignItems: "stretch",
          }}
        >
          {toolCards.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="solace-tool-link"
              style={{
                padding: 32,
                background: tool.background,
                border: `1px solid ${tool.border}`,
                boxShadow: `0 20px 60px ${tool.shadow}, inset 0 1px 0 rgba(255,255,255,0.82)`,
                minHeight: 330,
                textDecoration: "none",
              }}
            >
              <div style={{ display: "grid", gap: 20, height: "100%" }}>
                <div className="solace-label" style={{ fontSize: "0.82rem" }}>
                  {tool.label}
                </div>

                <h3
                  className="solace-h3"
                  style={{
                    fontSize: "1.08rem",
                    lineHeight: 1.28,
                    maxWidth: 250,
                  }}
                >
                  {tool.title}
                </h3>

                <p
                  className="solace-body"
                  style={{
                    margin: 0,
                    maxWidth: 260,
                    fontSize: "1.02rem",
                    lineHeight: 1.72,
                  }}
                >
                  {tool.description}
                </p>

                <div className="solace-tool-cta">
                  <span>{tool.cta}</span>
                  <span className="solace-tool-arrow">{tool.arrow}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}