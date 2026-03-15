"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type ThoughtBubble = {
  id: string;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  diameter: number;
  hue: "lilac" | "mint" | "teal" | "sage" | "pearl";
};

type SolaceApiResponse = {
  ok: boolean;
  message: string;
  nextTool?: "slow-down" | "choose" | "signal-vs-noise";
};

const FIELD_WIDTH = 1000;
const FIELD_HEIGHT = 258;

const toolCardStyle: CSSProperties = {
  marginTop: 34,
  borderRadius: 34,
  border: "1px solid rgba(147,184,165,0.38)",
  background: "rgba(226,239,233,0.74)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  boxShadow: "0 18px 40px rgba(119,151,132,0.08)",
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
  color: "rgba(76,96,89,0.88)",
};

const inputRowStyle: CSSProperties = {
  marginTop: 22,
  display: "flex",
  alignItems: "center",
  gap: 14,
  flexWrap: "wrap",
};

const thoughtInputStyle: CSSProperties = {
  flex: 1,
  minWidth: 280,
  minHeight: 56,
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.74)",
  background: "rgba(255,255,255,0.6)",
  padding: "0 18px",
  fontSize: 16,
  lineHeight: 1.2,
  color: "#161b29",
  outline: "none",
  boxSizing: "border-box",
};

const helperTextStyle: CSSProperties = {
  margin: "12px 0 0",
  fontSize: 14,
  lineHeight: 1.8,
  color: "rgba(76,96,89,0.72)",
};

const bubbleFieldStyle: CSSProperties = {
  marginTop: 22,
  position: "relative",
  minHeight: FIELD_HEIGHT,
  borderRadius: 28,
  border: "1px solid rgba(184,211,196,0.74)",
  background:
    "radial-gradient(circle at 50% 38%, rgba(243,249,246,0.96) 0%, rgba(235,244,239,0.92) 44%, rgba(226,237,231,0.9) 100%)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.62), 0 14px 30px rgba(120,155,136,0.06)",
  overflow: "hidden",
};

const emptyFieldTextStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px",
  textAlign: "center",
  fontSize: 16,
  lineHeight: 1.9,
  color: "rgba(92,113,105,0.62)",
};

const reflectionBoxStyle: CSSProperties = {
  marginTop: 28,
  borderRadius: 26,
  border: "1px solid rgba(163,199,179,0.82)",
  background: "rgba(255,255,255,0.34)",
  boxShadow:
    "0 10px 24px rgba(120,155,136,0.08), inset 0 1px 0 rgba(255,255,255,0.36)",
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
  border: "1px solid rgba(76, 124, 105, 0.96)",
  color: "#ffffff",
  background:
    "linear-gradient(180deg, rgba(104,156,132,1) 0%, rgba(78,128,107,1) 100%)",
  boxShadow:
    "0 14px 28px rgba(78,128,107,0.22), inset 0 1px 0 rgba(255,255,255,0.22)",
  transition:
    "transform 140ms ease, background 140ms ease, box-shadow 140ms ease, border-color 140ms ease, opacity 140ms ease",
};

const actionButtonHoverStyle: CSSProperties = {
  border: "1px solid rgba(64,108,91,1)",
  background:
    "linear-gradient(180deg, rgba(94,146,122,1) 0%, rgba(70,118,99,1) 100%)",
  boxShadow:
    "0 18px 32px rgba(70,118,99,0.28), inset 0 1px 0 rgba(255,255,255,0.2)",
  transform: "translateY(-1px)",
};

const actionButtonPressedStyle: CSSProperties = {
  border: "1px solid rgba(56,94,80,1)",
  background:
    "linear-gradient(180deg, rgba(68,110,94,1) 0%, rgba(56,94,80,1) 100%)",
  boxShadow:
    "inset 0 4px 10px rgba(0,0,0,0.2), 0 6px 12px rgba(56,94,80,0.16)",
  transform: "translateY(1px)",
};

const actionButtonDisabledStyle: CSSProperties = {
  border: "1px solid rgba(159,188,177,0.56)",
  background:
    "linear-gradient(180deg, rgba(182,210,199,0.9) 0%, rgba(164,194,182,0.9) 100%)",
  color: "rgba(255,255,255,0.9)",
  boxShadow: "none",
  cursor: "default",
  opacity: 0.78,
};

const secondaryAddButtonStyle: CSSProperties = {
  minHeight: 56,
  padding: "0 18px",
  borderRadius: 999,
  fontSize: 15,
  lineHeight: 1.2,
  fontWeight: 700,
  letterSpacing: "-0.01em",
  cursor: "pointer",
  border: "1px solid rgba(152,184,170,0.72)",
  color: "rgba(76,96,89,0.9)",
  background:
    "linear-gradient(180deg, rgba(238,246,242,0.94) 0%, rgba(224,236,230,0.92) 100%)",
  boxShadow:
    "0 8px 16px rgba(120,155,136,0.08), inset 0 1px 0 rgba(255,255,255,0.64)",
  transition:
    "transform 140ms ease, background 140ms ease, box-shadow 140ms ease, border-color 140ms ease, opacity 140ms ease",
};

const secondaryAddHoverStyle: CSSProperties = {
  border: "1px solid rgba(134,170,153,0.82)",
  background:
    "linear-gradient(180deg, rgba(242,249,245,0.98) 0%, rgba(228,240,234,0.96) 100%)",
  boxShadow:
    "0 12px 20px rgba(120,155,136,0.1), inset 0 1px 0 rgba(255,255,255,0.7)",
  transform: "translateY(-1px)",
};

const secondaryAddPressedStyle: CSSProperties = {
  border: "1px solid rgba(124,160,145,0.92)",
  background:
    "linear-gradient(180deg, rgba(224,236,230,0.98) 0%, rgba(214,229,221,0.96) 100%)",
  boxShadow:
    "inset 0 4px 10px rgba(0,0,0,0.08), 0 6px 12px rgba(120,155,136,0.08)",
  transform: "translateY(1px)",
};

const secondaryAddDisabledStyle: CSSProperties = {
  border: "1px solid rgba(184,204,196,0.62)",
  background:
    "linear-gradient(180deg, rgba(236,242,239,0.92) 0%, rgba(228,236,232,0.9) 100%)",
  color: "rgba(120,141,133,0.72)",
  boxShadow: "none",
  cursor: "default",
  opacity: 0.82,
};

function makeBubble(text: string, index: number): ThoughtBubble {
  const diameterOptions = [104, 120, 138, 112, 128];
  const hueOptions: ThoughtBubble["hue"][] = ["lilac", "mint", "teal", "sage", "pearl"];
  const diameter = diameterOptions[index % diameterOptions.length];
  const x = 120 + (index * 157) % (FIELD_WIDTH - 240);
  const y = 76 + (index * 97) % (FIELD_HEIGHT - 152);

  return {
    id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    x,
    y,
    vx: (index % 2 === 0 ? 1 : -1) * (0.62 + (index % 3) * 0.11),
    vy: (index % 3 === 0 ? 1 : -1) * (0.52 + (index % 4) * 0.1),
    diameter,
    hue: hueOptions[index % hueOptions.length],
  };
}

function getBubbleVisuals(hue: ThoughtBubble["hue"]) {
  switch (hue) {
    case "lilac":
      return {
        rim: "rgba(214,168,255,0.68)",
        text: "rgba(78,89,116,0.98)",
        background: `
          radial-gradient(circle at 34% 28%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.88) 10%, rgba(245,233,255,0.9) 28%, rgba(227,202,255,0.64) 54%, rgba(216,188,255,0.3) 74%, rgba(255,255,255,0.14) 100%),
          radial-gradient(circle at 76% 76%, rgba(193,255,230,0.34) 0%, transparent 30%),
          radial-gradient(circle at 78% 26%, rgba(255,182,230,0.38) 0%, transparent 24%)
        `,
      };
    case "mint":
      return {
        rim: "rgba(157,214,182,0.68)",
        text: "rgba(66,96,86,0.98)",
        background: `
          radial-gradient(circle at 34% 28%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.88) 10%, rgba(236,255,244,0.9) 30%, rgba(193,244,214,0.62) 54%, rgba(167,225,191,0.28) 74%, rgba(255,255,255,0.14) 100%),
          radial-gradient(circle at 74% 74%, rgba(176,255,228,0.34) 0%, transparent 30%),
          radial-gradient(circle at 24% 78%, rgba(219,255,187,0.26) 0%, transparent 22%)
        `,
      };
    case "teal":
      return {
        rim: "rgba(155,207,212,0.68)",
        text: "rgba(70,96,101,0.98)",
        background: `
          radial-gradient(circle at 34% 28%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.88) 10%, rgba(235,250,251,0.9) 30%, rgba(183,231,235,0.64) 54%, rgba(159,213,219,0.3) 74%, rgba(255,255,255,0.14) 100%),
          radial-gradient(circle at 74% 72%, rgba(167,255,244,0.34) 0%, transparent 28%),
          radial-gradient(circle at 28% 80%, rgba(201,255,214,0.24) 0%, transparent 20%)
        `,
      };
    case "sage":
      return {
        rim: "rgba(177,204,167,0.68)",
        text: "rgba(84,101,82,0.98)",
        background: `
          radial-gradient(circle at 34% 28%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.86) 10%, rgba(242,249,238,0.9) 30%, rgba(208,229,191,0.62) 54%, rgba(191,216,169,0.3) 74%, rgba(255,255,255,0.14) 100%),
          radial-gradient(circle at 74% 70%, rgba(222,255,178,0.3) 0%, transparent 26%),
          radial-gradient(circle at 28% 82%, rgba(181,255,220,0.22) 0%, transparent 20%)
        `,
      };
    default:
      return {
        rim: "rgba(212,212,220,0.68)",
        text: "rgba(96,100,112,0.98)",
        background: `
          radial-gradient(circle at 34% 28%, rgba(255,255,255,0.99) 0%, rgba(255,255,255,0.9) 10%, rgba(247,248,251,0.9) 30%, rgba(224,228,235,0.58) 54%, rgba(214,218,226,0.28) 74%, rgba(255,255,255,0.14) 100%),
          radial-gradient(circle at 72% 74%, rgba(214,168,255,0.2) 0%, transparent 24%),
          radial-gradient(circle at 28% 80%, rgba(167,255,244,0.18) 0%, transparent 20%)
        `,
      };
  }
}

function getBubbleStyle(bubble: ThoughtBubble, subdued: boolean): CSSProperties {
  const visuals = getBubbleVisuals(bubble.hue);

  return {
    position: "absolute",
    left: `${bubble.x}px`,
    top: `${bubble.y}px`,
    width: `${bubble.diameter}px`,
    height: `${bubble.diameter}px`,
    transform: "translate(-50%, -50%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    boxSizing: "border-box",
    textAlign: "center",
    lineHeight: 1.22,
    fontSize: bubble.diameter >= 132 ? 16 : bubble.diameter >= 116 ? 15 : 14,
    fontWeight: 600,
    color: visuals.text,
    background: visuals.background,
    border: `1px solid ${visuals.rim}`,
    boxShadow:
      "0 14px 24px rgba(120,155,136,0.08), inset 0 1px 0 rgba(255,255,255,0.92), inset 0 -10px 18px rgba(255,255,255,0.12)",
    opacity: subdued ? 0.76 : 1,
    pointerEvents: "none",
    overflow: "hidden",
  };
}

export default function SlowDownFlow() {
  const [thoughtInput, setThoughtInput] = useState("");
  const [bubbles, setBubbles] = useState<ThoughtBubble[]>([]);
  const [hasResponded, setHasResponded] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const timerRef = useRef<number | null>(null);

  const [hoverAction, setHoverAction] = useState(false);
  const [pressAction, setPressAction] = useState(false);
  const [hoverReset, setHoverReset] = useState(false);
  const [pressReset, setPressReset] = useState(false);
  const [hoverAdd, setHoverAdd] = useState(false);
  const [pressAdd, setPressAdd] = useState(false);

  const canRespond = useMemo(() => bubbles.length > 0 && !isLoading, [bubbles.length, isLoading]);
  const canAdd = thoughtInput.trim().length > 0 && !isLoading;

  function addThought() {
    const trimmed = thoughtInput.trim();
    if (!trimmed || isLoading) return;

    setBubbles((current) => [...current, makeBubble(trimmed, current.length)]);
    setThoughtInput("");
    setHasResponded(false);
    setResponseMessage("");
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addThought();
    }
  }

  async function handleRespond() {
    if (!canRespond) return;

    try {
      setIsLoading(true);
      setResponseMessage("");
      setHasResponded(false);

      const response = await fetch("/api/solace/slow-down", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          thoughts: bubbles.map((bubble) => bubble.text),
        }),
      });

      const data = (await response.json()) as SolaceApiResponse;

      if (!data.ok) {
        setResponseMessage(
          data.message ||
            "Something interrupted the reflection for a moment. Please try again."
        );
        setHasResponded(true);
        return;
      }

      setResponseMessage(data.message);
      setHasResponded(true);
    } catch (error) {
      console.error("Slow Down fetch error:", error);
      setResponseMessage(
        "Something interrupted the reflection for a moment. Please try again."
      );
      setHasResponded(true);
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setThoughtInput("");
    setBubbles([]);
    setHasResponded(false);
    setResponseMessage("");
    setIsLoading(false);
    setHoverReset(false);
    setPressReset(false);
  }

  useEffect(() => {
    if (bubbles.length === 0) return;

    const tick = () => {
      setBubbles((current) => {
        if (current.length === 0) return current;

        const speedFactor = hasResponded ? 0.64 : 1;
        const next = current.map((bubble) => ({
          ...bubble,
          x: bubble.x + bubble.vx * speedFactor,
          y: bubble.y + bubble.vy * speedFactor,
        }));

        for (const bubble of next) {
          const r = bubble.diameter / 2;

          if (bubble.x - r <= 10 || bubble.x + r >= FIELD_WIDTH - 10) {
            bubble.vx *= -1;
            bubble.x = Math.max(r + 10, Math.min(FIELD_WIDTH - r - 10, bubble.x));
          }

          if (bubble.y - r <= 10 || bubble.y + r >= FIELD_HEIGHT - 10) {
            bubble.vy *= -1;
            bubble.y = Math.max(r + 10, Math.min(FIELD_HEIGHT - r - 10, bubble.y));
          }
        }

        for (let i = 0; i < next.length; i += 1) {
          for (let j = i + 1; j < next.length; j += 1) {
            const a = next[i];
            const b = next[j];

            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 0.001;
            const minDistance = a.diameter / 2 + b.diameter / 2 + 6;

            if (distance < minDistance) {
              const nx = dx / distance;
              const ny = dy / distance;
              const overlap = minDistance - distance;

              a.x -= nx * (overlap * 0.6);
              a.y -= ny * (overlap * 0.6);
              b.x += nx * (overlap * 0.6);
              b.y += ny * (overlap * 0.6);

              const relativeVx = b.vx - a.vx;
              const relativeVy = b.vy - a.vy;
              const separatingVelocity = relativeVx * nx + relativeVy * ny;

              if (separatingVelocity < 0) {
                const restitution = 1.08;
                const impulse = (-(1 + restitution) * separatingVelocity) / 2;

                a.vx -= impulse * nx;
                a.vy -= impulse * ny;
                b.vx += impulse * nx;
                b.vy += impulse * ny;
              }

              const push = 0.06;
              a.vx -= nx * push;
              a.vy -= ny * push;
              b.vx += nx * push;
              b.vy += ny * push;
            }
          }
        }

        for (const bubble of next) {
          const speed = Math.sqrt(bubble.vx * bubble.vx + bubble.vy * bubble.vy);

          if (speed < 0.5) {
            const factor = 0.5 / (speed || 0.001);
            bubble.vx *= factor;
            bubble.vy *= factor;
          }

          if (speed > 1.7) {
            const factor = 1.7 / speed;
            bubble.vx *= factor;
            bubble.vy *= factor;
          }

          bubble.vx *= 0.999;
          bubble.vy *= 0.999;
        }

        return next;
      });

      timerRef.current = window.setTimeout(tick, 16) as unknown as number;
    };

    timerRef.current = window.setTimeout(tick, 16) as unknown as number;

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [bubbles.length, hasResponded]);

  const actionStyle: CSSProperties = !canRespond
    ? { ...actionButtonBaseStyle, ...actionButtonDisabledStyle }
    : pressAction
    ? { ...actionButtonBaseStyle, ...actionButtonPressedStyle }
    : hoverAction
    ? { ...actionButtonBaseStyle, ...actionButtonHoverStyle }
    : actionButtonBaseStyle;

  const resetStyle: CSSProperties = pressReset
    ? { ...actionButtonBaseStyle, ...actionButtonPressedStyle }
    : hoverReset
    ? { ...actionButtonBaseStyle, ...actionButtonHoverStyle }
    : actionButtonBaseStyle;

  const addStyle: CSSProperties = !canAdd
    ? {
        ...secondaryAddButtonStyle,
        ...secondaryAddDisabledStyle,
      }
    : pressAdd
    ? {
        ...secondaryAddButtonStyle,
        ...secondaryAddPressedStyle,
      }
    : hoverAdd
    ? {
        ...secondaryAddButtonStyle,
        ...secondaryAddHoverStyle,
      }
    : secondaryAddButtonStyle;

  return (
    <>
      <div style={toolCardStyle}>
        <h2 style={titleStyle}>What feels loud in your mind right now?</h2>

        <p style={bodyStyle}>
          Drop one thought at a time. Press Enter after each one.
        </p>

        <div style={inputRowStyle}>
          <input
            type="text"
            style={thoughtInputStyle}
            value={thoughtInput}
            placeholder="Type a thought and press Enter"
            onChange={(e) => setThoughtInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={addThought}
            disabled={!canAdd}
            style={addStyle}
            onMouseEnter={() => canAdd && setHoverAdd(true)}
            onMouseLeave={() => {
              setHoverAdd(false);
              setPressAdd(false);
            }}
            onMouseDown={() => canAdd && setPressAdd(true)}
            onMouseUp={() => setPressAdd(false)}
          >
            Add
          </button>
        </div>

        <p style={helperTextStyle}>
          Let the thoughts sit outside your head for a moment.
        </p>

        <div style={bubbleFieldStyle}>
          {bubbles.length === 0 ? (
            <div style={emptyFieldTextStyle}>
              Nothing has been dropped here yet. Add one thought at a time and
              watch them settle into the space.
            </div>
          ) : null}

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 50% 82%, rgba(197,223,209,0.42) 0%, rgba(197,223,209,0.14) 28%, transparent 60%)",
              pointerEvents: "none",
            }}
          />

          {bubbles.map((bubble) => (
            <div key={bubble.id} style={getBubbleStyle(bubble, hasResponded || isLoading)}>
              <span
                style={{
                  position: "relative",
                  zIndex: 2,
                  display: "-webkit-box",
                  WebkitLineClamp: bubble.diameter >= 128 ? 4 : 3,
                  WebkitBoxOrient: "vertical" as const,
                  overflow: "hidden",
                  textWrap: "balance",
                }}
              >
                {bubble.text}
              </span>

              <div
                style={{
                  position: "absolute",
                  top: "12%",
                  left: "14%",
                  width: bubble.diameter * 0.18,
                  height: bubble.diameter * 0.18,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.84)",
                  filter: "blur(1px)",
                  opacity: 0.96,
                }}
              />

              <div
                style={{
                  position: "absolute",
                  top: "16%",
                  left: "21%",
                  width: bubble.diameter * 0.08,
                  height: bubble.diameter * 0.08,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.72)",
                  opacity: 0.9,
                }}
              />

              <div
                style={{
                  position: "absolute",
                  inset: "10%",
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.3)",
                  opacity: 0.74,
                }}
              />
            </div>
          ))}
        </div>

        {!hasResponded ? (
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
              onClick={handleRespond}
              disabled={!canRespond}
              onMouseEnter={() => canRespond && setHoverAction(true)}
              onMouseLeave={() => {
                setHoverAction(false);
                setPressAction(false);
              }}
              onMouseDown={() => canRespond && setPressAction(true)}
              onMouseUp={() => setPressAction(false)}
              style={actionStyle}
            >
              {isLoading ? "Reflecting..." : "Help me slow this down"}
            </button>
          </div>
        ) : null}

        {hasResponded ? (
          <div style={reflectionBoxStyle}>
            <p
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.95,
                color: "rgba(76,96,89,0.86)",
              }}
            >
              {responseMessage}
            </p>
          </div>
        ) : null}
      </div>

      {hasResponded ? (
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
            onMouseEnter={() => setHoverReset(true)}
            onMouseLeave={() => {
              setHoverReset(false);
              setPressReset(false);
            }}
            onMouseDown={() => setPressReset(true)}
            onMouseUp={() => setPressReset(false)}
            style={resetStyle}
          >
            Explore another thought
          </button>
        </div>
      ) : null}
    </>
  );
}