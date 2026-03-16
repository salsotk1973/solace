"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import ReflectionOrb from "@/components/solace/ReflectionOrb";

type OrbPhase = "idle" | "active" | "settled";

const THINKING_DELAY_MS = 2800;
const THINKING_COPY = "Clarity is forming...";
const PLACEHOLDER_COPY = "A clearer view may begin to form here.";

export default function ChoosePage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orbPhase, setOrbPhase] = useState<OrbPhase>("idle");
  const [hasResult, setHasResult] = useState(false);

  useEffect(() => {
    if (!isLoading && !hasResult) {
      setOrbPhase("idle");
    }
  }, [isLoading, hasResult]);

  const placeholderLine = useMemo(() => {
    if (isLoading) return THINKING_COPY;
    if (hasResult) return "";
    return PLACEHOLDER_COPY;
  }, [isLoading, hasResult]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = input.trim();

    if (!trimmed) {
      setResult("Name the decision on your mind.");
      setHasResult(true);
      setOrbPhase("settled");
      return;
    }

    setIsLoading(true);
    setHasResult(false);
    setResult("");
    setOrbPhase("active");

    const startedAt = Date.now();

    try {
      const res = await fetch("/api/solace/choose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: trimmed }),
      });

      const data = await res.json();

      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, THINKING_DELAY_MS - elapsed);
      await new Promise((resolve) => setTimeout(resolve, remaining));

      const text = typeof data?.text === "string" ? data.text.trim() : "";

      setResult(
        text || "Something interrupted the reflection for a moment. Please try again."
      );
      setHasResult(true);
      setOrbPhase("settled");
    } catch {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, THINKING_DELAY_MS - elapsed);
      await new Promise((resolve) => setTimeout(resolve, remaining));

      setResult("Something interrupted the reflection for a moment. Please try again.");
      setHasResult(true);
      setOrbPhase("settled");
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setInput("");
    setResult("");
    setHasResult(false);
    setIsLoading(false);
    setOrbPhase("idle");
  }

  return (
    <main className="choose-realm">
      <div className="realm-bg-stage" aria-hidden="true">
        <img
          src="/realms/emerald/emerald-realm-master.png"
          alt=""
          className="realm-bg-image"
        />
      </div>

      <div className="realm-bg-vignette" aria-hidden="true" />
      <div className="realm-bg-soften" aria-hidden="true" />
      <div className="realm-center-halo" aria-hidden="true" />

      <section className="realm-content">
        <div className="realm-intro">
          <h1 className="title">Choose</h1>
          <p className="subtitle">
            Compare options calmly and move toward a clearer next step.
          </p>
        </div>

        <div className="orb-stage">
          <ReflectionOrb phase={orbPhase} />
        </div>

        <form className="decision-form" onSubmit={handleSubmit}>
          <label htmlFor="decision" className="prompt">
            What decision is on your mind?
          </label>

          <textarea
            id="decision"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type the decision here..."
            rows={3}
            disabled={isLoading}
            className="decision-input"
          />

          <div className="actions">
            <button type="submit" disabled={isLoading} className="primary-button">
              {isLoading ? "Reflecting..." : "Explore this decision"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="secondary-button"
            >
              Explore another decision
            </button>
          </div>
        </form>

        <section className="response-zone">
          {!hasResult ? (
            <p className="response-placeholder">{placeholderLine}</p>
          ) : (
            <p className="response-text">{result}</p>
          )}
        </section>
      </section>

      <style jsx>{`
        .choose-realm {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background: #020807;
        }

        .realm-bg-stage {
          position: fixed;
          inset: 0;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
        }

        .realm-bg-image {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: block;
          width: auto;
          height: auto;
          max-width: none;
          max-height: none;
          user-select: none;
          -webkit-user-drag: none;
        }

        .realm-bg-vignette {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            radial-gradient(
              ellipse at center,
              rgba(0, 0, 0, 0) 38%,
              rgba(0, 0, 0, 0.18) 72%,
              rgba(0, 0, 0, 0.38) 100%
            );
        }

        .realm-bg-soften {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            linear-gradient(
              180deg,
              rgba(5, 10, 9, 0.08) 0%,
              rgba(5, 10, 9, 0) 24%,
              rgba(5, 10, 9, 0) 78%,
              rgba(5, 10, 9, 0.1) 100%
            );
        }

        .realm-center-halo {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            radial-gradient(
              ellipse at center,
              rgba(166, 255, 211, 0.07) 0%,
              rgba(166, 255, 211, 0.03) 18%,
              rgba(166, 255, 211, 0.012) 32%,
              rgba(166, 255, 211, 0) 48%
            );
        }

        .realm-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
          padding: 96px 24px 88px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .realm-intro {
          max-width: 760px;
        }

        .title {
          margin: 0;
          font-size: clamp(3.5rem, 7vw, 6rem);
          font-weight: 650;
          line-height: 0.94;
          letter-spacing: -0.06em;
          color: rgba(246, 251, 248, 0.98);
          text-shadow:
            0 8px 26px rgba(0, 0, 0, 0.26),
            0 0 22px rgba(190, 255, 223, 0.06);
        }

        .subtitle {
          margin: 14px 0 0;
          font-size: 1.02rem;
          line-height: 1.7;
          color: rgba(232, 244, 238, 0.88);
          text-shadow: 0 3px 16px rgba(0, 0, 0, 0.24);
        }

        .orb-stage {
          margin-top: 18px;
          min-height: 430px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .decision-form {
          width: 100%;
          max-width: 760px;
          margin-top: -34px;
        }

        .prompt {
          display: block;
          margin: 0 0 14px;
          font-size: 1.02rem;
          font-weight: 540;
          color: rgba(241, 249, 245, 0.96);
          text-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
        }

        .decision-input {
          width: 100%;
          min-height: 88px;
          padding: 22px 26px;
          border-radius: 32px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background:
            linear-gradient(
              180deg,
              rgba(20, 31, 29, 0.72) 0%,
              rgba(17, 28, 27, 0.68) 100%
            );
          box-shadow:
            0 20px 44px rgba(0, 0, 0, 0.24),
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            inset 0 -1px 0 rgba(255, 255, 255, 0.03),
            0 0 0 1px rgba(194, 255, 223, 0.03);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          color: rgba(246, 252, 249, 0.96);
          font-size: 1rem;
          line-height: 1.55;
          resize: none;
          outline: none;
          transition:
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .decision-input:focus {
          border-color: rgba(197, 255, 223, 0.34);
          box-shadow:
            0 22px 48px rgba(0, 0, 0, 0.26),
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            0 0 0 1px rgba(197, 255, 223, 0.08),
            0 0 28px rgba(146, 255, 201, 0.09);
        }

        .decision-input::placeholder {
          color: rgba(220, 234, 228, 0.58);
        }

        .actions {
          margin-top: 18px;
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .primary-button,
        .secondary-button {
          position: relative;
          min-width: 186px;
          min-height: 56px;
          padding: 0 24px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          color: rgba(246, 252, 249, 0.98);
          font-size: 0.98rem;
          font-weight: 550;
          cursor: pointer;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition:
            transform 160ms ease,
            box-shadow 160ms ease,
            border-color 160ms ease,
            background 160ms ease;
          overflow: hidden;
        }

        .primary-button::before,
        .secondary-button::before {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: inherit;
          pointer-events: none;
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.14) 0%,
              rgba(255, 255, 255, 0.02) 48%,
              rgba(255, 255, 255, 0.01) 100%
            );
        }

        .primary-button {
          background:
            linear-gradient(
              180deg,
              rgba(145, 255, 208, 0.2) 0%,
              rgba(106, 201, 171, 0.15) 100%
            );
          box-shadow:
            0 16px 34px rgba(0, 0, 0, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.16),
            inset 0 -10px 18px rgba(56, 121, 94, 0.12),
            0 0 26px rgba(149, 255, 206, 0.08);
        }

        .secondary-button {
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.12) 0%,
              rgba(255, 255, 255, 0.08) 100%
            );
          box-shadow:
            0 16px 34px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            inset 0 -10px 18px rgba(0, 0, 0, 0.08);
        }

        .primary-button:hover,
        .secondary-button:hover {
          transform: translateY(-1px);
        }

        .primary-button:hover {
          border-color: rgba(200, 255, 226, 0.3);
          box-shadow:
            0 18px 38px rgba(0, 0, 0, 0.24),
            inset 0 1px 0 rgba(255, 255, 255, 0.16),
            inset 0 -12px 20px rgba(56, 121, 94, 0.14),
            0 0 30px rgba(149, 255, 206, 0.1);
        }

        .secondary-button:hover {
          border-color: rgba(255, 255, 255, 0.28);
          box-shadow:
            0 18px 38px rgba(0, 0, 0, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            inset 0 -12px 20px rgba(0, 0, 0, 0.1);
        }

        .primary-button:disabled,
        .secondary-button:disabled {
          opacity: 0.65;
          cursor: default;
          transform: none;
        }

        .response-zone {
          margin-top: 28px;
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 760px;
        }

        .response-placeholder {
          margin: 0;
          color: rgba(228, 241, 235, 0.74);
          text-shadow: 0 4px 16px rgba(0, 0, 0, 0.24);
        }

        .response-text {
          margin: 0;
          color: rgba(242, 250, 246, 0.96);
          line-height: 1.76;
          text-shadow: 0 5px 18px rgba(0, 0, 0, 0.24);
        }

        @media (max-width: 900px) {
          .realm-content {
            padding-top: 88px;
          }

          .orb-stage {
            min-height: 390px;
          }
        }

        @media (max-width: 640px) {
          .realm-content {
            padding-top: 78px;
            padding-left: 18px;
            padding-right: 18px;
          }

          .orb-stage {
            min-height: 330px;
          }

          .decision-form {
            margin-top: -20px;
          }

          .actions {
            flex-direction: column;
          }

          .primary-button,
          .secondary-button {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}