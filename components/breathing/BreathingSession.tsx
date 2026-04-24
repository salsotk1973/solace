"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import BreathingUpgradePrompt from "./BreathingUpgradePrompt";
import PatternSelector from "./PatternSelector";
import BreathingOrb from "./BreathingOrb";

const SessionComplete = dynamic(() => import("./SessionComplete"), { ssr: false });

// ─── Types ───────────────────────────────────────────────────────────────────
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

// ─── Canonical colour token — #3CC0D4 ────────────────────────────────────────
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
  if (value === "up")   return "Up from last week";
  if (value === "down") return "Lower than last week";
  return "Steady with last week";
}

// ─── Pattern metadata ─────────────────────────────────────────────────────────
const INFO: Record<Pattern, { duration: string; bestFor: string }> = {
  box:   { duration: "~1.5 min", bestFor: "Focus & calm"    },
  "478": { duration: "~2 min",   bestFor: "Sleep & anxiety" },
};

// ─── Component ────────────────────────────────────────────────────────────────
interface Props { userId: string | null }

export default function BreathingSession({ userId }: Props) {
  const [pattern, setPattern]                 = useState<Pattern>("box");
  const [isRunning, setIsRunning]             = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [dismissed, setDismissed]             = useState(false);
  const [history, setHistory]                 = useState<BreathingHistoryResponse | null>(null);
  const [historyOpen, setHistoryOpen]         = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const loadHistory = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch("/api/breathing/history");
      if (!response.ok) return;
      const data = (await response.json()) as BreathingHistoryResponse;
      setHistory(data);
    } catch {
      // History is supportive only — never block the tool
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

  // ── Responsive orb size ───────────────────────────────────────────────────
  const [orbSize, setOrbSize] = useState<number>(240);
  useEffect(() => {
    const update = () => setOrbSize(window.innerWidth < 768 ? 130 : 240);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const canSwitch        = !isRunning && !sessionComplete;
  const info             = INFO[pattern];
  const historyLabel     = history?.isPaid ? "Full history" : "7-day history";
  const oldestHiddenDate = history?.oldestHiddenSessionDate
    ? formatHistoryDate(history.oldestHiddenSessionDate) : null;
  const shouldShowUpgradePrompt = !!history && !history.isPaid && (
    history.hasOlderSessions ||
    (history.streakFraming === "teaser" &&
      (history.currentStreakDays >= 2 || history.sessions.length >= 2))
  );

  // ── JSX ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ══════════════════════════════════════════════════════
          TOOL ZONE — interactive area
          Mobile: subtle teal surface container
          Desktop: transparent (md: Tailwind overrides)
          ══════════════════════════════════════════════════════ */}
      <div className="mb-6 md:mb-0">

        {/* ── Pattern selector ──────────────────────────────── */}
        <PatternSelector
          selected={pattern}
          onChange={setPattern}
          disabled={!canSwitch}
        />

        {/* ── Orb + Begin/Stop ──────────────────────────────── */}
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

          {/* Begin / Stop — below orb on mobile, above on desktop */}
          <div className="flex justify-center md:order-first">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="bg-[rgba(60,192,212,0.85)] border border-[rgba(60,192,212,0.90)] text-[rgba(10,30,36,0.95)]
                           [font-family:var(--font-jost)] text-[11px] tracking-[0.22em] uppercase cursor-pointer
                           px-8 py-3 rounded-full transition-all duration-300
                           hover:bg-[rgba(60,192,212,1)] hover:border-[rgba(60,192,212,1)]"
              >
                {sessionComplete ? "Begin again" : "Begin"}
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="bg-[rgba(60,192,212,0.85)] border border-[rgba(60,192,212,0.90)] text-[rgba(10,30,36,0.95)]
                           [font-family:var(--font-jost)] text-[11px] tracking-[0.22em] uppercase cursor-pointer
                           px-8 py-3 rounded-full transition-all duration-300
                           hover:bg-[rgba(60,192,212,1)] hover:border-[rgba(60,192,212,1)]"
              >
                Stop
              </button>
            )}
          </div>
        </div>

        {/* ── Info cards — Duration + Best For ──────────────── */}
        <div className="grid grid-cols-2 gap-2 max-w-[320px] mx-auto md:mx-auto mb-2 md:max-w-[420px] md:mb-20">
          {[
            { label: "Duration", value: info.duration },
            { label: "Best for", value: info.bestFor  },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 p-2 rounded-[12px] md:gap-1.5 md:px-4 md:py-4"
              style={{ border: `1px solid ${T(0.15)}`, background: T(0.04) }}
            >
              <p
                className="[font-family:var(--font-jost)] text-[11px] tracking-[0.18em] uppercase md:text-[12px]"
                style={{ color: T(0.65) }}
              >
                {label}
              </p>
              <p
                className="[font-family:var(--font-display)] font-light text-[13px] text-center leading-snug md:text-[15px]"
                style={{ color: T(0.92) }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          REFLECTION ZONE — history, streak, patterns
          Mobile: collapses behind toggle
          Desktop: always visible
          ══════════════════════════════════════════════════════ */}
      {userId && history && (
        <section className="max-w-[520px] mx-auto mb-20">

          {/* Mobile toggle */}
          <button
            className="w-full flex items-center justify-between md:hidden cursor-pointer rounded-[14px] px-4 py-3"
            style={{
              background:                 T(0.05),
              border:                     `1px solid ${T(0.14)}`,
              borderBottomLeftRadius:     historyOpen ? 0 : undefined,
              borderBottomRightRadius:    historyOpen ? 0 : undefined,
              marginBottom:               historyOpen ? 0 : undefined,
            }}
            onClick={() => setHistoryOpen(o => !o)}
            aria-expanded={historyOpen}
          >
            <p
              className="[font-family:var(--font-jost)] text-[11px] tracking-[0.24em] uppercase"
              style={{ color: T(0.70) }}
            >
              {historyLabel}
            </p>
            <span
              className="w-6 h-6 flex items-center justify-center rounded-full text-[16px] transition-transform duration-300"
              style={{
                color:      T(0.80),
                background: T(0.10),
                border:     `1px solid ${T(0.25)}`,
                transform:  historyOpen ? "rotate(45deg)" : "rotate(0deg)",
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
            style={{ color: T(0.65) }}
          >
            {historyLabel}
          </p>

          {/* History content */}
          <div className={`${historyOpen ? "block" : "hidden"} md:block ${historyOpen ? "mb-6" : "mb-4"}`}>
            <div
              className="px-3 py-3 md:px-5 md:py-4 md:rounded-[14px] md:border"
              style={{
                borderColor: T(0.14),
                background:  T(0.03),
                borderTop:   historyOpen ? "none" : undefined,
                borderRadius: historyOpen ? "0 0 14px 14px" : undefined,
              }}
            >
              <p
                className="[font-family:var(--font-jost)] text-[12px] md:text-[13px] font-light leading-relaxed text-center"
                style={{ color: "rgba(255,255,255,0.80)" }}
              >
                {!history.isPaid
                  ? "Free users keep 7 days of breathing history. Your older sessions are still there."
                  : history.sessions.length > 0
                  ? `${history.sessions.length} breathing ${history.sessions.length === 1 ? "session" : "sessions"} saved.`
                  : "No breathing sessions saved yet."}
              </p>

              {!history.isPaid && history.hasOlderSessions && oldestHiddenDate && (
                <p
                  className="[font-family:var(--font-jost)] text-[12px] font-light leading-relaxed text-center mt-3"
                  style={{ color: T(0.70) }}
                >
                  Your earlier history starts before {oldestHiddenDate}.
                </p>
              )}
              {!history.isPaid && history.hasOlderSessions && (
                <p
                  className="[font-family:var(--font-jost)] text-[12px] font-light leading-relaxed text-center mt-2"
                  style={{ color: T(0.70) }}
                >
                  Full history helps you notice patterns over time.
                </p>
              )}

              {/* Streak */}
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
                    className="[font-family:var(--font-jost)] text-[11px] md:text-[12px] tracking-[0.22em] uppercase text-center mb-3 md:mb-4"
                    style={{ color: T(0.65) }}
                  >
                    Your breathing patterns over time
                  </p>
                  <div className="grid gap-2 md:gap-3 md:grid-cols-3">
                    {[
                      { label: "Most used pace",    value: formatPace(history.insights.mostUsedPace) },
                      { label: "This week vs last",
                        value: `${history.insights.sessionsThisWeek} / ${history.insights.sessionsLastWeek}`,
                        sub:   formatWeeklyChange(history.insights.weeklyChangeDirection) },
                      { label: "Best streak",
                        value: `${history.insights.bestStreakDays} day${history.insights.bestStreakDays === 1 ? "" : "s"}` },
                    ].map(({ label, value, sub }) => (
                      <div
                        key={label}
                        className="rounded-[10px] px-2 py-2 md:px-3 md:py-3 text-center"
                        style={{ border: `1px solid ${T(0.10)}`, background: "rgba(6,18,24,0.20)" }}
                      >
                        <p
                          className="[font-family:var(--font-jost)] text-[11px] md:text-[12px] tracking-[0.18em] uppercase mb-1"
                          style={{ color: T(0.65) }}
                        >
                          {label}
                        </p>
                        <p
                          className="[font-family:var(--font-display)] font-light text-[16px] md:text-[18px] leading-snug"
                          style={{ color: T(0.92) }}
                        >
                          {value}
                        </p>
                        {sub && (
                          <p
                            className="[font-family:var(--font-jost)] text-[11px] font-light leading-relaxed mt-1"
                            style={{ color: T(0.70) }}
                          >
                            {sub}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!history.isPaid && shouldShowUpgradePrompt && (
                <p
                  className="[font-family:var(--font-jost)] text-[12px] font-light leading-relaxed text-center mt-4"
                  style={{ color: T(0.70) }}
                >
                  Patterns become clearer over time.
                </p>
              )}
              {shouldShowUpgradePrompt && (
                <BreathingUpgradePrompt hasOlderSessions={history.hasOlderSessions} />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Session complete ─────────────────────────────────────── */}
      {sessionComplete && !dismissed && (
        <SessionComplete
          onClose={() => setDismissed(true)}
        />
      )}
    </>
  );
}
