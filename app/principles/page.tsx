import Section from "@/components/solace/Section";
import Surface from "@/components/solace/Surface";

const principles = [
  {
    title: "One question at a time",
    body: "Solace avoids noise by reducing each interaction to a single calm step. Less friction. Less overwhelm. More clarity.",
    tone: "cloud" as const,
  },
  {
    title: "Atmosphere matters",
    body: "Digital environments affect emotional state. Solace uses gentle gradients, breathing room, and soft contrast to reduce tension.",
    tone: "lavender" as const,
  },
  {
    title: "Reflection before results",
    body: "A moment of pause can change the way insight is received. Solace slows the mind before offering direction.",
    tone: "mint" as const,
  },
];

export default function PrinciplesPage() {
  return (
    <Section>
      <div style={{ display: "grid", gap: 32 }}>
        <div style={{ display: "grid", gap: 18, maxWidth: 900 }}>
          <div className="solace-badge">Principles</div>

          <h1 className="solace-title" style={{ maxWidth: 980 }}>
            The design philosophy behind Solace.
          </h1>

          <p className="solace-body-xl" style={{ margin: 0, maxWidth: 860 }}>
            Solace is built on calm interaction patterns that reduce mental
            friction and make digital tools feel more human.
          </p>
        </div>

        <div
          className="solace-grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            alignItems: "stretch",
          }}
        >
          {principles.map((item) => (
            <Surface key={item.title} tone={item.tone} padding={36}>
              <div
                style={{
                  display: "grid",
                  gap: 18,
                  minHeight: 190,
                }}
              >
                <h2 className="solace-h3" style={{ fontSize: "1.25rem" }}>
                  {item.title}
                </h2>

                <p
                  className="solace-body"
                  style={{
                    margin: 0,
                    fontSize: "1.02rem",
                    lineHeight: 1.8,
                    maxWidth: "34ch",
                  }}
                >
                  {item.body}
                </p>
              </div>
            </Surface>
          ))}
        </div>
      </div>
    </Section>
  );
}