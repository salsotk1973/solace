"use client";

interface Props {
  thought: string;
  onChange: (value: string) => void;
  onBegin: () => void;
}

export default function ThoughtInput({ thought, onChange, onBegin }: Props) {
  const canBegin = thought.length > 8;

  return (
    <div>
      <label className="block [font-family:var(--font-jost)] text-[10px] tracking-[0.26em] uppercase text-[rgba(130,185,140,0.42)] mb-4">
        The thought
      </label>
      <textarea
        value={thought}
        onChange={(e) => onChange(e.target.value)}
        maxLength={200}
        placeholder="I always mess things up…"
        rows={3}
        className="w-full bg-transparent border border-[rgba(130,185,140,0.4)] rounded-[14px] px-6 py-5 [font-family:var(--font-display)] text-[20px] font-light italic text-[rgba(200,220,205,0.85)] placeholder:text-[rgba(130,185,140,0.22)] resize-none focus:outline-none focus:border-[rgba(130,185,140,0.65)] transition-colors duration-300 leading-relaxed"
      />
      <div
        className={`mt-6 flex justify-end transition-all duration-[400ms] ease-in-out ${
          canBegin
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-1 pointer-events-none"
        }`}
      >
        <button
          onClick={onBegin}
          disabled={!canBegin}
          className="[font-family:var(--font-jost)] text-[13px] font-light tracking-[0.06em] text-[rgba(160,215,175,0.85)] hover:text-[rgba(180,235,195,1)] transition-colors duration-300 cursor-pointer"
        >
          Look at it →
        </button>
      </div>
    </div>
  );
}
