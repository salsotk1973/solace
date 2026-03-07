"use client";

import { useMemo, useState } from "react";
import ReflectionMoment from "@/components/solace/ReflectionMoment";
import Section from "@/components/solace/Section";
import SolaceButton from "@/components/solace/SolaceButton";
import ToolCard from "@/components/solace/ToolCard";
import { toolTones } from "@/components/solace/tokens";

function generateClarityInsight(input: string) {
  const text = input.toLowerCase();

  const hasChange = /(change|leave|quit|move|different|new)/.test(text);
  const hasSafety = /(safe|security|stable|stability|money|risk)/.test(text);
  const hasExhaustion = /(tired|burnout|drained|overwhelmed|exhausted)/.test(text);
  const hasPeople = /(relationship|partner|family|friend|people|someone)/.test(text);
  const hasTooMuch = /(too much|too many|everything|so much|a lot)/.test(text);
  const hasStart = /(start|begin|where to begin|where to start)/.test(text);

  let observation =
    "It may be that several things are competing for your attention at once, which can make everything feel heavier than it really is.";

  if (hasChange && hasSafety) {
    observation =
      "It sounds like part of you wants change, while another part wants stability. When both matter, the mind can become noisy trying to protect both.";
  } else if (hasExhaustion) {
    observation =
      "Part of what feels difficult may be tiredness rather than the situation itself. When energy is low, even simple things can feel much bigger.";
  } else if (hasPeople) {
    observation =
      "There may be another person emotionally tied to this situation. That often makes things feel harder to sort through clearly.";
  } else if (hasTooMuch && hasStart) {
    observation =
      "It sounds like the amount you are carrying may be creating noise. When everything feels important, it becomes hard to know where to begin.";
  }

  let suggestion =
    "Try writing down the two or three things that matter most underneath this situation. Naming them often brings more clarity.";

  if (hasChange && hasSafety) {
    suggestion =
      "Write down what stability is protecting for you right now, then identify one small step toward change that does not put that stability at risk.";
  } else if (hasExhaustion) {
    suggestion =
      "Before solving everything, ask what would help you feel a little steadier today. A clearer mind often follows a calmer body.";
  } else if (hasPeople) {
    suggestion =
      "Try separating what belongs to you from what belongs to the other person. That boundary often makes the next step easier to see.";
  } else if (hasTooMuch && hasStart) {
    suggestion =
      "Do not try to solve everything at once. Pick one thing that would make today feel lighter, and begin there.";
  }

  return { observation, suggestion };
}

export default function ClarityPage() {
  const [text, setText] = useState("");
  const [reflecting, setReflecting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(() => generateClarityInsight(text), [text]);

  function handleSubmit() {
    if (!text.trim()) return;

    setShowResult(false);
    setReflecting(true);

    window.setTimeout(() => {
      setReflecting(false);
      setShowResult(true);
    }, 1600);
  }

  const textRail = 32;
  const cardLeftInset = 56;

  return (
    <div>
      <Section>
        <div
          style={{
            display: "grid",
            gap: 18,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: 10,
              textAlign: "left",
              maxWidth: 760,
              paddingLeft: textRail,
            }}
          >
            <h1
              className="solace-title"
              style={{
                margin: 0,
                fontSize: "3.2rem",
                lineHeight: 0.98,
                textAlign: "left",
              }}
            >
              Clarity
            </h1>

            <p
              className="solace-body-xl"
              style={{
                margin: 0,
                textAlign: "left",
              }}
            >
              Clear the noise and find your next step.
            </p>
          </div>

          <div style={{ width: "100%" }}>
            <ToolCard tone="clarity" padding={0}>
              <div
                style={{
                  display: "grid",
                  gap: 14,
                  width: "100%",
                  textAlign: "left",
                  paddingTop: 28,
                  paddingRight: 28,
                  paddingBottom: 28,
                  paddingLeft: cardLeftInset,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gap: 14,
                    width: "100%",
                    transform: `translateX(${textRail - cardLeftInset}px)`,
                  }}
                >
                  <label
                    htmlFor="clarity-input"
                    className="solace-h3"
                    style={{
                      textAlign: "left",
                      margin: 0,
                    }}
                  >
                    What feels difficult right now?
                  </label>

                  <textarea
                    id="clarity-input"
                    className="solace-textarea"
                    placeholder="Too many things are happening at once and I’m not sure where to begin..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{
                      minHeight: 180,
                      width: "100%",
                      background: "rgba(255,255,255,0.86)",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      width: "100%",
                    }}
                  >
                    <SolaceButton
                      background={toolTones.clarity.button}
                      onClick={handleSubmit}
                    >
                      Find clarity
                    </SolaceButton>
                  </div>
                </div>
              </div>
            </ToolCard>
          </div>

          {reflecting && <ReflectionMoment tone="clarity" />}

          {showResult && (
            <div
              className="solace-grid"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 14,
                width: "100%",
              }}
            >
              <ToolCard tone="clarity" padding={20}>
                <div
                  className="solace-result"
                  style={{
                    padding: 20,
                    textAlign: "left",
                  }}
                >
                  <p
                    className="solace-label"
                    style={{ marginTop: 0, marginBottom: 10 }}
                  >
                    A gentle observation
                  </p>

                  <p
                    className="solace-body-xl"
                    style={{
                      margin: 0,
                      color: "#2b3442",
                      fontSize: "1.01rem",
                      textAlign: "left",
                    }}
                  >
                    {result.observation}
                  </p>
                </div>
              </ToolCard>

              <ToolCard tone="clarity" padding={20}>
                <div
                  className="solace-result"
                  style={{
                    padding: 20,
                    textAlign: "left",
                  }}
                >
                  <p
                    className="solace-label"
                    style={{ marginTop: 0, marginBottom: 10 }}
                  >
                    Something you might try
                  </p>

                  <p
                    className="solace-body-xl"
                    style={{
                      margin: 0,
                      color: "#2b3442",
                      fontSize: "1.01rem",
                      textAlign: "left",
                    }}
                  >
                    {result.suggestion}
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