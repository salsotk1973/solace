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
      width="9"
      height="9"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ marginLeft: "3px", opacity: 0.5, flexShrink: 0 }}
    >
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function PatternSelector({ selected, onChange, disabled }: PatternSelectorProps) {
  // Active teal colour — matches CATEGORY_COLOURS.calm
  const TEAL_BORDER_ACTIVE = "rgba(60,192,212,0.65)";
  const TEAL_BG_ACTIVE     = "rgba(60,192,212,0.12)";
  const TEAL_TEXT_ACTIVE   = "rgba(60,192,212,0.95)";
  const TEAL_BORDER_REST   = "rgba(60,192,212,0.30)";
  const TEAL_TEXT_REST     = "rgba(60,192,212,0.55)";
  const TEAL_BORDER_LOCKED = "rgba(60,192,212,0.20)";
  const TEAL_TEXT_LOCKED   = "rgba(60,192,212,0.40)";

  return (
    <div className="grid grid-cols-2 gap-1.5 w-full max-w-[280px] mx-auto mb-2 md:flex md:flex-wrap md:justify-center md:max-w-none md:gap-3 md:mb-14">

      {/* ── Free patterns ── */}
      {FREE_PATTERNS.map((p) => {
        const active = selected === p.id;
        return (
          <button
            key={p.id}
            onClick={() => !disabled && onChange(p.id)}
            disabled={disabled}
            className="w-full md:w-auto flex flex-col items-center gap-0.5 px-2 py-1 md:px-7 md:py-3 rounded-full border transition-all duration-300 disabled:cursor-not-allowed"
            style={{
              borderColor: active ? TEAL_BORDER_ACTIVE : TEAL_BORDER_REST,
              background:  active ? TEAL_BG_ACTIVE     : "rgba(60,192,212,0.04)",
              color:       active ? TEAL_TEXT_ACTIVE   : TEAL_TEXT_REST,
            }}
          >
            <span className="[font-family:var(--font-jost)] text-[10px] md:text-[12px] font-[400] tracking-[-0.01em] leading-none">
              {p.name}
            </span>
            <span className="[font-family:var(--font-jost)] text-[8px] md:text-[9px] tracking-[0.14em] uppercase opacity-55 leading-none">
              {p.timing}
            </span>
          </button>
        );
      })}

      {/* ── Locked patterns ── */}
      {LOCKED_PATTERNS.map((p) => (
        <a
          key={p.name}
          href="/pricing"
          className="w-full md:w-auto flex flex-col items-center gap-0.5 px-2 py-1 md:px-7 md:py-3 rounded-full border transition-all duration-200 hover:opacity-80"
          style={{
            borderColor: TEAL_BORDER_LOCKED,
            background:  "transparent",
            color:       TEAL_TEXT_LOCKED,
          }}
        >
          <span
            className="[font-family:var(--font-jost)] text-[10px] md:text-[12px] tracking-[-0.01em] leading-none"
            style={{ display: "flex", alignItems: "center" }}
          >
            {p.name}
            <LockIcon />
          </span>
          {p.timing && (
            <span className="[font-family:var(--font-jost)] text-[8px] md:text-[9px] tracking-[0.14em] uppercase opacity-55 leading-none">
              {p.timing}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}
