"use client";

import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type PhaseType = "inhale" | "hold-in" | "exhale" | "hold-out";

interface Phase {
  label: string;
  type: PhaseType;
  duration: number; // seconds
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PATTERNS: Record<string, Phase[]> = {
  box: [
    { label: "Inhale", type: "inhale",    duration: 4 },
    { label: "Hold",   type: "hold-in",   duration: 4 },
    { label: "Exhale", type: "exhale",    duration: 4 },
    { label: "Hold",   type: "hold-out",  duration: 4 },
  ],
  "478": [
    { label: "Inhale", type: "inhale",   duration: 4 },
    { label: "Hold",   type: "hold-in",  duration: 7 },
    { label: "Exhale", type: "exhale",   duration: 8 },
  ],
};

const TOTAL_CYCLES = 5;
const ORB_MIN      = 1.0;
const ORB_MAX      = 1.18;

// SVG geometry (all internal coords are in 240×240 space — viewBox handles scaling)
const SVG_SIZE   = 240;
const SVG_CENTER = 120;
const SESSION_R  = 128;
const SESSION_C  = 2 * Math.PI * SESSION_R; // ~741.4

type ActivePhase = PhaseType | "idle";

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  pattern: string;
  isRunning: boolean;
  onCycleChange: (cycle: number) => void;
  onComplete: () => void;
  onPhaseChange?: (phase: PhaseType | "idle", duration: number) => void;
  size?: number; // rendered px size, default 240
}

export default function BreathingOrb({
  pattern,
  isRunning,
  onCycleChange,
  onComplete,
  onPhaseChange,
  size = 240,
}: Props) {
  const sc = size / 240; // scale factor relative to canonical 240px

  const sessionRingRef  = useRef<SVGCircleElement>(null);
  const phaseRingRef    = useRef<SVGCircleElement>(null);
  const progressBeadRef = useRef<SVGGElement>(null);
  const isRunningRef    = useRef(false);
  const timeoutsRef     = useRef<number[]>([]);
  const onCycleChangeRef  = useRef(onCycleChange);
  const onCompleteRef     = useRef(onComplete);
  const onPhaseChangeRef  = useRef(onPhaseChange);
  const [activePhase,    setActivePhase]    = useState<ActivePhase>("idle");
  const [phaseDuration,  setPhaseDuration]  = useState(1.5);
  const [label,          setLabel]          = useState("");
  const [cycleLabel,     setCycleLabel]     = useState("");

  useEffect(() => {
    onCycleChangeRef.current   = onCycleChange;
    onCompleteRef.current      = onComplete;
    onPhaseChangeRef.current   = onPhaseChange;
  }, [onCycleChange, onComplete, onPhaseChange]);

  useEffect(() => {
    if (sessionRingRef.current) {
      sessionRingRef.current.style.stroke          = "rgba(190,250,255,0.5)";
      sessionRingRef.current.style.opacity         = "0";
      sessionRingRef.current.style.strokeDashoffset = `${SESSION_C}`;
    }
    if (phaseRingRef.current) {
      phaseRingRef.current.style.stroke          = "none";
      phaseRingRef.current.style.opacity         = "0";
      phaseRingRef.current.style.strokeDashoffset = `${SESSION_C}`;
    }
    if (progressBeadRef.current) {
      progressBeadRef.current.style.opacity   = "0";
      progressBeadRef.current.style.transform = "rotate(0deg)";
    }
  }, []);

  useEffect(() => {
    isRunningRef.current = isRunning;
    for (const timeout of timeoutsRef.current) window.clearTimeout(timeout);
    timeoutsRef.current = [];

    if (!isRunning) {
      onPhaseChangeRef.current?.("idle", 0);
      if (sessionRingRef.current) {
        sessionRingRef.current.style.transition       = "none";
        sessionRingRef.current.style.opacity          = "0";
        sessionRingRef.current.style.strokeDashoffset = `${SESSION_C}`;
      }
      if (progressBeadRef.current) {
        progressBeadRef.current.style.transition = "none";
        progressBeadRef.current.style.opacity    = "0";
        progressBeadRef.current.style.transform  = "rotate(0deg)";
      }
      return;
    }

    const phases          = PATTERNS[pattern];
    const sessionDuration = phases.reduce(
      (total, phase) => total + phase.duration, 0,
    ) * TOTAL_CYCLES;

    if (sessionRingRef.current) {
      sessionRingRef.current.style.transition       = "none";
      sessionRingRef.current.style.strokeDashoffset = `${SESSION_C}`;
      sessionRingRef.current.style.opacity          = "0.7";

      window.requestAnimationFrame(() => {
        if (!sessionRingRef.current || !isRunningRef.current) return;
        sessionRingRef.current.style.transition       = `stroke-dashoffset ${sessionDuration}s linear`;
        sessionRingRef.current.style.strokeDashoffset = "0";
      });
    }

    if (progressBeadRef.current) {
      progressBeadRef.current.style.transition = "none";
      progressBeadRef.current.style.opacity    = "0.9";
      progressBeadRef.current.style.transform  = "rotate(0deg)";

      window.requestAnimationFrame(() => {
        if (!progressBeadRef.current || !isRunningRef.current) return;
        progressBeadRef.current.style.transition = `transform ${sessionDuration}s linear`;
        progressBeadRef.current.style.transform  = "rotate(360deg)";
      });
    }

    const runPhase = (cycleIndex: number, phaseIndex: number) => {
      if (!isRunningRef.current) return;

      const phase = phases[phaseIndex];
      setActivePhase(phase.type);
      setPhaseDuration(phase.duration);
      setLabel(phase.label);
      setCycleLabel(`Cycle ${cycleIndex + 1} of ${TOTAL_CYCLES}`);
      onPhaseChangeRef.current?.(phase.type, phase.duration);

      const timeout = window.setTimeout(() => {
        if (!isRunningRef.current) return;

        const nextPhaseIndex = phaseIndex + 1;
        if (nextPhaseIndex < phases.length) {
          runPhase(cycleIndex, nextPhaseIndex);
          return;
        }

        const nextCycle = cycleIndex + 1;
        if (nextCycle < TOTAL_CYCLES) {
          onCycleChangeRef.current(nextCycle);
          runPhase(nextCycle, 0);
          return;
        }

        isRunningRef.current = false;
        setLabel("");
        onPhaseChangeRef.current?.("idle", 0);
        onCompleteRef.current();
      }, phase.duration * 1000);

      timeoutsRef.current.push(timeout);
    };

    onCycleChangeRef.current(0);
    runPhase(0, 0);

    return () => {
      isRunningRef.current = false;
      for (const timeout of timeoutsRef.current) window.clearTimeout(timeout);
      timeoutsRef.current = [];
      onPhaseChangeRef.current?.("idle", 0);
    };
  }, [isRunning, pattern]);

  const displayPhase      = isRunning ? activePhase   : "idle" as ActivePhase;
  const displayLabel      = isRunning ? label         : "";
  const displayCycleLabel = isRunning ? cycleLabel    : "";
  const displayDuration   = isRunning ? phaseDuration : 1.5;
  const orbScale          = displayPhase === "inhale" || displayPhase === "hold-in" ? ORB_MAX : ORB_MIN;
  const running           = isRunning && displayPhase !== "idle";
  const orbTransition     = `transform ${displayDuration}s ease-in-out, filter ${displayDuration}s ease-in-out`;

  // Brightness-breathing: sphere brightens on inhale, dims on exhale (all screens)
  // Range 0.85–1.35 keeps colour identity (below 0.80 ghosts on #090d14; above 1.40 washes out)
  const brightness =
    displayPhase === "inhale"   ? 1.35 :
    displayPhase === "hold-in"  ? 1.35 :
    displayPhase === "exhale"   ? 0.85 :
    displayPhase === "hold-out" ? 0.85 :
    /* idle */                    1.0;

  // Derived pixel sizes
  const innerPx  = Math.round(192 * sc); // orb sphere size
  const offsetPx = Math.round(24  * sc); // top/left offset

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col items-center gap-5 md:gap-8">

      {/* ── Orb stage ──────────────────────────────────────────────────── */}
      <div className="relative" style={{ width: size, height: size, overflow: "visible" }}>

        {/* Orb sphere — brightness() filter animates with phase (CSS sets solid-teal gradient) */}
        <div
          className="orb-idle absolute rounded-full z-10"
          style={{
            width:          `${innerPx}px`,
            height:         `${innerPx}px`,
            top:            `${offsetPx}px`,
            left:           `${offsetPx}px`,
            animation:      "none",
            filter:         `brightness(${brightness})`,
            transform:      `scale(${orbScale})`,
            transition:     orbTransition,
          }}
        />

        {/* Session progress ring — viewBox 0 0 240 240 so internal coords scale via width/height */}
        <svg
          className="absolute inset-0 z-20 -rotate-90 pointer-events-none"
          width={size}
          height={size}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          overflow="visible"
        >
          <circle
            cx={SVG_CENTER} cy={SVG_CENTER} r={SESSION_R}
            fill="none"
            stroke="rgba(180,245,250,0.16)"
            strokeWidth={1.25}
            strokeLinecap="round"
            opacity={0.9}
          />
          <circle
            ref={sessionRingRef}
            cx={SVG_CENTER} cy={SVG_CENTER} r={SESSION_R}
            fill="none"
            stroke="rgba(190,250,255,0.5)"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeDasharray={SESSION_C}
            strokeDashoffset={SESSION_C}
            opacity={0}
          />
          <circle
            ref={phaseRingRef}
            cx={SVG_CENTER} cy={SVG_CENTER} r={SESSION_R}
            fill="none"
            stroke="none"
            strokeWidth={1}
            strokeLinecap="round"
            strokeDasharray={SESSION_C}
            strokeDashoffset={SESSION_C}
            opacity={0}
          />
          <g
            ref={progressBeadRef}
            style={{
              opacity:         0,
              transformOrigin: `${SVG_CENTER}px ${SVG_CENTER}px`,
            }}
          >
            <circle
              cx={SVG_CENTER + SESSION_R}
              cy={SVG_CENTER}
              r={2.35}
              fill="rgba(210,252,255,0.96)"
              style={{ filter: "drop-shadow(0 0 4px rgba(190,250,255,0.52))" }}
            />
          </g>
        </svg>

        {/* Phase label */}
        <span
          className="breathing-phase-text absolute inset-0 z-30 flex items-center justify-center [font-family:var(--font-display)] italic font-light text-[22px] pointer-events-none select-none transition-opacity duration-[220ms] ease-in-out"
          style={{ opacity: running ? 0.88 : 0 }}
        >
          {displayLabel}
        </span>
      </div>

      {/* ── Cycle counter ──────────────────────────────────────────────── */}
      <p className="w-full text-center [font-family:var(--font-jost)] text-[11px] tracking-[0.22em] uppercase text-[rgba(180,235,245,0.78)] h-5">
        {displayCycleLabel}
      </p>
    </div>
  );
}
