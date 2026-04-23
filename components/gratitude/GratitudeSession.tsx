"use client";

import { useState, useRef, useEffect } from "react";
import GratitudeJar from "./GratitudeJar";
import EntryInput from "./EntryInput";
import EntryList, { type Entry } from "./EntryList";
import StreakRow from "./StreakRow";
import SessionComplete from "./SessionComplete";
import { useToolHistory } from "@/hooks/useToolHistory";
import ToolUpgradePrompt from "@/components/shared/ToolUpgradePrompt";

// ─── Constants ────────────────────────────────────────────────────────────────

const LS_KEY = "solace_gratitude_week";

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

function getDemoEntries(): Entry[] {
  const mon = getWeekStart().getTime();
  return [
    {
      text: "The rain on the window while I worked.",
      timestamp: new Date(mon + 2 * 86400000 + 36000000).toISOString(),
    },
    {
      text: "A stranger held the door open and smiled.",
      timestamp: new Date(mon + 1 * 86400000 + 50400000).toISOString(),
    },
    {
      text: "My morning coffee was perfect today.",
      timestamp: new Date(mon + 0 * 86400000 + 28800000).toISOString(),
    },
  ];
}

function loadFromStorage(): Entry[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return getDemoEntries();

    const parsed = JSON.parse(raw) as {
      weekStart: string;
      entries: Entry[];
    };
    const currentWeekStart = getWeekStart().toISOString().split("T")[0];

    if (parsed.weekStart !== currentWeekStart) {
      // New week — start fresh with demo
      return getDemoEntries();
    }

    return parsed.entries.length > 0 ? parsed.entries : getDemoEntries();
  } catch {
    return getDemoEntries();
  }
}

function saveToStorage(entries: Entry[]) {
  const weekStart = getWeekStart().toISOString().split("T")[0];
  localStorage.setItem(
    LS_KEY,
    JSON.stringify({ weekStart, entries })
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  userId: string | null;
}

export default function GratitudeSession({ userId }: Props) {
  const { history, loadHistory, shouldShowUpgradePrompt } = useToolHistory("gratitude", userId);

  const [entries, setEntries] = useState<Entry[]>([]);
  const [inputText, setInputText] = useState("");
  const [showNudge, setShowNudge] = useState(false);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const timers = useRef<NodeJS.Timeout[]>([]);

  // ── Load entries on mount ─────────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      if (userId) {
        try {
          const res = await fetch("/api/gratitude");
          if (res.ok) {
            const data = await res.json();
            setEntries((data.entries as Entry[]) ?? []);
          }
        } catch {
          // Fall back to empty
        }
      } else {
        setEntries(loadFromStorage());
      }
      setIsLoaded(true);
    }

    load();

    const timersRef = timers.current;
    return () => {
      timersRef.forEach(clearTimeout);
    };
  }, [userId]);

  // ── Add entry ─────────────────────────────────────────────────────────────

  function handleAdd() {
    const text = inputText.trim();
    if (text.length <= 4) return;

    const newEntry: Entry = {
      text,
      timestamp: new Date().toISOString(),
      isNew: true,
    };

    // Prepend (newest first), then remove isNew after one frame
    const next = [newEntry, ...entries];
    setEntries(next);
    setInputText("");

    const t1 = setTimeout(() => {
      setEntries((prev) =>
        prev.map((e, i) => (i === 0 ? { ...e, isNew: false } : e))
      );
    }, 16);
    timers.current.push(t1);

    // Save
    if (userId) {
      fetch("/api/gratitude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry: text }),
      })
        .then(() => loadHistory())
        .catch(() => {});
    } else {
      // Strip isNew before saving to storage
      const toSave = next.map(({ isNew: _, ...e }) => e);
      saveToStorage(toSave);
    }

    // Show nudge after 700ms
    const t2 = setTimeout(() => {
      if (!nudgeDismissed) setShowNudge(true);
    }, 700);
    timers.current.push(t2);
  }

  // ── JSX ───────────────────────────────────────────────────────────────────

  if (!isLoaded) return null;

  return (
    <>
      {/* ── Jar + input ────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-10 mb-16">
        <GratitudeJar count={entries.length} />
        <EntryInput
          value={inputText}
          onChange={setInputText}
          onAdd={handleAdd}
        />
      </div>

      {/* ── Entry list ─────────────────────────────────────────────────────── */}
      <div className="mb-14">
        <EntryList entries={entries} />
      </div>

      {/* ── Streak row ─────────────────────────────────────────────────────── */}
      <div className="mb-20">
        <StreakRow entries={entries} />
      </div>

      {/* ── History ──────────────────────────────────────────────────────────── */}
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
                toolName="Gratitude Log"
              />
            )}
          </div>
        </section>
      )}

      {/* ── Session complete nudge ──────────────────────────────────────────── */}
      {showNudge && !nudgeDismissed && (
        <SessionComplete
          isLoggedIn={!!userId}
          isPaid={history?.isPaid}
          onDismiss={() => setNudgeDismissed(true)}
        />
      )}
    </>
  );
}
