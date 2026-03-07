"use client"

import { useMemo, useState } from "react"
import { detectHeavyInput } from "@/lib/heavyInput"
import { cleanInput, hasLowInformationText } from "@/lib/inputQuality"
import {
  hashString,
  overthinkingLanguage,
  pickVariant,
} from "@/lib/solaceLanguage"

type Result = {
  title: string
  insight: string
  nextStep: string
  reminder: string
  closing: string
}

function buildPatternResult(
  titlePool: string[],
  insightPool: string[],
  nextStepPool: string[],
  reminderPool: string[],
  seed: number
): Result {
  return {
    title: pickVariant(titlePool, seed),
    insight: pickVariant(insightPool, seed + 1),
    nextStep: pickVariant(nextStepPool, seed + 2),
    reminder: pickVariant(reminderPool, seed + 3),
    closing: pickVariant(overthinkingLanguage.closings, seed + 4),
  }
}

function analyseOverthinking(input: string): Result {
  const text = cleanInput(input)
  const lower = text.toLowerCase()
  const seed = hashString(text || "overthinking")

  if (hasLowInformationText(text, 10)) {
    return {
      title: pickVariant(overthinkingLanguage.lowInputTitles, seed),
      insight: pickVariant(overthinkingLanguage.lowInputInsight, seed + 1),
      nextStep: pickVariant(overthinkingLanguage.lowInputNext, seed + 2),
      reminder: pickVariant(overthinkingLanguage.lowInputReminder, seed + 3),
      closing: pickVariant(overthinkingLanguage.closings, seed + 4),
    }
  }

  const heavyInput = detectHeavyInput(input)

  if (heavyInput.matched) {
    return {
      title: heavyInput.title,
      insight: heavyInput.insight,
      nextStep: heavyInput.nextStep,
      reminder: heavyInput.reminder,
      closing: pickVariant(overthinkingLanguage.closings, seed + 5),
    }
  }

  const relationshipConcern =
    lower.includes("cheating") ||
    lower.includes("partner") ||
    lower.includes("relationship") ||
    lower.includes("girlfriend") ||
    lower.includes("boyfriend") ||
    lower.includes("husband") ||
    lower.includes("wife") ||
    lower.includes("trust")

  const hasFutureFear =
    lower.includes("what if") ||
    lower.includes("future") ||
    lower.includes("fail") ||
    lower.includes("lost my job") ||
    lower.includes("lose my job") ||
    lower.includes("get fired") ||
    lower.includes("something bad") ||
    lower.includes("wrong") ||
    lower.includes("mistake") ||
    lower.includes("regret")

  const hasDecision =
    lower.includes("should i") ||
    lower.includes("decision") ||
    lower.includes("choice") ||
    lower.includes("which") ||
    lower.includes("stay") ||
    lower.includes("leave") ||
    lower.includes("pick") ||
    lower.includes("option")

  const hasSocialReplay =
    lower.includes("text") ||
    lower.includes("message") ||
    lower.includes("reply") ||
    lower.includes("did i say") ||
    lower.includes("did i do") ||
    lower.includes("what did they mean") ||
    lower.includes("what does that mean")

  const hasControlLoop =
    lower.includes("need to know") ||
    lower.includes("need certainty") ||
    lower.includes("can't stop checking") ||
    lower.includes("cannot stop checking") ||
    lower.includes("checking") ||
    lower.includes("control") ||
    lower.includes("make sure")

  const hasPerfectionism =
    lower.includes("perfect") ||
    lower.includes("not good enough") ||
    lower.includes("good enough") ||
    lower.includes("better") ||
    lower.includes("best way") ||
    lower.includes("exactly right")

  if (relationshipConcern) {
    return buildPatternResult(
      overthinkingLanguage.relationshipTitles,
      overthinkingLanguage.relationshipInsights,
      overthinkingLanguage.relationshipNextSteps,
      overthinkingLanguage.relationshipReminders,
      seed
    )
  }

  if (hasFutureFear) {
    return buildPatternResult(
      overthinkingLanguage.workTitles,
      overthinkingLanguage.workInsights,
      overthinkingLanguage.workNextSteps,
      overthinkingLanguage.workReminders,
      seed
    )
  }

  if (hasDecision) {
    return buildPatternResult(
      overthinkingLanguage.decisionTitles,
      overthinkingLanguage.decisionInsights,
      overthinkingLanguage.decisionNextSteps,
      overthinkingLanguage.decisionReminders,
      seed
    )
  }

  if (hasSocialReplay) {
    return buildPatternResult(
      overthinkingLanguage.socialTitles,
      overthinkingLanguage.socialInsights,
      overthinkingLanguage.socialNextSteps,
      overthinkingLanguage.socialReminders,
      seed
    )
  }

  if (hasControlLoop) {
    return buildPatternResult(
      overthinkingLanguage.controlTitles,
      overthinkingLanguage.controlInsights,
      overthinkingLanguage.controlNextSteps,
      overthinkingLanguage.controlReminders,
      seed
    )
  }

  if (hasPerfectionism) {
    return buildPatternResult(
      overthinkingLanguage.perfectionTitles,
      overthinkingLanguage.perfectionInsights,
      overthinkingLanguage.perfectionNextSteps,
      overthinkingLanguage.perfectionReminders,
      seed
    )
  }

  return {
    title: pickVariant(overthinkingLanguage.genericTitles, seed),
    insight: pickVariant(overthinkingLanguage.genericInsights, seed + 1),
    nextStep: pickVariant(overthinkingLanguage.genericNextSteps, seed + 2),
    reminder: pickVariant(overthinkingLanguage.genericReminders, seed + 3),
    closing: pickVariant(overthinkingLanguage.closings, seed + 4),
  }
}

export default function OverthinkingBreakerTool() {
  const [input, setInput] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const result = useMemo(() => analyseOverthinking(input), [input])

  return (
    <div className="grid gap-6">
      <div>
        <label className="text-sm font-medium text-black/70">
          What thought keeps repeating?
        </label>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Example: I keep thinking I might lose my job."
          className="mt-2 h-40 w-full rounded-[28px] border border-[#ddcbbc] bg-[rgba(255,255,255,0.72)] p-4 text-[#2b2621] outline-none focus:border-[#cfb59d]"
        />

        <div className="mt-2 text-xs text-black/50">
          Tip: write the thought exactly as it appears in the mind.
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setSubmitted(true)}
          className="rounded-2xl bg-[#C98B5F] px-6 py-3 text-white shadow-[0_14px_36px_rgba(201,139,95,0.22)] hover:translate-y-[-1px] hover:bg-[#B6794E]"
        >
          Break the loop
        </button>

        <button
          onClick={() => {
            setInput("")
            setSubmitted(false)
          }}
          className="rounded-2xl border border-[#dcc8b5] bg-[rgba(255,255,255,0.58)] px-6 py-3 text-[#2B2621] backdrop-blur hover:border-[#cfb59d] hover:bg-white/75"
        >
          Reset
        </button>
      </div>

      {submitted && (
        <div className="grid gap-5 rounded-[28px] border border-[#ddcbbc] bg-[rgba(255,255,255,0.62)] p-7 shadow-[0_24px_52px_rgba(125,88,58,0.08)] backdrop-blur-xl">
          <div className="text-2xl font-semibold tracking-[-0.03em] text-[#2b2621]">
            {result.title}
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-black/45">
              What may be happening
            </div>
            <div className="mt-3 text-base leading-relaxed text-black/80">
              {result.insight}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-black/45">
              A gentle next step
            </div>
            <div className="mt-3 text-base leading-relaxed text-black/80">
              {result.nextStep}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-black/45">
              A helpful reminder
            </div>
            <div className="mt-3 text-base leading-relaxed text-black/70">
              {result.reminder}
            </div>
          </div>

          <div className="rounded-2xl border border-[#eadccf] bg-[rgba(255,255,255,0.58)] px-4 py-4 text-sm leading-relaxed text-black/60">
            {result.closing}
          </div>

          <div className="pt-1">
            <button
              onClick={async () => {
                const payload =
                  `${result.title}\n\n` +
                  `What may be happening: ${result.insight}\n\n` +
                  `A gentle next step: ${result.nextStep}\n\n` +
                  `A helpful reminder: ${result.reminder}\n\n` +
                  `${result.closing}\n`

                await navigator.clipboard.writeText(payload)
                alert("Copied.")
              }}
              className="text-sm font-medium text-[#b6794e] underline underline-offset-4 hover:text-[#9f6441]"
            >
              Copy result
            </button>
          </div>
        </div>
      )}
    </div>
  )
}