"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

type SolaceApiResponse = {
  ok: boolean;
  message: string;
  nextTool?: "slow-down" | "choose" | "signal-vs-noise";
};

const toolCardStyle: CSSProperties = {
  marginTop: 34,
  borderRadius: 34,
  border: "1px solid rgba(168,196,182,0.42)",
  background: "rgba(231,241,235,0.72)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  boxShadow: "0 18px 40px rgba(112,139,121,0.08)",
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
  color: "rgba(86,104,94,0.86)",
};

const inputWrapStyle: CSSProperties = {
  marginTop: 22,
};

const textareaStyle: CSSProperties = {
  width: "100%",
  minHeight: 172,
  borderRadius: 28,
  border: "1px solid rgba(255,255,255,0.76)",
  background: "rgba(255,255,255,0.56)",
  padding: "22px 22px 24px",
  fontSize: 16,
  lineHeight: 1.8,
  color: "#161b29",
  outline: "none",
  resize: "vertical",
  boxSizing: "border-box",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.56)",
};

const responseBoxStyle: CSSProperties = {
  marginTop: 28,
  borderRadius: 28,
  border: "1px solid rgba(145,176,156,0.86)",
  background: "rgba(255,255,255,0.34)",
  boxShadow:
    "0 10px 24px rgba(120,155,136,0.08), inset 0 1px 0 rgba(255,255,255,0.34)",
  padding: "24px 28px 26px",
};

const primaryButtonBaseStyle: CSSProperties = {
  minHeight: 60,
  padding: "0 28px",
  borderRadius: 999,
  fontSize: 16,
  lineHeight: 1.2,
  fontWeight: 700,
  letterSpacing: "-0.01em",
  cursor: "pointer",
  border: "1px solid rgba(76,124,105,0.96)",
  color: "#ffffff",
  background:
    "linear-gradient(180deg, rgba(104,156,132,1) 0%, rgba(78,128,107,1) 100%)",
  boxShadow:
    "0 14px 28px rgba(78,128,107,0.22), inset 0 1px 0 rgba(255,255,255,0.22)",
  transition:
    "transform 140ms ease, background 140ms ease, box-shadow 140ms ease, border-color 140ms ease, opacity 140ms ease",
};

const primaryButtonHoverStyle: CSSProperties = {
  border: "1px solid rgba(64,108,91,1)",
  background:
    "linear-gradient(180deg, rgba(94,146,122,1) 0%, rgba(70,118,99,1) 100%)",
  boxShadow:
    "0 18px 32px rgba(70,118,99,0.28), inset 0 1px 0 rgba(255,255,255,0.2)",
  transform: "translateY(-1px)",
};

const primaryButtonPressedStyle: CSSProperties = {
  border: "1px solid rgba(56,94,80,1)",
  background:
    "linear-gradient(180deg, rgba(68,110,94,1) 0%, rgba(56,94,80,1) 100%)",
  boxShadow:
    "inset 0 4px 10px rgba(0,0,0,0.2), 0 6px 12px rgba(56,94,80,0.16)",
  transform: "translateY(1px)",
};

const primaryButtonDisabledStyle: CSSProperties = {
  border: "1px solid rgba(174,197,185,0.56)",
  background:
    "linear-gradient(180deg, rgba(189,211,201,0.9) 0%, rgba(173,196,186,0.9) 100%)",
  color: "rgba(255,255,255,0.9)",
  boxShadow: "none",
  cursor: "default",
  opacity: 0.8,
};

export default function ChooseFlow() {
  const [decision, setDecision] = useState("");
  const [hasResponded, setHasResponded] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [hoverPrimary, setHoverPrimary] = useState(false);
  const [pressPrimary, setPressPrimary] = useState(false);
  const [hoverReset, setHoverReset] = useState(false);
  const [pressReset, setPressReset] = useState(false);

  const canReflect = useMemo(
    () => decision.trim().length > 0 && !isLoading,
    [decision, isLoading]
  );

  async function handleReflect() {
    if (!canReflect) return;

    try {
      setIsLoading(true);
      setHasResponded(false);
      setResponseMessage("");

      const response = await fetch("/api/solace/choose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          decision: decision.trim(),
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
      console.error("Choose fetch error:", error);
      setResponseMessage(
        "Something interrupted the reflection for a moment. Please try again."
      );
      setHasResponded(true);
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setDecision("");
    setHasResponded(false);
    setResponseMessage("");
    setIsLoading(false);
    setHoverReset(false);
    setPressReset(false);
  }

  const primaryButtonStyle: CSSProperties = !canReflect
    ? { ...primaryButtonBaseStyle, ...primaryButtonDisabledStyle }
    : pressPrimary
    ? { ...primaryButtonBaseStyle, ...primaryButtonPressedStyle }
    : hoverPrimary
    ? { ...primaryButtonBaseStyle, ...primaryButtonHoverStyle }
    : primaryButtonBaseStyle;

  const resetButtonStyle: CSSProperties = pressReset
    ? { ...primaryButtonBaseStyle, ...primaryButtonPressedStyle }
    : hoverReset
    ? { ...primaryButtonBaseStyle, ...primaryButtonHoverStyle }
    : primaryButtonBaseStyle;

  return (
    <>
      <div style={toolCardStyle}>
        <h2 style={titleStyle}>What decision are you facing?</h2>

        <p style={bodyStyle}>
          Write it in the simplest way you can. You do not need to explain
          everything.
        </p>

        <div style={inputWrapStyle}>
          <textarea
            value={decision}
            onChange={(event) => {
              setDecision(event.target.value);
              if (hasResponded) {
                setHasResponded(false);
                setResponseMessage("");
              }
            }}
            placeholder="I’m deciding whether to..."
            disabled={isLoading}
            style={textareaStyle}
          />
        </div>

        {!hasResponded ? (
          <div
            style={{
              marginTop: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <button
              type="button"
              onClick={handleReflect}
              disabled={!canReflect}
              style={primaryButtonStyle}
              onMouseEnter={() => canReflect && setHoverPrimary(true)}
              onMouseLeave={() => {
                setHoverPrimary(false);
                setPressPrimary(false);
              }}
              onMouseDown={() => canReflect && setPressPrimary(true)}
              onMouseUp={() => setPressPrimary(false)}
            >
              {isLoading ? "Reflecting..." : "See this more clearly"}
            </button>
          </div>
        ) : null}

        {hasResponded ? (
          <div style={responseBoxStyle}>
            <p
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.95,
                color: "rgba(86,104,94,0.86)",
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
            style={resetButtonStyle}
            onMouseEnter={() => setHoverReset(true)}
            onMouseLeave={() => {
              setHoverReset(false);
              setPressReset(false);
            }}
            onMouseDown={() => setPressReset(true)}
            onMouseUp={() => setPressReset(false)}
          >
            Explore another decision
          </button>
        </div>
      ) : null}
    </>
  );
}