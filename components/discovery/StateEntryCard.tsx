import Link from "next/link";

type Props = {
  href: string;
  stateLabel: string;
  supportingText: string;
  colorToken?: "clarity" | "overthinking" | "decision" | "principles";
};

function getCardClasses(colorToken: Props["colorToken"]) {
  switch (colorToken) {
    case "clarity":
      return {
        surface: "bg-[rgba(232,241,255,0.88)]",
        border: "border-[rgba(154,188,235,0.72)]",
        glow: "hover:shadow-[0_14px_34px_rgba(103,139,201,0.16)]",
      };

    case "overthinking":
      return {
        surface: "bg-[rgba(236,245,239,0.9)]",
        border: "border-[rgba(166,199,177,0.72)]",
        glow: "hover:shadow-[0_14px_34px_rgba(106,145,120,0.15)]",
      };

    case "decision":
      return {
        surface: "bg-[rgba(241,237,252,0.92)]",
        border: "border-[rgba(186,172,230,0.74)]",
        glow: "hover:shadow-[0_14px_34px_rgba(128,110,188,0.16)]",
      };

    case "principles":
      return {
        surface: "bg-[rgba(239,241,246,0.98)]",
        border: "border-[rgba(214,214,214,0.92)]",
        glow: "hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)]",
      };

    default:
      return {
        surface: "bg-[rgba(239,241,246,0.98)]",
        border: "border-[rgba(214,214,214,0.92)]",
        glow: "hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)]",
      };
  }
}

export default function StateEntryCard({
  href,
  stateLabel,
  supportingText,
  colorToken,
}: Props) {
  const styles = getCardClasses(colorToken);

  return (
    <Link
      href={href}
      className={`
        block
        min-h-[164px]
        rounded-[28px]
        border
        ${styles.border}
        ${styles.surface}
        p-7
        shadow-[0_8px_24px_rgba(0,0,0,0.035)]
        backdrop-blur-[6px]
        transition
        duration-200
        ease-out
        hover:-translate-y-[2px]
        ${styles.glow}
      `}
    >
      <div className="grid gap-3">
        <h3 className="text-[1.18rem] font-semibold leading-[1.15] tracking-[-0.03em] text-neutral-900">
          {stateLabel}
        </h3>

        <p className="max-w-[24rem] text-[1rem] leading-8 text-neutral-700">
          {supportingText}
        </p>
      </div>
    </Link>
  );
}