"use client";

import { forwardRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

// viewBox 228×228, radius 108, centred at 114 114
// Circumference: 2π × 108 ≈ 678.6
export const RING_CIRCUMFERENCE = 678.6;

// ─── Component ────────────────────────────────────────────────────────────────

// Exposes the fill <circle> element via forwardRef so the parent RAF loop
// can update strokeDashoffset and opacity directly — no React re-renders.
const ProgressRing = forwardRef<SVGCircleElement>(function ProgressRing(_, ref) {
  return (
    <svg
      className="absolute inset-0 -rotate-90 pointer-events-none"
      width={228}
      height={228}
      viewBox="0 0 228 228"
    >
      {/* Track */}
      <circle
        cx={114}
        cy={114}
        r={108}
        fill="none"
        stroke="rgba(200,210,220,0.04)"
        strokeWidth={1}
      />
      {/* Fill — RAF-driven dashoffset */}
      <circle
        ref={ref}
        cx={114}
        cy={114}
        r={108}
        fill="none"
        stroke="rgba(140,120,210,0.25)"
        strokeWidth={1}
        strokeLinecap="round"
        strokeDasharray={RING_CIRCUMFERENCE}
        strokeDashoffset={RING_CIRCUMFERENCE}
      />
    </svg>
  );
});

ProgressRing.displayName = "ProgressRing";
export default ProgressRing;
