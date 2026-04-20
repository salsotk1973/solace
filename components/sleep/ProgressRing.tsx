"use client";

import { forwardRef } from "react";

// viewBox 228×228, radius 108 — Sleep orb is 228px vs Breathing's 240px
export const RING_CIRCUMFERENCE = 678.6; // 2π × 108

// Expose array ref: [0] = fill circle, [1] = bead group
interface ProgressRingProps { size?: number; }

const ProgressRing = forwardRef<(SVGCircleElement | SVGGElement | null)[], ProgressRingProps>(
  function ProgressRing({ size = 228 }, ref) {
    function setRingRef(el: SVGCircleElement | null) {
      if (ref && typeof ref === "object" && ref.current) {
        (ref.current as (SVGCircleElement | SVGGElement | null)[])[0] = el;
      }
    }
    function setBeadRef(el: SVGGElement | null) {
      if (ref && typeof ref === "object" && ref.current) {
        (ref.current as (SVGCircleElement | SVGGElement | null)[])[1] = el;
      }
    }

    return (
      <svg
        className="absolute inset-0 -rotate-90 pointer-events-none"
        width={size}
        height={size}
        viewBox="0 0 228 228"
        overflow="visible"
      >
        {/* Track — exact same style as Breathing */}
        <circle
          cx={114} cy={114} r={108}
          fill="none"
          stroke="rgba(180,245,250,0.16)"
          strokeWidth={1.25}
          strokeLinecap="round"
          opacity={0.9}
        />
        {/* Fill — teal, exact same style as Breathing */}
        <circle
          ref={setRingRef}
          cx={114} cy={114} r={108}
          fill="none"
          stroke="rgba(190,250,255,0.5)"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={RING_CIRCUMFERENCE}
          opacity={0}
        />
        {/* Bead — exact same as Breathing */}
        <g
          ref={setBeadRef}
          style={{ opacity: 0, transformOrigin: "114px 114px" }}
        >
          <circle
            cx={114 + 108} cy={114} r={2.35}
            fill="rgba(210,252,255,0.96)"
            style={{ filter: "drop-shadow(0 0 4px rgba(190,250,255,0.52))" }}
          />
        </g>
      </svg>
    );
  }
);

ProgressRing.displayName = "ProgressRing";
export default ProgressRing;
