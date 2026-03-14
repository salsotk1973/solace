"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";

type ReflectionOutput = {
  answer: string;
};

const settlingShellStyle: CSSProperties = {
  marginTop: 34,
  minHeight: 270,
  borderRadius: 34,
  border: "1px solid rgba(255,255,255,0.46)",
  background: "rgba(255,255,255,0.16)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  boxShadow: "0 18px 40px rgba(168,154,228,0.05)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "36px 24px",
  textAlign: "center",
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
  border: "1px solid rgba(255,255,255,0.5)",
  background: "rgba(255,255,255,0.2)",
  padding: "24px 24px 26px",
};

const primaryButtonBaseStyle: CSSProperties = {
  minHeight: 54,
  padding: "0 22px",
  borderRadius: 999,
  fontSize: 15,
  lineHeight: 1.2,
  fontWeight: 600,
  cursor: "pointer",
  border: "1px solid rgba(76,122,214,0.38)",
  background: "rgba(209,223,255,0.9)",
  color: "#4f5c84",
  boxShadow: "0 10px 22px rgba(109,156,246,0.1)",
  transition:
    "transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease, opacity 180ms ease, color 180ms ease",
};

const primaryButtonHoverStyle: CSSProperties = {
  border: "1px solid rgba(76,122,214,0.62)",
  background: "rgba(218,230,255,0.98)",
  color: "#3f4d77",
  boxShadow:
    "0 14px 28px rgba(109,156,246,0.14), 0 0 0 1px rgba(109,156,246,0.1) inset",
  transform: "translateY(-1px)",
};

const primaryButtonDisabledStyle: CSSProperties = {
  border: "1px solid rgba(109,156,246,0.18)",
  background: "rgba(214,223,242,0.6)",
  color: "rgba(79,92,132,0.56)",
  boxShadow: "none",
  cursor: "default",
  opacity: 0.7,
};

const secondaryButtonBaseStyle: CSSProperties = {
  minHeight: 54,
  padding: "0 22px",
  borderRadius: 999,
  fontSize: 15,
  lineHeight: 1.2,
  fontWeight: 500,
  cursor: "pointer",
  border: "1px solid rgba(109,156,246,0.3)",
  background: "rgba(228,235,252,0.78)",
  color: "#4f5c84",
  boxShadow: "0 8px 18px rgba(109,156,246,0.06)",
  transition:
    "transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease, opacity 180ms ease, color 180ms ease",
};

const secondaryButtonHoverStyle: CSSProperties = {
  border: "1px solid rgba(109,156,246,0.54)",
  background: "rgba(236,241,255,0.96)",
  color: "#3f4d77",
  boxShadow:
    "0 12px 24px rgba(109,156,246,0.1), 0 0 0 1px rgba(109,156,246,0.08) inset",
  transform: "translateY(-1px)",
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
    normalized.includes("relocat")
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
  }

  return { answer };
}

export default function ChooseFlow() {
  const [isSettled, setIsSettled] = useState(false);
  const [decisionText, setDecisionText] = useState("");
  const [hasReflected, setHasReflected] = useState(false);
  const [isReflectHovered, setIsReflectHovered] = useState(false);
  const [isExploreHovered, setIsExploreHovered] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsSettled(true);
    }, 1800);

    return () => window.clearTimeout(timeout);
  }, []);

  const canReflect = useMemo(() => decisionText.trim().length > 0, [decisionText]);
  const reflection = useMemo(() => buildReflection(decisionText), [decisionText]);

  function handleReflect() {
    if (!canReflect) return;
    setHasReflected(true);
  }

  function handleNewDecision() {
    setDecisionText("");
    setHasReflected(false);
  }

  const reflectButtonStyle: CSSProperties = canReflect
    ? {
        ...primaryButtonBaseStyle,
        ...(isReflectHovered ? primaryButtonHoverStyle : {}),
      }
    : {
        ...primaryButtonBaseStyle,
        ...primaryButtonDisabledStyle,
      };

  const exploreButtonStyle: CSSProperties = {
    ...secondaryButtonBaseStyle,
    ...(isExploreHovered ? secondaryButtonHoverStyle : {}),
  };

  return (
    <div>
      {!isSettled ? (
        <div style={settlingShellStyle}>
          <div className="choose-settling-orb" />

          <p
            style={{
              margin: "22px 0 0",
              fontSize: 16,
              lineHeight: 1.8,
              color: "rgba(79,92,132,0.76)",
              maxWidth: 420,
            }}
          >
            Take a breath. You do not need to solve the whole decision at once.
          </p>

          <style jsx>{`
            .choose-settling-orb {
              width: 98px;
              height: 98px;
              border-radius: 999px;
              background: radial-gradient(
                circle at 35% 30%,
                rgba(255, 255, 255, 0.92) 0%,
                rgba(216, 190, 255, 0.9) 20%,
                rgba(186, 155, 255, 0.8) 45%,
                rgba(186, 155, 255, 0.2) 76%,
                rgba(186, 155, 255, 0.04) 100%
              );
              box-shadow:
                0 0 50px rgba(186, 155, 255, 0.34),
                inset 0 0 30px rgba(255, 255, 255, 0.28);
              animation: chooseSettlingBreath 6s ease-in-out infinite;
            }

            @keyframes chooseSettlingBreath {
              0% {
                transform: scale(0.94);
                opacity: 0.72;
              }
              50% {
                transform: scale(1.08);
                opacity: 1;
              }
              100% {
                transform: scale(0.94);
                opacity: 0.72;
              }
            }
          `}</style>
        </div>
      ) : (
        <>
          <div style={toolCardStyle}>
            <h2 style={titleStyle}>What decision are you facing?</h2>

            <p style={bodyStyle}>
              Write it in the simplest way you can. You do not need to explain
              everything.
            </p>

            <textarea
              style={textAreaStyle}
              placeholder="I’m deciding whether to..."
              value={decisionText}
              onChange={(event) => setDecisionText(event.target.value)}
            />

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
                onMouseEnter={() => canReflect && setIsReflectHovered(true)}
                onMouseLeave={() => setIsReflectHovered(false)}
                style={reflectButtonStyle}
              >
                Reflect on this decision
              </button>
            </div>

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
                onClick={handleNewDecision}
                onMouseEnter={() => setIsExploreHovered(true)}
                onMouseLeave={() => setIsExploreHovered(false)}
                style={exploreButtonStyle}
              >
                Explore another decision
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}