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

// SVG geometry
const SVG_SIZE   = 240;
const SVG_CENTER = 120;
const SESSION_R  = 128;
const SESSION_C  = 2 * Math.PI * SESSION_R; // ~741.4

type ActivePhase = PhaseType | "idle";

const GLOW_MIN_SCALE = 1.05;
const GLOW_MAX_SCALE = 1.3;
const GLOW_MIN_OPACITY = 0.28;
const GLOW_MAX_OPACITY = 0.46;

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  pattern: string;
  isRunning: boolean;
  onCycleChange: (cycle: number) => void;
  onComplete: () => void;
  onPhaseChange?: (phase: PhaseType | "idle", duration: number) => void;
}

export default function BreathingOrb({
  pattern,
  isRunning,
  onCycleChange,
  onComplete,
  onPhaseChange,
}: Props) {
  const sessionRingRef = useRef<SVGCircleElement>(null);
  const phaseRingRef   = useRef<SVGCircleElement>(null);
  const progressBeadRef = useRef<SVGGElement>(null);
  const isRunningRef   = useRef(false);
  const timeoutsRef    = useRef<number[]>([]);
  const onCycleChangeRef = useRef(onCycleChange);
  const onCompleteRef = useRef(onComplete);
  const onPhaseChangeRef = useRef(onPhaseChange);
  const [activePhase, setActivePhase] = useState<ActivePhase>("idle");
  const [phaseDuration, setPhaseDuration] = useState(1.5);
  const [label, setLabel] = useState("");
  const [cycleLabel, setCycleLabel] = useState("");

  useEffect(() => {
    onCycleChangeRef.current = onCycleChange;
    onCompleteRef.current = onComplete;
    onPhaseChangeRef.current = onPhaseChange;
  }, [onCycleChange, onComplete, onPhaseChange]);

  useEffect(() => {
    if (sessionRingRef.current) {
      sessionRingRef.current.style.stroke = "rgba(190,250,255,0.5)";
      sessionRingRef.current.style.opacity = "0";
      sessionRingRef.current.style.strokeDashoffset = `${SESSION_C}`;
    }
    if (phaseRingRef.current) {
      phaseRingRef.current.style.stroke = "none";
      phaseRingRef.current.style.opacity = "0";
      phaseRingRef.current.style.strokeDashoffset = `${SESSION_C}`;
    }
    if (progressBeadRef.current) {
      progressBeadRef.current.style.opacity = "0";
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
        sessionRingRef.current.style.transition = "none";
        sessionRingRef.current.style.opacity = "0";
        sessionRingRef.current.style.strokeDashoffset = `${SESSION_C}`;
      }
      if (progressBeadRef.current) {
        progressBeadRef.current.style.transition = "none";
        progressBeadRef.current.style.opacity = "0";
        progressBeadRef.current.style.transform = "rotate(0deg)";
      }
      return;
    }

    const phases = PATTERNS[pattern];
    const sessionDuration = phases.reduce(
      (total, phase) => total + phase.duration,
      0,
    ) * TOTAL_CYCLES;

    if (sessionRingRef.current) {
      sessionRingRef.current.style.transition = "none";
      sessionRingRef.current.style.strokeDashoffset = `${SESSION_C}`;
      sessionRingRef.current.style.opacity = "0.7";

      window.requestAnimationFrame(() => {
        if (!sessionRingRef.current || !isRunningRef.current) return;
        sessionRingRef.current.style.transition = `stroke-dashoffset ${sessionDuration}s linear`;
        sessionRingRef.current.style.strokeDashoffset = "0";
      });
    }

    if (progressBeadRef.current) {
      progressBeadRef.current.style.transition = "none";
      progressBeadRef.current.style.opacity = "0.9";
      progressBeadRef.current.style.transform = "rotate(0deg)";

      window.requestAnimationFrame(() => {
        if (!progressBeadRef.current || !isRunningRef.current) return;
        progressBeadRef.current.style.transition = `transform ${sessionDuration}s linear`;
        progressBeadRef.current.style.transform = "rotate(360deg)";
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

  const displayPhase: ActivePhase = isRunning ? activePhase : "idle";
  const displayLabel = isRunning ? label : "";
  const displayCycleLabel = isRunning ? cycleLabel : "";
  const displayDuration = isRunning ? phaseDuration : 1.5;
  const orbScale = displayPhase === "inhale" || displayPhase === "hold-in" ? ORB_MAX : ORB_MIN;
  const glowActive = displayPhase === "inhale" || displayPhase === "hold-in";
  const running = isRunning && displayPhase !== "idle";
  const orbTransition = `transform ${displayDuration}s ease-in-out, filter ${displayDuration}s ease-in-out`;
  const orbAnimation = "none";
  const glowScale = glowActive ? GLOW_MAX_SCALE : GLOW_MIN_SCALE;
  const glowOpacity = glowActive ? GLOW_MAX_OPACITY : GLOW_MIN_OPACITY;

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col items-center gap-5">

      {/* ── Orb stage ──────────────────────────────────────────────────── */}
      <div className="relative w-[240px] h-[240px]">
        {/* Base glow layer */}
        <div
          className="absolute z-0 rounded-full pointer-events-none"
          style={{
            animation: "none",
            width: "192px",
            height: "192px",
            left: "24px",
            top: "24px",
            background: "rgba(45, 212, 191, 0.55)",
            filter: "blur(42px)",
            opacity: glowOpacity,
            transform: `scale(${glowScale})`,
            transformOrigin: "center",
            transition: `opacity ${displayDuration}s ease-in-out, transform ${displayDuration}s ease-in-out`,
          }}
        />

        {/* Orb sphere */}
        <div
          className="orb-idle absolute w-[192px] h-[192px] rounded-full top-[24px] left-[24px] z-10 bg-[radial-gradient(circle_at_50%_44%,rgba(148,248,239,0.36)_0%,rgba(92,222,211,0.22)_38%,rgba(45,150,150,0.14)_72%,rgba(22,82,96,0.12)_100%)]"
          style={{
            animation: orbAnimation,
            filter: displayPhase === "exhale" ? "blur(0px)" : "none",
            transform: `scale(${orbScale})`,
            transition: orbTransition,
          }}
        />

        {/* Session progress ring — rotated so arc starts from top (12 o'clock) */}
        <svg
          className="absolute inset-0 z-20 -rotate-90 pointer-events-none"
          width={SVG_SIZE}
          height={SVG_SIZE}
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
              opacity: 0,
              transformOrigin: `${SVG_CENTER}px ${SVG_CENTER}px`,
            }}
          >
            <circle
              cx={SVG_CENTER + SESSION_R}
              cy={SVG_CENTER}
              r={2.35}
              fill="rgba(210,252,255,0.96)"
              style={{
                filter: "drop-shadow(0 0 4px rgba(190,250,255,0.52))",
              }}
            />
          </g>
        </svg>

        {/* Phase label */}
        <span
          className="absolute inset-0 z-30 flex items-center justify-center [font-family:var(--font-display)] italic font-light text-[22px] text-[rgba(180,235,245,0.88)] pointer-events-none select-none transition-opacity duration-[220ms] ease-in-out opacity-0"
          style={{ opacity: running ? 0.88 : 0 }}
        >
          {displayLabel}
        </span>
      </div>

      {/* ── Cycle counter ──────────────────────────────────────────────── */}
      <p
        className="[font-family:var(--font-jost)] text-[10px] tracking-[0.22em] uppercase text-[rgba(100,190,210,0.38)] h-4"
      >
        {displayCycleLabel}
      </p>
    </div>
  );
}
