"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SessionCompleteProps {
  isLoggedIn: boolean;
  isPaid?: boolean;
  onDismiss: () => void;
}

export default function SessionComplete({ isLoggedIn, isPaid, onDismiss }: SessionCompleteProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={[
        "fixed bottom-0 left-0 right-0 z-50",
        "border-t border-[rgba(240,170,70,0.1)] bg-[rgba(9,13,20,0.97)] backdrop-blur-xl",
        "transition-transform duration-[550ms]",
        visible ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
      style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
    >
      <div className="max-w-[720px] mx-auto px-6 py-5 flex items-center justify-between gap-6">
        <div className="min-w-0">
          <p className="[font-family:var(--font-display)] italic font-light text-[21px] text-[rgba(255,215,150,0.88)] mb-0.5">
            {isLoggedIn ? "Great work." : "Session complete."}
          </p>
          <p className="[font-family:var(--font-jost)] text-[12px] text-[rgba(170,180,190,0.5)] leading-snug">
            {isLoggedIn && isPaid
              ? "Your session has been saved."
              : isLoggedIn
              ? "Your session has been saved."
              : "Save history & weekly totals with a free account"}
          </p>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          {!isLoggedIn && (
            <Link
              href="/sign-up"
              className="[font-family:var(--font-jost)] text-[11px] tracking-[0.14em] uppercase text-[rgba(255,200,120,0.8)] border border-[rgba(240,170,70,0.28)] px-5 py-2.5 rounded-[2px] hover:border-[rgba(240,170,70,0.52)] hover:text-[rgba(255,215,150,0.95)] transition-all duration-300"
            >
              Start free →
            </Link>
          )}
          {isLoggedIn && !isPaid && (
            <Link
              href="/pricing"
              className="[font-family:var(--font-jost)] text-[11px] tracking-[0.14em] uppercase text-[rgba(232,168,62,0.80)] border border-[rgba(232,168,62,0.28)] px-5 py-2.5 rounded-[2px] hover:border-[rgba(232,168,62,0.52)] hover:text-[rgba(255,200,100,0.95)] transition-all duration-300"
            >
              Unlock full history →
            </Link>
          )}
          <button
            onClick={onDismiss}
            aria-label="Dismiss"
            className="[font-family:var(--font-jost)] text-[18px] text-[rgba(160,170,180,0.38)] hover:text-[rgba(200,210,220,0.7)] transition-colors duration-200 w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
