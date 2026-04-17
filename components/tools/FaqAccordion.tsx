"use client";

import { useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "What is box breathing and does it actually work?",
    a: "Box breathing is a simple pattern — 4 seconds in, 4 hold, 4 out, 4 hold. It's used by everyone from Navy SEALs to therapists because it gives your nervous system something to follow. Most people notice a shift within a few cycles.",
  },
  {
    q: "Is Solace a therapy app?",
    a: "No. Solace is designed for adults as a reflective support tool — not medical, psychological, or professional advice. If you're experiencing a mental health crisis, please reach out to a qualified professional or crisis service.",
  },
  {
    q: "How is the Pomodoro technique different on Solace?",
    a: "The mechanics are the same — 25 minutes of work, 5 of rest. The difference is the experience. Solace's Focus Timer is designed to feel like a calm container for your attention, not a productivity machine counting down at you.",
  },
  {
    q: "Do I need an account to use these tools?",
    a: "No. Every tool is free to use without an account. An account lets you save your history, track streaks, and see patterns over time — but the core experience is always available.",
  },
  {
    q: "What is cognitive reframing and is it safe?",
    a: "Cognitive reframing is the practice of looking at a thought from a different angle — not to dismiss it, but to see it more clearly. Solace's Thought Reframer guides you through four gentle questions. It works best for everyday thinking patterns rather than clinical conditions.",
  },
  {
    q: "What's the difference between free and paid?",
    a: "All nine tools are free to try. A free account gives you 7 days of session history and one AI session per day with Choose. A paid account (A$9/month or A$79/year) unlocks full history, unlimited AI sessions, and mood patterns over time. Most people upgrade around day 8 — the moment history starts to matter.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Your sessions are stored only for you — we don't read them, sell them, or use them to train AI. AI tool sessions are processed in real time and not retained after your session ends. You can delete your account and all data at any time.",
  },
  {
    q: "How do the AI tools work?",
    a: "Choose, Clear Your Mind, and Break It Down are powered by a language model. You type — the tool responds. Nothing is stored after your session. Free accounts get one Choose session per day. Clear Your Mind and Break It Down are available on a paid plan.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      {FAQS.map((faq, i) => (
        <div key={i} className="border-t border-[rgba(200,210,220,0.05)]">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-5 text-left gap-6 group cursor-pointer"
          >
            <span className="[font-family:var(--font-display)] font-light text-[19px] text-[rgba(200,215,225,0.82)] group-hover:text-[rgba(200,215,225,0.98)] transition-colors duration-200 leading-snug">
              {faq.q}
            </span>
            {/* + rotates 45° → × */}
            <span
              className={[
                "flex-shrink-0 text-[rgba(200,215,225,0.38)] transition-transform duration-300 text-[20px] leading-none select-none",
                open === i ? "rotate-45" : "",
              ].join(" ")}
              aria-hidden="true"
            >
              +
            </span>
          </button>

          {/* Collapsible answer — max-height drives the open/close animation */}
          <div
            className={[
              "overflow-hidden transition-all duration-[400ms] ease-in-out",
              open === i ? "max-h-[220px]" : "max-h-0",
            ].join(" ")}
          >
            <p className="[font-family:var(--font-jost)] text-[14px] font-[300] text-[rgba(200,210,220,0.75)] leading-[1.8] pb-5 pr-8">
              {faq.a}
            </p>
          </div>
        </div>
      ))}
      {/* Bottom border to close the last item */}
      <div className="border-t border-[rgba(200,210,220,0.05)]" />
    </div>
  );
}
