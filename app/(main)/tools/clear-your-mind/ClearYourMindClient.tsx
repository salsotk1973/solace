"use client";

// /app/tools/clear-your-mind/page.tsx

import {
  type CSSProperties,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Lock } from "lucide-react";
import PageShell from "@/components/PageShell";
import AIToolInputSection from "@/components/tools/AIToolInputSection";
import AuthMessage from "@/components/shared/AuthMessage";
import { submitClearYourMindThoughts } from "@/lib/solace/clear-your-mind/client";
import { SOLACE_CRISIS_FALLBACK } from "@/lib/solace/safety";

const MAX_THOUGHTS = 3;
const MAX_LAYOUT_CAPACITY = 7;
const MAX_INPUT_LENGTH = 140;
const THINKING_COPY = "SOLACE IS REFLECTING...";
const STARTER_BUBBLE_ID = "starter-bubble";
const DEFAULT_FIELD_HEIGHT = 280;
const ORGANIZE_DELAY_MS = 1600;
const BUTTON_READY_DELAY_MS = 900;

const PROMPT_COPY = "What is bothering you?";
const INPUT_HELPER_COPY =
  "Write a thought, press Enter (max. 3). To remove it, just click it.";
const PROMPT_TEXT_COLOR = "rgba(236, 250, 246, 0.94)";

type BubbleMode = "float" | "organizing" | "aligned";

type BubbleItem = {
  id: string;
  text: string;
  diameter: number;
  importance: number;
  rawImportance: number;
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

type LegacyThoughtResult = {
  id: string;
  text: string;
  importance: {
    total: number;
  };
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

    const parts = [summary, recognition, untangling, gentleFrame].filter(
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

function getDisplayResponse(text: string, crisis: boolean) {
  if (crisis) {
    return SOLACE_CRISIS_FALLBACK;
  }

  const trimmed = text.trim();

  if (!trimmed) {
    return "Something went wrong. Please try again.";
  }

  return trimmed;
}

function getParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function getRawImportance(text: string): number {
  const trimmed = text.trim().toLowerCase();

  let score = 0;
  score += Math.min(trimmed.length * 1.15, 60);

  const weightedTerms: Array<[RegExp, number]> = [
    [
      /\b(bills|bill|rent|mortgage|debt|loan|money|cash|broke|financial|finance|expenses|expense|cost|costs|afford|affording|not enough money)\b/g,
      34,
    ],
    [
      /\b(lost my job|lose my job|i lost my job|no job|jobless|unemployed|laid off|got fired|lost work|not working|not working at the moment|out of work|currently not working)\b/g,
      58,
    ],
    [
      /\b(work|career|office|boss|income|workload|deadline|deadlines|too much work|lots to do at work|too much at work)\b/g,
      24,
    ],
    [
      /\b(wife|husband|partner|marriage|family|kids|children|mother in law|mother-in-law|mother|mom|mum|father|dad|parents|pregnant|baby)\b/g,
      26,
    ],
    [
      /\b(health|sick|ill|doctor|hospital|fat|weight|body|panic|stress|stressed|tired|exhausted|anxiety)\b/g,
      20,
    ],
    [
      /\b(car|broken|house|home|dirty|mess|messy|laundry|cleaning|repair|repairs|neighbour|neighbours|neighbor|neighbors|noise|noisy)\b/g,
      16,
    ],
    [
      /\b(anxiety|fear|overthinking|sad|depressed|worthless|no future|lost|stuck|ugly|not good enough)\b/g,
      22,
    ],
    [/\b(overseas|abroad|far away|away from family)\b/g, 18],
  ];

  for (const [pattern, weight] of weightedTerms) {
    const matches = trimmed.match(pattern);
    if (matches) {
      score += matches.length * weight;
    }
  }

  const phraseBoosts: Array<[RegExp, number]> = [
    [/\blost my job\b/i, 60],
    [/\bnot working at the moment\b/i, 52],
    [/\bcurrently not working\b/i, 48],
    [/\bout of work\b/i, 46],
    [/\bno job\b/i, 42],
    [/\bwife pregnant\b/i, 38],
    [/\bpartner pregnant\b/i, 38],
    [/\bmother in law living at home\b/i, 34],
    [/\bfamily overseas\b/i, 30],
    [/\bwife is overseas\b/i, 30],
    [/\bcar broken\b/i, 22],
    [/\bfeel fat\b/i, 18],
    [/\blots of bills to pay\b/i, 36],
    [/\bbills piling up\b/i, 36],
    [/\btoo much work\b/i, 24],
    [/\bnoisy neighbours\b/i, 16],
    [/\bnoisy neighbors\b/i, 16],
  ];

  for (const [pattern, weight] of phraseBoosts) {
    if (pattern.test(trimmed)) {
      score += weight;
    }
  }

  if (trimmed.includes("not enough")) score += 16;
  if (trimmed.includes("can't")) score += 10;
  if (trimmed.includes("cannot")) score += 10;
  if (trimmed.includes("never")) score += 8;
  if (trimmed.includes("always")) score += 8;
  if (trimmed.split(" ").length >= 4) score += 10;
  if (trimmed.split(" ").length >= 7) score += 10;

  return Math.max(10, Math.min(score, 320));
}

function getVisualImportance(rawImportance: number): number {
  const raw = Math.max(10, Math.min(rawImportance, 320));

  if (raw <= 35) return 14 + (raw - 10) * 0.45;
  if (raw <= 70) return 25 + (raw - 35) * 0.58;
  if (raw <= 110) return 45 + (raw - 70) * 0.7;
  if (raw <= 160) return 73 + (raw - 110) * 0.44;
  if (raw <= 220) return 95 + (raw - 160) * 0.16;

  return 104;
}

function getBubbleDiameter(importance: number): number {
  if (importance <= 16) return 74;
  if (importance <= 24) return 84;
  if (importance <= 34) return 98;
  if (importance <= 46) return 116;
  if (importance <= 58) return 136;
  if (importance <= 70) return 156;
  if (importance <= 82) return 178;
  if (importance <= 92) return 202;
  if (importance <= 100) return 224;
  return 242;
}

function getBubbleFontSize(text: string, diameter: number): number {
  const length = text.trim().length;

  if (diameter >= 220) {
    if (length <= 14) return 21;
    if (length <= 24) return 18.6;
    if (length <= 36) return 16;
    return 14;
  }

  if (diameter >= 196) {
    if (length <= 14) return 19;
    if (length <= 24) return 17;
    if (length <= 36) return 15;
    return 13.4;
  }

  if (diameter >= 170) {
    if (length <= 14) return 17;
    if (length <= 24) return 15.4;
    if (length <= 34) return 13.8;
    return 12.6;
  }

  if (diameter >= 140) {
    if (length <= 12) return 15.6;
    if (length <= 20) return 14.2;
    if (length <= 30) return 12.9;
    return 11.8;
  }

  if (length <= 10) return 14;
  if (length <= 18) return 12.8;
  return 11.1;
}

function getBubbleHue(importance: number): number {
  if (importance >= 90) return 178;
  if (importance >= 78) return 178;
  if (importance >= 62) return 178;
  if (importance >= 44) return 178;
  if (importance >= 26) return 178;
  return 178;
}

function getResponsiveFieldHeight(
  viewportWidth: number,
  bubbleCount: number,
  isOrganized: boolean,
): number {
  const extraBubbles = Math.max(0, bubbleCount - 3);

  if (viewportWidth <= 420) {
    return (isOrganized ? 540 : 420) + extraBubbles * 54;
  }

  if (viewportWidth <= 520) {
    return (isOrganized ? 490 : 390) + extraBubbles * 48;
  }

  if (viewportWidth <= 640) {
    return (isOrganized ? 430 : 340) + extraBubbles * 42;
  }

  if (viewportWidth <= 768) {
    return (isOrganized ? 390 : 310) + extraBubbles * 34;
  }

  if (viewportWidth <= 900) {
    return (isOrganized ? 360 : 290) + extraBubbles * 28;
  }

  if (viewportWidth <= 1200) {
    return (isOrganized ? 340 : 276) + extraBubbles * 24;
  }

  return (isOrganized ? 320 : DEFAULT_FIELD_HEIGHT) + extraBubbles * 22;
}

function createStarterBubble(fieldWidth: number, fieldHeight: number): BubbleItem {
  const diameter = Math.min(172, Math.max(148, fieldWidth * 0.19));

  return {
    id: STARTER_BUBBLE_ID,
    text: "",
    diameter,
    importance: 999,
    rawImportance: 999,
    x: fieldWidth / 2,
    y: fieldHeight / 2,
    vx: 0,
    vy: 0,
    hue: 178,
    delay: 0,
    seed: 0.5,
    fontSize: 16,
    isStarter: true,
  };
}

function buildBubble(
  text: string,
  index: number,
  fieldWidth: number,
  fieldHeight: number,
): BubbleItem {
  const rawImportance = getRawImportance(text);
  const importance = getVisualImportance(rawImportance);
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
    rawImportance,
    x: fieldWidth * position.x,
    y: fieldHeight * position.y,
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
  fieldHeight: number,
): Array<{ id: string; targetX: number; targetY: number }> {
  const sorted = [...bubbles].sort((a, b) => {
    if (b.diameter !== a.diameter) return b.diameter - a.diameter;
    return b.importance - a.importance;
  });

  if (sorted.length === 0) return [];

  const horizontalPadding = fieldWidth <= 640 ? 14 : 20;
  const gap = fieldWidth <= 640 ? 12 : 18;
  const rowGap = fieldWidth <= 640 ? 20 : 26;
  const availableWidth = Math.max(220, fieldWidth - horizontalPadding * 2);

  const singleRowWidth =
    sorted.reduce((sum, bubble) => sum + bubble.diameter, 0) +
    gap * Math.max(0, sorted.length - 1);

  if (singleRowWidth <= availableWidth) {
    let cursorX = (fieldWidth - singleRowWidth) / 2;
    const targetY = fieldHeight * 0.5;

    return sorted.map((bubble) => {
      const targetX = cursorX + bubble.diameter / 2;
      cursorX += bubble.diameter + gap;

      return {
        id: bubble.id,
        targetX,
        targetY,
      };
    });
  }

  const rows: BubbleItem[][] = [];
  let currentRow: BubbleItem[] = [];
  let currentRowWidth = 0;

  for (const bubble of sorted) {
    const nextWidth = currentRow.length
      ? currentRowWidth + gap + bubble.diameter
      : bubble.diameter;

    if (currentRow.length > 0 && nextWidth > availableWidth) {
      rows.push(currentRow);
      currentRow = [bubble];
      currentRowWidth = bubble.diameter;
    } else {
      currentRow.push(bubble);
      currentRowWidth = nextWidth;
    }
  }

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  const rowHeights = rows.map((row) => Math.max(...row.map((bubble) => bubble.diameter)));
  const totalClusterHeight =
    rowHeights.reduce((sum, rowHeight) => sum + rowHeight, 0) +
    rowGap * Math.max(0, rows.length - 1);

  let cursorY = Math.max((fieldHeight - totalClusterHeight) / 2, 20);

  return rows.flatMap((row, rowIndex) => {
    const rowWidth =
      row.reduce((sum, bubble) => sum + bubble.diameter, 0) +
      gap * Math.max(0, row.length - 1);

    let cursorX = Math.max((fieldWidth - rowWidth) / 2, horizontalPadding);
    const rowHeight = rowHeights[rowIndex];
    const targetY = cursorY + rowHeight / 2;

    const rowTargets = row.map((bubble) => {
      const targetX = cursorX + bubble.diameter / 2;
      cursorX += bubble.diameter + gap;

      return {
        id: bubble.id,
        targetX,
        targetY,
      };
    });

    cursorY += rowHeight + rowGap;
    return rowTargets;
  });
}

function applyApiResultsToBubbles(
  currentBubbles: BubbleItem[],
  response: NormalizedUiResponse,
): BubbleItem[] {
  const realBubbles = currentBubbles.filter((bubble) => !bubble.isStarter);

  if (!response.ok || !response.thoughts || response.thoughts.length === 0) {
    return realBubbles;
  }

  const currentMap = new Map(realBubbles.map((bubble) => [bubble.id, bubble]));
  const ordered: BubbleItem[] = [];

  for (const thought of response.thoughts) {
    const existing = currentMap.get(thought.id);
    if (!existing) continue;

    const rawImportance = Math.max(
      10,
      Math.min(thought.importance.total || getRawImportance(thought.text), 320),
    );
    const importance = getVisualImportance(rawImportance);
    const diameter = getBubbleDiameter(importance);
    const fontSize = getBubbleFontSize(thought.text, diameter);

    ordered.push({
      ...existing,
      text: thought.text,
      importance,
      rawImportance,
      hue: getBubbleHue(importance),
      diameter,
      fontSize,
    });
  }

  return ordered.length > 0 ? ordered : realBubbles;
}

export default function ClearYourMindPage() {
  const [draft, setDraft] = useState("");
  const [bubbles, setBubbles] = useState<BubbleItem[]>([]);
  const [responseText, setResponseText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCrisisFallback, setIsCrisisFallback] = useState(false);
  const [isClarityFallback, setIsClarityFallback] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [isButtonReady, setIsButtonReady] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [accessError, setAccessError] = useState<"auth_required" | "upgrade_required" | null>(null);
  const [bubbleMode, setBubbleMode] = useState<BubbleMode>("float");
  const [fieldHeight, setFieldHeight] = useState(DEFAULT_FIELD_HEIGHT);

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
  const canRemoveThoughts = !isLoading && !responseText && !error && !accessError;
  const showInitialForm = !responseText && !error && !isLoading && !accessError;
  const showHelperOverlay = draft.length === 0;

  useEffect(() => {
    const updateFieldHeight = () => {
      setFieldHeight(
        getResponsiveFieldHeight(
          window.innerWidth,
          realBubbles.length,
          bubbleMode !== "float" || Boolean(responseText),
        ),
      );
    };

    updateFieldHeight();
    window.addEventListener("resize", updateFieldHeight);

    return () => {
      window.removeEventListener("resize", updateFieldHeight);
    };
  }, [realBubbles.length, bubbleMode, responseText]);

  useEffect(() => {
    const width = bubbleFieldRef.current?.clientWidth ?? 900;

    setBubbles((current) => {
      const real = current.filter((bubble) => !bubble.isStarter);

      if (real.length === 0) {
        return [createStarterBubble(width, fieldHeight)];
      }

      return real.map((bubble, index) => ({
        ...bubble,
        x: Math.min(
          Math.max(bubble.diameter / 2 + 8, bubble.x),
          width - bubble.diameter / 2 - 8,
        ),
        y: Math.min(
          Math.max(bubble.diameter / 2 + 8, bubble.y),
          fieldHeight - bubble.diameter / 2 - 8,
        ),
        delay: index * 120,
      }));
    });
  }, [fieldHeight]);

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
    if (responseText && !isCrisisFallback && !isUnavailable && !isLoading) {
      if (!localStorage.getItem("solace_upgrade_nudge_shown")) {
        localStorage.setItem("solace_upgrade_nudge_shown", "1");
        setShowNudge(true);
      }
    }
  }, [responseText, isCrisisFallback, isUnavailable, isLoading]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const fieldWidth = bubbleFieldRef.current?.clientWidth ?? 900;
      const time = performance.now() * 0.001;

      setBubbles((current) => {
        if (current.length === 0) return current;
        if (current.length === 1 && current[0].isStarter) {
          return [createStarterBubble(fieldWidth, fieldHeight)];
        }

        const next = current.map((bubble) => ({ ...bubble }));

        if (bubbleMode === "float") {
          for (const bubble of next) {
            const radius = bubble.diameter / 2;
            const minX = radius + 6;
            const maxX = fieldWidth - radius - 6;
            const minY = radius + 6;
            const maxY = fieldHeight - radius - 6;

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

        const targets = getAlignedTargets(
          next.slice(0, MAX_LAYOUT_CAPACITY),
          fieldWidth,
          fieldHeight,
        );

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
  }, [bubbleMode, fieldHeight]);

  function addBubbleFromDraft() {
    const trimmed = draft.trim();

    if (!trimmed || inputLocked) return;

    const fieldWidth = bubbleFieldRef.current?.clientWidth ?? 900;

    setBubbles((current) => {
      const withoutStarter = current.filter((bubble) => !bubble.isStarter);
      if (withoutStarter.length >= MAX_THOUGHTS) return withoutStarter;

      const next = [
        ...withoutStarter,
        buildBubble(trimmed, withoutStarter.length, fieldWidth, fieldHeight),
      ];

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
    setIsUnavailable(false);
    setAccessError(null);
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
        if (result.error === "unavailable") {
          setIsUnavailable(true);
          return;
        }
        if (result.error === "Unauthorized" || result.error === "auth_required") {
          setAccessError("auth_required");
          return;
        }
        if (result.error === "upgrade_required") {
          setAccessError("upgrade_required");
          return;
        }
        setError(result.error);
        return;
      }

      setBubbles((current) => applyApiResultsToBubbles(current, result));
      setResponseText(getDisplayResponse(result.text, result.isCrisisFallback));
      setIsCrisisFallback(result.isCrisisFallback);
      setIsClarityFallback(result.isCrisisFallback ? false : result.clarityFallback);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    const fieldWidth = bubbleFieldRef.current?.clientWidth ?? 900;

    setDraft("");
    setBubbles([createStarterBubble(fieldWidth, fieldHeight)]);
    setResponseText("");
    setError("");
    setIsUnavailable(false);
    setAccessError(null);
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

    const fieldWidth = bubbleFieldRef.current?.clientWidth ?? 900;

    setBubbles((current) => {
      const next = current.filter((bubble) => bubble.id !== id);
      return next.length ? next : [createStarterBubble(fieldWidth, fieldHeight)];
    });

    setResponseText("");
    setError("");
    setIsCrisisFallback(false);
    setIsClarityFallback(false);
    setBubbleMode("float");
  }

  return (
    <PageShell contentContainer={false}>
      <div className="mind-realm">
      <section className="realm-content">
        <div className="realm-intro">
          <h1 className="title">Clear your mind</h1>
          <p className="subtitle">
            Untangle overthinking, mental loops, and emotional build-up into something a little
            clearer.
          </p>
        </div>

        <div className="bubble-stage">
          <div
            ref={bubbleFieldRef}
            className={`bubble-field ${
              bubbleMode !== "float" ? "bubble-field-organizing" : ""
            } ${responseText ? "bubble-field-softened" : ""}`}
            style={{ "--bubble-field-height": `${fieldHeight}px` } as CSSProperties}
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
        </div>

        {showInitialForm ? (
          <AIToolInputSection
            onSubmit={handleSubmit}
            autoComplete="off"
            data-form-type="other"
            formOffsetTop={205}
            beforeFields={
              <>
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
              </>
            }
            prompt={
              <label htmlFor="clear-your-mind-input" className="prompt">
                {PROMPT_COPY}
              </label>
            }
            trustLine={
              <p className="trust-line">
                <Lock size={12} aria-hidden="true" />
                <span>This is private. Only you can see what you write here.</span>
              </p>
            }
            input={
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
            }
            primaryAction={
              <button
                type="submit"
                className={`primary-button ${isButtonReady ? "primary-button-ready" : ""}`}
                disabled={!canSubmit}
              >
                <span className="button-glass-sheen" />
                <span className="button-glass-tint" />
                <span className="button-label" style={{ color: PROMPT_TEXT_COLOR }}>
                  Clear your mind
                  <span
                    className="button-label-arrow"
                    aria-hidden="true"
                    style={{ color: PROMPT_TEXT_COLOR }}
                  >
                    →
                  </span>
                </span>
              </button>
            }
          />
        ) : null}

        <section className="response-zone" aria-live="polite">
          {isLoading ? (
            <div className="loading-zone">
              <p className="loading-copy">{THINKING_COPY}</p>
            </div>
          ) : isUnavailable ? (
            <>
              <div className="response-card">
                <div className="response-card-label">Taking a breath.</div>
                <div className="response-copy">
                  <p className="response-text">
                    This tool is temporarily resting. Try again in a moment — it will be ready soon.
                  </p>
                </div>
              </div>
              <div className="actions actions-followup">
                <button type="button" onClick={handleReset} className="secondary-button">
                  <span className="button-glass-sheen" />
                  <span className="button-glass-tint" />
                  <span className="button-label">Try again →</span>
                </button>
              </div>
            </>
          ) : accessError ? (
            <AuthMessage
              toolKey="clear-your-mind"
              variant={accessError === "auth_required" ? "logged-out" : "paid-required"}
              onClose={handleReset}
            />
          ) : error ? (
            <>
              <div className="response-card">
                <div className="response-card-label">Solace</div>
                <p className="response-text">{error}</p>
              </div>

              <div className="actions actions-followup">
                <button type="button" onClick={handleReset} className="secondary-button">
                  <span className="button-glass-sheen" />
                  <span className="button-glass-tint" />
                  <span className="button-label">Clear another thought</span>
                </button>
              </div>
            </>
          ) : responseText ? (
            <>
              <div
                className={`response-card ${isCrisisFallback ? "response-card-crisis" : ""}`}
              >
                <div className="response-card-label">
                  {isCrisisFallback
                    ? "Take a moment"
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

              {showNudge && (
                <div className="upgrade-nudge">
                  <p className="upgrade-nudge-text">
                    Solace can remember this over time — so future sessions know what you&apos;ve already worked through.{" "}
                    <a href="/pricing" className="upgrade-nudge-link">That&apos;s Pro →</a>
                  </p>
                </div>
              )}

              <div className="actions actions-followup">
                <button type="button" onClick={handleReset} className="secondary-button">
                  <span className="button-glass-sheen" />
                  <span className="button-glass-tint" />
                  <span className="button-label">Clear another thought</span>
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
          isolation: isolate;
        }

        .realm-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
          padding: 138px 24px 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .realm-intro {
          width: 100%;
          max-width: 760px;
          min-height: 168px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
        }

        .title {
          margin: 0;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(3rem, 7vw, 5.4rem);
          font-weight: 300;
          line-height: 0.98;
          letter-spacing: -0.02em;
          font-style: italic;
          color: rgba(247, 250, 255, 0.98);
          text-shadow:
            0 10px 28px rgba(0, 0, 0, 0.4),
            0 0 24px rgba(160, 255, 214, 0.04);
        }

        .subtitle {
          margin: 14px 0 0;
          font-size: 1.02rem;
          line-height: 1.7;
          color: rgba(232, 245, 240, 0.86);
          text-shadow: 0 4px 18px rgba(0, 0, 0, 0.38);
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
          height: var(--bubble-field-height);
          min-height: var(--bubble-field-height);
          overflow: visible;
          pointer-events: auto;
          --bubble-y-offset: 58px;
        }

        .bubble-field-organizing {
          overflow: visible;
        }

        .bubble-field-softened .thought-bubble-real {
          opacity: 0.94;
        }

        .thought-bubble {
          position: absolute;
          left: var(--bubble-x);
          top: calc(var(--bubble-y) + var(--bubble-y-offset));
          width: var(--bubble-diameter);
          height: var(--bubble-diameter);
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 1px solid rgba(216, 255, 235, 0.12);
          padding: 0;
          cursor: pointer;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(247, 252, 249, 0.97);
          background:
            radial-gradient(
              circle at 32% 24%,
              rgba(255, 255, 255, 0.2) 0%,
              rgba(255, 255, 255, 0.06) 16%,
              rgba(255, 255, 255, 0) 34%
            ),
            radial-gradient(
              circle at 70% 72%,
              hsla(var(--bubble-hue), 90%, 72%, 0.1) 0%,
              hsla(var(--bubble-hue), 90%, 72%, 0.03) 34%,
              hsla(var(--bubble-hue), 90%, 72%, 0) 62%
            ),
            conic-gradient(
              from 220deg at 50% 50%,
              rgba(164, 237, 204, 0.16),
              rgba(84, 180, 148, 0.06),
              rgba(196, 247, 224, 0.16),
              rgba(60, 130, 108, 0.1),
              rgba(164, 237, 204, 0.16)
            ),
            linear-gradient(
              180deg,
              rgba(182, 240, 214, 0.22) 0%,
              rgba(96, 172, 146, 0.16) 100%
            );
          box-shadow:
            0 18px 38px rgba(0, 0, 0, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            inset 0 -16px 28px rgba(10, 34, 25, 0.18),
            0 0 24px hsla(var(--bubble-hue), 90%, 70%, 0.08);
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
            rgba(255, 255, 255, 0.18) 0%,
            rgba(255, 255, 255, 0.06) 46%,
            rgba(255, 255, 255, 0) 78%
          );
          filter: blur(3px);
          opacity: 0.78;
        }

        .thought-bubble-core-glow {
          inset: 18%;
          background: radial-gradient(
            circle at center,
            hsla(var(--bubble-hue), 82%, 74%, 0.12) 0%,
            hsla(var(--bubble-hue), 82%, 74%, 0.04) 42%,
            hsla(var(--bubble-hue), 82%, 74%, 0) 72%
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
          color: rgba(244, 250, 246, 0.9);
          background: rgba(8, 20, 16, 0.72);
          border: 1px solid rgba(216, 255, 235, 0.12);
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
            0 22px 46px rgba(0, 0, 0, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            inset 0 -18px 30px rgba(10, 34, 25, 0.18),
            0 0 22px rgba(150, 255, 208, 0.06);
          animation:
            bubbleAppear 900ms cubic-bezier(0.22, 1, 0.36, 1),
            starterBubbleIdleSideways 4.2s linear infinite;
        }

        .thought-bubble-real:hover {
          border-color: rgba(225, 255, 238, 0.18);
          box-shadow:
            0 18px 40px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.16),
            inset 0 -14px 24px rgba(10, 34, 25, 0.2),
            0 0 28px hsla(var(--bubble-hue), 90%, 72%, 0.12);
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

        .prompt {
          display: block;
          margin: 0 0 14px;
          font-size: 1.02rem;
          font-weight: 540;
          color: rgba(236, 250, 246, 0.94);
          text-shadow: 0 4px 14px rgba(0, 0, 0, 0.34);
        }

        .trust-line {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin: 0 0 12px;
          width: 100%;
          font-family: "Jost", sans-serif;
          font-size: 0.75rem;
          line-height: 1.5;
          color: rgba(112, 236, 222, 0.42);
          text-align: center;
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
          color: rgba(112, 236, 222, 0.42);
          text-shadow: 0 1px 8px rgba(0, 0, 0, 0.16);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mind-input {
          width: 100%;
          min-height: 88px;
          height: 88px;
          padding: 0 24px;
          border-radius: 30px;
          border: 1px solid rgba(196, 240, 234, 0.18);
          background:
            linear-gradient(
              180deg,
              rgba(8, 18, 20, 0.84) 0%,
              rgba(6, 14, 16, 0.8) 100%
            );
          box-shadow:
            0 0 18px rgba(110, 232, 220, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            inset 0 -1px 0 rgba(255, 255, 255, 0.03),
            0 0 0 1px rgba(132, 232, 220, 0.03);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          color: rgba(178, 228, 221, 0.78);
          font-size: 1rem;
          line-height: 1.45;
          outline: none;
          transition:
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .mind-input:focus {
          border-color: rgba(184, 242, 234, 0.3);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            0 0 0 1px rgba(184, 242, 234, 0.08),
            0 0 28px rgba(112, 226, 214, 0.1);
        }

        .actions {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .actions-followup {
          margin-top: 16px;
        }

        .upgrade-nudge {
          margin-top: 20px;
          padding: 14px 20px;
          border-radius: 12px;
          border: 0.5px solid rgba(123,111,160,0.2);
          background: rgba(123,111,160,0.06);
          text-align: center;
        }

        .upgrade-nudge-text {
          margin: 0;
          font-family: var(--font-body, 'Jost', sans-serif);
          font-size: 13px;
          line-height: 1.6;
          color: rgba(155,147,200,0.52);
        }

        .upgrade-nudge-link {
          color: rgba(200,182,248,0.7);
          text-decoration: none;
          white-space: nowrap;
        }

        .upgrade-nudge-link:hover {
          color: rgba(200,182,248,0.95);
        }

        .primary-button,
        .secondary-button {
          position: relative;
          min-width: 204px;
          min-height: 58px;
          padding: 0 28px;
          border-radius: 999px;
          border: 1px solid rgba(188, 240, 234, 0.22);
          color: rgba(236, 250, 246, 0.94);
          font-size: 0.98rem;
          font-weight: 560;
          cursor: pointer;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          transition:
            transform 220ms ease,
            box-shadow 220ms ease,
            border-color 220ms ease,
            background 220ms ease,
            opacity 220ms ease,
            filter 220ms ease;
          overflow: hidden;
        }

        .button-glass-sheen,
        .button-glass-tint {
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: inherit;
        }

        .button-glass-sheen {
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.26) 0%,
              rgba(255, 255, 255, 0.12) 22%,
              rgba(255, 255, 255, 0.03) 42%,
              rgba(255, 255, 255, 0) 62%
            );
          opacity: 0.9;
        }

        .button-glass-tint {
          background:
            radial-gradient(
              ellipse at 50% 118%,
              rgba(112, 236, 222, 0.2) 0%,
              rgba(112, 236, 222, 0.06) 42%,
              rgba(112, 236, 222, 0) 74%
            );
          opacity: 0.86;
        }

        .button-label {
          position: relative;
          z-index: 2;
        }

        .primary-button .button-label {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: rgba(236, 250, 246, 0.94);
        }

        .button-label-arrow {
          display: inline-block;
          color: rgba(236, 250, 246, 0.94);
          transition: transform 200ms ease;
        }

        .primary-button {
          background:
            linear-gradient(
              180deg,
              rgba(112, 224, 210, 0.18) 0%,
              rgba(68, 176, 170, 0.16) 46%,
              rgba(18, 84, 88, 0.2) 100%
            );
          box-shadow:
            0 0 34px rgba(110, 232, 220, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.28),
            inset 0 -14px 24px rgba(8, 28, 34, 0.24);
        }

        .primary-button-ready {
          border-color: rgba(208, 248, 242, 0.36);
          box-shadow:
            0 0 44px rgba(118, 236, 224, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            inset 0 -14px 24px rgba(8, 28, 34, 0.26);
          filter: brightness(1.04);
          animation: none;
        }

        .secondary-button {
          background:
            linear-gradient(
              180deg,
              rgba(74, 172, 166, 0.16) 0%,
              rgba(18, 84, 88, 0.22) 100%
            );
          box-shadow:
            0 0 34px rgba(110, 232, 220, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            inset 0 -12px 22px rgba(8, 28, 34, 0.26);
        }

        .primary-button:hover,
        .secondary-button:hover {
          transform: translateY(-1px);
          border-color: rgba(224, 255, 248, 0.32);
          box-shadow:
            0 0 50px rgba(126, 236, 226, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.34),
            inset 0 -14px 24px rgba(8, 28, 34, 0.28);
        }

        .primary-button:hover .button-label-arrow {
          transform: translateX(0.25rem);
        }

        .primary-button:active,
        .secondary-button:active {
          transform: translateY(1px);
          box-shadow:
            inset 0 2px 6px rgba(0, 0, 0, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
        }

        .primary-button:disabled,
        .secondary-button:disabled {
          opacity: 0.65;
          cursor: default;
          transform: none;
        }

        .primary-button,
        .primary-button:hover,
        .primary-button:active,
        .primary-button:disabled {
          transform: none;
        }

        .loading-zone {
          margin-top: 172px;
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
          color: rgba(243, 250, 246, 0.96);
          text-shadow:
            0 4px 16px rgba(0, 0, 0, 0.26),
            0 0 10px rgba(136, 236, 224, 0.08);
          animation: solaceBreathing 3.2s ease-in-out infinite;
        }

        .response-zone {
          margin-top: 6px;
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
          margin-top: 172;
          padding: 22px 26px;
          border-radius: 32px;
          border: 1px solid rgba(196, 240, 234, 0.18);
          background:
            linear-gradient(
              180deg,
              rgba(8, 18, 20, 0.84) 0%,
              rgba(6, 14, 16, 0.8) 100%
            );
          box-shadow:
            0 0 20px rgba(110, 232, 220, 0.08),
            0 0 0 1px rgba(132, 232, 220, 0.03);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          animation: responseReveal 600ms ease forwards;
          opacity: 0;
          transform: translateY(12px);
        }

        .response-card-crisis {
          border-color: rgba(216, 255, 235, 0.12);
          background:
            linear-gradient(
              180deg,
              rgba(10, 14, 24, 0.82) 0%,
              rgba(6, 10, 18, 0.84) 100%
            );
          box-shadow:
            0 0 18px rgba(110, 232, 220, 0.06),
            0 0 0 1px rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
        }

        .response-card-label {
          margin-bottom: 12px;
          font-size: 0.75rem;
          font-weight: 560;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(214, 238, 234, 0.66);
        }

        .response-copy {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .response-text {
          margin: 0;
          color: rgba(243, 250, 246, 0.96);
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

        @keyframes buttonReadyFloat {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-2px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @media (max-width: 900px) {
          .realm-content {
            padding-top: 130px;
          }

          .bubble-stage,
          .response-zone {
            max-width: 100%;
          }
        }

        @media (max-width: 640px) {
          .realm-content {
            padding-top: 122px;
            padding-left: 18px;
            padding-right: 18px;
          }

          .realm-intro {
            min-height: 150px;
          }

          .bubble-stage {
            margin-top: 14px;
            margin-bottom: 18px;
            padding: 0 6px;
          }

          .bubble-field {
            --bubble-y-offset: 42px;
          }

          .mind-input {
            min-height: 56px;
            height: 56px;
            padding: 0 20px;
            border-radius: 26px;
            font-size: 0.95rem;
          }

          .mind-input-overlay {
            left: 20px;
            right: 20px;
            font-size: 0.88rem;
            color: rgba(218, 236, 228, 0.42);
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
      </div>
    </PageShell>
  );
}
