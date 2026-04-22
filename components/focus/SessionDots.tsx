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
        const isActive = started && !isDone && phaseIdx === i * 2;

        return (
          <div
            key={i}
            className={[
              "w-[6px] h-[6px] rounded-full transition-all duration-[400ms]",
              isDone
                ? "border-transparent"
                : isActive
                ? "bg-transparent"
                : "bg-transparent",
            ].join(" ")}
            style={
              isDone
                ? { background: "rgba(232,168,62,0.55)" }
                : isActive
                ? { background: "transparent", border: "1px solid rgba(232,168,62,0.90)", boxShadow: "0 0 6px rgba(232,168,62,0.35)" }
                : { background: "transparent", border: "1px solid rgba(232,168,62,0.18)" }
            }
          />
        );
      })}
      <span
        className="[font-family:var(--font-jost)] text-[9px] tracking-[0.18em] uppercase ml-1"
        style={{ color: "rgba(232,168,62,0.45)" }}
      >
        sessions
      </span>
    </div>
  );
}
