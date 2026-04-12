"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import BreathingUpgradePrompt from "./BreathingUpgradePrompt";
import PatternSelector from "./PatternSelector";
import BreathingOrb    from "./BreathingOrb";

const SessionComplete = dynamic(() => import("./SessionComplete"), {
  ssr: false,
});

// ─── Types ────────────────────────────────────────────────────────────────────

type Pattern = "box" | "478";

type BreathingHistorySession = {
  id: string;
  pattern: string;
  cycles: number | null;
  completed: boolean;
  completedAt: string;
  createdAt: string;
};

type BreathingInsights = {
  mostUsedPace: "slow" | "moderate" | "fast" | null;
  sessionsThisWeek: number;
  sessionsLastWeek: number;
  weeklyChangeDirection: "up" | "down" | "flat";
  bestStreakDays: number;
};

type BreathingHistoryResponse = {
  sessions: BreathingHistorySession[];
  isPaid: boolean;
  hasOlderSessions: boolean;
  oldestHiddenSessionDate: string | null;
  historyWindowDays: number | null;
  currentStreakDays: number;
  hasStreak: boolean;
  streakFraming: "full" | "teaser";
  insights: BreathingInsights | null;
  insightsFraming: "full" | "teaser";
};

function formatHistoryDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatPace(value: BreathingInsights["mostUsedPace"]) {
  if (!value) return "Not enough yet";
  return value[0].toUpperCase() + value.slice(1);
}

function formatWeeklyChange(value: BreathingInsights["weeklyChangeDirection"]) {
  if (value === "up") return "Up from last week";
  if (value === "down") return "Lower than last week";
  return "Steady with last week";
}

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
  const [history,         setHistory]         = useState<BreathingHistoryResponse | null>(null);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const loadHistory = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await fetch("/api/breathing/history");
      if (!response.ok) return;
      const data = (await response.json()) as BreathingHistoryResponse;
      setHistory(data);
    } catch {
      // History is supportive only; the breathing session must keep working.
    }
  }, [userId]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

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
        await loadHistory();
      } catch {
        // Non-critical — session save failure is silent
      }
    }
  }, [loadHistory, pattern, userId]);

  const canSwitch = !isRunning && !sessionComplete;
  const info      = INFO[pattern];
  const historyLabel = history?.isPaid ? "Full history" : "7-day history";
  const oldestHiddenDate = history?.oldestHiddenSessionDate
    ? formatHistoryDate(history.oldestHiddenSessionDate)
    : null;
  const shouldShowUpgradePrompt =
    !!history &&
    !history.isPaid &&
    (history.hasOlderSessions ||
      (history.streakFraming === "teaser" &&
        (history.currentStreakDays >= 2 || history.sessions.length >= 2)));

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

        <div className="flex flex-col items-center gap-4">
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

      {userId && history && (
        <section className="max-w-[520px] mx-auto mb-20">
          <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.24em] uppercase text-[rgba(130,155,168,0.32)] mb-4 text-center">
            {historyLabel}
          </p>
          <div className="rounded-[14px] border border-[rgba(80,200,218,0.08)] bg-[rgba(80,200,218,0.025)] px-5 py-4">
            <p className="[font-family:var(--font-jost)] text-[13px] font-light text-[rgba(170,220,232,0.62)] leading-relaxed text-center">
              {!history.isPaid
                ? "Free users keep 7 days of breathing history. Your older sessions are still there."
                : history.sessions.length > 0
                ? `${history.sessions.length} breathing ${
                    history.sessions.length === 1 ? "session" : "sessions"
                  } saved.`
                : "No breathing sessions saved yet."}
            </p>
            {!history.isPaid && history.hasOlderSessions && oldestHiddenDate && (
              <p className="[font-family:var(--font-jost)] text-[12px] font-light text-[rgba(120,180,200,0.52)] leading-relaxed text-center mt-3">
                Your earlier breathing history starts before {oldestHiddenDate}.
              </p>
            )}
            {!history.isPaid && history.hasOlderSessions && (
              <p className="[font-family:var(--font-jost)] text-[12px] font-light text-[rgba(120,180,200,0.52)] leading-relaxed text-center mt-2">
                Full history helps you notice patterns and build consistency over time.
              </p>
            )}
            {history.hasStreak && (
              <div className="mt-5 rounded-[12px] border border-[rgba(80,200,218,0.08)] bg-[rgba(80,200,218,0.025)] px-4 py-3">
                <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.22em] uppercase text-[rgba(100,190,210,0.38)] text-center mb-1.5">
                  Current streak
                </p>
                <p className="[font-family:var(--font-display)] font-light text-[24px] text-[rgba(180,230,240,0.78)] text-center leading-none">
                  {history.currentStreakDays} day{history.currentStreakDays === 1 ? "" : "s"}
                </p>
                <p className="[font-family:var(--font-jost)] text-[12px] font-light text-[rgba(120,180,200,0.52)] leading-relaxed text-center mt-3">
                  {history.streakFraming === "full"
                    ? "A quiet record of the days you returned to your breath."
                    : "Consistency gets easier when you can see the full picture."}
                </p>
              </div>
            )}
            {history.isPaid && history.insights && (
              <div className="mt-5 rounded-[12px] border border-[rgba(80,200,218,0.08)] bg-[rgba(80,200,218,0.025)] px-4 py-4">
                <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.22em] uppercase text-[rgba(100,190,210,0.38)] text-center mb-4">
                  Your breathing patterns over time
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[10px] border border-[rgba(80,200,218,0.06)] bg-[rgba(6,18,24,0.18)] px-3 py-3 text-center">
                    <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.18em] uppercase text-[rgba(130,190,205,0.42)] mb-1.5">
                      Most used pace
                    </p>
                    <p className="[font-family:var(--font-display)] font-light text-[18px] text-[rgba(180,230,240,0.78)] leading-snug">
                      {formatPace(history.insights.mostUsedPace)}
                    </p>
                  </div>
                  <div className="rounded-[10px] border border-[rgba(80,200,218,0.06)] bg-[rgba(6,18,24,0.18)] px-3 py-3 text-center">
                    <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.18em] uppercase text-[rgba(130,190,205,0.42)] mb-1.5">
                      This week vs last
                    </p>
                    <p className="[font-family:var(--font-display)] font-light text-[18px] text-[rgba(180,230,240,0.78)] leading-snug">
                      {history.insights.sessionsThisWeek} /{" "}
                      {history.insights.sessionsLastWeek}
                    </p>
                    <p className="[font-family:var(--font-jost)] text-[11px] font-light text-[rgba(120,180,200,0.5)] leading-relaxed mt-1">
                      {formatWeeklyChange(
                        history.insights.weeklyChangeDirection,
                      )}
                    </p>
                  </div>
                  <div className="rounded-[10px] border border-[rgba(80,200,218,0.06)] bg-[rgba(6,18,24,0.18)] px-3 py-3 text-center">
                    <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.18em] uppercase text-[rgba(130,190,205,0.42)] mb-1.5">
                      Your best streak
                    </p>
                    <p className="[font-family:var(--font-display)] font-light text-[18px] text-[rgba(180,230,240,0.78)] leading-snug">
                      {history.insights.bestStreakDays} day
                      {history.insights.bestStreakDays === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {!history.isPaid && shouldShowUpgradePrompt && (
              <p className="[font-family:var(--font-jost)] text-[12px] font-light text-[rgba(120,180,200,0.52)] leading-relaxed text-center mt-5">
                Patterns become clearer over time.
              </p>
            )}
            {shouldShowUpgradePrompt && (
              <BreathingUpgradePrompt
                hasOlderSessions={history.hasOlderSessions}
              />
            )}
          </div>
        </section>
      )}

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
