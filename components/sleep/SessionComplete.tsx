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
      <div className="max-w-[720px] mx-auto px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-6">

          {/* ── Content ─────────────────────────────────────────── */}
          <div className="min-w-0">

            <div className="flex items-center justify-between md:block">
              <p
                className="[font-family:var(--font-jost)] text-[10px] tracking-[0.24em] uppercase"
                style={{ color: T(0.70) }}
              >
                Session complete
              </p>
              <button
                onClick={onDismiss}
                aria-label="Dismiss"
                className="md:hidden text-[28px] leading-none flex items-center justify-center transition-all duration-200 cursor-pointer hover:opacity-70"
                style={{ color: "rgba(255,255,255,0.75)", background: "none", border: "none", padding: "4px 8px" }}
              >
                ×
              </button>
            </div>

            <p
              className="[font-family:var(--font-display)] italic font-light text-[24px] md:text-[28px] mt-3 md:mt-1 mb-0 md:mb-1"
              style={{ color: "rgba(255,255,255,0.95)" }}
            >
              Rest well.
            </p>

            <p
              className="[font-family:var(--font-jost)] text-[13px] font-light leading-snug mt-2 md:mt-0"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              {isLoggedIn
                ? "Your session has been saved."
                : <>Save history and track streaks<span className="hidden md:inline"> with a free account</span>.</>}
            </p>

            {!isLoggedIn && (
              <Link
                href="/sign-up"
                className="md:hidden mt-4 inline-flex [font-family:var(--font-jost)] text-[11px] tracking-[0.14em] uppercase px-4 py-2.5 rounded-full transition-all duration-300"
                style={{ color: T(0.90), border: `1px solid ${T(0.40)}`, background: T(0.08) }}
              >
                Start free →
              </Link>
            )}
            {isLoggedIn && !isPaid && (
              <Link
                href="/pricing"
                className="md:hidden mt-4 inline-flex [font-family:var(--font-jost)] text-[11px] tracking-[0.14em] uppercase px-4 py-2.5 rounded-full transition-all duration-300"
                style={{ color: T(0.90), border: `1px solid ${T(0.40)}`, background: T(0.08) }}
              >
                Unlock full history →
              </Link>
            )}
          </div>

          {/* ── Desktop-only actions ─────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0 pt-1">
            {!isLoggedIn && (
              <Link
                href="/sign-up"
                className="[font-family:var(--font-jost)] text-[11px] tracking-[0.14em] uppercase px-4 py-2.5 rounded-full transition-all duration-300"
                style={{ color: T(0.90), border: `1px solid ${T(0.40)}`, background: T(0.08) }}
              >
                Start free →
              </Link>
            )}
            {isLoggedIn && !isPaid && (
              <Link
                href="/pricing"
                className="[font-family:var(--font-jost)] text-[11px] tracking-[0.14em] uppercase px-4 py-2.5 rounded-full transition-all duration-300"
                style={{ color: T(0.90), border: `1px solid ${T(0.40)}`, background: T(0.08) }}
              >
                Unlock full history →
              </Link>
            )}
            <button
              onClick={onDismiss}
              aria-label="Dismiss"
              className="text-[28px] leading-none flex items-center justify-center transition-all duration-200 cursor-pointer hover:opacity-70"
              style={{ color: "rgba(255,255,255,0.75)", background: "none", border: "none", padding: "4px 8px" }}
            >
              ×
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
