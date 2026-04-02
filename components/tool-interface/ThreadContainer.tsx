"use client";

import { useMemo, useState } from "react";

import QuestionCard from "./QuestionCard";
import ReflectionCard from "./ReflectionCard";
import ThinkingState from "./ThinkingState";
import Composer from "./Composer";

type ThreadItem = {
  question: string;
  reflection: string | null;
  recoveryOptions?: string[];
  relatedToolSuggestion?: {
    slug: string;
    title: string;
  } | null;
  isCrisisFallback?: boolean;
};

function getRelatedToolTitle(slug: string) {
  if (slug === "clarity") return "Clarity Tool";
  if (slug === "overthinking-reset") return "Overthinking Reset";
  if (slug === "decision-filter") return "Decision Filter";
  return "Related Tool";
}

function getToolEndpoint(toolSlug: string) {
  if (toolSlug === "clarity") {
    return "/api/solace/choose";
  }

  if (toolSlug === "overthinking-reset") {
    return "/api/solace/slow-down";
  }

  if (toolSlug === "decision-filter") {
    return "/api/reflect";
  }

  return "/api/reflect";
}

function buildRequestBody(toolSlug: string, question: string) {
  if (toolSlug === "clarity") {
    return { input: question };
  }

  if (toolSlug === "overthinking-reset") {
    return { thoughts: [question] };
  }

  return { toolSlug, question };
}

function normalizeReflection(data: unknown): string {
  const payload =
    typeof data === "object" && data !== null
      ? (data as {
          text?: unknown;
          message?: unknown;
          reflection?: unknown;
          error?: unknown;
        })
      : {};

  if (typeof payload.text === "string" && payload.text.trim()) {
    return payload.text.trim();
  }

  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message.trim();
  }

  if (typeof payload.reflection === "string" && payload.reflection.trim()) {
    return payload.reflection.trim();
  }

  if (Array.isArray(payload.reflection)) {
    return payload.reflection.filter(Boolean).join("\n\n").trim();
  }

  if (typeof payload.error === "string" && payload.error.trim()) {
    return payload.error.trim();
  }

  return "Something interrupted the reflection for a moment. Please try again.";
}

export default function ThreadContainer({
  toolSlug,
}: {
  toolSlug: string;
}) {
  const [thread, setThread] = useState<ThreadItem[]>([]);
  const [thinking, setThinking] = useState(false);

  const latestItem = useMemo(
    () => (thread.length > 0 ? thread[thread.length - 1] : null),
    [thread],
  );

  const hideComposer = Boolean(latestItem?.isCrisisFallback);

  async function handleSubmit(question: string) {
    const newItem: ThreadItem = {
      question,
      reflection: null,
      recoveryOptions: [],
      relatedToolSuggestion: null,
      isCrisisFallback: false,
    };

    setThread((prev) => [...prev, newItem]);
    setThinking(true);

    const endpoint = getToolEndpoint(toolSlug);
    const body = buildRequestBody(toolSlug, question);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json().catch(() => null);
      const reflection = normalizeReflection(data);

      setThread((prev) =>
        prev.map((item, index) =>
          index === prev.length - 1
            ? {
                ...item,
                reflection,
                recoveryOptions: Array.isArray(data?.recoveryOptions)
                  ? data.recoveryOptions
                  : [],
                relatedToolSuggestion: data?.relatedToolSuggestion
                  ? {
                      slug: data.relatedToolSuggestion,
                      title: getRelatedToolTitle(data.relatedToolSuggestion),
                    }
                  : data?.relatedToolSlug
                    ? {
                        slug: data.relatedToolSlug,
                        title: getRelatedToolTitle(data.relatedToolSlug),
                      }
                    : null,
                isCrisisFallback: Boolean(data?.isCrisisFallback),
              }
            : item,
        ),
      );
    } catch {
      setThread((prev) =>
        prev.map((item, index) =>
          index === prev.length - 1
            ? {
                ...item,
                reflection:
                  "Something interrupted the reflection for a moment. Please try again.",
                recoveryOptions: [],
                relatedToolSuggestion: null,
                isCrisisFallback: false,
              }
            : item,
        ),
      );
    } finally {
      setThinking(false);
    }
  }

  return (
    <div className="space-y-12">
      {thread.map((item, index) => (
        <div key={index} className="space-y-5">
          <QuestionCard question={item.question} />

          {item.reflection ? (
            <ReflectionCard
              reflection={item.reflection}
              recoveryOptions={item.recoveryOptions}
              relatedToolSuggestion={item.relatedToolSuggestion}
              isCrisisFallback={item.isCrisisFallback}
            />
          ) : (
            <ThinkingState toolSlug={toolSlug} />
          )}
        </div>
      ))}

      {!hideComposer && <Composer onSubmit={handleSubmit} disabled={thinking} />}
    </div>
  );
}
