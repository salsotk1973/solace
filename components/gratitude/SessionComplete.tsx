"use client";

import Link from "next/link";

interface Props {
  visible: boolean;
  isLoggedIn: boolean;
  isPaid?: boolean;
  onDismiss: () => void;
}

export default function SessionComplete({ visible, isLoggedIn, isPaid, onDismiss }: Props) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-[550ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-[780px] mx-auto px-6 pb-6">
        <div className="flex items-center gap-4 bg-[rgba(16,14,8,0.94)] border border-[rgba(220,175,80,0.14)] rounded-[14px] px-6 py-4 backdrop-blur-sm">
          {isLoggedIn ? (
            <p className="flex-1 [font-family:var(--font-jost)] text-[13px] font-light text-[rgba(230,195,110,0.65)]">
              Added to your jar.
            </p>
          ) : (
            <>
              <p className="[font-family:var(--font-jost)] text-[13px] font-light text-[rgba(230,195,110,0.75)] whitespace-nowrap">
                Added to your jar.
              </p>
              <p className="hidden sm:block flex-1 [font-family:var(--font-jost)] text-[13px] font-light text-[rgba(200,175,100,0.42)]">
                Create a free account to keep your entries and track your streak
              </p>
              <Link
                href="/sign-up"
                className="[font-family:var(--font-jost)] text-[13px] font-light text-[rgba(230,195,110,0.85)] border border-[rgba(220,175,80,0.3)] rounded-[999px] px-4 py-2 hover:border-[rgba(220,175,80,0.6)] hover:text-[rgba(230,195,110,1)] transition-all duration-300 whitespace-nowrap ml-auto"
              >
                Start free →
              </Link>
            </>
          )}
          {isLoggedIn && !isPaid && (
            <Link
              href="/pricing"
              className="[font-family:var(--font-jost)] text-[11px] tracking-[0.14em] uppercase text-[rgba(232,168,62,0.80)] border border-[rgba(232,168,62,0.28)] px-4 py-2 rounded-[2px] hover:border-[rgba(232,168,62,0.52)] hover:text-[rgba(255,200,100,0.95)] transition-all duration-300 whitespace-nowrap flex-shrink-0"
            >
              Unlock full history →
            </Link>
          )}
          <button
            onClick={onDismiss}
            className="[font-family:var(--font-jost)] text-[18px] font-light text-[rgba(220,175,80,0.32)] hover:text-[rgba(220,175,80,0.72)] transition-colors duration-200 cursor-pointer flex-shrink-0 leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
