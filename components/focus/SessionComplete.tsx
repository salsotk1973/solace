"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getToolRgb } from "@/lib/design-tokens";

// EXPECTED ACCENT: #E8A83E gold (Clarity) — if eyebrow ships teal, this is wrong
const accent = getToolRgb("focus");
const A = (a: number) => `rgba(${accent}, ${a})`;

const TITLE = "Good work.";
const BODY_MOBILE = "Save sessions and track focus.";
const BODY_DESKTOP = "Save sessions and track focus patterns with a free account.";

interface Props {
  onClose: () => void;
}

function handleCtaClick(action: "start_free" | "all_tools") {
  if (typeof window !== "undefined" && (window as any).posthog) {
    (window as any).posthog.capture("session_complete_cta_clicked", { action });
  }
}

export default function SessionComplete({ onClose }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={[
        "fixed bottom-0 left-0 right-0 z-50",
        "transition-transform duration-500 ease-out",
        visible ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
      style={{
        background: "rgba(6,16,22,0.97)",
        borderTop: `2px solid ${A(0.55)}`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-[720px] mx-auto px-6 py-4 md:px-8 md:py-6">
        {/* Row 1: eyebrow + close */}
        <div className="flex flex-row items-center justify-between">
          <span
            className="[font-family:var(--font-jost)] text-[11px] tracking-[0.26em] uppercase"
            style={{ color: A(0.85) }}
          >
            SESSION COMPLETE
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-[18px] leading-none text-[rgba(255,255,255,0.65)] hover:text-[rgba(255,255,255,0.95)] transition-colors cursor-pointer"
            style={{ background: "none", border: "none", padding: "4px 0 4px 8px" }}
          >
            ✕
          </button>
        </div>

        {/* Row 2: title */}
        <h2
          className="mt-1 [font-family:var(--font-display)] italic font-light text-[22px] md:text-[28px] leading-[1.15]"
          style={{ color: "rgba(255,255,255,0.95)" }}
        >
          {TITLE}
        </h2>

        {/* Row 3: body — full width */}
        <p
          className="mt-1 [font-family:var(--font-jost)] text-[13px] md:text-[14px] leading-[1.5] font-light"
          style={{ color: "rgba(255,255,255,0.80)" }}
        >
          <span className="md:hidden">{BODY_MOBILE}</span>
          <span className="hidden md:inline">{BODY_DESKTOP}</span>
        </p>

        {/* Row 4: dual CTA — primary + secondary */}
        <div className="mt-3 flex flex-row items-center gap-3 max-[349px]:flex-col max-[349px]:items-stretch max-[349px]:gap-2">
          <Link
            href="/sign-up"
            onClick={() => handleCtaClick("start_free")}
            className="inline-flex items-center justify-center px-4 py-2 [font-family:var(--font-jost)] text-[10px] tracking-[0.20em] uppercase rounded-full transition-colors"
            style={{
              border: `1px solid ${A(0.70)}`,
              color: A(0.95),
              backgroundColor: A(0.08),
            }}
          >
            Start free →
          </Link>
          <Link
            href="/tools"
            onClick={() => handleCtaClick("all_tools")}
            className="inline-flex items-center justify-center px-4 py-2 [font-family:var(--font-jost)] text-[10px] tracking-[0.20em] uppercase rounded-full transition-colors"
            style={{
              border: `1px solid ${A(0.35)}`,
              color: A(0.70),
            }}
          >
            All tools →
          </Link>
        </div>
      </div>
    </div>
  );
}
