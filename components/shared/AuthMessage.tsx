'use client';

import { getToolRgb } from '@/lib/design-tokens';

interface Props {
  toolKey: 'choose' | 'clear-your-mind' | 'break-it-down';
  variant: 'logged-out' | 'paid-required' | 'quota-exhausted';
  onClose?: () => void;
}

const COPY = {
  choose: {
    'logged-out': {
      title: 'Almost there.',
      body: 'Choose is part of your free account. Sign in to continue your decision.',
      primaryLabel: 'SIGN IN →',
      primaryHref: '/sign-in?redirect_url=/tools/choose',
      secondaryLabel: 'CREATE ACCOUNT →',
      secondaryHref: '/sign-up?redirect_url=/tools/choose',
    },
    'quota-exhausted': {
      title: "That's today's session.",
      body: 'Choose is one decision per day on the free plan. Tomorrow it resets — or unlock unlimited now.',
      primaryLabel: 'UPGRADE →',
      primaryHref: '/pricing',
      secondaryLabel: 'BACK TO TOOLS →',
      secondaryHref: '/tools',
    },
    'paid-required': null,
  },
  'clear-your-mind': {
    'logged-out': {
      title: 'Almost there.',
      body: 'Clear Your Mind is part of a paid account. Sign in to keep going.',
      primaryLabel: 'SIGN IN →',
      primaryHref: '/sign-in?redirect_url=/tools/clear-your-mind',
      secondaryLabel: 'CREATE ACCOUNT →',
      secondaryHref: '/sign-up?redirect_url=/tools/clear-your-mind',
    },
    'paid-required': {
      title: 'One step away.',
      body: 'Clear Your Mind is part of the paid plan. Unlock it for A$9/month.',
      primaryLabel: 'UPGRADE →',
      primaryHref: '/pricing',
      secondaryLabel: 'BACK TO TOOLS →',
      secondaryHref: '/tools',
    },
    'quota-exhausted': null,
  },
  'break-it-down': {
    'logged-out': {
      title: 'Almost there.',
      body: 'Break It Down is part of a paid account. Sign in to keep going.',
      primaryLabel: 'SIGN IN →',
      primaryHref: '/sign-in?redirect_url=/tools/break-it-down',
      secondaryLabel: 'CREATE ACCOUNT →',
      secondaryHref: '/sign-up?redirect_url=/tools/break-it-down',
    },
    'paid-required': {
      title: 'One step away.',
      body: 'Break It Down is part of the paid plan. Unlock it for A$9/month.',
      primaryLabel: 'UPGRADE →',
      primaryHref: '/pricing',
      secondaryLabel: 'BACK TO TOOLS →',
      secondaryHref: '/tools',
    },
    'quota-exhausted': null,
  },
} as const;

export default function AuthMessage({ toolKey, variant, onClose }: Props) {
  const copy = COPY[toolKey][variant];
  if (!copy) return null;

  // EXPECTED ACCENT comments — do not delete:
  // choose          → #7C6FCD violet (Decide)
  // clear-your-mind → #E8A83E gold (Clarity)
  // break-it-down   → #7C6FCD violet (Decide)
  const accent = getToolRgb(toolKey);
  const A = (a: number) => `rgba(${accent}, ${a})`;

  return (
    <div className="relative max-w-[640px] mx-auto px-6 py-12 md:py-16 text-center">
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-0 right-4 text-[18px] leading-none text-[rgba(255,255,255,0.65)] hover:text-[rgba(255,255,255,0.95)] transition-colors cursor-pointer"
          style={{ background: 'none', border: 'none' }}
        >
          ✕
        </button>
      )}

      <h2
        className="[font-family:var(--font-display)] italic font-light text-[28px] md:text-[36px] leading-[1.15]"
        style={{ color: 'rgba(255,255,255,0.95)' }}
      >
        {copy.title}
      </h2>

      <p
        className="mt-4 [font-family:var(--font-jost)] text-[14px] md:text-[16px] leading-[1.5] font-light max-w-[480px] mx-auto"
        style={{ color: 'rgba(255,255,255,0.80)' }}
      >
        {copy.body}
      </p>

      <div className="mt-8 flex flex-row items-center justify-center gap-3 max-[349px]:flex-col max-[349px]:items-stretch max-[349px]:gap-2">
        <a
          href={copy.primaryHref}
          className="inline-flex items-center justify-center px-5 py-2.5 text-[11px] md:text-[12px] tracking-[0.22em] uppercase [font-family:var(--font-jost)] rounded-full transition-colors"
          style={{
            border: `1px solid ${A(0.70)}`,
            color: A(0.95),
            backgroundColor: A(0.08),
          }}
        >
          {copy.primaryLabel}
        </a>
        <a
          href={copy.secondaryHref}
          className="inline-flex items-center justify-center px-5 py-2.5 text-[11px] md:text-[12px] tracking-[0.22em] uppercase [font-family:var(--font-jost)] rounded-full transition-colors"
          style={{
            border: `1px solid ${A(0.35)}`,
            color: A(0.70),
          }}
        >
          {copy.secondaryLabel}
        </a>
      </div>
    </div>
  );
}
