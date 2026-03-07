"use client";

import { useMemo, useState } from "react";
import ReflectionMoment from "@/components/solace/ReflectionMoment";
import RangeRow from "@/components/solace/RangeRow";
import Section from "@/components/solace/Section";
import SolaceButton from "@/components/solace/SolaceButton";
import ToolCard from "@/components/solace/ToolCard";
import ToolIntro from "@/components/solace/ToolIntro";
import { toolTones } from "@/components/solace/tokens";

function buildDecisionInsight({
  importance,
  reversibility,
  emotionalWeight,
  risk,
}: {
  importance: number;
  reversibility: number;
  emotionalWeight: number;
  risk: number;
}) {
  const complexity = importance + emotionalWeight + risk - reversibility;

  let summary =
    "This appears workable. The best next step may be to reduce uncertainty before trying to force a final answer.";
  let guidance =
    "Try a small experiment first. Reversible decisions benefit from movement more than endless analysis.";

  if (complexity >= 24) {
    summary =
      "This decision looks significant and emotionally loaded. It may deserve more time, less pressure, and a clearer distinction between facts and fears.";
    guidance =
      "Write down what would still matter six months from now. Then separate that from what feels urgent only because it is uncomfortable today.";
  } else if (risk >= 8 && reversibility <= 4) {
    summary =
      "This choice seems harder to reverse, so caution makes sense here. Slowing down is not avoidance if the stakes are genuinely higher.";
    guidance =
      "Focus on gathering one more piece of grounded information before deciding. When reversibility is low, clarity matters more than speed.";
  } else if (reversibility >= 8 && importance >= 6) {
    summary =
      "This may matter to you, but it also appears fairly reversible. That often means action can teach you more than speculation.";
    guidance =
      "Consider a trial version of the decision instead of treating it like a permanent identity-level choice.";
  }

  return { summary, guidance };
}

export default function DecisionFilterPage() {
  const [decision, setDecision] = useState("");
  const [importance, setImportance] = useState(7);
  const [reversibility, setReversibility] = useState(5);
  const [emotionalWeight, setEmotionalWeight] = useState(7);
  const [risk, setRisk] = useState(5);
  const [isReflecting, setIsReflecting] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const result = useMemo(
    () => buildDecisionInsight({ importance, reversibility, emotionalWeight, risk }),
    [importance, reversibility, emotionalWeight, risk]
  );

  const handleSubmit = () => {
    if (!decision.trim()) return;
    setHasResult(false);
    setIsReflecting(true);
    window.setTimeout(() => {
      setIsReflecting(false);
      setHasResult(true);
    }, 2500);
  };

  return (
    <div
      style={{
        background:
          "radial-gradient(circle at 20% 8%, rgba(220, 233, 255, 0.22), transparent 0 26%), radial-gradient(circle at 84% 14%, rgba(244, 247, 255, 0.24), transparent 0 24%)",
      }}
    >
      <Section>
        <div style={{ display: "grid", gap: 28 }}>
          <ToolIntro
            tone="decision"
            title="Decision Filter"
            description="Bring structure to a difficult decision by weighing what matters most without overwhelming yourself."
          />

          <ToolCard tone="decision" padding={34}>
            <div style={{ display: "grid", gap: 24 }}>
              <div style={{ display: "grid", gap: 12 }}>
                <div className="solace-badge">Structured thinking</div>

                <label htmlFor="decision-input" className="solace-h3">
                  What decision are you trying to make?
                </label>

                <input
                  id="decision-input"
                  className="solace-input"
                  placeholder="Should I stay where I am, or move toward something new?"
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  style={{
                    background: "rgba(255,255,255,0.84)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.7), 0 10px 24px rgba(90, 125, 180, 0.06)",
                  }}
                />
              </div>

              <div
                className="solace-result"
                style={{
                  display: "grid",
                  gap: 22,
                  background: "rgba(255,255,255,0.8)",
                }}
              >
                <RangeRow label="Importance" value={importance} onChange={setImportance} />
                <RangeRow label="Reversibility" value={reversibility} onChange={setReversibility} />
                <RangeRow
                  label="Emotional weight"
                  value={emotionalWeight}
                  onChange={setEmotionalWeight}
                />
                <RangeRow label="Risk" value={risk} onChange={setRisk} />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <div className="solace-chip-row">
                  <span className="solace-chip">Analytical</span>
                  <span className="solace-chip">Clear weighting</span>
                </div>

                <SolaceButton background={toolTones.decision.button} onClick={handleSubmit}>
                  Continue
                </SolaceButton>
              </div>
            </div>
          </ToolCard>

          {isReflecting && <ReflectionMoment tone="decision" />}

          {hasResult && (
            <div
              className="solace-grid"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18 }}
            >
              <ToolCard tone="decision" padding={30}>
                <div className="solace-result">
                  <p className="solace-label" style={{ marginTop: 0 }}>
                    Clarity summary
                  </p>

                  <p className="solace-body-xl" style={{ margin: 0, color: "#2b3442" }}>
                    {result.summary}
                  </p>
                </div>
              </ToolCard>

              <ToolCard tone="decision" padding={30}>
                <div className="solace-result">
                  <p className="solace-label" style={{ marginTop: 0 }}>
                    A possible way forward
                  </p>

                  <p className="solace-body-xl" style={{ margin: 0, color: "#2b3442" }}>
                    {result.guidance}
                  </p>
                </div>
              </ToolCard>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}