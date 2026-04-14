"use client";

interface Props {
  count: number;
  maxEntries?: number;
}

export default function GratitudeJar({ count, maxEntries = 7 }: Props) {
  const fullHeight = 132;
  const capped = Math.min(count, maxEntries);
  const fillHeight = Math.round((capped / maxEntries) * fullHeight);
  const fillY = 184 - fillHeight;

  return (
    <svg
      viewBox="0 0 160 200"
      className="w-[160px] h-[200px]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        .jar-fill {
          transition: y 0.8s cubic-bezier(0.34, 1.1, 0.64, 1),
                      height 0.8s cubic-bezier(0.34, 1.1, 0.64, 1);
        }
      `}</style>

      <defs>
        <linearGradient id="jarFillGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(220,175,80,0.55)" />
          <stop offset="100%" stopColor="rgba(200,140,50,0.4)" />
        </linearGradient>
        <clipPath id="jarClip">
          <path d="M28,52 Q24,52 22,56 L18,72 Q16,76 16,80 L16,172 Q16,184 28,184 L132,184 Q144,184 144,172 L144,80 Q144,76 142,72 L138,56 Q136,52 132,52 Z" />
        </clipPath>
      </defs>

      {/* Jar body outline */}
      <path
        d="M28,52 Q24,52 22,56 L18,72 Q16,76 16,80 L16,172 Q16,184 28,184 L132,184 Q144,184 144,172 L144,80 Q144,76 142,72 L138,56 Q136,52 132,52 Z"
        fill="none"
        stroke="rgba(200,210,220,0.1)"
        strokeWidth="1"
      />

      {/* Honey fill — animates upward as entries are added */}
      <rect
        className="jar-fill"
        x="16"
        y={fillY}
        width="128"
        height={fillHeight}
        fill="url(#jarFillGradient)"
        clipPath="url(#jarClip)"
      />

      {/* Left-side shine */}
      <path
        d="M26,65 Q22,72 22,82 L22,165"
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Lid body */}
      <rect
        x="36"
        y="36"
        width="88"
        height="18"
        rx="4"
        fill="none"
        stroke="rgba(200,210,220,0.08)"
        strokeWidth="1"
      />
      {/* Lid top knob */}
      <rect
        x="42"
        y="28"
        width="76"
        height="10"
        rx="3"
        fill="none"
        stroke="rgba(200,210,220,0.06)"
        strokeWidth="1"
      />

      {/* Entry count */}
      {count > 0 && (
        <text
          x="80"
          y="115"
          textAnchor="middle"
          dominantBaseline="middle"
          className="[font-family:var(--font-display)] font-light"
          fill="rgba(220,190,100,0.9)"
          fontSize="42"
        >
          {count}
        </text>
      )}

      {/* "this week" label */}
      <text
        x="80"
        y="145"
        textAnchor="middle"
        dominantBaseline="middle"
        className="[font-family:var(--font-jost)]"
        fill="rgba(232,168,62,0.3)"
        fontSize="11"
        letterSpacing="3"
      >
        THIS WEEK
      </text>
    </svg>
  );
}
