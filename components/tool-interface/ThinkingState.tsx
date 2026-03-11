"use client";

type ThinkingStateProps = {
  toolSlug: string;
};

function getToolTheme(toolSlug: string) {
  if (toolSlug === "clarity") {
    return {
      border: "rgba(96, 165, 250, 0.95)",
      borderSoft: "rgba(147, 197, 253, 0.72)",
      fill: "rgba(219, 234, 254, 0.62)",
      fillStrong: "rgba(191, 219, 254, 0.66)",
      fillPulse: "rgba(186, 214, 252, 0.82)",
      glow: "rgba(96, 165, 250, 0.16)",
      glowPulse: "rgba(96, 165, 250, 0.24)",
    };
  }

  if (toolSlug === "overthinking-reset") {
    return {
      border: "rgba(74, 222, 128, 0.95)",
      borderSoft: "rgba(134, 239, 172, 0.72)",
      fill: "rgba(220, 252, 231, 0.62)",
      fillStrong: "rgba(187, 247, 208, 0.66)",
      fillPulse: "rgba(167, 243, 208, 0.82)",
      glow: "rgba(74, 222, 128, 0.16)",
      glowPulse: "rgba(74, 222, 128, 0.24)",
    };
  }

  return {
    border: "rgba(192, 132, 252, 0.95)",
    borderSoft: "rgba(216, 180, 254, 0.72)",
    fill: "rgba(243, 232, 255, 0.64)",
    fillStrong: "rgba(233, 213, 255, 0.68)",
    fillPulse: "rgba(221, 190, 255, 0.84)",
    glow: "rgba(192, 132, 252, 0.16)",
    glowPulse: "rgba(192, 132, 252, 0.24)",
  };
}

export default function ThinkingState({ toolSlug }: ThinkingStateProps) {
  const theme = getToolTheme(toolSlug);

  return (
    <>
      <style jsx>{`
        @keyframes solaceCardBreath {
          0% {
            transform: scale(1);
            box-shadow:
              0 14px 30px ${theme.glow},
              inset 0 1px 0 rgba(255, 255, 255, 0.55);
            background: linear-gradient(
              180deg,
              ${theme.fillStrong} 0%,
              ${theme.fill} 100%
            );
            border-color: ${theme.border};
          }
          50% {
            transform: scale(1.018);
            box-shadow:
              0 20px 42px ${theme.glowPulse},
              inset 0 1px 0 rgba(255, 255, 255, 0.62);
            background: linear-gradient(
              180deg,
              ${theme.fillPulse} 0%,
              ${theme.fillStrong} 100%
            );
            border-color: ${theme.borderSoft};
          }
          100% {
            transform: scale(1);
            box-shadow:
              0 14px 30px ${theme.glow},
              inset 0 1px 0 rgba(255, 255, 255, 0.55);
            background: linear-gradient(
              180deg,
              ${theme.fillStrong} 0%,
              ${theme.fill} 100%
            );
            border-color: ${theme.border};
          }
        }
      `}</style>

      <div
        style={{
          borderRadius: 28,
          border: `1.5px solid ${theme.border}`,
          padding: "24px 28px",
          animation: "solaceCardBreath 2.8s ease-in-out infinite",
          transformOrigin: "center center",
          willChange: "transform, box-shadow, background, border-color",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: "0.95rem",
              color: "rgb(120,120,120)",
              fontWeight: 500,
            }}
          >
            Solace
          </div>

          <div
            style={{
              minHeight: 84,
              display: "grid",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "1rem",
                lineHeight: 1.85,
                color: "rgb(55,65,81)",
              }}
            >
              Solace is reflecting…
            </div>
          </div>
        </div>
      </div>
    </>
  );
}