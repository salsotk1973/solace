"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SessionCompleteProps {
  isLoggedIn: boolean;
  isPaid?: boolean;
  onDismiss: () => void;
}

const T = (a: number) => `rgba(60,192,212,${a})`;

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
        "transition-transform duration-[550ms]",
        visible ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
      style={{
        transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
        background:               "rgba(6,16,22,0.97)",
        borderTop:                `2px solid ${T(0.55)}`,
        backdropFilter:           "blur(20px)",
        WebkitBackdropFilter:     "blur(20px)",
      }}
    >
      <div className="max-w-[720px] mx-auto px-6 py-5">

        <div className="flex flex-row items-center justify-between">
          <span
            className="[font-family:var(--font-jost)] text-[11px] tracking-[0.26em] uppercase"
            style={{ color: T(0.85) }}
          >
            Session complete
          </span>
          <button
            onClick={onDismiss}
            aria-label="Close"
            className="text-[22px] leading-none flex items-center justify-center transition-opacity duration-200 cursor-pointer hover:opacity-60"
            style={{ color: "rgba(255,255,255,0.65)", background: "none", border: "none", padding: "4px 0 4px 8px" }}
          >
            ×
          </button>
        </div>

        <p
          className="[font-family:var(--font-display)] italic font-light text-[24px] mt-3"
          style={{ color: "rgba(255,255,255,0.95)" }}
        >
          Good work.
        </p>

        <p
          className="[font-family:var(--font-jost)] text-[14px] leading-[1.5] font-light mt-2"
          style={{ color: "rgba(255,255,255,0.80)" }}
        >
          <span className="md:hidden">Save sessions and track focus.</span>
          <span className="hidden md:inline">Save sessions and track focus patterns with a free account.</span>
        </p>

        {!isLoggedIn && (
          <Link
            href="/sign-up"
            className="mt-4 inline-flex items-center justify-center px-6 py-2.5 [font-family:var(--font-jost)] text-[12px] tracking-[0.22em] uppercase rounded-full transition-colors"
            style={{ color: "rgba(60,192,212,0.95)", border: "1px solid rgba(60,192,212,0.60)" }}
          >
            Start free →
          </Link>
        )}
        {isLoggedIn && !isPaid && (
          <Link
            href="/pricing"
            className="mt-4 inline-flex items-center justify-center px-6 py-2.5 [font-family:var(--font-jost)] text-[12px] tracking-[0.22em] uppercase rounded-full transition-colors"
            style={{ color: "rgba(60,192,212,0.95)", border: "1px solid rgba(60,192,212,0.60)" }}
          >
            Unlock full history →
          </Link>
        )}

      </div>
    </div>
  );
}
