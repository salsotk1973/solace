"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ModeSelector    from "./ModeSelector";
import SessionDots     from "./SessionDots";
import SessionComplete from "./SessionComplete";
import { useToolHistory } from "@/hooks/useToolHistory";
import ToolUpgradePrompt from "@/components/shared/ToolUpgradePrompt";

// ─── Canonical colour token — rgba(232,168,62,x) ──────────────────────────
const A = (a: number) => `rgba(232,168,62,${a})`;

// ─── Constants ────────────────────────────────────────────────────────────────

const WORK_SECS    = 25 * 60;
const REST_SECS    =  5 * 60;
const TOTAL_PHASES = 8;

function phaseDuration(idx: number): number { return idx % 2 === 0 ? WORK_SECS : REST_SECS; }
function isWorkPhase(idx: number): boolean   { return idx % 2 === 0; }
function pad(n: number): string              { return String(n).padStart(2, "0"); }

// ─── Component ────────────────────────────────────────────────────────────────

interface Props { userId: string | null; }

export default function FocusTimer({ userId }: Props) {
  const [started,      setStarted]      = useState(false);
  const [isRunning,    setIsRunning]    = useState(false);
  const [phaseIdx,     setPhaseIdx]     = useState(0);
  const [remaining,    setRemaining]    = useState(WORK_SECS);
  const [workDone,     setWorkDone]     = useState(0);
  const [allDone,      setAllDone]      = useState(false);
  const [dismissed,    setDismissed]    = useState(false);
  const [circleSize,   setCircleSize]   = useState<number>(220);
  const [historyOpen,  setHistoryOpen]  = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const phaseIdxRef  = useRef(phaseIdx);
  const remainingRef = useRef(remaining);
  const workDoneRef  = useRef(workDone);
  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef    = useRef<AudioContext | null>(null);
  const silentAudioRef = useRef<HTMLAudioElement | null>(null);
  const focusArrRef    = useRef<ArrayBuffer | null>(null);
  const restArrRef     = useRef<ArrayBuffer | null>(null);
  const doneArrRef     = useRef<ArrayBuffer | null>(null);
  const focusBufferRef = useRef<AudioBuffer | null>(null);
  const restBufferRef  = useRef<AudioBuffer | null>(null);
  const doneBufferRef  = useRef<AudioBuffer | null>(null);

  useEffect(() => { phaseIdxRef.current  = phaseIdx;  }, [phaseIdx]);
  useEffect(() => { remainingRef.current = remaining; }, [remaining]);
  useEffect(() => { workDoneRef.current  = workDone;  }, [workDone]);

  // ── 130px mobile / 220px desktop ─────────────────────────────────────────
  useEffect(() => {
    const update = () => setCircleSize(window.innerWidth < 768 ? 130 : 220);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ── Sound preference — load + save ────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("solace_focus_sound");
    // Only turn off if user explicitly saved "false" — default is always ON
    if (saved === "false") setSoundEnabled(false);
    else setSoundEnabled(true); // Clear any stale state
  }, []);

  // ── Prefetch raw audio on mount (no AudioContext — defer to first gesture) ──
  useEffect(() => {
    async function prefetch() {
      try {
        const [fr, rr, dr] = await Promise.all([
          fetch("/sounds/focus-start.mp3"),
          fetch("/sounds/rest-start.mp3"),
          fetch("/sounds/session-done.mp3"),
        ]);
        const [fa, ra, da] = await Promise.all([
          fr.arrayBuffer(), rr.arrayBuffer(), dr.arrayBuffer(),
        ]);
        focusArrRef.current = fa;
        restArrRef.current  = ra;
        doneArrRef.current  = da;
      } catch {}
    }
    void prefetch();
    return () => {
      silentAudioRef.current?.pause();
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("solace_focus_sound", String(soundEnabled));
  }, [soundEnabled]);

  // ── Sound player ──────────────────────────────────────────────────────────
  const playSound = useCallback((buffer: AudioBuffer | null) => {
    if (!soundEnabled || !buffer || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const source = ctx.createBufferSource();
      const gain   = ctx.createGain();
      source.buffer = buffer;
      source.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.85, ctx.currentTime);
      source.start(ctx.currentTime);
    } catch {}
  }, [soundEnabled]);

  // ── iOS audio unlock helpers ──────────────────────────────────────────────

  function getAudioCtx(): AudioContext {
    if (!audioCtxRef.current) {
      const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
      audioCtxRef.current = new Ctx();
    }
    if (audioCtxRef.current.state === "suspended") {
      void audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }

  function unlockIOSAudio(ctx: AudioContext) {
    const buf = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
  }

  function startSilentLoop() {
    if (!silentAudioRef.current) return;
    silentAudioRef.current.volume = 0;
    silentAudioRef.current.play().catch(() => {});
  }

  async function ensureBuffersDecoded(ctx: AudioContext) {
    if (focusBufferRef.current) return;
    try {
      const [fb, rb, db] = await Promise.all([
        focusArrRef.current ? ctx.decodeAudioData(focusArrRef.current.slice(0)) : null,
        restArrRef.current  ? ctx.decodeAudioData(restArrRef.current.slice(0))  : null,
        doneArrRef.current  ? ctx.decodeAudioData(doneArrRef.current.slice(0))  : null,
      ]);
      if (fb) focusBufferRef.current = fb;
      if (rb) restBufferRef.current  = rb;
      if (db) doneBufferRef.current  = db;
    } catch {}
  }

  // ── History ───────────────────────────────────────────────────────────────
  const { history, loadHistory, shouldShowUpgradePrompt } = useToolHistory("focus", userId);

  useEffect(() => {
    if (!allDone || !userId) return;
    fetch("/api/focus", { method: "POST" }).then(() => loadHistory()).catch(() => {});
  }, [allDone, userId, loadHistory]);

  // ── Timer interval ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      const rem = remainingRef.current - 1;
      if (rem > 0) { remainingRef.current = rem; setRemaining(rem); return; }

      clearInterval(intervalRef.current!);
      intervalRef.current = null;

      const pi     = phaseIdxRef.current;
      const isW    = isWorkPhase(pi);
      const nextPi = pi + 1;

      if (isW) { workDoneRef.current += 1; setWorkDone(workDoneRef.current); }

      if (nextPi >= TOTAL_PHASES) {
        setRemaining(0); remainingRef.current = 0;
        setIsRunning(false); setAllDone(true);
        playSound(doneBufferRef.current);
        return;
      }

      const nextDur = phaseDuration(nextPi);
      phaseIdxRef.current = nextPi; remainingRef.current = nextDur;
      setPhaseIdx(nextPi); setRemaining(nextDur);

      if (isWorkPhase(nextPi)) {
        playSound(focusBufferRef.current);
      } else {
        playSound(restBufferRef.current);
      }
    }, 1000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, phaseIdx, playSound]);

  // ── Controls ──────────────────────────────────────────────────────────────
  async function handleTap() {
    if (!started) {
      const ctx = getAudioCtx();
      unlockIOSAudio(ctx);
      startSilentLoop();
      await ensureBuffersDecoded(ctx);
      setStarted(true);
      setIsRunning(true);
      playSound(focusBufferRef.current);
      return;
    }
    if (allDone) { handleReset(); return; }
    setIsRunning((r) => !r);
  }

  const handleSkip = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const pi   = phaseIdxRef.current;
    const isW  = isWorkPhase(pi);
    const next = pi + 1;
    if (isW) { workDoneRef.current += 1; setWorkDone(workDoneRef.current); }
    if (next >= TOTAL_PHASES) {
      setIsRunning(false); setAllDone(true);
      setRemaining(0); remainingRef.current = 0;
      playSound(doneBufferRef.current);
      return;
    }
    const nextDur = phaseDuration(next);
    phaseIdxRef.current = next; remainingRef.current = nextDur;
    setPhaseIdx(next); setRemaining(nextDur);
    if (isWorkPhase(next)) {
      playSound(focusBufferRef.current);
    } else {
      playSound(restBufferRef.current);
    }
  }, [playSound]);

  function handleReset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setStarted(false); setIsRunning(false);
    setPhaseIdx(0);          phaseIdxRef.current  = 0;
    setRemaining(WORK_SECS); remainingRef.current = WORK_SECS;
    setWorkDone(0);          workDoneRef.current  = 0;
    setAllDone(false); setDismissed(false);
  }

  // ── Derived values ─────────────────────────────────────────────────────────
  const totalPhSecs   = phaseDuration(phaseIdx);
  const radius        = circleSize / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const dashOffset    = circumference * (remaining / totalPhSecs);
  const minutes       = Math.floor(remaining / 60);
  const seconds       = remaining % 60;
  const timeStr       = `${pad(minutes)}:${pad(seconds)}`;
  const stateLabel    = allDone ? "Done" : isWorkPhase(phaseIdx) ? "Focus" : "Rest";

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center w-full">

      {/* iOS silent-mode override: keeps Web Audio audible even with mute switch engaged */}
      <audio ref={silentAudioRef} src="/audio/silent-loop.mp3" loop preload="auto" playsInline style={{ display: "none" }} />

      {/* Mode selector */}
      <ModeSelector disabled={started && !allDone} />

      {/* Sound toggle — desktop only, above phase label */}
      <div className="hidden md:flex justify-center w-full mb-4">
        <button
          onClick={() => {
            const enabling = !soundEnabled;
            setSoundEnabled(enabling);
            if (enabling) { const ctx = getAudioCtx(); unlockIOSAudio(ctx); startSilentLoop(); }
          }}
          className="[font-family:var(--font-jost)] text-[11px] tracking-[0.22em] uppercase cursor-pointer transition-all duration-200 flex items-center gap-2 px-6 py-2.5 rounded-full"
          style={{
            color: soundEnabled ? A(1.0) : A(0.45),
            border: `1px solid ${soundEnabled ? A(0.70) : A(0.20)}`,
            background: soundEnabled ? A(0.18) : "transparent",
            boxShadow: soundEnabled ? `0 0 10px ${A(0.25)}` : "none",
          }}
          aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
        >
          {soundEnabled ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <line x1="23" y1="9" x2="17" y2="15"/>
              <line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          )}
          {soundEnabled ? "Sound on" : "Sound off"}
        </button>
      </div>

      {/* Phase label — always amber, 4px top gap from pills */}
      <p
        className={[
          "[font-family:var(--font-display)] italic font-light leading-none transition-all duration-500 text-center w-full",
          "text-[28px] md:text-[38px]",
          "mb-3 md:mb-8",
          "text-[rgba(255,195,100,0.65)]",
          started ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{ marginTop: "4px" }}
      >
        {stateLabel}
      </p>

      {/* Circle + mobile sound toggle */}
      <div className="relative flex items-center justify-center mb-4">

        {/* Sound toggle — mobile only, absolutely right of circle */}
        <button
          onClick={() => {
            const enabling = !soundEnabled;
            setSoundEnabled(enabling);
            if (enabling) { const ctx = getAudioCtx(); unlockIOSAudio(ctx); startSilentLoop(); }
          }}
          className="absolute md:hidden [font-family:var(--font-jost)] text-[9px] tracking-[0.18em] uppercase cursor-pointer transition-all duration-200 flex flex-col items-center gap-1 px-2 py-2 rounded-full"
          style={{
            left: `calc(100% + 10px)`,
            top: "50%",
            transform: "translateY(-50%)",
            color: soundEnabled ? A(1.0) : A(0.45),
            border: `1px solid ${soundEnabled ? A(0.70) : A(0.20)}`,
            background: soundEnabled ? A(0.18) : "transparent",
            boxShadow: soundEnabled ? `0 0 8px ${A(0.25)}` : "none",
            whiteSpace: "nowrap",
            minWidth: "40px",
          }}
          aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
        >
          {soundEnabled ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <line x1="23" y1="9" x2="17" y2="15"/>
              <line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          )}
        </button>

        {/* Circle — tap to start / pause / resume */}
        <div
          role="button"
          tabIndex={0}
          aria-label={isRunning ? "Pause timer" : started ? "Resume timer" : "Start timer"}
          onClick={handleTap}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") ? handleTap() : null}
          className="relative cursor-pointer select-none group"
          style={{ width: circleSize, height: circleSize }}
        >
          <svg
            className="absolute inset-0 -rotate-90 pointer-events-none"
            viewBox={`0 0 ${circleSize} ${circleSize}`}
            width={circleSize}
            height={circleSize}
          >
            {/* Track */}
            <circle cx={circleSize / 2} cy={circleSize / 2} r={radius} fill="none" stroke="rgba(232,168,62,0.10)" strokeWidth={3} />
            {/* Progress arc — always amber */}
            <circle
              cx={circleSize / 2} cy={circleSize / 2} r={radius}
              fill="none"
              stroke="rgba(240,170,70,0.55)"
              className="[transition:stroke-dashoffset_1s_linear]"
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className="absolute inset-0 rounded-full flex flex-col items-center justify-center gap-1" style={{ border: "1px solid rgba(232,168,62,0.15)", background: "rgba(255,255,255,0.015)" }}>
            {/* Digits — always amber */}
            <span
              className="[font-family:var(--font-jost)] font-[300] tabular-nums leading-none text-[rgba(255,200,120,0.92)]"
              style={{ fontSize: circleSize < 180 ? "28px" : "42px", letterSpacing: "-0.03em" }}
            >
              {timeStr}
            </span>
            {/* Tap hint */}
            <span
              className={[
                "[font-family:var(--font-jost)] text-[11px] md:text-[13px] tracking-[0.18em] uppercase transition-all duration-500",
                !started ? "animate-pulse" : "",
              ].join(" ")}
              style={{
                color: !started ? "rgba(232,168,62,0.90)" : "rgba(232,168,62,0.55)",
                textShadow: !started ? "0 0 8px rgba(232,168,62,0.60)" : "none",
              }}
            >
              {!started ? "tap to start" : isRunning ? "tap to pause" : "tap to resume"}
            </span>
          </div>
        </div>

      </div>

      {/* Session dots */}
      <div className="mb-5 mt-2">
        <SessionDots workDone={workDone} phaseIdx={phaseIdx} started={started} />
      </div>

      {/* Skip + Reset — pill buttons matching Breathing BEGIN */}
      {started && (
        <div className="flex items-center gap-3 mb-8">
          {!allDone && (
            <button
              onClick={handleSkip}
              className="[font-family:var(--font-jost)] text-[11px] tracking-[0.22em] uppercase cursor-pointer px-8 py-3 rounded-full transition-all duration-300 hover:opacity-90"
              style={{ background: "rgba(232,168,62,0.85)", border: "1px solid rgba(232,168,62,0.90)", color: "rgba(10,20,0,0.95)" }}
            >
              Skip →
            </button>
          )}
          <button
            onClick={handleReset}
            className="[font-family:var(--font-jost)] text-[11px] tracking-[0.22em] uppercase cursor-pointer px-8 py-3 rounded-full transition-all duration-300 hover:opacity-80"
            style={{ background: "transparent", border: "1px solid rgba(232,168,62,0.35)", color: "rgba(232,168,62,0.55)" }}
          >
            Reset
          </button>
        </div>
      )}

      {/* Info cards — exact Breathing structure, amber tokens */}
      <div className="grid grid-cols-2 gap-2 max-w-[320px] mx-auto md:mx-auto mb-2 md:max-w-[420px] md:mb-20">
        {[
          { label: "Duration", value: "~2 hrs total" },
          { label: "Best for", value: "Deep work" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 p-2 rounded-[12px] md:gap-1.5 md:px-4 md:py-4"
            style={{ border: `1px solid ${A(0.15)}`, background: A(0.04) }}
          >
            <p className="[font-family:var(--font-jost)] text-[11px] tracking-[0.18em] uppercase md:text-[12px]" style={{ color: A(0.65) }}>
              {label}
            </p>
            <p className="[font-family:var(--font-display)] font-light text-[13px] text-center leading-snug md:text-[15px]" style={{ color: A(0.92) }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* History — exact Breathing toggle structure, amber tokens */}
      {userId && history && (
        <section className="max-w-[520px] w-full mx-auto mb-20">

          {/* Mobile toggle */}
          <button
            className="w-full flex items-center justify-between md:hidden cursor-pointer rounded-[14px] px-4 py-3"
            style={{
              background: A(0.05),
              border: `1px solid ${A(0.14)}`,
              borderBottomLeftRadius: historyOpen ? 0 : undefined,
              borderBottomRightRadius: historyOpen ? 0 : undefined,
              marginBottom: historyOpen ? 0 : undefined,
            }}
            onClick={() => setHistoryOpen(o => !o)}
            aria-expanded={historyOpen}
          >
            <p className="[font-family:var(--font-jost)] text-[11px] tracking-[0.24em] uppercase" style={{ color: A(0.70) }}>
              {history.isPaid ? "Full history" : "7-day history"}
            </p>
            <span
              className="w-6 h-6 flex items-center justify-center rounded-full text-[16px] transition-transform duration-300"
              style={{ color: A(0.80), background: A(0.10), border: `1px solid ${A(0.25)}`, transform: historyOpen ? "rotate(45deg)" : "rotate(0deg)", lineHeight: 1 }}
              aria-hidden="true"
            >+</span>
          </button>

          {/* Desktop label */}
          <p className="hidden md:block [font-family:var(--font-jost)] text-[12px] tracking-[0.24em] uppercase mb-4 text-center" style={{ color: A(0.65) }}>
            {history.isPaid ? "Full history" : "7-day history"}
          </p>

          {/* Content */}
          <div className={`${historyOpen ? "block" : "hidden"} md:block ${historyOpen ? "mb-6" : "mb-4"}`}>
            <div
              className="px-3 py-3 md:px-5 md:py-4 md:rounded-[14px] md:border"
              style={{
                borderColor: A(0.14),
                background: A(0.03),
                borderTop: historyOpen ? "none" : undefined,
                borderRadius: historyOpen ? "0 0 14px 14px" : undefined,
              }}
            >
              <p className="[font-family:var(--font-jost)] text-[12px] md:text-[13px] font-light leading-relaxed text-center" style={{ color: "rgba(255,255,255,0.80)" }}>
                {!history.isPaid
                  ? "Free users keep 7 days of focus history. Your older sessions are still there."
                  : history.sessions.length > 0
                  ? `${history.sessions.length} focus ${history.sessions.length === 1 ? "session" : "sessions"} saved.`
                  : "No focus sessions saved yet."}
              </p>
              {history.hasStreak && (
                <div className="mt-4 rounded-[12px] px-4 py-3" style={{ border: `1px solid ${A(0.12)}`, background: A(0.04) }}>
                  <p className="[font-family:var(--font-jost)] text-[11px] tracking-[0.22em] uppercase text-center mb-1.5" style={{ color: A(0.65) }}>
                    Current streak
                  </p>
                  <p className="[font-family:var(--font-display)] font-light text-[20px] md:text-[24px] text-center leading-none" style={{ color: A(0.92) }}>
                    {history.currentStreakDays} day{history.currentStreakDays === 1 ? "" : "s"}
                  </p>
                  <p className="[font-family:var(--font-jost)] text-[12px] font-light leading-relaxed text-center mt-3" style={{ color: A(0.70) }}>
                    {history.streakFraming === "full"
                      ? "A quiet record of the days you chose to focus."
                      : "Consistency gets easier when you can see the full picture."}
                  </p>
                </div>
              )}
              {shouldShowUpgradePrompt && (
                <ToolUpgradePrompt hasOlderSessions={history.hasOlderSessions} toolColour="232, 168, 62" toolName="Focus Timer" />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Session complete */}
      {allDone && !dismissed && (
        <SessionComplete onClose={() => setDismissed(true)} />
      )}

    </div>
  );
}
