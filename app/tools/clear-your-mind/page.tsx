"use client";

// /app/tools/clear-your-mind/page.tsx

import Link from "next/link";
import {
  type CSSProperties,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const MAX_THOUGHTS = 7;
const MAX_INPUT_LENGTH = 140;
const BUTTON_READY_DELAY_MS = 900;
const THINKING_COPY = "SOLACE IS REFLECTING...";
const STARTER_BUBBLE_ID = "starter-bubble";
const FIELD_HEIGHT = 320;
const ORGANIZE_DELAY_MS = 1600;

type BubbleMode = "float" | "organizing" | "aligned";

type BubbleItem = {
  id: string;
  text: string;
  diameter: number;
  importance: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  hue: number;
  delay: number;
  seed: number;
  fontSize: number;
  depth: number;
  isStarter?: boolean;
};

function getParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function getImportance(text: string): number {
  const trimmed = text.trim().toLowerCase();

  let score = 0;
  score += Math.min(trimmed.length * 1.35, 90);

  const weightedTerms: Array<[RegExp, number]> = [
    [/\b(bills|bill|rent|mortgage|debt|loan|money|broke|not enough money)\b/g, 48],
    [/\b(wife|husband|partner|marriage|family|kids|children|mother in law|mother-in-law|mother|parents)\b/g, 38],
    [/\b(work|job|career|office|boss|income)\b/g, 30],
    [/\b(health|sick|ill|doctor|hospital|fat|weight|body|smoking)\b/g, 32],
    [/\b(anxiety|stress|fear|panic|overthinking|sad|depressed)\b/g, 34],
    [/\b(moving|move|relocate|selling house|sell house)\b/g, 28],
    [/\b(dogs|dog|barking|noise|neighbours|neighbors|kids playing at night)\b/g, 18],
    [/\b(gaming|addiction)\b/g, 18],
  ];

  for (const [pattern, weight] of weightedTerms) {
    const matches = trimmed.match(pattern);
    if (matches) {
      score += matches.length * weight;
    }
  }

  if (trimmed.includes("not enough")) score += 26;
  if (trimmed.includes("or not")) score += 14;
  if (trimmed.includes("?")) score += 8;
  if (trimmed.includes("can't")) score += 14;
  if (trimmed.includes("cannot")) score += 14;
  if (trimmed.includes("never")) score += 10;
  if (trimmed.includes("always")) score += 10;
  if (trimmed.split(" ").length >= 4) score += 12;

  return Math.max(10, Math.min(score, 220));
}

function getBubbleDiameter(importance: number): number {
  if (importance <= 35) return 82;
  if (importance <= 60) return 98;
  if (importance <= 90) return 118;
  if (importance <= 125) return 144;
  if (importance <= 165) return 172;
  return 212;
}

function getBubbleDepth(diameter: number): number {
  return Math.max(0, Math.min(1, (diameter - 82) / (212 - 82)));
}

function getLongestWordLength(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .reduce((max, word) => Math.max(max, word.length), 0);
}

function getBubbleFontSize(text: string, diameter: number): number {
  const length = text.trim().length;
  const longestWord = getLongestWordLength(text);

  if (diameter >= 188) {
    if (longestWord >= 14) return 12.8;
    if (length <= 14) return 19;
    if (length <= 24) return 17;
    if (length <= 36) return 15;
    return 13.5;
  }

  if (diameter >= 150) {
    if (longestWord >= 13) return 12.4;
    if (length <= 14) return 17;
    if (length <= 24) return 15.5;
    if (length <= 34) return 14;
    return 12.8;
  }

  if (diameter >= 118) {
    if (longestWord >= 12) return 11.8;
    if (length <= 12) return 15.5;
    if (length <= 20) return 14;
    if (length <= 30) return 12.8;
    return 11.8;
  }

  if (longestWord >= 10) return 10.6;
  if (length <= 10) return 14;
  if (length <= 18) return 12.8;
  return 11.2;
}

function createStarterBubble(fieldWidth: number): BubbleItem {
  const diameter = Math.min(182, Math.max(160, fieldWidth * 0.17));

  return {
    id: STARTER_BUBBLE_ID,
    text: "",
    diameter,
    importance: 999,
    x: fieldWidth / 2,
    y: FIELD_HEIGHT / 2,
    vx: 0,
    vy: 0,
    hue: 214,
    delay: 0,
    seed: 0.5,
    fontSize: 16,
    depth: 0.3,
    isStarter: true,
  };
}

function buildBubble(text: string, index: number, fieldWidth: number): BubbleItem {
  const importance = getImportance(text);
  const diameter = getBubbleDiameter(importance);
  const depth = getBubbleDepth(diameter);

  const positions = [
    { x: 0.18, y: 0.28 },
    { x: 0.5, y: 0.2 },
    { x: 0.8, y: 0.28 },
    { x: 0.28, y: 0.68 },
    { x: 0.68, y: 0.68 },
    { x: 0.14, y: 0.52 },
    { x: 0.86, y: 0.52 },
  ];

  const drifts = [
    { vx: 1.18, vy: -0.62 },
    { vx: -1.04, vy: 0.72 },
    { vx: 0.82, vy: 0.94 },
    { vx: -0.92, vy: -0.96 },
    { vx: 0.74, vy: -0.82 },
    { vx: -1.06, vy: 0.58 },
    { vx: 0.94, vy: -0.52 },
  ];

  const position = positions[index % positions.length];
  const drift = drifts[index % drifts.length];

  return {
    id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    diameter,
    importance,
    x: fieldWidth * position.x,
    y: FIELD_HEIGHT * position.y,
    vx: drift.vx,
    vy: drift.vy,
    hue: 216 - Math.round(depth * 10),
    delay: index * 120,
    seed: Math.random() * 10 + index,
    fontSize: getBubbleFontSize(text, diameter),
    depth,
  };
}

function getAlignedTargets(
  bubbles: BubbleItem[],
  fieldWidth: number
): Array<{ id: string; targetX: number; targetY: number }> {
  const sorted = [...bubbles].sort((a, b) => b.importance - a.importance);

  const minGap = 8;
  const idealGap = 18;
  const baseWidth = sorted.reduce((sum, bubble) => sum + bubble.diameter, 0);
  const idealTotal = baseWidth + idealGap * Math.max(0, sorted.length - 1);
  const usableWidth = Math.max(fieldWidth - 24, 320);

  const gap =
    idealTotal <= usableWidth
      ? idealGap
      : Math.max(
          minGap,
          (usableWidth - baseWidth) / Math.max(1, sorted.length - 1)
        );

  const totalWidth = baseWidth + gap * Math.max(0, sorted.length - 1);
  let cursor = (fieldWidth - totalWidth) / 2;

  return sorted.map((bubble) => {
    const targetX = cursor + bubble.diameter / 2;
    const targetY = FIELD_HEIGHT * 0.5;
    cursor += bubble.diameter + gap;

    return {
      id: bubble.id,
      targetX,
      targetY,
    };
  });
}

export default function ClearYourMindPage() {
  const [draft, setDraft] = useState("");
  const [bubbles, setBubbles] = useState<BubbleItem[]>([]);
  const [responseText, setResponseText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCrisisFallback, setIsCrisisFallback] = useState(false);
  const [isButtonReady, setIsButtonReady] = useState(false);
  const [bubbleMode, setBubbleMode] = useState<BubbleMode>("float");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const bubbleFieldRef = useRef<HTMLDivElement | null>(null);
  const organizeTimerRef = useRef<number | null>(null);

  const responseParagraphs = useMemo(
    () => getParagraphs(responseText),
    [responseText]
  );

  const realBubbles = useMemo(
    () => bubbles.filter((bubble) => !bubble.isStarter),
    [bubbles]
  );

  const hasRealBubbleContent = realBubbles.length > 0;
  const canSubmit = hasRealBubbleContent && !isLoading;
  const inputLocked = realBubbles.length >= MAX_THOUGHTS && !isLoading;

  useEffect(() => {
    const width = bubbleFieldRef.current?.clientWidth ?? 1080;
    setBubbles([createStarterBubble(width)]);
  }, []);

  useEffect(() => {
    return () => {
      if (organizeTimerRef.current) {
        window.clearTimeout(organizeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoading || responseText || error || !hasRealBubbleContent) {
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
  }, [hasRealBubbleContent, isLoading, responseText, error]);

  useEffect(() => {
    if (!isLoading && (responseText || error)) {
      inputRef.current?.focus();
    }
  }, [responseText, error, isLoading]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const fieldWidth = bubbleFieldRef.current?.clientWidth ?? 1080;
      const time = performance.now() * 0.001;

      setBubbles((current) => {
        if (current.length === 0) return current;
        if (current.length === 1 && current[0].isStarter) return current;

        const next = current.map((bubble) => ({ ...bubble }));

        if (bubbleMode === "float") {
          for (const bubble of next) {
            const radius = bubble.diameter / 2;
            const minX = radius + 6;
            const maxX = fieldWidth - radius - 6;
            const minY = radius + 6;
            const maxY = FIELD_HEIGHT - radius - 6;

            const wanderX = Math.sin(time * 1.1 + bubble.seed * 1.7) * 0.03;
            const wanderY = Math.cos(time * 0.92 + bubble.seed * 1.3) * 0.026;

            bubble.vx += wanderX;
            bubble.vy += wanderY;

            bubble.x += bubble.vx;
            bubble.y += bubble.vy;

            if (bubble.x < minX) {
              bubble.x = minX;
              bubble.vx = Math.abs(bubble.vx) * 1.02;
            } else if (bubble.x > maxX) {
              bubble.x = maxX;
              bubble.vx = -Math.abs(bubble.vx) * 1.02;
            }

            if (bubble.y < minY) {
              bubble.y = minY;
              bubble.vy = Math.abs(bubble.vy) * 1.02;
            } else if (bubble.y > maxY) {
              bubble.y = maxY;
              bubble.vy = -Math.abs(bubble.vy) * 1.02;
            }
          }

          for (let i = 0; i < next.length; i += 1) {
            for (let j = i + 1; j < next.length; j += 1) {
              const a = next[i];
              const b = next[j];

              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const distance = Math.max(0.0001, Math.hypot(dx, dy));
              const minDistance = a.diameter / 2 + b.diameter / 2 + 4;

              if (distance < minDistance) {
                const nx = dx / distance;
                const ny = dy / distance;
                const overlap = minDistance - distance;

                a.x -= nx * overlap * 0.5;
                a.y -= ny * overlap * 0.5;
                b.x += nx * overlap * 0.5;
                b.y += ny * overlap * 0.5;

                const rvx = b.vx - a.vx;
                const rvy = b.vy - a.vy;
                const velAlongNormal = rvx * nx + rvy * ny;

                const tangentX = -ny;
                const tangentY = nx;

                const tangentBoost = 0.18;
                a.vx -= tangentX * tangentBoost;
                a.vy -= tangentY * tangentBoost;
                b.vx += tangentX * tangentBoost;
                b.vy += tangentY * tangentBoost;

                if (velAlongNormal < 0) {
                  const restitution = 1.06;
                  const impulse = (-(1 + restitution) * velAlongNormal) / 2;

                  const impulseX = impulse * nx;
                  const impulseY = impulse * ny;

                  a.vx -= impulseX;
                  a.vy -= impulseY;
                  b.vx += impulseX;
                  b.vy += impulseY;
                }

                a.vx -= nx * 0.14;
                a.vy -= ny * 0.14;
                b.vx += nx * 0.14;
                b.vy += ny * 0.14;
              }
            }
          }

          for (const bubble of next) {
            bubble.vx *= 0.9998;
            bubble.vy *= 0.9998;

            const speed = Math.hypot(bubble.vx, bubble.vy);
            const minSpeed = 0.52;
            const maxSpeed = 1.7;

            if (speed < minSpeed) {
              const angle =
                speed > 0.0001
                  ? Math.atan2(bubble.vy, bubble.vx)
                  : bubble.seed * 1.91;

              bubble.vx = Math.cos(angle) * minSpeed;
              bubble.vy = Math.sin(angle) * minSpeed;
            } else if (speed > maxSpeed) {
              const scale = maxSpeed / speed;
              bubble.vx *= scale;
              bubble.vy *= scale;
            }
          }

          return next;
        }

        const targets = getAlignedTargets(next, fieldWidth);

        for (const bubble of next) {
          const target = targets.find((item) => item.id === bubble.id);
          if (!target) continue;

          const easing = bubbleMode === "organizing" ? 0.08 : 0.14;

          bubble.x += (target.targetX - bubble.x) * easing;
          bubble.y += (target.targetY - bubble.y) * easing;
          bubble.vx *= 0.88;
          bubble.vy *= 0.88;
        }

        return next;
      });
    }, 24);

    return () => {
      window.clearInterval(interval);
    };
  }, [bubbleMode]);

  function addBubbleFromDraft() {
    const trimmed = draft.trim();

    if (!trimmed || inputLocked) return;

    const fieldWidth = bubbleFieldRef.current?.clientWidth ?? 1080;

    setBubbles((current) => {
      const withoutStarter = current.filter((bubble) => !bubble.isStarter);
      if (withoutStarter.length >= MAX_THOUGHTS) return withoutStarter;
      const next = [...withoutStarter, buildBubble(trimmed, withoutStarter.length, fieldWidth)];
      return next.slice(-MAX_THOUGHTS);
    });

    setDraft("");
    setResponseText("");
    setError("");
    setIsCrisisFallback(false);
    setBubbleMode("float");
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addBubbleFromDraft();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!realBubbles.length) {
      setError("Add at least one thought first. Press Enter to turn it into a bubble.");
      setResponseText("");
      setIsCrisisFallback(false);
      setIsButtonReady(false);
      return;
    }

    const combinedInput = [...realBubbles]
      .sort((a, b) => b.importance - a.importance)
      .map((bubble) => bubble.text)
      .join("\n\n");

    setIsLoading(true);
    setError("");
    setResponseText("");
    setIsCrisisFallback(false);
    setIsButtonReady(false);
    setBubbleMode("organizing");

    if (organizeTimerRef.current) {
      window.clearTimeout(organizeTimerRef.current);
    }

    organizeTimerRef.current = window.setTimeout(() => {
      setBubbleMode("aligned");
    }, ORGANIZE_DELAY_MS);

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
    const fieldWidth = bubbleFieldRef.current?.clientWidth ?? 1080;

    setDraft("");
    setBubbles([createStarterBubble(fieldWidth)]);
    setResponseText("");
    setError("");
    setIsLoading(false);
    setIsCrisisFallback(false);
    setIsButtonReady(false);
    setBubbleMode("float");

    if (organizeTimerRef.current) {
      window.clearTimeout(organizeTimerRef.current);
      organizeTimerRef.current = null;
    }

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  function removeBubble(id: string) {
    if (id === STARTER_BUBBLE_ID) return;

    const fieldWidth = bubbleFieldRef.current?.clientWidth ?? 1080;

    setBubbles((current) => {
      const next = current.filter((bubble) => bubble.id !== id);
      return next.length ? next : [createStarterBubble(fieldWidth)];
    });
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
            ref={bubbleFieldRef}
            className={`bubble-field ${
              bubbleMode !== "float" ? "bubble-field-organizing" : ""
            } ${responseText ? "bubble-field-softened" : ""}`}
          >
            {bubbles.map((bubble) => (
              <button
                key={bubble.id}
                type="button"
                className={`thought-bubble ${
                  bubble.isStarter ? "thought-bubble-starter" : "thought-bubble-real"
                } ${responseText ? "thought-bubble-softened" : ""}`}
                style={
                  {
                    "--bubble-x": `${bubble.x}px`,
                    "--bubble-y": `${bubble.y}px`,
                    "--bubble-diameter": `${bubble.diameter}px`,
                    "--bubble-delay": `${bubble.delay}ms`,
                    "--bubble-hue": `${bubble.hue}`,
                    "--bubble-font-size": `${bubble.fontSize}px`,
                    "--bubble-depth": `${bubble.depth}`,
                  } as CSSProperties
                }
                onClick={() => removeBubble(bubble.id)}
                title={bubble.isStarter ? "" : "Remove bubble"}
              >
                <span className="thought-bubble-highlight" />
                <span className="thought-bubble-core-glow" />
                {!bubble.isStarter && (
                  <span className="thought-bubble-text">{bubble.text}</span>
                )}
              </button>
            ))}
          </div>
        </section>

        <form className="mind-form" onSubmit={handleSubmit}>
          <div className="scope-inline">
            <span className="scope-inline-copy">Designed for Adults only</span>
            <span className="scope-separator">·</span>
            <span className="scope-inline-copy">Reflective clarity tool</span>
            <span className="scope-separator">·</span>
            <span className="scope-inline-copy">Not professional advice</span>
            <span className="scope-separator">·</span>
            <Link href="/scope" className="scope-inline-link">
              Scope
            </Link>
          </div>

          <input
            id="clear-your-mind-input"
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleInputKeyDown}
            maxLength={MAX_INPUT_LENGTH}
            placeholder={`Write one thought, then press Enter. (max ${MAX_THOUGHTS})`}
            className="mind-input"
            disabled={isLoading || inputLocked}
          />

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
          background: #040814;
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
          opacity: 0.84;
          filter: saturate(0.95) hue-rotate(8deg) brightness(0.86);
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
            rgba(0, 0, 0, 0.46) 100%
          );
        }

        .realm-bg-soften {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(8, 12, 24, 0.1) 0%,
            rgba(8, 12, 24, 0.04) 24%,
            rgba(8, 12, 24, 0.04) 76%,
            rgba(8, 12, 24, 0.14) 100%
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
              rgba(124, 170, 255, 0.16) 0%,
              rgba(124, 170, 255, 0.08) 16%,
              rgba(124, 170, 255, 0.03) 34%,
              rgba(124, 170, 255, 0) 54%
            ),
            radial-gradient(
              ellipse at 82% 28%,
              rgba(108, 192, 255, 0.07) 0%,
              rgba(108, 192, 255, 0.025) 28%,
              rgba(108, 192, 255, 0) 48%
            );
        }

        .realm-center-halo {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: radial-gradient(
            ellipse at center,
            rgba(120, 172, 255, 0.07) 0%,
            rgba(120, 172, 255, 0.03) 20%,
            rgba(120, 172, 255, 0.012) 34%,
            rgba(120, 172, 255, 0) 50%
          );
          filter: blur(12px);
        }

        .realm-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1240px;
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
          color: rgba(219, 230, 255, 0.56);
          text-shadow: 0 4px 16px rgba(0, 0, 0, 0.24);
        }

        .title {
          margin: 0;
          font-size: clamp(3.5rem, 7vw, 6rem);
          font-weight: 650;
          line-height: 0.94;
          letter-spacing: -0.06em;
          color: rgba(246, 250, 255, 0.99);
          text-shadow:
            0 10px 28px rgba(0, 0, 0, 0.3),
            0 0 24px rgba(122, 180, 255, 0.08);
        }

        .subtitle {
          margin: 16px 0 0;
          max-width: 760px;
          font-size: 1.02rem;
          line-height: 1.72;
          color: rgba(229, 238, 255, 0.9);
          text-shadow: 0 3px 16px rgba(0, 0, 0, 0.24);
        }

        .bubble-stage {
          width: min(1120px, calc(100vw - 64px));
          margin-top: 18px;
          margin-bottom: 22px;
        }

        .bubble-field {
          position: relative;
          width: 100%;
          height: ${FIELD_HEIGHT}px;
          overflow: visible;
        }

        .bubble-field-softened .thought-bubble-real {
          opacity: 0.92;
        }

        .thought-bubble {
          position: absolute;
          left: var(--bubble-x);
          top: var(--bubble-y);
          width: var(--bubble-diameter);
          height: var(--bubble-diameter);
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 1px solid rgba(194, 219, 255, 0.18);
          padding: 0;
          cursor: pointer;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(246, 250, 255, 0.98);
          background:
            radial-gradient(
              circle at 31% 23%,
              rgba(255, 255, 255, 0.26) 0%,
              rgba(255, 255, 255, 0.09) 15%,
              rgba(255, 255, 255, 0) 34%
            ),
            radial-gradient(
              circle at 72% 70%,
              hsla(210, 90%, 70%, calc(0.08 - (var(--bubble-depth) * 0.02))) 0%,
              hsla(210, 90%, 70%, 0.02) 38%,
              hsla(210, 90%, 70%, 0) 62%
            ),
            conic-gradient(
              from 220deg at 50% 50%,
              hsla(214, 56%, calc(70% - (var(--bubble-depth) * 18%)), 0.22),
              hsla(216, 60%, calc(56% - (var(--bubble-depth) * 14%)), 0.1),
              hsla(210, 68%, calc(78% - (var(--bubble-depth) * 12%)), 0.18),
              hsla(218, 58%, calc(48% - (var(--bubble-depth) * 12%)), 0.12),
              hsla(214, 56%, calc(70% - (var(--bubble-depth) * 18%)), 0.22)
            ),
            linear-gradient(
              180deg,
              hsla(213, 54%, calc(74% - (var(--bubble-depth) * 20%)), 0.3) 0%,
              hsla(217, 58%, calc(48% - (var(--bubble-depth) * 14%)), 0.26) 100%
            );
          box-shadow:
            0 18px 40px rgba(0, 0, 0, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            inset 0 -18px 30px rgba(9, 20, 44, 0.26),
            0 0 34px hsla(210, 92%, 70%, calc(0.08 - (var(--bubble-depth) * 0.02)));
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          transition:
            opacity 260ms ease,
            filter 260ms ease,
            box-shadow 260ms ease;
          animation: bubbleAppear 620ms cubic-bezier(0.22, 1, 0.36, 1);
          animation-delay: var(--bubble-delay);
        }

        .thought-bubble-highlight,
        .thought-bubble-core-glow {
          position: absolute;
          pointer-events: none;
          border-radius: 50%;
        }

        .thought-bubble-highlight {
          inset: 10% 14% 44% 18%;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.24) 0%,
            rgba(255, 255, 255, 0.08) 46%,
            rgba(255, 255, 255, 0) 78%
          );
          filter: blur(3px);
          opacity: 0.88;
        }

        .thought-bubble-core-glow {
          inset: 18%;
          background: radial-gradient(
            circle at center,
            hsla(208, 100%, 76%, calc(0.12 - (var(--bubble-depth) * 0.03))) 0%,
            hsla(208, 100%, 76%, 0.04) 42%,
            hsla(208, 100%, 76%, 0) 72%
          );
          filter: blur(8px);
        }

        .thought-bubble-text {
          position: relative;
          z-index: 2;
          width: 76%;
          max-width: 76%;
          font-size: var(--bubble-font-size);
          font-weight: 560;
          line-height: 1.16;
          text-wrap: balance;
          word-break: normal;
          overflow-wrap: normal;
          hyphens: none;
          text-shadow:
            0 2px 12px rgba(0, 0, 0, 0.24),
            0 0 10px rgba(255, 255, 255, 0.04);
          display: block;
          overflow: visible;
        }

        .thought-bubble-starter {
          cursor: default;
          box-shadow:
            0 24px 54px rgba(0, 0, 0, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.22),
            inset 0 -20px 34px rgba(8, 20, 46, 0.24),
            0 0 42px rgba(120, 178, 255, 0.14);
          animation:
            bubbleAppear 900ms cubic-bezier(0.22, 1, 0.36, 1),
            starterBubbleIdleSideways 4.2s linear infinite;
        }

        .thought-bubble-real:hover {
          border-color: rgba(218, 233, 255, 0.24);
          box-shadow:
            0 18px 42px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            inset 0 -16px 26px rgba(8, 20, 46, 0.22),
            0 0 36px rgba(120, 178, 255, 0.12);
        }

        .mind-form {
          width: 100%;
          max-width: 560px;
          margin-top: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .scope-inline {
          margin: 0 0 12px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0;
          font-size: 0.78rem;
          line-height: 1.45;
          color: rgba(218, 229, 247, 0.42);
          text-align: center;
          text-wrap: balance;
        }

        .scope-inline-copy {
          color: rgba(218, 229, 247, 0.42);
        }

        .scope-separator {
          padding: 0 0.26rem;
          color: rgba(218, 229, 247, 0.28);
        }

        .scope-inline-link {
          color: rgba(241, 247, 255, 0.72);
          text-decoration: none;
          border-bottom: 1px solid rgba(197, 221, 255, 0.14);
          line-height: 1.1;
          transition: color 160ms ease, border-color 160ms ease;
        }

        .scope-inline-link:hover {
          color: rgba(255, 255, 255, 0.92);
          border-color: rgba(208, 228, 255, 0.28);
        }

        .mind-input {
          width: 100%;
          max-width: 520px;
          height: 54px;
          padding: 0 22px;
          border-radius: 999px;
          border: 1px solid rgba(190, 216, 255, 0.16);
          background: linear-gradient(
            180deg,
            rgba(10, 20, 42, 0.58) 0%,
            rgba(8, 14, 28, 0.68) 100%
          );
          box-shadow:
            0 18px 38px rgba(0, 0, 0, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.11),
            inset 0 -1px 0 rgba(255, 255, 255, 0.03),
            0 0 0 1px rgba(140, 188, 255, 0.02),
            0 0 28px rgba(116, 180, 255, 0.03);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          color: rgba(247, 251, 255, 0.97);
          font-size: 0.96rem;
          outline: none;
          transition:
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .mind-input:focus {
          border-color: rgba(176, 212, 255, 0.28);
          box-shadow:
            0 22px 44px rgba(0, 0, 0, 0.24),
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            0 0 0 1px rgba(150, 198, 255, 0.07),
            0 0 30px rgba(120, 182, 255, 0.06);
        }

        .mind-input::placeholder {
          color: rgba(210, 225, 245, 0.54);
        }

        .actions {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .actions-initial {
          margin-top: 18px;
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
          border: 1px solid rgba(190, 216, 255, 0.2);
          color: rgba(247, 251, 255, 0.98);
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
            rgba(255, 255, 255, 0.12) 0%,
            rgba(255, 255, 255, 0.03) 48%,
            rgba(255, 255, 255, 0.01) 100%
          );
        }

        .primary-button {
          background: linear-gradient(
            180deg,
            rgba(84, 132, 204, 0.54) 0%,
            rgba(48, 92, 156, 0.7) 100%
          );
          box-shadow:
            0 16px 34px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -10px 18px rgba(10, 28, 56, 0.28),
            0 0 22px rgba(110, 178, 255, 0.08);
        }

        .primary-button-ready {
          border-color: rgba(200, 224, 255, 0.28);
          background: linear-gradient(
            180deg,
            rgba(94, 145, 220, 0.6) 0%,
            rgba(56, 103, 170, 0.78) 100%
          );
          box-shadow:
            0 18px 38px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            inset 0 -10px 18px rgba(10, 28, 56, 0.28),
            0 0 28px rgba(116, 184, 255, 0.1);
          filter: brightness(1.03);
        }

        .secondary-button {
          background: linear-gradient(
            180deg,
            rgba(72, 120, 188, 0.46) 0%,
            rgba(40, 82, 142, 0.62) 100%
          );
          box-shadow:
            0 16px 34px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 -10px 18px rgba(8, 22, 42, 0.24);
        }

        .primary-button:hover,
        .secondary-button:hover {
          transform: translateY(-1px);
          border-color: rgba(215, 232, 255, 0.24);
        }

        .primary-button:hover {
          background: linear-gradient(
            180deg,
            rgba(92, 142, 216, 0.66) 0%,
            rgba(54, 99, 164, 0.84) 100%
          );
          box-shadow:
            0 18px 38px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 -12px 20px rgba(8, 24, 46, 0.3),
            0 0 24px rgba(116, 184, 255, 0.08);
        }

        .primary-button-ready:hover {
          background: linear-gradient(
            180deg,
            rgba(98, 150, 226, 0.7) 0%,
            rgba(58, 106, 174, 0.88) 100%
          );
          box-shadow:
            0 20px 42px rgba(0, 0, 0, 0.34),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -12px 20px rgba(8, 24, 46, 0.3),
            0 0 30px rgba(120, 188, 255, 0.1);
        }

        .secondary-button:hover {
          background: linear-gradient(
            180deg,
            rgba(80, 130, 198, 0.6) 0%,
            rgba(44, 88, 148, 0.76) 100%
          );
          box-shadow:
            0 18px 38px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 -12px 20px rgba(8, 24, 46, 0.28);
        }

        .primary-button:active,
        .secondary-button:active {
          transform: translateY(1px);
          background: linear-gradient(
            180deg,
            rgba(34, 68, 120, 0.84) 0%,
            rgba(20, 44, 82, 0.92) 100%
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
          color: rgba(247, 251, 255, 0.96);
          text-shadow:
            0 4px 16px rgba(0, 0, 0, 0.26),
            0 0 10px rgba(124, 184, 255, 0.1);
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
          border: 1px solid rgba(190, 216, 255, 0.18);
          background: linear-gradient(
            180deg,
            rgba(10, 18, 34, 0.68) 0%,
            rgba(8, 12, 24, 0.78) 100%
          );
          box-shadow:
            0 20px 44px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            inset 0 -1px 0 rgba(255, 255, 255, 0.03),
            0 0 0 1px rgba(130, 182, 255, 0.03),
            0 0 24px rgba(110, 176, 255, 0.04);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          animation: responseReveal 600ms ease forwards;
          opacity: 0;
          transform: translateY(12px);
        }

        .response-card-crisis {
          border-color: rgba(200, 224, 255, 0.2);
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
          color: rgba(210, 228, 255, 0.68);
        }

        .response-copy {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .response-text {
          margin: 0;
          color: rgba(247, 251, 255, 0.96);
          line-height: 1.8;
          text-shadow: 0 5px 18px rgba(0, 0, 0, 0.26);
          white-space: pre-line;
        }

        @keyframes bubbleAppear {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.82);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes starterBubbleIdleSideways {
          0% {
            transform: translate(-50%, -50%) translateX(-24px);
          }
          50% {
            transform: translate(-50%, -50%) translateX(24px);
          }
          100% {
            transform: translate(-50%, -50%) translateX(-24px);
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
            width: calc(100vw - 36px);
            margin-top: 14px;
          }

          .bubble-field {
            height: 280px;
          }

          .scope-inline {
            font-size: 0.74rem;
            margin-bottom: 9px;
            line-height: 1.4;
          }

          .scope-separator {
            padding: 0 0.22rem;
          }

          .mind-form {
            max-width: 100%;
          }

          .mind-input {
            max-width: 100%;
            height: 52px;
            padding: 0 18px;
            font-size: 0.94rem;
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

          .thought-bubble-text {
            width: 78%;
            max-width: 78%;
          }

          @keyframes starterBubbleIdleSideways {
            0% {
              transform: translate(-50%, -50%) translateX(-18px);
            }
            50% {
              transform: translate(-50%, -50%) translateX(18px);
            }
            100% {
              transform: translate(-50%, -50%) translateX(-18px);
            }
          }
        }
      `}</style>
    </main>
  );
}