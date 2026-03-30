"use client";

interface Props {
  eyebrow: string;
  question: string;
  options: string[];
  visible: boolean;
  locked: boolean;
  selectedOption?: string;
  onSelect: (option: string) => void;
}

export default function ReframeStep({
  eyebrow,
  question,
  options,
  visible,
  locked,
  selectedOption,
  onSelect,
}: Props) {
  return (
    <div
      className={`transition-all duration-500 ease-in-out mb-14 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <p className="[font-family:var(--font-jost)] text-[10px] tracking-[0.26em] uppercase text-[rgba(130,185,140,0.42)] mb-4">
        {eyebrow}
      </p>
      <p className="[font-family:var(--font-display)] font-light text-[22px] text-[rgba(200,220,205,0.85)] leading-snug mb-7">
        {question}
      </p>
      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const isSelected = selectedOption === option;
          return (
            <button
              key={option}
              onClick={() => !locked && onSelect(option)}
              disabled={locked}
              className={`text-left [font-family:var(--font-jost)] text-[13px] font-light px-5 py-3.5 rounded-[10px] border transition-all duration-300 ${
                locked
                  ? isSelected
                    ? "border-[rgba(130,185,140,0.4)] text-[rgba(160,215,175,0.85)] bg-[rgba(130,185,140,0.06)] cursor-default"
                    : "border-[rgba(130,185,140,0.1)] text-[rgba(160,215,175,0.25)] cursor-default"
                  : "border-[rgba(130,185,140,0.2)] text-[rgba(160,215,175,0.65)] hover:border-[rgba(130,185,140,0.5)] hover:text-[rgba(160,215,175,0.9)] hover:bg-[rgba(130,185,140,0.05)] cursor-pointer"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
