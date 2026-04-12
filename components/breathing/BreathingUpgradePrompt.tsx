import Link from "next/link";

type BreathingUpgradePromptProps = {
  hasOlderSessions: boolean;
};

export default function BreathingUpgradePrompt({
  hasOlderSessions,
}: BreathingUpgradePromptProps) {
  return (
    <div className="mt-5 rounded-[12px] border border-[rgba(80,200,218,0.1)] bg-[rgba(80,200,218,0.035)] px-4 py-4 text-center">
      <p className="[font-family:var(--font-jost)] text-[13px] font-light text-[rgba(170,220,232,0.66)] leading-relaxed">
        {hasOlderSessions
          ? "Full history keeps your breathing record connected, so patterns and consistency are easier to notice."
          : "Keep more of your breathing practice visible as your rhythm builds."}
      </p>
      <Link
        href="/pricing"
        prefetch={false}
        className="mt-3 inline-flex [font-family:var(--font-jost)] text-[10px] tracking-[0.18em] uppercase text-[rgba(120,215,232,0.68)] hover:text-[rgba(165,235,248,0.9)] transition-colors duration-300"
      >
        Unlock full history
      </Link>
    </div>
  );
}
