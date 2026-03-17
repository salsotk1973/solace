"use client";

type OrbPhase = "idle" | "active" | "settled";

type ReflectionOrbProps = {
  phase?: OrbPhase;
};

export default function ReflectionOrb({
  phase = "idle",
}: ReflectionOrbProps) {
  return (
    <div className={`orb-shell ${phase}`}>
      <div className="orb-aura aura-far" />
      <div className="orb-aura aura-mid" />
      <div className="orb-aura aura-near" />

      <div className="orb-sphere">
        <div className="orb-rim" />
        <div className="orb-inner-glow" />
        <div className="orb-highlight highlight-main" />
        <div className="orb-highlight highlight-soft" />
        <div className="orb-mist mist-1" />
        <div className="orb-mist mist-2" />
        <div className="orb-mist mist-3" />

        <div className="orb-specks">
          <span className="speck s1" />
          <span className="speck s2" />
          <span className="speck s3" />
          <span className="speck s4" />
          <span className="speck s5" />
          <span className="speck s6" />
          <span className="speck s7" />
        </div>
      </div>

      <style jsx>{`
        .orb-shell {
          position: relative;
          width: 398px;
          height: 398px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: shellBreath 6.4s ease-in-out infinite;
          transform-origin: center center;
          will-change: transform, filter;
        }

        .orb-shell.active {
          animation-duration: 3.8s;
          filter: brightness(1.1) saturate(1.04);
        }

        .orb-shell.settled {
          animation-duration: 6.9s;
          filter: brightness(1.04);
        }

        .orb-aura,
        .orb-sphere {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
        }

        .aura-far {
          inset: -96px;
          background: radial-gradient(
            circle,
            rgba(196, 255, 226, 0.24) 0%,
            rgba(196, 255, 226, 0.12) 22%,
            rgba(196, 255, 226, 0.05) 42%,
            rgba(196, 255, 226, 0) 72%
          );
          filter: blur(32px);
          animation: auraFar 6.4s ease-in-out infinite;
        }

        .aura-mid {
          inset: -52px;
          background: radial-gradient(
            circle,
            rgba(208, 255, 232, 0.24) 0%,
            rgba(208, 255, 232, 0.12) 28%,
            rgba(208, 255, 232, 0.04) 52%,
            rgba(208, 255, 232, 0) 76%
          );
          filter: blur(18px);
          animation: auraMid 6.4s ease-in-out infinite;
        }

        .aura-near {
          inset: -18px;
          background: radial-gradient(
            circle,
            rgba(232, 255, 244, 0.16) 0%,
            rgba(232, 255, 244, 0.08) 34%,
            rgba(232, 255, 244, 0) 68%
          );
          filter: blur(9px);
          animation: auraNear 6.4s ease-in-out infinite;
        }

        .orb-sphere {
          inset: 56px;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 34% 24%,
              rgba(255, 255, 255, 0.98) 0%,
              rgba(247, 253, 250, 0.9) 16%,
              rgba(231, 251, 240, 0.7) 36%,
              rgba(192, 241, 213, 0.42) 62%,
              rgba(129, 203, 161, 0.2) 100%
            );
          box-shadow:
            inset -16px -24px 38px rgba(33, 78, 55, 0.12),
            inset 12px 12px 22px rgba(255, 255, 255, 0.18),
            0 18px 48px rgba(137, 255, 202, 0.12),
            0 0 42px rgba(169, 255, 218, 0.09);
          animation: sphereBreath 6.4s ease-in-out infinite;
          will-change: transform, box-shadow, filter;
        }

        .orb-shell.active .orb-aura,
        .orb-shell.active .orb-sphere {
          animation-duration: 3.8s;
        }

        .orb-shell.settled .orb-aura,
        .orb-shell.settled .orb-sphere {
          animation-duration: 6.9s;
        }

        .orb-shell.active .aura-far {
          opacity: 1;
          filter: blur(36px);
        }

        .orb-shell.active .aura-mid {
          opacity: 1;
          filter: blur(22px);
        }

        .orb-shell.active .aura-near {
          opacity: 1;
          filter: blur(11px);
        }

        .orb-shell.active .orb-sphere {
          box-shadow:
            inset -16px -24px 38px rgba(33, 78, 55, 0.1),
            inset 12px 12px 22px rgba(255, 255, 255, 0.2),
            0 24px 64px rgba(137, 255, 202, 0.2),
            0 0 68px rgba(187, 255, 227, 0.18),
            0 0 120px rgba(145, 255, 208, 0.1);
          filter: brightness(1.1);
        }

        .orb-shell.settled .orb-sphere {
          box-shadow:
            inset -16px -24px 38px rgba(33, 78, 55, 0.12),
            inset 12px 12px 22px rgba(255, 255, 255, 0.18),
            0 20px 52px rgba(137, 255, 202, 0.14),
            0 0 48px rgba(169, 255, 218, 0.11);
        }

        .orb-rim {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 0 32px rgba(226, 255, 242, 0.1);
          opacity: 0.96;
        }

        .orb-inner-glow {
          position: absolute;
          inset: 16%;
          border-radius: 9999px;
          background: radial-gradient(
            circle,
            rgba(226, 255, 241, 0.24) 0%,
            rgba(226, 255, 241, 0.1) 40%,
            rgba(226, 255, 241, 0) 76%
          );
          filter: blur(18px);
          animation: innerGlow 6.4s ease-in-out infinite;
        }

        .orb-highlight {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
        }

        .highlight-main {
          width: 31%;
          height: 18%;
          left: 21%;
          top: 13%;
          background: radial-gradient(
            ellipse,
            rgba(255, 255, 255, 0.56) 0%,
            rgba(255, 255, 255, 0.18) 54%,
            rgba(255, 255, 255, 0) 100%
          );
          filter: blur(5px);
          transform: rotate(-20deg);
          animation: highlightPulse 7.8s ease-in-out infinite;
        }

        .highlight-soft {
          width: 21%;
          height: 12%;
          right: 17%;
          bottom: 18%;
          background: radial-gradient(
            ellipse,
            rgba(182, 255, 214, 0.24) 0%,
            rgba(182, 255, 214, 0.08) 50%,
            rgba(182, 255, 214, 0) 100%
          );
          filter: blur(9px);
          animation: softPulse 7.2s ease-in-out infinite;
        }

        .orb-mist {
          position: absolute;
          border-radius: 9999px;
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .mist-1 {
          inset: -8% -10% -2% -4%;
          background: radial-gradient(
            ellipse at 32% 34%,
            rgba(255, 255, 255, 0.22) 0%,
            rgba(255, 255, 255, 0.08) 22%,
            rgba(255, 255, 255, 0) 46%
          );
          filter: blur(14px);
          animation: mistDriftOne 11s ease-in-out infinite;
        }

        .mist-2 {
          inset: 6% 10% 10% 10%;
          background: radial-gradient(
            ellipse at 68% 70%,
            rgba(184, 255, 217, 0.18) 0%,
            rgba(184, 255, 217, 0.06) 20%,
            rgba(184, 255, 217, 0) 44%
          );
          filter: blur(16px);
          animation: mistDriftTwo 13s ease-in-out infinite;
        }

        .mist-3 {
          inset: 20% 18% 18% 18%;
          background: radial-gradient(
            circle,
            rgba(228, 255, 242, 0.1) 0%,
            rgba(228, 255, 242, 0.04) 36%,
            rgba(228, 255, 242, 0) 72%
          );
          filter: blur(20px);
          animation: mistPulse 9.8s ease-in-out infinite;
        }

        .orb-specks {
          position: absolute;
          inset: 0;
        }

        .speck {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: rgba(249, 255, 252, 0.95);
          box-shadow: 0 0 14px rgba(228, 255, 241, 0.3);
          animation: speckFloat 6.8s ease-in-out infinite;
        }

        .s1 {
          width: 5px;
          height: 5px;
          left: 33%;
          top: 36%;
          animation-delay: -0.2s;
        }

        .s2 {
          width: 4px;
          height: 4px;
          left: 57%;
          top: 34%;
          animation-delay: -0.9s;
        }

        .s3 {
          width: 6px;
          height: 6px;
          left: 66%;
          top: 57%;
          animation-delay: -2s;
        }

        .s4 {
          width: 3px;
          height: 3px;
          left: 45%;
          top: 64%;
          animation-delay: -3.1s;
        }

        .s5 {
          width: 4px;
          height: 4px;
          left: 29%;
          top: 58%;
          animation-delay: -4s;
        }

        .s6 {
          width: 3px;
          height: 3px;
          left: 56%;
          top: 48%;
          animation-delay: -5s;
        }

        .s7 {
          width: 2px;
          height: 2px;
          left: 41%;
          top: 44%;
          animation-delay: -2.6s;
        }

        @keyframes shellBreath {
          0%,
          100% {
            transform: scale(0.95);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes sphereBreath {
          0%,
          100% {
            transform: scale(0.965);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.09);
            filter: brightness(1.06);
          }
        }

        @keyframes auraFar {
          0%,
          100% {
            transform: scale(0.9);
            opacity: 0.46;
          }
          50% {
            transform: scale(1.28);
            opacity: 1;
          }
        }

        @keyframes auraMid {
          0%,
          100% {
            transform: scale(0.95);
            opacity: 0.58;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @keyframes auraNear {
          0%,
          100% {
            transform: scale(0.98);
            opacity: 0.64;
          }
          50% {
            transform: scale(1.12);
            opacity: 0.98;
          }
        }

        @keyframes innerGlow {
          0%,
          100% {
            transform: scale(0.94);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.12);
            opacity: 1;
          }
        }

        @keyframes highlightPulse {
          0%,
          100% {
            opacity: 0.82;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes softPulse {
          0%,
          100% {
            opacity: 0.58;
            transform: scale(1);
          }
          50% {
            opacity: 0.96;
            transform: scale(1.18);
          }
        }

        @keyframes mistDriftOne {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.74;
          }
          50% {
            transform: translate3d(5px, -7px, 0);
            opacity: 1;
          }
        }

        @keyframes mistDriftTwo {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.54;
          }
          50% {
            transform: translate3d(-8px, 6px, 0);
            opacity: 0.88;
          }
        }

        @keyframes mistPulse {
          0%,
          100% {
            transform: scale(0.98);
            opacity: 0.58;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.9;
          }
        }

        @keyframes speckFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.76;
          }
          50% {
            transform: translate3d(0, -5px, 0);
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          .orb-shell {
            width: 332px;
            height: 332px;
          }

          .orb-sphere {
            inset: 46px;
          }

          .aura-far {
            inset: -70px;
          }

          .aura-mid {
            inset: -36px;
          }

          .aura-near {
            inset: -14px;
          }
        }
      `}</style>
    </div>
  );
}