import { type ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FamilyGroupProps {
  label:    string;
  cols:     1 | 2 | 3;
  children: ReactNode;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const GRID_CLASS: Record<1 | 2 | 3, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function FamilyGroup({ label, cols, children }: FamilyGroupProps) {
  return (
    <div>
      {/* Family label */}
      <div className="mb-3 md:mb-5 pb-0 md:pb-3 md:border-b md:border-[rgba(200,210,220,0.04)]">
        <p className="[font-family:var(--font-jost)] text-[10px] tracking-[0.26em] uppercase text-[rgba(200,210,220,0.65)]">
          {label}
        </p>
      </div>

      {/* Tool card grid */}
      <div className={`grid gap-3 ${GRID_CLASS[cols]}`}>
        {children}
      </div>
    </div>
  );
}
