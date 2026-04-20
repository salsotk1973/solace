"use client";

export type SleepPattern = "48" | "478" | "relax";

interface PatternSelectorProps {
  selected: SleepPattern;
  onChange: (p: SleepPattern) => void;
  disabled: boolean;
}

const PATTERNS: { id: SleepPattern; name: string; timing: string }[] = [
  { id: "48",    name: "4-8 Sleep",   timing: "4 · 8"     },
  { id: "478",   name: "4-7-8",       timing: "4 · 7 · 8" },
  { id: "relax", name: "Deep Relax",  timing: "5 · 10"    },
];

// Canonical teal — Calm category
const T = (a: number) => `rgba(60,192,212,${a})`;

export default function PatternSelector({ selected, onChange, disabled }: PatternSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10 md:mb-14">
      {PATTERNS.map((p) => {
        const active = selected === p.id;
        return (
          <button
            key={p.id}
            onClick={() => !disabled && onChange(p.id)}
            disabled={disabled}
            className="flex flex-col items-center gap-0.5 px-5 py-2.5 md:px-7 md:py-3 rounded-full border transition-all duration-300 disabled:cursor-not-allowed"
            style={{
              background:  active ? T(0.12) : T(0.04),
              border:      `1px solid ${active ? T(0.55) : T(0.14)}`,
              color:       active ? T(0.95) : T(0.55),
              boxShadow:   active ? `0 0 12px ${T(0.15)}` : "none",
            }}
          >
            <span className="[font-family:var(--font-jost)] text-[12px] font-[400] tracking-[-0.01em]">
              {p.name}
            </span>
            <span className="[font-family:var(--font-jost)] text-[9px] tracking-[0.14em] uppercase opacity-55">
              {p.timing}
            </span>
          </button>
        );
      })}
    </div>
  );
}
