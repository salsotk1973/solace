"use client";

type Pattern = "box" | "478";

interface PatternSelectorProps {
  selected: Pattern;
  onChange: (p: Pattern) => void;
  disabled: boolean;
}

const FREE_PATTERNS: { id: Pattern; name: string; timing: string }[] = [
  { id: "box", name: "Box Breathing", timing: "4 · 4 · 4 · 4" },
  { id: "478", name: "4-7-8", timing: "4 · 7 · 8" },
];

const LOCKED_PATTERNS = [
  { name: "Calm", timing: "5 · 5" },
  { name: "Double Exhale", timing: "" },
];

function LockIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ marginLeft: "4px", flexShrink: 0 }}
    >
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function PatternSelector({ selected, onChange, disabled }: PatternSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-1.5 w-full max-w-[260px] mx-auto mb-1 md:flex md:flex-wrap md:justify-center md:max-w-none md:gap-3 md:mb-14">

      {/* ── Free patterns: always bright, selected gets glowing border ── */}
      {FREE_PATTERNS.map((p) => {
        const active = selected === p.id;
        return (
          <button
            key={p.id}
            onClick={() => !disabled && onChange(p.id)}
            disabled={disabled}
            className="w-full md:w-auto flex flex-col items-center gap-0.5 px-2 py-1.5 md:px-7 md:py-3 rounded-full transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
            style={{
              background: active ? "rgba(60,192,212,0.22)" : "rgba(60,192,212,0.10)",
              border: active
                ? "1px solid rgba(60,192,212,0.90)"
                : "1px solid rgba(60,192,212,0.45)",
              color: active
                ? "rgba(200,248,255,1.0)"
                : "rgba(140,225,240,0.85)",
              boxShadow: active ? "0 0 12px rgba(60,192,212,0.25)" : "none",
            }}
          >
            <span className="[font-family:var(--font-jost)] text-[10px] md:text-[12px] font-[500] tracking-[0.02em] leading-none">
              {p.name}
            </span>
            <span className="[font-family:var(--font-jost)] text-[8px] md:text-[9px] tracking-[0.14em] uppercase leading-none mt-0.5" style={{ opacity: 0.7 }}>
              {p.timing}
            </span>
          </button>
        );
      })}

      {/* ── Locked patterns: gold colour, no background, clearly paid ── */}
      {LOCKED_PATTERNS.map((p) => (
        <a
          key={p.name}
          href="/pricing"
          className="w-full md:w-auto flex flex-col items-center gap-0.5 px-2 py-1.5 md:px-7 md:py-3 rounded-full transition-all duration-200 hover:opacity-90"
          style={{
            background: "transparent",
            border: "1px solid rgba(232,168,62,0.45)",
            color: "rgba(232,168,62,0.80)",
          }}
        >
          <span
            className="[font-family:var(--font-jost)] text-[10px] md:text-[12px] font-[400] tracking-[0.02em] leading-none"
            style={{ display: "flex", alignItems: "center" }}
          >
            {p.name}
            <LockIcon />
          </span>
          {p.timing && (
            <span className="[font-family:var(--font-jost)] text-[8px] md:text-[9px] tracking-[0.14em] uppercase leading-none mt-0.5" style={{ opacity: 0.65 }}>
              {p.timing}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}
