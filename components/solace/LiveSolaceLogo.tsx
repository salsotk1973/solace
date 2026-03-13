"use client";

import Link from "next/link";

export default function LiveSolaceLogo() {
  return (
    <Link
      href="/"
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "inline-flex",
        alignItems: "flex-start",
        gap: 16,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 68,
          height: 68,
          flex: "0 0 auto",
          marginTop: -4,
        }}
      >
        <div className="solace-mini-aura" />
        <div className="solace-mini-ripple-base" />
        <div className="solace-mini-ripple ripple1" />
        <div className="solace-mini-ripple ripple2" />
        <div className="solace-mini-ripple ripple3" />

        <div className="solace-mini-orb-wrap">
          <div className="solace-mini-orb-glow" />
          <div className="solace-mini-orb-frame">
            <img
              src="/hero/solace-orb.png"
              alt=""
              draggable={false}
              className="solace-mini-orb-image"
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          minWidth: 0,
        }}
      >
        <div
          style={{
            fontSize: 34,
            lineHeight: 0.95,
            letterSpacing: "0.16em",
            fontWeight: 700,
            color: "#4f5c84",
          }}
        >
          SOLACE
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 12,
            lineHeight: 1,
            letterSpacing: "0.28em",
            fontWeight: 600,
            color: "rgba(79,92,132,0.95)",
          }}
        >
          CALM DIGITAL CLARITY
        </div>
      </div>

      <style jsx>{`
        .solace-mini-aura {
          position: absolute;
          left: 50%;
          top: 52%;
          width: 110px;
          height: 110px;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          background: radial-gradient(
            circle,
            rgba(196, 179, 255, 0.18) 0%,
            rgba(196, 179, 255, 0.09) 34%,
            rgba(196, 179, 255, 0.03) 60%,
            rgba(196, 179, 255, 0) 78%
          );
          filter: blur(16px);
          animation: solaceMiniAura 10s linear infinite;
        }

        .solace-mini-orb-wrap {
          position: absolute;
          left: 50%;
          top: 40%;
          width: 46px;
          height: 46px;
          transform: translate(-50%, -50%);
          animation: solaceMiniBreath 10s linear infinite;
        }

        .solace-mini-orb-glow {
          position: absolute;
          inset: -8px;
          border-radius: 999px;
          background: radial-gradient(
            circle,
            rgba(224, 212, 255, 0.34) 0%,
            rgba(191, 167, 255, 0.14) 40%,
            rgba(191, 167, 255, 0) 78%
          );
          filter: blur(10px);
          animation: solaceMiniGlow 10s linear infinite;
        }

        .solace-mini-orb-frame {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 999px;
        }

        .solace-mini-orb-image {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 100%;
          height: 100%;
          object-fit: contain;
          transform: translate(-50%, -50%) scale(2.22);
          user-select: none;
          pointer-events: none;
        }

        .solace-mini-ripple-base {
          position: absolute;
          left: 50%;
          top: 67%;
          width: 62px;
          height: 12px;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0) 0%,
            rgba(235, 226, 255, 0) 36%,
            rgba(232, 223, 255, 0.12) 50%,
            rgba(213, 198, 255, 0.08) 60%,
            rgba(186, 166, 245, 0.03) 72%,
            rgba(186, 166, 245, 0) 84%
          );
          filter: blur(1.8px);
          opacity: 0.55;
        }

        .solace-mini-ripple {
          position: absolute;
          left: 50%;
          top: 67%;
          width: 56px;
          height: 11px;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          animation: solaceMiniRipple 10s linear infinite;
          opacity: 0;
        }

        .solace-mini-ripple::before,
        .solace-mini-ripple::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 999px;
        }

        .solace-mini-ripple::before {
          background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0) 0%,
            rgba(234, 226, 255, 0.18) 52%,
            rgba(195, 176, 245, 0.08) 72%,
            rgba(195, 176, 245, 0) 84%
          );
          filter: blur(1px);
          transform: scaleY(0.84);
        }

        .solace-mini-ripple::after {
          background: radial-gradient(
            ellipse at center,
            rgba(122, 90, 212, 0.14) 0%,
            rgba(122, 90, 212, 0.05) 34%,
            rgba(122, 90, 212, 0) 70%
          );
          filter: blur(3px);
          transform: scaleY(0.62) translateY(2px);
          opacity: 0.65;
        }

        .ripple1 {
          animation-delay: 0s;
        }

        .ripple2 {
          animation-delay: -3.33s;
        }

        .ripple3 {
          animation-delay: -6.66s;
        }

        @keyframes solaceMiniBreath {
          0% {
            transform: translate(-50%, -50%) scale(0.965);
          }
          10% {
            transform: translate(-50%, -50%) scale(1);
          }
          20% {
            transform: translate(-50%, -50%) scale(1.04);
          }
          30% {
            transform: translate(-50%, -50%) scale(1.085);
          }
          40% {
            transform: translate(-50%, -50%) scale(1.12);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.135);
          }
          60% {
            transform: translate(-50%, -50%) scale(1.12);
          }
          70% {
            transform: translate(-50%, -50%) scale(1.085);
          }
          80% {
            transform: translate(-50%, -50%) scale(1.04);
          }
          90% {
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            transform: translate(-50%, -50%) scale(0.965);
          }
        }

        @keyframes solaceMiniGlow {
          0% {
            transform: scale(0.95);
            opacity: 0.82;
          }
          50% {
            transform: scale(1.12);
            opacity: 1;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.82;
          }
        }

        @keyframes solaceMiniAura {
          0% {
            transform: translate(-50%, -50%) scale(0.98);
            opacity: 0.92;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.08);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.98);
            opacity: 0.92;
          }
        }

        @keyframes solaceMiniRipple {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.82);
          }
          8% {
            opacity: 0.9;
          }
          35% {
            opacity: 0.3;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.9);
          }
        }
      `}</style>
    </Link>
  );
}