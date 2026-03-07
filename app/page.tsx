import Link from "next/link";
import Section from "@/components/solace/Section";
import Surface from "@/components/solace/Surface";

const featuredTools = [
  {
    href: "/clarity",
    title: "Clarity Calculator",
    description: "Untangle competing thoughts and find a calmer next step.",
    cta: "Open Clarity Calculator",
    background:
      "linear-gradient(180deg, rgba(244,239,255,0.92) 0%, rgba(255,255,255,0.72) 100%)",
    border: "rgba(221, 210, 255, 0.95)",
    shadow: "rgba(140, 120, 210, 0.10)",
  },
  {
    href: "/decision-filter",
    title: "Decision Filter",
    description: "Bring structure to difficult decisions with gentle prioritisation.",
    cta: "Open Decision Filter",
    background:
      "linear-gradient(180deg, rgba(236,242,255,0.94) 0%, rgba(255,255,255,0.74) 100%)",
    border: "rgba(209, 223, 250, 0.95)",
    shadow: "rgba(100, 130, 190, 0.10)",
  },
  {
    href: "/overthinking-breaker",
    title: "Overthinking Breaker",
    description: "Interrupt loops, slow the mind, and return to something workable.",
    cta: "Open Overthinking Breaker",
    background:
      "linear-gradient(180deg, rgba(232,247,239,0.92) 0%, rgba(255,255,255,0.72) 100%)",
    border: "rgba(203, 232, 214, 0.95)",
    shadow: "rgba(100, 160, 120, 0.10)",
  },
];

export default function HomePage() {
  return (
    <>
      <Section>
        <Surface tone="lavender" padding={46}>
          <div
            style={{
              display: "grid",
              gap: 30,
              maxWidth: 920,
            }}
          >
            <div className="solace-badge">A calm place to think more clearly</div>

            <div
              style={{
                display: "grid",
                gap: 20,
                maxWidth: 920,
              }}
            >
              <h1
                className="solace-title"
                style={{
                  maxWidth: 980,
                }}
              >
                Reduce noise. Find clarity. Move forward gently.
              </h1>

              <p
                className="solace-body-xl"
                style={{
                  margin: 0,
                  maxWidth: 820,
                }}
              >
                Solace is a collection of calm digital tools designed to help people
                think through decisions, mental loops, and moments of overwhelm.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              <Link href="/clarity" className="solace-button">
                Begin reflection
              </Link>

              <Link href="/tools" className="solace-button solace-button--secondary">
                Explore tools
              </Link>
            </div>
          </div>
        </Surface>
      </Section>

      <Section>
        <div
          style={{
            display: "grid",
            gap: 22,
            maxWidth: 960,
            marginBottom: 30,
          }}
        >
          <p className="solace-label" style={{ margin: 0 }}>
            Featured tools
          </p>

          <h2
            className="solace-h2"
            style={{
              maxWidth: 980,
            }}
          >
            Same calm language. Different atmospheres. Different ways of thinking.
          </h2>
        </div>

        <div
          className="solace-grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            alignItems: "stretch",
          }}
        >
          {featuredTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="solace-tool-link"
              style={{
                padding: 32,
                background: tool.background,
                border: `1px solid ${tool.border}`,
                boxShadow: `0 20px 60px ${tool.shadow}, inset 0 1px 0 rgba(255,255,255,0.82)`,
                minHeight: 250,
                textDecoration: "none",
              }}
            >
              <div style={{ display: "grid", gap: 18, height: "100%" }}>
                <h3
                  className="solace-h3"
                  style={{
                    fontSize: "1.08rem",
                    lineHeight: 1.28,
                    maxWidth: 240,
                  }}
                >
                  {tool.title}
                </h3>

                <p
                  className="solace-body"
                  style={{
                    margin: 0,
                    maxWidth: 250,
                    fontSize: "1rem",
                    lineHeight: 1.72,
                  }}
                >
                  {tool.description}
                </p>

                <div className="solace-tool-cta">
                  <span>{tool.cta}</span>
                  <span className="solace-tool-arrow">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <Surface tone="cloud" padding={40}>
          <div
            style={{
              display: "grid",
              gap: 18,
              maxWidth: 860,
            }}
          >
            <p className="solace-label" style={{ margin: 0 }}>
              Human Behaviour Lab
            </p>

            <h2 className="solace-h2" style={{ maxWidth: 860 }}>
              A quiet research layer behind every tool.
            </h2>

            <p
              className="solace-body-xl"
              style={{
                margin: 0,
                maxWidth: 860,
              }}
            >
              Solace studies the kinds of questions people ask when they are
              overwhelmed, uncertain, or trying to make sense of something
              difficult. Each tool is designed from those patterns.
            </p>

            <div>
              <Link href="/lab" className="solace-button solace-button--secondary">
                Enter the lab
              </Link>
            </div>
          </div>
        </Surface>
      </Section>
    </>
  );
}