"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";
import PageShell from "@/components/PageShell";
import AIToolInputSection from "@/components/tools/AIToolInputSection";
import { postJsonWithTimeout } from "@/lib/solace/client-request";
import {
  isSolaceClientTimeoutError,
  SOLACE_MIN_PENDING_MS,
  SOLACE_UNAVAILABLE_ERROR,
  waitForMinimumPending,
} from "@/lib/solace/runtime";
import { SOLACE_CRISIS_FALLBACK } from "@/lib/solace/safety";

type OrbState = "idle" | "converging" | "settled";

type ChooseApiResponse = {
  text?: string;
  error?: string;
  isCrisisFallback?: boolean;
  isToolRedirect?: boolean;
  redirectTarget?: "clear-your-mind" | "break-it-down" | "choose";
  redirectTitle?: string;
};

const THINKING_COPY = "SOLACE IS REFLECTING...";
const BUTTON_READY_DELAY_MS = 1400;
const CONVERGE_DURATION_MS = 2600;

function ChooseAlignmentOrb({ state }: { state: OrbState }) {
  return (
    <>
      <div className={`alignment-orb alignment-orb-${state}`} aria-hidden="true">
        <div className="choice-light choice-light-left" />
        <div className="choice-light choice-light-right" />
        <div className="resolved-light" />
      </div>

      <style jsx>{`
        .alignment-orb {
          position: relative;
          width: 400px;
          height: 260px;
          height: 260px;
          pointer-events: none;
          isolation: isolate;
          --merge-duration: 2600ms;
          --merge-ease: cubic-bezier(0.32, 0.02, 0.12, 1);
        }

        .choice-light,
        .resolved-light {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 999px;
          will-change: transform, opacity, box-shadow;
        }

        .choice-light {
          width: 122px;
          height: 122px;
          z-index: 3;
          opacity: 0;
          background:
            radial-gradient(
              circle at 36% 28%,
              rgba(255, 244, 220, 0.95) 0%,
              rgba(236, 194, 124, 0.9) 16%,
              rgba(178, 118, 38, 0.86) 36%,
              rgba(118, 68, 18, 0.68) 64%,
              rgba(62, 34, 8, 0.28) 84%,
              rgba(62, 34, 8, 0) 100%
            );
          box-shadow:
            0 0 22px rgba(168, 108, 32, 0.14),
            0 0 42px rgba(168, 108, 32, 0.07),
            inset 0 1px 0 rgba(255, 255, 255, 0.26),
            inset 8px 8px 18px rgba(255, 255, 255, 0.08),
            inset -12px -12px 20px rgba(48, 26, 6, 0.28);
        }

        .choice-light::before,
        .resolved-light::before {
          content: "";
          position: absolute;
          inset: -18%;
          border-radius: inherit;
          background: radial-gradient(
            circle,
            rgba(168, 108, 32, 0.18) 0%,
            rgba(168, 108, 32, 0.1) 38%,
            rgba(168, 108, 32, 0.03) 58%,
            rgba(168, 108, 32, 0) 76%
          );
          filter: blur(18px);
          z-index: -1;
        }

        .choice-light::after,
        .resolved-light::after {
          content: "";
          position: absolute;
          inset: 16% 18% 44% 16%;
          border-radius: inherit;
          background: radial-gradient(
            ellipse at 38% 34%,
            rgba(255, 255, 255, 0.36) 0%,
            rgba(255, 255, 255, 0.12) 34%,
            rgba(255, 255, 255, 0) 74%
          );
          filter: blur(3px);
          opacity: 0.78;
        }

        .choice-light-left {
          --idle-x: -154px;
          --resolve-x: -24px;
          --idle-scale: 0.95;
          --resolve-scale: 0.78;
          transform: translate(calc(-50% - 154px), -50%) scale(0.95);
        }

        .choice-light-right {
          --idle-x: 154px;
          --resolve-x: 24px;
          --idle-scale: 0.91;
          --resolve-scale: 0.76;
          transform: translate(calc(-50% + 154px), -50%) scale(0.91);
        }

        .resolved-light {
          width: 140px;
          height: 140px;
          z-index: 2;
          opacity: 0;
          visibility: hidden;
          transform: translate(-50%, -50%) scale(0.76);
          background:
            radial-gradient(
              circle at 38% 30%,
              rgba(255, 246, 224, 0.98) 0%,
              rgba(238, 198, 132, 0.95) 14%,
              rgba(184, 122, 42, 0.94) 38%,
              rgba(114, 64, 16, 0.94) 68%,
              rgba(52, 28, 6, 0.98) 100%
            );
          box-shadow:
            0 24px 44px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.28),
            inset 10px 10px 22px rgba(255, 255, 255, 0.08),
            inset -14px -14px 24px rgba(36, 18, 4, 0.26);
        }

        .alignment-orb-idle .choice-light {
          opacity: 1;
        }

        .alignment-orb-idle .choice-light-left {
          animation: choiceLightIdleLeft 7.2s ease-in-out infinite;
        }

        .alignment-orb-idle .choice-light-right {
          animation: choiceLightIdleRight 7.8s ease-in-out infinite;
        }

        .alignment-orb-idle .resolved-light {
          opacity: 0;
          visibility: hidden;
          animation: none;
        }

        .alignment-orb-converging .choice-light-left {
          opacity: 1;
          animation: choiceLightConvergeLeft var(--merge-duration) var(--merge-ease) forwards;
        }

        .alignment-orb-converging .choice-light-right {
          opacity: 1;
          animation: choiceLightConvergeRight var(--merge-duration) var(--merge-ease) forwards;
        }

        .alignment-orb-converging .resolved-light {
          visibility: visible;
          animation: resolvedReveal var(--merge-duration) var(--merge-ease) forwards;
        }

        .alignment-orb-settled .resolved-light {
          opacity: 1;
          visibility: visible;
          animation: resolvedSettle 4s ease-in-out infinite;
        }

        @keyframes choiceLightIdleLeft {
          0%,
          100% {
            transform: translate(calc(-50% + var(--idle-x)), calc(-50% - 2px))
              scale(var(--idle-scale));
          }
          50% {
            transform: translate(calc(-50% + var(--idle-x) + 4px), calc(-50% + 2px))
              scale(0.965);
          }
        }

        @keyframes choiceLightIdleRight {
          0%,
          100% {
            transform: translate(calc(-50% + var(--idle-x)), calc(-50% + 2px))
              scale(var(--idle-scale));
          }
          50% {
            transform: translate(calc(-50% + var(--idle-x) - 4px), calc(-50% - 2px))
              scale(0.925);
          }
        }

        @keyframes choiceLightConvergeLeft {
          0% {
            opacity: 1;
            transform: translate(calc(-50% + var(--idle-x)), -50%) scale(var(--idle-scale));
          }
          100% {
            opacity: 0.06;
            transform: translate(calc(-50% + var(--resolve-x)), -50%) scale(var(--resolve-scale));
          }
        }

        @keyframes choiceLightConvergeRight {
          0% {
            opacity: 1;
            transform: translate(calc(-50% + var(--idle-x)), -50%) scale(var(--idle-scale));
          }
          100% {
            opacity: 0.04;
            transform: translate(calc(-50% + var(--resolve-x)), -50%) scale(var(--resolve-scale));
          }
        }

        @keyframes resolvedReveal {
          0%,
          58% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.76);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes resolvedSettle {
          0%,
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            box-shadow:
              0 24px 44px rgba(0, 0, 0, 0.28),
              inset 0 1px 0 rgba(255, 255, 255, 0.28),
              inset 10px 10px 22px rgba(255, 255, 255, 0.08),
              inset -14px -14px 24px rgba(0, 0, 0, 0.24);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.03);
            box-shadow:
              0 26px 48px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.28),
              inset 10px 10px 22px rgba(255, 255, 255, 0.08),
              inset -14px -14px 24px rgba(0, 0, 0, 0.24);
          }
        }

        @media (max-width: 640px) {
          .alignment-orb {
            width: 360px;
            height: 230px;
          }

          .choice-light {
            width: 104px;
            height: 104px;
          }

          .resolved-light {
            width: 118px;
            height: 118px;
          }

          .choice-light-left {
            --idle-x: -124px;
            --resolve-x: -22px;
            transform: translate(calc(-50% - 124px), -50%) scale(0.95);
          }

          .choice-light-right {
            --idle-x: 124px;
            --resolve-x: 22px;
            transform: translate(calc(-50% + 124px), -50%) scale(0.91);
          }
        }
      `}</style>
    </>
  );
}

export default function ChoosePage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [hasResult, setHasResult] = useState(false);
  const [isCrisisFallback, setIsCrisisFallback] = useState(false);
  const [isToolRedirect, setIsToolRedirect] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState<
    "clear-your-mind" | "break-it-down" | "choose" | null
  >(null);
  const [redirectTitle, setRedirectTitle] = useState("");
  const [isButtonReady, setIsButtonReady] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (orbState !== "converging") {
      return;
    }

    const timer = window.setTimeout(() => {
      setOrbState("settled");
    }, CONVERGE_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [orbState]);

  useEffect(() => {
    if (hasResult && !isLoading) {
      inputRef.current?.focus();
    }
  }, [hasResult, isLoading]);

  useEffect(() => {
    if (hasResult && !isCrisisFallback && !isUnavailable && !isLoading) {
      if (!localStorage.getItem("solace_upgrade_nudge_shown")) {
        localStorage.setItem("solace_upgrade_nudge_shown", "1");
        setShowNudge(true);
      }
    }
  }, [hasResult, isCrisisFallback, isUnavailable, isLoading]);

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

  function getDisplayResponse(text: string, crisis: boolean) {
    if (crisis) {
      return SOLACE_CRISIS_FALLBACK;
    }

    const trimmed = text.trim();

    if (!trimmed) {
      return "Something interrupted the reflection for a moment. Please try again.";
    }

    return trimmed;
  }

  function getResponseLabel() {
    if (isCrisisFallback) return "Take a moment";
    if (isToolRedirect) return redirectTitle || "A better fit";
    return "Solace reflection";
  }

  function getFollowupLabel() {
    if (isCrisisFallback) return "Clear another thought";
    if (isToolRedirect) return "Try another decision";
    return "Explore another decision";
  }

  async function runReflection(trimmed: string) {
    setIsLoading(true);
    setHasResult(false);
    setResult("");
    setIsCrisisFallback(false);
    setIsToolRedirect(false);
    setRedirectTarget(null);
    setRedirectTitle("");
    setIsButtonReady(false);
    setIsUnavailable(false);
    setOrbState("converging");

    const startedAt = Date.now();

    try {
      const { response: res, data } = await postJsonWithTimeout<ChooseApiResponse>(
        "/api/solace/choose",
        { input: trimmed },
        {
          headers: {
            "X-Solace-Age-Confirmed": "1",
          },
        },
      );

      await waitForMinimumPending(startedAt, SOLACE_MIN_PENDING_MS);

      const crisisFallback = Boolean(data?.isCrisisFallback);
      const toolRedirect = Boolean(data?.isToolRedirect);

      if (!res.ok) {
        if (data?.error === SOLACE_UNAVAILABLE_ERROR) {
          setIsUnavailable(true);
          setHasResult(true);
          setOrbState("settled");
          return;
        }

        const errorText =
          typeof data?.error === "string"
            ? data.error
            : "Something interrupted the reflection for a moment. Please try again.";

        setResult(getDisplayResponse(errorText, false));
        setIsCrisisFallback(false);
        setIsToolRedirect(false);
        setRedirectTarget(null);
        setRedirectTitle("");
        setHasResult(true);
        setOrbState("settled");
        return;
      }

      const text = typeof data?.text === "string" ? data.text : "";

      setResult(getDisplayResponse(text, crisisFallback));
      setIsCrisisFallback(crisisFallback);
      setIsToolRedirect(toolRedirect && !crisisFallback);
      setRedirectTarget(
        data?.redirectTarget === "clear-your-mind" || data?.redirectTarget === "break-it-down"
          ? data.redirectTarget
          : null,
      );
      setRedirectTitle(typeof data?.redirectTitle === "string" ? data.redirectTitle : "");
      setHasResult(true);
      setOrbState("settled");
    } catch (error) {
      await waitForMinimumPending(startedAt, SOLACE_MIN_PENDING_MS);

      if (isSolaceClientTimeoutError(error)) {
        setIsUnavailable(true);
        setHasResult(true);
        setOrbState("settled");
        return;
      }

      setResult("Something interrupted the reflection for a moment. Please try again.");
      setIsCrisisFallback(false);
      setIsToolRedirect(false);
      setRedirectTarget(null);
      setRedirectTitle("");
      setHasResult(true);
      setOrbState("settled");
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
      setIsToolRedirect(false);
      setRedirectTarget(null);
      setRedirectTitle("");
      setHasResult(true);
      setOrbState("settled");
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
    setIsToolRedirect(false);
    setRedirectTarget(null);
    setRedirectTitle("");
    setIsButtonReady(false);
    setIsUnavailable(false);
    setOrbState("idle");

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  return (
    <PageShell contentContainer={false}>
      <div className="choose-realm">
        <section className="realm-content">
          <div className="realm-intro">
            <h1 className="title">Choose</h1>
            <p className="subtitle">
              You&apos;ve been going back and forth for too long.
              <br />
              Bring the decision here. Solace will help you see what you actually want.
            </p>
          </div>

          <div className="orb-stage">
            <ChooseAlignmentOrb state={orbState} />
          </div>

          <AIToolInputSection
            onSubmit={handleSubmit}
            formOffsetTop={66}
            prompt={
              <label htmlFor="decision" className="prompt">
                What decision is in front of you?
              </label>
            }
            trustLine={
              <p className="trust-line">
                <Lock size={12} aria-hidden="true" />
                <span>This is private. Only you can see what you write here.</span>
              </p>
            }
            input={
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
            }
            showPrimaryAction={!hasResult && !isLoading}
            primaryAction={
              <button
                type="submit"
                className={`primary-button ${isButtonReady ? "primary-button-ready" : ""}`}
              >
                <span className="button-glass-sheen" />
                <span className="button-glass-tint" />
                <span className="button-label">
                  Help me see it clearly
                  <span className="button-label-arrow" aria-hidden="true">
                    →
                  </span>
                </span>
              </button>
            }
          />

          <section className="response-zone" aria-live="polite">
            {isLoading ? (
              <div className="loading-zone">
                <p className="loading-copy">{THINKING_COPY}</p>
              </div>
            ) : !hasResult ? null : isUnavailable ? (
              <>
                <div className="response-card">
                  <div className="response-card-label">Taking a breath.</div>
                  <div className="response-copy">
                    <p className="response-text">
                      This tool is temporarily resting. Try again in a moment — it will be ready soon.
                    </p>
                  </div>
                </div>
                <div className="actions actions-followup">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="secondary-button"
                  >
                    <span className="button-glass-sheen" />
                    <span className="button-glass-tint" />
                    <span className="button-label">Try again →</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`response-card ${
                    isCrisisFallback ? "response-card-crisis" : ""
                  } ${isToolRedirect ? "response-card-redirect" : ""}`}
                >
                  <div className="response-card-label">{getResponseLabel()}</div>

                  <div className="response-copy">
                    {result
                      .split(/\n\s*\n/)
                      .map((paragraph) => paragraph.trim())
                      .filter(Boolean)
                      .map((paragraph, index) => (
                        <p key={`${paragraph}-${index}`} className="response-text">
                          {paragraph}
                        </p>
                      ))}
                  </div>

                  {isToolRedirect && redirectTarget ? (
                    <div className="redirect-chip">
                      Better fit:{" "}
                      {redirectTarget === "clear-your-mind" ? "Clear Your Mind" : "Break It Down"}
                    </div>
                  ) : null}
                </div>

                {showNudge && (
                  <div className="upgrade-nudge">
                    <p className="upgrade-nudge-text">
                      Solace can remember this over time — so future sessions know what you&apos;ve
                      already worked through.{" "}
                      <a href="/pricing" className="upgrade-nudge-link">
                        That&apos;s Pro →
                      </a>
                    </p>
                  </div>
                )}

                <div className="actions actions-followup">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="secondary-button"
                  >
                    <span className="button-glass-sheen" />
                    <span className="button-glass-tint" />
                    <span className="button-label">{getFollowupLabel()}</span>
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
            isolation: isolate;
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
            width: 100%;
            max-width: 760px;
            min-height: 168px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
          }

          .title {
            margin: 0;
            font-family: "Cormorant Garamond", serif;
            font-size: clamp(3rem, 7vw, 5.4rem);
            font-weight: 300;
            line-height: 0.98;
            letter-spacing: -0.02em;
            font-style: italic;
            color: rgba(255, 247, 232, 0.98);
            text-shadow:
              0 10px 28px rgba(0, 0, 0, 0.4),
              0 0 24px rgba(245, 158, 11, 0.08);
          }

          .subtitle {
            max-width: 28rem;
            margin: 14px auto 0;
            font-family: "Jost", sans-serif;
            font-size: 1rem;
            line-height: 1.625;
            color: rgba(255, 255, 255, 0.6);
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

          .prompt {
            display: block;
            margin: 0 0 14px;
            font-size: 1.02rem;
            font-weight: 540;
            color: rgba(255, 242, 185, 0.94);
            text-shadow: 0 4px 14px rgba(0, 0, 0, 0.34);
          }

          .trust-line {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin: 0 0 12px;
            width: 100%;
            font-family: "Jost", sans-serif;
            font-size: 0.75rem;
            line-height: 1.5;
            color: rgba(245, 158, 11, 0.38);
            text-align: center;
          }

          .decision-input {
            width: 100%;
            min-height: 74px;
            padding: 18px 24px;
            border-radius: 30px;
            border: 1px solid rgba(245, 158, 11, 0.22);
            background: rgb(24, 14, 8);
            box-shadow:
              0 0 18px rgba(245, 158, 11, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.14),
              inset 0 -1px 0 rgba(255, 255, 255, 0.03),
              0 0 0 1px rgba(255, 198, 140, 0.03);
            color: rgba(255, 242, 185, 0.96);
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
            border-color: rgba(245, 158, 11, 0.45);
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.14),
              0 0 0 1px rgba(245, 158, 11, 0.1),
              0 0 28px rgba(245, 158, 11, 0.12);
          }

          .decision-input::placeholder {
            color: rgba(245, 158, 11, 0.28);
          }

          .actions {
            display: flex;
            gap: 14px;
            justify-content: center;
            flex-wrap: wrap;
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
            border: 1px solid rgba(245, 158, 11, 0.24);
            background:
              linear-gradient(
                180deg,
                rgba(255, 194, 140, 0.18) 0%,
                rgba(214, 138, 76, 0.16) 46%,
                rgba(142, 72, 32, 0.2) 100%
              );
            box-shadow:
              0 18px 42px rgba(0, 0, 0, 0.32),
              0 0 34px rgba(245, 158, 11, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.28),
              inset 0 -14px 24px rgba(56, 24, 10, 0.24);
            color: rgba(255, 248, 242, 0.98);
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
            text-decoration: none;
          }

          .primary-button:hover,
          .secondary-button:hover {
            transform: translateY(-1px);
            border-color: rgba(255, 224, 196, 0.34);
            box-shadow:
              0 22px 50px rgba(0, 0, 0, 0.34),
              0 0 50px rgba(245, 158, 11, 0.16),
              inset 0 1px 0 rgba(255, 255, 255, 0.34),
              inset 0 -14px 24px rgba(56, 24, 10, 0.26);
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

          .primary-button-ready {
            border-color: rgba(255, 236, 214, 0.34);
            box-shadow:
              0 20px 46px rgba(0, 0, 0, 0.34),
              0 0 44px rgba(245, 158, 11, 0.12),
              inset 0 1px 0 rgba(255, 255, 255, 0.3),
              inset 0 -14px 24px rgba(56, 24, 10, 0.26);
            filter: brightness(1.03);
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
                rgba(255, 176, 108, 0.24) 0%,
                rgba(255, 176, 108, 0.06) 42%,
                rgba(255, 176, 108, 0) 74%
              );
            opacity: 0.86;
          }

          .button-label {
            position: relative;
            z-index: 2;
          }

          .primary-button .button-label {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
          }

          .button-label-arrow {
            display: inline-block;
            transition: transform 200ms ease;
          }

          .primary-button:hover .button-label-arrow {
            transform: translateX(0.25rem);
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
            color: rgba(245, 158, 11, 0.78);
            text-shadow:
              0 4px 16px rgba(0, 0, 0, 0.26),
              0 0 10px rgba(245, 158, 11, 0.14);
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
            position: relative;
            width: 100%;
            max-width: 760px;
            margin-top: 0;
            padding: 22px 26px;
            overflow: hidden;
            border-radius: 32px;
            border: 1px solid rgba(245, 158, 11, 0.17);
            background: rgb(24, 14, 8);
            background-clip: padding-box;
            box-shadow:
              0 0 20px rgba(245, 158, 11, 0.08),
              0 0 0 1px rgba(255, 198, 140, 0.03);
            animation: responseReveal 600ms ease forwards;
            opacity: 0;
            transform: translateY(12px);
          }

          .response-card-crisis,
          .response-card-redirect {
            border-color: rgba(245, 158, 11, 0.17);
            background: rgb(24, 14, 8);
          }

          .response-card-label {
            margin-bottom: 12px;
            font-size: 0.75rem;
            font-weight: 560;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: rgba(245, 158, 11, 0.62);
          }

          .response-copy {
            display: flex;
            flex-direction: column;
            gap: 14px;
          }

          .response-text {
            margin: 0;
            color: rgba(255, 242, 185, 0.92);
            line-height: 1.8;
            text-shadow: 0 5px 18px rgba(0, 0, 0, 0.24);
            white-space: pre-line;
          }

          .redirect-chip {
            margin-top: 16px;
            display: inline-flex;
            align-self: flex-start;
            padding: 8px 12px;
            border-radius: 999px;
            border: 1px solid rgba(245, 158, 11, 0.17);
            background: rgba(245, 158, 11, 0.055);
            color: rgba(245, 158, 11, 0.62);
            font-size: 0.74rem;
            letter-spacing: 0.04em;
          }

          .upgrade-nudge {
            margin-top: 20px;
            padding: 14px 20px;
            border-radius: 12px;
            border: 0.5px solid rgba(245, 158, 11, 0.17);
            background: rgba(245, 158, 11, 0.055);
            text-align: center;
          }

          .upgrade-nudge-text {
            margin: 0;
            font-family: var(--font-body, "Jost", sans-serif);
            font-size: 13px;
            line-height: 1.6;
            color: rgba(255, 242, 185, 0.5);
          }

          .upgrade-nudge-link,
          .secondary-button {
            color: rgba(245, 158, 11, 0.42);
            text-decoration: none;
          }

          .upgrade-nudge-link:hover {
            color: rgba(245, 158, 11, 0.75);
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
              min-height: 392px;
            }
          }

          @media (max-width: 640px) {
            .realm-content {
              padding-top: 122px;
              padding-left: 18px;
              padding-right: 18px;
            }

            .orb-stage {
              min-height: 322px;
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
      </div>
    </PageShell>
  );
}
