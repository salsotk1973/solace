"use client";

import { useMemo, useState } from "react";

type ToolContainerProps = {
  toolSlug: string;
  title: string;
  description: string;
};

type ReflectApiResponse = {
  reflection?: string[];
  error?: string;
};

type ReflectionEntry = {
  question: string;
  reflection: string[];
  feedback?: "helpful" | "not-quite" | null;
};

function getToolTheme(toolSlug: string) {
  if (toolSlug === "clarity") {
    return {
      border: "rgba(96, 165, 250, 0.95)",
      borderSoft: "rgba(147, 197, 253, 0.72)",
      fill: "rgba(219, 234, 254, 0.58)",
      fillStrong: "rgba(191, 219, 254, 0.58)",
      glow: "rgba(96, 165, 250, 0.14)",
      orbTop: "rgba(191, 219, 254, 1)",
      orbBottom: "rgba(96, 165, 250, 1)",
      orbBorder: "rgba(59, 130, 246, 0.75)",
      thinkingBg:
        "radial-gradient(circle at 50% 40%, rgba(191,219,254,0.56) 0%, rgba(236,246,255,0.94) 54%, rgba(255,255,255,0.98) 100%)",
    };
  }

  if (toolSlug === "overthinking-reset") {
    return {
      border: "rgba(74, 222, 128, 0.95)",
      borderSoft: "rgba(134, 239, 172, 0.72)",
      fill: "rgba(220, 252, 231, 0.58)",
      fillStrong: "rgba(187, 247, 208, 0.58)",
      glow: "rgba(74, 222, 128, 0.14)",
      orbTop: "rgba(187, 247, 208, 1)",
      orbBottom: "rgba(74, 222, 128, 1)",
      orbBorder: "rgba(34, 197, 94, 0.75)",
      thinkingBg:
        "radial-gradient(circle at 50% 40%, rgba(187,247,208,0.56) 0%, rgba(236,253,245,0.94) 54%, rgba(255,255,255,0.98) 100%)",
    };
  }

  return {
    border: "rgba(192, 132, 252, 0.95)",
    borderSoft: "rgba(216, 180, 254, 0.72)",
    fill: "rgba(243, 232, 255, 0.6)",
    fillStrong: "rgba(233, 213, 255, 0.58)",
    glow: "rgba(192, 132, 252, 0.14)",
    orbTop: "rgba(233, 213, 255, 1)",
    orbBottom: "rgba(192, 132, 252, 1)",
    orbBorder: "rgba(168, 85, 247, 0.75)",
    thinkingBg:
      "radial-gradient(circle at 50% 40%, rgba(233,213,255,0.56) 0%, rgba(250,245,255,0.94) 54%, rgba(255,255,255,0.98) 100%)",
  };
}

export default function ToolContainer({
  toolSlug,
  title,
  description,
}: ToolContainerProps) {
  const [question, setQuestion] = useState("");
  const [entry, setEntry] = useState<ReflectionEntry | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const theme = getToolTheme(toolSlug);

  const canReflect = useMemo(
    () => question.trim().length > 0 && !isThinking,
    [question, isThinking]
  );

  async function handleReflect() {
    const cleanQuestion = question.trim();

    if (!cleanQuestion || isThinking) return;

    setIsThinking(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/reflect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: cleanQuestion,
          toolSlug,
        }),
      });

      const data = (await response.json()) as ReflectApiResponse;

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong while reflecting.");
      }

      const reflection =
        Array.isArray(data.reflection) && data.reflection.length > 0
          ? data.reflection
          : ["Something went wrong while reflecting."];

      setEntry({
        question: cleanQuestion,
        reflection,
        feedback: null,
      });

      setQuestion("");
    } catch (error: any) {
      setErrorMessage(
        error?.message || "Something went wrong while reflecting."
      );
    } finally {
      setIsThinking(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      handleReflect();
    }
  }

  function setFeedback(feedback: "helpful" | "not-quite") {
    setEntry((current) => (current ? { ...current, feedback } : current));
  }

  function resetReflection() {
    setEntry(null);
    setQuestion("");
    setErrorMessage("");
    setIsThinking(false);
  }

  return (
    <div
      style={{
        display: "grid",
        gap: 28,
        padding: 28,
        borderRadius: 32,
        border: "1px solid rgba(174, 194, 229, 0.9)",
        background:
          "linear-gradient(180deg, rgba(236,241,251,0.96) 0%, rgba(233,238,247,0.96) 100%)",
        boxShadow:
          "0 20px 46px rgba(99, 110, 141, 0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
      }}
    >
      <div style={{ display: "grid", gap: 10 }}>
        <h1
          style={{
            margin: 0,
            fontSize: "3rem",
            lineHeight: 0.95,
            letterSpacing: "-0.055em",
            fontWeight: 650,
            color: "rgb(17,24,39)",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: "1.02rem",
            lineHeight: 1.85,
            color: "rgb(82,82,91)",
            maxWidth: "38rem",
          }}
        >
          {description}
        </p>
      </div>

      {!entry && !isThinking ? (
        <div
          style={{
            display: "grid",
            gap: 14,
            borderRadius: 30,
            background: "rgba(250,250,250,0.92)",
            border: "1px solid rgba(227,227,227,0.92)",
            padding: "22px 22px 18px",
          }}
        >
          <div
            style={{
              fontSize: "0.96rem",
              color: "rgb(120,120,120)",
              fontWeight: 500,
            }}
          >
            Bring one question into view
          </div>

          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Place one decision or tension here"
            rows={4}
            style={{
              width: "100%",
              resize: "vertical",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "1.02rem",
              lineHeight: 1.9,
              color: "rgb(31,41,55)",
              padding: 0,
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={handleReflect}
              disabled={!canReflect}
              style={{
                minWidth: 126,
                minHeight: 66,
                borderRadius: 999,
                border: "1px solid rgba(212,212,216,0.96)",
                background: canReflect
                  ? "rgba(255,255,255,0.96)"
                  : "rgba(245,245,245,0.92)",
                color: canReflect ? "rgb(82,82,91)" : "rgb(161,161,170)",
                fontSize: "1.02rem",
                fontWeight: 500,
                boxShadow: canReflect
                  ? "0 8px 18px rgba(15,23,42,0.05)"
                  : "none",
                cursor: canReflect ? "pointer" : "not-allowed",
              }}
            >
              Reflect
            </button>
          </div>
        </div>
      ) : null}

      {isThinking ? (
        <div
          style={{
            borderRadius: 28,
            background: `linear-gradient(180deg, ${theme.fillStrong} 0%, ${theme.fill} 100%)`,
            border: `1.5px solid ${theme.border}`,
            boxShadow: `0 14px 30px ${theme.glow}`,
            padding: "24px 28px",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: "0.95rem",
                color: "rgb(120,120,120)",
                fontWeight: 500,
              }}
            >
              Solace
            </div>

            <div
              style={{
                minHeight: 118,
                display: "grid",
                placeItems: "center",
                borderRadius: 24,
                background: theme.thinkingBg,
                border: `1px solid ${theme.borderSoft}`,
              }}
            >
              <div
                style={{
                  display: "grid",
                  placeItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 74,
                    height: 74,
                    borderRadius: "999px",
                    background: `radial-gradient(circle at 34% 28%, rgba(255,255,255,0.92) 0 14%, transparent 15%), linear-gradient(180deg, ${theme.orbTop} 0%, ${theme.orbBottom} 100%)`,
                    border: `1px solid ${theme.orbBorder}`,
                    boxShadow: `0 16px 34px ${theme.glow}, inset 0 1px 0 rgba(255,255,255,0.82)`,
                    animation: "solaceBreath 2.6s ease-in-out infinite",
                  }}
                />

                <div
                  style={{
                    fontSize: "1rem",
                    color: "rgb(102,102,120)",
                  }}
                >
                  Solace is reflecting…
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {errorMessage ? (
        <div
          style={{
            borderRadius: 22,
            border: "1px solid rgba(239,68,68,0.2)",
            background: "rgba(254,242,242,0.92)",
            padding: "16px 18px",
            color: "rgb(153,27,27)",
            fontSize: "0.98rem",
            lineHeight: 1.75,
          }}
        >
          {errorMessage}
        </div>
      ) : null}

      {entry ? (
        <div style={{ display: "grid", gap: 18 }}>
          <div
            style={{
              borderRadius: 28,
              background: "rgba(250,250,250,0.92)",
              border: "1px solid rgba(227,227,227,0.92)",
              padding: "22px 28px",
            }}
          >
            <div
              style={{
                fontSize: "0.95rem",
                color: "rgb(120,120,120)",
                marginBottom: 12,
                fontWeight: 500,
              }}
            >
              You
            </div>

            <div
              style={{
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "rgb(31,41,55)",
              }}
            >
              {entry.question}
            </div>
          </div>

          <div
            style={{
              borderRadius: 28,
              background: `linear-gradient(180deg, ${theme.fillStrong} 0%, ${theme.fill} 100%)`,
              border: `1.5px solid ${theme.border}`,
              boxShadow: `0 14px 30px ${theme.glow}`,
              padding: "24px 28px",
            }}
          >
            <div
              style={{
                fontSize: "0.95rem",
                color: "rgb(120,120,120)",
                marginBottom: 14,
                fontWeight: 500,
              }}
            >
              Solace
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {entry.reflection.map((paragraph, paragraphIndex) => (
                <p
                  key={paragraphIndex}
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                    lineHeight: 1.85,
                    color: "rgb(31,41,55)",
                    maxWidth: "60rem",
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 22,
              }}
            >
              <button
                type="button"
                onClick={() => setFeedback("helpful")}
                style={{
                  minHeight: 44,
                  padding: "0 18px",
                  borderRadius: 999,
                  border:
                    entry.feedback === "helpful"
                      ? `1px solid ${theme.border}`
                      : "1px solid rgba(212,212,216,0.96)",
                  background:
                    entry.feedback === "helpful"
                      ? "rgba(255,255,255,0.78)"
                      : "rgba(255,255,255,0.94)",
                  color: "rgb(82,82,91)",
                  fontSize: "0.96rem",
                  cursor: "pointer",
                }}
              >
                Helpful
              </button>

              <button
                type="button"
                onClick={() => setFeedback("not-quite")}
                style={{
                  minHeight: 44,
                  padding: "0 18px",
                  borderRadius: 999,
                  border:
                    entry.feedback === "not-quite"
                      ? "1px solid rgba(161,161,170,0.96)"
                      : "1px solid rgba(212,212,216,0.96)",
                  background:
                    entry.feedback === "not-quite"
                      ? "rgba(244,244,245,0.96)"
                      : "rgba(255,255,255,0.94)",
                  color: "rgb(82,82,91)",
                  fontSize: "0.96rem",
                  cursor: "pointer",
                }}
              >
                Not quite
              </button>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={resetReflection}
              style={{
                minHeight: 50,
                padding: "0 20px",
                borderRadius: 999,
                border: "1px solid rgba(212,212,216,0.96)",
                background: "rgba(255,255,255,0.96)",
                color: "rgb(82,82,91)",
                fontSize: "0.98rem",
                fontWeight: 500,
                cursor: "pointer",
                boxShadow: "0 8px 18px rgba(15,23,42,0.05)",
              }}
            >
              Start a new reflection
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}