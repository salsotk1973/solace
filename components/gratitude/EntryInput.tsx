"use client";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onAdd: () => void;
}

export default function EntryInput({ value, onChange, onAdd }: Props) {
  const canAdd = value.trim().length > 4;

  return (
    <div className="text-center">
      <p className="[font-family:var(--font-display)] font-light text-[24px] text-[rgba(200,215,225,0.65)] mb-7 leading-snug max-w-[480px] mx-auto">
        What&apos;s one thing — however small — that you noticed today?
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={160}
        placeholder="The light through the window this morning…"
        rows={2}
        className="w-full bg-transparent border border-[rgba(200,210,220,0.08)] rounded-[14px] px-6 py-4 [font-family:var(--font-display)] text-[19px] font-light text-center italic text-[rgba(220,200,160,0.8)] placeholder:text-[rgba(200,180,130,0.2)] resize-none focus:outline-none focus:border-[rgba(220,175,80,0.22)] transition-colors duration-300 leading-relaxed"
      />
      <div
        className={`mt-5 transition-all duration-300 ease-in-out ${
          canAdd
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-1 pointer-events-none"
        }`}
      >
        <button
          onClick={onAdd}
          disabled={!canAdd}
          className="[font-family:var(--font-jost)] text-[13px] font-light text-[rgba(230,195,110,0.85)] border border-[rgba(220,175,80,0.3)] rounded-[999px] px-6 py-2.5 hover:border-[rgba(220,175,80,0.55)] hover:text-[rgba(230,195,110,1)] transition-all duration-300 cursor-pointer"
        >
          Add to jar →
        </button>
      </div>
    </div>
  );
}
