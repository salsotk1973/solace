"use client";

import { useEffect, useRef, useState } from "react";

type PhaseType = "inhale" | "hold-in" | "exhale" | "hold-out";

interface Phase {
  label: string;
  type: PhaseType;
  duration: number;
}

const PATTERNS: Record<string, Phase[]> = {
  box: [
    { label: "Inhale",  type: "inhale",    duration: 4 },
    { label: "Hold",    type: "hold-in",   duration: 4 },
    { label: "Exhale",  type: "exhale",    duration: 4 },
    { label: "Hold",    type: "hold-out",  duration: 4 },
  ],
  "478": [
    { label: "Inhale",  type: "inhale",    duration: 4 },
    { label: "Hold",    type: "hold-in",   duration: 7 },
    { label: "Exhale",  type: "exhale",    duration: 8 },
  ],
};

const TOTAL_CYCLES  = 5;
const ORB_MIN       = 1.0;
const ORB_MAX       = 1.18;
const SVG_SIZE      = 240;
const SVG_CENTER    = 120;
const SESSION_R     = 128;
const SESSION_C     = 2 * Math.PI * SESSION_R;

// Glow: full-size so blur extends equally in all directions
const GLOW_MIN_OPACITY = 0.28;
const GLOW_MAX_OPACITY = 0.55;
const GLOW_MIN_SCALE   = 1.0;
const GLOW_MAX_SCALE   = 1.22;

type ActivePhase = PhaseType | "idle";

interface Props {
  pattern: string;
  isRunning: boolean;
  onCycleChange: (cycle: number) => void;
  onComplete: () => void;
  onPhaseChange?: (phase: PhaseType | "idle", duration: number) => void;
  size?: number;
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

  const sessionRingRef  = useRef<SVGCircleElement>(null);
  const progressBeadRef = useRef<SVGGElement>(null);
  const glowRef         = useRef<HTMLDivElement>(null);
  const orbRef          = useRef<HTMLDivElement>(null);
  const labelRef        = useRef<HTMLSpanElement>(null);
  const cycleRef        = useRef<HTMLParagraphElement>(null);

  const isRunningRef       = useRef(false);
  const timeoutsRef        = useRef<number[]>([]);
  const onCycleChangeRef   = useRef(onCycleChange);
  const onCompleteRef      = useRef(onComplete);
  const onPhaseChangeRef   = useRef(onPhaseChange);

  // Only React state for label visibility (opacity toggle — not animation)
  const [running, setRunning] = useState(false);

  useEffect(() => {
    onCycleChangeRef.current = onCycleChange;
    onCompleteRef.current    = onComplete;
    onPhaseChangeRef.current = onPhaseChange;
  }, [onCycleChange, onComplete, onPhaseChange]);

  // ── Mount: set initial animated values imperatively (React must not own these) ──
  useEffect(() => {
    if (glowRef.current) {
      glowRef.current.style.opacity         = String(GLOW_MIN_OPACITY);
      glowRef.current.style.transform       = `scale(${GLOW_MIN_SCALE})`;
      glowRef.current.style.transition      = "none";
    }
    if (orbRef.current) {
      orbRef.current.style.transform       = "scale(1)";
      orbRef.current.style.transition      = "none";
    }
  }, []);

  // ── Session ring + bead initialisation ───────────────────────────────
  useEffect(() => {
    if (sessionRingRef.current) {
      sessionRingRef.current.style.opacity          = "0";
      sessionRingRef.current.style.strokeDashoffset = String(SESSION_C);
    }
    if (progressBeadRef.current) {
      progressBeadRef.current.style.opacity   = "0";
      progressBeadRef.current.style.transform = "rotate(0deg)";
    }
  }, []);

  useEffect(() => {
    isRunningRef.current = isRunning;
    for (const t of timeoutsRef.current) window.clearTimeout(t);
    timeoutsRef.current = [];

    if (!isRunning) {
      onPhaseChangeRef.current?.("idle", 0);
      setRunning(false);

      // Reset glow
      if (glowRef.current) {
        glowRef.current.style.transition = "none";
        glowRef.current.style.opacity    = String(GLOW_MIN_OPACITY);
        glowRef.current.style.transform  = `scale(${GLOW_MIN_SCALE})`;
      }
      // Reset orb
      if (orbRef.current) {
        orbRef.current.style.transition = "none";
        orbRef.current.style.transform  = "scale(1)";
      }
      // Clear text refs
      if (labelRef.current) labelRef.current.textContent = "";
      if (cycleRef.current) cycleRef.current.textContent = "";

      if (sessionRingRef.current) {
        sessionRingRef.current.style.transition       = "none";
        sessionRingRef.current.style.opacity          = "0";
        sessionRingRef.current.style.strokeDashoffset = String(SESSION_C);
      }
      if (progressBeadRef.current) {
        progressBeadRef.current.style.transition = "none";
        progressBeadRef.current.style.opacity    = "0";
        progressBeadRef.current.style.transform  = "rotate(0deg)";
      }
      return;
    }

    setRunning(true);

    const phases          = PATTERNS[pattern];
    const sessionDuration = phases.reduce((t, p) => t + p.duration, 0) * TOTAL_CYCLES;

    if (sessionRingRef.current) {
      sessionRingRef.current.style.transition       = "none";
      sessionRingRef.current.style.strokeDashoffset = String(SESSION_C);
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

    // applyPhase defined INSIDE the effect so it reads refs fresh every call
    function applyPhase(phase: Phase) {
      const active = phase.type === "inhale" || phase.type === "hold-in";
      const dur    = phase.duration;

      if (glowRef.current) {
        glowRef.current.style.transition = `opacity ${dur}s ease-in-out, transform ${dur}s ease-in-out`;
        glowRef.current.style.opacity    = active ? String(GLOW_MAX_OPACITY) : String(GLOW_MIN_OPACITY);
        glowRef.current.style.transform  = `scale(${active ? GLOW_MAX_SCALE : GLOW_MIN_SCALE})`;
      }
      if (orbRef.current) {
        orbRef.current.style.transition = `transform ${dur}s ease-in-out`;
        orbRef.current.style.transform  = `scale(${active ? ORB_MAX : ORB_MIN})`;
      }
      if (labelRef.current) {
        labelRef.current.textContent = phase.label;
      }
    }

    const runPhase = (cycleIndex: number, phaseIndex: number) => {
      if (!isRunningRef.current) return;
      const phase = phases[phaseIndex];

      applyPhase(phase);

      if (cycleRef.current) {
        cycleRef.current.textContent = `Cycle ${cycleIndex + 1} of ${TOTAL_CYCLES}`;
      }
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
        isRunningRef.current = false;
        if (labelRef.current) labelRef.current.textContent = "";
        onPhaseChangeRef.current?.("idle", 0);
        onCompleteRef.current();
      }, phase.duration * 1000);

      timeoutsRef.current.push(timeout);
    };

    onCycleChangeRef.current(0);
    runPhase(0, 0);

    return () => {
      isRunningRef.current = false;
      for (const t of timeoutsRef.current) window.clearTimeout(t);
      timeoutsRef.current = [];
      onPhaseChangeRef.current?.("idle", 0);
    };
  }, [isRunning, pattern]);

  // Derived pixel sizes
  const innerPx  = Math.round(192 * sc);  // orb sphere size
  const offsetPx = Math.round(24 * sc);   // orb offset within stage

  return (
    <div className="flex flex-col items-center gap-5 md:gap-8">
      {/* ── Orb stage ─────────────────────────────────────────── */}
      <div className="relative" style={{ width: size, height: size, overflow: "visible" }}>

        {/* Glow — FULL stage size so blur extends equally in all directions */}
        <div
          ref={glowRef}
          className="absolute z-0 rounded-full pointer-events-none"
          style={{
            width:           `${size}px`,
            height:          `${size}px`,
            left:            "0px",
            top:             "0px",
            background:      "rgba(45, 212, 191, 0.55)",
            filter:          `blur(${Math.round(38 * sc)}px)`,
            transformOrigin: "center",
          }}
        />

        {/* Orb sphere */}
        <div
          ref={orbRef}
          className="orb-idle absolute rounded-full z-10 bg-[radial-gradient(circle_at_50%_44%,rgba(80,190,185,0.22)_0%,rgba(42,140,140,0.16)_38%,rgba(18,82,90,0.13)_72%,rgba(8,40,52,0.11)_100%)]"
          style={{
            width:           `${innerPx}px`,
            height:          `${innerPx}px`,
            top:             `${offsetPx}px`,
            left:            `${offsetPx}px`,
            transformOrigin: "center",
          }}
        />

        {/* Session progress ring */}
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

        {/* Phase label — direct DOM ref, no React state */}
        <span
          ref={labelRef}
          className="absolute inset-0 z-30 flex items-center justify-center [font-family:var(--font-display)] italic font-light text-[22px] text-[rgba(180,235,245,0.88)] pointer-events-none select-none"
          style={{ opacity: running ? 0.88 : 0, transition: "opacity 220ms ease-in-out" }}
        />
      </div>

      {/* Cycle counter — direct DOM ref */}
      <p
        ref={cycleRef}
        className="w-full text-center [font-family:var(--font-jost)] text-[10px] tracking-[0.22em] uppercase text-[rgba(100,190,210,0.38)] h-4"
      />
    </div>
  );
}
