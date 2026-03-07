export function hashString(value: string) {
  let hash = 0

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }

  return hash
}

export function pickVariant<T>(items: T[], seed: number) {
  return items[seed % items.length]
}

export const priorityLanguage = {
  titles: [
    "A calmer order may be enough for now.",
    "A clearer order may be all that is needed right now.",
    "This may be enough structure for the next step.",
    "A steadier order can reduce more pressure than expected.",
    "A little order can make the next move easier to see.",
    "This looks like enough structure to move forward more calmly.",
    "The day may feel lighter once the order becomes clearer.",
    "A simpler order may be more helpful than more effort right now.",
    "This may be the kind of clarity that reduces pressure quickly.",
    "The next step may not need more force — just a better order.",
    "A steadier sequence may be more useful than trying to hold everything at once.",
    "This looks like a moment for order, not more pressure.",
  ],

  lowInputTitles: [
    "A little more detail may help here.",
    "This may need a bit more real context first.",
    "A clearer input will help Solace respond more usefully.",
    "There may not be quite enough here yet to sort properly.",
  ],

  lowInputFirstMove: [
    "Try writing real items instead of placeholders, and make at least one of them concrete.",
    "Write one real responsibility, one background distraction, and one thing that can wait.",
    "A few short real phrases will help more than placeholder words.",
    "Give the tool something specific to work with, even if the phrases are very short.",
  ],

  lowInputWhy: [
    "This tool works best when it can compare a true current priority with what is distracting you or what can wait.",
    "Priority Reset becomes much more useful once the day has a few real items to sort.",
    "The clearer the input, the calmer and more accurate the order becomes.",
    "The goal is not perfect detail — just enough truth to separate today from later.",
  ],

  lowInputProtect: [
    "You do not need to explain everything perfectly — just enough for the order of the day to become visible.",
    "A few honest phrases are enough. This does not need to be written beautifully.",
    "Short, real language works better than polished language here.",
    "Clarity usually begins with simple reality, not polished wording.",
  ],

  lowInputWait: [
    "A few short, real phrases are enough. For example: finish proposal, reply to client, noisy neighbours, clean kitchen.",
    "Examples help. Try something like: send invoice, call mum, inbox, clean bathroom.",
    "Simple phrases are enough here. The tool only needs a rough map of the pressure.",
    "Even three or four honest fragments are enough to build a clearer order.",
  ],

  firstMoveLeads: [
    "Start with",
    "Begin with",
    "Put your first attention on",
    "Let the first move be",
    "Place the first effort on",
    "Bring your focus first to",
    "Give the first space to",
    "Let the day begin with",
    "Set the first position to",
    "Put the first clear energy into",
  ],

  whyLeads: [
    "This comes first because",
    "This belongs first because",
    "This appears to deserve first position because",
    "This is the strongest first move because",
    "This makes sense as the first move because",
    "This seems to lead the order because",
    "This looks like the right starting point because",
    "This appears to carry the most immediate weight because",
  ],

  protectLeads: [
    "Treat this as background friction rather than a true priority:",
    "Notice this without letting it run the day:",
    "Keep this outside the main lane for now:",
    "Let this stay in the background instead of the centre:",
    "This looks more like mental noise than a first move:",
    "This may be real, but it does not need first position:",
    "Try not to let this become the organising force of the day:",
    "This can be acknowledged without being allowed to lead:",
  ],

  waitLeads: [
    "This can wait without losing anything essential:",
    "This can sit outside today's core attention:",
    "This does not need space in the first layer of the day:",
    "This can return later, after the first priority steadies:",
    "This looks safe to leave outside the main focus for now:",
    "This can stay in the later column without creating real risk:",
    "This does not seem to require the front of the queue today:",
    "This can remain a later item while the first move gets handled:",
  ],

  firstMoveFallbacks: [
    "Choose the item that would make the day feel lighter if it moved first.",
    "Begin with the item that most reduces uncertainty.",
    "Start where a small move would create the most relief.",
    "Pick the item that most changes the shape of the day once it begins.",
  ],

  whyFallbacks: [
    "A first move matters more than a perfect plan.",
    "A better order often reduces more pressure than trying harder.",
    "Clarity usually improves once one real thing begins.",
    "The mind often settles once the first position becomes visible.",
  ],

  protectFallbacks: [
    "Protect the first priority from anything that feels noisy but does not genuinely need to lead.",
    "Keep the main focus protected from secondary noise.",
    "Not everything asking for attention deserves first position.",
    "The day gets easier when noise is kept outside the first lane.",
  ],

  waitFallbacks: [
    "Everything else can stay outside the main focus until the first task becomes clearer.",
    "The rest can wait until the first move has shape.",
    "Not everything needs equal attention today.",
    "The later layer can remain later without harm.",
  ],

  closings: [
    "One clear step is often enough to reduce most of the pressure.",
    "The mind usually relaxes once the order becomes visible.",
    "You do not need to carry everything at the same level today.",
    "A calmer sequence can be more powerful than a harder push.",
    "A visible order often creates more relief than extra effort.",
    "The day may already feel lighter once the first move is clear.",
    "Not everything important needs to happen now.",
    "Clarity often begins when the order becomes honest.",
  ],
}

export const clarityLanguage = {
  titles: [
    "A calmer next step may be enough for now.",
    "This may already be clearer than it first felt.",
    "A little clarity may be enough to loosen the pressure.",
    "The situation may need less force and more definition.",
    "This may be a moment for simplification, not more thinking.",
    "A clearer frame may already reduce some of the weight.",
    "The next step may appear once the noise is reduced.",
    "A steadier view may be enough for now.",
  ],

  lowInputTitles: [
    "A little more context may help.",
    "This may need one clearer sentence first.",
    "There may not be quite enough here yet to make the next step visible.",
    "A more concrete description will make the response more useful.",
  ],

  lowInputMain: [
    "Write the situation in one sentence.",
    "Try describing what is actually happening in plain language.",
    "Start with one honest sentence about what feels tangled.",
    "Write the situation simply, even if it feels incomplete.",
  ],

  lowInputNext: [
    "Add the part that feels most urgent, most difficult, or most unclear.",
    "Then add the piece that is creating the most pressure.",
    "Include the detail that makes the situation feel heavy or uncertain.",
    "Next, add the part that feels most difficult to hold.",
  ],

  lowInputRelease: [
    "Everything else can wait for a moment.",
    "The rest does not need to be explained all at once.",
    "It does not need to be written perfectly to become clearer.",
    "A small amount of honest detail is enough to begin.",
  ],

  mainLeads: [
    "What seems most central here is",
    "The clearest core of this may be",
    "The situation appears to turn around",
    "The main point may be",
    "At the centre of this seems to be",
    "What stands out most is",
  ],

  nextStepLeads: [
    "A gentle next step may be to",
    "The next useful move may be to",
    "A steadier next step could be to",
    "One simple action now may be to",
    "A calm next move may be to",
    "The most useful immediate step may be to",
  ],

  releaseLeads: [
    "For now, you may be able to release",
    "What can stay outside the frame for now is",
    "You may not need to carry",
    "It may help to set down",
    "The part that can wait for now may be",
    "For the moment, it may be enough not to solve",
  ],

  nextStepActions: [
    "name the next concrete action",
    "separate the known facts from the imagined outcomes",
    "write the question that most needs answering",
    "choose one conversation, task, or decision to move first",
    "reduce the situation to one immediate responsibility",
    "turn the pressure into one visible step",
  ],

  releaseClosings: [
    "the rest does not need to be solved all at once",
    "everything outside the next step",
    "the demand to solve the whole situation immediately",
    "the pressure to have the entire answer right now",
    "anything that sits beyond the first clear move",
    "the parts that are not needed for today's next step",
  ],

  closings: [
    "Clarity often begins when the situation becomes specific.",
    "The mind usually softens once the shape of the problem becomes visible.",
    "Not everything needs equal attention right now.",
    "A visible next step often reduces more pressure than more analysis.",
    "It can be enough to make the next move clearer, not the whole future.",
    "Relief often begins once the problem stops being shapeless.",
    "Sometimes one clear sentence changes the whole weight of a situation.",
    "You may not need the full answer yet — only the next honest step.",
  ],
}

export const overthinkingLanguage = {
  lowInputTitles: [
    "A little more context may help here.",
    "This may need the actual thought, not a placeholder.",
    "There may not be enough here yet to understand the loop.",
    "One clearer sentence will make the response more useful.",
  ],

  lowInputInsight: [
    "Try writing the thought exactly as it repeats in the mind.",
    "Start with the real sentence the mind keeps returning to.",
    "Write the thought as it sounds internally, even if it feels messy.",
    "Use the exact wording of the thought rather than a summary.",
  ],

  lowInputNext: [
    "A simple, honest sentence is enough to begin.",
    "You do not need to explain the whole story — just the repeated thought.",
    "The more precise the thought, the easier it is to loosen the loop.",
    "Start with the repeated line, not the full analysis around it.",
  ],

  lowInputReminder: [
    "The goal here is not to sound polished. It is to make the loop visible.",
    "A looping thought becomes easier to work with once it is written clearly.",
    "The first step is simply giving the thought a visible shape.",
    "Clarity starts when the repeated thought stops staying hidden in the background.",
  ],

  genericTitles: [
    "The thought may be looping because it has no clear ending.",
    "This may be a thought looking for closure.",
    "The mind may be circling because nothing has clearly landed yet.",
    "This looks like a loop asking for a simpler ending point.",
    "The repetition may be coming from unfinished meaning.",
    "This may be less about the thought itself and more about the lack of closure.",
  ],

  genericInsights: [
    "When a thought has nowhere to land, the mind often returns to it again and again.",
    "The mind can keep circling when it feels like the thought has not reached a conclusion.",
    "A repeated thought often signals that something still feels unresolved or undefined.",
    "Loops often continue when the mind cannot find a clear stopping point.",
    "The repetition itself may be a sign that the thought still feels open-ended.",
    "Sometimes the mind keeps revisiting the same thought because it has not yet found an ending it trusts.",
  ],

  genericNextSteps: [
    "Try turning the thought into one action, one question, or one thing to release for now.",
    "See whether the loop becomes simpler once it is turned into one visible next move.",
    "Write down the one question the loop is really asking, instead of replaying the whole thought.",
    "Reduce the loop to one action or one fact, rather than letting it stay abstract.",
    "Ask what the thought wants from you right now: action, information, or permission to let go.",
    "Try separating what needs action from what only feels urgent in the mind.",
  ],

  genericReminders: [
    "A looping mind usually needs closure, not more pressure.",
    "The goal is not to crush the thought — only to loosen its grip a little.",
    "Relief often begins when the loop becomes specific.",
    "Not every repeated thought needs to be solved immediately.",
    "The mind often softens once the loop is given a clearer shape.",
    "A little closure can reduce more repetition than more analysis.",
  ],

  closings: [
    "The mind usually eases once the loop becomes clearer.",
    "Not every thought deserves another full round of attention.",
    "A visible next step often weakens the loop more than more thinking does.",
    "You may not need a complete answer yet — only a clearer edge.",
    "Sometimes the loop relaxes once it stops being treated like an emergency.",
    "A thought can be acknowledged without being obeyed.",
    "The repetition often softens once the mind sees a path forward.",
    "A calmer relationship with the thought may matter more than defeating it.",
  ],

  workTitles: [
    "The mind may be jumping ahead.",
    "This sounds like the mind predicting a difficult future.",
    "The thought may be racing beyond the available facts.",
    "This may be fear trying to arrive before the evidence does.",
  ],

  workInsights: [
    "Sometimes the mind tries to protect itself by imagining a negative future before there is enough evidence.",
    "A worried mind often fills the gap between facts and uncertainty with a difficult forecast.",
    "When the future feels unstable, the mind can start treating predictions as if they were facts.",
    "The pressure here may be coming from imagined outcomes arriving before any concrete confirmation.",
  ],

  workNextSteps: [
    "Write the last concrete fact you know about the situation, and separate it from what the mind is predicting.",
    "List what is actually known, then place the feared scenario in a different column.",
    "Try separating evidence from forecast before giving the thought more authority.",
    "Bring the thought back to the last real fact, rather than the furthest imagined outcome.",
  ],

  workReminders: [
    "Thoughts can feel real, but they are not the same as events.",
    "Forecasting is not the same as knowing.",
    "A predicted future is still only a prediction.",
    "The mind can sound certain even when it is guessing.",
  ],

  decisionTitles: [
    "This may be a decision asking for simplicity.",
    "The mind may be stuck between options rather than lacking intelligence.",
    "This looks like a choice crowded by too many competing priorities.",
    "The pressure may be coming from trying to solve the whole decision at once.",
  ],

  decisionInsights: [
    "When too many options compete at once, the mind can get stuck searching for the perfect answer.",
    "A crowded decision often feels impossible because every option is being evaluated against every fear at the same time.",
    "The difficulty may not be the decision itself, but the number of competing criteria inside it.",
    "Some choices become heavier when the mind tries to protect against every possible regret at once.",
  ],

  decisionNextSteps: [
    "Write the three things that matter most, then remove any option that clearly fails one of them.",
    "Reduce the decision to a few non-negotiables before comparing the options again.",
    "Try choosing the criteria first, rather than choosing the answer first.",
    "Let the decision become smaller by deciding what matters most before deciding what to do.",
  ],

  decisionReminders: [
    "A clearer decision often comes from simpler criteria, not more thinking.",
    "The mind rarely finds peace by multiplying criteria.",
    "A simpler framework often reveals more than more analysis.",
    "The right question is often smaller than the right answer.",
  ],

  socialTitles: [
    "The mind may be replaying the situation.",
    "This sounds like a replay loop.",
    "The thought may be circling around interpretation.",
    "This may be the mind trying to solve uncertainty by replaying it.",
  ],

  socialInsights: [
    "When an interaction feels uncertain, the mind can replay it repeatedly while trying to interpret every detail.",
    "A social loop often grows when the mind starts treating uncertainty like a problem that must be decoded immediately.",
    "The replay may be less about what happened and more about the discomfort of not fully knowing what it meant.",
    "The mind can keep reopening an interaction when the meaning still feels unstable.",
  ],

  socialNextSteps: [
    "Write only what actually happened in plain facts, then stop before interpretation begins.",
    "Separate the event from the meaning the mind is layering onto it.",
    "List what was said or done, without adding conclusions yet.",
    "Try writing the facts first and leaving interpretation for later.",
  ],

  socialReminders: [
    "Not every unknown needs to be solved immediately.",
    "Uncertainty in a conversation is not always a signal of danger.",
    "A replay is not proof that more meaning is hidden inside the moment.",
    "The mind may be searching for certainty where only ambiguity exists.",
  ],

  controlTitles: [
    "This may be a search for certainty.",
    "The mind may be gripping for control here.",
    "This sounds like uncertainty being treated as something that must be eliminated.",
    "The loop may be trying to manufacture certainty.",
  ],

  controlInsights: [
    "Sometimes the mind keeps checking or analysing because certainty feels safer than not knowing.",
    "The loop may be driven by the hope that one more round of checking will finally remove uncertainty.",
    "A mind under pressure often tries to create safety by controlling what cannot fully be controlled.",
    "The repetition may be less about the situation and more about the discomfort of uncertainty itself.",
  ],

  controlNextSteps: [
    "Write one thing that can be controlled right now, and one thing that cannot be controlled at all.",
    "Bring the loop back to one action that is actually available now.",
    "Separate the controllable next step from the uncontrollable outcome.",
    "Ask what is truly actionable here, and what belongs outside your control.",
  ],

  controlReminders: [
    "Relief often begins when attention returns to the next small action.",
    "Control is not the same as safety.",
    "The next useful step is usually smaller than the mind's demand for certainty.",
    "Not everything uncertain needs to be managed into submission.",
  ],

  perfectionTitles: [
    "This may be asking for perfection before movement.",
    "The mind may be delaying action until it feels impossibly ready.",
    "This sounds like perfection getting in front of progress.",
    "The pressure may be coming from needing the answer to be flawless before it begins.",
  ],

  perfectionInsights: [
    "The mind can delay action when it feels like everything has to be right before beginning.",
    "Perfection loops often grow when the first move feels like it has to protect against every possible mistake.",
    "The pressure here may come from treating movement as dangerous unless it is perfect.",
    "Sometimes the loop is created by the belief that imperfect movement is worse than no movement.",
  ],

  perfectionNextSteps: [
    "Define the minimum acceptable version, then complete only that version first.",
    "Reduce the standard until movement becomes possible.",
    "Ask what the smallest good-enough version would look like.",
    "Let the first version exist before asking it to be exceptional.",
  ],

  perfectionReminders: [
    "Progress usually creates more clarity than perfection ever does.",
    "A move made imperfectly is often more useful than a perfect move that never begins.",
    "Perfection often delays the clarity that action would have created.",
    "Movement usually teaches more than prolonged refinement.",
  ],

  relationshipTitles: [
    "This sounds like a difficult thought to carry.",
    "This may be touching something emotionally heavy.",
    "The thought seems to be carrying both uncertainty and emotional weight.",
    "This sounds like more than a simple loop.",
  ],

  relationshipInsights: [
    "When trust feels uncertain, the mind often starts filling the gaps with possibilities and worst-case stories.",
    "A relationship-based loop can grow quickly because the emotional stakes are high and the missing information feels personal.",
    "The mind may be trying to close emotional uncertainty by building explanations before enough is known.",
    "When something personal feels unstable, the mind often rushes to imagine what is happening behind the silence or ambiguity.",
  ],

  relationshipNextSteps: [
    "Instead of trying to solve everything internally, focus on one clear observation or one calm conversation.",
    "Bring the loop back to one fact, one observation, or one conversation that could create real clarity.",
    "Try reducing the loop to what is actually known, and what would need to be asked directly.",
    "A calmer next step may be to separate what has been observed from what has been imagined.",
  ],

  relationshipReminders: [
    "Not every difficult situation needs to be resolved immediately. Clarity sometimes arrives step by step.",
    "The mind often becomes harsher when the heart feels uncertain.",
    "Personal uncertainty can feel urgent without always needing immediate conclusions.",
    "Clarity in emotional situations often comes more gently than the mind would prefer.",
  ],
}