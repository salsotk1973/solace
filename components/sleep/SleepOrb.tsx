"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import PatternSelector, { type SleepPattern } from "./PatternSelector";
import ProgressRing, { RING_CIRCUMFERENCE } from "./ProgressRing";
import { glassBackground, glassBorder, getToolRgb } from "@/lib/design-tokens";
import { useToolHistory } from "@/hooks/useToolHistory";
import ToolUpgradePrompt from "@/components/shared/ToolUpgradePrompt";

const SessionComplete = dynamic(() => import("./SessionComplete"), { ssr: false });

type PhaseType = "inhale" | "hold-in" | "exhale";
interface Phase { label: string; type: PhaseType; duration: number; }

const PATTERNS: Record<SleepPattern, Phase[]> = {
  "48":    [{ label: "Inhale", type: "inhale", duration: 4 }, { label: "Exhale", type: "exhale", duration: 8 }],
  "478":   [{ label: "Inhale", type: "inhale", duration: 4 }, { label: "Hold", type: "hold-in", duration: 7 }, { label: "Exhale", type: "exhale", duration: 8 }],
  "relax": [{ label: "Inhale", type: "inhale", duration: 5 }, { label: "Exhale", type: "exhale", duration: 10 }],
};
const CYCLES: Record<SleepPattern, number> = { "48": 8, "478": 6, "relax": 6 };

// EXACT same INFO shape as Breathing
const INFO: Record<SleepPattern, { duration: string; bestFor: string }> = {
  "48":    { duration: "~4 min", bestFor: "Sleep onset"     },
  "478":   { duration: "~5 min", bestFor: "Anxiety · Sleep" },
  "relax": { duration: "~5 min", bestFor: "Deep rest"       },
};

const ORB_MIN = 1.0;
const ORB_MAX = 1.15;

// EXACT same T() helper as Breathing
const T = (a: number) => `rgba(60,192,212,${a})`;

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

interface Props { userId: string | null; }

export default function SleepOrb({ userId }: Props) {
  const [pattern, setPattern]         = useState<SleepPattern>("48");
  const [isRunning, setIsRunning]     = useState(false);
  const [started, setStarted]         = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [dismissed, setDismissed]             = useState(false);
  // EXACT same history toggle state as Breathing
  const [historyOpen, setHistoryOpen] = useState(false);

  // Responsive orb size — exact same pattern as BreathingSession.tsx
  const [orbSize, setOrbSize] = useState<number>(228);
  useEffect(() => {
    const update = () => setOrbSize(window.innerWidth < 768 ? 130 : 228);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Derived — scale factor for orb internals
  const sc       = orbSize / 228;
  const innerPx  = Math.round(160 * sc); // orb sphere size
  const offsetPx = Math.round(34  * sc); // orb offset

  // Orb refs
  const orbRef   = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const cycleRef = useRef<HTMLParagraphElement>(null);

  // Progress ring: [0] = fill circle, [1] = bead group
  const ringRefsRef = useRef<(SVGCircleElement | SVGGElement | null)[]>([null, null]);

  // RAF state refs
  const rafRef          = useRef<number>(0);
  const isRunningRef    = useRef(false);
  const patternKeyRef   = useRef(pattern);
  const phaseIdxRef     = useRef(0);
  const cycleIdxRef     = useRef(0);
  const phaseStartRef   = useRef(0);
  const labelVisibleRef = useRef(false);
  const labelDimRef   = useRef(1);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { patternKeyRef.current = pattern; }, [pattern]);

  function doSilentReset() {
    cancelAnimationFrame(rafRef.current);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    isRunningRef.current = false;
    labelVisibleRef.current = false;
    setIsRunning(false);
    setStarted(false);
    setSessionComplete(false);
    setDismissed(false);
    if (orbRef.current)   { orbRef.current.style.transition = ""; orbRef.current.style.transform = "scale(1)"; orbRef.current.style.filter = ""; orbRef.current.style.opacity = ""; }
    if (labelRef.current) { labelRef.current.textContent = ""; labelRef.current.style.opacity = "0"; }
    if (cycleRef.current)  cycleRef.current.textContent = "";
    const [ring, bead] = ringRefsRef.current;
    if (ring) { (ring as SVGCircleElement).style.transition = "none"; (ring as SVGCircleElement).style.strokeDashoffset = `${RING_CIRCUMFERENCE}`; (ring as SVGCircleElement).style.opacity = "0"; }
    if (bead) { (bead as SVGGElement).style.transition = "none"; (bead as SVGGElement).style.opacity = "0"; (bead as SVGGElement).style.transform = "rotate(0deg)"; }
  }

  const doSilentResetRef = useRef(doSilentReset);

  const { history, loadHistory, shouldShowUpgradePrompt } = useToolHistory("sleep", userId);
  const loadHistoryRef = useRef(loadHistory);
  useEffect(() => { loadHistoryRef.current = loadHistory; }, [loadHistory]);

  // RAF loop
  function loop(ts: number) {
    if (!isRunningRef.current) return;
    const pat         = patternKeyRef.current;
    const phases      = PATTERNS[pat];
    const totalCycles = CYCLES[pat];
    const pi          = phaseIdxRef.current;
    const phase       = phases[pi];
    const elapsed     = (ts - phaseStartRef.current) / 1000;
    const raw         = Math.min(elapsed / phase.duration, 1);
    const t           = easeInOut(raw);

    let scale = ORB_MIN;
    let blur  = 0;
    if (phase.type === "inhale")       { scale = ORB_MIN + (ORB_MAX - ORB_MIN) * t; }
    else if (phase.type === "hold-in") { scale = ORB_MAX; }
    else if (phase.type === "exhale")  { scale = ORB_MAX - (ORB_MAX - ORB_MIN) * t; blur = 1.5 * raw; }

    if (orbRef.current) {
      orbRef.current.style.transform = `scale(${scale.toFixed(4)})`;
      orbRef.current.style.filter    = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "";
    }

    const totalPhaseDur = phases.reduce((s, p) => s + p.duration, 0);
    const donePhaseDur  = phases.slice(0, pi).reduce((s, p) => s + p.duration, 0);
    const cycleElapsed  = cycleIdxRef.current * totalPhaseDur + donePhaseDur + Math.min(elapsed, phase.duration);
    const sessionProg   = Math.min(cycleElapsed / (totalPhaseDur * totalCycles), 1);

    const [ring, bead] = ringRefsRef.current;
    if (ring) {
      (ring as SVGCircleElement).style.strokeDashoffset = `${RING_CIRCUMFERENCE * (1 - sessionProg)}`;
      (ring as SVGCircleElement).style.opacity = `${Math.max(1 - sessionProg * 0.5, 0.5)}`;
    }
    if (bead) {
      (bead as SVGGElement).style.transform = `rotate(${sessionProg * 360}deg)`;
    }

    const orbOpacity = Math.max(1 - sessionProg * 0.4, 0.6);
    const labelDim   = Math.max(1 - sessionProg * 0.5, 0.5);
    labelDimRef.current = labelDim;
    if (orbRef.current) orbRef.current.style.opacity = `${orbOpacity}`;
    if (labelVisibleRef.current && labelRef.current) {
      labelRef.current.style.opacity = `${labelDim}`;
    }

    if (raw >= 1) {
      const nextPi = (pi + 1) % phases.length;
      labelVisibleRef.current = false;
      if (labelRef.current) labelRef.current.style.opacity = "0";

      if (nextPi === 0) {
        const newCycle = cycleIdxRef.current + 1;
        if (newCycle >= totalCycles) {
          isRunningRef.current = false;
          if (ring) (ring as SVGCircleElement).style.strokeDashoffset = "0";
          if (userId) {
            const totalPhaseDur2 = phases.reduce((s, p) => s + p.duration, 0);
            const patternLabel   = pat === "48" ? "4-8" : pat === "478" ? "4-7-8" : "5-10";
            fetch("/api/sleep", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ pattern: patternLabel, cycles: totalCycles, duration_seconds: totalPhaseDur2 * totalCycles }),
            }).then(() => loadHistoryRef.current()).catch(() => {});
          }
          if (orbRef.current) {
            orbRef.current.style.transition = "opacity 3s ease";
            orbRef.current.style.opacity    = "0.3";
            orbRef.current.style.transform  = "scale(1)";
            orbRef.current.style.filter     = "";
          }
          setSessionComplete(true);
          resetTimerRef.current = setTimeout(() => doSilentResetRef.current(), 5000);
          return;
        }
        cycleIdxRef.current = newCycle;
        if (cycleRef.current) cycleRef.current.textContent = `Cycle ${newCycle + 1} of ${totalCycles}`;
      }

      phaseIdxRef.current   = nextPi;
      phaseStartRef.current += phase.duration * 1000;
      const nextLabel = phases[nextPi].label;
      setTimeout(() => {
        if (labelRef.current && isRunningRef.current) {
          labelRef.current.textContent   = nextLabel;
          labelRef.current.style.opacity = `${labelDimRef.current}`;
          labelVisibleRef.current = true;
        }
      }, 200);
    }

    rafRef.current = requestAnimationFrame(loop);
  }

  // Start / stop
  useEffect(() => {
    isRunningRef.current = isRunning;
    const [ring, bead] = ringRefsRef.current;

    if (isRunning) {
      const phases      = PATTERNS[patternKeyRef.current];
      const totalCycles = CYCLES[patternKeyRef.current];

      phaseIdxRef.current     = 0;
      cycleIdxRef.current     = 0;
      phaseStartRef.current   = performance.now();
      labelVisibleRef.current = true;

      if (orbRef.current)   { orbRef.current.style.transition = ""; orbRef.current.style.transform = "scale(1)"; orbRef.current.style.filter = ""; orbRef.current.style.opacity = "1"; }
      if (labelRef.current) { labelRef.current.textContent = phases[0].label; labelRef.current.style.opacity = "1"; }
      if (cycleRef.current)  cycleRef.current.textContent = `Cycle 1 of ${totalCycles}`;

      if (ring) {
        (ring as SVGCircleElement).style.transition = "none";
        (ring as SVGCircleElement).style.strokeDashoffset = `${RING_CIRCUMFERENCE}`;
        (ring as SVGCircleElement).style.opacity = "0.7";
      }
      if (bead) {
        (bead as SVGGElement).style.transition = "none";
        (bead as SVGGElement).style.opacity    = "0.9";
        (bead as SVGGElement).style.transform  = "rotate(0deg)";
      }

      rafRef.current = requestAnimationFrame(loop);
    } else {
      cancelAnimationFrame(rafRef.current);
      labelVisibleRef.current = false;
      if (labelRef.current) labelRef.current.style.opacity = "0";
      const [ring, bead] = ringRefsRef.current;
      if (ring) {
        (ring as SVGCircleElement).style.transition = "none";
        (ring as SVGCircleElement).style.strokeDashoffset = `${RING_CIRCUMFERENCE}`;
        (ring as SVGCircleElement).style.opacity = "0";
      }
      if (bead) {
        (bead as SVGGElement).style.transition = "none";
        (bead as SVGGElement).style.opacity = "0";
        (bead as SVGGElement).style.transform = "rotate(0deg)";
      }
      if (orbRef.current) {
        orbRef.current.style.transition = "none";
        orbRef.current.style.transform = "scale(1)";
        orbRef.current.style.filter = "";
        orbRef.current.style.opacity = "";
      }
      if (cycleRef.current) cycleRef.current.textContent = "";
    }
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, [isRunning]);

  function handleStart() {
    patternKeyRef.current = pattern;
    setStarted(true);
    setIsRunning(true);
    setSessionComplete(false);
    setDismissed(false);
  }
  function handleStop() {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setIsRunning(false);
    setStarted(false);
    setSessionComplete(false);
    setDismissed(false);
  }

  const info         = INFO[pattern];
  // EXACT same historyLabel logic as Breathing
  const historyLabel = history?.isPaid ? "Full history" : "7-day history";
  const rgbBreathing = getToolRgb("breathing").replace(/, /g, ",");
  const rgbChoose    = getToolRgb("choose").replace(/, /g, ",");

  return (
    <div>
      {/* EXACT same outer wrapper as Breathing page.tsx */}
      <div className="relative z-10 max-w-[780px] mx-auto px-6 pt-[96px] md:pt-[140px] pb-28">

        <header className="text-center mb-2 md:mb-14">
          <p
            className="[font-family:var(--font-jost)] text-[10px] tracking-[0.26em] uppercase mb-2 md:mb-3"
            style={{ color: T(0.80) }}
          >
            Calm your state
          </p>
          <h1
            className="[font-family:var(--font-display)] font-light text-[22px] md:text-[clamp(36px,5vw,56px)] text-[rgba(225,242,248,0.92)] leading-tight"
          >
            Let the day go.
          </h1>
        </header>

        {/* Tool zone — EXACT same wrapper as Breathing BreathingSession */}
        <div className="mb-6 md:mb-0">

          <div>
            <PatternSelector selected={pattern} onChange={setPattern} disabled={isRunning} />
          </div>

          {/* Orb + Begin/Stop — EXACT same flex structure as Breathing */}
          <div className="flex flex-col items-center gap-3 mt-6 mb-3 md:mt-0 md:mb-16 md:gap-8 relative z-[100]">

            {/* Orb stage — responsive size */}
            <div className="flex justify-center w-full">
              <div className="relative" style={{ width: orbSize, height: orbSize, overflow: "visible" }}>

                {/* Progress ring + bead */}
                <ProgressRing ref={ringRefsRef as any} size={orbSize} />

                {/* Orb — teal, soft dissolving gradient (Sleep personality)
                    Sleep: softer, wider fade — dissolves into dark */}
                <div
                  ref={orbRef}
                  className="orb-idle absolute rounded-full z-10 bg-[radial-gradient(circle_at_50%_44%,rgba(60,192,212,0.16)_0%,rgba(38,155,175,0.12)_40%,rgba(18,90,110,0.09)_72%,rgba(8,42,55,0.07)_100%)]"
                  style={{
                    width:           `${innerPx}px`,
                    height:          `${innerPx}px`,
                    top:             `${offsetPx}px`,
                    left:            `${offsetPx}px`,
                    border:          `0.5px solid ${T(0.16)}`,
                    transformOrigin: "center",
                    transform:       "scale(1)",
                  }}
                />

                {/* Phase label — INSIDE the orb, centred, like Breathing */}
                <span
                  ref={labelRef}
                  className="absolute inset-0 z-20 flex items-center justify-center [font-family:var(--font-display)] italic font-light text-[22px] text-[rgba(180,235,245,0.88)] pointer-events-none select-none"
                  style={{ opacity: 0, transition: "opacity 220ms ease-in-out" }}
                />
              </div>
            </div>

            {/* Begin / Stop — EXACT same classes as Breathing */}
            <div className="flex justify-center md:order-first">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="bg-[rgba(60,192,212,0.85)] border border-[rgba(60,192,212,0.90)] text-[rgba(10,30,36,0.95)] [font-family:var(--font-jost)] text-[11px] tracking-[0.22em] uppercase cursor-pointer px-8 py-3 rounded-full transition-all duration-300 hover:bg-[rgba(60,192,212,1)] hover:border-[rgba(60,192,212,1)]"
                >
                  {started ? "Begin again" : "Begin"}
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="bg-[rgba(60,192,212,0.85)] border border-[rgba(60,192,212,0.90)] text-[rgba(10,30,36,0.95)] [font-family:var(--font-jost)] text-[11px] tracking-[0.22em] uppercase cursor-pointer px-8 py-3 rounded-full transition-all duration-300 hover:bg-[rgba(60,192,212,1)] hover:border-[rgba(60,192,212,1)]"
                >
                  Stop
                </button>
              )}
            </div>
          </div>

          {/* Cycle counter — EXACT same as Breathing */}
          <p
            ref={cycleRef}
            className="w-full text-center [font-family:var(--font-jost)] text-[10px] tracking-[0.22em] uppercase text-[rgba(100,190,210,0.38)] h-4 mb-3"
          />

          {/* Info cards — EXACT same classes as Breathing */}
          <div
            className="grid grid-cols-2 gap-2 max-w-[320px] mx-auto md:mx-auto mb-2 md:max-w-[420px] md:mb-20"
          >
            {[
              { label: "Duration", value: info.duration },
              { label: "Best for", value: info.bestFor  },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 p-2 rounded-[12px] md:gap-1.5 md:px-4 md:py-4"
                style={{ border: `1px solid ${T(0.15)}`, background: T(0.04) }}
              >
                <p
                  className="[font-family:var(--font-jost)] text-[11px] tracking-[0.18em] uppercase md:text-[12px]"
                  style={{ color: T(0.65) }}
                >
                  {label}
                </p>
                <p
                  className="[font-family:var(--font-display)] font-light text-[13px] text-center leading-snug md:text-[15px]"
                  style={{ color: T(0.92) }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p
          className="text-center [font-family:var(--font-display)] italic font-light text-[clamp(16px,2.2vw,22px)] text-[rgba(255,255,255,0.65)] mt-4 mb-20 max-w-[440px] mx-auto leading-relaxed"
        >
          The day is done. Your body already knows what to do.
        </p>

        {/* History — EXACT same structure as BreathingSession.tsx */}
        {userId && history && (
          <section className="max-w-[520px] mx-auto mb-20">

            {/* Mobile toggle — EXACT same as Breathing */}
            <button
              className="w-full flex items-center justify-between md:hidden cursor-pointer rounded-[14px] px-4 py-3"
              style={{
                background:              T(0.05),
                border:                  `1px solid ${T(0.14)}`,
                borderBottomLeftRadius:  historyOpen ? 0 : undefined,
                borderBottomRightRadius: historyOpen ? 0 : undefined,
                marginBottom:            historyOpen ? 0 : undefined,
              }}
              onClick={() => setHistoryOpen(o => !o)}
              aria-expanded={historyOpen}
            >
              <p
                className="[font-family:var(--font-jost)] text-[11px] tracking-[0.24em] uppercase"
                style={{ color: T(0.70) }}
              >
                {historyLabel}
              </p>
              <span
                className="w-6 h-6 flex items-center justify-center rounded-full text-[16px] transition-transform duration-300"
                style={{
                  color:      T(0.80),
                  background: T(0.10),
                  border:     `1px solid ${T(0.25)}`,
                  transform:  historyOpen ? "rotate(45deg)" : "rotate(0deg)",
                  lineHeight: 1,
                }}
                aria-hidden="true"
              >
                +
              </span>
            </button>

            {/* Desktop label — EXACT same as Breathing */}
            <p
              className="hidden md:block [font-family:var(--font-jost)] text-[12px] tracking-[0.24em] uppercase mb-4 text-center"
              style={{ color: T(0.65) }}
            >
              {historyLabel}
            </p>

            {/* History content — EXACT same structure as Breathing */}
            <div className={`${historyOpen ? "block" : "hidden"} md:block ${historyOpen ? "mb-6" : "mb-4"}`}>
              <div
                className="px-3 py-3 md:px-5 md:py-4 md:rounded-[14px]"
                style={{
                  border:       `1px solid ${T(0.12)}`,
                  background:   T(0.03),
                  borderTop:    historyOpen ? "none" : undefined,
                  borderRadius: historyOpen ? "0 0 14px 14px" : undefined,
                }}
              >
                <p
                  className="[font-family:var(--font-jost)] text-[12px] md:text-[13px] font-light leading-relaxed text-center"
                  style={{ color: "rgba(255,255,255,0.80)" }}
                >
                  {!history.isPaid
                    ? "Free users keep 7 days of sleep history. Your older sessions are still there."
                    : history.sessions.length > 0
                    ? `${history.sessions.length} sleep ${history.sessions.length === 1 ? "session" : "sessions"} saved.`
                    : "No sleep sessions saved yet."}
                </p>

                {history.hasStreak && (
                  <div
                    className="mt-4 rounded-[12px] px-4 py-3"
                    style={{ border: `1px solid ${T(0.12)}`, background: T(0.04) }}
                  >
                    <p
                      className="[font-family:var(--font-jost)] text-[11px] md:text-[12px] tracking-[0.22em] uppercase text-center mb-1.5"
                      style={{ color: T(0.65) }}
                    >
                      Current streak
                    </p>
                    <p
                      className="[font-family:var(--font-display)] font-light text-[20px] md:text-[24px] text-center leading-none"
                      style={{ color: T(0.92) }}
                    >
                      {history.currentStreakDays} day{history.currentStreakDays === 1 ? "" : "s"}
                    </p>
                    <p
                      className="[font-family:var(--font-jost)] text-[12px] font-light leading-relaxed text-center mt-3"
                      style={{ color: T(0.70) }}
                    >
                      {history.streakFraming === "full"
                        ? "A quiet record of the nights you chose to wind down."
                        : "Consistency gets easier when you can see the full picture."}
                    </p>
                  </div>
                )}

                {shouldShowUpgradePrompt && (
                  <ToolUpgradePrompt
                    hasOlderSessions={history.hasOlderSessions}
                    toolColour="60,192,212"
                    toolName="Sleep Wind-Down"
                  />
                )}
              </div>
            </div>
          </section>
        )}

        {/* Cross-links — desktop only */}
        <section className="hidden md:block">
          <p
            className="text-center [font-family:var(--font-jost)] text-[12px] tracking-[0.24em] uppercase mb-6"
            style={{ color: T(0.55) }}
          >
            Other tools
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/breathing"
              prefetch={false}
              className="group rounded-[14px] p-6 border transition-all duration-500"
              style={{
                background: glassBackground("breathing"),
                border:     `1px solid ${glassBorder("breathing", 0.12)}`,
              }}
            >
              <p
                className="[font-family:var(--font-jost)] text-[11px] tracking-[0.18em] uppercase mb-2"
                style={{ color: `rgba(${rgbBreathing},0.55)` }}
              >
                During the day
              </p>
              <p
                className="[font-family:var(--font-display)] font-light text-[20px]"
                style={{ color: "rgba(245,252,255,0.88)" }}
              >
                Breathing
              </p>
            </Link>
            <Link
              href="/tools/choose"
              prefetch={false}
              className="group rounded-[14px] p-6 border transition-all duration-500"
              style={{
                background: glassBackground("choose"),
                border:     `1px solid ${glassBorder("choose", 0.12)}`,
              }}
            >
              <p
                className="[font-family:var(--font-jost)] text-[11px] tracking-[0.18em] uppercase mb-2"
                style={{ color: `rgba(${rgbChoose},0.55)` }}
              >
                When you can&apos;t decide
              </p>
              <p
                className="[font-family:var(--font-display)] font-light text-[20px]"
                style={{ color: "rgba(235,230,252,0.88)" }}
              >
                Choose
              </p>
            </Link>
          </div>
        </section>

      </div>

      {/* Session complete — same as Breathing */}
      {sessionComplete && !dismissed && (
        <SessionComplete
          isLoggedIn={!!userId}
          isPaid={history?.isPaid}
          onDismiss={() => setDismissed(true)}
        />
      )}
    </div>
  );
}
