"use client";

import { useMemo, useState } from "react";
import Section from "@/components/solace/Section";
import SolaceButton from "@/components/solace/SolaceButton";

function cleanText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-zA-ZÀ-ÿ0-9\s'’-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(text: string) {
  const cleaned = cleanText(text);
  if (!cleaned) return 0;
  return cleaned.split(" ").filter(Boolean).length;
}

function isClearlyGibberish(text: string) {
  const cleaned = cleanText(text);
  if (!cleaned) return true;

  const badPatterns = /(asdf|zxcv|qwer|qwerty|testtest|aaaa|bbbb|cccc|dddd)/i;
  if (badPatterns.test(cleaned)) return true;

  const words = cleaned.split(" ").filter(Boolean);
  if (words.length === 0) return true;

  const allVeryShort = words.every((word) => word.length <= 2);
  if (words.length >= 4 && allVeryShort) return true;

  return false;
}

function hasEnoughRealInput(thought: string, fear: string) {
  const thoughtWords = countWords(thought);
  const fearWords = countWords(fear);
  const totalWords = thoughtWords + fearWords;

  if (thoughtWords < 2) return false;
  if (totalWords < 4) return false;
  if (isClearlyGibberish(`${thought} ${fear}`)) return false;

  return true;
}

function generateDirectionInsight(thought: string, fear: string) {
  const combined = `${thought} ${fear}`.toLowerCase();

  const hasPast =
    /(past|replay|again|keep thinking|keeps repeating|repeating)/.test(combined);
  const hasFuture =
    /(later|future|what if|might happen|could happen|next|after|seguir igual|same)/.test(
      combined
    );
  const hasMistake =
    /(wrong|mistake|regret|bad decision|shouldn't|should not)/.test(combined);
  const hasPeople =
    /(partner|family|friend|someone|person|they|them)/.test(combined);
  const hasControl = /(control|fix|solve|prevent|make sure)/.test(combined);
  const hasLoss = /(lose|loss|damage|cost|failure|fail|risk|income|money|job|work)/.test(
    combined
  );

  let observation =
    "Your mind may be going in circles because it wants certainty before you are ready to have it.";

  if ((hasPast && hasFuture) || (hasMistake && hasFuture)) {
    observation =
      "It sounds like your mind is moving between what already happened and what might happen next. That often creates pressure without giving real direction.";
  } else if (hasPeople) {
    observation =
      "This may feel harder because another person is part of it. When emotions and relationships are involved, thoughts often repeat more than usual.";
  } else if (hasControl) {
    observation =
      "It may be that your mind is trying to feel safer by thinking harder. But more thinking does not always make the next step clearer.";
  } else if (hasLoss) {
    observation =
      "Part of this loop may be fear of losing something important. That can make the mind treat every thought like an emergency.";
  }

  let suggestion =
    "Instead of trying to solve everything, choose one small action that would make the situation feel a little clearer today.";

  if ((hasPast && hasFuture) || (hasMistake && hasFuture)) {
    suggestion =
      "Try separating what has already happened from what has not happened yet. Then choose one small action that belongs only to today.";
  } else if (hasPeople) {
    suggestion =
      "Ask yourself what part of this belongs to you, and what belongs to the other person. Clearer boundaries often reduce the loop.";
  } else if (hasControl) {
    suggestion =
      "Choose one action you can take today, then let that be enough for now. Direction often returns when the whole problem no longer has to be solved all at once.";
  } else if (hasLoss) {
    suggestion =
      "Write down the real risk in one short sentence. Then write one calm way to check it. Fear often softens when it becomes specific.";
  }

  return { observation, suggestion };
}

export default function DirectionPage() {
  const [thought, setThought] = useState("");
  const [fear, setFear] = useState("");
  const [reflecting, setReflecting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const result = useMemo(() => generateDirectionInsight(thought, fear), [thought, fear]);

  function handleSubmit() {
    if (!thought.trim()) {
      setValidationMessage("Write a little more so Direction has something real to work with.");
      setShowResult(false);
      return;
    }

    if (!hasEnoughRealInput(thought, fear)) {
      setValidationMessage(
        "Write a little more about what keeps repeating and what worries you."
      );
      setShowResult(false);
      return;
    }

    setValidationMessage("");
    setShowResult(false);
    setReflecting(true);

    window.setTimeout(() => {
      setReflecting(false);
      setShowResult(true);
    }, 1700);
  }

  const textRail = 32;
  const cardLeftInset = 56;
  const directionButton = "linear-gradient(135deg, #8bc9a1 0%, #6fb789 100%)";
  const responseZoneHeight = 148;

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
              Direction
            </h1>

            <p
              className="solace-body-xl"
              style={{
                margin: 0,
                textAlign: "left",
              }}
            >
              Slow the loop and find a steadier next move.
            </p>
          </div>

          <div style={{ width: "100%" }}>
            <div className="solace-card">
              <div
                className="solace-card-inner solace-surface"
                style={{
                  paddingTop: 28,
                  paddingRight: 28,
                  paddingBottom: 28,
                  paddingLeft: cardLeftInset,
                  background:
                    "linear-gradient(180deg, rgba(232,247,239,0.74) 0%, rgba(255,255,255,0.84) 100%)",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gap: 18,
                    width: "100%",
                    transform: `translateX(${textRail - cardLeftInset}px)`,
                  }}
                >
                  <div
                    className="solace-grid"
                    style={{
                      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                      gap: 16,
                      width: "100%",
                    }}
                  >
                    <div style={{ display: "grid", gap: 12 }}>
                      <label
                        htmlFor="direction-thought"
                        className="solace-h3"
                        style={{ textAlign: "left", margin: 0 }}
                      >
                        What thought keeps repeating?
                      </label>

                      <textarea
                        id="direction-thought"
                        className="solace-textarea"
                        placeholder="I keep replaying whether I made the wrong decision..."
                        value={thought}
                        onChange={(e) => setThought(e.target.value)}
                        style={{
                          minHeight: 150,
                          width: "100%",
                          background: "rgba(255,255,255,0.88)",
                        }}
                      />
                    </div>

                    <div style={{ display: "grid", gap: 12 }}>
                      <label
                        htmlFor="direction-fear"
                        className="solace-h3"
                        style={{ textAlign: "left", margin: 0 }}
                      >
                        What are you afraid might happen?
                      </label>

                      <textarea
                        id="direction-fear"
                        className="solace-textarea"
                        placeholder="I’m worried this could create bigger problems later..."
                        value={fear}
                        onChange={(e) => setFear(e.target.value)}
                        style={{
                          minHeight: 150,
                          width: "100%",
                          background: "rgba(255,255,255,0.88)",
                        }}
                      />
                    </div>
                  </div>

                  {validationMessage ? (
                    <p
                      className="solace-body"
                      style={{
                        margin: 0,
                        color: "#5b6a63",
                        maxWidth: 680,
                      }}
                    >
                      {validationMessage}
                    </p>
                  ) : null}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      width: "100%",
                    }}
                  >
                    <SolaceButton background={directionButton} onClick={handleSubmit}>
                      Find direction
                    </SolaceButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ width: "100%" }}>
            {reflecting ? (
              <div className="solace-card">
                <div
                  className="solace-card-inner solace-surface"
                  style={{
                    padding: 16,
                    minHeight: responseZoneHeight,
                    background:
                      "linear-gradient(180deg, rgba(232,247,239,0.64) 0%, rgba(255,255,255,0.88) 100%)",
                  }}
                >
                  <div
                    style={{
                      minHeight: "100%",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <div
                      aria-hidden="true"
                      style={{
                        width: 124,
                        height: 124,
                        borderRadius: "999px",
                        background:
                          "radial-gradient(circle at 30% 24%, #ffffff 0%, #f3fff5 8%, #ddfae4 18%, #b8ecc7 34%, #87d6a2 54%, #5fb47d 76%, #3f8e5d 100%)",
                        boxShadow:
                          "0 0 0 20px rgba(111, 190, 141, 0.18), 0 0 78px rgba(103, 185, 132, 0.38)",
                        animation: "breathe 2.05s ease-in-out infinite",
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : showResult ? (
              <div
                className="solace-grid"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 14,
                  width: "100%",
                }}
              >
                <div className="solace-card">
                  <div
                    className="solace-card-inner solace-surface"
                    style={{
                      padding: 12,
                      background:
                        "linear-gradient(180deg, rgba(232,247,239,0.64) 0%, rgba(255,255,255,0.88) 100%)",
                      minHeight: responseZoneHeight,
                    }}
                  >
                    <div
                      className="solace-result"
                      style={{
                        padding: 14,
                        textAlign: "left",
                        minHeight: "100%",
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
                  </div>
                </div>

                <div className="solace-card">
                  <div
                    className="solace-card-inner solace-surface"
                    style={{
                      padding: 12,
                      background:
                        "linear-gradient(180deg, rgba(232,247,239,0.64) 0%, rgba(255,255,255,0.88) 100%)",
                      minHeight: responseZoneHeight,
                    }}
                  >
                    <div
                      className="solace-result"
                      style={{
                        padding: 14,
                        textAlign: "left",
                        minHeight: "100%",
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
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  minHeight: responseZoneHeight,
                }}
              />
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}