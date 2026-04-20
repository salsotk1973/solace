"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SessionCompleteProps {
  isLoggedIn: boolean;
  isPaid?: boolean;
  onDismiss: () => void;
}

const T = (a: number) => `rgba(60,192,212,${a})`;

export default function SessionComplete({
  isLoggedIn,
  isPaid,
  onDismiss,
}: SessionCompleteProps) {
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
        background:           "rgba(6,16,22,0.97)",
        borderTop:            `2px solid ${T(0.55)}`,
        backdropFilter:       "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-[720px] mx-auto px-6 py-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p
            className="[font-family:var(--font-jost)] text-[10px] tracking-[0.24em] uppercase mb-1"
            style={{ color: T(0.70) }}
          >
            Session complete
          </p>
          <p
            className="[font-family:var(--font-display)] italic font-light text-[24px] md:text-[28px] mb-1"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            Rest well.
          </p>
          <p
            className="[font-family:var(--font-jost)] text-[13px] font-light leading-snug"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            {isLoggedIn
              ? "Your session has been saved."
              : "Save history and track streaks with a free account."}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 pt-1">
          {!isLoggedIn && (
            <Link
              href="/sign-up"
              className="[font-family:var(--font-jost)] text-[11px] tracking-[0.14em] uppercase px-4 py-2.5 rounded-full transition-all duration-300"
              style={{
                color:      T(0.90),
                border:     `1px solid ${T(0.40)}`,
                background: T(0.08),
              }}
            >
              Start free →
            </Link>
          )}
          {isLoggedIn && !isPaid && (
            <Link
              href="/pricing"
              className="[font-family:var(--font-jost)] text-[11px] tracking-[0.14em] uppercase px-4 py-2.5 rounded-full transition-all duration-300"
              style={{
                color:      T(0.90),
                border:     `1px solid ${T(0.40)}`,
                background: T(0.08),
              }}
            >
              Unlock full history →
            </Link>
          )}
          <button
            onClick={onDismiss}
            aria-label="Dismiss"
            className="text-[28px] leading-none flex items-center justify-center transition-all duration-200 cursor-pointer hover:opacity-70"
            style={{
              color:      "rgba(255,255,255,0.75)",
              background: "none",
              border:     "none",
              padding:    "4px 8px",
            }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
