"use client";

// /app/tools/clear-your-mind/page.tsx

import Link from "next/link";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const MAX_INPUT_LENGTH = 1200;
const MAX_BUBBLES = 12;
const BUTTON_READY_DELAY_MS = 900;
const THINKING_COPY = "SOLACE IS REFLECTING...";

type BubbleItem = {
  id: string;
  text: string;
  size: "small" | "medium" | "large";
  width: number;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  delay: number;
};

function getParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function getBubbleSize(text: string): "small" | "medium" | "large" {
  const length = text.trim().length;

  if (length <= 42) return "small";
  if (length <= 90) return "medium";
  return "large";
}

function getBubbleWidth(size: "small" | "medium" | "large", text: string): number {
  if (size === "small") {
    return Math.min(190 + text.length * 1.6, 250);
  }

  if (size === "medium") {
    return Math.min(240 + text.length * 1.2, 330);
  }

  return Math.min(300 + text.length * 0.85, 400);
}

function buildBubble(text: string, index: number): BubbleItem {
  const size = getBubbleSize(text);
  const width = getBubbleWidth(size, text);

  const positions = [
    { x: 50, y: 22 },
    { x: 26, y: 50 },
    { x: 74, y: 48 },
    { x: 38, y: 76 },
    { x: 63, y: 78 },
    { x: 18, y: 26 },
    { x: 82, y: 27 },
    { x: 10, y: 62 },
    { x: 90, y: 64 },
    { x: 49, y: 58 },
    { x: 31, y: 34 },
    { x: 69, y: 35 },
  ];

  const drifts = [
    { driftX: -8, driftY: -7 },
    { driftX: 10, driftY: -9 },
    { driftX: -7, driftY: 8 },
    { driftX: 8, driftY: 7 },
    { driftX: -6, driftY: -6 },
    { driftX: 7, driftY: 5 },
    { driftX: -9, driftY: 6 },
    { driftX: 6, driftY: -8 },
    { driftX: -5, driftY: 7 },
    { driftX: 4, driftY: -5 },
    { driftX: 5, driftY: 6 },
    { driftX: -4, driftY: -6 },
  ];

  const pos = positions[index % positions.length];
  const drift = drifts[index % drifts.length];

  return {
    id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    size,
    width,
    x: pos.x,
    y: pos.y,
    driftX: drift.driftX,
    driftY: drift.driftY,
    delay: index * 120,
  };
}

export default function ClearYourMindPage() {
  const [draft, setDraft] = useState("");
  const [bubbles, setBubbles] = useState<BubbleItem[]>([]);
  const [responseText, setResponseText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCrisisFallback, setIsCrisisFallback] = useState(false);
  const [isButtonReady, setIsButtonReady] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const remainingCharacters = useMemo(
    () => MAX_INPUT_LENGTH - draft.length,
    [draft.length]
  );

  const responseParagraphs = useMemo(
    () => getParagraphs(responseText),
    [responseText]
  );

  const hasBubbleContent = bubbles.length > 0;
  const canSubmit = hasBubbleContent && !isLoading;

  useEffect(() => {
    if (isLoading || responseText || error || !hasBubbleContent) {
      setIsButtonReady(false);
      return;
    }

    setIsButtonReady(false);

    const timer = window.setTimeout(() => {
      setIsButtonReady(true);
    }, BUTTON_READY_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [hasBubbleContent, isLoading, responseText, error]);

  useEffect(() => {
    if (!isLoading && (responseText || error)) {
      inputRef.current?.focus();
    }
  }, [responseText, error, isLoading]);

  function addBubbleFromDraft() {
    const trimmed = draft.trim();

    if (!trimmed) return;

    setBubbles((current) => {
      const next = [...current, buildBubble(trimmed, current.length)];
      return next.slice(-MAX_BUBBLES);
    });

    setDraft("");
    setResponseText("");
    setError("");
    setIsCrisisFallback(false);
  }

  function handleTextareaKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      addBubbleFromDraft();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!bubbles.length) {
      setError("Add at least one thought first. Press Enter to turn it into a bubble.");
      setResponseText("");
      setIsCrisisFallback(false);
      setIsButtonReady(false);
      return;
    }

    const combinedInput = bubbles.map((bubble) => bubble.text).join("\n\n");

    setIsLoading(true);
    setError("");
    setResponseText("");
    setIsCrisisFallback(false);
    setIsButtonReady(false);

    try {
      const response = await fetch("/api/solace/clear-your-mind", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: combinedInput,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          typeof data?.error === "string"
            ? data.error
            : "Something went wrong. Please try again."
        );
        return;
      }

      const text =
        typeof data?.text === "string"
          ? data.text.trim()
          : "Something went wrong. Please try again.";

      setResponseText(text);
      setIsCrisisFallback(Boolean(data?.isCrisisFallback));
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setDraft("");
    setBubbles([]);
    setResponseText("");
    setError("");
    setIsLoading(false);
    setIsCrisisFallback(false);
    setIsButtonReady(false);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  function removeBubble(id: string) {
    setBubbles((current) => current.filter((bubble) => bubble.id !== id));
  }

  return (
    <main className="mind-realm">
      <div className="realm-bg-stage" aria-hidden="true">
        <img
          src="/realms/emerald/emerald-realm-master.png"
          alt=""
          className="realm-bg-image"
        />
      </div>

      <div className="realm-bg-vignette" aria-hidden="true" />
      <div className="realm-bg-soften" aria-hidden="true" />
      <div className="realm-mind-wash" aria-hidden="true" />
      <div className="realm-center-halo" aria-hidden="true" />

      <section className="realm-content">
        <div className="realm-intro">
          <p className="realm-label">Mind realm</p>

          <h1 className="title">Clear your mind</h1>

          <p className="subtitle">
            Untangle overthinking, mental loops, and emotional build-up into
            something a little clearer.
          </p>
        </div>

        <section className="bubble-stage" aria-label="Thought bubbles">
          <div
            className={`bubble-field ${
              isLoading ? "bubble-field-gathering" : ""
            } ${responseText ? "bubble-field-softened" : ""}`}
          >
            {bubbles.length === 0 ? (
              <div className="bubble-empty">
                Press Enter to turn each thought into a bubble.
              </div>
            ) : (
              bubbles.map((bubble) => (
                <button
                  key={bubble.id}
                  type="button"
                  className={`thought-bubble thought-bubble-${bubble.size} ${
                    isLoading ? "thought-bubble-gathering" : ""
                  } ${responseText ? "thought-bubble-softened" : ""}`}
                  style={
                    {
                      "--bubble-width": `${bubble.width}px`,
                      "--bubble-x": `${bubble.x}%`,
                      "--bubble-y": `${bubble.y}%`,
                      "--bubble-drift-x": `${bubble.driftX}px`,
                      "--bubble-drift-y": `${bubble.driftY}px`,
                      "--bubble-delay": `${bubble.delay}ms`,
                    } as React.CSSProperties
                  }
                  onClick={() => removeBubble(bubble.id)}
                  title="Remove bubble"
                >
                  <span className="thought-bubble-text">{bubble.text}</span>
                </button>
              ))
            )}
          </div>
        </section>

        <form className="mind-form" onSubmit={handleSubmit}>
          <div className="scope-inline">
            <span className="scope-inline-copy">Adults 18+ only</span>
            <span className="scope-separator">·</span>
            <span className="scope-inline-copy">Reflective clarity tool</span>
            <span className="scope-separator">·</span>
            <span className="scope-inline-copy">Not professional advice</span>
            <span className="scope-separator">·</span>
            <Link href="/scope" className="scope-inline-link">
              Scope
            </Link>
          </div>

          <label htmlFor="clear-your-mind-input" className="prompt">
            What feels tangled right now?
          </label>

          <textarea
            id="clear-your-mind-input"
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleTextareaKeyDown}
            maxLength={MAX_INPUT_LENGTH}
            placeholder="Write one thought, then press Enter to bubble it."
            className="mind-input"
            disabled={isLoading}
          />

          <div className="form-meta">
            <p className="character-count">
              {remainingCharacters} characters remaining
            </p>
          </div>

          {!responseText && !error && !isLoading && (
            <div className="actions actions-initial">
              <button
                type="submit"
                className={`primary-button ${
                  isButtonReady ? "primary-button-ready" : ""
                }`}
                disabled={!canSubmit}
              >
                Clear your mind
              </button>
            </div>
          )}
        </form>

        <section className="response-zone" aria-live="polite">
          {isLoading ? (
            <div className="loading-zone">
              <p className="loading-copy">{THINKING_COPY}</p>
            </div>
          ) : error ? (
            <>
              <div className="response-card">
                <div className="response-card-label">Solace</div>
                <p className="response-text">{error}</p>
              </div>

              <div className="actions actions-followup">
                <button
                  type="button"
                  onClick={handleReset}
                  className="secondary-button"
                >
                  Start again
                </button>
              </div>
            </>
          ) : responseText ? (
            <>
              <div
                className={`response-card ${
                  isCrisisFallback ? "response-card-crisis" : ""
                }`}
              >
                <div className="response-card-label">
                  {isCrisisFallback ? "Important" : "Solace reflection"}
                </div>

                <div className="response-copy">
                  {responseParagraphs.map((paragraph, index) => (
                    <p key={`${paragraph}-${index}`} className="response-text">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div className="actions actions-followup">
                <button
                  type="button"
                  onClick={handleReset}
                  className="secondary-button"
                >
                  Clear another thought
                </button>
              </div>
            </>
          ) : null}
        </section>
      </section>

      <style jsx>{`
        .mind-realm {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background: #05050a;
        }

        .realm-bg-stage {
          position: fixed;
          inset: 0;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
        }

        .realm-bg-image {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: block;
          width: auto;
          height: auto;
          max-width: none;
          max-height: none;
          user-select: none;
          -webkit-user-drag: none;
          opacity: 0.82;
          filter: saturate(0.88) hue-rotate(32deg) brightness(0.82);
        }

        .realm-bg-vignette {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: radial-gradient(
            ellipse at center,
            rgba(0, 0, 0, 0) 34%,
            rgba(0, 0, 0, 0.18) 68%,
            rgba(0, 0, 0, 0.44) 100%
          );
        }

        .realm-bg-soften {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(10, 9, 16, 0.14) 0%,
            rgba(10, 9, 16, 0.04) 24%,
            rgba(10, 9, 16, 0.04) 76%,
            rgba(10, 9, 16, 0.16) 100%
          );
        }

        .realm-mind-wash {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            radial-gradient(
              ellipse at 50% 24%,
              rgba(215, 182, 255, 0.16) 0%,
              rgba(215, 182, 255, 0.09) 16%,
              rgba(215, 182, 255, 0.03) 34%,
              rgba(215, 182, 255, 0) 54%
            ),
            radial-gradient(
              ellipse at 82% 28%,
              rgba(198, 210, 255, 0.06) 0%,
              rgba(198, 210, 255, 0.02) 28%,
              rgba(198, 210, 255, 0) 48%
            );
        }

        .realm-center-halo {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: radial-gradient(
            ellipse at center,
            rgba(224, 196, 255, 0.07) 0%,
            rgba(224, 196, 255, 0.03) 20%,
            rgba(224, 196, 255, 0.012) 34%,
            rgba(224, 196, 255, 0) 50%
          );
          filter: blur(12px);
        }

        .realm-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
          padding: 92px 24px 88px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .realm-intro {
          max-width: 820px;
        }

        .realm-label {
          margin: 0 0 14px;
          font-size: 0.78rem;
          font-weight: 560;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(236, 226, 246, 0.56);
          text-shadow: 0 4px 16px rgba(0, 0, 0, 0.24);
        }

        .title {
          margin: 0;
          font-size: clamp(3.5rem, 7vw, 6rem);
          font-weight: 650;
          line-height: 0.94;
          letter-spacing: -0.06em;
          color: rgba(247, 244, 252, 0.99);
          text-shadow:
            0 10px 28px rgba(0, 0, 0, 0.3),
            0 0 24px rgba(226, 202, 255, 0.08);
        }

        .subtitle {
          margin: 16px 0 0;
          max-width: 760px;
          font-size: 1.02rem;
          line-height: 1.72;
          color: rgba(240, 234, 248, 0.9);
          text-shadow: 0 3px 16px rgba(0, 0, 0, 0.24);
        }

        .bubble-stage {
          width: 100%;
          max-width: 760px;
          margin-top: 18px;
          margin-bottom: 18px;
        }

        .bubble-field {
          position: relative;
          width: 100%;
          height: 280px;
          border-radius: 36px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: linear-gradient(
            180deg,
            rgba(18, 18, 30, 0.42) 0%,
            rgba(13, 13, 22, 0.52) 100%
          );
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.05),
            0 18px 40px rgba(0, 0, 0, 0.18);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          overflow: hidden;
        }

        .bubble-field::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            rgba(220, 196, 255, 0.06) 0%,
            rgba(220, 196, 255, 0.02) 28%,
            rgba(220, 196, 255, 0) 60%
          );
          pointer-events: none;
        }

        .bubble-field-gathering .thought-bubble {
          animation-play-state: running;
        }

        .bubble-field-softened .thought-bubble {
          opacity: 0.56;
          filter: saturate(0.88);
        }

        .bubble-empty {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px;
          color: rgba(241, 234, 249, 0.42);
          font-size: 0.98rem;
          line-height: 1.6;
        }

        .thought-bubble {
          position: absolute;
          left: var(--bubble-x);
          top: var(--bubble-y);
          width: var(--bubble-width);
          max-width: min(var(--bubble-width), 84%);
          transform: translate(-50%, -50%);
          padding: 14px 18px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background:
            radial-gradient(
              circle at 28% 24%,
              rgba(255, 255, 255, 0.18) 0%,
              rgba(255, 255, 255, 0.06) 18%,
              rgba(255, 255, 255, 0) 36%
            ),
            linear-gradient(
              180deg,
              rgba(178, 150, 224, 0.28) 0%,
              rgba(118, 97, 165, 0.24) 100%
            );
          box-shadow:
            0 14px 32px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -8px 16px rgba(39, 31, 58, 0.18),
            0 0 24px rgba(219, 192, 255, 0.06);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          color: rgba(247, 244, 252, 0.96);
          animation:
            bubbleAppear 520ms cubic-bezier(0.22, 1, 0.36, 1),
            bubbleFloat 7.8s ease-in-out infinite;
          animation-delay: var(--bubble-delay), calc(var(--bubble-delay) * -1);
          cursor: pointer;
          text-align: center;
        }

        .thought-bubble:hover {
          border-color: rgba(255, 255, 255, 0.24);
        }

        .thought-bubble-gathering {
          animation:
            bubbleAppear 520ms cubic-bezier(0.22, 1, 0.36, 1),
            bubbleGather 1.8s ease-in-out forwards;
        }

        .thought-bubble-softened {
          transition: opacity 260ms ease, filter 260ms ease;
        }

        .thought-bubble-small {
          min-height: 54px;
          font-size: 0.94rem;
        }

        .thought-bubble-medium {
          min-height: 68px;
          font-size: 0.98rem;
        }

        .thought-bubble-large {
          min-height: 84px;
          font-size: 1rem;
          border-radius: 28px;
          padding-top: 16px;
          padding-bottom: 16px;
        }

        .thought-bubble-text {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.45;
          text-wrap: balance;
        }

        .mind-form {
          width: 100%;
          max-width: 760px;
          margin-top: 0;
        }

        .scope-inline {
          margin: 0 0 10px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0;
          font-size: 0.78rem;
          line-height: 1.45;
          color: rgba(240, 234, 248, 0.42);
          text-align: center;
          text-wrap: balance;
        }

        .scope-inline-copy {
          color: rgba(240, 234, 248, 0.42);
        }

        .scope-separator {
          padding: 0 0.26rem;
          color: rgba(240, 234, 248, 0.28);
        }

        .scope-inline-link {
          color: rgba(247, 244, 252, 0.72);
          text-decoration: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.14);
          line-height: 1.1;
          transition: color 160ms ease, border-color 160ms ease;
        }

        .scope-inline-link:hover {
          color: rgba(255, 255, 255, 0.92);
          border-color: rgba(255, 255, 255, 0.28);
        }

        .prompt {
          display: block;
          margin: 0 0 14px;
          font-size: 1.02rem;
          font-weight: 540;
          color: rgba(247, 244, 252, 0.96);
          text-shadow: 0 4px 14px rgba(0, 0, 0, 0.32);
        }

        .mind-input {
          width: 100%;
          min-height: 140px;
          padding: 22px 26px;
          border-radius: 32px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: linear-gradient(
            180deg,
            rgba(21, 18, 28, 0.66) 0%,
            rgba(15, 14, 24, 0.74) 100%
          );
          box-shadow:
            0 20px 44px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.11),
            inset 0 -1px 0 rgba(255, 255, 255, 0.03),
            0 0 0 1px rgba(228, 204, 255, 0.03),
            0 0 30px rgba(205, 176, 255, 0.035);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          color: rgba(247, 244, 252, 0.97);
          font-size: 1rem;
          line-height: 1.65;
          resize: none;
          outline: none;
          transition:
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .mind-input:focus {
          border-color: rgba(226, 202, 255, 0.32);
          box-shadow:
            0 22px 48px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            0 0 0 1px rgba(226, 202, 255, 0.08),
            0 0 34px rgba(204, 170, 255, 0.07);
        }

        .mind-input::placeholder {
          color: rgba(223, 214, 236, 0.5);
        }

        .form-meta {
          margin-top: 12px;
          display: flex;
          justify-content: center;
        }

        .character-count {
          margin: 0;
          font-size: 0.78rem;
          color: rgba(240, 234, 248, 0.38);
        }

        .actions {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .actions-initial {
          margin-top: 20px;
        }

        .actions-followup {
          margin-top: 16px;
        }

        .primary-button,
        .secondary-button {
          position: relative;
          min-width: 186px;
          min-height: 56px;
          padding: 0 24px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: rgba(247, 244, 252, 0.98);
          font-size: 0.98rem;
          font-weight: 550;
          cursor: pointer;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition:
            transform 220ms ease,
            box-shadow 220ms ease,
            border-color 220ms ease,
            background 220ms ease,
            opacity 220ms ease,
            filter 220ms ease;
          overflow: hidden;
        }

        .primary-button::before,
        .secondary-button::before {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: inherit;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.025) 48%,
            rgba(255, 255, 255, 0.01) 100%
          );
        }

        .primary-button {
          background: linear-gradient(
            180deg,
            rgba(138, 116, 173, 0.52) 0%,
            rgba(99, 82, 136, 0.66) 100%
          );
          box-shadow:
            0 16px 34px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -10px 18px rgba(42, 33, 62, 0.26),
            0 0 22px rgba(212, 176, 255, 0.06);
        }

        .primary-button-ready {
          border-color: rgba(236, 216, 255, 0.28);
          background: linear-gradient(
            180deg,
            rgba(149, 126, 188, 0.58) 0%,
            rgba(108, 89, 149, 0.72) 100%
          );
          box-shadow:
            0 18px 38px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            inset 0 -10px 18px rgba(42, 33, 62, 0.26),
            0 0 28px rgba(220, 188, 255, 0.08);
          filter: brightness(1.03);
        }

        .secondary-button {
          background: linear-gradient(
            180deg,
            rgba(113, 96, 144, 0.48) 0%,
            rgba(82, 67, 113, 0.6) 100%
          );
          box-shadow:
            0 16px 34px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 -10px 18px rgba(33, 27, 48, 0.24);
        }

        .primary-button:hover,
        .secondary-button:hover {
          transform: translateY(-1px);
          border-color: rgba(255, 255, 255, 0.22);
        }

        .primary-button:hover {
          background: linear-gradient(
            180deg,
            rgba(126, 105, 161, 0.66) 0%,
            rgba(90, 74, 124, 0.8) 100%
          );
          box-shadow:
            0 18px 38px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 -12px 20px rgba(33, 27, 48, 0.3),
            0 0 24px rgba(210, 175, 255, 0.05);
        }

        .primary-button-ready:hover {
          background: linear-gradient(
            180deg,
            rgba(136, 114, 174, 0.7) 0%,
            rgba(98, 81, 136, 0.84) 100%
          );
          box-shadow:
            0 20px 42px rgba(0, 0, 0, 0.34),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -12px 20px rgba(33, 27, 48, 0.3),
            0 0 30px rgba(220, 188, 255, 0.08);
        }

        .secondary-button:hover {
          background: linear-gradient(
            180deg,
            rgba(100, 84, 130, 0.64) 0%,
            rgba(71, 58, 99, 0.76) 100%
          );
          box-shadow:
            0 18px 38px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 -12px 20px rgba(33, 27, 48, 0.28);
        }

        .primary-button:active,
        .secondary-button:active {
          transform: translateY(1px);
          background: linear-gradient(
            180deg,
            rgba(75, 62, 104, 0.78) 0%,
            rgba(53, 43, 77, 0.88) 100%
          );
          box-shadow:
            0 10px 22px rgba(0, 0, 0, 0.26),
            inset 0 2px 6px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .primary-button:disabled,
        .secondary-button:disabled {
          opacity: 0.65;
          cursor: default;
          transform: none;
        }

        .loading-zone {
          margin-top: 12px;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .loading-copy {
          margin: 0;
          font-size: 0.75rem;
          font-weight: 560;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(247, 244, 252, 0.96);
          text-shadow:
            0 4px 16px rgba(0, 0, 0, 0.26),
            0 0 10px rgba(222, 198, 255, 0.08);
          animation: solaceBreathing 3.2s ease-in-out infinite;
        }

        .response-zone {
          margin-top: 18px;
          width: 100%;
          max-width: 760px;
          min-height: 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .response-card {
          width: 100%;
          max-width: 760px;
          margin-top: 0;
          padding: 22px 26px;
          border-radius: 32px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: linear-gradient(
            180deg,
            rgba(21, 18, 28, 0.66) 0%,
            rgba(15, 14, 24, 0.74) 100%
          );
          box-shadow:
            0 20px 44px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            inset 0 -1px 0 rgba(255, 255, 255, 0.03),
            0 0 0 1px rgba(228, 204, 255, 0.03),
            0 0 24px rgba(206, 176, 255, 0.03);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          animation: responseReveal 600ms ease forwards;
          opacity: 0;
          transform: translateY(12px);
        }

        .response-card-crisis {
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow:
            0 20px 44px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            inset 0 -1px 0 rgba(255, 255, 255, 0.03),
            0 0 0 1px rgba(255, 255, 255, 0.03);
        }

        .response-card-label {
          margin-bottom: 12px;
          font-size: 0.75rem;
          font-weight: 560;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(225, 214, 238, 0.66);
        }

        .response-copy {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .response-text {
          margin: 0;
          color: rgba(247, 244, 252, 0.96);
          line-height: 1.8;
          text-shadow: 0 5px 18px rgba(0, 0, 0, 0.26);
          white-space: pre-line;
        }

        @keyframes bubbleAppear {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes bubbleFloat {
          0% {
            transform: translate(-50%, -50%) translate(0, 0) scale(1);
          }
          25% {
            transform: translate(-50%, -50%)
              translate(var(--bubble-drift-x), calc(var(--bubble-drift-y) * -0.4))
              scale(1.02);
          }
          50% {
            transform: translate(-50%, -50%)
              translate(calc(var(--bubble-drift-x) * -0.55), var(--bubble-drift-y))
              scale(0.995);
          }
          75% {
            transform: translate(-50%, -50%)
              translate(calc(var(--bubble-drift-x) * 0.4), calc(var(--bubble-drift-y) * 0.3))
              scale(1.015);
          }
          100% {
            transform: translate(-50%, -50%) translate(0, 0) scale(1);
          }
        }

        @keyframes bubbleGather {
          0% {
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            transform: translate(-50%, -50%) scale(0.94);
          }
        }

        @keyframes responseReveal {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes solaceBreathing {
          0% {
            transform: scale(0.98);
            opacity: 0.85;
          }
          50% {
            transform: scale(1.04);
            opacity: 1;
          }
          100% {
            transform: scale(0.98);
            opacity: 0.85;
          }
        }

        @media (max-width: 900px) {
          .realm-content {
            padding-top: 86px;
          }
        }

        @media (max-width: 640px) {
          .realm-content {
            padding-top: 78px;
            padding-left: 18px;
            padding-right: 18px;
          }

          .bubble-stage {
            margin-top: 14px;
          }

          .bubble-field {
            height: 250px;
            border-radius: 28px;
          }

          .scope-inline {
            font-size: 0.74rem;
            margin-bottom: 9px;
            line-height: 1.4;
          }

          .scope-separator {
            padding: 0 0.22rem;
          }

          .mind-input {
            min-height: 136px;
            padding: 20px 20px 22px;
            border-radius: 24px;
          }

          .actions {
            flex-direction: column;
          }

          .primary-button,
          .secondary-button {
            width: 100%;
          }

          .response-card {
            padding: 20px 20px 22px;
            border-radius: 24px;
          }

          .thought-bubble {
            max-width: 88%;
            padding-left: 16px;
            padding-right: 16px;
          }
        }
      `}</style>
    </main>
  );
}