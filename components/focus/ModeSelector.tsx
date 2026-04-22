"use client";

interface ModeSelectorProps {
  disabled: boolean;
}

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ marginLeft: "4px", flexShrink: 0 }}>
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function ModeSelector({ disabled }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-1.5 w-full max-w-[260px] mx-auto mb-1 md:flex md:flex-wrap md:justify-center md:max-w-none md:gap-3 md:mb-14">

      {/* Active free mode */}
      <button
        disabled={disabled}
        className="w-full md:w-auto flex flex-col items-center gap-0.5 px-2 py-1.5 md:px-7 md:py-3 rounded-full transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
        style={{
          background: "rgba(232,168,62,0.22)",
          border: "1px solid rgba(232,168,62,0.90)",
          color: "rgba(255,220,140,1.0)",
          boxShadow: "0 0 12px rgba(232,168,62,0.25)",
        }}
      >
        <span className="[font-family:var(--font-jost)] text-[10px] md:text-[12px] font-[500] tracking-[0.02em] leading-none">
          Pomodoro 25/5
        </span>
      </button>

      {/* Locked: Custom */}
      <a
        href="/pricing"
        className="w-full md:w-auto flex flex-col items-center gap-0.5 px-2 py-1.5 md:px-7 md:py-3 rounded-full transition-all duration-200 hover:opacity-90"
        style={{
          background: "transparent",
          border: "1px solid rgba(232,168,62,0.45)",
          color: "rgba(232,168,62,0.80)",
        }}
      >
        <span className="[font-family:var(--font-jost)] text-[10px] md:text-[12px] font-[400] tracking-[0.02em] leading-none" style={{ display: "flex", alignItems: "center" }}>
          Custom <LockIcon />
        </span>
      </a>

      {/* Locked: Deep Work */}
      <a
        href="/pricing"
        className="w-full md:w-auto flex flex-col items-center gap-0.5 px-2 py-1.5 md:px-7 md:py-3 rounded-full transition-all duration-200 hover:opacity-90"
        style={{
          background: "transparent",
          border: "1px solid rgba(232,168,62,0.45)",
          color: "rgba(232,168,62,0.80)",
        }}
      >
        <span className="[font-family:var(--font-jost)] text-[10px] md:text-[12px] font-[400] tracking-[0.02em] leading-none" style={{ display: "flex", alignItems: "center" }}>
          Deep Work <LockIcon />
        </span>
      </a>

      {/* Locked: Flow */}
      <a
        href="/pricing"
        className="w-full md:w-auto flex flex-col items-center gap-0.5 px-2 py-1.5 md:px-7 md:py-3 rounded-full transition-all duration-200 hover:opacity-90"
        style={{
          background: "transparent",
          border: "1px solid rgba(232,168,62,0.45)",
          color: "rgba(232,168,62,0.80)",
        }}
      >
        <span className="[font-family:var(--font-jost)] text-[10px] md:text-[12px] font-[400] tracking-[0.02em] leading-none" style={{ display: "flex", alignItems: "center" }}>
          Flow <LockIcon />
        </span>
      </a>

    </div>
  );
}
