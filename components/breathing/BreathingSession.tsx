"use client";

import { useState, useCallback } from "react";
import PatternSelector from "./PatternSelector";
import BreathingOrb    from "./BreathingOrb";
import SessionComplete from "./SessionComplete";

// ─── Types ────────────────────────────────────────────────────────────────────

type Pattern = "box" | "478";

// ─── Pattern metadata ─────────────────────────────────────────────────────────

const INFO: Record<Pattern, { duration: string; pattern: string; bestFor: string }> = {
  box:  { duration: "~1.5 min", pattern: "4 · 4 · 4 · 4", bestFor: "Focus & calm"    },
  "478":{ duration: "~2 min",   pattern: "4 · 7 · 8",      bestFor: "Sleep & anxiety" },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  userId: string | null;
}

export default function BreathingSession({ userId }: Props) {
  const [pattern,         setPattern]         = useState<Pattern>("box");
  const [isRunning,       setIsRunning]       = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [dismissed,       setDismissed]       = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleStart() {
    setSessionComplete(false);
    setIsRunning(true);
  }

  function handleStop() {
    setIsRunning(false);
  }

  const handleCycleChange = useCallback((_cycle: number) => {
    // BreathingOrb writes cycle text directly to DOM — no state update needed
  }, []);

  const handleComplete = useCallback(async () => {
    setIsRunning(false);
    setSessionComplete(true);

    if (userId) {
      try {
        await fetch("/api/breathing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pattern }),
        });
      } catch {
        // Non-critical — session save failure is silent
      }
    }
  }, [userId, pattern]);

  const canSwitch = !isRunning && !sessionComplete;
  const info      = INFO[pattern];

  // ── JSX ─────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Pattern selector ────────────────────────────────────────────── */}
      <PatternSelector
        selected={pattern}
        onChange={setPattern}
        disabled={!canSwitch}
      />

      {/* ── Orb stage ────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-8 mb-16">
        <BreathingOrb
          pattern={pattern}
          isRunning={isRunning}
          onCycleChange={handleCycleChange}
          onComplete={handleComplete}
        />

        {/* Start / Stop */}
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="[font-family:var(--font-jost)] text-[11px] tracking-[0.18em] uppercase text-[rgba(120,215,232,0.65)] border border-[rgba(80,200,218,0.22)] px-8 py-3 rounded-[2px] hover:text-[rgba(160,235,248,0.9)] hover:border-[rgba(80,200,218,0.42)] transition-all duration-300"
          >
            {sessionComplete ? "Begin again" : "Begin"}
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="[font-family:var(--font-jost)] text-[11px] tracking-[0.18em] uppercase text-[rgba(140,175,190,0.38)] hover:text-[rgba(180,200,215,0.6)] transition-colors duration-200 px-6 py-3"
          >
            Stop
          </button>
        )}
      </div>

      {/* ── Info cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 max-w-[520px] mx-auto mb-20">
        {[
          { label: "Duration", value: info.duration },
          { label: "Pattern",  value: info.pattern  },
          { label: "Best For", value: info.bestFor  },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 px-4 py-4 rounded-[12px] border border-[rgba(80,200,218,0.08)] bg-[rgba(80,200,218,0.03)]"
          >
            <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.2em] uppercase text-[rgba(100,190,210,0.38)]">
              {label}
            </p>
            <p className="[font-family:var(--font-display)] font-light text-[15px] text-[rgba(180,230,240,0.75)] text-center leading-snug">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Session complete nudge ───────────────────────────────────────── */}
      {sessionComplete && !dismissed && (
        <SessionComplete
          isLoggedIn={!!userId}
          onDismiss={() => setDismissed(true)}
        />
      )}
    </>
  );
}
