"use client";

import { useEffect, useRef, useCallback } from "react";

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
const ORB_MAX      = 1.22;

// SVG geometry
const SVG_SIZE   = 240;
const SVG_CENTER = 120;
const SESSION_R  = 90;
const PHASE_R    = 104;
const SESSION_C  = 2 * Math.PI * SESSION_R; // ~565.5
const PHASE_C    = 2 * Math.PI * PHASE_R;   // ~653.5

// ─── Helpers ──────────────────────────────────────────────────────────────────

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  pattern: string;
  isRunning: boolean;
  onCycleChange: (cycle: number) => void;
  onComplete: () => void;
}

export default function BreathingOrb({ pattern, isRunning, onCycleChange, onComplete }: Props) {
  // DOM refs — manipulated directly inside the RAF loop (no React re-renders)
  const orbRef         = useRef<HTMLDivElement>(null);
  const glowRef        = useRef<HTMLDivElement>(null);
  const labelRef       = useRef<HTMLSpanElement>(null);
  const cycleRef       = useRef<HTMLParagraphElement>(null);
  const sessionRingRef = useRef<SVGCircleElement>(null);
  const phaseRingRef   = useRef<SVGCircleElement>(null);

  // RAF / loop state refs
  const rafRef        = useRef<number>(0);
  const isRunningRef  = useRef(false);
  const patternRef    = useRef(pattern);
  const phaseIdxRef   = useRef(0);
  const cycleIdxRef   = useRef(0);
  const phaseStartRef = useRef(0); // RAF timestamp in ms

  // Callback refs — avoids stale closure in the loop
  const onCycleChangeRef = useRef(onCycleChange);
  const onCompleteRef    = useRef(onComplete);
  useEffect(() => { onCycleChangeRef.current = onCycleChange; }, [onCycleChange]);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  useEffect(() => { patternRef.current = pattern; }, [pattern]);

  // ── RAF loop ──────────────────────────────────────────────────────────────

  const loop = useCallback((ts: number) => {
    if (!isRunningRef.current) return;

    const phases = PATTERNS[patternRef.current];
    const pi     = phaseIdxRef.current;
    const phase  = phases[pi];
    const elapsed = (ts - phaseStartRef.current) / 1000; // seconds
    const raw     = Math.min(elapsed / phase.duration, 1);
    const t       = easeInOut(raw);

    // ── Scale + blur ──────────────────────────────────────────────────────

    let scale = ORB_MIN;
    let blur  = 0;

    if      (phase.type === "inhale")   { scale = ORB_MIN + (ORB_MAX - ORB_MIN) * t; }
    else if (phase.type === "hold-in")  { scale = ORB_MAX; }
    else if (phase.type === "exhale")   { scale = ORB_MAX - (ORB_MAX - ORB_MIN) * t; blur = 1.8 * raw; }
    else if (phase.type === "hold-out") { scale = ORB_MIN; }

    if (orbRef.current) {
      orbRef.current.style.transform = `scale(${scale.toFixed(4)})`;
      orbRef.current.style.filter    = blur > 0.01 ? `blur(${blur.toFixed(3)}px)` : "";
    }
    if (glowRef.current) {
      glowRef.current.style.transform = `scale(${(scale * 1.1).toFixed(4)})`;
    }

    // ── Progress rings ────────────────────────────────────────────────────

    const totalPhaseDur  = phases.reduce((s, p) => s + p.duration, 0);
    const donePhaseDur   = phases.slice(0, pi).reduce((s, p) => s + p.duration, 0);
    const cycleElapsed   = cycleIdxRef.current * totalPhaseDur + donePhaseDur + Math.min(elapsed, phase.duration);
    const sessionProg    = Math.min(cycleElapsed / (totalPhaseDur * TOTAL_CYCLES), 1);

    if (sessionRingRef.current) {
      sessionRingRef.current.style.strokeDashoffset = `${SESSION_C * (1 - sessionProg)}`;
    }
    if (phaseRingRef.current) {
      phaseRingRef.current.style.strokeDashoffset = `${PHASE_C * (1 - raw)}`;
    }

    // ── Phase transition ──────────────────────────────────────────────────

    if (raw >= 1) {
      const nextPi = (pi + 1) % phases.length;

      // Fade out label
      if (labelRef.current) labelRef.current.style.opacity = "0";

      if (nextPi === 0) {
        // Completed a full cycle
        const newCycle = cycleIdxRef.current + 1;

        if (newCycle >= TOTAL_CYCLES) {
          // Session finished
          isRunningRef.current = false;
          if (orbRef.current) {
            orbRef.current.style.transform = "scale(1)";
            orbRef.current.style.filter    = "";
          }
          if (glowRef.current) glowRef.current.style.transform = "scale(1.1)";
          if (sessionRingRef.current) sessionRingRef.current.style.strokeDashoffset = "0";
          onCompleteRef.current();
          return;
        }

        cycleIdxRef.current = newCycle;
        onCycleChangeRef.current(newCycle);
        if (cycleRef.current) {
          cycleRef.current.textContent = `Cycle ${newCycle + 1} of ${TOTAL_CYCLES}`;
        }
      }

      // Advance phase (carry forward any overshoot for accurate timing)
      phaseIdxRef.current  = nextPi;
      phaseStartRef.current += phase.duration * 1000;

      // Fade in new label after brief pause
      const nextLabel = phases[nextPi].label;
      setTimeout(() => {
        if (labelRef.current && isRunningRef.current) {
          labelRef.current.textContent  = nextLabel;
          labelRef.current.style.opacity = "0.88";
        }
      }, 200);
    }

    rafRef.current = requestAnimationFrame(loop);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Start / stop ──────────────────────────────────────────────────────────

  useEffect(() => {
    isRunningRef.current = isRunning;

    if (isRunning) {
      const phases = PATTERNS[patternRef.current];
      phaseIdxRef.current  = 0;
      cycleIdxRef.current  = 0;
      const now            = performance.now();
      phaseStartRef.current = now;

      // Reset DOM to initial state
      if (labelRef.current) {
        labelRef.current.textContent  = phases[0].label;
        labelRef.current.style.opacity = "0.88";
      }
      if (cycleRef.current) {
        cycleRef.current.textContent = `Cycle 1 of ${TOTAL_CYCLES}`;
      }
      if (sessionRingRef.current) sessionRingRef.current.style.strokeDashoffset = `${SESSION_C}`;
      if (phaseRingRef.current)   phaseRingRef.current.style.strokeDashoffset   = `${PHASE_C}`;
      if (orbRef.current) {
        orbRef.current.style.transform = "scale(1)";
        orbRef.current.style.filter    = "";
      }
      if (glowRef.current) glowRef.current.style.transform = "scale(1.1)";

      rafRef.current = requestAnimationFrame(loop);
    } else {
      cancelAnimationFrame(rafRef.current);
      if (labelRef.current) labelRef.current.style.opacity = "0";
    }

    return () => { cancelAnimationFrame(rafRef.current); };
  }, [isRunning, loop]);

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col items-center gap-5">

      {/* ── Orb stage ──────────────────────────────────────────────────── */}
      <div className="relative w-[240px] h-[240px]">

        {/* Progress rings — rotated so arc starts from top (12 o'clock) */}
        <svg
          className="absolute inset-0 -rotate-90 pointer-events-none"
          width={SVG_SIZE}
          height={SVG_SIZE}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        >
          {/* Session ring — outer */}
          <circle
            ref={sessionRingRef}
            cx={SVG_CENTER} cy={SVG_CENTER} r={SESSION_R}
            fill="none"
            stroke="rgba(80,200,218,0.22)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray={SESSION_C}
            strokeDashoffset={SESSION_C}
          />
          {/* Phase arc — inner */}
          <circle
            ref={phaseRingRef}
            cx={SVG_CENTER} cy={SVG_CENTER} r={PHASE_R}
            fill="none"
            stroke="rgba(80,200,218,0.38)"
            strokeWidth={1}
            strokeLinecap="round"
            strokeDasharray={PHASE_C}
            strokeDashoffset={PHASE_C}
          />
        </svg>

        {/* Glow — scales with orb × 1.1 via RAF */}
        <div
          ref={glowRef}
          className="absolute w-[160px] h-[160px] rounded-full top-[40px] left-[40px] shadow-[0_0_60px_rgba(30,175,200,0.16),0_0_120px_rgba(30,175,200,0.08)]"
          style={{ transform: "scale(1.1)" }}
        />

        {/* Orb — scale + blur driven by RAF */}
        <div
          ref={orbRef}
          className="absolute w-[160px] h-[160px] rounded-full top-[40px] left-[40px] z-10 bg-[radial-gradient(circle_at_center,rgba(100,225,240,0.28),rgba(40,170,195,0.16),rgba(15,110,145,0.10))] [border:0.5px_solid_rgba(80,200,218,0.16)]"
          style={{ transform: "scale(1)" }}
        />

        {/* Phase label — centered over orb, opacity driven by RAF */}
        <span
          ref={labelRef}
          className="absolute inset-0 z-20 flex items-center justify-center [font-family:var(--font-display)] italic font-light text-[22px] text-[rgba(180,235,245,0.88)] pointer-events-none select-none transition-opacity duration-[220ms] ease-in-out opacity-0"
        />
      </div>

      {/* ── Cycle counter ──────────────────────────────────────────────── */}
      <p
        ref={cycleRef}
        className="[font-family:var(--font-jost)] text-[10px] tracking-[0.22em] uppercase text-[rgba(100,190,210,0.38)] h-4"
      />
    </div>
  );
}
