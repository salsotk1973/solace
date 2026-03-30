"use client";

interface Props {
  finalChoice: string;
  visible: boolean;
  onReset: () => void;
}

export default function ReframeCard({ finalChoice, visible, onReset }: Props) {
  return (
    <div
      className={`transition-all duration-[600ms] ease-in-out rounded-[18px] border border-[rgba(130,185,140,0.15)] bg-[rgba(110,175,125,0.04)] px-8 py-10 mb-8 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <p className="[font-family:var(--font-jost)] text-[10px] tracking-[0.26em] uppercase text-[rgba(130,185,140,0.42)] mb-6">
        Your reframe
      </p>
      <p className="[font-family:var(--font-display)] font-light text-[24px] italic text-[rgba(200,220,205,0.85)] leading-relaxed mb-6">
        {finalChoice}
      </p>
      <p className="[font-family:var(--font-jost)] text-[13px] font-light text-[rgba(130,185,140,0.5)] leading-relaxed mb-10">
        This doesn&apos;t erase the original thought. It just gives it less room.
      </p>
      <button
        onClick={onReset}
        className="[font-family:var(--font-jost)] text-[13px] font-light text-[rgba(160,215,175,0.5)] hover:text-[rgba(160,215,175,0.85)] transition-colors duration-300 cursor-pointer"
      >
        Reframe another thought →
      </button>
    </div>
  );
}
