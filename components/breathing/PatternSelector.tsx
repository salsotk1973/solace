"use client";

import { Lock } from "lucide-react";

type Pattern = "box" | "478";

interface PatternSelectorProps {
  selected: Pattern;
  onChange: (p: Pattern) => void;
  disabled: boolean;
}

const FREE_PATTERNS: { id: Pattern; name: string; timing: string }[] = [
  { id: "box",  name: "Box Breathing", timing: "4 · 4 · 4 · 4" },
  { id: "478",  name: "4-7-8",         timing: "4 · 7 · 8"     },
];

const LOCKED_PATTERNS = [
  { name: "Resonant",            timing: "5 · 5"  },
  { name: "Physiological Sigh",  timing: "Custom" },
];

export default function PatternSelector({ selected, onChange, disabled }: PatternSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-14">
      {FREE_PATTERNS.map((p) => {
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
                ? "border-[rgba(80,200,218,0.42)] bg-[rgba(80,200,218,0.07)] text-[rgba(140,228,240,0.95)]"
                : "border-[rgba(255,255,255,0.07)] text-[rgba(160,195,210,0.45)] hover:border-[rgba(80,200,218,0.22)] hover:text-[rgba(140,228,240,0.7)]",
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

      {LOCKED_PATTERNS.map((p) => (
        <button
          key={p.name}
          disabled
          className="flex flex-col items-center gap-0.5 px-7 py-3 rounded-full border border-[rgba(255,255,255,0.04)] text-[rgba(110,130,140,0.28)] cursor-not-allowed"
        >
          <span className="[font-family:var(--font-jost)] flex items-center gap-1.5 text-[12px] tracking-[-0.01em]">
            <Lock size={9} className="opacity-50" />
            {p.name}
          </span>
          <span className="[font-family:var(--font-jost)] text-[9px] tracking-[0.14em] uppercase opacity-40">
            {p.timing}
          </span>
        </button>
      ))}
    </div>
  );
}
