import Link from 'next/link'

interface ToolUpgradePromptProps {
  hasOlderSessions: boolean
  toolColour: string // RGB string e.g. '60, 192, 212'
  toolName: string   // e.g. 'Focus Timer'
}

export default function ToolUpgradePrompt({
  hasOlderSessions,
  toolColour,
  toolName,
}: ToolUpgradePromptProps) {
  return (
    <div
      className="mt-5 rounded-[12px] px-4 py-4 text-center"
      style={{
        border: `1px solid rgba(${toolColour}, 0.12)`,
        background: `rgba(${toolColour}, 0.04)`,
      }}
    >
      <p
        className="[font-family:var(--font-jost)] text-[13px] font-light leading-relaxed"
        style={{ color: 'rgba(255,255,255,0.65)' }}
      >
        {hasOlderSessions
          ? `Your full ${toolName} history is still there — unlock it to see patterns and build consistency over time.`
          : `Keep your ${toolName} practice visible as it builds.`}
      </p>
      <Link
        href="/pricing"
        prefetch={false}
        className="mt-3 inline-flex [font-family:var(--font-jost)] text-[10px] tracking-[0.18em] uppercase transition-colors duration-300"
        style={{ color: `rgba(${toolColour}, 0.75)` }}
      >
        Unlock full history →
      </Link>
    </div>
  )
}
