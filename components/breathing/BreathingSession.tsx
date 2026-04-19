"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import BreathingUpgradePrompt from "./BreathingUpgradePrompt";
import PatternSelector from "./PatternSelector";
import BreathingOrb from "./BreathingOrb";

const SessionComplete = dynamic(() => import("./SessionComplete"), { ssr: false });

// ─── Types ──────────────────────────────────────────────────────────────────
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

// ─── Canonical colour token — Calm category ──────────────────────────────────
// #3CC0D4 = 60, 192, 212
const T = (a: number) => `rgba(60,192,212,${a})`;

function formatHistoryDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short", day: "numeric", year: "numeric",
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

// ─── Pattern metadata ────────────────────────────────────────────────────────
const INFO: Record<Pattern, { duration: string; pattern: string; bestFor: string }> = {
  box:  { duration: "~1.5 min", pattern: "4 · 4 · 4 · 4", bestFor: "Focus & calm" },
  "478":{ duration: "~2 min",   pattern: "4 · 7 · 8",     bestFor: "Sleep & anxiety" },
};

// ─── Component ───────────────────────────────────────────────────────────────
interface Props { userId: string | null }

export default function BreathingSession({ userId }: Props) {
  const [pattern, setPattern]                 = useState<Pattern>("box");
  const [isRunning, setIsRunning]             = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [dismissed, setDismissed]             = useState(false);
  const [history, setHistory]                 = useState<BreathingHistoryResponse | null>(null);

  // ── Handlers ────────────────────────────────────────────────────────────
  const loadHistory = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch("/api/breathing/history");
      if (!response.ok) return;
      const data = (await response.json()) as BreathingHistoryResponse;
      setHistory(data);
    } catch {
      // History is supportive only
    }
  }, [userId]);

  useEffect(() => { void loadHistory(); }, [loadHistory]);

  function handleStart() { setSessionComplete(false); setIsRunning(true); }
  function handleStop()  { setIsRunning(false); }

  const handleCycleChange = useCallback((_cycle: number) => {}, []);

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
      } catch {}
    }
  }, [loadHistory, pattern, userId]);

  // ── Responsive orb size ─────────────────────────────────────────────────
  const [orbSize, setOrbSize] = useState<number>(240);
  useEffect(() => {
    const update = () => setOrbSize(window.innerWidth < 768 ? 130 : 240);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const canSwitch = !isRunning && !sessionComplete;
  const info      = INFO[pattern];
  const historyLabel     = history?.isPaid ? "Full history" : "7-day history";
  const oldestHiddenDate = history?.oldestHiddenSessionDate
    ? formatHistoryDate(history.oldestHiddenSessionDate) : null;
  const shouldShowUpgradePrompt = !!history && !history.isPaid && (
    history.hasOlderSessions ||
    (history.streakFraming === "teaser" && (history.currentStreakDays >= 2 || history.sessions.length >= 2))
  );

  // ── JSX ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Pattern selector ──────────────────────────────────────────── */}
      <PatternSelector selected={pattern} onChange={setPattern} disabled={!canSwitch} />

      {/* ── Orb + Begin/Stop ──────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-3 mt-6 mb-3 md:mt-0 md:mb-16 md:gap-8">
        {/* Orb */}
        <div className="flex justify-center w-full">
          <BreathingOrb
            pattern={pattern}
            isRunning={isRunning}
            onCycleChange={handleCycleChange}
            onComplete={handleComplete}
            size={orbSize}
          />
        </div>

        {/* Begin / Stop — below orb mobile, above orb desktop */}
        <div className="flex justify-center md:order-first">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="[font-family:var(--font-jost)] text-[11px] tracking-[0.22em] uppercase cursor-pointer
                         text-[rgba(10,30,36,0.95)] bg-[rgba(60,192,212,0.85)] border border-[rgba(60,192,212,0.9)] px-8 py-2 rounded-full
                         hover:bg-[rgba(60,192,212,1)] transition-all duration-300
                         md:text-[11px] md:tracking-[0.18em] md:px-8 md:py-3 md:rounded-[2px]
                         md:bg-transparent md:text-[rgba(120,215,232,0.65)] md:border-[rgba(80,200,218,0.22)]
                         md:hover:text-[rgba(160,235,248,0.9)] md:hover:bg-transparent md:hover:border-[rgba(80,200,218,0.45)]"
            >
              {sessionComplete ? "Begin again" : "Begin"}
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="[font-family:var(--font-jost)] text-[11px] tracking-[0.22em] uppercase cursor-pointer transition-colors duration-200 px-6 py-1.5 md:text-[11px] md:px-6 md:py-3"
              style={{ color: T(0.65) }}
            >
              Stop
            </button>
          )}
        </div>
      </div>

      {/* ── Info cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-1 md:gap-3 max-w-[520px] mx-auto mb-4 md:mb-20">
        {[
          { label: "Duration", value: info.duration },
          { label: "Pattern",  value: info.pattern  },
          { label: "Best For", value: info.bestFor  },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-0.5 md:gap-1.5 p-1.5 md:px-4 md:py-4 rounded-[10px] md:rounded-[12px]"
            style={{ border: `1px solid ${T(0.15)}`, background: T(0.04) }}
          >
            <p
              className="[font-family:var(--font-jost)] text-[9px] md:text-[12px] tracking-[0.18em] uppercase"
              style={{ color: T(0.55) }}
            >
              {label}
            </p>
            <p
              className="[font-family:var(--font-display)] font-light text-[11px] md:text-[15px] text-center leading-snug"
              style={{ color: T(0.85) }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── History ───────────────────────────────────────────────────── */}
      {userId && history && (
        <section className="max-w-[520px] mx-auto mb-20">
          <p
            className="[font-family:var(--font-jost)] text-[10px] md:text-[12px] tracking-[0.24em] uppercase mb-3 md:mb-4 text-center"
            style={{ color: T(0.45) }}
          >
            {historyLabel}
          </p>

          <div
            className="rounded-[14px] px-3 py-3 md:px-5 md:py-4"
            style={{ border: `1px solid ${T(0.12)}`, background: T(0.03) }}
          >
            {/* Main session count */}
            <p
              className="[font-family:var(--font-jost)] text-[11px] md:text-[13px] font-light leading-relaxed text-center"
              style={{ color: "rgba(255,255,255,0.80)" }}
            >
              {!history.isPaid
                ? "Free users keep 7 days of breathing history. Your older sessions are still there."
                : history.sessions.length > 0
                ? `${history.sessions.length} breathing ${history.sessions.length === 1 ? "session" : "sessions"} saved.`
                : "No breathing sessions saved yet."}
            </p>

            {/* Older sessions hint */}
            {!history.isPaid && history.hasOlderSessions && oldestHiddenDate && (
              <p
                className="[font-family:var(--font-jost)] text-[11px] font-light leading-relaxed text-center mt-3"
                style={{ color: T(0.65) }}
              >
                Your earlier breathing history starts before {oldestHiddenDate}.
              </p>
            )}
            {!history.isPaid && history.hasOlderSessions && (
              <p
                className="[font-family:var(--font-jost)] text-[11px] font-light leading-relaxed text-center mt-2"
                style={{ color: T(0.65) }}
              >
                Full history helps you notice patterns and build consistency over time.
              </p>
            )}

            {/* Streak card */}
            {history.hasStreak && (
              <div
                className="mt-4 rounded-[12px] px-4 py-3"
                style={{ border: `1px solid ${T(0.12)}`, background: T(0.04) }}
              >
                <p
                  className="[font-family:var(--font-jost)] text-[10px] md:text-[12px] tracking-[0.22em] uppercase text-center mb-1.5"
                  style={{ color: T(0.55) }}
                >
                  Current streak
                </p>
                <p
                  className="[font-family:var(--font-display)] font-light text-[18px] md:text-[24px] text-center leading-none"
                  style={{ color: T(0.90) }}
                >
                  {history.currentStreakDays} day{history.currentStreakDays === 1 ? "" : "s"}
                </p>
                <p
                  className="[font-family:var(--font-jost)] text-[11px] font-light leading-relaxed text-center mt-3"
                  style={{ color: T(0.65) }}
                >
                  {history.streakFraming === "full"
                    ? "A quiet record of the days you returned to your breath."
                    : "Consistency gets easier when you can see the full picture."}
                </p>
              </div>
            )}

            {/* Insights (paid) */}
            {history.isPaid && history.insights && (
              <div
                className="mt-4 rounded-[12px] px-3 py-3 md:px-4 md:py-4"
                style={{ border: `1px solid ${T(0.12)}`, background: T(0.04) }}
              >
                <p
                  className="[font-family:var(--font-jost)] text-[10px] md:text-[12px] tracking-[0.22em] uppercase text-center mb-3 md:mb-4"
                  style={{ color: T(0.55) }}
                >
                  Your breathing patterns over time
                </p>
                <div className="grid gap-2 md:gap-3 sm:grid-cols-3">
                  {[
                    { label: "Most used pace",    value: formatPace(history.insights.mostUsedPace) },
                    { label: "This week vs last", value: `${history.insights.sessionsThisWeek} / ${history.insights.sessionsLastWeek}`,
                      sub: formatWeeklyChange(history.insights.weeklyChangeDirection) },
                    { label: "Your best streak",  value: `${history.insights.bestStreakDays} day${history.insights.bestStreakDays === 1 ? "" : "s"}` },
                  ].map(({ label, value, sub }) => (
                    <div
                      key={label}
                      className="rounded-[10px] px-2 py-2 md:px-3 md:py-3 text-center"
                      style={{ border: `1px solid ${T(0.10)}`, background: "rgba(6,18,24,0.20)" }}
                    >
                      <p
                        className="[font-family:var(--font-jost)] text-[10px] md:text-[12px] tracking-[0.18em] uppercase mb-1"
                        style={{ color: T(0.55) }}
                      >
                        {label}
                      </p>
                      <p
                        className="[font-family:var(--font-display)] font-light text-[15px] md:text-[18px] leading-snug"
                        style={{ color: T(0.90) }}
                      >
                        {value}
                      </p>
                      {sub && (
                        <p
                          className="[font-family:var(--font-jost)] text-[10px] font-light leading-relaxed mt-1"
                          style={{ color: T(0.65) }}
                        >
                          {sub}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upgrade nudge */}
            {!history.isPaid && shouldShowUpgradePrompt && (
              <p
                className="[font-family:var(--font-jost)] text-[11px] font-light leading-relaxed text-center mt-4"
                style={{ color: T(0.65) }}
              >
                Patterns become clearer over time.
              </p>
            )}
            {shouldShowUpgradePrompt && (
              <BreathingUpgradePrompt hasOlderSessions={history.hasOlderSessions} />
            )}
          </div>
        </section>
      )}

      {/* ── Session complete nudge ────────────────────────────────────── */}
      {sessionComplete && !dismissed && (
        <SessionComplete
          isLoggedIn={!!userId}
          isPaid={history?.isPaid}
          onDismiss={() => setDismissed(true)}
        />
      )}
    </>
  );
}
