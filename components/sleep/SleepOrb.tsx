"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import PatternSelector, { type SleepPattern } from "./PatternSelector";
import ProgressRing, { RING_CIRCUMFERENCE } from "./ProgressRing";
import { glassBackground, glassBorder, getToolRgb } from "@/lib/design-tokens";
import { useToolHistory } from "@/hooks/useToolHistory";
import ToolUpgradePrompt from "@/components/shared/ToolUpgradePrompt";

// ─── Types ───────────────────────────────────────────────────────────────────
type PhaseType = "inhale" | "hold-in" | "exhale";
interface Phase { label: string; type: PhaseType; duration: number; }

// ─── Constants ────────────────────────────────────────────────────────────────
const PATTERNS: Record<SleepPattern, Phase[]> = {
  "48":    [{ label: "Inhale", type: "inhale", duration: 4 }, { label: "Exhale", type: "exhale", duration: 8 }],
  "478":   [{ label: "Inhale", type: "inhale", duration: 4 }, { label: "Hold",   type: "hold-in", duration: 7 }, { label: "Exhale", type: "exhale", duration: 8 }],
  "relax": [{ label: "Inhale", type: "inhale", duration: 5 }, { label: "Exhale", type: "exhale", duration: 10 }],
};
const CYCLES: Record<SleepPattern, number> = { "48": 8, "478": 6, "relax": 6 };
const PATTERN_INFO: Record<SleepPattern, { duration: string; bestFor: string }> = {
  "48":    { duration: "~4 min", bestFor: "Sleep onset" },
  "478":   { duration: "~5 min", bestFor: "Anxiety · Sleep" },
  "relax": { duration: "~5 min", bestFor: "Deep relaxation" },
};

const ORB_MIN      = 1.0;
const ORB_MAX      = 1.18;
const DIM_DELAY_MS = 4000;

// Canonical teal token — Calm category
const T = (a: number) => `rgba(60,192,212,${a})`;

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

interface Props { userId: string | null; }

export default function SleepOrb({ userId }: Props) {
  const [pattern, setPattern]         = useState<SleepPattern>("48");
  const [isRunning, setIsRunning]     = useState(false);
  const [started, setStarted]         = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  // ── Orb / ring refs ────────────────────────────────────────────────────
  const orbRef   = useRef<HTMLDivElement>(null);
  const glowRef  = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const cycleRef = useRef<HTMLParagraphElement>(null);
  const ringRef  = useRef<SVGCircleElement>(null);

  // ── Dimming refs ───────────────────────────────────────────────────────
  const vignetteRef    = useRef<HTMLDivElement>(null);
  const headerRef      = useRef<HTMLElement>(null);
  const patternAreaRef = useRef<HTMLDivElement>(null);
  const cardsRef       = useRef<HTMLDivElement>(null);
  const humanLineRef   = useRef<HTMLParagraphElement>(null);
  const crossLinksRef  = useRef<HTMLElement>(null);

  // ── RAF / loop state refs ──────────────────────────────────────────────
  const rafRef          = useRef<number>(0);
  const isRunningRef    = useRef(false);
  const patternKeyRef   = useRef(pattern);
  const phaseIdxRef     = useRef(0);
  const cycleIdxRef     = useRef(0);
  const phaseStartRef   = useRef(0);
  const labelVisibleRef = useRef(false);
  const labelDimRef     = useRef(1);
  const dimTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { patternKeyRef.current = pattern; }, [pattern]);

  // ── Dimming helpers ────────────────────────────────────────────────────
  const applyDimming = useCallback(() => {
    [headerRef, patternAreaRef, cardsRef, humanLineRef, crossLinksRef].forEach((r) => {
      if (r.current) r.current.style.opacity = "0.1";
    });
    if (vignetteRef.current) vignetteRef.current.style.opacity = "1";
  }, []);

  const removeDimming = useCallback((instant = false) => {
    [headerRef, patternAreaRef, cardsRef, humanLineRef, crossLinksRef].forEach((r) => {
      if (!r.current) return;
      if (instant) {
        r.current.style.transition = "opacity 0s";
        r.current.style.opacity = "";
        requestAnimationFrame(() => { if (r.current) r.current.style.transition = ""; });
      } else {
        r.current.style.opacity = "";
      }
    });
    if (vignetteRef.current) {
      if (instant) {
        vignetteRef.current.style.transition = "opacity 0s";
        vignetteRef.current.style.opacity = "0";
        requestAnimationFrame(() => { if (vignetteRef.current) vignetteRef.current.style.transition = ""; });
      } else {
        vignetteRef.current.style.opacity = "0";
      }
    }
  }, []);

  // ── Silent reset ───────────────────────────────────────────────────────
  const doSilentReset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (dimTimerRef.current)   clearTimeout(dimTimerRef.current);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    isRunningRef.current = false;
    labelVisibleRef.current = false;
    setIsRunning(false);
    setStarted(false);
    removeDimming(true);
    if (orbRef.current)  { orbRef.current.style.transition = ""; orbRef.current.style.transform = "scale(1)"; orbRef.current.style.filter = ""; orbRef.current.style.opacity = ""; }
    if (glowRef.current) { glowRef.current.style.transform = "scale(1.1)"; glowRef.current.style.opacity = ""; }
    if (labelRef.current) { labelRef.current.textContent = ""; labelRef.current.style.opacity = "0"; }
    if (cycleRef.current)  cycleRef.current.textContent = "";
    if (ringRef.current)  { ringRef.current.style.strokeDashoffset = `${RING_CIRCUMFERENCE}`; ringRef.current.style.opacity = ""; }
  }, [removeDimming]);

  const doSilentResetRef = useRef(doSilentReset);
  useEffect(() => { doSilentResetRef.current = doSilentReset; }, [doSilentReset]);

  // ── History ────────────────────────────────────────────────────────────
  const { history, loadHistory, shouldShowUpgradePrompt } = useToolHistory("sleep", userId);
  const loadHistoryRef = useRef(loadHistory);
  useEffect(() => { loadHistoryRef.current = loadHistory; }, [loadHistory]);

  // ── RAF loop ───────────────────────────────────────────────────────────
  const loop = useCallback(function loopFrame(ts: number) {
    if (!isRunningRef.current) return;
    const pat         = patternKeyRef.current;
    const phases      = PATTERNS[pat];
    const totalCycles = CYCLES[pat];
    const pi          = phaseIdxRef.current;
    const phase       = phases[pi];
    const elapsed     = (ts - phaseStartRef.current) / 1000;
    const raw         = Math.min(elapsed / phase.duration, 1);
    const t           = easeInOut(raw);

    let scale = ORB_MIN;
    let blur  = 0;
    if (phase.type === "inhale")   { scale = ORB_MIN + (ORB_MAX - ORB_MIN) * t; }
    else if (phase.type === "hold-in") { scale = ORB_MAX; }
    else if (phase.type === "exhale")  { scale = ORB_MAX - (ORB_MAX - ORB_MIN) * t; blur = 2 * raw; }

    if (orbRef.current) {
      orbRef.current.style.transform = `scale(${scale.toFixed(4)})`;
      orbRef.current.style.filter    = blur > 0.01 ? `blur(${blur.toFixed(3)}px)` : "";
    }
    if (glowRef.current) {
      glowRef.current.style.transform = `scale(${(scale * 1.1).toFixed(4)})`;
    }

    const totalPhaseDur = phases.reduce((s, p) => s + p.duration, 0);
    const donePhaseDur  = phases.slice(0, pi).reduce((s, p) => s + p.duration, 0);
    const cycleElapsed  = cycleIdxRef.current * totalPhaseDur + donePhaseDur + Math.min(elapsed, phase.duration);
    const sessionProg   = Math.min(cycleElapsed / (totalPhaseDur * totalCycles), 1);

    if (ringRef.current) {
      ringRef.current.style.strokeDashoffset = `${RING_CIRCUMFERENCE * (1 - sessionProg)}`;
      ringRef.current.style.opacity = `${Math.max(1 - sessionProg * 0.5, 0.5)}`;
    }

    const orbOpacity  = Math.max(1 - sessionProg * 0.4, 0.6);
    const glowOpacity = Math.max(1 - sessionProg * 0.6, 0.4);
    const labelDim    = Math.max(1 - sessionProg * 0.5, 0.5);
    labelDimRef.current = labelDim;
    if (orbRef.current)  orbRef.current.style.opacity  = `${orbOpacity}`;
    if (glowRef.current) glowRef.current.style.opacity = `${glowOpacity}`;
    if (labelVisibleRef.current && labelRef.current) {
      labelRef.current.style.opacity = `${labelDim}`;
    }

    if (raw >= 1) {
      const nextPi = (pi + 1) % phases.length;
      labelVisibleRef.current = false;
      if (labelRef.current) labelRef.current.style.opacity = "0";

      if (nextPi === 0) {
        const newCycle = cycleIdxRef.current + 1;
        if (newCycle >= totalCycles) {
          isRunningRef.current = false;
          if (ringRef.current) ringRef.current.style.strokeDashoffset = "0";
          if (userId) {
            const totalPhaseDur2  = phases.reduce((s, p) => s + p.duration, 0);
            const durationSeconds = totalPhaseDur2 * totalCycles;
            const patternLabel    = pat === "48" ? "4-8" : pat === "478" ? "4-7-8" : "5-10";
            fetch("/api/sleep", {
              method:  "POST",
              headers: { "Content-Type": "application/json" },
              body:    JSON.stringify({ pattern: patternLabel, cycles: totalCycles, duration_seconds: durationSeconds }),
            }).then(() => loadHistoryRef.current()).catch(() => {});
          }
          if (orbRef.current) {
            orbRef.current.style.transition = "opacity 3s ease";
            orbRef.current.style.opacity    = "0.3";
            orbRef.current.style.transform  = "scale(1)";
            orbRef.current.style.filter     = "";
          }
          if (glowRef.current) glowRef.current.style.opacity = "0";
          resetTimerRef.current = setTimeout(() => doSilentResetRef.current(), 5000);
          return;
        }
        cycleIdxRef.current = newCycle;
        if (cycleRef.current) {
          cycleRef.current.textContent = `Cycle ${newCycle + 1} of ${totalCycles}`;
        }
      }

      phaseIdxRef.current   = nextPi;
      phaseStartRef.current += phase.duration * 1000;
      const nextLabel = phases[nextPi].label;
      setTimeout(() => {
        if (labelRef.current && isRunningRef.current) {
          labelRef.current.textContent   = nextLabel;
          labelRef.current.style.opacity = `${labelDimRef.current}`;
          labelVisibleRef.current = true;
        }
      }, 200);
    }

    rafRef.current = requestAnimationFrame(loopFrame);
  }, [userId]);

  // ── Start / stop ───────────────────────────────────────────────────────
  useEffect(() => {
    isRunningRef.current = isRunning;
    if (isRunning) {
      const phases      = PATTERNS[patternKeyRef.current];
      const totalCycles = CYCLES[patternKeyRef.current];
      phaseIdxRef.current     = 0;
      cycleIdxRef.current     = 0;
      phaseStartRef.current   = performance.now();
      labelVisibleRef.current = true;
      if (orbRef.current)  { orbRef.current.style.transition = ""; orbRef.current.style.transform = "scale(1)"; orbRef.current.style.filter = ""; orbRef.current.style.opacity = "1"; }
      if (glowRef.current) { glowRef.current.style.transform = "scale(1.1)"; glowRef.current.style.opacity = "1"; }
      if (labelRef.current) { labelRef.current.textContent = phases[0].label; labelRef.current.style.opacity = "1"; }
      if (cycleRef.current)  cycleRef.current.textContent = `Cycle 1 of ${totalCycles}`;
      if (ringRef.current)  { ringRef.current.style.strokeDashoffset = `${RING_CIRCUMFERENCE}`; ringRef.current.style.opacity = "1"; }
      dimTimerRef.current = setTimeout(applyDimming, DIM_DELAY_MS);
      rafRef.current = requestAnimationFrame(loop);
    } else {
      cancelAnimationFrame(rafRef.current);
      if (dimTimerRef.current) clearTimeout(dimTimerRef.current);
      labelVisibleRef.current = false;
      if (labelRef.current) labelRef.current.style.opacity = "0";
      removeDimming(true);
    }
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (dimTimerRef.current)   clearTimeout(dimTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, [isRunning, loop, applyDimming, removeDimming]);

  function handleStart() { patternKeyRef.current = pattern; setStarted(true); setIsRunning(true); }
  function handleStop()  { if (resetTimerRef.current) clearTimeout(resetTimerRef.current); setIsRunning(false); setStarted(false); }

  const info         = PATTERN_INFO[pattern];
  const historyLabel = history?.isPaid ? "Full history" : "7-day history";
  const rgbBreathing = getToolRgb("breathing").replace(/, /g, ",");
  const rgbChoose    = getToolRgb("choose").replace(/, /g, ",");

  return (
    <div>
      {/* Vignette — sleep-only dimming effect */}
      <div
        ref={vignetteRef}
        className="fixed inset-0 z-[90] pointer-events-none opacity-0 transition-opacity duration-[3000ms]"
        style={{ background: "radial-gradient(ellipse at center, transparent 20%, rgba(5,7,12,0.85) 100%)" }}
      />

      {/* Page content */}
      <div className="max-w-[780px] mx-auto px-6 pt-[96px] md:pt-[140px] pb-28">

        {/* Tool header — dimmable */}
        <header ref={headerRef} className="text-center mb-2 md:mb-14 transition-opacity duration-[3000ms]">
          <p
            className="[font-family:var(--font-jost)] text-[10px] tracking-[0.26em] uppercase mb-2 md:mb-3"
            style={{ color: T(0.80) }}
          >
            Calm your state
          </p>
          <h1
            className="[font-family:var(--font-display)] font-light text-[22px] md:text-[clamp(36px,5vw,56px)] leading-tight"
            style={{ color: "rgba(255,255,255,0.92)" }}
          >
            Let the day go.
          </h1>
        </header>

        {/* Pattern selector — dimmable */}
        <div ref={patternAreaRef} className="transition-opacity duration-[3000ms]">
          <PatternSelector selected={pattern} onChange={setPattern} disabled={isRunning} />
        </div>

        {/* Orb section — z-[100], above vignette */}
        <div className="flex flex-col items-center relative z-[100] mb-4 md:mb-0">

          {/* Phase label */}
          <p
            ref={labelRef}
            className="[font-family:var(--font-display)] italic font-light text-[38px] leading-none mb-8 text-center select-none transition-opacity duration-[220ms] ease-in-out opacity-0"
            aria-live="polite"
            style={{ color: "rgba(180,165,235,0.88)" }}
          />

          {/* Orb stage */}
          <div className="relative w-[228px] h-[228px]">
            <ProgressRing ref={ringRef} />

            {/* Glow — indigo/violet, sleep personality */}
            <div
              ref={glowRef}
              className="absolute w-[160px] h-[160px] rounded-full top-[34px] left-[34px]"
              style={{
                background: "rgba(100,80,210,0.20)",
                filter:     "blur(28px)",
                transform:  "scale(1.1)",
              }}
            />

            {/* Orb sphere — deep indigo gradient, sleep personality */}
            <div
              ref={orbRef}
              className="absolute w-[160px] h-[160px] rounded-full top-[34px] left-[34px] z-10 bg-[radial-gradient(circle_at_50%_44%,rgba(140,115,235,0.28)_0%,rgba(90,70,190,0.16)_38%,rgba(50,35,140,0.10)_72%,rgba(25,15,80,0.08)_100%)]"
              style={{
                border:    "0.5px solid rgba(100,80,210,0.22)",
                transform: "scale(1)",
              }}
            />
          </div>

          {/* Cycle counter */}
          <p
            ref={cycleRef}
            className="[font-family:var(--font-jost)] text-[10px] tracking-[0.22em] uppercase h-4 mt-5 text-center w-full"
            style={{ color: T(0.38) }}
          />

          {/* Begin / Stop — solid teal pill on all viewports */}
          <div className="mt-6 mb-10 md:mb-16 flex justify-center">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="[font-family:var(--font-jost)] text-[11px] tracking-[0.22em] uppercase cursor-pointer px-8 py-3 rounded-full transition-all duration-300 bg-[rgba(60,192,212,0.85)] border border-[rgba(60,192,212,0.90)] text-[rgba(10,30,36,0.95)] hover:bg-[rgba(60,192,212,1)] hover:border-[rgba(60,192,212,1)]"
              >
                {started ? "Begin again" : "Begin"}
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="[font-family:var(--font-jost)] text-[11px] tracking-[0.22em] uppercase cursor-pointer px-8 py-3 rounded-full transition-all duration-300 bg-[rgba(60,192,212,0.85)] border border-[rgba(60,192,212,0.90)] text-[rgba(10,30,36,0.95)] hover:bg-[rgba(60,192,212,1)] hover:border-[rgba(60,192,212,1)]"
              >
                Stop
              </button>
            )}
          </div>
        </div>

        {/* Info cards — dimmable, Duration + Best For only */}
        <div
          ref={cardsRef}
          className="grid grid-cols-2 gap-2 max-w-[320px] md:max-w-[420px] mx-auto mb-4 md:mb-20 transition-opacity duration-[3000ms]"
        >
          {[
            { label: "Duration", value: info.duration },
            { label: "Best for", value: info.bestFor  },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-0.5 p-2 md:px-4 md:py-4 rounded-[10px] md:rounded-[12px]"
              style={{ border: `1px solid ${T(0.15)}`, background: T(0.04) }}
            >
              <p
                className="[font-family:var(--font-jost)] text-[10px] md:text-[11px] tracking-[0.18em] uppercase"
                style={{ color: T(0.65) }}
              >
                {label}
              </p>
              <p
                className="[font-family:var(--font-display)] font-light text-[13px] md:text-[14px] text-center leading-snug"
                style={{ color: T(0.92) }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Human line — dimmable */}
        <p
          ref={humanLineRef}
          className="text-center [font-family:var(--font-display)] italic font-light text-[clamp(16px,2.2vw,22px)] mb-16 max-w-[440px] mx-auto leading-relaxed transition-opacity duration-[3000ms]"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          The day is done. Your body already knows what to do.
        </p>

        {/* History — mobile toggle */}
        {userId && history && (
          <section className={`max-w-[520px] mx-auto ${historyOpen ? "mb-6" : "mb-4"} md:mb-20`}>

            {/* Mobile toggle */}
            <button
              className="w-full md:hidden cursor-pointer rounded-[14px] px-4 py-3 flex items-center justify-between transition-all duration-300"
              style={{
                background:              T(0.03),
                border:                  `1px solid ${T(0.12)}`,
                borderBottomLeftRadius:  historyOpen ? "0" : "14px",
                borderBottomRightRadius: historyOpen ? "0" : "14px",
              }}
              onClick={() => setHistoryOpen(o => !o)}
              aria-expanded={historyOpen}
            >
              <p
                className="[font-family:var(--font-jost)] text-[11px] tracking-[0.24em] uppercase"
                style={{ color: T(0.65) }}
              >
                {historyLabel}
              </p>
              <span
                className="text-[20px] leading-none transition-transform duration-300 flex items-center justify-center w-8 h-8 rounded-full"
                style={{
                  color:      T(0.65),
                  background: T(0.06),
                  transform:  historyOpen ? "rotate(45deg)" : "rotate(0deg)",
                }}
              >
                +
              </span>
            </button>

            {/* Desktop label */}
            <p
              className="hidden md:block [font-family:var(--font-jost)] text-[12px] tracking-[0.24em] uppercase mb-4 text-center"
              style={{ color: T(0.65) }}
            >
              {historyLabel}
            </p>

            {/* History content */}
            <div className={`${historyOpen ? "block" : "hidden"} md:block`}>
              <div
                className="rounded-b-[14px] md:rounded-[14px] px-3 py-3 md:px-5 md:py-4"
                style={{
                  border:     `1px solid ${T(0.12)}`,
                  borderTop:  historyOpen ? `1px solid ${T(0.06)}` : `1px solid ${T(0.12)}`,
                  background: T(0.03),
                }}
              >
                <p
                  className="[font-family:var(--font-jost)] text-[12px] md:text-[13px] font-light leading-relaxed text-center"
                  style={{ color: "rgba(255,255,255,0.80)" }}
                >
                  {!history.isPaid
                    ? "Free users keep 7 days of history. Your older sessions are still there."
                    : history.sessions.length > 0
                    ? `${history.sessions.length} session${history.sessions.length === 1 ? "" : "s"} saved.`
                    : "No sessions saved yet."}
                </p>

                {history.hasStreak && (
                  <div
                    className="mt-4 rounded-[12px] px-4 py-3"
                    style={{ border: `1px solid ${T(0.12)}`, background: T(0.04) }}
                  >
                    <p
                      className="[font-family:var(--font-jost)] text-[11px] md:text-[12px] tracking-[0.22em] uppercase text-center mb-1.5"
                      style={{ color: T(0.65) }}
                    >
                      Current streak
                    </p>
                    <p
                      className="[font-family:var(--font-display)] font-light text-[20px] md:text-[24px] text-center leading-none"
                      style={{ color: T(0.92) }}
                    >
                      {history.currentStreakDays} day{history.currentStreakDays === 1 ? "" : "s"}
                    </p>
                    <p
                      className="[font-family:var(--font-jost)] text-[12px] font-light leading-relaxed text-center mt-3"
                      style={{ color: T(0.70) }}
                    >
                      {history.streakFraming === "full"
                        ? "A quiet record of the nights you chose to wind down."
                        : "Consistency gets easier when you can see the full picture."}
                    </p>
                  </div>
                )}

                {shouldShowUpgradePrompt && (
                  <ToolUpgradePrompt hasOlderSessions={history.hasOlderSessions} toolColour="60,192,212" toolName="Sleep Wind-Down" />
                )}
              </div>
            </div>
          </section>
        )}

        {/* Cross-links — desktop only */}
        <section ref={crossLinksRef} className="hidden md:block transition-opacity duration-[3000ms]">
          <p
            className="text-center [font-family:var(--font-jost)] text-[12px] tracking-[0.24em] uppercase mb-6"
            style={{ color: T(0.55) }}
          >
            Other tools
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/breathing"
              className="group rounded-[14px] p-6 transition-all duration-500"
              style={{
                background: glassBackground("breathing"),
                border:     `1px solid ${glassBorder("breathing", 0.12)}`,
              }}
            >
              <p
                className="[font-family:var(--font-jost)] text-[11px] tracking-[0.18em] uppercase mb-2"
                style={{ color: `rgba(${rgbBreathing},0.55)` }}
              >
                During the day
              </p>
              <p
                className="[font-family:var(--font-display)] font-light text-[20px]"
                style={{ color: "rgba(245,252,255,0.88)" }}
              >
                Breathing
              </p>
            </Link>
            <Link
              href="/tools/choose"
              className="group rounded-[14px] p-6 transition-all duration-500"
              style={{
                background: glassBackground("choose"),
                border:     `1px solid ${glassBorder("choose", 0.12)}`,
              }}
            >
              <p
                className="[font-family:var(--font-jost)] text-[11px] tracking-[0.18em] uppercase mb-2"
                style={{ color: `rgba(${rgbChoose},0.55)` }}
              >
                When you can&apos;t decide
              </p>
              <p
                className="[font-family:var(--font-display)] font-light text-[20px]"
                style={{ color: "rgba(235,230,252,0.88)" }}
              >
                Choose
              </p>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
