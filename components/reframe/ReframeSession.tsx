"use client";

import { useState, useRef, useEffect } from "react";
import ThoughtInput from "./ThoughtInput";
import ReframeStep from "./ReframeStep";
import ReframeCard from "./ReframeCard";
import SessionComplete from "./SessionComplete";
import { useToolHistory } from "@/hooks/useToolHistory";
import ToolUpgradePrompt from "@/components/shared/ToolUpgradePrompt";

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  {
    eyebrow: "Is it always true?",
    question: "Has there ever been a time when this wasn't true?",
    options: [
      "Yes — there have been times when it wasn't",
      "I can't think of one right now",
    ],
  },
  {
    eyebrow: "Who says so?",
    question: "Is this your voice — or something you absorbed from someone else?",
    options: [
      "It feels like my own thought",
      "It sounds like someone else — a parent, a critic, a memory",
    ],
  },
  {
    eyebrow: "What's actually true?",
    question:
      "If a close friend told you this about themselves — what would you say back?",
    options: [
      "I'd remind them of times they got it right",
      "I'd tell them one mistake doesn't define them",
      "Both — I'd be honest and kind at the same time",
    ],
  },
  {
    eyebrow: "A smaller, truer version",
    question: "Which feels more accurate right now?",
    options: [
      "Sometimes I struggle — and I keep going anyway.",
      "This time was hard. That's different from always.",
      "I'm harder on myself than I would be on anyone else.",
    ],
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  userId: string | null;
}

export default function ReframeSession({ userId }: Props) {
  const { history, loadHistory, shouldShowUpgradePrompt } = useToolHistory("reframe", userId);

  const [thought, setThought] = useState("");
  const [phase, setPhase] = useState<"input" | "steps" | "complete">("input");
  const [inputHiding, setInputHiding] = useState(false);
  const [stepsVisible, setStepsVisible] = useState(false);
  const [stepVisible, setStepVisible] = useState([false, false, false, false]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finalChoice, setFinalChoice] = useState("");
  const [reframeVisible, setReframeVisible] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const timers = useRef<NodeJS.Timeout[]>([]);

  // ── Cleanup ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  // ── Steps area reveal sequence ────────────────────────────────────────────────

  useEffect(() => {
    if (phase !== "steps") return;

    // Allow DOM to paint before starting transitions
    const raf = requestAnimationFrame(() => {
      setStepsVisible(true);

      // Step 1 reveals 300ms after steps area starts fading in
      const t = setTimeout(() => {
        setStepVisible([true, false, false, false]);
      }, 300);
      timers.current.push(t);
    });

    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function handleBegin() {
    if (thought.length <= 8) return;

    setInputHiding(true);

    const t = setTimeout(() => {
      setPhase("steps");
    }, 400);
    timers.current.push(t);
  }

  function handleAnswer(stepIndex: number, option: string) {
    const newAnswers = { ...answers, [`step${stepIndex + 1}`]: option };
    setAnswers(newAnswers);

    if (stepIndex < 3) {
      // Reveal next step after 500ms
      const t = setTimeout(() => {
        setStepVisible((prev) => {
          const next = [...prev] as [boolean, boolean, boolean, boolean];
          next[stepIndex + 1] = true;
          return next;
        });
      }, 500);
      timers.current.push(t);
    } else {
      // Step 4 answered — show reframe card after 600ms
      setFinalChoice(option);

      const t1 = setTimeout(() => {
        setReframeVisible(true);
        setPhase("complete");

        // Save session to API (only if logged in)
        if (userId) {
          fetch("/api/reframe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              step1: newAnswers.step1,
              step2: newAnswers.step2,
              step3: newAnswers.step3,
              finalChoice: option,
            }),
          })
            .then(() => loadHistory())
            .catch(() => {
              // Non-critical — session save failure is silent
            });
        }

        // Show nudge 1000ms after reframe card appears
        const t2 = setTimeout(() => {
          setShowNudge(true);
        }, 1000);
        timers.current.push(t2);
      }, 600);
      timers.current.push(t1);
    }
  }

  function handleReset() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setThought("");
    setPhase("input");
    setInputHiding(false);
    setStepsVisible(false);
    setStepVisible([false, false, false, false]);
    setAnswers({});
    setFinalChoice("");
    setReframeVisible(false);
    setShowNudge(false);
    setNudgeDismissed(false);
  }

  // ── JSX ───────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Thought input ──────────────────────────────────────────────────── */}
      {phase === "input" && (
        <div
          className={`transition-all duration-[400ms] ease-in-out ${
            inputHiding
              ? "opacity-0 -translate-y-2 pointer-events-none"
              : "opacity-100 translate-y-0"
          }`}
        >
          <ThoughtInput
            thought={thought}
            onChange={setThought}
            onBegin={handleBegin}
          />
        </div>
      )}

      {/* ── Steps + Reframe card ────────────────────────────────────────────── */}
      {phase !== "input" && (
        <div
          className={`transition-all duration-500 ease-in-out ${
            stepsVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
        >
          {STEPS.map((step, i) => (
            <ReframeStep
              key={i}
              eyebrow={step.eyebrow}
              question={step.question}
              options={[...step.options]}
              visible={stepVisible[i]}
              locked={!!answers[`step${i + 1}`]}
              selectedOption={answers[`step${i + 1}`]}
              onSelect={(option) => handleAnswer(i, option)}
            />
          ))}

          {finalChoice && (
            <ReframeCard
              finalChoice={finalChoice}
              visible={reframeVisible}
              onReset={handleReset}
            />
          )}
        </div>
      )}

      {/* ── History ─────────────────────────────────────────────────────────── */}
      {userId && history && (
        <section className="max-w-[520px] mx-auto mb-10 mt-4">
          <p
            className="[font-family:var(--font-jost)] text-[12px] tracking-[0.24em] uppercase mb-4 text-center"
            style={{ color: "rgba(232, 168, 62, 0.50)" }}
          >
            {history.isPaid ? "Full history" : "7-day history"}
          </p>
          <div
            className="rounded-[14px] px-5 py-4"
            style={{ border: "1px solid rgba(232, 168, 62, 0.08)", background: "rgba(232, 168, 62, 0.025)" }}
          >
            <p className="[font-family:var(--font-jost)] text-[13px] font-light text-[rgba(255,255,255,0.75)] leading-relaxed text-center">
              {!history.isPaid
                ? "Free users keep 7 days of history. Your older sessions are still there."
                : history.sessions.length > 0
                ? `${history.sessions.length} session${history.sessions.length === 1 ? "" : "s"} saved.`
                : "No sessions saved yet."}
            </p>
            {history.hasStreak && (
              <div className="mt-4 text-center">
                <p
                  className="[font-family:var(--font-jost)] text-[12px] tracking-[0.22em] uppercase mb-1"
                  style={{ color: "rgba(232, 168, 62, 0.42)" }}
                >
                  Current streak
                </p>
                <p className="[font-family:var(--font-display)] font-light text-[24px] text-[rgba(255,255,255,0.80)]">
                  {history.currentStreakDays} day{history.currentStreakDays === 1 ? "" : "s"}
                </p>
                <p className="[font-family:var(--font-jost)] text-[12px] font-light text-[rgba(255,255,255,0.45)] mt-2">
                  {history.streakFraming === "full"
                    ? "A quiet record of the days you returned."
                    : "Consistency gets easier when you can see the full picture."}
                </p>
              </div>
            )}
            {shouldShowUpgradePrompt && (
              <ToolUpgradePrompt
                hasOlderSessions={history.hasOlderSessions}
                toolColour="232, 168, 62"
                toolName="Thought Reframer"
              />
            )}
          </div>
        </section>
      )}

      {/* ── Session complete nudge ──────────────────────────────────────────── */}
      {!nudgeDismissed && (
        <SessionComplete
          visible={showNudge}
          isLoggedIn={!!userId}
          isPaid={history?.isPaid}
          onDismiss={() => setNudgeDismissed(true)}
        />
      )}
    </>
  );
}
