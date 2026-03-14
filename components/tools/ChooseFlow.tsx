"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

type ReflectionOutput = {
  answer: string;
};

const toolCardStyle: CSSProperties = {
  marginTop: 34,
  borderRadius: 34,
  border: "1px solid rgba(139,173,242,0.34)",
  background: "rgba(219,232,255,0.34)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  boxShadow: "0 18px 40px rgba(168,154,228,0.07)",
  padding: "32px 32px 34px",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(24px,2.2vw,34px)",
  lineHeight: 1.08,
  letterSpacing: "-0.04em",
  fontWeight: 700,
  color: "#161b29",
};

const bodyStyle: CSSProperties = {
  maxWidth: 900,
  margin: "18px 0 0",
  fontSize: 16,
  lineHeight: 1.95,
  color: "rgba(79,92,132,0.82)",
};

const textAreaStyle: CSSProperties = {
  width: "100%",
  marginTop: 18,
  minHeight: 154,
  borderRadius: 26,
  border: "1px solid rgba(255,255,255,0.6)",
  background: "rgba(255,255,255,0.46)",
  padding: "20px 20px 22px",
  fontSize: 17,
  lineHeight: 1.8,
  color: "#161b29",
  outline: "none",
  resize: "vertical",
  boxSizing: "border-box",
};

const reflectionBoxStyle: CSSProperties = {
  marginTop: 28,
  borderRadius: 26,
  border: "1px solid rgba(120,156,255,0.82)",
  background: "rgba(255,255,255,0.24)",
  boxShadow:
    "0 10px 24px rgba(109,156,246,0.08), inset 0 1px 0 rgba(255,255,255,0.35)",
  padding: "24px 28px 26px",
};

const actionButtonBaseStyle: CSSProperties = {
  minHeight: 60,
  padding: "0 24px",
  borderRadius: 999,
  fontSize: 16,
  lineHeight: 1.2,
  fontWeight: 700,
  letterSpacing: "-0.01em",
  cursor: "pointer",
  border: "1px solid rgba(58, 77, 168, 0.96)",
  color: "#ffffff",
  background:
    "linear-gradient(180deg, rgba(79, 99, 199, 1) 0%, rgba(60, 79, 176, 1) 100%)",
  boxShadow:
    "0 14px 28px rgba(60, 79, 176, 0.22), inset 0 1px 0 rgba(255,255,255,0.22)",
  transition:
    "transform 140ms ease, background 140ms ease, box-shadow 140ms ease, border-color 140ms ease, opacity 140ms ease",
};

const actionButtonHoverStyle: CSSProperties = {
  border: "1px solid rgba(48, 67, 154, 1)",
  background:
    "linear-gradient(180deg, rgba(68, 88, 189, 1) 0%, rgba(53, 70, 160, 1) 100%)",
  boxShadow:
    "0 18px 32px rgba(53, 70, 160, 0.28), inset 0 1px 0 rgba(255,255,255,0.2)",
  transform: "translateY(-1px)",
};

const actionButtonPressedStyle: CSSProperties = {
  border: "1px solid rgba(36, 51, 124, 1)",
  background:
    "linear-gradient(180deg, rgba(46, 63, 148, 1) 0%, rgba(36, 51, 124, 1) 100%)",
  boxShadow:
    "inset 0 4px 10px rgba(0,0,0,0.2), 0 6px 12px rgba(36, 51, 124, 0.16)",
  transform: "translateY(1px)",
};

const actionButtonDisabledStyle: CSSProperties = {
  border: "1px solid rgba(148,161,210,0.46)",
  background:
    "linear-gradient(180deg, rgba(188,198,232,0.88) 0%, rgba(174,185,222,0.88) 100%)",
  color: "rgba(255,255,255,0.88)",
  boxShadow: "none",
  cursor: "default",
  opacity: 0.76,
};

function buildReflection(decisionText: string): ReflectionOutput {
  const trimmed = decisionText.trim();

  if (trimmed.length === 0) {
    return {
      answer:
        "This decision may feel heavy because it is asking you to hold uncertainty and possibility at the same time. Try rewriting it in one short sentence first. Clarity often begins when the question becomes smaller.",
    };
  }

  const normalized = trimmed.toLowerCase();

  let answer =
    "This decision may be less about finding a perfect answer and more about noticing which option fits your life more honestly right now. It may help to focus less on the ideal outcome and more on which choice feels steadier, more sustainable, and easier to live with over time.";

  if (
    normalized.includes("move") ||
    normalized.includes("stay") ||
    normalized.includes("leave") ||
    normalized.includes("relocat") ||
    normalized.includes("city") ||
    normalized.includes("country")
  ) {
    answer =
      "This feels like a decision between familiarity and change. One path may offer continuity, while the other may offer movement, risk, or expansion. The real question may be which kind of discomfort you are more willing to carry. It may help to ask yourself which option you would regret not exploring a year from now.";
  } else if (
    normalized.includes("job") ||
    normalized.includes("work") ||
    normalized.includes("career") ||
    normalized.includes("business") ||
    normalized.includes("boss")
  ) {
    answer =
      "This sounds like a decision where security and growth may be pulling in different directions. It may help to notice whether you are protecting stability, moving toward expansion, or trying to do both at once. Instead of asking which option is better in theory, try imagining what each one would feel like on a normal Tuesday six months from now.";
  } else if (
    normalized.includes("relationship") ||
    normalized.includes("partner") ||
    normalized.includes("marriage") ||
    normalized.includes("together") ||
    normalized.includes("priest")
  ) {
    answer =
      "This may be a decision where emotion, identity, and future direction are arriving at the same time. The clearest signal is often not the strongest feeling in the moment, but the one that remains steady when the noise settles. It may help to ask what each path would require you to let go of, and which loss feels more honest to face.";
  } else if (
    normalized.includes("money") ||
    normalized.includes("financial") ||
    normalized.includes("house") ||
    normalized.includes("mortgage")
  ) {
    answer =
      "This feels like a decision where practical pressure may be shaping the emotional weight of the choice. It can help to separate what is truly urgent from what is simply uncertain. You may find that the decision becomes clearer once the facts are written down cleanly, before giving them a bigger meaning.";
  } else if (
    normalized.includes("electric") ||
    normalized.includes("petrol") ||
    normalized.includes("car") ||
    normalized.includes("vehicle")
  ) {
    answer =
      "This may not only be about the car itself. It may also reflect how you think about convenience, cost, and the future. One option may feel more familiar today, while the other may feel more aligned with where things are going. It may help to imagine explaining each choice to your future self five years from now and notice which one feels easier to stand behind.";
  } else if (
    normalized.includes("college") ||
    normalized.includes("uni") ||
    normalized.includes("university")
  ) {
    answer =
      "This may be about more than the institution itself. It may also reflect how you think about independence, cost, learning style, and long-term direction. It can help to imagine which environment would allow you to grow more comfortably over time, not just which one sounds better on paper.";
  }

  return { answer };
}

export default function ChooseFlow() {
  const [decisionText, setDecisionText] = useState("");
  const [hasReflected, setHasReflected] = useState(false);

  const [hoverReflect, setHoverReflect] = useState(false);
  const [pressReflect, setPressReflect] = useState(false);
  const [hoverExplore, setHoverExplore] = useState(false);
  const [pressExplore, setPressExplore] = useState(false);

  const canReflect = useMemo(() => decisionText.trim().length > 0, [decisionText]);
  const reflection = useMemo(() => buildReflection(decisionText), [decisionText]);

  function handleReflect() {
    if (!canReflect) return;
    setHasReflected(true);
  }

  function handleReset() {
    setDecisionText("");
    setHasReflected(false);
    setHoverExplore(false);
    setPressExplore(false);
  }

  const reflectStyle: CSSProperties = !canReflect
    ? { ...actionButtonBaseStyle, ...actionButtonDisabledStyle }
    : pressReflect
    ? { ...actionButtonBaseStyle, ...actionButtonPressedStyle }
    : hoverReflect
    ? { ...actionButtonBaseStyle, ...actionButtonHoverStyle }
    : actionButtonBaseStyle;

  const exploreStyle: CSSProperties = pressExplore
    ? { ...actionButtonBaseStyle, ...actionButtonPressedStyle }
    : hoverExplore
    ? { ...actionButtonBaseStyle, ...actionButtonHoverStyle }
    : actionButtonBaseStyle;

  return (
    <>
      <div style={toolCardStyle}>
        <h2 style={titleStyle}>What decision are you facing?</h2>

        <p style={bodyStyle}>
          Write it in the simplest way you can. You do not need to explain
          everything.
        </p>

        <textarea
          style={textAreaStyle}
          value={decisionText}
          placeholder="I’m deciding whether to..."
          onChange={(e) => setDecisionText(e.target.value)}
        />

        {!hasReflected ? (
          <div
            style={{
              marginTop: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <button
              type="button"
              onClick={handleReflect}
              disabled={!canReflect}
              onMouseEnter={() => canReflect && setHoverReflect(true)}
              onMouseLeave={() => {
                setHoverReflect(false);
                setPressReflect(false);
              }}
              onMouseDown={() => canReflect && setPressReflect(true)}
              onMouseUp={() => setPressReflect(false)}
              style={reflectStyle}
            >
              See a clearer view
            </button>
          </div>
        ) : null}

        {hasReflected ? (
          <div style={reflectionBoxStyle}>
            <p
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.95,
                color: "rgba(79,92,132,0.82)",
              }}
            >
              {reflection.answer}
            </p>
          </div>
        ) : null}
      </div>

      {hasReflected ? (
        <div
          style={{
            marginTop: 18,
            marginLeft: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <button
            type="button"
            onClick={handleReset}
            onMouseEnter={() => setHoverExplore(true)}
            onMouseLeave={() => {
              setHoverExplore(false);
              setPressExplore(false);
            }}
            onMouseDown={() => setPressExplore(true)}
            onMouseUp={() => setPressExplore(false)}
            style={exploreStyle}
          >
            Explore another decision
          </button>
        </div>
      ) : null}
    </>
  );
}