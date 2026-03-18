"use client";

// /app/tools/clear-your-mind/page.tsx

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import MindAnchor3D from "@/components/anchors/MindAnchor3D";

const MAX_INPUT_LENGTH = 1200;
const BUTTON_READY_DELAY_MS = 1400;
const THINKING_COPY = "SOLACE IS REFLECTING...";

function getParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export default function ClearYourMindPage() {
  const [input, setInput] = useState("");
  const [responseText, setResponseText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCrisisFallback, setIsCrisisFallback] = useState(false);
  const [isButtonReady, setIsButtonReady] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const remainingCharacters = useMemo(
    () => MAX_INPUT_LENGTH - input.length,
    [input.length]
  );

  useEffect(() => {
    if (isLoading || responseText || error) {
      setIsButtonReady(false);
      return;
    }

    const trimmed = input.trim();

    if (!trimmed) {
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
  }, [input, isLoading, responseText, error]);

  useEffect(() => {
    if (!isLoading && (responseText || error)) {
      inputRef.current?.focus();
    }
  }, [responseText, error, isLoading]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput) {
      setError("Please enter what is on your mind first.");
      setResponseText("");
      setIsCrisisFallback(false);
      setIsButtonReady(false);
      return;
    }

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
          input: trimmedInput,
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
    setInput("");
    setResponseText("");
    setError("");
    setIsLoading(false);
    setIsCrisisFallback(false);
    setIsButtonReady(false);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  const responseParagraphs = getParagraphs(responseText);

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

        <div className="anchor-stage" aria-hidden="true">
          <MindAnchor3D />
        </div>

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
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={MAX_INPUT_LENGTH}
            placeholder="Write what feels tangled."
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

        .anchor-stage {
          width: 100%;
          max-width: 760px;
          margin-top: 8px;
          margin-bottom: -10px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
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
          min-height: 176px;
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

          .anchor-stage {
            margin-top: 0;
            margin-bottom: -6px;
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
            min-height: 168px;
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
        }
      `}</style>
    </main>
  );
}