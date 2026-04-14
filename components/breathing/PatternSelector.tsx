"use client";

type Pattern = "box" | "478";

interface PatternSelectorProps {
  selected: Pattern;
  onChange: (p: Pattern) => void;
  disabled: boolean;
}

const FREE_PATTERNS: { id: Pattern; name: string; timing: string }[] = [
  { id: "box", name: "Box Breathing", timing: "4 · 4 · 4 · 4" },
  { id: "478", name: "4-7-8",         timing: "4 · 7 · 8"     },
];

const LOCKED_PATTERNS = [
  { name: "Calm",          timing: "5 · 5" },
  { name: "Double Exhale", timing: ""      },
];

function LockIcon() {
  return (
    <svg
      width="11" height="11" viewBox="0 0 24 24" fill="none"
      aria-hidden="true"
      style={{ marginLeft: "4px", opacity: 0.55, flexShrink: 0 }}
    >
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function PatternSelector({ selected, onChange, disabled }: PatternSelectorProps) {
  return (
    // Mobile: strict 2×2 CSS grid, max-width 320px so cells are ~156px each.
    // Desktop: flex-wrap with natural pill widths, no max-width.
    <div className="grid grid-cols-2 gap-2 w-full max-w-[320px] mx-auto mb-3 md:flex md:flex-wrap md:justify-center md:max-w-none md:gap-3 md:mb-14">

      {/* ── Free patterns ────────────────────────────────────────────────── */}
      {FREE_PATTERNS.map((p) => {
        const active = selected === p.id;
        return (
          <button
            key={p.id}
            onClick={() => !disabled && onChange(p.id)}
            disabled={disabled}
            className={[
              "w-full md:w-auto flex flex-col items-center gap-0.5 px-3 py-2 md:px-7 md:py-3 rounded-full border transition-all duration-300",
              "disabled:cursor-not-allowed",
              active
                ? "border-[rgba(45,212,191,0.6)] bg-[rgba(45,212,191,0.1)] text-[rgba(45,212,191,0.95)]"
                : "border-[rgba(255,255,255,0.18)] bg-transparent text-[rgba(255,255,255,0.55)] hover:border-[rgba(255,255,255,0.28)] hover:text-[rgba(255,255,255,0.72)]",
            ].join(" ")}
          >
            <span className="[font-family:var(--font-jost)] text-[13px] md:text-[12px] font-[400] tracking-[-0.01em] leading-none">
              {p.name}
            </span>
            <span className="[font-family:var(--font-jost)] text-[10px] md:text-[9px] tracking-[0.14em] uppercase opacity-55 leading-none">
              {p.timing}
            </span>
          </button>
        );
      })}

      {/* ── Locked patterns ──────────────────────────────────────────────── */}
      {LOCKED_PATTERNS.map((p) => (
        <a
          key={p.name}
          href="/pricing"
          className="w-full md:w-auto flex flex-col items-center gap-0.5 px-3 py-2 md:px-7 md:py-3 rounded-full border border-[rgba(255,255,255,0.18)] bg-transparent text-[rgba(255,255,255,0.60)] opacity-60 hover:opacity-80 hover:text-[rgba(255,255,255,0.85)] hover:border-[rgba(255,255,255,0.28)] transition-all duration-200"
        >
          <span
            className="[font-family:var(--font-jost)] text-[13px] md:text-[12px] tracking-[-0.01em] leading-none"
            style={{ display: "flex", alignItems: "center" }}
          >
            {p.name}
            <LockIcon />
          </span>
          {p.timing && (
            <span className="[font-family:var(--font-jost)] text-[10px] md:text-[9px] tracking-[0.14em] uppercase opacity-55 leading-none">
              {p.timing}
            </span>
          )}
        </a>
      ))}

    </div>
  );
}
