import Section from "@/components/solace/Section";
import ToolCard from "@/components/solace/ToolCard";

export default function LabPage() {
  return (
    <Section>
      <div style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 16, maxWidth: 780 }}>
          <div className="solace-badge">Human Behaviour Lab</div>
          <h1 className="solace-title">Patterns behind the questions people ask online.</h1>
          <p className="solace-body-xl" style={{ margin: 0 }}>
            One interesting behaviour that keeps appearing online is how often people do
            not search for information alone. They search for relief, permission, and a way
            to reduce internal noise.
          </p>
        </div>

        <ToolCard tone="weekly" padding={30}>
          <div style={{ display: "grid", gap: 14, maxWidth: 760 }}>
            <h2 className="solace-h2">What Solace is studying</h2>
            <p className="solace-body" style={{ margin: 0 }}>
              Decision fatigue. Overthinking loops. Competing priorities. Emotional friction.
              Solace turns those patterns into calm digital environments that help people
              think more clearly.
            </p>
          </div>
        </ToolCard>
      </div>
    </Section>
  );
}