import { hashString, pickVariant } from "@/lib/solaceLanguage"

export type HeavyInputResult = {
  matched: boolean
  title: string
  insight: string
  nextStep: string
  reminder: string
}

export function detectHeavyInput(input: string): HeavyInputResult {
  const text = input.toLowerCase().trim()

  const heavyPhrases = [
    "can't deal",
    "cannot deal",
    "can't cope",
    "cannot cope",
    "too much",
    "overwhelmed",
    "i don't know what to do",
    "everything is falling apart",
    "i can't handle this",
    "i cannot handle this",
    "i'm pregnant",
    "i am pregnant",
    "pregnant",
    "my partner is cheating",
    "cheating on me",
    "i feel trapped",
    "i feel ruined",
    "my life is over",
    "i'm panicking",
    "i am panicking",
    "i feel broken",
    "i'm falling apart",
    "i am falling apart",
    "i can't do this",
    "i cannot do this",
    "this is too hard",
    "i feel lost",
    "i feel hopeless",
    "i'm exhausted",
    "i am exhausted",
    "i'm done",
    "i am done",
  ]

  const matched = heavyPhrases.some((phrase) => text.includes(phrase))

  if (!matched) {
    return {
      matched: false,
      title: "",
      insight: "",
      nextStep: "",
      reminder: "",
    }
  }

  const seed = hashString(text || "heavy-input")

  const titles = [
    "This sounds like a lot to carry right now.",
    "This feels like more than a simple mental loop.",
    "This sounds genuinely heavy.",
    "There seems to be a lot of weight in this moment.",
    "This sounds like something that needs steadiness before analysis.",
    "This feels like a moment that may need gentleness more than pressure.",
    "This sounds emotionally heavy to hold alone.",
    "There may be a lot sitting inside this all at once.",
    "This sounds like a difficult moment to carry in the mind.",
    "This may be asking for calm support before clarity.",
  ]

  const insights = [
    "Some thoughts are not really asking to be analysed. They are asking for steadiness, support, and a little breathing room.",
    "At times like this, the mind is not always looking for a smart answer first. It may be looking for safety, grounding, and a place to pause.",
    "When a thought carries this much emotional weight, analysis can sometimes add pressure instead of relief.",
    "This may be one of those moments where the mind needs softness before it can use structure.",
    "Not every heavy thought needs to be solved immediately. Some first need to be held more gently.",
    "The pressure here may be coming as much from the emotional weight of the moment as from the situation itself.",
    "When something feels this intense, clarity often comes later. The first need may simply be steadiness.",
    "This sounds like the kind of moment where trying to force an answer could make the mind feel even tighter.",
  ]

  const nextSteps = [
    "Pause the analysis for a moment. Focus on one grounding step: sit down, breathe slowly, drink water, or reach out to one trusted person.",
    "Try stepping away from solving for a moment and return to one small stabilising action: breathe, sit, drink water, or message someone safe.",
    "Before asking the mind for answers, try giving the body one signal of safety: slower breathing, stillness, water, or a trusted contact.",
    "Let the next step be very small and very real: sit down, soften the breath, drink water, or reach out to someone steady.",
    "Try reducing the task of this moment to one grounding action instead of one big solution.",
    "A useful next step may be to pause the mental problem-solving and do one calming thing with the body or environment first.",
    "Instead of solving the whole situation, try creating five minutes of steadiness first.",
    "The next step may not be an answer. It may simply be something that helps the nervous system settle a little.",
  ]

  const reminders = [
    "You do not need to solve the whole situation in one moment.",
    "Nothing says this all has to be resolved right now.",
    "The whole weight of this does not need to be carried in one breath.",
    "It can be enough to steady the moment before trying to understand it.",
    "Relief sometimes begins with less force, not more.",
    "One calmer minute can matter more than one perfect answer.",
    "The next useful step may be smaller than the mind is demanding.",
    "Not everything heavy needs to be decided immediately.",
    "A little steadiness can be more valuable than a rushed solution.",
    "Sometimes the first kind thing is to stop forcing clarity too early.",
  ]

  return {
    matched: true,
    title: pickVariant(titles, seed),
    insight: pickVariant(insights, seed + 1),
    nextStep: pickVariant(nextSteps, seed + 2),
    reminder: pickVariant(reminders, seed + 3),
  }
}