"use client";

import type { Entry } from "./EntryList";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekDays(): Date[] {
  const today = new Date();
  const dow = today.getDay(); // 0=Sun
  const offset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(today);
  monday.setDate(today.getDate() + offset);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

interface Props {
  entries: Entry[];
}

export default function StreakRow({ entries }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekDays = getWeekDays();

  const entryDates = new Set(
    entries.map((e) => {
      const d = new Date(e.timestamp);
      d.setHours(0, 0, 0, 0);
      return d.toDateString();
    })
  );

  // Calculate streak: consecutive filled days going back from yesterday (or today if filled)
  let streak = 0;
  const checkFrom = entryDates.has(today.toDateString())
    ? new Date(today)
    : new Date(today.getTime() - 86400000);

  let cursor = new Date(checkFrom);
  while (cursor >= weekDays[0] && entryDates.has(cursor.toDateString())) {
    streak++;
    cursor = new Date(cursor.getTime() - 86400000);
  }

  return (
    <div>
      <div className="flex items-end justify-center gap-5">
        {weekDays.map((day, i) => {
          const isToday = day.toDateString() === today.toDateString();
          const hasEntry = entryDates.has(day.toDateString());

          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.1em] uppercase text-[rgba(200,180,120,0.32)]">
                {DAY_LABELS[i]}
              </p>
              <div
                className={`w-3 h-3 rounded-full transition-all duration-[400ms] ease-in-out ${
                  hasEntry
                    ? "bg-[rgba(220,175,80,0.65)] shadow-[0_0_6px_rgba(220,175,80,0.3)]"
                    : isToday
                    ? "border border-[rgba(220,175,80,0.5)] shadow-[0_0_8px_rgba(220,175,80,0.15)]"
                    : "border border-[rgba(200,180,120,0.14)]"
                }`}
              />
            </div>
          );
        })}
      </div>
      <p className="text-center [font-family:var(--font-jost)] text-[11px] font-light text-[rgba(200,180,120,0.38)] mt-5">
        <span className="text-[rgba(220,175,80,0.7)]">{streak}</span>{" "}
        day streak — keep the jar filling
      </p>
    </div>
  );
}
