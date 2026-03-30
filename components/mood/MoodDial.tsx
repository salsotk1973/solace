"use client";

const RADIUS = 75;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 471.24
const TOTAL_ARC = (270 / 360) * CIRCUMFERENCE; // ≈ 353.43 (270° arc)
const GAP = CIRCUMFERENCE - TOTAL_ARC; // ≈ 117.81

interface Props {
  value: number; // 1–10
  word?: string;
}

export default function MoodDial({ value, word }: Props) {
  // Fill proportional to mood value
  const fillLength = ((value - 1) / 9) * TOTAL_ARC;

  return (
    <svg
      viewBox="0 0 200 200"
      className="w-[200px] h-[200px]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        .mood-arc-fill {
          transition: stroke-dasharray 0.55s cubic-bezier(0.34, 1.1, 0.64, 1);
        }
      `}</style>

      <defs>
        <linearGradient id="moodArcGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(175,145,225,0.8)" />
          <stop offset="100%" stopColor="rgba(140,100,195,0.55)" />
        </linearGradient>
      </defs>

      {/* Background track — full 270° arc */}
      <circle
        cx="100"
        cy="100"
        r={RADIUS}
        fill="none"
        stroke="rgba(160,130,210,0.1)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={`${TOTAL_ARC} ${GAP}`}
        transform="rotate(135 100 100)"
      />

      {/* Filled arc — rises with mood value */}
      <circle
        className="mood-arc-fill"
        cx="100"
        cy="100"
        r={RADIUS}
        fill="none"
        stroke="url(#moodArcGradient)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={`${fillLength} ${CIRCUMFERENCE - fillLength}`}
        transform="rotate(135 100 100)"
      />

      {/* Value number */}
      <text
        x="100"
        y="98"
        textAnchor="middle"
        dominantBaseline="middle"
        className="[font-family:var(--font-display)] font-light"
        fill="rgba(200,175,235,0.92)"
        fontSize="64"
      >
        {value}
      </text>

      {/* Word or default label */}
      <text
        x="100"
        y="140"
        textAnchor="middle"
        dominantBaseline="middle"
        className="[font-family:var(--font-jost)]"
        fill="rgba(160,130,210,0.4)"
        fontSize="10"
        letterSpacing="2.5"
      >
        {word ? word.toUpperCase().slice(0, 14) : "OUT OF 10"}
      </text>
    </svg>
  );
}
