"use client";

import { useMemo, useState } from "react";

type ToolMode = "clarity" | "overthinking-breaker" | "decision-filter";

type ToolContainerProps = {
  placeholder?: string;
  mode: ToolMode;
};

function getLastMeaningfulLine(text: string): string {
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.length ? lines[lines.length - 1] : "";
}

function looksLikeGibberish(text: string): boolean {
  const cleaned = text.replace(/[^a-zA-Z\s?]/g, "").trim();
  if (!cleaned) return true;

  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 1 && words[0].length > 14) return true;

  const vowels = (cleaned.match(/[aeiouAEIOU]/g) || []).length;
  const letters = (cleaned.match(/[a-zA-Z]/g) || []).length;
  if (letters > 0 && vowels / letters < 0.18) return true;

  return false;
}

function buildClarityResponse(question: string): string {
  const lower = question.toLowerCase();

  if (looksLikeGibberish(question)) {
    return `This does not seem like a clear question yet.

Try writing one real decision in a simple sentence, and Solace will reflect on that.`;
  }

  if (
    lower.includes("job") ||
    lower.includes("work") ||
    lower.includes("career") ||
    lower.includes("role")
  ) {
    return `It sounds like this may not only be a work decision, but a life-direction decision.

Part of the weight may be coming from what each option represents: stability, growth, freedom, or identity.

A useful next step may be to ask which risk feels harder to carry: the risk of change, or the risk of staying where friction already exists.`;
  }

  if (
    lower.includes("colombia") ||
    lower.includes("australia") ||
    lower.includes("europe") ||
    lower.includes("sydney") ||
    lower.includes("melbourne") ||
    lower.includes("move") ||
    lower.includes("stay")
  ) {
    return `It sounds like this decision may be carrying more than geography. It may also be about belonging, lifestyle, future direction, or identity.

Place-based decisions often feel heavy because they quietly reshape many other parts of life at once.

A useful next step may be to ask what each place represents for you emotionally, not only practically.`;
  }

  if (
    lower.includes("married") ||
    lower.includes("single") ||
    lower.includes("relationship") ||
    lower.includes("partner")
  ) {
    return `It sounds like this question may be less about the label itself and more about what kind of future or connection feels true for you.

Relationship decisions often become heavy when they carry hope, fear, timing, and identity all at once.

A useful next step may be to ask whether you are choosing from clarity, fear, or pressure.`;
  }

  return `It sounds like this decision may be carrying more than one layer at the same time.

Part of the weight may be coming not only from the choice itself, but from what that choice could change in your life.

A useful next step may be to ask which part feels hardest right now: the practical outcome, the emotional cost, or the identity shift behind it.`;
}

function buildOverthinkingResponse(question: string): string {
  const lower = question.toLowerCase();

  if (looksLikeGibberish(question)) {
    return `This does not seem like a clear thought yet.

Try writing the thought that keeps repeating in one simple sentence.`;
  }

  if (
    lower.includes("conversation") ||
    lower.includes("said") ||
    lower.includes("text") ||
    lower.includes("message")
  ) {
    return `It sounds like your mind may be replaying an interaction in search of closure or certainty.

When a conversation keeps looping, it often means the emotional meaning of it has stayed active longer than the words themselves.

A useful next step may be to ask what is still unresolved for you: what was said, what it meant, or what you wish had happened instead.`;
  }

  return `It sounds like the same thought may be circling repeatedly, not because it is helping, but because your mind is still trying to settle something.

When thinking turns repetitive, the loop itself can start creating pressure that makes the issue feel larger.

A useful next step may be to separate what truly needs action from what is only mental repetition.`;
}

function buildDecisionFilterResponse(question: string): string {
  const lower = question.toLowerCase();

  if (looksLikeGibberish(question)) {
    return `This does not seem like a clear question yet.

Try writing the situation in one clean sentence so Solace can filter the noise more accurately.`;
  }

  if (
    lower.includes("family") ||
    lower.includes("money") ||
    lower.includes("career") ||
    lower.includes("work") ||
    lower.includes("mortgage")
  ) {
    return `It sounds like this situation may contain both practical pressure and emotional pressure at the same time.

When several serious factors sit in the same frame, everything can start to feel equally urgent even when it is not.

A useful next step may be to sort this into three layers: what is essential, what is important but not urgent, and what is only adding noise.`;
  }

  return `It sounds like there may be too many active factors competing for attention at once.

When everything feels equally important, the mind often struggles to identify what should actually lead the decision.

A useful next step may be to reduce the frame and ask what is truly essential here, and what is only making the situation louder.`;
}

function buildReflection(mode: ToolMode, question: string): string {
  switch (mode) {
    case "clarity":
      return buildClarityResponse(question);
    case "overthinking-breaker":
      return buildOverthinkingResponse(question);
    case "decision-filter":
      return buildDecisionFilterResponse(question);
    default:
      return "";
  }
}

export default function ToolContainer({
  placeholder = "Write your question here...",
  mode,
}: ToolContainerProps) {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [isBreathing, setIsBreathing] = useState(false);
  const [isWorking, setIsWorking] = useState(false);

  const activeQuestion = useMemo(() => getLastMeaningfulLine(text), [text]);
  const canSend = Boolean(activeQuestion);

  async function handleReflect() {
    if (!activeQuestion || isWorking) return;

    setIsWorking(true);
    setIsBreathing(true);
    setResponse("");

    await new Promise((resolve) => setTimeout(resolve, 1700));

    const result = buildReflection(mode, activeQuestion);

    setIsBreathing(false);
    setResponse(result);
    setIsWorking(false);
  }

  return (
    <div
      className={`surface-card ${isBreathing ? "solace-breathing-card" : ""}`}
      style={{
        minHeight: 500,
        padding: "2rem",
        display: "grid",
        gap: "1.5rem",
        alignContent: "start",
        background: "rgba(255,255,255,0.88)",
        border: "1px solid rgba(55,65,81,0.05)",
        boxShadow: "0 10px 24px rgba(31,41,55,0.035)",
      }}
    >
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        rows={8}
        style={{
          width: "100%",
          resize: "vertical",
          minHeight: 230,
          background: "transparent",
          border: "none",
          outline: "none",
          color: "var(--color-text)",
          fontSize: "1.15rem",
          lineHeight: 1.8,
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          type="button"
          onClick={handleReflect}
          disabled={!canSend || isWorking}
          className="solace-send-button"
        >
          {isWorking ? "Reflecting..." : "Get reflection"}
        </button>
      </div>

      {response && (
        <div
          className="fade-up"
          style={{
            paddingTop: "1.35rem",
            borderTop: "1px solid rgba(55,65,81,0.08)",
            fontSize: "1.08rem",
            lineHeight: 1.95,
            color: "var(--color-text)",
            whiteSpace: "pre-wrap",
          }}
        >
          {response}
        </div>
      )}
    </div>
  );
}