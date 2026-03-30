"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import PatternSelector, { type SleepPattern } from "./PatternSelector";
import ProgressRing, { RING_CIRCUMFERENCE } from "./ProgressRing";

// ─── Types ────────────────────────────────────────────────────────────────────

type PhaseType = "inhale" | "hold-in" | "exhale";

interface Phase {
  label: string;
  type:  PhaseType;
  duration: number; // seconds
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PATTERNS: Record<SleepPattern, Phase[]> = {
  "48": [
    { label: "Inhale", type: "inhale", duration: 4 },
    { label: "Exhale", type: "exhale", duration: 8 },
  ],
  "478": [
    { label: "Inhale", type: "inhale",  duration: 4 },
    { label: "Hold",   type: "hold-in", duration: 7 },
    { label: "Exhale", type: "exhale",  duration: 8 },
  ],
  "relax": [
    { label: "Inhale", type: "inhale", duration: 5  },
    { label: "Exhale", type: "exhale", duration: 10 },
  ],
};

const CYCLES: Record<SleepPattern, number> = { "48": 8, "478": 6, "relax": 6 };

const PATTERN_INFO: Record<SleepPattern, {
  patternLabel: string; patternSub: string;
  duration:     string; cyclesLabel: string;
  bestFor:      string; bestForSub:  string;
}> = {
  "48":    { patternLabel: "4-8",   patternSub: "sleep optimised", duration: "~4 min", cyclesLabel: "8 cycles", bestFor: "Sleep",  bestForSub: "Wind-down · Rest"   },
  "478":   { patternLabel: "4-7-8", patternSub: "relax & sleep",   duration: "~5 min", cyclesLabel: "6 cycles", bestFor: "Sleep",  bestForSub: "Anxiety · Rest"     },
  "relax": { patternLabel: "5-10",  patternSub: "deep relaxation",  duration: "~5 min", cyclesLabel: "6 cycles", bestFor: "Relax",  bestForSub: "Deep · Wind-down"   },
};

const ORB_MIN      = 1.0;
const ORB_MAX      = 1.18;
const DIM_DELAY_MS = 4000; // ms after session start before UI dims

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  userId: string | null;
}

export default function SleepOrb({ userId }: Props) {
  const [pattern,   setPattern]   = useState<SleepPattern>("48");
  const [isRunning, setIsRunning] = useState(false);
  const [started,   setStarted]   = useState(false);

  // ── Orb / ring refs (all updated directly in the RAF loop) ───────────────
  const orbRef   = useRef<HTMLDivElement>(null);
  const glowRef  = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const cycleRef = useRef<HTMLParagraphElement>(null);
  const ringRef  = useRef<SVGCircleElement>(null);

  // ── Dimming refs ──────────────────────────────────────────────────────────
  // SiteHeader is position:fixed z-80, SiteFooter is position:relative z-80.
  // Vignette sits at z-[90] to overlay both. Orb section is z-[100].
  const vignetteRef    = useRef<HTMLDivElement>(null);
  const headerRef      = useRef<HTMLElement>(null);
  const patternAreaRef = useRef<HTMLDivElement>(null);
  const cardsRef       = useRef<HTMLDivElement>(null);
  const humanLineRef   = useRef<HTMLParagraphElement>(null);
  const crossLinksRef  = useRef<HTMLElement>(null);

  // ── RAF / loop state refs ─────────────────────────────────────────────────
  const rafRef          = useRef<number>(0);
  const isRunningRef    = useRef(false);
  const patternKeyRef   = useRef(pattern);
  const phaseIdxRef     = useRef(0);
  const cycleIdxRef     = useRef(0);
  const phaseStartRef   = useRef(0); // RAF timestamp in ms
  const labelVisibleRef = useRef(false);
  const labelDimRef     = useRef(1); // current max dim for label (updated each tick)
  const dimTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep pattern key in sync (safe to read inside loop)
  useEffect(() => { patternKeyRef.current = pattern; }, [pattern]);

  // ── Dimming helpers ───────────────────────────────────────────────────────

  const applyDimming = useCallback(() => {
    const els = [headerRef, patternAreaRef, cardsRef, humanLineRef, crossLinksRef];
    els.forEach((r) => { if (r.current) r.current.style.opacity = "0.1"; });
    if (vignetteRef.current) vignetteRef.current.style.opacity = "1";
  }, []);

  // instant=true: skip the 3s CSS transition (used on Stop and silent reset)
  const removeDimming = useCallback((instant = false) => {
    const els = [headerRef, patternAreaRef, cardsRef, humanLineRef, crossLinksRef];
    els.forEach((r) => {
      if (!r.current) return;
      if (instant) {
        r.current.style.transition = "opacity 0s";
        r.current.style.opacity    = "";
        requestAnimationFrame(() => { if (r.current) r.current.style.transition = ""; });
      } else {
        r.current.style.opacity = "";
      }
    });
    if (vignetteRef.current) {
      if (instant) {
        vignetteRef.current.style.transition = "opacity 0s";
        vignetteRef.current.style.opacity    = "0";
        requestAnimationFrame(() => { if (vignetteRef.current) vignetteRef.current.style.transition = ""; });
      } else {
        vignetteRef.current.style.opacity = "0";
      }
    }
  }, []);

  // ── Silent reset (called after session-end 5 s delay) ────────────────────

  const doSilentReset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (dimTimerRef.current)   clearTimeout(dimTimerRef.current);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    isRunningRef.current  = false;
    labelVisibleRef.current = false;
    setIsRunning(false);
    setStarted(false);
    removeDimming(true);
    if (orbRef.current) {
      orbRef.current.style.transition = "";
      orbRef.current.style.transform  = "scale(1)";
      orbRef.current.style.filter     = "";
      orbRef.current.style.opacity    = "";
    }
    if (glowRef.current) {
      glowRef.current.style.transform = "scale(1.1)";
      glowRef.current.style.opacity   = "";
    }
    if (labelRef.current) {
      labelRef.current.textContent  = "";
      labelRef.current.style.opacity = "0";
    }
    if (cycleRef.current) cycleRef.current.textContent = "";
    if (ringRef.current) {
      ringRef.current.style.strokeDashoffset = `${RING_CIRCUMFERENCE}`;
      ringRef.current.style.opacity          = "";
    }
  }, [removeDimming]);

  // Keep doSilentReset reachable from RAF setTimeout without stale closure
  const doSilentResetRef = useRef(doSilentReset);
  useEffect(() => { doSilentResetRef.current = doSilentReset; }, [doSilentReset]);

  // ── RAF loop ──────────────────────────────────────────────────────────────

  const loop = useCallback((ts: number) => {
    if (!isRunningRef.current) return;

    const pat         = patternKeyRef.current;
    const phases      = PATTERNS[pat];
    const totalCycles = CYCLES[pat];
    const pi          = phaseIdxRef.current;
    const phase       = phases[pi];
    const elapsed     = (ts - phaseStartRef.current) / 1000; // seconds
    const raw         = Math.min(elapsed / phase.duration, 1);
    const t           = easeInOut(raw);

    // ── Scale + blur ──────────────────────────────────────────────────────
    let scale = ORB_MIN;
    let blur  = 0;
    if      (phase.type === "inhale")  { scale = ORB_MIN + (ORB_MAX - ORB_MIN) * t; }
    else if (phase.type === "hold-in") { scale = ORB_MAX; }
    else if (phase.type === "exhale")  { scale = ORB_MAX - (ORB_MAX - ORB_MIN) * t; blur = 2 * raw; }

    if (orbRef.current) {
      orbRef.current.style.transform = `scale(${scale.toFixed(4)})`;
      orbRef.current.style.filter    = blur > 0.01 ? `blur(${blur.toFixed(3)}px)` : "";
    }
    if (glowRef.current) {
      glowRef.current.style.transform = `scale(${(scale * 1.1).toFixed(4)})`;
    }

    // ── Session progress (time-accurate) ─────────────────────────────────
    const totalPhaseDur = phases.reduce((s, p) => s + p.duration, 0);
    const donePhaseDur  = phases.slice(0, pi).reduce((s, p) => s + p.duration, 0);
    const cycleElapsed  = cycleIdxRef.current * totalPhaseDur
                        + donePhaseDur
                        + Math.min(elapsed, phase.duration);
    const sessionProg   = Math.min(cycleElapsed / (totalPhaseDur * totalCycles), 1);

    // ── Progress ring ─────────────────────────────────────────────────────
    if (ringRef.current) {
      ringRef.current.style.strokeDashoffset = `${RING_CIRCUMFERENCE * (1 - sessionProg)}`;
      ringRef.current.style.opacity          = `${Math.max(1 - sessionProg * 0.5, 0.5)}`;
    }

    // ── Progressive orb opacity (spec: never below floor values) ─────────
    const orbOpacity  = Math.max(1 - sessionProg * 0.4, 0.6);
    const glowOpacity = Math.max(1 - sessionProg * 0.6, 0.4);
    const labelDim    = Math.max(1 - sessionProg * 0.5, 0.5);
    labelDimRef.current = labelDim;

    if (orbRef.current)  orbRef.current.style.opacity  = `${orbOpacity}`;
    if (glowRef.current) glowRef.current.style.opacity = `${glowOpacity}`;
    if (labelVisibleRef.current && labelRef.current) {
      labelRef.current.style.opacity = `${labelDim}`;
    }

    // ── Phase transition ──────────────────────────────────────────────────
    if (raw >= 1) {
      const nextPi = (pi + 1) % phases.length;

      labelVisibleRef.current = false;
      if (labelRef.current) labelRef.current.style.opacity = "0";

      if (nextPi === 0) {
        const newCycle = cycleIdxRef.current + 1;

        if (newCycle >= totalCycles) {
          // ── Session complete ──────────────────────────────────────────
          isRunningRef.current = false;

          if (ringRef.current) ringRef.current.style.strokeDashoffset = "0";

          // Save to Supabase
          if (userId) {
            const totalPhaseDur  = phases.reduce((s, p) => s + p.duration, 0);
            const durationSeconds = totalPhaseDur * totalCycles;
            const patternLabel   = PATTERN_INFO[pat].patternLabel;

            fetch("/api/sleep", {
              method:  "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                pattern:          patternLabel,
                cycles:           totalCycles,
                duration_seconds: durationSeconds,
              }),
            }).catch((err) => {
              console.error("[sleep] session save failed:", err);
            });
          }

          // Fade orb to 0.3 over 3 s, then reset silently after 5 s
          if (orbRef.current) {
            orbRef.current.style.transition = "opacity 3s ease";
            orbRef.current.style.opacity    = "0.3";
            orbRef.current.style.transform  = "scale(1)";
            orbRef.current.style.filter     = "";
          }
          if (glowRef.current) glowRef.current.style.opacity = "0";

          resetTimerRef.current = setTimeout(() => doSilentResetRef.current(), 5000);
          return;
        }

        cycleIdxRef.current = newCycle;
        if (cycleRef.current) {
          cycleRef.current.textContent = `Cycle ${newCycle + 1} of ${totalCycles}`;
        }
      }

      // Advance phase (carry forward overshoot for timing accuracy)
      phaseIdxRef.current   = nextPi;
      phaseStartRef.current += phase.duration * 1000;

      // Fade in next phase label after brief pause
      const nextLabel = phases[nextPi].label;
      setTimeout(() => {
        if (labelRef.current && isRunningRef.current) {
          labelRef.current.textContent  = nextLabel;
          labelRef.current.style.opacity = `${labelDimRef.current}`;
          labelVisibleRef.current = true;
        }
      }, 200);
    }

    rafRef.current = requestAnimationFrame(loop);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Start / stop effect ───────────────────────────────────────────────────

  useEffect(() => {
    isRunningRef.current = isRunning;

    if (isRunning) {
      const phases      = PATTERNS[patternKeyRef.current];
      const totalCycles = CYCLES[patternKeyRef.current];

      phaseIdxRef.current   = 0;
      cycleIdxRef.current   = 0;
      phaseStartRef.current = performance.now();
      labelVisibleRef.current = true;

      // Reset DOM to initial running state
      if (orbRef.current) {
        orbRef.current.style.transition = "";
        orbRef.current.style.transform  = "scale(1)";
        orbRef.current.style.filter     = "";
        orbRef.current.style.opacity    = "1";
      }
      if (glowRef.current) {
        glowRef.current.style.transform = "scale(1.1)";
        glowRef.current.style.opacity   = "1";
      }
      if (labelRef.current) {
        labelRef.current.textContent  = phases[0].label;
        labelRef.current.style.opacity = "1";
      }
      if (cycleRef.current) {
        cycleRef.current.textContent = `Cycle 1 of ${totalCycles}`;
      }
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = `${RING_CIRCUMFERENCE}`;
        ringRef.current.style.opacity          = "1";
      }

      // Schedule dimming after DIM_DELAY_MS
      dimTimerRef.current = setTimeout(applyDimming, DIM_DELAY_MS);

      rafRef.current = requestAnimationFrame(loop);
    } else {
      cancelAnimationFrame(rafRef.current);
      if (dimTimerRef.current) clearTimeout(dimTimerRef.current);
      labelVisibleRef.current = false;
      if (labelRef.current) labelRef.current.style.opacity = "0";
      // Reverse dimming instantly on Stop
      removeDimming(true);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (dimTimerRef.current)   clearTimeout(dimTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, [isRunning, loop, applyDimming, removeDimming]);

  // ── Controls ──────────────────────────────────────────────────────────────

  function handleStart() {
    patternKeyRef.current = pattern;
    setStarted(true);
    setIsRunning(true);
  }

  function handleStop() {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setIsRunning(false);
    setStarted(false);
  }

  // ── Derived ───────────────────────────────────────────────────────────────

  const info = PATTERN_INFO[pattern];

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Vignette overlay ─────────────────────────────────────────────────
          z-[90]: sits above SiteHeader (fixed, z=80) and SiteFooter (z=80).
          Transparent centre keeps the orb (z-[100]) visually bright.
          pointer-events-none: never blocks clicks. ─────────────────────── */}
      <div
        ref={vignetteRef}
        className="fixed inset-0 z-[90] pointer-events-none opacity-0 transition-opacity duration-[3000ms]"
        style={{ background: "radial-gradient(ellipse at center, transparent 20%, rgba(5,7,12,0.85) 100%)" }}
      />

      {/* ── Page content ─────────────────────────────────────────────────── */}
      <div className="max-w-[780px] mx-auto px-6 pt-[140px] pb-28">

        {/* ── Tool header — dimmable ──────────────────────────────────────── */}
        <header
          ref={headerRef}
          className="text-center mb-14 transition-opacity duration-[3000ms]"
        >
          <p className="[font-family:var(--font-jost)] text-[10px] tracking-[0.26em] uppercase text-[rgba(140,120,210,0.38)] mb-3">
            Calm your state
          </p>
          <h1 className="[font-family:var(--font-display)] font-light text-[clamp(36px,5vw,56px)] text-[rgba(220,215,240,0.92)] leading-tight mb-4">
            Let the day go.
          </h1>
          <p className="[font-family:var(--font-jost)] font-[300] text-[14px] text-[rgba(155,150,200,0.48)] max-w-[440px] mx-auto leading-relaxed">
            A breathing guide for the end of the day. Slow the body, quiet the
            mind, and drift.
          </p>
        </header>

        {/* ── Pattern selector — dimmable ─────────────────────────────────── */}
        <div ref={patternAreaRef} className="transition-opacity duration-[3000ms]">
          <PatternSelector
            selected={pattern}
            onChange={setPattern}
            disabled={isRunning}
          />
        </div>

        {/* ── Orb section — z-[100], above vignette ───────────────────────── */}
        <div className="flex flex-col items-center relative z-[100]">

          {/* Phase label — RAF-driven opacity, shown when started */}
          <p
            ref={labelRef}
            className="[font-family:var(--font-display)] italic font-light text-[38px] leading-none mb-8 text-center text-[rgba(180,165,235,0.88)] select-none transition-opacity duration-[220ms] ease-in-out opacity-0"
            aria-live="polite"
          />

          {/* Orb stage */}
          <div className="relative w-[228px] h-[228px]">

            {/* Progress ring — -rotate-90 so arc fills from 12 o'clock */}
            <ProgressRing ref={ringRef} />

            {/* Glow — scales with orb × 1.1 via RAF */}
            <div
              ref={glowRef}
              className="absolute w-[160px] h-[160px] rounded-full top-[34px] left-[34px] shadow-[0_0_60px_rgba(100,80,210,0.14),0_0_120px_rgba(100,80,210,0.08)]"
              style={{ transform: "scale(1.1)" }}
            />

            {/* Orb — scale + blur driven by RAF */}
            <div
              ref={orbRef}
              className="absolute w-[160px] h-[160px] rounded-full top-[34px] left-[34px] z-10 bg-[radial-gradient(circle_at_center,rgba(140,115,235,0.28),rgba(90,70,190,0.16),rgba(50,35,140,0.10))] [border:0.5px_solid_rgba(100,80,210,0.18)]"
              style={{ transform: "scale(1)" }}
            />
          </div>

          {/* Cycle counter */}
          <p
            ref={cycleRef}
            className="[font-family:var(--font-jost)] text-[10px] tracking-[0.22em] uppercase text-[rgba(140,120,210,0.38)] h-4 mt-5"
          />

          {/* Begin / Stop */}
          <div className="mt-6 mb-16">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="[font-family:var(--font-jost)] text-[11px] tracking-[0.18em] uppercase text-[rgba(140,120,210,0.65)] border border-[rgba(140,120,210,0.22)] px-8 py-3 rounded-[2px] hover:text-[rgba(180,165,235,0.9)] hover:border-[rgba(140,120,210,0.42)] transition-all duration-300"
              >
                Begin
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="[font-family:var(--font-jost)] text-[11px] tracking-[0.18em] uppercase text-[rgba(130,120,185,0.38)] hover:text-[rgba(175,160,230,0.6)] transition-colors duration-200 px-6 py-3"
              >
                Stop
              </button>
            )}
          </div>
        </div>

        {/* ── Info cards — dimmable ───────────────────────────────────────── */}
        <div
          ref={cardsRef}
          className="grid grid-cols-3 gap-3 max-w-[520px] mx-auto mb-20 transition-opacity duration-[3000ms]"
        >
          {[
            { label: "Pattern",  value: info.patternLabel, sub: info.patternSub  },
            { label: "Duration", value: info.duration,     sub: info.cyclesLabel },
            { label: "Best For", value: info.bestFor,      sub: info.bestForSub  },
          ].map(({ label, value, sub }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 px-4 py-4 rounded-[12px] border border-[rgba(140,120,210,0.08)] bg-[rgba(140,120,210,0.03)]"
            >
              <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.2em] uppercase text-[rgba(140,120,210,0.38)]">
                {label}
              </p>
              <p className="[font-family:var(--font-display)] font-light text-[18px] text-[rgba(180,165,235,0.8)] leading-none">
                {value}
              </p>
              <p className="[font-family:var(--font-jost)] text-[9px] text-[rgba(155,145,200,0.35)] tracking-[0.06em]">
                {sub}
              </p>
            </div>
          ))}
        </div>

        {/* ── Human line — dimmable ────────────────────────────────────────── */}
        <p
          ref={humanLineRef}
          className="text-center [font-family:var(--font-display)] italic font-light text-[clamp(16px,2.2vw,22px)] text-[rgba(175,165,220,0.35)] mb-20 max-w-[440px] mx-auto leading-relaxed transition-opacity duration-[3000ms]"
        >
          The day is done. Your body already knows what to do.
        </p>

        {/* ── Other tools cross-links — dimmable ──────────────────────────── */}
        <section ref={crossLinksRef} className="transition-opacity duration-[3000ms]">
          <p className="text-center [font-family:var(--font-jost)] text-[9px] tracking-[0.24em] uppercase text-[rgba(130,145,158,0.3)] mb-6">
            Other tools
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/breathing"
              className="rounded-[14px] p-7 border border-[rgba(80,195,215,0.1)] bg-[linear-gradient(145deg,#080e18,#0a1420,#070c14)] hover:border-[rgba(80,195,215,0.26)] transition-all duration-500"
            >
              <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.18em] uppercase text-[rgba(80,195,215,0.42)] mb-2.5">
                During the day
              </p>
              <p className="[font-family:var(--font-display)] font-light text-[21px] text-[rgba(210,240,248,0.85)]">
                Breathing
              </p>
            </Link>
            <Link
              href="/reframe"
              className="rounded-[14px] p-7 border border-[rgba(200,170,90,0.1)] bg-[linear-gradient(145deg,#181208,#221808,#140e04)] hover:border-[rgba(200,170,90,0.26)] transition-all duration-500"
            >
              <p className="[font-family:var(--font-jost)] text-[9px] tracking-[0.18em] uppercase text-[rgba(200,170,90,0.42)] mb-2.5">
                When thoughts race
              </p>
              <p className="[font-family:var(--font-display)] font-light text-[21px] text-[rgba(240,230,200,0.85)]">
                Thought Reframer
              </p>
            </Link>
          </div>
        </section>

      </div>
    </>
  );
}
