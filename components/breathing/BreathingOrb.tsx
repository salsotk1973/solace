"use client";

import { useEffect, useRef } from "react";

type PhaseType = "inhale" | "hold-in" | "exhale" | "hold-out";

interface Phase {
  label: string;
  type:  PhaseType;
  duration: number;
}

const PATTERNS: Record<string, Phase[]> = {
  box: [
    { label: "Inhale", type: "inhale",   duration: 4 },
    { label: "Hold",   type: "hold-in",  duration: 4 },
    { label: "Exhale", type: "exhale",   duration: 4 },
    { label: "Hold",   type: "hold-out", duration: 4 },
  ],
  "478": [
    { label: "Inhale", type: "inhale",   duration: 4 },
    { label: "Hold",   type: "hold-in",  duration: 7 },
    { label: "Exhale", type: "exhale",   duration: 8 },
  ],
};

const TOTAL_CYCLES = 5;
const SVG_SIZE     = 240;
const SVG_CENTER   = 120;
const SESSION_R    = 128;
const SESSION_C    = 2 * Math.PI * SESSION_R;

interface Props {
  pattern:       string;
  isRunning:     boolean;
  onCycleChange: (cycle: number) => void;
  onComplete:    () => void;
  onPhaseChange?: (phase: PhaseType | "idle", duration: number) => void;
  size?:         number;
}

export default function BreathingOrb({
  pattern,
  isRunning,
  onCycleChange,
  onComplete,
  onPhaseChange,
  size = 240,
}: Props) {
  const sc = size / 240;

  // Refs for direct DOM control — React never animates these
  const stageRef        = useRef<HTMLDivElement>(null);
  const glowRef         = useRef<HTMLDivElement>(null);
  const orbRef          = useRef<HTMLDivElement>(null);
  const labelRef        = useRef<HTMLSpanElement>(null);
  const cycleRef        = useRef<HTMLParagraphElement>(null);
  const sessionRingRef  = useRef<SVGCircleElement>(null);
  const progressBeadRef = useRef<SVGGElement>(null);

  // Non-state refs for session control
  const isRunningRef     = useRef(false);
  const timeoutsRef      = useRef<number[]>([]);
  const onCycleChangeRef = useRef(onCycleChange);
  const onCompleteRef    = useRef(onComplete);
  const onPhaseChangeRef = useRef(onPhaseChange);

  useEffect(() => {
    onCycleChangeRef.current = onCycleChange;
    onCompleteRef.current    = onComplete;
    onPhaseChangeRef.current = onPhaseChange;
  }, [onCycleChange, onComplete, onPhaseChange]);

  const innerPx  = Math.round(192 * sc);
  const offsetPx = Math.round(24 * sc);
  const blurPx   = Math.round(38 * sc);

  useEffect(() => {
    isRunningRef.current = isRunning;
    for (const t of timeoutsRef.current) window.clearTimeout(t);
    timeoutsRef.current = [];

    const glow  = glowRef.current;
    const orb   = orbRef.current;
    const label = labelRef.current;
    const cycle = cycleRef.current;
    const ring  = sessionRingRef.current;
    const bead  = progressBeadRef.current;

    if (!glow || !orb) return;

    if (!isRunning) {
      onPhaseChangeRef.current?.("idle", 0);

      // Instant reset — no transition
      glow.style.transition  = "none";
      glow.style.opacity     = "0.28";
      glow.style.transform   = "scale(1.0)";
      orb.style.transition   = "none";
      orb.style.transform    = "scale(1.0)";
      if (label) { label.style.opacity = "0"; label.textContent = ""; }
      if (cycle) cycle.textContent = "";

      if (ring) {
        ring.style.transition       = "none";
        ring.style.opacity          = "0";
        ring.style.strokeDashoffset = String(SESSION_C);
      }
      if (bead) {
        bead.style.transition = "none";
        bead.style.opacity    = "0";
        bead.style.transform  = "rotate(0deg)";
      }
      return;
    }

    // ── Session started ──────────────────────────────────────────────
    const phases          = PATTERNS[pattern];
    const sessionDuration = phases.reduce((t, p) => t + p.duration, 0) * TOTAL_CYCLES;

    // Session ring
    if (ring) {
      ring.style.transition       = "none";
      ring.style.strokeDashoffset = String(SESSION_C);
      ring.style.opacity          = "0.7";
      requestAnimationFrame(() => {
        if (!ring || !isRunningRef.current) return;
        ring.style.transition       = `stroke-dashoffset ${sessionDuration}s linear`;
        ring.style.strokeDashoffset = "0";
      });
    }

    // Progress bead
    if (bead) {
      bead.style.transition = "none";
      bead.style.opacity    = "0.9";
      bead.style.transform  = "rotate(0deg)";
      requestAnimationFrame(() => {
        if (!bead || !isRunningRef.current) return;
        bead.style.transition = `transform ${sessionDuration}s linear`;
        bead.style.transform  = "rotate(360deg)";
      });
    }

    function applyPhase(phase: Phase) {
      if (!glow || !orb) return;
      const active = phase.type === "inhale" || phase.type === "hold-in";
      const dur    = phase.duration;

      // Glow
      glow.style.transition = `opacity ${dur}s ease-in-out, transform ${dur}s ease-in-out`;
      glow.style.opacity    = active ? "0.55" : "0.28";
      glow.style.transform  = active ? "scale(1.22)" : "scale(1.0)";

      // Orb
      orb.style.transition = `transform ${dur}s ease-in-out`;
      orb.style.transform  = active ? "scale(1.18)" : "scale(1.0)";

      // Label
      if (label) {
        label.textContent      = phase.label;
        label.style.opacity    = "0.88";
        label.style.transition = "opacity 220ms ease-in-out";
      }
    }

    function runPhase(cycleIndex: number, phaseIndex: number) {
      if (!isRunningRef.current) return;
      const phase = phases[phaseIndex];

      applyPhase(phase);
      if (cycle) cycle.textContent = `Cycle ${cycleIndex + 1} of ${TOTAL_CYCLES}`;
      onPhaseChangeRef.current?.(phase.type, phase.duration);

      const timeout = window.setTimeout(() => {
        if (!isRunningRef.current) return;
        const nextPhase = phaseIndex + 1;
        if (nextPhase < phases.length) {
          runPhase(cycleIndex, nextPhase);
          return;
        }
        const nextCycle = cycleIndex + 1;
        if (nextCycle < TOTAL_CYCLES) {
          onCycleChangeRef.current(nextCycle);
          runPhase(nextCycle, 0);
          return;
        }
        // Session complete
        isRunningRef.current = false;
        if (label) { label.style.opacity = "0"; label.textContent = ""; }
        onPhaseChangeRef.current?.("idle", 0);
        onCompleteRef.current();
      }, phase.duration * 1000);

      timeoutsRef.current.push(timeout);
    }

    onCycleChangeRef.current(0);
    runPhase(0, 0);

    return () => {
      isRunningRef.current = false;
      for (const t of timeoutsRef.current) window.clearTimeout(t);
      timeoutsRef.current = [];
      onPhaseChangeRef.current?.("idle", 0);
    };
  }, [isRunning, pattern]);

  return (
    <div className="flex flex-col items-center gap-5 md:gap-8">
      <div
        ref={stageRef}
        className="relative"
        style={{ width: size, height: size, overflow: "visible" }}
      >
        {/* Glow — full stage size, no animated props in JSX */}
        <div
          ref={glowRef}
          className="absolute z-0 rounded-full pointer-events-none"
          style={{
            width:           size,
            height:          size,
            left:            0,
            top:             0,
            background:      "rgba(45,212,191,0.55)",
            filter:          `blur(${blurPx}px)`,
            transformOrigin: "center",
            opacity:         0.28,
            transform:       "scale(1.0)",
          }}
        />

        {/* Orb sphere — no animated props in JSX */}
        <div
          ref={orbRef}
          className="orb-idle absolute rounded-full z-10 bg-[radial-gradient(circle_at_50%_44%,rgba(80,190,185,0.22)_0%,rgba(42,140,140,0.16)_38%,rgba(18,82,90,0.13)_72%,rgba(8,40,52,0.11)_100%)]"
          style={{
            width:           innerPx,
            height:          innerPx,
            top:             offsetPx,
            left:            offsetPx,
            transformOrigin: "center",
            transform:       "scale(1.0)",
          }}
        />

        {/* Session ring */}
        <svg
          className="absolute inset-0 z-20 -rotate-90 pointer-events-none"
          width={size}
          height={size}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          overflow="visible"
        >
          <circle
            cx={SVG_CENTER} cy={SVG_CENTER} r={SESSION_R}
            fill="none" stroke="rgba(180,245,250,0.16)"
            strokeWidth={1.25} strokeLinecap="round" opacity={0.9}
          />
          <circle
            ref={sessionRingRef}
            cx={SVG_CENTER} cy={SVG_CENTER} r={SESSION_R}
            fill="none" stroke="rgba(190,250,255,0.5)"
            strokeWidth={1.75} strokeLinecap="round"
            strokeDasharray={SESSION_C} strokeDashoffset={SESSION_C}
            opacity={0}
          />
          <g
            ref={progressBeadRef}
            style={{ opacity: 0, transformOrigin: `${SVG_CENTER}px ${SVG_CENTER}px` }}
          >
            <circle
              cx={SVG_CENTER + SESSION_R} cy={SVG_CENTER} r={2.35}
              fill="rgba(210,252,255,0.96)"
              style={{ filter: "drop-shadow(0 0 4px rgba(190,250,255,0.52))" }}
            />
          </g>
        </svg>

        {/* Phase label */}
        <span
          ref={labelRef}
          className="absolute inset-0 z-30 flex items-center justify-center [font-family:var(--font-display)] italic font-light text-[22px] text-[rgba(180,235,245,0.88)] pointer-events-none select-none"
          style={{ opacity: 0 }}
        />
      </div>

      {/* Cycle counter */}
      <p
        ref={cycleRef}
        className="w-full text-center [font-family:var(--font-jost)] text-[10px] tracking-[0.22em] uppercase text-[rgba(100,190,210,0.38)] h-4"
      />
    </div>
  );
}
