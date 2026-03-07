"use client"

import { useMemo, useState } from "react"
import { detectHeavyInput } from "@/lib/heavyInput"
import { cleanInput, hasLowInformationFields } from "@/lib/inputQuality"
import { hashString, pickVariant, priorityLanguage } from "@/lib/solaceLanguage"

type Result = {
  title: string
  firstMove: string
  whyFirst: string
  protectFrom: string
  canWait: string
  closing: string
}

function buildPriorityResetResult(
  today: string,
  soon: string,
  distracting: string,
  later: string
): Result {
  const todayClean = cleanInput(today)
  const soonClean = cleanInput(soon)
  const distractingClean = cleanInput(distracting)
  const laterClean = cleanInput(later)

  const combined = [todayClean, soonClean, distractingClean, laterClean]
    .filter(Boolean)
    .join(" ")

  const seed = hashString(combined || "priority-reset")

  if (!combined || hasLowInformationFields([todayClean, soonClean, distractingClean, laterClean])) {
    return {
      title: pickVariant(priorityLanguage.lowInputTitles, seed),
      firstMove: pickVariant(priorityLanguage.lowInputFirstMove, seed + 1),
      whyFirst: pickVariant(priorityLanguage.lowInputWhy, seed + 2),
      protectFrom: pickVariant(priorityLanguage.lowInputProtect, seed + 3),
      canWait: pickVariant(priorityLanguage.lowInputWait, seed + 4),
      closing: pickVariant(priorityLanguage.closings, seed + 5),
    }
  }

  const heavyInput = detectHeavyInput(combined)
  if (heavyInput.matched) {
    return {
      title: heavyInput.title,
      firstMove: heavyInput.insight,
      whyFirst: heavyInput.nextStep,
      protectFrom: heavyInput.reminder,
      canWait: "The rest does not need to be solved all at once.",
      closing: pickVariant(priorityLanguage.closings, seed + 6),
    }
  }

  const firstItem = todayClean || soonClean
  const secondItem = soonClean && soonClean !== firstItem ? soonClean : ""
  const distractingItem = distractingClean
  const laterItem = laterClean

  const title = pickVariant(priorityLanguage.titles, seed)
  const firstLead = pickVariant(priorityLanguage.firstMoveLeads, seed + 1)
  const whyLead = pickVariant(priorityLanguage.whyLeads, seed + 2)
  const protectLead = pickVariant(priorityLanguage.protectLeads, seed + 3)
  const waitLead = pickVariant(priorityLanguage.waitLeads, seed + 4)
  const closing = pickVariant(priorityLanguage.closings, seed + 5)

  const firstMove = firstItem
    ? `${firstLead} ${firstItem}.`
    : pickVariant(priorityLanguage.firstMoveFallbacks, seed + 6)

  let whyFirst = ""

  if (firstItem && secondItem) {
    whyFirst = `${whyLead} ${firstItem} looks active and immediate. ${secondItem} still matters, but it can follow once the first task is moving or complete.`
  } else if (firstItem) {
    whyFirst = `${whyLead} ${firstItem} seems to be the most immediate responsibility in front of you.`
  } else {
    whyFirst = pickVariant(priorityLanguage.whyFallbacks, seed + 7)
  }

  let protectFrom = ""

  if (distractingItem) {
    protectFrom = `${protectLead} ${distractingItem}`
  } else {
    protectFrom = pickVariant(priorityLanguage.protectFallbacks, seed + 8)
  }

  let canWait = ""

  if (laterItem) {
    canWait = `${waitLead} ${laterItem}`
  } else if (secondItem) {
    canWait = `${waitLead} ${secondItem}`
  } else {
    canWait = pickVariant(priorityLanguage.waitFallbacks, seed + 9)
  }

  return {
    title,
    firstMove,
    whyFirst,
    protectFrom,
    canWait,
    closing,
  }
}

export default function PriorityResetTool() {
  const [today, setToday] = useState("")
  const [soon, setSoon] = useState("")
  const [distracting, setDistracting] = useState("")
  const [later, setLater] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const result = useMemo(
    () => buildPriorityResetResult(today, soon, distracting, later),
    [today, soon, distracting, later]
  )

  return (
    <div className="grid gap-6">
      <div className="grid gap-5">
        <div>
          <label className="text-sm font-medium text-black/70">
            What needs attention today?
          </label>

          <input
            value={today}
            onChange={(e) => setToday(e.target.value)}
            placeholder="Example: finish proposal"
            className="mt-2 w-full rounded-2xl border border-[#ddcbbc] bg-[rgba(255,255,255,0.72)] px-4 py-4 text-[#2b2621] outline-none focus:border-[#cfb59d]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-black/70">
            What feels important soon, but not immediately?
          </label>

          <input
            value={soon}
            onChange={(e) => setSoon(e.target.value)}
            placeholder="Example: call accountant"
            className="mt-2 w-full rounded-2xl border border-[#ddcbbc] bg-[rgba(255,255,255,0.72)] px-4 py-4 text-[#2b2621] outline-none focus:border-[#cfb59d]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-black/70">
            What is mentally distracting you in the background?
          </label>

          <input
            value={distracting}
            onChange={(e) => setDistracting(e.target.value)}
            placeholder="Example: unread messages, clutter, low-level worry"
            className="mt-2 w-full rounded-2xl border border-[#ddcbbc] bg-[rgba(255,255,255,0.72)] px-4 py-4 text-[#2b2621] outline-none focus:border-[#cfb59d]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-black/70">
            What can wait until later?
          </label>

          <input
            value={later}
            onChange={(e) => setLater(e.target.value)}
            placeholder="Example: organise photos, clean cupboard"
            className="mt-2 w-full rounded-2xl border border-[#ddcbbc] bg-[rgba(255,255,255,0.72)] px-4 py-4 text-[#2b2621] outline-none focus:border-[#cfb59d]"
          />
        </div>

        <div className="text-xs text-black/50">
          Tip: short phrases are enough. The goal is not perfection — just a clearer order.
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setSubmitted(true)}
          className="rounded-2xl bg-[#C98B5F] px-6 py-3 text-white shadow-[0_14px_36px_rgba(201,139,95,0.22)] hover:translate-y-[-1px] hover:bg-[#B6794E]"
        >
          Reset priorities
        </button>

        <button
          onClick={() => {
            setToday("")
            setSoon("")
            setDistracting("")
            setLater("")
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
              First move
            </div>
            <div className="mt-3 text-base leading-relaxed text-black/80">
              {result.firstMove}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-black/45">
              Why this comes first
            </div>
            <div className="mt-3 text-base leading-relaxed text-black/80">
              {result.whyFirst}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-black/45">
              Protect your attention from
            </div>
            <div className="mt-3 text-base leading-relaxed text-black/70">
              {result.protectFrom}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-black/45">
              What can wait
            </div>
            <div className="mt-3 text-base leading-relaxed text-black/70">
              {result.canWait}
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
                  `First move: ${result.firstMove}\n\n` +
                  `Why this comes first: ${result.whyFirst}\n\n` +
                  `Protect your attention from: ${result.protectFrom}\n\n` +
                  `What can wait: ${result.canWait}\n\n` +
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