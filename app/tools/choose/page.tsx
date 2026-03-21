"use client";

import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
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
      <div className="realm-bg-bottom-weight" aria-hidden="true" />
      <div className="realm-bg-top-weight" aria-hidden="true" />
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
          <div className={`azure-hero azure-hero-${orbPhase}`} aria-hidden="true">
            <div className="azure-hero-field azure-hero-field-back" />
            <div className="azure-hero-field azure-hero-field-mid" />
            <div className="azure-hero-field azure-hero-field-front" />
            <div className="azure-hero-floor-glow" />
            <div className="azure-hero-floor-core" />

            <div className="azure-core-shadow" />
            <div className="azure-core-tilt">
              <div className="azure-core">
                <div className="azure-core-parallax azure-core-parallax-back">
                  <div className="azure-core-atmosphere azure-core-atmosphere-a" />
                  <div className="azure-core-atmosphere azure-core-atmosphere-b" />
                  <div className="azure-core-atmosphere azure-core-atmosphere-c" />
                  <div className="azure-core-swirl azure-core-swirl-a" />
                  <div className="azure-core-swirl azure-core-swirl-b" />
                  <div className="azure-core-swirl azure-core-swirl-c" />
                </div>

                <div className="azure-core-parallax azure-core-parallax-mid">
                  <div className="azure-core-mineral azure-core-mineral-a" />
                  <div className="azure-core-mineral azure-core-mineral-b" />
                  <div className="azure-core-mineral azure-core-mineral-c" />
                  <div className="azure-core-mineral azure-core-mineral-d" />
                  <div className="azure-core-line azure-core-line-a" />
                  <div className="azure-core-line azure-core-line-b" />
                  <div className="azure-core-line azure-core-line-c" />
                </div>

                <div className="azure-core-parallax azure-core-parallax-front">
                  <div className="azure-core-inner-glow" />
                  <div className="azure-core-hotspot" />
                  <div className="azure-core-sheen azure-core-sheen-a" />
                  <div className="azure-core-sheen azure-core-sheen-b" />
                </div>

                <div className="azure-core-glass" />
                <div className="azure-core-rim" />
              </div>
            </div>
          </div>
        </div>

        <form className="decision-form" onSubmit={handleSubmit}>
          <div className="scope-inline">
            <span className="scope-inline-copy">Designed for Adults only</span>
            <span className="scope-separator">·</span>
            <span className="scope-inline-copy">Reflective clarity tool</span>
            <span className="scope-separator">·</span>
            <span className="scope-inline-copy">Not professional advice</span>
            <span className="scope-separator">·</span>
            <Link href="/scope" className="scope-inline-link">
              See Scope
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
            placeholder="Should I..."
            rows={2}
            disabled={isLoading}
            className="decision-input"
          />

          {!hasResult && !isLoading && (
            <div className="actions actions-initial">
              <button
                type="submit"
                className={`primary-button ${isButtonReady ? "primary-button-ready" : ""}`}
              >
                <span className="button-glass-sheen" />
                <span className="button-glass-tint" />
                <span className="button-label">Help me see it clearly</span>
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
                <button type="button" onClick={handleReset} className="secondary-button">
                  <span className="button-glass-sheen" />
                  <span className="button-glass-tint" />
                  <span className="button-label">Explore another decision</span>
                </button>
              </div>
            </>
          )}
        </section>
      </section>

 import SiteFooter from "@/components/SiteFooter";

      <style jsx>{`
        .choose-realm {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background: #010309;
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
              rgba(0, 0, 0, 0.12) 10%,
              rgba(0, 0, 0, 0.34) 56%,
              rgba(0, 0, 0, 0.68) 100%
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
              rgba(3, 7, 15, 0.46) 0%,
              rgba(3, 7, 15, 0.22) 18%,
              rgba(3, 7, 15, 0.12) 42%,
              rgba(3, 7, 15, 0.22) 72%,
              rgba(3, 7, 15, 0.48) 100%
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
              rgba(8, 14, 28, 0.12) 0%,
              rgba(8, 14, 28, 0.28) 26%,
              rgba(8, 14, 28, 0.46) 58%,
              rgba(1, 3, 9, 0.64) 100%
            );
        }

        .realm-bg-bottom-weight {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            linear-gradient(
              180deg,
              rgba(0, 0, 0, 0) 0%,
              rgba(1, 3, 9, 0.04) 52%,
              rgba(1, 3, 9, 0.24) 72%,
              rgba(1, 3, 9, 0.58) 100%
            );
        }

        .realm-bg-top-weight {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            linear-gradient(
              180deg,
              rgba(1, 3, 9, 0.48) 0%,
              rgba(1, 3, 9, 0.18) 16%,
              rgba(1, 3, 9, 0) 34%,
              rgba(1, 3, 9, 0) 100%
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
              rgba(154, 184, 255, 0.036) 0%,
              rgba(154, 184, 255, 0.014) 18%,
              rgba(154, 184, 255, 0.006) 32%,
              rgba(154, 184, 255, 0) 48%
            );
        }

        .realm-side-light {
          position: fixed;
          top: 0;
          bottom: 0;
          width: 24%;
          z-index: 1;
          pointer-events: none;
          filter: blur(56px);
          opacity: 0.56;
        }

        .realm-side-light-left {
          left: 0;
          background: radial-gradient(
            circle at 34% 26%,
            rgba(76, 118, 240, 0.12) 0%,
            transparent 66%
          );
        }

        .realm-side-light-right {
          right: 0;
          background: radial-gradient(
            circle at 66% 24%,
            rgba(104, 96, 255, 0.1) 0%,
            transparent 66%
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
            rgba(226, 236, 255, 0.05) 0%,
            rgba(226, 236, 255, 0.02) 28%,
            transparent 60%
          );
          filter: blur(24px);
          opacity: 0.52;
        }

        .realm-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
          padding: 138px 24px 60px;
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
          text-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
        }

        .title {
          margin: 0;
          font-size: clamp(3.5rem, 7vw, 6rem);
          font-weight: 650;
          line-height: 0.94;
          letter-spacing: -0.06em;
          color: rgba(247, 250, 255, 0.98);
          text-shadow:
            0 10px 28px rgba(0, 0, 0, 0.4),
            0 0 24px rgba(160, 188, 255, 0.07);
        }

        .subtitle {
          margin: 14px 0 0;
          font-size: 1.02rem;
          line-height: 1.7;
          color: rgba(232, 239, 250, 0.86);
          text-shadow: 0 4px 18px rgba(0, 0, 0, 0.38);
        }

        .orb-stage {
          position: relative;
          margin-top: 4px;
          min-height: 446px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .azure-hero {
          position: relative;
          width: min(92vw, 900px);
          height: min(80vw, 540px);
          pointer-events: none;
          transform-origin: center;
        }

        .azure-hero-field,
        .azure-hero-floor-glow,
        .azure-hero-floor-core,
        .azure-core-shadow,
        .azure-core-tilt {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }

        .azure-hero-field-back {
          top: 13%;
          width: 700px;
          height: 410px;
          border-radius: 999px;
          background: radial-gradient(
            ellipse at center,
            rgba(82, 126, 255, 0.18) 0%,
            rgba(82, 126, 255, 0.1) 26%,
            rgba(82, 126, 255, 0.04) 48%,
            rgba(82, 126, 255, 0) 72%
          );
          filter: blur(54px);
          opacity: 0.82;
        }

        .azure-hero-field-mid {
          top: 20%;
          width: 520px;
          height: 280px;
          border-radius: 999px;
          background: radial-gradient(
            ellipse at center,
            rgba(162, 194, 255, 0.12) 0%,
            rgba(162, 194, 255, 0.06) 34%,
            rgba(162, 194, 255, 0.02) 54%,
            rgba(162, 194, 255, 0) 74%
          );
          filter: blur(34px);
          opacity: 0.82;
        }

        .azure-hero-field-front {
          top: 25%;
          width: 360px;
          height: 180px;
          border-radius: 999px;
          background: radial-gradient(
            ellipse at center,
            rgba(216, 232, 255, 0.11) 0%,
            rgba(216, 232, 255, 0.04) 40%,
            rgba(216, 232, 255, 0) 74%
          );
          filter: blur(20px);
          opacity: 0.72;
        }

        .azure-hero-floor-glow {
          bottom: 11%;
          width: 520px;
          height: 82px;
          border-radius: 999px;
          background: radial-gradient(
            ellipse at center,
            rgba(86, 128, 255, 0.18) 0%,
            rgba(86, 128, 255, 0.06) 44%,
            rgba(86, 128, 255, 0) 76%
          );
          filter: blur(26px);
          opacity: 0.72;
        }

        .azure-hero-floor-core {
          bottom: 13.5%;
          width: 260px;
          height: 34px;
          border-radius: 999px;
          background: radial-gradient(
            ellipse at center,
            rgba(132, 172, 255, 0.24) 0%,
            rgba(132, 172, 255, 0.08) 48%,
            rgba(132, 172, 255, 0) 78%
          );
          filter: blur(14px);
          opacity: 0.7;
        }

        .azure-core-shadow {
          top: 31%;
          width: 322px;
          height: 322px;
          border-radius: 50%;
          background: radial-gradient(
            circle at 50% 58%,
            rgba(8, 16, 34, 0.4) 0%,
            rgba(8, 16, 34, 0.18) 42%,
            rgba(8, 16, 34, 0) 72%
          );
          filter: blur(30px);
          opacity: 0.74;
        }

        .azure-core-tilt {
          top: 22%;
          width: 276px;
          height: 276px;
          transform-style: preserve-3d;
          perspective: 1200px;
        }

        .azure-core {
          position: relative;
          width: 276px;
          height: 276px;
          border-radius: 50%;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% 42%,
              rgba(244, 249, 255, 0.98) 0%,
              rgba(212, 230, 255, 0.92) 16%,
              rgba(148, 190, 255, 0.8) 38%,
              rgba(72, 120, 228, 0.92) 72%,
              rgba(22, 46, 112, 0.98) 100%
            );
          box-shadow:
            0 28px 58px rgba(0, 0, 0, 0.34),
            0 0 44px rgba(138, 174, 255, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.28),
            inset 0 -18px 32px rgba(0, 0, 0, 0.16);
          transform-style: preserve-3d;
        }

        .azure-core-rim {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.14),
            inset 0 0 0 16px rgba(255, 255, 255, 0.014);
        }

        .azure-core-glass {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.14) 0%,
              rgba(255, 255, 255, 0.04) 26%,
              rgba(255, 255, 255, 0) 48%
            ),
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.1) 0%,
              rgba(255, 255, 255, 0) 36%,
              rgba(0, 0, 0, 0.06) 100%
            );
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .azure-core-parallax {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          transform-style: preserve-3d;
        }

        .azure-core-parallax-back {
          transform: translateZ(-10px);
        }

        .azure-core-parallax-mid {
          transform: translateZ(0);
        }

        .azure-core-parallax-front {
          transform: translateZ(12px);
        }

        .azure-core-inner-glow {
          position: absolute;
          left: 50%;
          top: 44%;
          width: 62%;
          height: 62%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(244, 250, 255, 0.44) 0%,
            rgba(244, 250, 255, 0.16) 34%,
            rgba(244, 250, 255, 0) 72%
          );
          filter: blur(11px);
          opacity: 0.9;
        }

        .azure-core-hotspot {
          position: absolute;
          left: 58%;
          top: 26%;
          width: 34%;
          height: 34%;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.3) 0%,
            rgba(255, 255, 255, 0.08) 42%,
            rgba(255, 255, 255, 0) 76%
          );
          filter: blur(10px);
          opacity: 0.78;
        }

        .azure-core-atmosphere,
        .azure-core-sheen,
        .azure-core-mineral,
        .azure-core-swirl,
        .azure-core-line {
          position: absolute;
          pointer-events: none;
        }

        .azure-core-atmosphere-a {
          left: 10%;
          top: 18%;
          width: 80%;
          height: 52%;
          border-radius: 50%;
          background: radial-gradient(
            ellipse at center,
            rgba(236, 245, 255, 0.16) 0%,
            rgba(236, 245, 255, 0.05) 44%,
            rgba(236, 245, 255, 0) 80%
          );
          filter: blur(18px);
          opacity: 0.72;
        }

        .azure-core-atmosphere-b {
          left: 16%;
          top: 42%;
          width: 58%;
          height: 24%;
          border-radius: 999px;
          background: radial-gradient(
            ellipse at center,
            rgba(174, 206, 255, 0.18) 0%,
            rgba(174, 206, 255, 0.05) 42%,
            rgba(174, 206, 255, 0) 80%
          );
          filter: blur(12px);
          opacity: 0.68;
        }

        .azure-core-atmosphere-c {
          right: 12%;
          bottom: 18%;
          width: 34%;
          height: 20%;
          border-radius: 999px;
          background: radial-gradient(
            ellipse at center,
            rgba(130, 168, 255, 0.22) 0%,
            rgba(130, 168, 255, 0.06) 42%,
            rgba(130, 168, 255, 0) 80%
          );
          filter: blur(10px);
          opacity: 0.52;
        }

        .azure-core-sheen-a {
          inset: 7% 12% auto 12%;
          height: 46%;
          border-radius: 50%;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.18) 0%,
            rgba(255, 255, 255, 0.06) 34%,
            rgba(255, 255, 255, 0) 82%
          );
          filter: blur(12px);
          transform: rotate(-10deg);
          opacity: 0.84;
        }

        .azure-core-sheen-b {
          left: 14%;
          top: 12%;
          width: 42%;
          height: 56%;
          border-radius: 50%;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.14) 0%,
            rgba(255, 255, 255, 0.04) 42%,
            rgba(255, 255, 255, 0) 76%
          );
          filter: blur(14px);
          opacity: 0.72;
        }

        .azure-core-swirl {
          border-radius: 999px;
          border: 1px solid rgba(220, 235, 255, 0.12);
          filter: blur(0.3px);
          opacity: 0.48;
        }

        .azure-core-swirl-a {
          left: 16%;
          top: 28%;
          width: 66%;
          height: 28%;
          transform: rotate(-10deg);
        }

        .azure-core-swirl-b {
          left: 20%;
          top: 44%;
          width: 54%;
          height: 22%;
          transform: rotate(7deg);
          opacity: 0.34;
        }

        .azure-core-swirl-c {
          left: 26%;
          top: 58%;
          width: 40%;
          height: 14%;
          transform: rotate(-4deg);
          opacity: 0.24;
        }

        .azure-core-mineral-a {
          left: 18%;
          top: 28%;
          width: 62%;
          height: 24%;
          border-radius: 999px;
          background: radial-gradient(
            ellipse at center,
            rgba(208, 228, 255, 0.18) 0%,
            rgba(208, 228, 255, 0.06) 38%,
            rgba(208, 228, 255, 0) 74%
          );
          filter: blur(10px);
          transform: rotate(-12deg);
          opacity: 0.64;
        }

        .azure-core-mineral-b {
          left: 22%;
          top: 54%;
          width: 46%;
          height: 20%;
          border-radius: 999px;
          background: radial-gradient(
            ellipse at center,
            rgba(188, 216, 255, 0.16) 0%,
            rgba(188, 216, 255, 0.05) 38%,
            rgba(188, 216, 255, 0) 74%
          );
          filter: blur(10px);
          transform: rotate(10deg);
          opacity: 0.5;
        }

        .azure-core-mineral-c {
          right: 16%;
          top: 22%;
          width: 26%;
          height: 26%;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.14) 0%,
            rgba(255, 255, 255, 0.04) 44%,
            rgba(255, 255, 255, 0) 78%
          );
          filter: blur(12px);
          opacity: 0.54;
        }

        .azure-core-mineral-d {
          left: 28%;
          bottom: 14%;
          width: 28%;
          height: 16%;
          border-radius: 999px;
          background: radial-gradient(
            ellipse at center,
            rgba(126, 166, 255, 0.22) 0%,
            rgba(126, 166, 255, 0.06) 40%,
            rgba(126, 166, 255, 0) 78%
          );
          filter: blur(9px);
          transform: rotate(-12deg);
          opacity: 0.46;
        }

        .azure-core-line {
          left: 50%;
          border-radius: 999px;
          transform: translateX(-50%);
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(222, 236, 255, 0.22) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          filter: blur(1px);
          opacity: 0.62;
        }

        .azure-core-line-a {
          top: 39%;
          width: 68%;
          height: 1px;
        }

        .azure-core-line-b {
          top: 51%;
          width: 54%;
          height: 1px;
          opacity: 0.38;
        }

        .azure-core-line-c {
          top: 63%;
          width: 46%;
          height: 1px;
          opacity: 0.22;
        }

        .azure-hero-idle .azure-core-tilt {
          animation: azureTiltIdle 6.6s ease-in-out infinite;
        }

        .azure-hero-idle .azure-core {
          animation: azureCoreIdle 6.6s ease-in-out infinite;
        }

        .azure-hero-idle .azure-hero-field-back {
          animation: azureAuraIdle 6.6s ease-in-out infinite;
        }

        .azure-hero-idle .azure-hero-field-mid {
          animation: azureAuraMidIdle 6.6s ease-in-out infinite;
        }

        .azure-hero-idle .azure-hero-field-front {
          animation: azureAuraFrontIdle 6.6s ease-in-out infinite;
        }

        .azure-hero-idle .azure-hero-floor-glow {
          animation: azureFloorIdle 6.6s ease-in-out infinite;
        }

        .azure-hero-idle .azure-hero-floor-core {
          animation: azureFloorCoreIdle 6.6s ease-in-out infinite;
        }

        .azure-hero-idle .azure-core-parallax-back {
          animation: azureParallaxBackIdle 7.2s ease-in-out infinite;
        }

        .azure-hero-idle .azure-core-parallax-mid {
          animation: azureParallaxMidIdle 6.8s ease-in-out infinite;
        }

        .azure-hero-idle .azure-core-parallax-front {
          animation: azureParallaxFrontIdle 6.2s ease-in-out infinite;
        }

        .azure-hero-idle .azure-core-atmosphere-a,
        .azure-hero-idle .azure-core-atmosphere-b,
        .azure-hero-idle .azure-core-atmosphere-c,
        .azure-hero-idle .azure-core-sheen-a,
        .azure-hero-idle .azure-core-sheen-b,
        .azure-hero-idle .azure-core-mineral-a,
        .azure-hero-idle .azure-core-mineral-b,
        .azure-hero-idle .azure-core-mineral-c,
        .azure-hero-idle .azure-core-mineral-d,
        .azure-hero-idle .azure-core-swirl-a,
        .azure-hero-idle .azure-core-swirl-b,
        .azure-hero-idle .azure-core-swirl-c,
        .azure-hero-idle .azure-core-line-a,
        .azure-hero-idle .azure-core-line-b,
        .azure-hero-idle .azure-core-line-c,
        .azure-hero-idle .azure-core-hotspot {
          animation: azureInteriorIdle 7.8s ease-in-out infinite;
        }

        .azure-hero-active .azure-core-tilt {
          animation: azureTiltActive 2.5s ease-in-out infinite;
        }

        .azure-hero-active .azure-core {
          animation: azureCoreActive 2.5s ease-in-out infinite;
        }

        .azure-hero-active .azure-hero-field-back {
          animation: azureAuraActive 2.5s ease-in-out infinite;
        }

        .azure-hero-active .azure-hero-field-mid {
          animation: azureAuraMidActive 2.5s ease-in-out infinite;
        }

        .azure-hero-active .azure-hero-field-front {
          animation: azureAuraFrontActive 2.5s ease-in-out infinite;
        }

        .azure-hero-active .azure-hero-floor-glow {
          animation: azureFloorActive 2.5s ease-in-out infinite;
        }

        .azure-hero-active .azure-hero-floor-core {
          animation: azureFloorCoreActive 2.5s ease-in-out infinite;
        }

        .azure-hero-active .azure-core-parallax-back {
          animation: azureParallaxBackActive 3.1s ease-in-out infinite;
        }

        .azure-hero-active .azure-core-parallax-mid {
          animation: azureParallaxMidActive 2.8s ease-in-out infinite;
        }

        .azure-hero-active .azure-core-parallax-front {
          animation: azureParallaxFrontActive 2.5s ease-in-out infinite;
        }

        .azure-hero-active .azure-core-atmosphere-a,
        .azure-hero-active .azure-core-atmosphere-b,
        .azure-hero-active .azure-core-atmosphere-c,
        .azure-hero-active .azure-core-sheen-a,
        .azure-hero-active .azure-core-sheen-b,
        .azure-hero-active .azure-core-mineral-a,
        .azure-hero-active .azure-core-mineral-b,
        .azure-hero-active .azure-core-mineral-c,
        .azure-hero-active .azure-core-mineral-d,
        .azure-hero-active .azure-core-swirl-a,
        .azure-hero-active .azure-core-swirl-b,
        .azure-hero-active .azure-core-swirl-c,
        .azure-hero-active .azure-core-line-a,
        .azure-hero-active .azure-core-line-b,
        .azure-hero-active .azure-core-line-c,
        .azure-hero-active .azure-core-hotspot {
          animation: azureInteriorActive 3.2s ease-in-out infinite;
        }

        .azure-hero-settled .azure-core-tilt {
          animation: azureTiltSettled 5.2s ease-in-out infinite;
        }

        .azure-hero-settled .azure-core {
          animation: azureCoreSettled 5.2s ease-in-out infinite;
        }

        .azure-hero-settled .azure-hero-field-back {
          animation: azureAuraSettled 5.2s ease-in-out infinite;
        }

        .azure-hero-settled .azure-hero-field-mid {
          animation: azureAuraMidSettled 5.2s ease-in-out infinite;
        }

        .azure-hero-settled .azure-hero-field-front {
          animation: azureAuraFrontSettled 5.2s ease-in-out infinite;
        }

        .azure-hero-settled .azure-hero-floor-glow {
          animation: azureFloorSettled 5.2s ease-in-out infinite;
        }

        .azure-hero-settled .azure-hero-floor-core {
          animation: azureFloorCoreSettled 5.2s ease-in-out infinite;
        }

        .azure-hero-settled .azure-core-parallax-back {
          animation: azureParallaxBackSettled 5.8s ease-in-out infinite;
        }

        .azure-hero-settled .azure-core-parallax-mid {
          animation: azureParallaxMidSettled 5.4s ease-in-out infinite;
        }

        .azure-hero-settled .azure-core-parallax-front {
          animation: azureParallaxFrontSettled 5.1s ease-in-out infinite;
        }

        .azure-hero-settled .azure-core-atmosphere-a,
        .azure-hero-settled .azure-core-atmosphere-b,
        .azure-hero-settled .azure-core-atmosphere-c,
        .azure-hero-settled .azure-core-sheen-a,
        .azure-hero-settled .azure-core-sheen-b,
        .azure-hero-settled .azure-core-mineral-a,
        .azure-hero-settled .azure-core-mineral-b,
        .azure-hero-settled .azure-core-mineral-c,
        .azure-hero-settled .azure-core-mineral-d,
        .azure-hero-settled .azure-core-swirl-a,
        .azure-hero-settled .azure-core-swirl-b,
        .azure-hero-settled .azure-core-swirl-c,
        .azure-hero-settled .azure-core-line-a,
        .azure-hero-settled .azure-core-line-b,
        .azure-hero-settled .azure-core-line-c,
        .azure-hero-settled .azure-core-hotspot {
          animation: azureInteriorSettled 5.8s ease-in-out infinite;
        }

        .decision-form {
          width: 100%;
          max-width: 760px;
          margin-top: 2px;
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
          text-shadow: 0 4px 14px rgba(0, 0, 0, 0.34);
        }

        .decision-input {
          width: 100%;
          min-height: 74px;
          padding: 18px 24px;
          border-radius: 30px;
          border: 1px solid rgba(214, 226, 255, 0.18);
          background:
            linear-gradient(
              180deg,
              rgba(12, 18, 34, 0.84) 0%,
              rgba(8, 14, 28, 0.8) 100%
            );
          box-shadow:
            0 20px 44px rgba(0, 0, 0, 0.36),
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            inset 0 -1px 0 rgba(255, 255, 255, 0.03),
            0 0 0 1px rgba(170, 194, 255, 0.03);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          color: rgba(246, 250, 255, 0.96);
          font-size: 1rem;
          line-height: 1.45;
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
            0 22px 48px rgba(0, 0, 0, 0.38),
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
          min-width: 204px;
          min-height: 58px;
          padding: 0 28px;
          border-radius: 999px;
          border: 1px solid rgba(186, 206, 255, 0.24);
          background:
            linear-gradient(
              180deg,
              rgba(150, 178, 255, 0.18) 0%,
              rgba(96, 126, 214, 0.16) 46%,
              rgba(48, 72, 142, 0.2) 100%
            );
          box-shadow:
            0 18px 42px rgba(0, 0, 0, 0.32),
            0 0 34px rgba(126, 162, 255, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.28),
            inset 0 -14px 24px rgba(12, 24, 56, 0.24);
          color: rgba(246, 250, 255, 0.98);
          font-size: 0.98rem;
          font-weight: 560;
          cursor: pointer;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          transition:
            transform 220ms ease,
            box-shadow 220ms ease,
            border-color 220ms ease,
            background 220ms ease,
            opacity 220ms ease,
            filter 220ms ease;
          overflow: hidden;
        }

        .button-glass-sheen,
        .button-glass-tint {
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: inherit;
        }

        .button-glass-sheen {
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.26) 0%,
              rgba(255, 255, 255, 0.12) 22%,
              rgba(255, 255, 255, 0.03) 42%,
              rgba(255, 255, 255, 0) 62%
            );
          opacity: 0.9;
        }

        .button-glass-tint {
          background:
            radial-gradient(
              ellipse at 50% 118%,
              rgba(118, 154, 255, 0.24) 0%,
              rgba(118, 154, 255, 0.06) 42%,
              rgba(118, 154, 255, 0) 74%
            );
          opacity: 0.86;
        }

        .button-label {
          position: relative;
          z-index: 2;
        }

        .primary-button-ready {
          border-color: rgba(208, 222, 255, 0.34);
          box-shadow:
            0 20px 46px rgba(0, 0, 0, 0.34),
            0 0 44px rgba(144, 176, 255, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            inset 0 -14px 24px rgba(12, 24, 56, 0.26);
          filter: brightness(1.03);
        }

        .primary-button:hover,
        .secondary-button:hover {
          transform: translateY(-1px);
          border-color: rgba(225, 235, 255, 0.34);
          box-shadow:
            0 22px 50px rgba(0, 0, 0, 0.34),
            0 0 50px rgba(150, 180, 255, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.34),
            inset 0 -14px 24px rgba(12, 24, 56, 0.28);
        }

        .primary-button:active,
        .secondary-button:active {
          transform: translateY(1px);
          box-shadow:
            0 12px 28px rgba(0, 0, 0, 0.32),
            inset 0 2px 6px rgba(0, 0, 0, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
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
            0 4px 16px rgba(0, 0, 0, 0.26),
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
              rgba(12, 18, 34, 0.84) 0%,
              rgba(8, 14, 28, 0.8) 100%
            );
          box-shadow:
            0 20px 44px rgba(0, 0, 0, 0.36),
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
            0 20px 44px rgba(0, 0, 0, 0.36),
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

        .realm-footer {
          position: relative;
          z-index: 2;
          padding: 0 24px 26px;
        }

        .realm-footer-inner {
          max-width: 980px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding-top: 20px;
          border-top: 1px solid rgba(184, 206, 255, 0.12);
        }

        .realm-footer-copy {
          margin: 0;
          max-width: 72ch;
          font-size: 12px;
          line-height: 1.7;
          color: rgba(220, 232, 255, 0.4);
        }

        .realm-footer-link {
          flex-shrink: 0;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          color: rgba(236, 244, 255, 0.72);
          border-bottom: 1px solid rgba(236, 244, 255, 0.18);
          transition: color 160ms ease, border-color 160ms ease;
        }

        .realm-footer-link:hover {
          color: rgba(255, 255, 255, 0.92);
          border-color: rgba(255, 255, 255, 0.34);
        }

        @keyframes azureTiltIdle {
          0%,
          100% {
            transform: translateX(-50%) rotateX(0deg) rotateY(-1deg);
          }
          50% {
            transform: translateX(-50%) rotateX(1.1deg) rotateY(1.8deg);
          }
        }

        @keyframes azureTiltActive {
          0%,
          100% {
            transform: translateX(-50%) rotateX(0deg) rotateY(-1.5deg);
          }
          50% {
            transform: translateX(-50%) rotateX(1.8deg) rotateY(3.8deg);
          }
        }

        @keyframes azureTiltSettled {
          0%,
          100% {
            transform: translateX(-50%) rotateX(0deg) rotateY(-0.8deg);
          }
          50% {
            transform: translateX(-50%) rotateX(0.9deg) rotateY(1.6deg);
          }
        }

        @keyframes azureParallaxBackIdle {
          0%,
          100% {
            transform: translateZ(-10px) translateX(-5px) scale(0.99);
          }
          50% {
            transform: translateZ(-10px) translateX(6px) scale(1.02);
          }
        }

        @keyframes azureParallaxMidIdle {
          0%,
          100% {
            transform: translateZ(0) translateX(-2px) scale(1);
          }
          50% {
            transform: translateZ(0) translateX(3px) scale(1.02);
          }
        }

        @keyframes azureParallaxFrontIdle {
          0%,
          100% {
            transform: translateZ(12px) translateX(4px) scale(1.01);
          }
          50% {
            transform: translateZ(12px) translateX(-5px) scale(1.04);
          }
        }

        @keyframes azureParallaxBackActive {
          0%,
          100% {
            transform: translateZ(-10px) translateX(-8px) scale(0.99);
          }
          50% {
            transform: translateZ(-10px) translateX(10px) scale(1.04);
          }
        }

        @keyframes azureParallaxMidActive {
          0%,
          100% {
            transform: translateZ(0) translateX(-4px) scale(1);
          }
          50% {
            transform: translateZ(0) translateX(6px) scale(1.04);
          }
        }

        @keyframes azureParallaxFrontActive {
          0%,
          100% {
            transform: translateZ(12px) translateX(6px) scale(1.02);
          }
          50% {
            transform: translateZ(12px) translateX(-8px) scale(1.06);
          }
        }

        @keyframes azureParallaxBackSettled {
          0%,
          100% {
            transform: translateZ(-10px) translateX(-4px) scale(1);
          }
          50% {
            transform: translateZ(-10px) translateX(4px) scale(1.02);
          }
        }

        @keyframes azureParallaxMidSettled {
          0%,
          100% {
            transform: translateZ(0) translateX(-1px) scale(1);
          }
          50% {
            transform: translateZ(0) translateX(2px) scale(1.02);
          }
        }

        @keyframes azureParallaxFrontSettled {
          0%,
          100% {
            transform: translateZ(12px) translateX(3px) scale(1.01);
          }
          50% {
            transform: translateZ(12px) translateX(-3px) scale(1.03);
          }
        }

        @keyframes azureCoreIdle {
          0%,
          100% {
            transform: translateY(0) scale(0.982);
            box-shadow:
              0 28px 58px rgba(0, 0, 0, 0.34),
              0 0 44px rgba(138, 174, 255, 0.16),
              inset 0 1px 0 rgba(255, 255, 255, 0.28),
              inset 0 -18px 32px rgba(0, 0, 0, 0.16);
          }
          50% {
            transform: translateY(-8px) scale(1.05);
            box-shadow:
              0 38px 70px rgba(0, 0, 0, 0.4),
              0 0 68px rgba(148, 186, 255, 0.28),
              inset 0 1px 0 rgba(255, 255, 255, 0.3),
              inset 0 -18px 32px rgba(0, 0, 0, 0.14);
          }
        }

        @keyframes azureCoreActive {
          0%,
          100% {
            transform: translateY(0) scale(0.982);
          }
          50% {
            transform: translateY(-12px) scale(1.082);
          }
        }

        @keyframes azureCoreSettled {
          0%,
          100% {
            transform: translateY(0) scale(0.994);
          }
          50% {
            transform: translateY(-4px) scale(1.03);
          }
        }

        @keyframes azureAuraIdle {
          0%,
          100% {
            transform: translateX(-50%) scale(0.95);
            opacity: 0.68;
          }
          50% {
            transform: translateX(-50%) scale(1.14);
            opacity: 0.98;
          }
        }

        @keyframes azureAuraMidIdle {
          0%,
          100% {
            transform: translateX(-50%) scale(0.96);
            opacity: 0.66;
          }
          50% {
            transform: translateX(-50%) scale(1.12);
            opacity: 0.9;
          }
        }

        @keyframes azureAuraFrontIdle {
          0%,
          100% {
            transform: translateX(-50%) scale(0.965);
            opacity: 0.58;
          }
          50% {
            transform: translateX(-50%) scale(1.1);
            opacity: 0.82;
          }
        }

        @keyframes azureFloorIdle {
          0%,
          100% {
            transform: translateX(-50%) scaleX(0.92) scaleY(0.9);
            opacity: 0.56;
          }
          50% {
            transform: translateX(-50%) scaleX(1.1) scaleY(1.16);
            opacity: 0.86;
          }
        }

        @keyframes azureFloorCoreIdle {
          0%,
          100% {
            transform: translateX(-50%) scaleX(0.9);
            opacity: 0.48;
          }
          50% {
            transform: translateX(-50%) scaleX(1.12);
            opacity: 0.78;
          }
        }

        @keyframes azureAuraActive {
          0%,
          100% {
            transform: translateX(-50%) scale(0.95);
            opacity: 0.72;
          }
          50% {
            transform: translateX(-50%) scale(1.22);
            opacity: 1;
          }
        }

        @keyframes azureAuraMidActive {
          0%,
          100% {
            transform: translateX(-50%) scale(0.96);
            opacity: 0.7;
          }
          50% {
            transform: translateX(-50%) scale(1.18);
            opacity: 1;
          }
        }

        @keyframes azureAuraFrontActive {
          0%,
          100% {
            transform: translateX(-50%) scale(0.97);
            opacity: 0.6;
          }
          50% {
            transform: translateX(-50%) scale(1.16);
            opacity: 0.96;
          }
        }

        @keyframes azureFloorActive {
          0%,
          100% {
            transform: translateX(-50%) scaleX(0.92) scaleY(0.9);
            opacity: 0.58;
          }
          50% {
            transform: translateX(-50%) scaleX(1.18) scaleY(1.22);
            opacity: 0.98;
          }
        }

        @keyframes azureFloorCoreActive {
          0%,
          100% {
            transform: translateX(-50%) scaleX(0.92);
            opacity: 0.52;
          }
          50% {
            transform: translateX(-50%) scaleX(1.18);
            opacity: 0.9;
          }
        }

        @keyframes azureAuraSettled {
          0%,
          100% {
            transform: translateX(-50%) scale(0.97);
            opacity: 0.72;
          }
          50% {
            transform: translateX(-50%) scale(1.12);
            opacity: 0.9;
          }
        }

        @keyframes azureAuraMidSettled {
          0%,
          100% {
            transform: translateX(-50%) scale(0.97);
            opacity: 0.68;
          }
          50% {
            transform: translateX(-50%) scale(1.09);
            opacity: 0.84;
          }
        }

        @keyframes azureAuraFrontSettled {
          0%,
          100% {
            transform: translateX(-50%) scale(0.98);
            opacity: 0.56;
          }
          50% {
            transform: translateX(-50%) scale(1.06);
            opacity: 0.72;
          }
        }

        @keyframes azureFloorSettled {
          0%,
          100% {
            transform: translateX(-50%) scaleX(0.93) scaleY(0.92);
            opacity: 0.58;
          }
          50% {
            transform: translateX(-50%) scaleX(1.12) scaleY(1.14);
            opacity: 0.82;
          }
        }

        @keyframes azureFloorCoreSettled {
          0%,
          100% {
            transform: translateX(-50%) scaleX(0.94);
            opacity: 0.5;
          }
          50% {
            transform: translateX(-50%) scaleX(1.1);
            opacity: 0.72;
          }
        }

        @keyframes azureInteriorIdle {
          0%,
          100% {
            transform: rotate(0deg) translateX(0) translateY(0) scale(1);
            opacity: 0.72;
          }
          50% {
            transform: rotate(2.4deg) translateX(4px) translateY(-4px) scale(1.03);
            opacity: 0.96;
          }
        }

        @keyframes azureInteriorActive {
          0%,
          100% {
            transform: rotate(0deg) translateX(0) translateY(0) scale(1);
            opacity: 0.72;
          }
          50% {
            transform: rotate(5deg) translateX(8px) translateY(-7px) scale(1.05);
            opacity: 1;
          }
        }

        @keyframes azureInteriorSettled {
          0%,
          100% {
            transform: rotate(0deg) translateX(0) translateY(0) scale(1);
            opacity: 0.76;
          }
          50% {
            transform: rotate(1.5deg) translateX(3px) translateY(-2px) scale(1.02);
            opacity: 0.88;
          }
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

          .azure-hero {
            transform: scale(0.88);
          }

          .realm-footer-inner {
            flex-direction: column;
            align-items: flex-start;
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

          .azure-hero {
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

          .realm-footer {
            padding-left: 18px;
            padding-right: 18px;
          }
        }
       `}</style>

      <SiteFooter />
    </main>
  );
}