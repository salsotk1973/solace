import Section from "@/components/solace/Section";
import ToolCard from "@/components/solace/ToolCard";

export default function AboutPage() {
  return (
    <Section>
      <div style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 16, maxWidth: 780 }}>
          <div className="solace-badge">About Solace</div>
          <h1 className="solace-title">A calmer way to design digital help.</h1>
          <p className="solace-body-xl" style={{ margin: 0 }}>
            Solace exists to create simple digital environments that reduce noise and guide
            people toward clarity. Each tool is designed to feel supportive, spacious, and
            human.
          </p>
        </div>

        <ToolCard tone="clarity" padding={30}>
          <div style={{ display: "grid", gap: 14, maxWidth: 760 }}>
            <h2 className="solace-h2">What makes Solace different</h2>
            <p className="solace-body" style={{ margin: 0 }}>
              It is not built like a productivity dashboard. It is not trying to overwhelm
              people with inputs, numbers, and noise. It focuses on one calm question at a
              time.
            </p>
          </div>
        </ToolCard>
      </div>
    </Section>
  );
}