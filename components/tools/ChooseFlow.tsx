"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";

type PriorityKey =
  | "stability"
  | "growth"
  | "freedom"
  | "financial-security"
  | "timing"
  | "relationships"
  | "energy";

type DecisionOutput = {
  title: string;
  insight: string;
  nextStep: string;
};

const priorityOptions: { key: PriorityKey; label: string }[] = [
  { key: "stability", label: "Stability" },
  { key: "growth", label: "Growth" },
  { key: "freedom", label: "Freedom" },
  { key: "financial-security", label: "Financial security" },
  { key: "timing", label: "Timing" },
  { key: "relationships", label: "Relationships" },
  { key: "energy", label: "Energy" },
];

const flowCardStyle: CSSProperties = {
  marginTop: 28,
  borderRadius: 34,
  border: "1px solid rgba(139,173,242,0.3)",
  background: "rgba(219,232,255,0.34)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  boxShadow: "0 18px 40px rgba(168,154,228,0.07)",
  padding: "30px 30px 32px",
};

const sectionLabelStyle: CSSProperties = {
  margin: 0,
  fontSize: 12,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "rgba(79,92,132,0.56)",
};

const sectionTitleStyle: CSSProperties = {
  margin: "12px 0 0",
  fontSize: "clamp(22px,2.1vw,30px)",
  fontWeight: 700,
  color: "#161b29",
};

const textAreaStyle: CSSProperties = {
  width: "100%",
  marginTop: 14,
  minHeight: 136,
  borderRadius: 24,
  border: "1px solid rgba(255,255,255,0.6)",
  background: "rgba(255,255,255,0.46)",
  padding: "18px",
  fontSize: 16,
  lineHeight: 1.75,
  outline: "none",
  resize: "vertical",
  boxSizing: "border-box",
};

const optionInputStyle: CSSProperties = {
  width: "100%",
  marginTop: 12,
  border: "none",
  background: "transparent",
  fontSize: 18,
  outline: "none",
};

const chipBaseStyle: CSSProperties = {
  display: "inline-flex",
  padding: "10px 16px",
  borderRadius: 999,
  border: "1px solid rgba(109,156,246,0.24)",
  background: "rgba(255,255,255,0.4)",
  fontSize: 14,
  cursor: "pointer",
};

export default function ChooseFlow() {
  const [isSettled, setIsSettled] = useState(false);
  const [situation, setSituation] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [priorities, setPriorities] = useState<PriorityKey[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => setIsSettled(true), 1800);
    return () => clearTimeout(timeout);
  }, []);

  function togglePriority(key: PriorityKey) {
    setPriorities((current) => {
      if (current.includes(key)) {
        return current.filter((p) => p !== key);
      }
      if (current.length >= 3) return current;
      return [...current, key];
    });
  }

  return (
    <div>
      {!isSettled ? (
        <div
          style={{
            marginTop: 40,
            minHeight: 260,
            borderRadius: 34,
            border: "1px solid rgba(255,255,255,0.46)",
            background: "rgba(255,255,255,0.16)",
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="settle-orb" />

          <p
            style={{
              marginTop: 20,
              fontSize: 16,
              color: "rgba(79,92,132,0.76)",
            }}
          >
            Take a breath. You do not need to solve everything at once.
          </p>

          <style jsx>{`
            .settle-orb {
              width: 92px;
              height: 92px;
              border-radius: 999px;
              background: radial-gradient(
                circle at 35% 30%,
                white,
                rgba(186, 155, 255, 0.7),
                rgba(186, 155, 255, 0.1)
              );
              animation: breathe 6s ease-in-out infinite;
            }

            @keyframes breathe {
              0% {
                transform: scale(0.9);
              }
              50% {
                transform: scale(1.1);
              }
              100% {
                transform: scale(0.9);
              }
            }
          `}</style>
        </div>
      ) : (
        <div style={flowCardStyle}>
          <p style={sectionLabelStyle}>Step 1</p>

          <h3 style={sectionTitleStyle}>Briefly describe the decision.</h3>

          <textarea
            style={textAreaStyle}
            placeholder="I’m deciding whether to..."
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
          />

          <div
            style={{
              marginTop: 24,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 18,
            }}
          >
            <div>
              <p style={sectionLabelStyle}>Option A</p>
              <input
                style={optionInputStyle}
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                placeholder="First option"
              />
            </div>

            <div>
              <p style={sectionLabelStyle}>Option B</p>
              <input
                style={optionInputStyle}
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                placeholder="Second option"
              />
            </div>
          </div>

          <div style={{ marginTop: 26 }}>
            <p style={sectionLabelStyle}>What matters most</p>

            <div
              style={{
                marginTop: 14,
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              {priorityOptions.map((p) => (
                <button
                  key={p.key}
                  style={chipBaseStyle}
                  onClick={() => togglePriority(p.key)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}