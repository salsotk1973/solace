"use client";

// /app/tools/clear-your-mind/page.tsx

import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import {
  type CSSProperties,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { submitClearYourMindThoughts } from "@/lib/solace/clear-your-mind/client";

const MAX_THOUGHTS = 7;
const MAX_INPUT_LENGTH = 140;
const THINKING_COPY = "SOLACE IS REFLECTING...";
const STARTER_BUBBLE_ID = "starter-bubble";
const FIELD_HEIGHT = 320;
const ORGANIZE_DELAY_MS = 1600;
const BUTTON_READY_DELAY_MS = 900;

const SCOPE_COPY = "Designed for Adults only";
const REFLECTIVE_COPY = "Reflective clarity tool";
const ADVICE_COPY = "Not professional advice";
const INPUT_HELPER_COPY =
  "Write one thought, then press Enter (Max. 7). Click a thought to remove it if needed.";

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
  isStarter?: boolean;
};

type StructuredEngineResponse =
  | {
      ok: true;
      isCrisisFallback: true;
      clarityFallback: false;
      title: string;
      message: string;
    }
  | {
      ok: true;
      isCrisisFallback: false;
      clarityFallback: true;
      title: string;
      message: string;
    }
  | {
      ok: true;
      isCrisisFallback: false;
      clarityFallback: false;
      reflection: {
        title: string;
        summary: string;
        structure: {
          recognition: string;
          untangling: string;
          gentleFrame: string;
        };
      };
    };

type LegacyThoughtResult = {
  id: string;
  text: string;
  importance: {
    total: number;
  };
};

type LegacySuccessResponse = {
  ok: true;
  text: string;
  isCrisisFallback?: boolean;
  clarityFallback?: boolean;
  thoughts?: LegacyThoughtResult[];
};

type ErrorResponse = {
  ok: false;
  error?: string;
};

type NormalizedUiResponse =
  | {
      ok: true;
      text: string;
      isCrisisFallback: boolean;
      clarityFallback: boolean;
      thoughts?: LegacyThoughtResult[];
    }
  | {
      ok: false;
      error: string;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isLegacyThoughtResultArray(value: unknown): value is LegacyThoughtResult[] {
  if (!Array.isArray(value)) return false;

  return value.every((item) => {
    if (!isRecord(item)) return false;
    if (typeof item.id !== "string") return false;
    if (typeof item.text !== "string") return false;
    if (!isRecord(item.importance)) return false;
    return typeof item.importance.total === "number";
  });
}

function normalizeApiResult(raw: unknown): NormalizedUiResponse {
  if (!isRecord(raw)) {
    return {
      ok: false,
      error: "Invalid response from Solace.",
    };
  }

  if (raw.ok === false) {
    return {
      ok: false,
      error:
        typeof raw.error === "string" && raw.error.trim().length > 0
          ? raw.error
          : "Something went wrong. Please try again.",
    };
  }

  if (raw.ok !== true) {
    return {
      ok: false,
      error: "Invalid response from Solace.",
    };
  }

  const legacyText = typeof raw.text === "string" ? raw.text.trim() : "";
  const legacyIsCrisisFallback = Boolean(raw.isCrisisFallback);
  const legacyClarityFallback = Boolean(raw.clarityFallback);
  const legacyThoughts = isLegacyThoughtResultArray(raw.thoughts) ? raw.thoughts : undefined;

  if (legacyText.length > 0) {
    return {
      ok: true,
      text: legacyText,
      isCrisisFallback: legacyIsCrisisFallback,
      clarityFallback: legacyClarityFallback,
      thoughts: legacyThoughts,
    };
  }

  if (raw.isCrisisFallback === true) {
    const title = typeof raw.title === "string" ? raw.title.trim() : "";
    const message = typeof raw.message === "string" ? raw.message.trim() : "";

    if (!message) {
      return {
        ok: false,
        error: "The crisis response was not in the expected format.",
      };
    }

    return {
      ok: true,
      text: [title, message].filter(Boolean).join("\n\n"),
      isCrisisFallback: true,
      clarityFallback: false,
    };
  }

  if (raw.clarityFallback === true) {
    const title = typeof raw.title === "string" ? raw.title.trim() : "";
    const message = typeof raw.message === "string" ? raw.message.trim() : "";

    if (!message) {
      return {
        ok: false,
        error: "The clarity response was not in the expected format.",
      };
    }

    return {
      ok: true,
      text: [title, message].filter(Boolean).join("\n\n"),
      isCrisisFallback: false,
      clarityFallback: true,
    };
  }

  if (isRecord(raw.reflection)) {
    const reflection = raw.reflection;

    const title = typeof reflection.title === "string" ? reflection.title.trim() : "";
    const summary = typeof reflection.summary === "string" ? reflection.summary.trim() : "";

    let recognition = "";
    let untangling = "";
    let gentleFrame = "";

    if (isRecord(reflection.structure)) {
      recognition =
        typeof reflection.structure.recognition === "string"
          ? reflection.structure.recognition.trim()
          : "";
      untangling =
        typeof reflection.structure.untangling === "string"
          ? reflection.structure.untangling.trim()
          : "";
      gentleFrame =
        typeof reflection.structure.gentleFrame === "string"
          ? reflection.structure.gentleFrame.trim()
          : "";
    }

    const parts = [title, summary, recognition, untangling, gentleFrame].filter(
      (part) => part.length > 0,
    );

    if (parts.length === 0) {
      return {
        ok: false,
        error: "The reflection response was not in the expected format.",
      };
    }

    return {
      ok: true,
      text: parts.join("\n\n"),
      isCrisisFallback: false,
      clarityFallback: false,
    };
  }

  return {
    ok: false,
    error: "The reflection response was not in the expected format.",
  };
}

function getParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function getInitialImportance(text: string): number {
  const trimmed = text.trim().toLowerCase();

  let score = 0;
  score += Math.min(trimmed.length * 1.35, 90);

  const weightedTerms: Array<[RegExp, number]> = [
    [/\b(bills|bill|rent|mortgage|debt|loan|money|broke|not enough money|need more money)\b/g, 48],
    [/\b(wife|husband|partner|marriage|family|kids|children|mother in law|mother-in-law|mother|parents)\b/g, 38],
    [/\b(work|job|career|office|boss|income)\b/g, 30],
    [/\b(health|sick|ill|doctor|hospital|fat|weight|body|smoking)\b/g, 32],
    [/\b(anxiety|stress|fear|panic|overthinking|sad|depressed|worthless|no future)\b/g, 34],
    [/\b(moving|move|relocate|selling house|sell house)\b/g, 28],
    [/\b(dogs|dog|barking|noise|neighbour|neighbor|neighbours|neighbors)\b/g, 18],
    [/\b(gaming|addiction)\b/g, 18],
  ];

  for (const [pattern, weight] of weightedTerms) {
    const matches = trimmed.match(pattern);
    if (matches) {
      score += matches.length * weight;
    }
  }

  if (trimmed.includes("not enough")) score += 26;
  if (trimmed.includes("can't")) score += 14;
  if (trimmed.includes("cannot")) score += 14;
  if (trimmed.includes("never")) score += 10;
  if (trimmed.includes("always")) score += 10;
  if (trimmed.split(" ").length >= 4) score += 12;

  return Math.max(10, Math.min(score, 220));
}

function getBubbleDiameter(importance: number): number {
  if (importance <= 8) return 74;
  if (importance <= 18) return 84;
  if (importance <= 30) return 98;
  if (importance <= 45) return 116;
  if (importance <= 60) return 138;
  if (importance <= 75) return 164;
  if (importance <= 88) return 186;
  return 208;
}

function getBubbleFontSize(text: string, diameter: number): number {
  const length = text.trim().length;

  if (diameter >= 196) {
    if (length <= 14) return 20;
    if (length <= 24) return 18;
    if (length <= 36) return 15.5;
    return 13.6;
  }

  if (diameter >= 164) {
    if (length <= 14) return 18;
    if (length <= 24) return 16;
    if (length <= 34) return 14.2;
    return 12.9;
  }

  if (diameter >= 132) {
    if (length <= 12) return 15.8;
    if (length <= 20) return 14.2;
    if (length <= 30) return 12.9;
    return 11.9;
  }

  if (length <= 10) return 14;
  if (length <= 18) return 12.8;
  return 11.1;
}

function getBubbleHue(importance: number): number {
  if (importance >= 85) return 220;
  if (importance >= 70) return 226;
  if (importance >= 55) return 232;
  if (importance >= 40) return 238;
  if (importance >= 20) return 244;
  return 252;
}

function createStarterBubble(fieldWidth: number): BubbleItem {
  const diameter = Math.min(180, Math.max(156, fieldWidth * 0.23));

  return {
    id: STARTER_BUBBLE_ID,
    text: "",
    diameter,
    importance: 999,
    x: fieldWidth / 2,
    y: FIELD_HEIGHT / 2,
    vx: 0,
    vy: 0,
    hue: 264,
    delay: 0,
    seed: 0.5,
    fontSize: 16,
    isStarter: true,
  };
}

function buildBubble(text: string, index: number, fieldWidth: number): BubbleItem {
  const importance = Math.min(getInitialImportance(text), 100);
  const diameter = getBubbleDiameter(importance);

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
    hue: getBubbleHue(importance),
    delay: index * 120,
    seed: Math.random() * 10 + index,
    fontSize: getBubbleFontSize(text, diameter),
  };
}

function getAlignedTargets(
  bubbles: BubbleItem[],
  fieldWidth: number,
): Array<{ id: string; targetX: number; targetY: number }> {
  const sorted = [...bubbles].sort((a, b) => {
    if (b.diameter !== a.diameter) return b.diameter - a.diameter;
    return b.importance - a.importance;
  });

  const gap = 18;
  const totalWidth =
    sorted.reduce((sum, bubble) => sum + bubble.diameter, 0) +
    gap * Math.max(0, sorted.length - 1);

  let cursor = Math.max(20, (fieldWidth - totalWidth) / 2);

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

function ScopeInline() {
  const wrapperStyle: CSSProperties = {
    color: "rgba(231, 225, 241, 0.62)",
  };

  const baseTextStyle: CSSProperties = {
    color: "rgba(231, 225, 241, 0.62)",
    WebkitTextFillColor: "rgba(231, 225, 241, 0.62)",
  };

  const separatorStyle: CSSProperties = {
    color: "rgba(231, 225, 241, 0.44)",
    WebkitTextFillColor: "rgba(231, 225, 241, 0.44)",
    whiteSpace: "pre",
  };

  const linkStyle: CSSProperties = {
    color: "rgba(239, 234, 247, 0.74)",
    WebkitTextFillColor: "rgba(239, 234, 247, 0.74)",
    textDecoration: "none",
    borderBottom: "1px solid rgba(255,255,255,0.14)",
    lineHeight: 1.1,
  };

  return (
    <div className="scope-inline" style={wrapperStyle}>
      <span className="scope-inline-copy" style={baseTextStyle}>
        {SCOPE_COPY}
      </span>
      <span className="scope-separator" style={separatorStyle}>
        {" · "}
      </span>
      <span className="scope-inline-copy" style={baseTextStyle}>
        {REFLECTIVE_COPY}
      </span>
      <span className="scope-separator" style={separatorStyle}>
        {" · "}
      </span>
      <span className="scope-inline-copy" style={baseTextStyle}>
        {ADVICE_COPY}
      </span>
      <span className="scope-separator" style={separatorStyle}>
        {" · "}
      </span>
      <Link href="/scope" className="scope-inline-link" style={linkStyle}>
        See Scope
      </Link>
    </div>
  );
}

export default function ClearYourMindPage() {
  const [draft, setDraft] = useState("");
  const [bubbles, setBubbles] = useState<BubbleItem[]>([]);
  const [responseText, setResponseText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCrisisFallback, setIsCrisisFallback] = useState(false);
  const [isClarityFallback, setIsClarityFallback] = useState(false);
  const [isButtonReady, setIsButtonReady] = useState(false);
  const [bubbleMode, setBubbleMode] = useState<BubbleMode>("float");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const bubbleFieldRef = useRef<HTMLDivElement | null>(null);
  const organizeTimerRef = useRef<number | null>(null);

  const responseParagraphs = useMemo(() => getParagraphs(responseText), [responseText]);

  const realBubbles = useMemo(
    () => bubbles.filter((bubble) => !bubble.isStarter),
    [bubbles],
  );

  const hasRealBubbleContent = realBubbles.length > 0;
  const canSubmit = hasRealBubbleContent && !isLoading;
  const inputLocked = realBubbles.length >= MAX_THOUGHTS && !isLoading;
  const canRemoveThoughts = !isLoading && !responseText && !error;
  const showInitialForm = !responseText && !error && !isLoading;
  const showHelperOverlay = draft.length === 0;

  useEffect(() => {
    const width = bubbleFieldRef.current?.clientWidth ?? 1100;
    setBubbles([createStarterBubble(width)]);
  }, []);

  useEffect(() => {
    setDraft("");

    const clearRestoredValue = () => {
      setDraft("");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };

    clearRestoredValue();
    window.addEventListener("pageshow", clearRestoredValue);

    return () => {
      window.removeEventListener("pageshow", clearRestoredValue);
    };
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
      const fieldWidth = bubbleFieldRef.current?.clientWidth ?? 1100;
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
                speed > 0.0001 ? Math.atan2(bubble.vy, bubble.vx) : bubble.seed * 1.91;

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

    const fieldWidth = bubbleFieldRef.current?.clientWidth ?? 1100;

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
    setIsClarityFallback(false);
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
      setError("Add at least one thought first. Press Enter to turn it into a thought.");
      setResponseText("");
      setIsCrisisFallback(false);
      setIsClarityFallback(false);
      setIsButtonReady(false);
      return;
    }

    setIsLoading(true);
    setError("");
    setResponseText("");
    setIsCrisisFallback(false);
    setIsClarityFallback(false);
    setIsButtonReady(false);
    setBubbleMode("organizing");

    if (organizeTimerRef.current) {
      window.clearTimeout(organizeTimerRef.current);
    }

    organizeTimerRef.current = window.setTimeout(() => {
      setBubbleMode("aligned");
    }, ORGANIZE_DELAY_MS);

    try {
      const rawResult = await submitClearYourMindThoughts(
        [...realBubbles].map((bubble) => ({
          id: bubble.id,
          text: bubble.text,
        })),
      );

      const result = normalizeApiResult(rawResult);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setResponseText(result.text.trim());
      setIsCrisisFallback(result.isCrisisFallback);
      setIsClarityFallback(result.clarityFallback);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    const fieldWidth = bubbleFieldRef.current?.clientWidth ?? 1100;

    setDraft("");
    setBubbles([createStarterBubble(fieldWidth)]);
    setResponseText("");
    setError("");
    setIsLoading(false);
    setIsCrisisFallback(false);
    setIsClarityFallback(false);
    setIsButtonReady(false);
    setBubbleMode("float");

    if (organizeTimerRef.current) {
      window.clearTimeout(organizeTimerRef.current);
      organizeTimerRef.current = null;
    }

    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus();
      }
    });
  }

  function removeBubble(id: string) {
    if (id === STARTER_BUBBLE_ID || isLoading || !!responseText) return;

    const fieldWidth = bubbleFieldRef.current?.clientWidth ?? 1100;

    setBubbles((current) => {
      const next = current.filter((bubble) => bubble.id !== id);
      return next.length ? next : [createStarterBubble(fieldWidth)];
    });

    setResponseText("");
    setError("");
    setIsCrisisFallback(false);
    setIsClarityFallback(false);
    setBubbleMode("float");
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

      <SiteHeader />

      <section className="realm-content">
        <div className="realm-intro">
          <p className="realm-label">Mind realm</p>

          <h1 className="title">Clear your mind</h1>

          <p className="subtitle">
            Untangle overthinking, mental loops, and emotional build-up into something a little
            clearer.
          </p>
        </div>

        <section className="bubble-stage" aria-label="Thoughts">
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
                } ${responseText ? "thought-bubble-softened" : ""} ${
                  !canRemoveThoughts ? "thought-bubble-locked" : ""
                }`}
                style={
                  {
                    "--bubble-x": `${bubble.x}px`,
                    "--bubble-y": `${bubble.y}px`,
                    "--bubble-diameter": `${bubble.diameter}px`,
                    "--bubble-delay": `${bubble.delay}ms`,
                    "--bubble-hue": `${bubble.hue}`,
                    "--bubble-font-size": `${bubble.fontSize}px`,
                  } as CSSProperties
                }
                onClick={() => removeBubble(bubble.id)}
                title={bubble.isStarter ? "" : canRemoveThoughts ? "Remove thought" : ""}
              >
                <span className="thought-bubble-highlight" />
                <span className="thought-bubble-core-glow" />
                {!bubble.isStarter && canRemoveThoughts && (
                  <span className="thought-remove-hint">Remove thought</span>
                )}
                {!bubble.isStarter && <span className="thought-bubble-text">{bubble.text}</span>}
              </button>
            ))}
          </div>
        </section>

        {showInitialForm ? (
          <form
            className="mind-form"
            onSubmit={handleSubmit}
            autoComplete="off"
            data-form-type="other"
          >
            <input
              type="text"
              name="fake-solace-username"
              autoComplete="username"
              tabIndex={-1}
              aria-hidden="true"
              className="autofill-trap"
            />
            <input
              type="password"
              name="fake-solace-password"
              autoComplete="new-password"
              tabIndex={-1}
              aria-hidden="true"
              className="autofill-trap"
            />

            <ScopeInline />

            <div className="input-shell">
              <div className="mind-input-wrap">
                {showHelperOverlay ? (
                  <span className="mind-input-overlay">{INPUT_HELPER_COPY}</span>
                ) : null}

                <input
                  id="clear-your-mind-input"
                  ref={inputRef}
                  name="solace-reflection-thought"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  maxLength={MAX_INPUT_LENGTH}
                  placeholder=""
                  className="mind-input"
                  disabled={isLoading || inputLocked}
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  data-form-type="other"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-bwignore="true"
                />
              </div>
            </div>

            <div className="actions actions-initial">
              <button
                type="submit"
                className={`primary-button ${isButtonReady ? "primary-button-ready" : ""}`}
                disabled={!canSubmit}
              >
                Clear your mind
              </button>
            </div>
          </form>
        ) : null}

        <section className="response-zone" aria-live="polite">
          {isLoading ? (
            <div className="loading-zone">
              <p className="loading-copy">{THINKING_COPY}</p>
            </div>
          ) : error ? (
            <>
              <ScopeInline />

              <div className="response-card">
                <div className="response-card-label">Solace</div>
                <p className="response-text">{error}</p>
              </div>

              <div className="actions actions-followup">
                <button type="button" onClick={handleReset} className="secondary-button">
                  Clear another thought
                </button>
              </div>
            </>
          ) : responseText ? (
            <>
              <ScopeInline />

              <div
                className={`response-card ${isCrisisFallback ? "response-card-crisis" : ""}`}
              >
                <div className="response-card-label">
                  {isCrisisFallback
                    ? "Important"
                    : isClarityFallback
                      ? "Need a little more clarity"
                      : "Solace reflection"}
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
                <button type="button" onClick={handleReset} className="secondary-button">
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
          max-width: 1400px;
          margin: 0 auto;
          padding: 140px 24px 88px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .realm-intro {
          max-width: 980px;
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
          max-width: 980px;
          font-size: 1.02rem;
          line-height: 1.72;
          color: rgba(240, 234, 248, 0.9);
          text-shadow: 0 3px 16px rgba(0, 0, 0, 0.24);
        }

        .bubble-stage {
          width: 100%;
          max-width: 1280px;
          margin-top: 18px;
          margin-bottom: 22px;
          padding: 0 12px;
          overflow: visible;
        }

        .bubble-field {
          position: relative;
          width: 100%;
          height: ${FIELD_HEIGHT}px;
          overflow: hidden;
        }

        .bubble-field-organizing {
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
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0;
          cursor: pointer;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(251, 248, 255, 0.97);
          background:
            radial-gradient(
              circle at 32% 24%,
              rgba(255, 255, 255, 0.24) 0%,
              rgba(255, 255, 255, 0.08) 16%,
              rgba(255, 255, 255, 0) 34%
            ),
            radial-gradient(
              circle at 70% 72%,
              hsla(var(--bubble-hue), 90%, 72%, 0.12) 0%,
              hsla(var(--bubble-hue), 90%, 72%, 0.04) 34%,
              hsla(var(--bubble-hue), 90%, 72%, 0) 62%
            ),
            conic-gradient(
              from 220deg at 50% 50%,
              rgba(184, 165, 231, 0.18),
              rgba(136, 117, 188, 0.08),
              rgba(209, 194, 245, 0.18),
              rgba(112, 94, 164, 0.12),
              rgba(184, 165, 231, 0.18)
            ),
            linear-gradient(
              180deg,
              rgba(204, 188, 240, 0.26) 0%,
              rgba(126, 107, 178, 0.2) 100%
            );
          box-shadow:
            0 18px 38px rgba(0, 0, 0, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.16),
            inset 0 -16px 28px rgba(29, 24, 48, 0.2),
            0 0 32px hsla(var(--bubble-hue), 90%, 70%, 0.12);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          transition:
            opacity 260ms ease,
            filter 260ms ease,
            box-shadow 260ms ease;
          animation: bubbleAppear 620ms cubic-bezier(0.22, 1, 0.36, 1);
          animation-delay: var(--bubble-delay);
          overflow: visible;
        }

        .thought-bubble-locked {
          cursor: default;
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
            rgba(255, 255, 255, 0.22) 0%,
            rgba(255, 255, 255, 0.08) 46%,
            rgba(255, 255, 255, 0) 78%
          );
          filter: blur(3px);
          opacity: 0.85;
        }

        .thought-bubble-core-glow {
          inset: 18%;
          background: radial-gradient(
            circle at center,
            hsla(var(--bubble-hue), 80%, 74%, 0.14) 0%,
            hsla(var(--bubble-hue), 80%, 74%, 0.05) 42%,
            hsla(var(--bubble-hue), 80%, 74%, 0) 72%
          );
          filter: blur(8px);
        }

        .thought-remove-hint {
          position: absolute;
          bottom: -28px;
          left: 50%;
          transform: translateX(-50%) translateY(4px);
          padding: 5px 10px;
          border-radius: 999px;
          font-size: 0.68rem;
          font-weight: 560;
          letter-spacing: 0.02em;
          color: rgba(246, 242, 252, 0.9);
          background: rgba(12, 14, 28, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.22);
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition:
            opacity 180ms ease,
            transform 180ms ease;
        }

        .thought-bubble-real:hover .thought-remove-hint {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        .thought-bubble-text {
          position: relative;
          z-index: 2;
          width: 80%;
          max-width: 80%;
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
          overflow: hidden;
        }

        .thought-bubble-starter {
          cursor: default;
          box-shadow:
            0 22px 50px rgba(0, 0, 0, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.22),
            inset 0 -18px 30px rgba(29, 24, 48, 0.18),
            0 0 40px rgba(221, 198, 255, 0.14);
          animation:
            bubbleAppear 900ms cubic-bezier(0.22, 1, 0.36, 1),
            starterBubbleIdleSideways 4.2s linear infinite;
        }

        .thought-bubble-real:hover {
          border-color: rgba(255, 255, 255, 0.18);
          box-shadow:
            0 18px 40px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.16),
            inset 0 -14px 24px rgba(29, 24, 48, 0.18),
            0 0 34px hsla(var(--bubble-hue), 90%, 72%, 0.14);
        }

        .mind-form {
          width: 100%;
          max-width: 1120px;
          margin-top: 0;
        }

        .autofill-trap {
          position: absolute;
          opacity: 0;
          pointer-events: none;
          width: 1px;
          height: 1px;
          left: -9999px;
          top: -9999px;
        }

        .scope-inline {
          margin: 0 0 16px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0;
          font-size: 0.7rem;
          line-height: 1.35;
          text-align: center;
          text-wrap: balance;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.24);
          transform: translateY(-6px);
        }

        .scope-inline,
        .scope-inline * {
          color: inherit;
        }

        .scope-inline-copy {
          font-size: inherit;
          line-height: inherit;
        }

        .scope-separator {
          font-size: inherit;
          line-height: inherit;
        }

        .scope-inline-link,
        .scope-inline-link:visited,
        .scope-inline-link:hover,
        .scope-inline-link:active {
          color: rgba(239, 234, 247, 0.74) !important;
          -webkit-text-fill-color: rgba(239, 234, 247, 0.74) !important;
        }

        .scope-inline-link:hover {
          color: rgba(247, 244, 252, 0.88) !important;
          -webkit-text-fill-color: rgba(247, 244, 252, 0.88) !important;
          border-color: rgba(255, 255, 255, 0.24) !important;
        }

        .input-shell {
          width: 100%;
          max-width: 720px;
          margin: 0 auto;
        }

        .mind-input-wrap {
          position: relative;
          width: 100%;
        }

        .mind-input-overlay {
          position: absolute;
          left: 24px;
          right: 24px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          text-align: left;
          font-size: 0.93rem;
          line-height: 1.2;
          color: rgba(232, 226, 242, 0.5);
          text-shadow: 0 1px 8px rgba(0, 0, 0, 0.16);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mind-input {
          width: 100%;
          height: 58px;
          padding: 0 24px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: linear-gradient(
            180deg,
            rgba(21, 18, 28, 0.54) 0%,
            rgba(15, 14, 24, 0.62) 100%
          );
          box-shadow:
            0 18px 38px rgba(0, 0, 0, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.11),
            inset 0 -1px 0 rgba(255, 255, 255, 0.03),
            0 0 0 1px rgba(228, 204, 255, 0.02),
            0 0 28px rgba(205, 176, 255, 0.03);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          color: rgba(247, 244, 252, 0.93);
          font-size: 0.98rem;
          outline: none;
          transition:
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .mind-input:focus {
          border-color: rgba(226, 202, 255, 0.28);
          box-shadow:
            0 22px 44px rgba(0, 0, 0, 0.24),
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            0 0 0 1px rgba(226, 202, 255, 0.07),
            0 0 30px rgba(204, 170, 255, 0.06);
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
          max-width: 1120px;
          min-height: 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .response-card {
          width: 100%;
          max-width: 980px;
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
            padding-top: 130px;
          }

          .bubble-stage {
            max-width: 100%;
          }

          .mind-form,
          .response-zone {
            max-width: 100%;
          }

          .input-shell {
            max-width: 660px;
          }
        }

        @media (max-width: 640px) {
          .realm-content {
            padding-top: 122px;
            padding-left: 18px;
            padding-right: 18px;
          }

          .bubble-stage {
            margin-top: 14px;
            padding: 0 6px;
          }

          .bubble-field {
            height: 280px;
          }

          .scope-inline {
            font-size: 0.66rem;
            margin-bottom: 12px;
            line-height: 1.35;
            transform: translateY(-4px);
          }

          .input-shell {
            max-width: 100%;
          }

          .mind-input {
            height: 54px;
            padding: 0 20px;
            font-size: 0.94rem;
          }

          .mind-input-overlay {
            left: 20px;
            right: 20px;
            font-size: 0.88rem;
            color: rgba(232, 226, 242, 0.48);
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
            width: 82%;
            max-width: 82%;
          }

          .thought-remove-hint {
            display: none;
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