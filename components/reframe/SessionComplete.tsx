"use client";

import Link from "next/link";

interface Props {
  visible: boolean;
  isLoggedIn: boolean;
  onDismiss: () => void;
}

export default function SessionComplete({ visible, isLoggedIn, onDismiss }: Props) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-[550ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-[780px] mx-auto px-6 pb-6">
        <div className="flex items-center gap-4 bg-[rgba(10,20,14,0.94)] border border-[rgba(130,185,140,0.18)] rounded-[14px] px-6 py-4 backdrop-blur-sm">
          {isLoggedIn ? (
            <p className="flex-1 [font-family:var(--font-jost)] text-[13px] font-light text-[rgba(160,215,175,0.65)]">
              Reframe saved to your history.
            </p>
          ) : (
            <>
              <p className="[font-family:var(--font-jost)] text-[13px] font-light text-[rgba(160,215,175,0.65)] whitespace-nowrap">
                Reframe saved.
              </p>
              <p className="hidden sm:block flex-1 [font-family:var(--font-jost)] text-[13px] font-light text-[rgba(130,185,140,0.45)]">
                Create a free account to revisit your reframes over time
              </p>
              <Link
                href="/sign-up"
                className="[font-family:var(--font-jost)] text-[13px] font-light text-[rgba(160,215,175,0.85)] border border-[rgba(130,185,140,0.3)] rounded-[999px] px-4 py-2 hover:border-[rgba(130,185,140,0.6)] hover:text-[rgba(160,215,175,1)] transition-all duration-300 whitespace-nowrap ml-auto"
              >
                Start free →
              </Link>
            </>
          )}
          <button
            onClick={onDismiss}
            className="[font-family:var(--font-jost)] text-[18px] font-light text-[rgba(130,185,140,0.35)] hover:text-[rgba(130,185,140,0.75)] transition-colors duration-200 cursor-pointer flex-shrink-0 leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
