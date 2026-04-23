"use client";

import { useState, useRef, useEffect } from "react";
import MoodDial from "./MoodDial";
import { useToolHistory } from "@/hooks/useToolHistory";
import ToolUpgradePrompt from "@/components/shared/ToolUpgradePrompt";
import SessionComplete from "./SessionComplete";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MoodEntry = {
  value: number;
  word?: string;
  timestamp: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const LS_KEY = "solace_mood_week";
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getWeekStart(): Date {
  const today = new Date();
  const dow = today.getDay();
  const offset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(today);
  monday.setDate(today.getDate() + offset);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getWeekDays(): Date[] {
  const monday = getWeekStart();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function getDemoEntries(): MoodEntry[] {
  const mon = getWeekStart().getTime();
  return [
    { value: 4, word: "tired", timestamp: new Date(mon + 3 * 86400000 + 32400000).toISOString() },
    { value: 6, word: "okay", timestamp: new Date(mon + 2 * 86400000 + 36000000).toISOString() },
    { value: 5, word: "unsure", timestamp: new Date(mon + 1 * 86400000 + 50400000).toISOString() },
    { value: 7, word: "hopeful", timestamp: new Date(mon + 0 * 86400000 + 28800000).toISOString() },
  ];
}

function loadFromStorage(): MoodEntry[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return getDemoEntries();
    const parsed = JSON.parse(raw) as { weekStart: string; entries: MoodEntry[] };
    const currentWeekStart = getWeekStart().toISOString().split("T")[0];
    if (parsed.weekStart !== currentWeekStart) return getDemoEntries();
    return parsed.entries.length > 0 ? parsed.entries : getDemoEntries();
  } catch {
    return getDemoEntries();
  }
}

function saveToStorage(entries: MoodEntry[]) {
  const weekStart = getWeekStart().toISOString().split("T")[0];
  localStorage.setItem(LS_KEY, JSON.stringify({ weekStart, entries }));
}

function getMoodColor(value: number): string {
  if (value <= 3) return "rgba(200,130,140,0.65)";
  if (value <= 5) return "rgba(185,155,210,0.65)";
  if (value <= 7) return "rgba(150,135,215,0.65)";
  return "rgba(130,160,220,0.75)";
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  userId: string | null;
}

export default function MoodSession({ userId }: Props) {
  const { history, loadHistory, shouldShowUpgradePrompt } = useToolHistory("mood", userId);

  const [moodValue, setMoodValue] = useState(5);
  const [moodWord, setMoodWord] = useState("");
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [todayLogged, setTodayLogged] = useState(false);
  const timers = useRef<NodeJS.Timeout[]>([]);

  // ── Load on mount ────────────────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      if (userId) {
        try {
          const res = await fetch("/api/mood");
          if (res.ok) {
            const data = await res.json();
            const loaded: MoodEntry[] = data.entries ?? [];
            setEntries(loaded);
            checkTodayLogged(loaded);
          }
        } catch {
          /* silent */
        }
      } else {
        const loaded = loadFromStorage();
        setEntries(loaded);
        checkTodayLogged(loaded);
      }
      setIsLoaded(true);
    }

    function checkTodayLogged(loaded: MoodEntry[]) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setTodayLogged(
        loaded.some((e) => {
          const d = new Date(e.timestamp);
          d.setHours(0, 0, 0, 0);
          return d.toDateString() === today.toDateString();
        })
      );
    }

    load();
    const timersRef = timers.current;
    return () => { timersRef.forEach(clearTimeout); };
  }, [userId]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleLog() {
    const newEntry: MoodEntry = {
      value: moodValue,
      word: moodWord.trim() || undefined,
      timestamp: new Date().toISOString(),
    };

    const next = [newEntry, ...entries];
    setEntries(next);
    setTodayLogged(true);
    setMoodWord("");

    if (userId) {
      fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: moodValue, word: moodWord.trim() }),
      })
        .then(() => loadHistory())
        .catch(() => {});
    } else {
      saveToStorage(next);
    }

    const t = setTimeout(() => { if (!nudgeDismissed) setShowNudge(true); }, 700);
    timers.current.push(t);
  }

  // ── Derived state ─────────────────────────────────────────────────────────

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekDays = getWeekDays();

  // For each day, find most recent entry
  const dayEntries: Map<string, MoodEntry> = new Map();
  for (const entry of [...entries].reverse()) {
    const d = new Date(entry.timestamp);
    d.setHours(0, 0, 0, 0);
    dayEntries.set(d.toDateString(), entry);
  }

  // Streak: consecutive logged days going back from today
  let streak = 0;
  let cursor = new Date(today);
  if (!dayEntries.has(cursor.toDateString())) {
    cursor = new Date(cursor.getTime() - 86400000);
  }
  while (cursor >= weekDays[0] && dayEntries.has(cursor.toDateString())) {
    streak++;
    cursor = new Date(cursor.getTime() - 86400000);
  }

  // ── JSX ───────────────────────────────────────────────────────────────────

  if (!isLoaded) return null;

  return (
    <>
      {/* ── Dial + controls ──────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-8 mb-14">
        <MoodDial value={moodValue} word={moodWord || undefined} />

        {/* +/- controls */}
        <div className="flex items-center gap-10">
          <button
            onClick={() => setMoodValue((v) => Math.max(1, v - 1))}
            disabled={moodValue <= 1}
            className="w-11 h-11 rounded-full border border-[rgba(160,130,210,0.25)] text-[rgba(185,160,230,0.65)] hover:border-[rgba(160,130,210,0.55)] hover:text-[rgba(185,160,230,1)] disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer [font-family:var(--font-jost)] text-[22px] font-light flex items-center justify-center"
          >
            −
          </button>

          <div className="text-center">
            <p className="[font-family:var(--font-jost)] text-[10px] tracking-[0.24em] uppercase text-[rgba(160,130,210,0.38)]">
              {moodValue <= 3 ? "low" : moodValue <= 6 ? "okay" : moodValue <= 8 ? "good" : "great"}
            </p>
          </div>

          <button
            onClick={() => setMoodValue((v) => Math.min(10, v + 1))}
            disabled={moodValue >= 10}
            className="w-11 h-11 rounded-full border border-[rgba(160,130,210,0.25)] text-[rgba(185,160,230,0.65)] hover:border-[rgba(160,130,210,0.55)] hover:text-[rgba(185,160,230,1)] disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer [font-family:var(--font-jost)] text-[22px] font-light flex items-center justify-center"
          >
            +
          </button>
        </div>

        {/* Word input */}
        <div className="w-full max-w-[340px] text-center">
          <input
            type="text"
            value={moodWord}
            onChange={(e) => setMoodWord(e.target.value.slice(0, 20))}
            placeholder="One word for this feeling…"
            className="w-full bg-transparent border-b border-[rgba(160,130,210,0.18)] py-2.5 text-center [font-family:var(--font-display)] text-[19px] font-light italic text-[rgba(200,175,235,0.8)] placeholder:text-[rgba(160,130,210,0.22)] focus:outline-none focus:border-[rgba(160,130,210,0.42)] transition-colors duration-300"
          />
        </div>

        {/* Log button */}
        <button
          onClick={handleLog}
          className="[font-family:var(--font-jost)] text-[13px] font-light text-[rgba(185,160,230,0.85)] border border-[rgba(160,130,210,0.3)] rounded-[999px] px-7 py-2.5 hover:border-[rgba(160,130,210,0.6)] hover:text-[rgba(185,160,230,1)] transition-all duration-300 cursor-pointer"
        >
          {todayLogged ? "Log again →" : "Log mood →"}
        </button>
      </div>

      {/* ── Week view ─────────────────────────────────────────────────────── */}
      <div className="mb-12">
        <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.22em] uppercase text-[rgba(160,130,210,0.28)] mb-6 text-center">
          This week
        </p>
        <div className="flex items-end justify-center gap-3">
          {weekDays.map((day, i) => {
            const entry = dayEntries.get(day.toDateString());
            const isToday = day.toDateString() === today.toDateString();
            const barMaxHeight = 56;
            const barHeight = entry ? Math.round((entry.value / 10) * barMaxHeight) : 0;

            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="relative flex items-end" style={{ height: `${barMaxHeight}px` }}>
                  {/* Bar track */}
                  <div className="w-7 rounded-[6px] bg-[rgba(160,130,210,0.07)]" style={{ height: `${barMaxHeight}px` }} />
                  {/* Bar fill */}
                  {entry && (
                    <div
                      className="absolute bottom-0 w-7 rounded-[6px] transition-all duration-500 ease-in-out"
                      style={{
                        height: `${barHeight}px`,
                        background: getMoodColor(entry.value),
                      }}
                    />
                  )}
                  {/* Value label */}
                  {entry && (
                    <span
                      className="absolute inset-0 flex items-center justify-center [font-family:var(--font-jost)] text-[11px] font-light text-[rgba(200,180,235,0.85)]"
                    >
                      {entry.value}
                    </span>
                  )}
                </div>
                <p className={`[font-family:var(--font-jost)] text-[9px] tracking-[0.08em] uppercase ${isToday ? "text-[rgba(185,160,230,0.6)]" : "text-[rgba(160,130,210,0.28)]"}`}>
                  {DAY_LABELS[i]}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Streak row ────────────────────────────────────────────────────── */}
      <div className="mb-20">
        <div className="flex items-end justify-center gap-5">
          {weekDays.map((day, i) => {
            const hasEntry = dayEntries.has(day.toDateString());
            const isToday = day.toDateString() === today.toDateString();

            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.1em] uppercase text-[rgba(160,130,210,0.28)]">
                  {DAY_LABELS[i]}
                </p>
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-[400ms] ease-in-out ${
                    hasEntry
                      ? "bg-[rgba(160,130,210,0.65)] shadow-[0_0_6px_rgba(160,130,210,0.3)]"
                      : isToday
                      ? "border border-[rgba(160,130,210,0.5)] shadow-[0_0_8px_rgba(160,130,210,0.15)]"
                      : "border border-[rgba(160,130,210,0.14)]"
                  }`}
                />
              </div>
            );
          })}
        </div>
        <p className="text-center [font-family:var(--font-jost)] text-[11px] font-light text-[rgba(160,130,210,0.38)] mt-5">
          <span className="text-[rgba(175,148,228,0.7)]">{streak}</span>{" "}
          day streak — keep checking in
        </p>
      </div>

      {/* ── History ──────────────────────────────────────────────────────── */}
      {userId && history && (
        <section className="max-w-[520px] mx-auto mb-10 mt-4">
          <p
            className="[font-family:var(--font-jost)] text-[12px] tracking-[0.24em] uppercase mb-4 text-center"
            style={{ color: "rgba(232, 168, 62, 0.50)" }}
          >
            {history.isPaid ? "Full history" : "7-day history"}
          </p>
          <div
            className="rounded-[14px] px-5 py-4"
            style={{ border: "1px solid rgba(232, 168, 62, 0.08)", background: "rgba(232, 168, 62, 0.025)" }}
          >
            <p className="[font-family:var(--font-jost)] text-[13px] font-light text-[rgba(255,255,255,0.75)] leading-relaxed text-center">
              {!history.isPaid
                ? "Free users keep 7 days of history. Your older sessions are still there."
                : history.sessions.length > 0
                ? `${history.sessions.length} session${history.sessions.length === 1 ? "" : "s"} saved.`
                : "No sessions saved yet."}
            </p>
            {history.hasStreak && (
              <div className="mt-4 text-center">
                <p
                  className="[font-family:var(--font-jost)] text-[12px] tracking-[0.22em] uppercase mb-1"
                  style={{ color: "rgba(232, 168, 62, 0.42)" }}
                >
                  Current streak
                </p>
                <p className="[font-family:var(--font-display)] font-light text-[24px] text-[rgba(255,255,255,0.80)]">
                  {history.currentStreakDays} day{history.currentStreakDays === 1 ? "" : "s"}
                </p>
                <p className="[font-family:var(--font-jost)] text-[12px] font-light text-[rgba(255,255,255,0.45)] mt-2">
                  {history.streakFraming === "full"
                    ? "A quiet record of the days you returned."
                    : "Consistency gets easier when you can see the full picture."}
                </p>
              </div>
            )}
            {shouldShowUpgradePrompt && (
              <ToolUpgradePrompt
                hasOlderSessions={history.hasOlderSessions}
                toolColour="232, 168, 62"
                toolName="Mood Tracker"
              />
            )}
          </div>
        </section>
      )}

      {/* ── Nudge ────────────────────────────────────────────────────────── */}
      {showNudge && !nudgeDismissed && (
        <SessionComplete
          onClose={() => setNudgeDismissed(true)}
        />
      )}
    </>
  );
}
