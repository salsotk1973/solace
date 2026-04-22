"use client";

import { Lock } from "lucide-react";

interface ModeSelectorProps {
  disabled: boolean;
}

// Free tier — only one mode for now.
// Locked pills signal paid tier without linking to pricing.
export default function ModeSelector({ disabled }: ModeSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-6">
      {/* Free: active */}
      <button
        disabled={disabled}
        className="flex flex-col items-center gap-0.5 px-7 py-3 rounded-full border border-[rgba(255,200,120,0.55)] bg-[rgba(240,170,70,0.06)] text-[rgba(255,200,120,0.9)] disabled:cursor-not-allowed transition-all duration-300"
      >
        <span className="[font-family:var(--font-jost)] text-[12px] font-[400] tracking-[-0.01em]">
          Pomodoro 25/5
        </span>
      </button>

      {/* Paid: Custom */}
      <button
        disabled
        className="flex flex-col items-center gap-0.5 px-7 py-3 rounded-full border border-[rgba(255,255,255,0.04)] text-[rgba(130,140,150,0.28)] cursor-default opacity-30"
      >
        <span className="[font-family:var(--font-jost)] flex items-center gap-1.5 text-[12px] tracking-[-0.01em]">
          <Lock size={9} className="opacity-60" />
          Custom
        </span>
      </button>

      {/* Paid: Deep Work */}
      <button
        disabled
        className="flex flex-col items-center gap-0.5 px-7 py-3 rounded-full border border-[rgba(255,255,255,0.04)] text-[rgba(130,140,150,0.28)] cursor-default opacity-30"
      >
        <span className="[font-family:var(--font-jost)] flex items-center gap-1.5 text-[12px] tracking-[-0.01em]">
          <Lock size={9} className="opacity-60" />
          Deep Work
        </span>
      </button>
    </div>
  );
}
