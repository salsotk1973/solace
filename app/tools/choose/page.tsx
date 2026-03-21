"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import ReflectionOrb from "@/components/solace/ReflectionOrb";
import SiteHeader from "@/components/SiteHeader";

type OrbPhase = "idle" | "active" | "settled";

const THINKING_DELAY_MS = 2800;
const THINKING_COPY = "SOLACE IS REFLECTING...";
const BUTTON_READY_DELAY_MS = 1400;

export default function ChoosePage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orbPhase, setOrbPhase] = useState<OrbPhase>("idle");
  const [hasResult, setHasResult] = useState(false);
  const [isCrisisFallback, setIsCrisisFallback] = useState(false);
  const [isButtonReady, setIsButtonReady] = useState(false);
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

  useEffect(() => {
    if (isLoading || hasResult) {
      setIsButtonReady(false);
      return;
    }

    const trimmed = input.trim();

    if (!trimmed) {
      setIsButtonReady(false);
      return;
    }

    setIsButtonReady(false);

    const timer = window.setTimeout(() => {
      setIsButtonReady(true);
    }, BUTTON_READY_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [input, isLoading, hasResult]);

  async function runReflection(trimmed: string) {
    setIsLoading(true);
    setHasResult(false);
    setResult("");
    setIsCrisisFallback(false);
    setIsButtonReady(false);
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

      const data = await res.json().catch(() => null);

      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, THINKING_DELAY_MS - elapsed);
      await new Promise((resolve) => setTimeout(resolve, remaining));

      if (!res.ok) {
        const errorText =
          typeof data?.error === "string"
            ? data.error
            : "Something interrupted the reflection for a moment. Please try again.";

        setResult(errorText);
        setIsCrisisFallback(false);
        setHasResult(true);
        setOrbPhase("settled");
        return;
      }

      const text = typeof data?.text === "string" ? data.text.trim() : "";

      setResult(
        text || "Something interrupted the reflection for a moment. Please try again."
      );
      setIsCrisisFallback(Boolean(data?.isCrisisFallback));
      setHasResult(true);
      setOrbPhase("settled");
    } catch {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, THINKING_DELAY_MS - elapsed);
      await new Promise((resolve) => setTimeout(resolve, remaining));

      setResult("Something interrupted the reflection for a moment. Please try again.");
      setIsCrisisFallback(false);
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
      setIsCrisisFallback(false);
      setHasResult(true);
      setOrbPhase("settled");
      setIsButtonReady(false);
      return;
    }

    await runReflection(trimmed);
  }

  function handleReset() {
    setInput("");
    setResult("");
    setHasResult(false);
    setIsLoading(false);
    setIsCrisisFallback(false);
    setIsButtonReady(false);
    setOrbPhase("idle");

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  return (
    <main className="choose-realm">
      <div className="realm-bg-stage" aria-hidden="true">
        <img
          src="/realms/azure/azure-realm-master.jpg"
          alt=""
          className="realm-bg-image"
        />
      </div>

      <div className="realm-bg-vignette" aria-hidden="true" />
      <div className="realm-bg-soften" aria-hidden="true" />
      <div className="realm-bg-deepen" aria-hidden="true" />
      <div className="realm-center-halo" aria-hidden="true" />
      <div className="realm-side-light realm-side-light-left" aria-hidden="true" />
      <div className="realm-side-light realm-side-light-right" aria-hidden="true" />
      <div className="realm-horizon-shimmer" aria-hidden="true" />

      <SiteHeader />

      <section className="realm-content">
        <div className="realm-intro">
          <p className="realm-label">Azure Realm</p>
          <h1 className="title">Choose</h1>
          <p className="subtitle">
            Compare what’s in front of you calmly and move toward a clearer next step.
          </p>
        </div>

        <div className="orb-stage">
          <div className="azure-orb-shell" aria-hidden="true">
            <div className="azure-orb-shell-aura azure-orb-shell-aura-back" />
            <div className="azure-orb-shell-aura azure-orb-shell-aura-mid" />
            <div className="azure-orb-shell-core-glow" />
            <div className="azure-orb-shell-floor-glow" />
          </div>

          <div className="azure-orb-content">
            <ReflectionOrb phase={orbPhase} />
          </div>
        </div>

        <form className="decision-form" onSubmit={handleSubmit}>
          <div className="scope-inline">
            <span className="scope-inline-copy">Adults 18+ only</span>
            <span className="scope-separator">·</span>
            <span className="scope-inline-copy">Reflective clarity tool</span>
            <span className="scope-separator">·</span>
            <span className="scope-inline-copy">Not professional advice</span>
            <span className="scope-separator">·</span>
            <Link href="/scope" className="scope-inline-link">
              Scope
            </Link>
          </div>

          <label htmlFor="decision" className="prompt">
            What decision is in front of you?
          </label>

          <textarea
            id="decision"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="I’m choosing between..."
            rows={3}
            disabled={isLoading}
            className="decision-input"
          />

          {!hasResult && !isLoading && (
            <div className="actions actions-initial">
              <button
                type="submit"
                className={`primary-button ${isButtonReady ? "primary-button-ready" : ""}`}
              >
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
              <div
                className={`response-card ${
                  isCrisisFallback ? "response-card-crisis" : ""
                }`}
              >
                <div className="response-card-label">
                  {isCrisisFallback ? "Important" : "Solace reflection"}
                </div>
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
          background: #02040a;
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
          inset: 0;
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          object-position: center;
          display: block;
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
              rgba(0, 0, 0, 0.06) 18%,
              rgba(0, 0, 0, 0.22) 56%,
              rgba(0, 0, 0, 0.52) 100%
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
              rgba(4, 7, 14, 0.38) 0%,
              rgba(4, 7, 14, 0.18) 20%,
              rgba(4, 7, 14, 0.08) 42%,
              rgba(4, 7, 14, 0.18) 72%,
              rgba(4, 7, 14, 0.42) 100%
            );
        }

        .realm-bg-deepen {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            radial-gradient(
              circle at 50% 44%,
              rgba(10, 16, 30, 0.06) 0%,
              rgba(10, 16, 30, 0.18) 26%,
              rgba(10, 16, 30, 0.34) 58%,
              rgba(2, 4, 10, 0.52) 100%
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
              rgba(170, 196, 255, 0.05) 0%,
              rgba(170, 196, 255, 0.02) 18%,
              rgba(170, 196, 255, 0.008) 34%,
              rgba(170, 196, 255, 0) 48%
            );
        }

        .realm-side-light {
          position: fixed;
          top: 0;
          bottom: 0;
          width: 24%;
          z-index: 1;
          pointer-events: none;
          filter: blur(52px);
          opacity: 0.72;
        }

        .realm-side-light-left {
          left: 1%;
          background: radial-gradient(
            circle at 38% 28%,
            rgba(88, 128, 245, 0.12) 0%,
            transparent 64%
          );
        }

        .realm-side-light-right {
          right: 1%;
          background: radial-gradient(
            circle at 62% 24%,
            rgba(116, 104, 255, 0.1) 0%,
            transparent 64%
          );
        }

        .realm-horizon-shimmer {
          position: fixed;
          left: 10%;
          right: 10%;
          top: 48%;
          height: 7%;
          z-index: 1;
          pointer-events: none;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(226, 236, 255, 0.07) 0%,
            rgba(226, 236, 255, 0.03) 28%,
            transparent 60%
          );
          filter: blur(22px);
          opacity: 0.72;
        }

        .realm-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
          padding: 138px 24px 88px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .realm-intro {
          max-width: 760px;
        }

        .realm-label {
          margin: 0 0 14px;
          font-size: 0.82rem;
          font-weight: 560;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(206, 220, 255, 0.54);
          text-shadow: 0 4px 14px rgba(0, 0, 0, 0.34);
        }

        .title {
          margin: 0;
          font-size: clamp(3.5rem, 7vw, 6rem);
          font-weight: 650;
          line-height: 0.94;
          letter-spacing: -0.06em;
          color: rgba(247, 250, 255, 0.98);
          text-shadow:
            0 10px 28px rgba(0, 0, 0, 0.34),
            0 0 24px rgba(160, 188, 255, 0.08);
        }

        .subtitle {
          margin: 14px 0 0;
          font-size: 1.02rem;
          line-height: 1.7;
          color: rgba(232, 239, 250, 0.88);
          text-shadow: 0 4px 18px rgba(0, 0, 0, 0.34);
        }

        .orb-stage {
          position: relative;
          margin-top: 8px;
          min-height: 440px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .azure-orb-shell {
          position: absolute;
          left: 50%;
          top: 50%;
          width: min(92vw, 900px);
          height: min(78vw, 540px);
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 0;
        }

        .azure-orb-shell-aura,
        .azure-orb-shell-core-glow,
        .azure-orb-shell-floor-glow {
          position: absolute;
          left: 50%;
          border-radius: 999px;
          transform: translateX(-50%);
          pointer-events: none;
        }

        .azure-orb-shell-aura-back {
          top: 10%;
          width: 640px;
          height: 420px;
          background: radial-gradient(
            ellipse at center,
            rgba(118, 154, 255, 0.22) 0%,
            rgba(118, 154, 255, 0.12) 28%,
            rgba(118, 154, 255, 0.05) 48%,
            rgba(118, 154, 255, 0) 72%
          );
          filter: blur(46px);
          opacity: 0.88;
        }

        .azure-orb-shell-aura-mid {
          top: 16%;
          width: 470px;
          height: 300px;
          background: radial-gradient(
            ellipse at center,
            rgba(168, 196, 255, 0.16) 0%,
            rgba(168, 196, 255, 0.08) 36%,
            rgba(168, 196, 255, 0) 72%
          );
          filter: blur(30px);
          opacity: 0.9;
        }

        .azure-orb-shell-core-glow {
          top: 26%;
          width: 330px;
          height: 170px;
          background: radial-gradient(
            ellipse at center,
            rgba(188, 216, 255, 0.12) 0%,
            rgba(188, 216, 255, 0.045) 46%,
            rgba(188, 216, 255, 0) 76%
          );
          filter: blur(24px);
          opacity: 0.82;
        }

        .azure-orb-shell-floor-glow {
          bottom: 12%;
          width: 560px;
          height: 90px;
          background: radial-gradient(
            ellipse at center,
            rgba(122, 158, 255, 0.16) 0%,
            rgba(122, 158, 255, 0.06) 44%,
            rgba(122, 158, 255, 0) 76%
          );
          filter: blur(24px);
          opacity: 0.78;
        }

        .azure-orb-content {
          position: relative;
          z-index: 1;
          transform: scale(0.96);
          transform-origin: center;
        }

        .decision-form {
          width: 100%;
          max-width: 760px;
          margin-top: 4px;
        }

        .scope-inline {
          margin: 0 0 10px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0;
          font-size: 0.78rem;
          line-height: 1.45;
          color: rgba(228, 236, 250, 0.46);
          text-align: center;
          text-wrap: balance;
        }

        .scope-inline-copy {
          color: rgba(228, 236, 250, 0.46);
        }

        .scope-separator {
          padding: 0 0.26rem;
          color: rgba(228, 236, 250, 0.3);
        }

        .scope-inline-link {
          color: rgba(240, 246, 255, 0.74);
          text-decoration: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.16);
          line-height: 1.1;
          transition: color 160ms ease, border-color 160ms ease;
        }

        .scope-inline-link:hover {
          color: rgba(255, 255, 255, 0.9);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .prompt {
          display: block;
          margin: 0 0 14px;
          font-size: 1.02rem;
          font-weight: 540;
          color: rgba(241, 246, 255, 0.96);
          text-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
        }

        .decision-input {
          width: 100%;
          min-height: 88px;
          padding: 22px 26px;
          border-radius: 32px;
          border: 1px solid rgba(214, 226, 255, 0.18);
          background:
            linear-gradient(
              180deg,
              rgba(14, 20, 34, 0.82) 0%,
              rgba(10, 16, 30, 0.76) 100%
            );
          box-shadow:
            0 20px 44px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            inset 0 -1px 0 rgba(255, 255, 255, 0.03),
            0 0 0 1px rgba(170, 194, 255, 0.03);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          color: rgba(246, 250, 255, 0.96);
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
          border-color: rgba(188, 208, 255, 0.34);
          box-shadow:
            0 22px 48px rgba(0, 0, 0, 0.34),
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            0 0 0 1px rgba(188, 208, 255, 0.08),
            0 0 28px rgba(148, 176, 255, 0.12);
        }

        .decision-input::placeholder {
          color: rgba(214, 224, 244, 0.58);
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
          border: 1px solid rgba(214, 226, 255, 0.18);
          color: rgba(246, 250, 255, 0.98);
          font-size: 0.98rem;
          font-weight: 550;
          cursor: pointer;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition:
            transform 220ms ease,
            box-shadow 220ms ease,
            border-color 220ms ease,
            background 220ms ease,
            opacity 220ms ease,
            filter 220ms ease;
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
              rgba(102, 132, 198, 0.52) 0%,
              rgba(68, 96, 160, 0.62) 100%
            );
          box-shadow:
            0 16px 34px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -10px 18px rgba(24, 38, 72, 0.22),
            0 0 22px rgba(160, 188, 255, 0.05);
        }

        .primary-button-ready {
          border-color: rgba(220, 230, 255, 0.3);
          background:
            linear-gradient(
              180deg,
              rgba(112, 142, 210, 0.58) 0%,
              rgba(76, 104, 172, 0.7) 100%
            );
          box-shadow:
            0 18px 38px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            inset 0 -10px 18px rgba(24, 38, 72, 0.22),
            0 0 26px rgba(174, 200, 255, 0.08);
          filter: brightness(1.02);
        }

        .secondary-button {
          background:
            linear-gradient(
              180deg,
              rgba(82, 108, 166, 0.5) 0%,
              rgba(56, 80, 134, 0.6) 100%
            );
          box-shadow:
            0 16px 34px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 -10px 18px rgba(20, 30, 56, 0.22);
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
              rgba(84, 114, 182, 0.66) 0%,
              rgba(56, 82, 146, 0.78) 100%
            );
          box-shadow:
            0 18px 38px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 -12px 20px rgba(20, 30, 56, 0.28),
            0 0 24px rgba(160, 188, 255, 0.04);
        }

        .primary-button-ready:hover {
          background:
            linear-gradient(
              180deg,
              rgba(94, 126, 194, 0.7) 0%,
              rgba(62, 90, 156, 0.82) 100%
            );
          box-shadow:
            0 20px 42px rgba(0, 0, 0, 0.34),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -12px 20px rgba(20, 30, 56, 0.28),
            0 0 30px rgba(174, 200, 255, 0.08);
        }

        .secondary-button:hover {
          background:
            linear-gradient(
              180deg,
              rgba(72, 100, 156, 0.64) 0%,
              rgba(48, 70, 122, 0.76) 100%
            );
          box-shadow:
            0 18px 38px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 -12px 20px rgba(20, 30, 56, 0.28);
        }

        .primary-button:active,
        .secondary-button:active {
          transform: translateY(1px);
          background:
            linear-gradient(
              180deg,
              rgba(52, 76, 128, 0.74) 0%,
              rgba(30, 46, 86, 0.84) 100%
            );
          box-shadow:
            0 10px 22px rgba(0, 0, 0, 0.28),
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
          color: rgba(241, 246, 255, 0.96);
          text-shadow:
            0 4px 16px rgba(0, 0, 0, 0.24),
            0 0 10px rgba(188, 208, 255, 0.08);
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
          border: 1px solid rgba(214, 226, 255, 0.18);
          background:
            linear-gradient(
              180deg,
              rgba(14, 20, 34, 0.82) 0%,
              rgba(10, 16, 30, 0.76) 100%
            );
          box-shadow:
            0 20px 44px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            inset 0 -1px 0 rgba(255, 255, 255, 0.03),
            0 0 0 1px rgba(170, 194, 255, 0.03);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          animation: responseReveal 600ms ease forwards;
          opacity: 0;
          transform: translateY(12px);
        }

        .response-card-crisis {
          border-color: rgba(255, 255, 255, 0.18);
          box-shadow:
            0 20px 44px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            inset 0 -1px 0 rgba(255, 255, 255, 0.03),
            0 0 0 1px rgba(255, 255, 255, 0.03);
        }

        .response-card-label {
          margin-bottom: 12px;
          font-size: 0.75rem;
          font-weight: 560;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(226, 234, 248, 0.66);
        }

        .response-text {
          margin: 0;
          color: rgba(242, 247, 255, 0.96);
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
            padding-top: 130px;
          }

          .orb-stage {
            min-height: 400px;
          }

          .azure-orb-content {
            transform: scale(0.88);
          }
        }

        @media (max-width: 640px) {
          .realm-content {
            padding-top: 122px;
            padding-left: 18px;
            padding-right: 18px;
          }

          .orb-stage {
            min-height: 340px;
          }

          .azure-orb-content {
            transform: scale(0.72);
          }

          .decision-form {
            margin-top: 0;
          }

          .scope-inline {
            font-size: 0.74rem;
            margin-bottom: 9px;
            line-height: 1.4;
          }

          .scope-separator {
            padding: 0 0.22rem;
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