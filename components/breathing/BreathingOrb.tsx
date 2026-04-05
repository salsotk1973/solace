"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
const SESSION_R  = 90;
const PHASE_R    = 104;
const SESSION_C  = 2 * Math.PI * SESSION_R; // ~565.5
const PHASE_C    = 2 * Math.PI * PHASE_R;   // ~653.5

type ActivePhase = PhaseType | "idle";

type BreathAudioContext = AudioContext;

type BreathWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

const GLOW_SHADOWS: Record<ActivePhase, string> = {
  idle: [
    "0 0 40px 8px rgba(45,212,191,0.12)",
    "0 0 80px 20px rgba(45,212,191,0.07)",
    "0 0 140px 40px rgba(45,212,191,0.04)",
  ].join(", "),
  inhale: [
    "0 0 60px 20px rgba(45,212,191,0.22)",
    "0 0 120px 50px rgba(45,212,191,0.12)",
    "0 0 200px 80px rgba(45,212,191,0.06)",
  ].join(", "),
  "hold-in": [
    "0 0 70px 25px rgba(45,212,191,0.25)",
    "0 0 140px 60px rgba(45,212,191,0.14)",
    "0 0 220px 90px rgba(45,212,191,0.07)",
  ].join(", "),
  exhale: [
    "0 0 40px 8px rgba(45,212,191,0.12)",
    "0 0 80px 20px rgba(45,212,191,0.07)",
    "0 0 140px 40px rgba(45,212,191,0.04)",
  ].join(", "),
  "hold-out": [
    "0 0 40px 8px rgba(45,212,191,0.12)",
    "0 0 80px 20px rgba(45,212,191,0.07)",
    "0 0 140px 40px rgba(45,212,191,0.04)",
  ].join(", "),
};

const RING_CONFIG = [
  { size: 200, width: 1.5, inactive: "rgba(45,212,191,0)", active: "rgba(45,212,191,0.26)", shadow: "0 0 18px 3px rgba(45,212,191,0.18), 0 0 36px 10px rgba(45,212,191,0.08)", delay: 0 },
  { size: 240, width: 1, inactive: "rgba(45,212,191,0)", active: "rgba(45,212,191,0.18)", shadow: "0 0 20px 4px rgba(45,212,191,0.12), 0 0 44px 14px rgba(45,212,191,0.05)", delay: 0.2 },
  { size: 290, width: 1, inactive: "rgba(45,212,191,0)", active: "rgba(45,212,191,0.1)", shadow: "0 0 28px 6px rgba(45,212,191,0.08), 0 0 54px 18px rgba(45,212,191,0.04)", delay: 0.4 },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  pattern: string;
  isRunning: boolean;
  onCycleChange: (cycle: number) => void;
  onComplete: () => void;
}

export default function BreathingOrb({ pattern, isRunning, onCycleChange, onComplete }: Props) {
  const sessionRingRef = useRef<SVGCircleElement>(null);
  const phaseRingRef   = useRef<SVGCircleElement>(null);
  const isRunningRef   = useRef(false);
  const timeoutsRef    = useRef<number[]>([]);
  const audioCtxRef    = useRef<BreathAudioContext | null>(null);
  const oscillatorRef  = useRef<OscillatorNode | null>(null);
  const gainNodeRef    = useRef<GainNode | null>(null);
  const mutedRef       = useRef(true);
  const [activePhase, setActivePhase] = useState<ActivePhase>("idle");
  const [phaseDuration, setPhaseDuration] = useState(1.5);
  const [label, setLabel] = useState("");
  const [cycleLabel, setCycleLabel] = useState("");
  const [isMuted, setIsMuted] = useState(true);

  const clearTimers = useCallback(() => {
    for (const timeout of timeoutsRef.current) window.clearTimeout(timeout);
    timeoutsRef.current = [];
  }, []);

  const stopAudio = useCallback(() => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch {
        // Oscillator may already be stopped.
      }
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
  }, []);

  const ensureAudioContext = useCallback(async () => {
    if (typeof window === "undefined") return null;

    const AudioContextCtor = window.AudioContext ?? (window as BreathWindow).webkitAudioContext;
    if (!AudioContextCtor) return null;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextCtor();
    }

    if (audioCtxRef.current.state === "suspended") {
      await audioCtxRef.current.resume();
    }

    return audioCtxRef.current;
  }, []);

  const playBreathPhase = useCallback(async (
    fromFreq: number,
    toFreq: number,
    fromVol: number,
    toVol: number,
    duration: number,
  ) => {
    if (mutedRef.current || duration <= 0) return;

    const audioCtx = await ensureAudioContext();
    if (!audioCtx) return;

    stopAudio();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(fromFreq, audioCtx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(toFreq, audioCtx.currentTime + duration);
    gainNode.gain.setValueAtTime(fromVol, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(toVol, audioCtx.currentTime + duration * 0.9);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);

    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;

    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
      if (oscillatorRef.current === oscillator) oscillatorRef.current = null;
      if (gainNodeRef.current === gainNode) gainNodeRef.current = null;
    };
  }, [ensureAudioContext, stopAudio]);

  useEffect(() => {
    mutedRef.current = isMuted;
    if (isMuted) stopAudio();
  }, [isMuted, stopAudio]);

  useEffect(() => {
    if (sessionRingRef.current) {
      sessionRingRef.current.style.stroke = "none";
      sessionRingRef.current.style.opacity = "0";
      sessionRingRef.current.style.strokeDashoffset = `${SESSION_C}`;
    }
    if (phaseRingRef.current) {
      phaseRingRef.current.style.stroke = "none";
      phaseRingRef.current.style.opacity = "0";
      phaseRingRef.current.style.strokeDashoffset = `${PHASE_C}`;
    }
  }, []);

  useEffect(() => {
    isRunningRef.current = isRunning;

    clearTimers();
    stopAudio();

    if (!isRunning) {
      return;
    }

    void ensureAudioContext();

    const phases = PATTERNS[pattern];

    const runPhase = (cycleIndex: number, phaseIndex: number) => {
      if (!isRunningRef.current) return;

      const phase = phases[phaseIndex];
      setActivePhase(phase.type);
      setPhaseDuration(phase.duration);
      setLabel(phase.label);
      setCycleLabel(`Cycle ${cycleIndex + 1} of ${TOTAL_CYCLES}`);

      if (phase.type === "inhale") {
        void playBreathPhase(200, 270, 0, 0.07, phase.duration);
      } else if (phase.type === "exhale") {
        void playBreathPhase(270, 190, 0.07, 0, phase.duration);
      } else {
        stopAudio();
      }

      const timeout = window.setTimeout(() => {
        if (!isRunningRef.current) return;

        const nextPhaseIndex = phaseIndex + 1;
        if (nextPhaseIndex < phases.length) {
          runPhase(cycleIndex, nextPhaseIndex);
          return;
        }

        const nextCycle = cycleIndex + 1;
        if (nextCycle < TOTAL_CYCLES) {
          onCycleChange(nextCycle);
          runPhase(nextCycle, 0);
          return;
        }

        isRunningRef.current = false;
        stopAudio();
        setLabel("");
        onComplete();
      }, phase.duration * 1000);

      timeoutsRef.current.push(timeout);
    };

    onCycleChange(0);
    runPhase(0, 0);

    return () => {
      clearTimers();
      stopAudio();
    };
  }, [clearTimers, ensureAudioContext, isRunning, onComplete, onCycleChange, pattern, playBreathPhase, stopAudio]);

  const displayPhase: ActivePhase = isRunning ? activePhase : "idle";
  const displayLabel = isRunning ? label : "";
  const displayCycleLabel = isRunning ? cycleLabel : "";
  const displayDuration = isRunning ? phaseDuration : 1.5;
  const orbScale = displayPhase === "inhale" || displayPhase === "hold-in" ? ORB_MAX : ORB_MIN;
  const ringActive = displayPhase === "inhale";
  const running = isRunning && displayPhase !== "idle";
  const orbTransition = `transform ${displayDuration}s ease-in-out, filter ${displayDuration}s ease-in-out`;
  const glowAnimation = running ? "none" : "glowIdle 4s ease-in-out infinite";
  const orbAnimation = running ? "none" : "orbIdle 4s ease-in-out infinite";

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col items-center gap-5">

      {/* ── Orb stage ──────────────────────────────────────────────────── */}
      <div className="relative w-[240px] h-[240px]">
        <button
          type="button"
          onClick={() => setIsMuted((value) => !value)}
          className="absolute right-2 top-2 z-30 flex h-7 w-7 items-center justify-center rounded-full border border-white/8 bg-white/[0.02] text-[13px] text-white/35 hover:text-white/60 transition-colors duration-200"
          aria-label={isMuted ? "Enable breathing sound" : "Mute breathing sound"}
          aria-pressed={!isMuted}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>

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
            stroke="none"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray={SESSION_C}
            strokeDashoffset={SESSION_C}
            opacity={0}
          />
          {/* Phase arc — inner */}
          <circle
            ref={phaseRingRef}
            cx={SVG_CENTER} cy={SVG_CENTER} r={PHASE_R}
            fill="none"
            stroke="none"
            strokeWidth={1}
            strokeLinecap="round"
            strokeDasharray={PHASE_C}
            strokeDashoffset={PHASE_C}
            opacity={0}
          />
        </svg>

        {/* Glow layer */}
        <div
          className="glow-idle absolute w-[280px] h-[280px] rounded-full top-[-20px] left-[-20px]"
          style={{
            animation: glowAnimation,
            boxShadow: GLOW_SHADOWS[displayPhase],
            opacity: running ? 1 : 0.78,
            transition: "box-shadow 1.5s ease-in-out, opacity 1.5s ease-in-out",
          }}
        />

        {RING_CONFIG.map((ring, index) => {
          const offset = (240 - ring.size) / 2;
          return (
            <div
              key={ring.size}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: `${ring.size}px`,
                height: `${ring.size}px`,
                left: `${offset}px`,
                top: `${offset}px`,
                background: "transparent",
                border: `${ring.width}px solid ${ringActive ? ring.active : ring.inactive}`,
                boxShadow: ringActive ? ring.shadow : "none",
                opacity: ringActive ? 1 : 0,
                mixBlendMode: "screen",
                filter: ringActive ? "blur(0.15px)" : "none",
                transform: `scale(${ringActive ? 1.03 + index * 0.015 : 0.96})`,
                transition: "border-color 0.8s ease, box-shadow 0.8s ease, opacity 0.8s ease, transform 1s ease-out, filter 0.8s ease",
                transitionDelay: ringActive ? `${ring.delay}s` : "0s",
              }}
            />
          );
        })}

        {/* Orb sphere */}
        <div
          className="orb-idle absolute w-[160px] h-[160px] rounded-full top-[40px] left-[40px] z-10 bg-[radial-gradient(circle_at_center,rgba(120,241,231,0.34),rgba(56,190,181,0.2),rgba(14,108,122,0.14))] [border:0.5px_solid_rgba(80,220,205,0.16)]"
          style={{
            animation: orbAnimation,
            filter: displayPhase === "exhale" ? "blur(0px)" : "none",
            transform: `scale(${orbScale})`,
            transition: orbTransition,
          }}
        />

        {/* Phase label */}
        <span
          className="absolute inset-0 z-20 flex items-center justify-center [font-family:var(--font-display)] italic font-light text-[22px] text-[rgba(180,235,245,0.88)] pointer-events-none select-none transition-opacity duration-[220ms] ease-in-out opacity-0"
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
