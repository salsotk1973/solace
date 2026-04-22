"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ModeSelector   from "./ModeSelector";
import SessionDots    from "./SessionDots";
import SessionComplete from "./SessionComplete";
import { useToolHistory } from "@/hooks/useToolHistory";
import ToolUpgradePrompt from "@/components/shared/ToolUpgradePrompt";

// ─── Canonical colour token — rgba(232,168,62,x) ──────────────────────
const A = (a: number) => `rgba(232,168,62,${a})`;

// ─── Constants ────────────────────────────────────────────────────────────────

const WORK_SECS    = 25 * 60; // 1500
const REST_SECS    =  5 * 60; //  300
const TOTAL_PHASES = 8;       // work rest work rest work rest work rest

function phaseDuration(idx: number): number {
  return idx % 2 === 0 ? WORK_SECS : REST_SECS;
}

function isWorkPhase(idx: number): boolean {
  return idx % 2 === 0;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  userId: string | null;
}

export default function FocusTimer({ userId }: Props) {
  const [started,     setStarted]     = useState(false);
  const [isRunning,   setIsRunning]   = useState(false);
  const [phaseIdx,    setPhaseIdx]    = useState(0);
  const [remaining,   setRemaining]   = useState(WORK_SECS);
  const [workDone,    setWorkDone]    = useState(0);
  const [allDone,     setAllDone]     = useState(false);
  const [dismissed,   setDismissed]   = useState(false);
  const [circleSize,  setCircleSize]  = useState<number>(220);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Refs to read latest values inside setInterval without stale closures
  const phaseIdxRef  = useRef(phaseIdx);
  const remainingRef = useRef(remaining);
  const workDoneRef  = useRef(workDone);
  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { phaseIdxRef.current  = phaseIdx;  }, [phaseIdx]);
  useEffect(() => { remainingRef.current = remaining; }, [remaining]);
  useEffect(() => { workDoneRef.current  = workDone;  }, [workDone]);

  // ── Responsive circle size ────────────────────────────────────────────────
  useEffect(() => {
    const update = () => setCircleSize(window.innerWidth < 768 ? 180 : 220);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ── History ───────────────────────────────────────────────────────────────

  const { history, loadHistory, shouldShowUpgradePrompt } = useToolHistory("focus", userId);

  // ── Save on completion ───────────────────────────────────────────────────

  useEffect(() => {
    if (!allDone || !userId) return;
    fetch("/api/focus", { method: "POST" })
      .then(() => loadHistory())
      .catch(() => {});
  }, [allDone, userId, loadHistory]);

  // ── Timer interval ────────────────────────────────────────────────────────
  // Re-creates when isRunning or phaseIdx changes (phase transitions restart it)

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      const rem = remainingRef.current - 1;

      if (rem > 0) {
        remainingRef.current = rem;
        setRemaining(rem);
        return;
      }

      // Phase complete — stop this interval before state updates
      clearInterval(intervalRef.current!);
      intervalRef.current = null;

      const pi     = phaseIdxRef.current;
      const isW    = isWorkPhase(pi);
      const nextPi = pi + 1;

      if (isW) {
        workDoneRef.current += 1;
        setWorkDone(workDoneRef.current);
      }

      if (nextPi >= TOTAL_PHASES) {
        setRemaining(0);
        remainingRef.current = 0;
        setIsRunning(false);
        setAllDone(true);
        return;
      }

      const nextDur = phaseDuration(nextPi);
      phaseIdxRef.current  = nextPi;
      remainingRef.current = nextDur;
      setPhaseIdx(nextPi);
      setRemaining(nextDur);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, phaseIdx]);

  // ── Controls ──────────────────────────────────────────────────────────────

  function handleTap() {
    if (allDone) return;
    if (!started) {
      setStarted(true);
      setIsRunning(true);
    } else {
      setIsRunning((r) => !r);
    }
  }

  const handleSkip = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const pi   = phaseIdxRef.current;
    const isW  = isWorkPhase(pi);
    const next = pi + 1;

    if (isW) {
      workDoneRef.current += 1;
      setWorkDone(workDoneRef.current);
    }

    if (next >= TOTAL_PHASES) {
      setIsRunning(false);
      setAllDone(true);
      setRemaining(0);
      remainingRef.current = 0;
      return;
    }

    const nextDur = phaseDuration(next);
    phaseIdxRef.current  = next;
    remainingRef.current = nextDur;
    setPhaseIdx(next);
    setRemaining(nextDur);
  }, []);

  function handleReset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setStarted(false);
    setIsRunning(false);
    setPhaseIdx(0);       phaseIdxRef.current  = 0;
    setRemaining(WORK_SECS); remainingRef.current = WORK_SECS;
    setWorkDone(0);       workDoneRef.current  = 0;
    setAllDone(false);
    setDismissed(false);
  }

  // ── Derived values ─────────────────────────────────────────────────────────

  const isWork        = isWorkPhase(phaseIdx);
  const totalPhSecs   = phaseDuration(phaseIdx);
  const radius        = circleSize / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const dashOffset    = circumference * (remaining / totalPhSecs);
  const minutes       = Math.floor(remaining / 60);
  const seconds       = remaining % 60;
  const timeStr       = `${pad(minutes)}:${pad(seconds)}`;

  const stateLabel = allDone ? "Done" : isWork ? "Focus" : "Rest";

  // ── JSX ─────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Mode selector ───────────────────────────────────────────────── */}
      <ModeSelector disabled={started && !allDone} />

      {/* ── State label ─────────────────────────────────────────────────── */}
      <p
        className={[
          "[font-family:var(--font-display)] italic font-light text-[38px] leading-none mb-4 transition-all duration-500",
          started ? "opacity-100" : "opacity-0",
          isWork || allDone
            ? "text-[rgba(255,195,100,0.65)]"
            : "text-[rgba(120,200,220,0.65)]",
        ].join(" ")}
      >
        {stateLabel}
      </p>

      {/* ── Arc + timer face ────────────────────────────────────────────── */}
      <div
        role="button"
        tabIndex={0}
        aria-label={isRunning ? "Pause timer" : started ? "Resume timer" : "Start timer"}
        onClick={handleTap}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") ? handleTap() : null}
        className="relative cursor-pointer select-none mb-6 group"
        style={{ width: circleSize, height: circleSize }}
      >
        {/* SVG arc — rotated so arc starts at 12 o'clock */}
        <svg
          className="absolute inset-0 -rotate-90 pointer-events-none"
          viewBox={`0 0 ${circleSize} ${circleSize}`}
          width={circleSize}
          height={circleSize}
        >
          {/* Track ring */}
          <circle
            cx={circleSize / 2} cy={circleSize / 2} r={radius}
            fill="none"
            stroke="rgba(200,210,220,0.05)"
            strokeWidth={3}
          />
          {/* Progress arc */}
          <circle
            cx={circleSize / 2} cy={circleSize / 2} r={radius}
            fill="none"
            className={[
              "[transition:stroke_0.8s_ease]",
              isWork
                ? "[stroke:rgba(240,170,70,0.35)]"
                : "[stroke:rgba(60,192,212,0.32)]",
            ].join(" ")}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>

        {/* Timer face */}
        <div className="absolute inset-0 rounded-full border border-[rgba(200,210,220,0.06)] bg-[rgba(255,255,255,0.015)] flex flex-col items-center justify-center gap-2">
          <span
            className={[
              "[font-family:var(--font-jost)] font-[300] tabular-nums leading-none",
              "transition-colors duration-[800ms] ease-in-out",
              isWork
                ? "text-[rgba(255,200,120,0.9)]"
                : "text-[rgba(120,200,220,0.75)]",
            ].join(" ")}
            style={{ fontSize: circleSize < 200 ? "36px" : "42px" }}
          >
            {timeStr}
          </span>
          <span
            className="[font-family:var(--font-jost)] text-[9px] tracking-[0.22em] uppercase group-hover:text-[rgba(180,190,200,0.5)] transition-colors duration-200"
            style={{ color: "rgba(180,190,200,0.45)" }}
          >
            {!started
              ? "tap to start"
              : isRunning
              ? "tap to pause"
              : "tap to resume"}
          </span>
        </div>
      </div>

      {/* ── Session dots ────────────────────────────────────────────────── */}
      <div className="mb-10">
        <SessionDots workDone={workDone} phaseIdx={phaseIdx} started={started} />
      </div>

      {/* ── Skip + Reset controls (hidden until started) ─────────────────── */}
      {started && (
        <div className="flex items-center gap-6 mb-8">
          {!allDone && (
            <button
              onClick={handleSkip}
              className="[font-family:var(--font-jost)] text-[10px] tracking-[0.2em] uppercase text-[rgba(180,190,200,0.35)] hover:text-[rgba(200,210,220,0.7)] transition-colors duration-200 px-4 py-2"
            >
              Skip →
            </button>
          )}
          <button
            onClick={handleReset}
            className="[font-family:var(--font-jost)] text-[10px] tracking-[0.2em] uppercase text-[rgba(150,160,170,0.28)] hover:text-[rgba(180,190,200,0.55)] transition-colors duration-200 px-4 py-2"
          >
            Reset
          </button>
        </div>
      )}

      {/* ── Info cards — Duration + Best For ──────────────────────────── */}
      <div className="grid grid-cols-2 gap-2 max-w-[320px] mx-auto mb-6 md:max-w-[420px] md:mb-10">
        {[
          { label: "Duration", value: "~2 hrs total" },
          { label: "Best for", value: "Deep work" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 p-2 rounded-[12px] md:gap-1.5 md:px-4 md:py-4"
            style={{ border: `1px solid ${A(0.15)}`, background: A(0.04) }}
          >
            <p
              className="[font-family:var(--font-jost)] text-[11px] tracking-[0.18em] uppercase md:text-[12px]"
              style={{ color: A(0.65) }}
            >
              {label}
            </p>
            <p
              className="[font-family:var(--font-display)] font-light text-[13px] text-center leading-snug md:text-[15px]"
              style={{ color: A(0.92) }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════
          HISTORY ZONE — collapses on mobile behind toggle
          ══════════════════════════════════════════════════════ */}
      {userId && history && (
        <section className="max-w-[520px] mx-auto mb-10">
          {/* Mobile toggle */}
          <button
            className="w-full flex items-center justify-between md:hidden cursor-pointer rounded-[14px] px-4 py-3"
            style={{
              background: A(0.05),
              border: `1px solid ${A(0.14)}`,
              borderBottomLeftRadius: historyOpen ? 0 : undefined,
              borderBottomRightRadius: historyOpen ? 0 : undefined,
              marginBottom: historyOpen ? 0 : undefined,
            }}
            onClick={() => setHistoryOpen(o => !o)}
            aria-expanded={historyOpen}
          >
            <p
              className="[font-family:var(--font-jost)] text-[11px] tracking-[0.24em] uppercase"
              style={{ color: A(0.70) }}
            >
              {history.isPaid ? "Full history" : "7-day history"}
            </p>
            <span
              className="w-6 h-6 flex items-center justify-center rounded-full text-[16px] transition-transform duration-300"
              style={{
                color: A(0.80),
                background: A(0.10),
                border: `1px solid ${A(0.25)}`,
                transform: historyOpen ? "rotate(45deg)" : "rotate(0deg)",
                lineHeight: 1,
              }}
              aria-hidden="true"
            >
              +
            </span>
          </button>

          {/* Desktop label */}
          <p
            className="hidden md:block [font-family:var(--font-jost)] text-[12px] tracking-[0.24em] uppercase mb-4 text-center"
            style={{ color: A(0.65) }}
          >
            {history.isPaid ? "Full history" : "7-day history"}
          </p>

          {/* History content */}
          <div className={`${historyOpen ? "block" : "hidden"} md:block ${historyOpen ? "mb-6" : "mb-4"}`}>
            <div
              className="px-3 py-3 md:px-5 md:py-4 md:rounded-[14px]"
              style={{
                border: `1px solid ${A(0.12)}`,
                background: A(0.03),
                borderTop: historyOpen ? "none" : undefined,
                borderRadius: historyOpen ? "0 0 14px 14px" : undefined,
              }}
            >
              <p
                className="[font-family:var(--font-jost)] text-[12px] md:text-[13px] font-light leading-relaxed text-center"
                style={{ color: "rgba(255,255,255,0.80)" }}
              >
                {!history.isPaid
                  ? "Free users keep 7 days of focus history. Your older sessions are still there."
                  : history.sessions.length > 0
                  ? `${history.sessions.length} focus ${history.sessions.length === 1 ? "session" : "sessions"} saved.`
                  : "No focus sessions saved yet."}
              </p>

              {/* Streak */}
              {history.hasStreak && (
                <div
                  className="mt-4 rounded-[12px] px-4 py-3"
                  style={{ border: `1px solid ${A(0.12)}`, background: A(0.04) }}
                >
                  <p
                    className="[font-family:var(--font-jost)] text-[11px] md:text-[12px] tracking-[0.22em] uppercase text-center mb-1.5"
                    style={{ color: A(0.65) }}
                  >
                    Current streak
                  </p>
                  <p
                    className="[font-family:var(--font-display)] font-light text-[20px] md:text-[24px] text-center leading-none"
                    style={{ color: A(0.92) }}
                  >
                    {history.currentStreakDays} day{history.currentStreakDays === 1 ? "" : "s"}
                  </p>
                  <p
                    className="[font-family:var(--font-jost)] text-[12px] font-light leading-relaxed text-center mt-3"
                    style={{ color: A(0.70) }}
                  >
                    {history.streakFraming === "full"
                      ? "A quiet record of the days you chose to focus."
                      : "Consistency gets easier when you can see the full picture."}
                  </p>
                </div>
              )}

              {/* Upgrade prompt */}
              {shouldShowUpgradePrompt && (
                <ToolUpgradePrompt
                  hasOlderSessions={history.hasOlderSessions}
                  toolColour="232, 168, 62"
                  toolName="Focus Timer"
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Session complete nudge ──────────────────────────────────────── */}
      {allDone && !dismissed && (
        <SessionComplete
          isLoggedIn={!!userId}
          isPaid={history?.isPaid}
          onDismiss={() => setDismissed(true)}
        />
      )}
    </>
  );
}
