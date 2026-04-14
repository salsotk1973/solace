"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ModeSelector   from "./ModeSelector";
import SessionDots    from "./SessionDots";
import SessionComplete from "./SessionComplete";
import { useToolHistory } from "@/hooks/useToolHistory";
import ToolUpgradePrompt from "@/components/shared/ToolUpgradePrompt";

// ─── Constants ────────────────────────────────────────────────────────────────

const WORK_SECS   = 25 * 60; // 1500
const REST_SECS   =  5 * 60; //  300
const TOTAL_PHASES = 8;       // work rest work rest work rest work rest
const CIRCUMFERENCE = 628.3;  // 2π × 100

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
  const [started,   setStarted]   = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIdx,  setPhaseIdx]  = useState(0);
  const [remaining, setRemaining] = useState(WORK_SECS);
  const [workDone,  setWorkDone]  = useState(0);
  const [allDone,   setAllDone]   = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Refs to read latest values inside setInterval without stale closures
  const phaseIdxRef  = useRef(phaseIdx);
  const remainingRef = useRef(remaining);
  const workDoneRef  = useRef(workDone);
  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { phaseIdxRef.current  = phaseIdx;  }, [phaseIdx]);
  useEffect(() => { remainingRef.current = remaining; }, [remaining]);
  useEffect(() => { workDoneRef.current  = workDone;  }, [workDone]);

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

      const pi    = phaseIdxRef.current;
      const isW   = isWorkPhase(pi);
      const nextPi = pi + 1;

      // Increment work count if this was a work phase
      if (isW) {
        workDoneRef.current += 1;
        setWorkDone(workDoneRef.current);
      }

      // All phases done
      if (nextPi >= TOTAL_PHASES) {
        setRemaining(0);
        remainingRef.current = 0;
        setIsRunning(false);
        setAllDone(true);
        return;
      }

      // Advance to next phase (useEffect re-runs due to phaseIdx in deps)
      const nextDur = phaseDuration(nextPi);
      phaseIdxRef.current  = nextPi;
      remainingRef.current = nextDur;
      setPhaseIdx(nextPi);
      setRemaining(nextDur);
      // isRunning stays true — new interval created when phaseIdx dep changes
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, phaseIdx]); // phaseIdx dep causes re-creation on phase advance

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
    // isRunning stays — useEffect re-creates interval
  }, []);

  function handleReset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setStarted(false);
    setIsRunning(false);
    setPhaseIdx(0);   phaseIdxRef.current  = 0;
    setRemaining(WORK_SECS); remainingRef.current = WORK_SECS;
    setWorkDone(0);   workDoneRef.current  = 0;
    setAllDone(false);
    setDismissed(false);
  }

  // ── Derived values ─────────────────────────────────────────────────────────

  const isWork       = isWorkPhase(phaseIdx);
  const totalPhSecs  = phaseDuration(phaseIdx);
  const dashOffset   = CIRCUMFERENCE * (remaining / totalPhSecs);
  const minutes      = Math.floor(remaining / 60);
  const seconds      = remaining % 60;
  const timeStr      = `${pad(minutes)}:${pad(seconds)}`;

  const stateLabel = allDone ? "Done" : isWork ? "Focus" : "Rest";

  // ── JSX ─────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Mode selector ───────────────────────────────────────────────── */}
      <ModeSelector disabled={started && !allDone} />

      {/* ── State label ─────────────────────────────────────────────────── */}
      <p
        className={[
          "[font-family:var(--font-display)] italic font-light text-[38px] leading-none mb-8 transition-all duration-500",
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
        onKeyDown={(e) => e.key === "Enter" || e.key === " " ? handleTap() : null}
        className="relative w-[220px] h-[220px] cursor-pointer select-none mb-8 group"
      >
        {/* SVG arc — rotated so arc starts at 12 o'clock */}
        <svg
          className="absolute inset-0 -rotate-90 pointer-events-none"
          viewBox="0 0 220 220"
          width={220}
          height={220}
        >
          {/* Track ring */}
          <circle
            cx={110} cy={110} r={100}
            fill="none"
            stroke="rgba(200,210,220,0.05)"
            strokeWidth={3}
          />
          {/* Progress arc */}
          <circle
            cx={110} cy={110} r={100}
            fill="none"
            className={[
              "[transition:stroke_0.8s_ease]",
              isWork
                ? "[stroke:rgba(240,170,70,0.35)]"
                : "[stroke:rgba(60,192,212,0.32)]",
            ].join(" ")}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
        </svg>

        {/* Timer face */}
        <div className="absolute inset-0 rounded-full border border-[rgba(200,210,220,0.06)] bg-[rgba(255,255,255,0.015)] flex flex-col items-center justify-center gap-2">
          <span
            className={[
              "[font-family:var(--font-jost)] font-[300] text-[42px] tracking-[-0.03em] leading-none tabular-nums",
              "transition-colors duration-[800ms] ease-in-out",
              isWork
                ? "text-[rgba(255,200,120,0.9)]"
                : "text-[rgba(120,200,220,0.75)]",
            ].join(" ")}
          >
            {timeStr}
          </span>
          <span className="[font-family:var(--font-jost)] text-[9px] tracking-[0.22em] uppercase text-[rgba(180,190,200,0.25)] group-hover:text-[rgba(180,190,200,0.4)] transition-colors duration-200">
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
        <div className="flex items-center gap-6 mb-16">
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

      {/* ── History ─────────────────────────────────────────────────────── */}
      {userId && history && (
        <section className="max-w-[520px] mx-auto mb-10 mt-4">
          <p className="[font-family:var(--font-jost)] text-[12px] tracking-[0.24em] uppercase text-[rgba(232,168,62,0.50)] mb-4 text-center">
            {history.isPaid ? "Full history" : "7-day history"}
          </p>
          <div className="rounded-[14px] border border-[rgba(232,168,62,0.08)] bg-[rgba(232,168,62,0.025)] px-5 py-4">
            <p className="[font-family:var(--font-jost)] text-[13px] font-light text-[rgba(255,255,255,0.75)] leading-relaxed text-center">
              {!history.isPaid
                ? "Free users keep 7 days of focus history. Your older sessions are still there."
                : history.sessions.length > 0
                ? `${history.sessions.length} focus ${history.sessions.length === 1 ? "session" : "sessions"} saved.`
                : "No focus sessions saved yet."}
            </p>
            {history.hasStreak && (
              <div className="mt-4 text-center">
                <p className="[font-family:var(--font-jost)] text-[12px] tracking-[0.22em] uppercase text-[rgba(232,168,62,0.42)] mb-1">
                  Current streak
                </p>
                <p className="[font-family:var(--font-display)] font-light text-[24px] text-[rgba(255,215,150,0.80)]">
                  {history.currentStreakDays} day{history.currentStreakDays === 1 ? "" : "s"}
                </p>
                <p className="[font-family:var(--font-jost)] text-[12px] font-light text-[rgba(200,185,155,0.52)] mt-2">
                  {history.streakFraming === "full"
                    ? "A quiet record of the days you chose to focus."
                    : "Consistency gets easier when you can see the full picture."}
                </p>
              </div>
            )}
            {shouldShowUpgradePrompt && (
              <ToolUpgradePrompt
                hasOlderSessions={history.hasOlderSessions}
                toolColour="232, 168, 62"
                toolName="Focus Timer"
              />
            )}
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
