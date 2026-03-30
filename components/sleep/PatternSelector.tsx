"use client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SleepPattern = "48" | "478" | "relax";

interface PatternSelectorProps {
  selected: SleepPattern;
  onChange: (p: SleepPattern) => void;
  disabled: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PATTERNS: { id: SleepPattern; name: string; timing: string }[] = [
  { id: "48",    name: "4-8 Sleep",  timing: "4 · 8"     },
  { id: "478",   name: "4-7-8",      timing: "4 · 7 · 8" },
  { id: "relax", name: "Deep Relax", timing: "5 · 10"    },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PatternSelector({ selected, onChange, disabled }: PatternSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-14">
      {PATTERNS.map((p) => {
        const active = selected === p.id;
        return (
          <button
            key={p.id}
            onClick={() => !disabled && onChange(p.id)}
            disabled={disabled}
            className={[
              "flex flex-col items-center gap-0.5 px-7 py-3 rounded-full border transition-all duration-300",
              "disabled:cursor-not-allowed",
              active
                ? "border-[rgba(140,120,210,0.42)] bg-[rgba(140,120,210,0.07)] text-[rgba(180,165,235,0.95)]"
                : "border-[rgba(255,255,255,0.07)] text-[rgba(155,145,200,0.45)] hover:border-[rgba(140,120,210,0.22)] hover:text-[rgba(180,165,235,0.7)]",
            ].join(" ")}
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
