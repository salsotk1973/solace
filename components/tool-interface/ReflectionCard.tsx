"use client";

import { useState } from "react";
import Link from "next/link";

import Card from "../ui/Card";

type Props = {
  reflection: string;
  recoveryOptions?: string[];
  relatedToolSuggestion?: {
    slug: string;
    title: string;
  } | null;
  isCrisisFallback?: boolean;
};

function getFriendlyRecoveryLabel(option: string): string {
  if (option === "Focus more on the emotional side") {
    return "This feels more emotional";
  }

  if (option === "Focus more on the practical side") {
    return "Please focus on the practical side";
  }

  if (option === "That’s not the real tension") {
    return "That’s not what this is really about";
  }

  return option;
}

export default function ReflectionCard({
  reflection,
  recoveryOptions = [],
  relatedToolSuggestion = null,
  isCrisisFallback = false,
}: Props) {
  const [feedback, setFeedback] = useState<"helpful" | "not_quite" | null>(null);
  const [selectedRecovery, setSelectedRecovery] = useState<string | null>(null);

  const labelText = isCrisisFallback ? "Important" : "Solace";
  const labelClassName = isCrisisFallback
    ? "mb-3 text-sm font-medium uppercase tracking-[0.14em] text-neutral-700"
    : "mb-3 text-sm font-medium text-neutral-500";

  const reflectionClassName = isCrisisFallback
    ? "whitespace-pre-line text-[1.05rem] leading-8 text-neutral-950"
    : "whitespace-pre-line text-[1.05rem] leading-8 text-neutral-900";

  const cardClassName = isCrisisFallback
    ? "border border-neutral-300 bg-neutral-50/95"
    : "";

  return (
    <Card className={cardClassName}>
      <div className={labelClassName}>{labelText}</div>

      <div className={reflectionClassName}>{reflection}</div>

      {!isCrisisFallback && (
        <>
          <div className="flex items-center gap-5 pt-5">
            <button
              type="button"
              onClick={() => {
                setFeedback("helpful");
                setSelectedRecovery(null);
              }}
              className={`text-sm transition ${
                feedback === "helpful"
                  ? "font-medium text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              Helpful
            </button>

            <button
              type="button"
              onClick={() => setFeedback("not_quite")}
              className={`text-sm transition ${
                feedback === "not_quite"
                  ? "font-medium text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              Not quite
            </button>
          </div>

          {feedback === "not_quite" && recoveryOptions.length > 0 && (
            <div className="mt-5 rounded-[24px] border border-neutral-200 bg-neutral-50/80 p-5">
              <p className="mb-3 text-sm text-neutral-600">
                What would help me understand better?
              </p>

              <div className="flex flex-wrap gap-2">
                {recoveryOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedRecovery(option)}
                    className="
                      rounded-full
                      border
                      border-neutral-200
                      bg-white
                      px-4
                      py-2.5
                      text-sm
                      text-neutral-700
                      transition
                      hover:border-neutral-300
                      hover:text-neutral-900
                    "
                  >
                    {getFriendlyRecoveryLabel(option)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedRecovery && (
            <div className="mt-3 text-sm text-neutral-500">
              Thanks. I’ll use that direction in the next version of this reflection.
            </div>
          )}

          {relatedToolSuggestion && (
            <div className="mt-6 rounded-[24px] border border-neutral-200 bg-neutral-50/80 p-5">
              <p className="mb-2 text-sm text-neutral-500">
                You may also want to explore
              </p>

              <Link
                href={`/tools/${relatedToolSuggestion.slug}`}
                className="
                  inline-flex
                  items-center
                  rounded-full
                  border
                  border-neutral-300
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-neutral-900
                  transition
                  hover:border-neutral-400
                "
              >
                {relatedToolSuggestion.title}
              </Link>
            </div>
          )}
        </>
      )}
    </Card>
  );
}