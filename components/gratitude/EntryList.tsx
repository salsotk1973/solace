"use client";

export type Entry = {
  text: string;
  timestamp: string;
  isNew?: boolean;
};

function getDayName(timestamp: string): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[new Date(timestamp).getDay()];
}

interface Props {
  entries: Entry[];
}

export default function EntryList({ entries }: Props) {
  if (entries.length === 0) return null;

  return (
    <div>
      <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.22em] uppercase text-[rgba(200,180,120,0.28)] mb-5">
        In your jar this week
      </p>
      <div className="flex flex-col gap-3">
        {entries.map((entry) => (
          <div
            key={entry.timestamp}
            className={`rounded-[12px] border border-[rgba(220,175,80,0.1)] bg-[rgba(220,155,60,0.04)] px-6 py-4 transition-all duration-500 ease-in-out ${
              entry.isNew
                ? "opacity-0 translate-y-2"
                : "opacity-100 translate-y-0"
            }`}
          >
            <p className="[font-family:var(--font-display)] font-light text-[18px] text-[rgba(220,200,160,0.8)] leading-relaxed">
              {entry.text}
            </p>
            <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.18em] uppercase text-[rgba(200,170,100,0.38)] mt-2">
              {getDayName(entry.timestamp)}
            </p>
          </div>
        ))}
      </div>

      {/* History lock note */}
      <p className="[font-family:var(--font-jost)] text-[10px] tracking-[0.1em] text-[rgba(200,180,120,0.2)] mt-7 text-center">
        🔒 Full history — with an account
      </p>
    </div>
  );
}
