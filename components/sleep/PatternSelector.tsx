"use client";

export type SleepPattern = "48" | "478" | "relax";

interface PatternSelectorProps {
  selected: SleepPattern;
  onChange: (p: SleepPattern) => void;
  disabled: boolean;
}

// Exact same data shape as Breathing
const PATTERNS: { id: SleepPattern; name: string; timing: string }[] = [
  { id: "48",    name: "4-8 Sleep",  timing: "4 · 8"     },
  { id: "478",   name: "4-7-8",      timing: "4 · 7 · 8" },
  { id: "relax", name: "Deep Relax", timing: "5 · 10"    },
];

export default function PatternSelector({ selected, onChange, disabled }: PatternSelectorProps) {
  return (
    // EXACT same grid/flex layout as Breathing PatternSelector
    <div className="grid grid-cols-3 gap-1.5 w-full max-w-[320px] mx-auto mb-1 md:flex md:flex-wrap md:justify-center md:max-w-none md:gap-3 md:mb-14">
      {PATTERNS.map((p) => {
        const active = selected === p.id;
        return (
          <button
            key={p.id}
            onClick={() => !disabled && onChange(p.id)}
            disabled={disabled}
            // EXACT same classes as Breathing free pills
            className="w-full md:w-auto flex flex-col items-center gap-0.5 px-2 py-1.5 md:px-7 md:py-3 rounded-full transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
            style={{
              // EXACT same colour values as Breathing active/inactive pills
              background: active ? "rgba(60,192,212,0.22)" : "rgba(60,192,212,0.10)",
              border:     active ? "1px solid rgba(60,192,212,0.90)" : "1px solid rgba(60,192,212,0.45)",
              color:      active ? "rgba(200,248,255,1.0)" : "rgba(140,225,240,0.85)",
              boxShadow:  active ? "0 0 12px rgba(60,192,212,0.25)" : "none",
            }}
          >
            {/* EXACT same text classes as Breathing */}
            <span className="[font-family:var(--font-jost)] text-[10px] md:text-[12px] font-[500] tracking-[0.02em] leading-none">
              {p.name}
            </span>
            <span className="[font-family:var(--font-jost)] text-[8px] md:text-[9px] tracking-[0.14em] uppercase leading-none mt-0.5" style={{ opacity: 0.7 }}>
              {p.timing}
            </span>
          </button>
        );
      })}
    </div>
  );
}
