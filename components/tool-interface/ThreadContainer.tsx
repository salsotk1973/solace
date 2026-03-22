"use client";

import { useState } from "react";

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
};

function getRelatedToolTitle(slug: string): string {
  if (slug === "clarity") return "Clarity Tool";
  if (slug === "overthinking-reset") return "Overthinking Reset";
  if (slug === "decision-filter") return "Decision Filter";
  return "Related Tool";
}

export default function ThreadContainer({
  toolSlug,
}: {
  toolSlug: string;
}) {
  const [thread, setThread] = useState<ThreadItem[]>([]);
  const [thinking, setThinking] = useState(false);

  async function handleSubmit(question: string) {
    const newItem: ThreadItem = {
      question,
      reflection: null,
      recoveryOptions: [],
      relatedToolSuggestion: null,
    };

    setThread((prev) => [...prev, newItem]);
    setThinking(true);

    const response = await fetch("/api/reflect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ toolSlug, question }),
    });

    const data = await response.json();

    setThread((prev) =>
      prev.map((item, index) =>
        index === prev.length - 1
          ? {
              ...item,
              reflection: data.reflection,
              recoveryOptions: data.recoveryOptions ?? [],
              relatedToolSuggestion: data.relatedToolSuggestion
                ? {
                    slug: data.relatedToolSuggestion,
                    title: getRelatedToolTitle(data.relatedToolSuggestion),
                  }
                : null,
            }
          : item,
      ),
    );

    setThinking(false);
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
            />
          ) : (
            <ThinkingState toolSlug={toolSlug} />
          )}
        </div>
      ))}

      <Composer onSubmit={handleSubmit} disabled={thinking} />
    </div>
  );
}