"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { CSSProperties, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import PageShell from "@/components/PageShell";
import AIToolInputSection from "@/components/tools/AIToolInputSection";
import AuthMessage from "@/components/shared/AuthMessage";
import { postJsonWithTimeout } from "@/lib/solace/client-request";
import {
  isSolaceClientTimeoutError,
  SOLACE_MIN_PENDING_MS,
  SOLACE_UNAVAILABLE_ERROR,
  waitForMinimumPending,
} from "@/lib/solace/runtime";

type OrbPhase = "idle" | "active" | "settled";

type BreakItDownApiResponse =
  | {
      type: "normal";
      lead: string;
      steps: string[];
    }
  | {
      type: "gibberish";
      lead: string;
      steps: string[];
    }
  | {
      type: "redirect";
      lead: string;
      steps: string[];
      redirectTarget?: "choose" | "clear-your-mind" | "break-it-down";
      redirectTitle?: string;
    }
  | {
      type: "support";
      lead: string;
      message: string;
    }
  | {
      error?: string;
    };

const THINKING_COPY = "SOLACE IS BREAKING IT DOWN...";
const BUTTON_READY_DELAY_MS = 1400;
const IDLE_ORBITER_COUNT = 5;
const ORBITER_SIZE_PX = 60;
const IDLE_BOUNDARY_RADIUS_PX = 82;
const IDLE_MAX_FRAME_MS = 32;

type IdleOrbiter = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

function buildInitialIdleOrbiters(): IdleOrbiter[] {
  const placementRadius = 52;
  const placements = Array.from({ length: IDLE_ORBITER_COUNT }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / IDLE_ORBITER_COUNT;
    return {
      x: Math.cos(angle) * placementRadius,
      y: Math.sin(angle) * placementRadius,
    };
  });

  const velocityAngles = [-0.32, 2.28, 1.12, -2.04, 0.54];
  const speeds = [26, 22, 24, 23, 25];

  return placements.map((placement, index) => ({
    ...placement,
    vx: Math.cos(velocityAngles[index]) * speeds[index],
    vy: Math.sin(velocityAngles[index]) * speeds[index],
  }));
}

function simulateIdleOrbiters(current: IdleOrbiter[], deltaMs: number): IdleOrbiter[] {
  const dt = Math.min(deltaMs, IDLE_MAX_FRAME_MS) / 1000;
  const next = current.map((orb) => ({
    ...orb,
    x: orb.x + orb.vx * dt,
    y: orb.y + orb.vy * dt,
  }));

  for (const orb of next) {
    const distance = Math.hypot(orb.x, orb.y);

    if (distance > IDLE_BOUNDARY_RADIUS_PX) {
      const nx = orb.x / distance;
      const ny = orb.y / distance;
      orb.x = nx * IDLE_BOUNDARY_RADIUS_PX;
      orb.y = ny * IDLE_BOUNDARY_RADIUS_PX;

      const outwardVelocity = orb.vx * nx + orb.vy * ny;
      if (outwardVelocity > 0) {
        orb.vx -= 2 * outwardVelocity * nx;
        orb.vy -= 2 * outwardVelocity * ny;
      }
    }
  }

  for (let i = 0; i < next.length; i += 1) {
    for (let j = i + 1; j < next.length; j += 1) {
      const a = next[i];
      const b = next[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distance = Math.hypot(dx, dy) || 0.0001;
      const minimumDistance = ORBITER_SIZE_PX;

      if (distance >= minimumDistance) {
        continue;
      }

      const nx = dx / distance;
      const ny = dy / distance;
      const overlap = (minimumDistance - distance) / 2;

      a.x -= nx * overlap;
      a.y -= ny * overlap;
      b.x += nx * overlap;
      b.y += ny * overlap;

      const relativeVelocity = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;

      if (relativeVelocity > 0) {
        a.vx -= relativeVelocity * nx;
        a.vy -= relativeVelocity * ny;
        b.vx += relativeVelocity * nx;
        b.vy += relativeVelocity * ny;
      }
    }
  }

  for (const orb of next) {
    const speed = Math.hypot(orb.vx, orb.vy);

    if (speed < 18) {
      const factor = 18 / (speed || 1);
      orb.vx *= factor;
      orb.vy *= factor;
    } else if (speed > 30) {
      const factor = 30 / speed;
      orb.vx *= factor;
      orb.vy *= factor;
    }
  }

  return next;
}

export default function BreakItDownPage() {
  const [input, setInput] = useState("");
  const [resultLead, setResultLead] = useState("");
  const [resultSteps, setResultSteps] = useState<string[]>([]);
  const [resultMessage, setResultMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orbPhase, setOrbPhase] = useState<OrbPhase>("idle");
  const [hasResult, setHasResult] = useState(false);
  const [isSupport, setIsSupport] = useState(false);
  const [isToolRedirect, setIsToolRedirect] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState<
    "clear-your-mind" | "break-it-down" | "choose" | null
  >(null);
  const [redirectTitle, setRedirectTitle] = useState("");
  const [isButtonReady, setIsButtonReady] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [accessError, setAccessError] = useState<"auth_required" | "upgrade_required" | null>(null);
  const [showNudge, setShowNudge] = useState(false);
  const [idleOrbiters, setIdleOrbiters] = useState<IdleOrbiter[]>(() => buildInitialIdleOrbiters());
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const idleAnimationFrameRef = useRef<number | null>(null);
  const idleLastFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isLoading && !hasResult) {
      setOrbPhase("idle");
    }
  }, [isLoading, hasResult]);

  useEffect(() => {
    if (orbPhase !== "idle") {
      if (idleAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(idleAnimationFrameRef.current);
        idleAnimationFrameRef.current = null;
      }
      idleLastFrameRef.current = null;
      return;
    }

    setIdleOrbiters(buildInitialIdleOrbiters());

    const tick = (timestamp: number) => {
      const last = idleLastFrameRef.current ?? timestamp;
      idleLastFrameRef.current = timestamp;

      setIdleOrbiters((current) => simulateIdleOrbiters(current, timestamp - last));
      idleAnimationFrameRef.current = window.requestAnimationFrame(tick);
    };

    idleAnimationFrameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (idleAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(idleAnimationFrameRef.current);
        idleAnimationFrameRef.current = null;
      }
      idleLastFrameRef.current = null;
    };
  }, [orbPhase]);

  useEffect(() => {
    if (hasResult && !isLoading) {
      inputRef.current?.focus();
    }
  }, [hasResult, isLoading]);

  useEffect(() => {
    if (hasResult && !isSupport && !isUnavailable && !isLoading) {
      if (!localStorage.getItem("solace_upgrade_nudge_shown")) {
        localStorage.setItem("solace_upgrade_nudge_shown", "1");
        setShowNudge(true);
      }
    }
  }, [hasResult, isSupport, isUnavailable, isLoading]);

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

  const redirectHref = useMemo(() => {
    if (!isToolRedirect || !redirectTarget) return null;
    return `/tools/${redirectTarget}`;
  }, [isToolRedirect, redirectTarget]);

  const redirectButtonLabel = useMemo(() => {
    if (redirectTarget === "choose") return "Go to Choose";
    if (redirectTarget === "clear-your-mind") return "Go to Clear Your Mind";
    if (redirectTarget === "break-it-down") return "Go to Break It Down";
    return "Open suggested tool";
  }, [redirectTarget]);

  function getResponseLabel() {
    if (isSupport) return "Take a moment";
    if (isToolRedirect) return redirectTitle || "A better fit";
    return "Solace";
  }

  function getFollowupLabel() {
    if (isSupport) return "Break down something else";
    if (isToolRedirect) return "Try something else";
    return "Break down something else";
  }

  function clearResultState() {
    setResultLead("");
    setResultSteps([]);
    setResultMessage("");
    setIsSupport(false);
    setIsToolRedirect(false);
    setRedirectTarget(null);
    setRedirectTitle("");
  }

  async function runReflection(trimmed: string) {
    setIsLoading(true);
    setHasResult(false);
    setIsUnavailable(false);
    setAccessError(null);
    clearResultState();
    setIsButtonReady(false);
    setOrbPhase("active");

    const startedAt = Date.now();

    try {
      const { response: res, data } = await postJsonWithTimeout<BreakItDownApiResponse>(
        "/api/solace/break-it-down",
        { input: trimmed },
        {
          headers: {
            "X-Solace-Age-Confirmed": "1",
          },
        },
      );

      await waitForMinimumPending(startedAt, SOLACE_MIN_PENDING_MS);

      if (!res.ok) {
        if ((data as { error?: string } | null)?.error === SOLACE_UNAVAILABLE_ERROR) {
          setIsUnavailable(true);
          setHasResult(true);
          setOrbPhase("settled");
          return;
        }
        const errorCode = (data as { error?: string } | null)?.error;
        if (errorCode === "Unauthorized" || errorCode === "auth_required") {
          setAccessError("auth_required");
          setHasResult(true);
          setOrbPhase("settled");
          return;
        }
        if (errorCode === "upgrade_required") {
          setAccessError("upgrade_required");
          setHasResult(true);
          setOrbPhase("settled");
          return;
        }
        setResultLead("Something interrupted the reflection for a moment.");
        setResultMessage(
          typeof (data as { error?: string } | null)?.error === "string" ? (data as { error?: string }).error! : "Please try again.",
        );
        setIsSupport(true);
        setHasResult(true);
        setOrbPhase("settled");
        return;
      }

      if (!data || typeof data !== "object" || !("type" in data)) {
        setResultLead("Something interrupted the reflection for a moment.");
        setResultMessage("Please try again.");
        setIsSupport(true);
        setHasResult(true);
        setOrbPhase("settled");
        return;
      }

      if (data.type === "support") {
        setResultLead(data.lead || "Take a moment");
        setResultMessage(data.message || "");
        setIsSupport(true);
        setHasResult(true);
        setOrbPhase("settled");
        return;
      }

      if (data.type === "redirect") {
        setResultLead(data.lead || "");
        setResultSteps([]);
        setResultMessage("");
        setIsSupport(false);
        setIsToolRedirect(true);
        setRedirectTarget(
          data.redirectTarget === "clear-your-mind" ||
            data.redirectTarget === "break-it-down" ||
            data.redirectTarget === "choose"
            ? data.redirectTarget
            : null,
        );
        setRedirectTitle(
          typeof data.redirectTitle === "string" ? data.redirectTitle : "",
        );
        setHasResult(true);
        setOrbPhase("settled");
        return;
      }

      setResultLead(data.lead || "");
      setResultSteps(
        Array.isArray(data.steps) ? data.steps.filter(Boolean).slice(0, 3) : [],
      );
      setResultMessage("");
      setIsSupport(false);
      setIsToolRedirect(false);
      setRedirectTarget(null);
      setRedirectTitle("");
      setHasResult(true);
      setOrbPhase("settled");
    } catch (error) {
      await waitForMinimumPending(startedAt, SOLACE_MIN_PENDING_MS);

      if (isSolaceClientTimeoutError(error)) {
        setIsUnavailable(true);
        setHasResult(true);
        setOrbPhase("settled");
        return;
      }

      setResultLead("Something interrupted the reflection for a moment.");
      setResultMessage("Please try again.");
      setIsSupport(true);
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
      setResultLead("Tell me one thing you want to deal with right now.");
      setResultMessage("");
      setResultSteps([]);
      setIsSupport(false);
      setIsToolRedirect(false);
      setRedirectTarget(null);
      setRedirectTitle("");
      setHasResult(true);
      setOrbPhase("settled");
      setIsButtonReady(false);
      return;
    }

    await runReflection(trimmed);
  }

  function handleReset() {
    setInput("");
    clearResultState();
    setHasResult(false);
    setIsUnavailable(false);
    setAccessError(null);
    setIsLoading(false);
    setIsButtonReady(false);
    setOrbPhase("idle");

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  const displayedSteps = resultSteps.slice(0, 3);
  const idleOrbiterStyles = useMemo(
    () =>
      idleOrbiters.map(
        (orbiter) =>
          ({
            "--idle-x": `${orbiter.x}px`,
            "--idle-y": `${orbiter.y}px`,
          }) as CSSProperties,
      ),
    [idleOrbiters],
  );

  return (
    <PageShell contentContainer={false}>
      <div className="breakdown-realm">
      <section className="realm-content">
        <div className="realm-intro">
          <h1 className="title">Break It Down</h1>
          <p className="subtitle">
            Bring one thing here. Solace will turn it into simple, useful steps.
          </p>
        </div>

        <div className="orb-stage">
          <div className={`amber-hero amber-hero-${orbPhase}`} aria-hidden="true">
            <div className="amber-core-tilt">
              <div className="amber-system">
                <div className="amber-core-halo amber-core-halo-back" />
                <div className="amber-core-halo amber-core-halo-mid" />
                <div className="amber-core-halo amber-core-halo-front" />
                <div className="amber-orbit-ring amber-orbit-ring-a" />
                <div className="amber-orbit-ring amber-orbit-ring-b" />

                <div className="amber-orbital-system">
                  <div className="amber-orbital-lane amber-orbital-lane-1">
                    <div className="amber-orbiter-rail">
                      <div className="amber-orbiter amber-orbiter-1" style={idleOrbiterStyles[0]}>
                        <div className="amber-orbiter-core" />
                      </div>
                    </div>
                  </div>

                  <div className="amber-orbital-lane amber-orbital-lane-2">
                    <div className="amber-orbiter-rail">
                      <div className="amber-orbiter amber-orbiter-2" style={idleOrbiterStyles[1]}>
                        <div className="amber-orbiter-core" />
                      </div>
                    </div>
                  </div>

                  <div className="amber-orbital-lane amber-orbital-lane-3">
                    <div className="amber-orbiter-rail">
                      <div className="amber-orbiter amber-orbiter-3" style={idleOrbiterStyles[2]}>
                        <div className="amber-orbiter-core" />
                      </div>
                    </div>
                  </div>

                  <div className="amber-orbital-lane amber-orbital-lane-4">
                    <div className="amber-orbiter-rail">
                      <div className="amber-orbiter amber-orbiter-4" style={idleOrbiterStyles[3]}>
                        <div className="amber-orbiter-core" />
                      </div>
                    </div>
                  </div>

                  <div className="amber-orbital-lane amber-orbital-lane-5">
                    <div className="amber-orbiter-rail">
                      <div className="amber-orbiter amber-orbiter-5" style={idleOrbiterStyles[4]}>
                        <div className="amber-orbiter-core" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="amber-core">
                  <div className="amber-core-atmosphere amber-core-atmosphere-a" />
                  <div className="amber-core-atmosphere amber-core-atmosphere-b" />
                  <div className="amber-core-atmosphere amber-core-atmosphere-c" />
                  <div className="amber-core-inner-glow" />
                  <div className="amber-core-hotspot" />
                  <div className="amber-core-sheen amber-core-sheen-a" />
                  <div className="amber-core-sheen amber-core-sheen-b" />
                  <div className="amber-core-swirl amber-core-swirl-a" />
                  <div className="amber-core-swirl amber-core-swirl-b" />
                  <div className="amber-core-swirl amber-core-swirl-c" />
                  <div className="amber-core-line amber-core-line-a" />
                  <div className="amber-core-line amber-core-line-b" />
                  <div className="amber-core-line amber-core-line-c" />
                  <div className="amber-core-glass" />
                  <div className="amber-core-rim" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <AIToolInputSection
          onSubmit={handleSubmit}
          formOffsetTop={23}
          prompt={
            <label htmlFor="breakdown-input" className="prompt">
              What do you want to deal with right now?
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
              id="breakdown-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me one thing you want to deal with right now"
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
                Break it down for me
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
                <button type="button" onClick={handleReset} className="secondary-button">
                  <span className="button-glass-sheen" />
                  <span className="button-glass-tint" />
                  <span className="button-label">Try again →</span>
                </button>
              </div>
            </>
          ) : accessError ? (
            <AuthMessage
              toolKey="break-it-down"
              variant={accessError === "auth_required" ? "logged-out" : "paid-required"}
              onClose={handleReset}
            />
          ) : (
            <>
              <div
                className={`response-card ${
                  isSupport ? "response-card-crisis" : ""
                } ${isToolRedirect ? "response-card-redirect" : ""}`}
              >
                <div className="response-card-label">{getResponseLabel()}</div>

                <div className="response-copy">
                  {resultLead ? <p className="response-text">{resultLead}</p> : null}

                  {isSupport && resultMessage ? (
                    <p className="response-text">{resultMessage}</p>
                  ) : null}

                  {isToolRedirect ? (
                    <>
                      <p className="response-text response-text-soft">
                        Another Solace tool may fit this better.
                      </p>

                      {redirectHref ? (
                        <div className="redirect-button-wrap">
                          <Link href={redirectHref} className="secondary-button redirect-button">
                            <span className="button-glass-sheen" />
                            <span className="button-glass-tint" />
                            <span className="button-label">{redirectButtonLabel}</span>
                          </Link>
                        </div>
                      ) : null}
                    </>
                  ) : null}

                  {!isSupport && !isToolRedirect && displayedSteps.length > 0 ? (
                    <div className="steps-block">
                      {displayedSteps.map((step, index) => (
                        <p key={`${step}-${index}`} className="response-text">
                          {index + 1}. {step}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              {showNudge && (
                <div className="upgrade-nudge">
                  <p className="upgrade-nudge-text">
                    Solace can remember this over time — so future sessions know what you&apos;ve already worked through.{" "}
                    <a href="/pricing" className="upgrade-nudge-link">That&apos;s Pro →</a>
                  </p>
                </div>
              )}

              <div className="actions actions-followup">
                <button type="button" onClick={handleReset} className="secondary-button">
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
        .breakdown-realm {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
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

        .title {
          margin: 0;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(3rem, 7vw, 5.4rem);
          font-weight: 300;
          line-height: 0.98;
          letter-spacing: -0.02em;
          font-style: italic;
          color: rgba(255, 248, 242, 0.98);
          text-shadow:
            0 10px 28px rgba(0, 0, 0, 0.4),
            0 0 24px rgba(255, 198, 140, 0.07);
        }

        .subtitle {
          margin: 14px 0 0;
          font-size: 1.02rem;
          line-height: 1.7;
          color: rgba(250, 239, 228, 0.86);
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

        .amber-hero {
          position: relative;
          width: min(92vw, 900px);
          height: min(80vw, 540px);
          pointer-events: none;
          transform-origin: center;
        }

        .amber-hero-field,
        .amber-hero-floor-glow,
        .amber-hero-floor-core,
        .amber-core-shadow,
        .amber-core-tilt {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }

        .amber-hero-field-back {
          top: 13%;
          width: 700px;
          height: 410px;
          border-radius: 999px;
          background: radial-gradient(
            ellipse at center,
            rgba(118, 104, 255, 0.18) 0%,
            rgba(118, 104, 255, 0.1) 26%,
            rgba(118, 104, 255, 0.04) 48%,
            rgba(118, 104, 255, 0) 72%
          );
          filter: blur(54px);
          opacity: 0.82;
        }

        .amber-hero-field-mid {
          top: 20%;
          width: 520px;
          height: 280px;
          border-radius: 999px;
          background: radial-gradient(
            ellipse at center,
            rgba(202, 192, 255, 0.12) 0%,
            rgba(202, 192, 255, 0.06) 34%,
            rgba(202, 192, 255, 0.02) 54%,
            rgba(202, 192, 255, 0) 74%
          );
          filter: blur(34px);
          opacity: 0.82;
        }

        .amber-hero-field-front {
          top: 25%;
          width: 360px;
          height: 180px;
          border-radius: 999px;
          background: radial-gradient(
            ellipse at center,
            rgba(236, 232, 255, 0.11) 0%,
            rgba(236, 232, 255, 0.04) 40%,
            rgba(236, 232, 255, 0) 74%
          );
          filter: blur(20px);
          opacity: 0.72;
        }

        .amber-hero-floor-glow {
          bottom: 11%;
          width: 520px;
          height: 82px;
          border-radius: 999px;
          background: radial-gradient(
            ellipse at center,
            rgba(104, 90, 244, 0.18) 0%,
            rgba(104, 90, 244, 0.06) 44%,
            rgba(104, 90, 244, 0) 76%
          );
          filter: blur(26px);
          opacity: 0.72;
        }

        .amber-hero-floor-core {
          bottom: 13.5%;
          width: 260px;
          height: 34px;
          border-radius: 999px;
          background: radial-gradient(
            ellipse at center,
            rgba(154, 140, 255, 0.24) 0%,
            rgba(154, 140, 255, 0.08) 48%,
            rgba(154, 140, 255, 0) 78%
          );
          filter: blur(14px);
          opacity: 0.7;
        }

        .amber-core-shadow {
          top: 31%;
          width: 276px;
          height: 276px;
          border-radius: 50%;
          background: radial-gradient(
            circle at 50% 58%,
            rgba(10, 8, 34, 0.4) 0%,
            rgba(10, 8, 34, 0.18) 42%,
            rgba(10, 8, 34, 0) 72%
          );
          filter: blur(30px);
          opacity: 0.74;
        }

        .amber-core-tilt {
          top: 22%;
          width: 230px;
          height: 230px;
          transform-style: preserve-3d;
          perspective: 1200px;
          animation: amberTiltIdle 7.2s ease-in-out infinite;
        }

        .amber-hero-active .amber-core-tilt {
          animation: amberTiltActive 4.8s ease-in-out infinite;
        }

        .amber-hero-settled .amber-core-tilt {
          animation: amberTiltSettled 6s ease-in-out infinite;
        }

        .amber-system {
          position: relative;
          width: 230px;
          height: 230px;
          border-radius: 50%;
          transform-style: preserve-3d;
        }

        .amber-core-halo,
        .amber-orbit-ring,
        .amber-orbital-system,
        .amber-core {
          position: absolute;
          inset: 0;
          border-radius: 50%;
        }

        .amber-core-halo {
          pointer-events: none;
        }

        .amber-core-halo-back {
          background: radial-gradient(
            circle,
            rgba(132, 118, 255, 0.18) 0%,
            rgba(132, 118, 255, 0.08) 28%,
            rgba(132, 118, 255, 0.02) 46%,
            rgba(132, 118, 255, 0) 70%
          );
          filter: blur(34px);
          opacity: 0.88;
          transform: scale(1.32);
          animation: amberHaloBackIdle 5.8s ease-in-out infinite;
        }

        .amber-core-halo-mid {
          background: radial-gradient(
            circle,
            rgba(206, 198, 255, 0.18) 0%,
            rgba(206, 198, 255, 0.06) 32%,
            rgba(206, 198, 255, 0) 68%
          );
          filter: blur(20px);
          opacity: 0.82;
          transform: scale(1.14);
          animation: amberHaloMidIdle 5.6s ease-in-out infinite;
        }

        .amber-core-halo-front {
          background: radial-gradient(
            circle,
            rgba(238, 234, 255, 0.18) 0%,
            rgba(238, 234, 255, 0.08) 20%,
            rgba(238, 234, 255, 0) 56%
          );
          filter: blur(12px);
          opacity: 0.76;
          transform: scale(0.92);
          animation: amberHaloFrontIdle 5.4s ease-in-out infinite;
        }

        .amber-hero-active .amber-core-halo-back {
          animation: amberHaloBackActive 4.8s ease-in-out infinite;
        }

        .amber-hero-active .amber-core-halo-mid {
          animation: amberHaloMidActive 4.6s ease-in-out infinite;
        }

        .amber-hero-active .amber-core-halo-front {
          animation: amberHaloFrontActive 4.4s ease-in-out infinite;
        }

        .amber-hero-settled .amber-core-halo-back {
          animation: amberHaloBackSettled 5.8s ease-in-out infinite;
        }

        .amber-hero-settled .amber-core-halo-mid {
          animation: amberHaloMidSettled 5.6s ease-in-out infinite;
        }

        .amber-hero-settled .amber-core-halo-front {
          animation: amberHaloFrontSettled 5.4s ease-in-out infinite;
        }

        .amber-orbit-ring {
          border: 1px solid rgba(234, 230, 255, 0.1);
          filter: blur(0.3px);
          opacity: 0.4;
          transform-origin: center;
        }

        .amber-orbit-ring-a {
          transform: scale(1.26) rotate(-8deg);
          animation: amberRingIdle 5.8s ease-in-out infinite;
        }

        .amber-orbit-ring-b {
          transform: scale(1.26) rotate(12deg);
          opacity: 0.22;
          animation: amberRingIdleB 6.2s ease-in-out infinite;
        }

        .amber-hero-active .amber-orbit-ring-a {
          animation: amberRingActive 1.2s ease-out forwards;
        }

        .amber-hero-active .amber-orbit-ring-b {
          animation: amberRingActiveB 1.2s ease-out forwards;
        }

        .amber-hero-settled .amber-orbit-ring-a {
          animation: amberRingSettled 5.8s ease-in-out infinite;
        }

        .amber-hero-settled .amber-orbit-ring-b {
          animation: amberRingSettledB 6.2s ease-in-out infinite;
        }

        .amber-orbital-system {
          overflow: visible;
          z-index: 3;
          transform-style: preserve-3d;
          --orbiter-radius: 48px;
        }

        .amber-hero-active .amber-orbital-system,
        .amber-hero-settled .amber-orbital-system {
          --orbiter-radius: 164px;
        }

        .amber-orbital-lane {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          transform-origin: center;
        }

        .amber-orbital-lane-1 {
          transform: rotate(0deg);
        }

        .amber-orbital-lane-2 {
          transform: rotate(72deg);
        }

        .amber-orbital-lane-3 {
          transform: rotate(144deg);
        }

        .amber-orbital-lane-4 {
          transform: rotate(216deg);
        }

        .amber-orbital-lane-5 {
          transform: rotate(288deg);
        }

        .amber-hero-idle .amber-orbital-lane {
          transform: none;
        }

        .amber-orbiter-rail {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          transform-origin: center;
          animation: amberOrbitRotate 16s linear infinite;
        }

        .amber-hero-idle .amber-orbiter-rail {
          animation: none;
        }

        .amber-orbiter {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 60px;
          height: 60px;
          transform: translate(-50%, -50%) translateX(var(--orbiter-radius));
          transition: transform 1200ms ease-out;
        }

        .amber-hero-idle .amber-orbiter {
          transform: translate(
            calc(-50% + var(--idle-x, 0px)),
            calc(-50% + var(--idle-y, 0px))
          );
          transition: transform 80ms linear;
        }

        .amber-orbiter::before {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 74%;
          width: 58px;
          height: 96px;
          border-radius: 999px;
          background:
            radial-gradient(
              ellipse at 50% 100%,
              rgba(182, 168, 255, 0.24) 0%,
              rgba(142, 128, 255, 0.14) 24%,
              rgba(104, 90, 244, 0.08) 46%,
              rgba(104, 90, 244, 0) 78%
            ),
            radial-gradient(
              ellipse at 42% 62%,
              rgba(132, 118, 255, 0.14) 0%,
              rgba(104, 90, 244, 0.07) 34%,
              rgba(104, 90, 244, 0) 72%
            ),
            radial-gradient(
              ellipse at 58% 38%,
              rgba(132, 118, 255, 0.08) 0%,
              rgba(104, 90, 244, 0.035) 28%,
              rgba(104, 90, 244, 0) 68%
            );
          filter: blur(14px);
          opacity: 0;
          transform: translateX(-50%) scaleX(0.92) scaleY(0.96);
          pointer-events: none;
        }

        .amber-orbiter::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 82%;
          width: 34px;
          height: 70px;
          border-radius: 999px;
          background:
            radial-gradient(
              ellipse at 50% 100%,
              rgba(206, 198, 255, 0.16) 0%,
              rgba(164, 150, 255, 0.08) 30%,
              rgba(104, 90, 244, 0.03) 56%,
              rgba(104, 90, 244, 0) 82%
            );
          filter: blur(10px);
          opacity: 0;
          transform: translateX(-50%) translateX(-3px) scaleX(1.08) scaleY(0.94);
          pointer-events: none;
        }

        .amber-hero-active .amber-orbiter::before {
          animation: amberOrbiterTailActive 1.2s ease-out forwards;
        }

        .amber-hero-active .amber-orbiter::after {
          animation: amberOrbiterTailActive 1.2s ease-out forwards;
        }

        .amber-hero-settled .amber-orbiter::before {
          opacity: 0.9;
        }

        .amber-hero-settled .amber-orbiter::after {
          opacity: 0.68;
        }

        .amber-orbiter-core {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(
            circle at 38% 30%,
            rgba(224, 218, 255, 0.86) 0%,
            rgba(152, 138, 255, 0.86) 34%,
            rgba(82, 66, 204, 0.88) 72%,
            rgba(34, 24, 104, 0.94) 100%
          );
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.28),
            inset 0 -8px 14px rgba(18, 14, 56, 0.24);
          animation: amberOrbiterGlowIdle 5.2s ease-in-out infinite;
        }

        .amber-hero-active .amber-orbiter-core {
          animation: amberOrbiterGlowActive 4s ease-in-out infinite;
        }

        .amber-hero-settled .amber-orbiter-core {
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.28),
            inset 0 -8px 14px rgba(18, 14, 56, 0.24);
          animation: amberOrbiterGlowSettled 5.6s ease-in-out infinite;
        }

        .amber-core {
          z-index: 2;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% 42%,
              rgba(240, 236, 255, 0.98) 0%,
              rgba(206, 198, 255, 0.92) 16%,
              rgba(142, 128, 255, 0.82) 38%,
              rgba(72, 56, 188, 0.92) 72%,
              rgba(24, 18, 88, 0.98) 100%
            );
          box-shadow:
            0 28px 58px rgba(0, 0, 0, 0.34),
            0 0 44px rgba(118, 104, 255, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.28),
            inset 0 -18px 32px rgba(0, 0, 0, 0.16);
          animation: amberCoreIdle 5.8s ease-in-out infinite;
        }

        .amber-hero-active .amber-core {
          animation: amberCoreActive 4.6s ease-in-out infinite;
        }

        .amber-hero-settled .amber-core {
          animation: amberCoreSettled 5.8s ease-in-out infinite;
        }

        .amber-core-atmosphere,
        .amber-core-inner-glow,
        .amber-core-hotspot,
        .amber-core-sheen,
        .amber-core-swirl,
        .amber-core-line,
        .amber-core-glass,
        .amber-core-rim {
          position: absolute;
          pointer-events: none;
          border-radius: inherit;
        }

        .amber-core-atmosphere-a {
          inset: 6%;
          background: radial-gradient(
            circle at 32% 28%,
            rgba(232, 228, 255, 0.18),
            rgba(232, 228, 255, 0) 54%
          );
          filter: blur(12px);
        }

        .amber-core-atmosphere-b {
          inset: 18% 8% 8% 16%;
          background: radial-gradient(
            circle at 66% 70%,
            rgba(34, 24, 104, 0.24),
            rgba(34, 24, 104, 0) 58%
          );
          filter: blur(10px);
        }

        .amber-core-atmosphere-c {
          inset: 20%;
          background: radial-gradient(
            circle at 48% 48%,
            rgba(164, 150, 255, 0.18),
            rgba(164, 150, 255, 0) 64%
          );
          filter: blur(8px);
        }

        .amber-core-inner-glow {
          inset: 24%;
          background: radial-gradient(
            circle,
            rgba(220, 214, 255, 0.28),
            rgba(220, 214, 255, 0) 68%
          );
          filter: blur(8px);
        }

        .amber-core-hotspot {
          left: 31%;
          top: 25%;
          width: 28%;
          height: 24%;
          background: radial-gradient(
            ellipse at center,
            rgba(246, 244, 255, 0.44),
            rgba(246, 244, 255, 0) 70%
          );
          filter: blur(7px);
        }

        .amber-core-sheen-a {
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.14) 0%,
            rgba(255, 255, 255, 0.04) 28%,
            rgba(255, 255, 255, 0) 54%
          );
          mix-blend-mode: screen;
        }

        .amber-core-sheen-b {
          inset: 14% 22% 42% 14%;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.12),
            rgba(255, 255, 255, 0) 70%
          );
          transform: rotate(-18deg);
        }

        .amber-core-swirl-a,
        .amber-core-swirl-b,
        .amber-core-swirl-c,
        .amber-core-line-a,
        .amber-core-line-b,
        .amber-core-line-c {
          opacity: 0.32;
        }

        .amber-core-swirl-a {
          left: 20%;
          top: 36%;
          width: 62%;
          height: 18%;
          border: 1px solid rgba(236, 232, 255, 0.16);
          border-left-color: transparent;
          border-bottom-color: transparent;
          transform: rotate(-18deg);
        }

        .amber-core-swirl-b {
          left: 16%;
          top: 48%;
          width: 70%;
          height: 18%;
          border: 1px solid rgba(164, 150, 255, 0.14);
          border-right-color: transparent;
          border-top-color: transparent;
          transform: rotate(14deg);
        }

        .amber-core-swirl-c {
          left: 30%;
          top: 60%;
          width: 46%;
          height: 13%;
          border: 1px solid rgba(236, 232, 255, 0.1);
          border-left-color: transparent;
          border-bottom-color: transparent;
          transform: rotate(-10deg);
        }

        .amber-core-line-a {
          left: 24%;
          top: 30%;
          width: 44%;
          height: 1px;
          background: rgba(236, 232, 255, 0.12);
          transform: rotate(-22deg);
        }

        .amber-core-line-b {
          left: 28%;
          top: 55%;
          width: 50%;
          height: 1px;
          background: rgba(164, 150, 255, 0.12);
          transform: rotate(18deg);
        }

        .amber-core-line-c {
          left: 36%;
          top: 68%;
          width: 30%;
          height: 1px;
          background: rgba(236, 232, 255, 0.1);
          transform: rotate(-12deg);
        }

        .amber-core-glass {
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.1) 0%,
              rgba(255, 255, 255, 0) 36%,
              rgba(0, 0, 0, 0.06) 100%
            );
          mix-blend-mode: screen;
        }

        .amber-core-rim {
          inset: 0;
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.14),
            inset 0 0 0 16px rgba(255, 255, 255, 0.014);
        }

        .prompt {
          display: block;
          margin: 0 0 14px;
          font-size: 1.02rem;
          font-weight: 540;
          color: rgba(232, 228, 255, 0.94);
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
          color: rgba(158, 146, 255, 0.42);
          text-align: center;
        }

        .decision-input {
          width: 100%;
          min-height: 74px;
          padding: 18px 24px;
          border-radius: 30px;
          border: 1px solid rgba(214, 210, 255, 0.18);
          background:
            linear-gradient(
              180deg,
              rgba(14, 16, 34, 0.84) 0%,
              rgba(10, 12, 26, 0.8) 100%
            );
          box-shadow:
            0 0 18px rgba(124, 116, 222, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            inset 0 -1px 0 rgba(255, 255, 255, 0.03),
            0 0 0 1px rgba(164, 156, 244, 0.03);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          color: rgba(196, 188, 255, 0.78);
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
          border-color: rgba(196, 188, 255, 0.34);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            0 0 0 1px rgba(196, 188, 255, 0.08),
            0 0 28px rgba(124, 116, 222, 0.12);
        }

        .decision-input::placeholder {
          color: rgba(158, 146, 255, 0.42);
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

        .upgrade-nudge {
          margin-top: 20px;
          padding: 14px 20px;
          border-radius: 12px;
          border: 0.5px solid rgba(124, 116, 222, 0.2);
          background: rgba(124, 116, 222, 0.06);
          text-align: center;
        }

        .upgrade-nudge-text {
          margin: 0;
          font-family: var(--font-body, 'Jost', sans-serif);
          font-size: 13px;
          line-height: 1.6;
          color: rgba(184, 176, 236, 0.52);
        }

        .upgrade-nudge-link {
          color: rgba(204, 194, 255, 0.7);
          text-decoration: none;
          white-space: nowrap;
        }

        .upgrade-nudge-link:hover {
          color: rgba(204, 194, 255, 0.95);
        }

        .primary-button,
        .secondary-button {
          position: relative;
          min-width: 204px;
          min-height: 58px;
          padding: 0 28px;
          border-radius: 999px;
          border: 1px solid rgba(214, 210, 255, 0.24);
          background:
            linear-gradient(
              180deg,
              rgba(148, 136, 244, 0.18) 0%,
              rgba(110, 96, 208, 0.16) 46%,
              rgba(48, 42, 116, 0.2) 100%
            );
          box-shadow:
            0 0 34px rgba(124, 116, 222, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.28),
            inset 0 -14px 24px rgba(18, 14, 56, 0.24);
          color: rgba(232, 228, 255, 0.94);
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
              rgba(158, 146, 255, 0.24) 0%,
              rgba(158, 146, 255, 0.06) 42%,
              rgba(158, 146, 255, 0) 74%
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

        .primary-button-ready {
          border-color: rgba(224, 220, 255, 0.34);
          box-shadow:
            0 0 44px rgba(138, 130, 236, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            inset 0 -14px 24px rgba(18, 14, 56, 0.26);
          filter: brightness(1.03);
        }

        .primary-button:hover,
        .secondary-button:hover {
          transform: translateY(-1px);
          border-color: rgba(232, 228, 255, 0.34);
          box-shadow:
            0 0 50px rgba(142, 134, 240, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.34),
            inset 0 -14px 24px rgba(18, 14, 56, 0.28);
        }

        .primary-button:hover .button-label-arrow {
          transform: translateX(0.25rem);
        }

        .primary-button:active,
        .secondary-button:active {
          transform: translateY(1px);
          box-shadow:
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
          color: rgba(255, 244, 232, 0.96);
          text-shadow:
            0 4px 16px rgba(0, 0, 0, 0.26),
            0 0 10px rgba(156, 148, 246, 0.08);
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
          border: 1px solid rgba(214, 210, 255, 0.18);
          background:
            linear-gradient(
              180deg,
              rgba(14, 16, 34, 0.84) 0%,
              rgba(10, 12, 26, 0.8) 100%
            );
          background-clip: padding-box;
          box-shadow:
            0 0 20px rgba(124, 116, 222, 0.08),
            0 0 0 1px rgba(164, 156, 244, 0.03);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          animation: responseReveal 600ms ease forwards;
          opacity: 0;
          transform: translateY(12px);
        }

        .response-card-crisis {
          border-color: rgba(255, 255, 255, 0.12);
          background:
            linear-gradient(
              180deg,
              rgba(18, 12, 10, 0.72) 0%,
              rgba(14, 10, 8, 0.78) 100%
            );
          box-shadow:
            0 0 18px rgba(124, 116, 222, 0.06),
            0 0 0 1px rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
        }

        .response-card-redirect {
          border-color: rgba(214, 210, 255, 0.14);
          background:
            linear-gradient(
              180deg,
              rgba(16, 14, 34, 0.78) 0%,
              rgba(12, 10, 28, 0.82) 100%
            );
        }

        .response-card-label {
          margin-bottom: 12px;
          font-size: 0.75rem;
          font-weight: 560;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(206, 200, 248, 0.66);
        }

        .response-copy {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .response-text {
          margin: 0;
          color: rgba(255, 248, 242, 0.96);
          line-height: 1.8;
          text-shadow: 0 5px 18px rgba(0, 0, 0, 0.24);
          white-space: pre-line;
        }

        .response-text-soft {
          color: rgba(220, 216, 248, 0.78);
        }

        .steps-block {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .redirect-button-wrap {
          display: flex;
          justify-content: flex-start;
        }

        .redirect-button {
          min-width: 0;
        }

        @keyframes amberTiltIdle {
          0%,
          100% {
            transform: translateX(-50%) rotateX(0deg) rotateY(-0.8deg);
          }
          50% {
            transform: translateX(-50%) rotateX(0.9deg) rotateY(1.2deg);
          }
        }

        @keyframes amberTiltActive {
          0%,
          100% {
            transform: translateX(-50%) rotateX(0deg) rotateY(-1deg);
          }
          50% {
            transform: translateX(-50%) rotateX(1.1deg) rotateY(1.6deg);
          }
        }

        @keyframes amberTiltSettled {
          0%,
          100% {
            transform: translateX(-50%) rotateX(0deg) rotateY(-0.7deg);
          }
          50% {
            transform: translateX(-50%) rotateX(0.8deg) rotateY(1.1deg);
          }
        }

        @keyframes amberCoreIdle {
          0%,
          100% {
            transform: translateY(0) scale(0.996);
            opacity: 0.68;
            filter: blur(0.6px);
          }
          50% {
            transform: translateY(-6px) scale(1.02);
            opacity: 0.78;
            filter: blur(1px);
          }
        }

        @keyframes amberCoreActive {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.72;
            filter: blur(0.6px);
          }
          45% {
            transform: translateY(-4px) scale(0.985);
            opacity: 0.78;
            filter: blur(0.8px);
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.74;
            filter: blur(0.7px);
          }
        }

        @keyframes amberCoreSettled {
          0%,
          100% {
            transform: translateY(0) scale(0.998);
            opacity: 0.72;
            filter: blur(0.6px);
          }
          50% {
            transform: translateY(-4px) scale(1.018);
            opacity: 0.8;
            filter: blur(0.8px);
          }
        }

        @keyframes amberHaloBackIdle {
          0%,
          100% {
            transform: scale(1.28);
            opacity: 0.58;
          }
          50% {
            transform: scale(1.36);
            opacity: 0.76;
          }
        }

        @keyframes amberHaloMidIdle {
          0%,
          100% {
            transform: scale(1.1);
            opacity: 0.46;
          }
          50% {
            transform: scale(1.16);
            opacity: 0.62;
          }
        }

        @keyframes amberHaloFrontIdle {
          0%,
          100% {
            transform: scale(0.9);
            opacity: 0.28;
          }
          50% {
            transform: scale(0.96);
            opacity: 0.42;
          }
        }

        @keyframes amberHaloBackActive {
          0%,
          100% {
            transform: scale(1.22);
            opacity: 0.46;
          }
          50% {
            transform: scale(1.42);
            opacity: 0.74;
          }
        }

        @keyframes amberHaloMidActive {
          0%,
          100% {
            transform: scale(1.04);
            opacity: 0.38;
          }
          50% {
            transform: scale(1.18);
            opacity: 0.56;
          }
        }

        @keyframes amberHaloFrontActive {
          0%,
          100% {
            transform: scale(0.86);
            opacity: 0.24;
          }
          50% {
            transform: scale(1);
            opacity: 0.4;
          }
        }

        @keyframes amberHaloBackSettled {
          0%,
          100% {
            transform: scale(1.2);
            opacity: 0.34;
          }
          50% {
            transform: scale(1.28);
            opacity: 0.48;
          }
        }

        @keyframes amberHaloMidSettled {
          0%,
          100% {
            transform: scale(1.02);
            opacity: 0.26;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.36;
          }
        }

        @keyframes amberHaloFrontSettled {
          0%,
          100% {
            transform: scale(0.84);
            opacity: 0.16;
          }
          50% {
            transform: scale(0.9);
            opacity: 0.26;
          }
        }

        @keyframes amberAuraIdle {
          0%,
          100% {
            transform: translateX(-50%) scale(0.95);
            opacity: 0.68;
          }
          50% {
            transform: translateX(-50%) scale(1.12);
            opacity: 0.94;
          }
        }

        @keyframes amberAuraMidIdle {
          0%,
          100% {
            transform: translateX(-50%) scale(0.96);
            opacity: 0.66;
          }
          50% {
            transform: translateX(-50%) scale(1.08);
            opacity: 0.84;
          }
        }

        @keyframes amberAuraFrontIdle {
          0%,
          100% {
            transform: translateX(-50%) scale(0.965);
            opacity: 0.54;
          }
          50% {
            transform: translateX(-50%) scale(1.06);
            opacity: 0.7;
          }
        }

        @keyframes amberFloorIdle {
          0%,
          100% {
            transform: translateX(-50%) scaleX(0.92) scaleY(0.9);
            opacity: 0.56;
          }
          50% {
            transform: translateX(-50%) scaleX(1.08) scaleY(1.12);
            opacity: 0.82;
          }
        }

        @keyframes amberFloorCoreIdle {
          0%,
          100% {
            transform: translateX(-50%) scaleX(0.9);
            opacity: 0.48;
          }
          50% {
            transform: translateX(-50%) scaleX(1.08);
            opacity: 0.72;
          }
        }

        @keyframes amberAuraActive {
          0%,
          100% {
            transform: translateX(-50%) scale(0.96);
            opacity: 0.72;
          }
          50% {
            transform: translateX(-50%) scale(1.18);
            opacity: 1;
          }
        }

        @keyframes amberAuraMidActive {
          0%,
          100% {
            transform: translateX(-50%) scale(0.96);
            opacity: 0.68;
          }
          50% {
            transform: translateX(-50%) scale(1.14);
            opacity: 0.94;
          }
        }

        @keyframes amberAuraFrontActive {
          0%,
          100% {
            transform: translateX(-50%) scale(0.97);
            opacity: 0.58;
          }
          50% {
            transform: translateX(-50%) scale(1.12);
            opacity: 0.82;
          }
        }

        @keyframes amberFloorActive {
          0%,
          100% {
            transform: translateX(-50%) scaleX(0.92) scaleY(0.9);
            opacity: 0.58;
          }
          50% {
            transform: translateX(-50%) scaleX(1.16) scaleY(1.18);
            opacity: 0.94;
          }
        }

        @keyframes amberFloorCoreActive {
          0%,
          100% {
            transform: translateX(-50%) scaleX(0.92);
            opacity: 0.52;
          }
          50% {
            transform: translateX(-50%) scaleX(1.16);
            opacity: 0.84;
          }
        }

        @keyframes amberAuraSettled {
          0%,
          100% {
            transform: translateX(-50%) scale(0.97);
            opacity: 0.7;
          }
          50% {
            transform: translateX(-50%) scale(1.1);
            opacity: 0.84;
          }
        }

        @keyframes amberAuraMidSettled {
          0%,
          100% {
            transform: translateX(-50%) scale(0.97);
            opacity: 0.64;
          }
          50% {
            transform: translateX(-50%) scale(1.06);
            opacity: 0.76;
          }
        }

        @keyframes amberAuraFrontSettled {
          0%,
          100% {
            transform: translateX(-50%) scale(0.98);
            opacity: 0.5;
          }
          50% {
            transform: translateX(-50%) scale(1.04);
            opacity: 0.62;
          }
        }

        @keyframes amberFloorSettled {
          0%,
          100% {
            transform: translateX(-50%) scaleX(0.93) scaleY(0.92);
            opacity: 0.58;
          }
          50% {
            transform: translateX(-50%) scaleX(1.1) scaleY(1.12);
            opacity: 0.8;
          }
        }

        @keyframes amberFloorCoreSettled {
          0%,
          100% {
            transform: translateX(-50%) scaleX(0.94);
            opacity: 0.5;
          }
          50% {
            transform: translateX(-50%) scaleX(1.08);
            opacity: 0.68;
          }
        }

        @keyframes amberOrbitRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes amberRingIdle {
          0%,
          100% {
            transform: scale(0.3) rotate(-8deg);
            opacity: 0.04;
          }
          50% {
            transform: scale(0.48) rotate(-4deg);
            opacity: 0.12;
          }
        }

        @keyframes amberRingIdleB {
          0%,
          100% {
            transform: scale(0.3) rotate(12deg);
            opacity: 0.02;
          }
          50% {
            transform: scale(0.48) rotate(18deg);
            opacity: 0.07;
          }
        }

        @keyframes amberRingActive {
          0% {
            transform: scale(0.3) rotate(-8deg);
            opacity: 0.04;
          }
          100% {
            transform: scale(1.26) rotate(-8deg);
            opacity: 0.22;
          }
        }

        @keyframes amberRingActiveB {
          0% {
            transform: scale(0.3) rotate(12deg);
            opacity: 0.02;
          }
          100% {
            transform: scale(1.26) rotate(12deg);
            opacity: 0.12;
          }
        }

        @keyframes amberRingSettled {
          0%,
          100% {
            transform: scale(1.26) rotate(-8deg);
            opacity: 0.12;
          }
          50% {
            transform: scale(1.3) rotate(-5deg);
            opacity: 0.2;
          }
        }

        @keyframes amberRingSettledB {
          0%,
          100% {
            transform: scale(1.26) rotate(12deg);
            opacity: 0.06;
          }
          50% {
            transform: scale(1.3) rotate(16deg);
            opacity: 0.12;
          }
        }

        @keyframes amberOrbiterTailActive {
          0% {
            opacity: 0;
          }
          45% {
            opacity: 0.34;
          }
          100% {
            opacity: 0.78;
          }
        }

        @keyframes amberOrbiterGlowIdle {
          0%,
          100% {
            filter: brightness(0.86) saturate(0.94);
            opacity: 0.58;
          }
          50% {
            filter: brightness(1.04) saturate(1);
            opacity: 0.8;
          }
        }

        @keyframes amberOrbiterGlowActive {
          0% {
            filter: brightness(0.92) saturate(0.96);
            opacity: 0.68;
          }
          50% {
            filter: brightness(1.16) saturate(1.06);
            opacity: 0.94;
          }
          100% {
            filter: brightness(1.08) saturate(1.04);
            opacity: 0.88;
          }
        }

        @keyframes amberOrbiterGlowSettled {
          0%,
          100% {
            filter: brightness(1) saturate(1);
            opacity: 0.8;
          }
          50% {
            filter: brightness(1.14) saturate(1.08);
            opacity: 0.94;
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

          .amber-hero {
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

          .amber-hero {
            transform: scale(0.72);
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
