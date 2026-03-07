"use client"

import { useMemo, useState } from "react"
import { detectHeavyInput } from "@/lib/heavyInput"
import { cleanInput, hasLowInformationText } from "@/lib/inputQuality"
import { clarityLanguage, hashString, pickVariant } from "@/lib/solaceLanguage"

type Result = {
  title: string
  main: string
  next: string
  release: string
  closing: string
}

function generateClarity(input: string): Result {
  const text = cleanInput(input)
  const seed = hashString(text || "clarity")

  if (hasLowInformationText(text, 12)) {
    return {
      title: pickVariant(clarityLanguage.lowInputTitles, seed),
      main: pickVariant(clarityLanguage.lowInputMain, seed + 1),
      next: pickVariant(clarityLanguage.lowInputNext, seed + 2),
      release: pickVariant(clarityLanguage.lowInputRelease, seed + 3),
      closing: pickVariant(clarityLanguage.closings, seed + 4),
    }
  }

  const heavyInput = detectHeavyInput(input)

  if (heavyInput.matched) {
    return {
      title: heavyInput.title,
      main: heavyInput.insight,
      next: heavyInput.nextStep,
      release: heavyInput.reminder,
      closing: pickVariant(clarityLanguage.closings, seed + 5),
    }
  }

  const sentences = text
    .split(/[.!?\n]+/)
    .map((s) => s.trim())
    .filter(Boolean)

  const firstSentence = sentences[0] ?? text
  const shortenedMain =
    firstSentence.length > 170
      ? `${firstSentence.slice(0, 170)}…`
      : firstSentence

  const mainLead = pickVariant(clarityLanguage.mainLeads, seed + 1)
  const nextLead = pickVariant(clarityLanguage.nextStepLeads, seed + 2)
  const releaseLead = pickVariant(clarityLanguage.releaseLeads, seed + 3)
  const nextAction = pickVariant(clarityLanguage.nextStepActions, seed + 4)
  const releaseEnding = pickVariant(clarityLanguage.releaseClosings, seed + 5)
  const title = pickVariant(clarityLanguage.titles, seed + 6)
  const closing = pickVariant(clarityLanguage.closings, seed + 7)

  return {
    title,
    main: `${mainLead} ${shortenedMain}.`,
    next: `${nextLead} ${nextAction}.`,
    release: `${releaseLead} ${releaseEnding}.`,
    closing,
  }
}

export default function ClarityTool() {
  const [input, setInput] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const result = useMemo(() => generateClarity(input), [input])

  return (
    <div className="grid gap-6">
      <div>
        <label className="text-sm font-medium text-black/70">
          What feels most tangled right now?
        </label>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write freely. It does not need to sound perfect."
          className="mt-2 h-40 w-full rounded-[28px] border border-[#ddcbbc] bg-[rgba(255,255,255,0.72)] p-4 text-[#2b2621] outline-none focus:border-[#cfb59d]"
        />

        <div className="mt-2 text-xs text-black/50">
          Tip: include the situation, what feels difficult, and what feels most urgent.
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setSubmitted(true)}
          className="rounded-2xl bg-[#C98B5F] px-6 py-3 text-white shadow-[0_14px_36px_rgba(201,139,95,0.22)] hover:translate-y-[-1px] hover:bg-[#B6794E]"
        >
          Find clarity
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
              What matters most right now
            </div>
            <div className="mt-3 text-base leading-relaxed text-black/80">
              {result.main}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-black/45">
              One gentle next step
            </div>
            <div className="mt-3 text-base leading-relaxed text-black/80">
              {result.next}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-black/45">
              What can be released for now
            </div>
            <div className="mt-3 text-base leading-relaxed text-black/70">
              {result.release}
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
                  `What matters most right now: ${result.main}\n\n` +
                  `One gentle next step: ${result.next}\n\n` +
                  `What can be released for now: ${result.release}\n\n` +
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