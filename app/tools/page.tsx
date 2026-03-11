import Link from "next/link";
import Section from "@/components/solace/Section";

const tools = [
  {
    href: "/tools/clarity",
    title: "Clarity Tool",
    description: "A quiet space to untangle difficult decisions.",
    tone: {
      border: "rgba(147, 197, 253, 0.95)",
      fill: "rgba(219, 234, 254, 0.42)",
      glow: "rgba(96, 165, 250, 0.10)",
      hoverGlow: "rgba(96, 165, 250, 0.18)",
    },
  },
  {
    href: "/tools/overthinking-breaker",
    title: "Overthinking Reset",
    description: "A calmer way to step out of looping thoughts.",
    tone: {
      border: "rgba(167, 243, 208, 0.95)",
      fill: "rgba(220, 252, 231, 0.42)",
      glow: "rgba(74, 222, 128, 0.10)",
      hoverGlow: "rgba(74, 222, 128, 0.18)",
    },
  },
  {
    href: "/tools/priority-reset",
    title: "Decision Filter",
    description: "A clear way to separate what matters from what is just noise.",
    tone: {
      border: "rgba(216, 180, 254, 0.95)",
      fill: "rgba(243, 232, 255, 0.45)",
      glow: "rgba(192, 132, 252, 0.10)",
      hoverGlow: "rgba(192, 132, 252, 0.18)",
    },
  },
];

export default function ToolsPage() {
  return (
    <Section>
      <style>{`
        .tools-page {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          gap: 42px;
        }

        .tools-hero {
          display: grid;
          gap: 16px;
          max-width: 760px;
        }

        .tools-badge {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          min-height: 48px;
          padding: 0 20px;
          border-radius: 999px;
          border: 1px solid rgba(212, 212, 216, 0.96);
          background: rgba(255, 255, 255, 0.78);
          color: rgb(82, 82, 91);
          font-size: 0.98rem;
          font-weight: 500;
        }

        .tools-title {
          margin: 0;
          font-size: clamp(3rem, 6vw, 4.6rem);
          line-height: 0.96;
          letter-spacing: -0.06em;
          font-weight: 650;
          color: rgb(15, 23, 42);
        }

        .tools-subtitle {
          margin: 0;
          font-size: 1.08rem;
          line-height: 1.85;
          color: rgb(82, 82, 91);
          max-width: 34rem;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          align-items: stretch;
        }

        .tool-link {
          display: block;
          text-decoration: none;
          color: inherit;
        }

        .tool-card {
          min-height: 172px;
          height: 100%;
          display: grid;
          gap: 14px;
          align-content: start;
          padding: 22px;
          border-radius: 28px;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            border-color 180ms ease;
          will-change: transform, box-shadow;
        }

        .tool-link:hover .tool-card,
        .tool-link:focus-visible .tool-card {
          transform: translateY(-4px);
        }

        .tool-link:focus-visible {
          outline: none;
        }

        .tool-title {
          margin: 0;
          font-size: 1.2rem;
          line-height: 1.25;
          font-weight: 500;
          color: rgb(39, 39, 42);
        }

        .tool-description {
          margin: 0;
          font-size: 1rem;
          line-height: 1.8;
          color: rgb(82, 82, 91);
          max-width: 26ch;
        }

        @media (max-width: 980px) {
          .tools-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="tools-page">
        <div className="tools-hero">
          <div className="tools-badge">Tools</div>

          <h1 className="tools-title">Choose a starting point</h1>

          <p className="tools-subtitle">
            Begin where the feeling feels closest.
          </p>
        </div>

        <div className="tools-grid">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="tool-link">
              <div
                className="tool-card"
                style={{
                  border: `1.5px solid ${tool.tone.border}`,
                  background: `linear-gradient(180deg, ${tool.tone.fill} 0%, rgba(255,255,255,0.58) 100%)`,
                  boxShadow: `0 12px 24px ${tool.tone.glow}`,
                }}
              >
                <style>{`
                  .tool-link[href="${tool.href}"]:hover .tool-card,
                  .tool-link[href="${tool.href}"]:focus-visible .tool-card {
                    box-shadow: 0 18px 34px ${tool.tone.hoverGlow};
                  }
                `}</style>

                <h2 className="tool-title">{tool.title}</h2>
                <p className="tool-description">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}