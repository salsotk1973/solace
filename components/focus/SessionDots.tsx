"use client";

interface SessionDotsProps {
  workDone: number;   // 0-4 completed work sessions
  phaseIdx: number;   // current phase 0-7
  started: boolean;
}

export default function SessionDots({ workDone, phaseIdx, started }: SessionDotsProps) {
  return (
    <div className="flex items-center gap-3">
      {[0, 1, 2, 3].map((i) => {
        const isDone   = workDone > i;
        // Active = currently in this work session (work phases are even indices: 0,2,4,6)
        const isActive = started && !isDone && phaseIdx === i * 2;

        return (
          <div
            key={i}
            className={[
              "w-[6px] h-[6px] rounded-full transition-all duration-[400ms]",
              isDone
                ? "bg-[rgba(240,170,70,0.7)] border-transparent"
                : isActive
                ? "bg-transparent border border-[rgba(240,170,70,0.65)] shadow-[0_0_6px_rgba(240,170,70,0.35)]"
                : "bg-transparent border border-[rgba(200,210,220,0.15)]",
            ].join(" ")}
          />
        );
      })}
      <span className="[font-family:var(--font-jost)] text-[9px] tracking-[0.18em] uppercase text-[rgba(160,175,185,0.28)] ml-1">
        sessions
      </span>
    </div>
  );
}
