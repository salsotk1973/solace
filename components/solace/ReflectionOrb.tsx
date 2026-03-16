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
          width: 330px;
          height: 330px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: shellBreath 7.2s ease-in-out infinite;
          transform-origin: center center;
          will-change: transform;
        }

        .orb-shell.active {
          animation-duration: 5.2s;
        }

        .orb-shell.settled {
          animation-duration: 7.8s;
        }

        .orb-aura,
        .orb-sphere {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
        }

        .aura-far {
          inset: -66px;
          background: radial-gradient(
            circle,
            rgba(191, 255, 222, 0.16) 0%,
            rgba(191, 255, 222, 0.08) 24%,
            rgba(191, 255, 222, 0.025) 48%,
            rgba(191, 255, 222, 0) 74%
          );
          filter: blur(22px);
          animation: auraFar 7.2s ease-in-out infinite;
        }

        .aura-mid {
          inset: -34px;
          background: radial-gradient(
            circle,
            rgba(205, 255, 231, 0.16) 0%,
            rgba(205, 255, 231, 0.08) 30%,
            rgba(205, 255, 231, 0.02) 54%,
            rgba(205, 255, 231, 0) 76%
          );
          filter: blur(12px);
          animation: auraMid 7.2s ease-in-out infinite;
        }

        .aura-near {
          inset: -10px;
          background: radial-gradient(
            circle,
            rgba(226, 255, 241, 0.11) 0%,
            rgba(226, 255, 241, 0.05) 34%,
            rgba(226, 255, 241, 0) 68%
          );
          filter: blur(6px);
          animation: auraNear 7.2s ease-in-out infinite;
        }

        .orb-sphere {
          inset: 52px;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 34% 24%,
              rgba(255, 255, 255, 0.88) 0%,
              rgba(245, 252, 248, 0.76) 18%,
              rgba(223, 248, 232, 0.52) 40%,
              rgba(180, 233, 198, 0.28) 68%,
              rgba(112, 187, 142, 0.12) 100%
            );
          box-shadow:
            inset -14px -20px 32px rgba(38, 84, 59, 0.14),
            inset 10px 10px 18px rgba(255, 255, 255, 0.14),
            0 16px 40px rgba(120, 255, 194, 0.08);
          animation: sphereBreath 7.2s ease-in-out infinite;
          will-change: transform;
        }

        .orb-shell.active .orb-shell,
        .orb-shell.active .orb-aura,
        .orb-shell.active .orb-sphere {
          animation-duration: 5.2s;
        }

        .orb-shell.settled .orb-shell,
        .orb-shell.settled .orb-aura,
        .orb-shell.settled .orb-sphere {
          animation-duration: 7.8s;
        }

        .orb-rim {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.08),
            inset 0 0 26px rgba(222, 255, 240, 0.08);
          opacity: 0.95;
        }

        .orb-inner-glow {
          position: absolute;
          inset: 18%;
          border-radius: 9999px;
          background: radial-gradient(
            circle,
            rgba(220, 255, 237, 0.16) 0%,
            rgba(220, 255, 237, 0.06) 42%,
            rgba(220, 255, 237, 0) 76%
          );
          filter: blur(14px);
          animation: innerGlow 7.2s ease-in-out infinite;
        }

        .orb-highlight {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
        }

        .highlight-main {
          width: 30%;
          height: 18%;
          left: 22%;
          top: 14%;
          background: radial-gradient(
            ellipse,
            rgba(255, 255, 255, 0.48) 0%,
            rgba(255, 255, 255, 0.14) 52%,
            rgba(255, 255, 255, 0) 100%
          );
          filter: blur(4px);
          transform: rotate(-20deg);
          animation: highlightPulse 8.6s ease-in-out infinite;
        }

        .highlight-soft {
          width: 20%;
          height: 12%;
          right: 18%;
          bottom: 18%;
          background: radial-gradient(
            ellipse,
            rgba(172, 255, 207, 0.18) 0%,
            rgba(172, 255, 207, 0.06) 50%,
            rgba(172, 255, 207, 0) 100%
          );
          filter: blur(8px);
          animation: softPulse 7.8s ease-in-out infinite;
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
            rgba(255, 255, 255, 0.18) 0%,
            rgba(255, 255, 255, 0.06) 22%,
            rgba(255, 255, 255, 0) 46%
          );
          filter: blur(12px);
          animation: mistDriftOne 11s ease-in-out infinite;
        }

        .mist-2 {
          inset: 6% 10% 10% 10%;
          background: radial-gradient(
            ellipse at 68% 70%,
            rgba(176, 255, 212, 0.14) 0%,
            rgba(176, 255, 212, 0.05) 20%,
            rgba(176, 255, 212, 0) 44%
          );
          filter: blur(14px);
          animation: mistDriftTwo 13s ease-in-out infinite;
        }

        .mist-3 {
          inset: 20% 18% 18% 18%;
          background: radial-gradient(
            circle,
            rgba(222, 255, 239, 0.08) 0%,
            rgba(222, 255, 239, 0.03) 36%,
            rgba(222, 255, 239, 0) 72%
          );
          filter: blur(18px);
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
          background: rgba(249, 255, 252, 0.9);
          box-shadow: 0 0 12px rgba(228, 255, 241, 0.22);
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
            transform: scale(0.955);
          }
          50% {
            transform: scale(1.06);
          }
        }

        @keyframes sphereBreath {
          0%,
          100% {
            transform: scale(0.972);
          }
          50% {
            transform: scale(1.055);
          }
        }

        @keyframes auraFar {
          0%,
          100% {
            transform: scale(0.95);
            opacity: 0.42;
          }
          50% {
            transform: scale(1.11);
            opacity: 0.7;
          }
        }

        @keyframes auraMid {
          0%,
          100% {
            transform: scale(0.98);
            opacity: 0.54;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.82;
          }
        }

        @keyframes auraNear {
          0%,
          100% {
            transform: scale(0.99);
            opacity: 0.58;
          }
          50% {
            transform: scale(1.045);
            opacity: 0.88;
          }
        }

        @keyframes innerGlow {
          0%,
          100% {
            transform: scale(0.96);
            opacity: 0.64;
          }
          50% {
            transform: scale(1.06);
            opacity: 0.9;
          }
        }

        @keyframes highlightPulse {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes softPulse {
          0%,
          100% {
            opacity: 0.56;
            transform: scale(1);
          }
          50% {
            opacity: 0.88;
            transform: scale(1.14);
          }
        }

        @keyframes mistDriftOne {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.7;
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
            opacity: 0.5;
          }
          50% {
            transform: translate3d(-8px, 6px, 0);
            opacity: 0.82;
          }
        }

        @keyframes mistPulse {
          0%,
          100% {
            transform: scale(0.98);
            opacity: 0.55;
          }
          50% {
            transform: scale(1.06);
            opacity: 0.84;
          }
        }

        @keyframes speckFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.72;
          }
          50% {
            transform: translate3d(0, -4px, 0);
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          .orb-shell {
            width: 282px;
            height: 282px;
          }

          .orb-sphere {
            inset: 44px;
          }

          .aura-far {
            inset: -48px;
          }

          .aura-mid {
            inset: -24px;
          }
        }
      `}</style>
    </div>
  );
}