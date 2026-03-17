"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import ReflectionOrb from "@/components/solace/ReflectionOrb";

type OrbPhase = "idle" | "active" | "settled";

const THINKING_DELAY_MS = 2800;
const THINKING_COPY = "SOLACE IS REFLECTING...";

export default function ChoosePage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orbPhase, setOrbPhase] = useState<OrbPhase>("idle");
  const [hasResult, setHasResult] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!isLoading && !hasResult) {
      setOrbPhase("idle");
    }
  }, [isLoading, hasResult]);

  useEffect(() => {
    if (hasResult && !isLoading) {
      inputRef.current?.focus();
    }
  }, [hasResult, isLoading]);

  async function runReflection(trimmed: string) {
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = input.trim();

    if (!trimmed) {
      setResult("Describe what feels unclear.");
      setHasResult(true);
      setOrbPhase("settled");
      return;
    }

    await runReflection(trimmed);
  }

  function handleReset() {
    setInput("");
    setResult("");
    setHasResult(false);
    setIsLoading(false);
    setOrbPhase("idle");
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
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
            What decision is in your mind?
          </label>

          <textarea
            id="decision"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Should I..."
            rows={3}
            disabled={isLoading}
            className="decision-input"
          />

          {!hasResult && !isLoading && (
            <div className="actions actions-initial">
              <button type="submit" className="primary-button">
                Help me see it clearly
              </button>
            </div>
          )}
        </form>

        <section className="response-zone" aria-live="polite">
          {isLoading ? (
            <div className="loading-zone">
              <p className="loading-copy">{THINKING_COPY}</p>
            </div>
          ) : !hasResult ? null : (
            <>
              <div className="response-card">
                <div className="response-card-label">Solace reflection</div>
                <p className="response-text">{result}</p>
              </div>

              <div className="actions actions-followup">
                <button
                  type="button"
                  onClick={handleReset}
                  className="secondary-button"
                >
                  Explore another decision
                </button>
              </div>
            </>
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
          margin-top: 12px;
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
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .actions-initial {
          margin-top: 18px;
        }

        .actions-followup {
          margin-top: 16px;
        }

        .primary-button,
        .secondary-button {
          position: relative;
          min-width: 186px;
          min-height: 56px;
          padding: 0 24px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.18);
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
            background 160ms ease,
            opacity 160ms ease;
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
              rgba(255, 255, 255, 0.1) 0%,
              rgba(255, 255, 255, 0.025) 48%,
              rgba(255, 255, 255, 0.01) 100%
            );
        }

        .primary-button {
          background:
            linear-gradient(
              180deg,
              rgba(104, 154, 136, 0.52) 0%,
              rgba(69, 112, 97, 0.62) 100%
            );
          box-shadow:
            0 16px 34px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -10px 18px rgba(23, 46, 38, 0.22),
            0 0 22px rgba(149, 255, 206, 0.05);
        }

        .secondary-button {
          background:
            linear-gradient(
              180deg,
              rgba(89, 132, 118, 0.5) 0%,
              rgba(59, 96, 84, 0.6) 100%
            );
          box-shadow:
            0 16px 34px rgba(0, 0, 0, 0.26),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 -10px 18px rgba(16, 34, 29, 0.22);
        }

        .primary-button:hover,
        .secondary-button:hover {
          transform: translateY(-1px);
          border-color: rgba(255, 255, 255, 0.22);
        }

        .primary-button:hover {
          background:
            linear-gradient(
              180deg,
              rgba(82, 127, 112, 0.66) 0%,
              rgba(53, 87, 76, 0.78) 100%
            );
          box-shadow:
            0 18px 38px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 -12px 20px rgba(16, 34, 29, 0.28),
            0 0 24px rgba(149, 255, 206, 0.04);
        }

        .secondary-button:hover {
          background:
            linear-gradient(
              180deg,
              rgba(76, 118, 105, 0.64) 0%,
              rgba(48, 79, 69, 0.76) 100%
            );
          box-shadow:
            0 18px 38px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 -12px 20px rgba(16, 34, 29, 0.28);
        }

        .primary-button:active,
        .secondary-button:active {
          transform: translateY(1px);
          background:
            linear-gradient(
              180deg,
              rgba(58, 95, 83, 0.74) 0%,
              rgba(34, 58, 50, 0.84) 100%
            );
          box-shadow:
            0 10px 22px rgba(0, 0, 0, 0.26),
            inset 0 2px 6px rgba(0, 0, 0, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .primary-button:disabled,
        .secondary-button:disabled {
          opacity: 0.65;
          cursor: default;
          transform: none;
        }

        .loading-zone {
          margin-top: 12px;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .loading-copy {
          margin: 0;
          font-size: 0.75rem;
          font-weight: 560;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(241, 249, 245, 0.96);
          text-shadow:
            0 4px 16px rgba(0, 0, 0, 0.24),
            0 0 10px rgba(190, 255, 223, 0.08);
          animation: solaceBreathing 3.2s ease-in-out infinite;
        }

        .response-zone {
          margin-top: 6px;
          width: 100%;
          max-width: 760px;
          min-height: 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .response-card {
          width: 100%;
          max-width: 760px;
          margin-top: 0;
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
          animation: responseReveal 600ms ease forwards;
          opacity: 0;
          transform: translateY(12px);
        }

        .response-card-label {
          margin-bottom: 12px;
          font-size: 0.75rem;
          font-weight: 560;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(226, 240, 233, 0.66);
        }

        .response-text {
          margin: 0;
          color: rgba(242, 250, 246, 0.96);
          line-height: 1.8;
          text-shadow: 0 5px 18px rgba(0, 0, 0, 0.24);
          white-space: pre-line;
        }

        @keyframes responseReveal {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes solaceBreathing {
          0% {
            transform: scale(0.98);
            opacity: 0.85;
          }
          50% {
            transform: scale(1.04);
            opacity: 1;
          }
          100% {
            transform: scale(0.98);
            opacity: 0.85;
          }
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
            margin-top: 0;
          }

          .actions {
            flex-direction: column;
          }

          .primary-button,
          .secondary-button {
            width: 100%;
          }

          .response-card {
            padding: 20px 20px 22px;
            border-radius: 24px;
          }
        }
      `}</style>
    </main>
  );
}