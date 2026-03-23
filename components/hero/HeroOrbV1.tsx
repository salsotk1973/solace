"use client";

import { useEffect, useMemo, useState } from "react";

export default function HeroOrbV1() {
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updatePreference);
      return () => mediaQuery.removeEventListener("change", updatePreference);
    }

    mediaQuery.addListener(updatePreference);
    return () => mediaQuery.removeListener(updatePreference);
  }, []);

  const rootClassName = useMemo(() => {
    return [
      "hero-orb-v1",
      isHovered ? "hero-orb-v1--hovered" : "",
      prefersReducedMotion ? "hero-orb-v1--reduced-motion" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }, [isHovered, prefersReducedMotion]);

  return (
    <div
      className={rootClassName}
      aria-hidden="true"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="hero-orb-v1__fabric" />
      <div className="hero-orb-v1__aura hero-orb-v1__aura--outer" />
      <div className="hero-orb-v1__aura hero-orb-v1__aura--core" />
      <div className="hero-orb-v1__ground-glow" />
      <div className="hero-orb-v1__ground-core" />

      <div className="hero-orb-v1__stage">
        <div className="hero-orb-v1__orb-wrap">
          <div className="hero-orb-v1__orb-backglow" />

          <div className="hero-orb-v1__orb-image-frame">
            <img
              src="/hero/solace-orb.png"
              alt=""
              className="hero-orb-v1__orb-image"
              draggable={false}
            />
            <div className="hero-orb-v1__orb-darken" />
            <div className="hero-orb-v1__orb-core-lift" />
            <div className="hero-orb-v1__orb-star-lift" />
            <div className="hero-orb-v1__orb-edge-falloff" />
          </div>

          <div className="hero-orb-v1__front-veil" />
          <div className="hero-orb-v1__lower-veil" />
          <div className="hero-orb-v1__specular-bloom" />
        </div>
      </div>

      <style jsx>{`
        .hero-orb-v1 {
          position: relative;
          width: min(100%, 720px);
          height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
          isolation: isolate;
          pointer-events: auto;
        }

        .hero-orb-v1__fabric {
          position: absolute;
          left: 50%;
          top: 48.5%;
          width: 1160px;
          height: 840px;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          z-index: 0;
          pointer-events: none;
          background: radial-gradient(
            ellipse at center,
            rgba(60, 45, 115, 0.38) 0%,
            rgba(60, 45, 115, 0.24) 24%,
            rgba(60, 45, 115, 0.12) 44%,
            rgba(60, 45, 115, 0.04) 62%,
            rgba(60, 45, 115, 0) 82%
          );
          filter: blur(72px);
          mix-blend-mode: screen;
          opacity: 0.74;
          animation: heroOrbFabricBreath 10s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .hero-orb-v1__aura {
          position: absolute;
          left: 50%;
          border-radius: 999px;
          transform: translate(-50%, -50%);
          pointer-events: none;
          will-change: transform, opacity;
        }

        .hero-orb-v1__aura--outer {
          top: 47%;
          width: 710px;
          height: 710px;
          background: radial-gradient(
            circle,
            rgba(194, 178, 255, 0.13) 0%,
            rgba(194, 178, 255, 0.075) 30%,
            rgba(194, 178, 255, 0.03) 52%,
            rgba(194, 178, 255, 0.008) 64%,
            rgba(194, 178, 255, 0) 78%
          );
          filter: blur(70px);
          opacity: 0.7;
          z-index: 1;
          animation: heroOrbAuraOuter 10s ease-in-out infinite;
        }

        .hero-orb-v1__aura--core {
          top: 49%;
          width: 520px;
          height: 520px;
          background: radial-gradient(
            circle,
            rgba(205, 186, 255, 0.16) 0%,
            rgba(186, 162, 255, 0.1) 34%,
            rgba(186, 162, 255, 0.04) 56%,
            rgba(186, 162, 255, 0) 74%
          );
          filter: blur(44px);
          opacity: 0.8;
          z-index: 2;
          animation: heroOrbAuraCore 10s ease-in-out infinite;
        }

        .hero-orb-v1__ground-glow {
          position: absolute;
          left: 50%;
          top: 75.8%;
          width: 360px;
          height: 82px;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          background: radial-gradient(
            ellipse at center,
            rgba(118, 84, 220, 0.14) 0%,
            rgba(118, 84, 220, 0.06) 44%,
            rgba(118, 84, 220, 0.015) 70%,
            rgba(118, 84, 220, 0) 84%
          );
          filter: blur(20px);
          z-index: 2;
          opacity: 0.8;
          animation: heroOrbGroundPulse 10s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .hero-orb-v1__ground-core {
          position: absolute;
          left: 50%;
          top: 76.1%;
          width: 186px;
          height: 24px;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          background: radial-gradient(
            ellipse at center,
            rgba(102, 72, 196, 0.24) 0%,
            rgba(102, 72, 196, 0.09) 50%,
            rgba(102, 72, 196, 0) 84%
          );
          filter: blur(9px);
          zIndex: 3;
          opacity: 0.84;
          animation: heroOrbGroundCore 10s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .hero-orb-v1__stage {
          position: relative;
          width: 760px;
          height: 560px;
          z-index: 4;
          pointer-events: none;
        }

        .hero-orb-v1__orb-wrap {
          position: absolute;
          left: 50%;
          top: 47.3%;
          width: 332px;
          height: 332px;
          transform: translate(-50%, -50%);
          animation: heroOrbBreath 10s ease-in-out infinite;
          will-change: transform;
        }

        .hero-orb-v1__orb-backglow {
          position: absolute;
          inset: -38px;
          border-radius: 999px;
          background: radial-gradient(
            circle,
            rgba(224, 212, 255, 0.2) 0%,
            rgba(191, 167, 255, 0.1) 38%,
            rgba(191, 167, 255, 0.035) 60%,
            rgba(191, 167, 255, 0) 78%
          );
          filter: blur(28px);
          opacity: 0.82;
          animation: heroOrbGlow 10s ease-in-out infinite;
        }

        .hero-orb-v1__orb-image-frame {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 999px;
          background: radial-gradient(
            circle at 50% 45%,
            rgba(18, 18, 42, 0.18) 0%,
            rgba(12, 12, 30, 0.34) 56%,
            rgba(6, 8, 18, 0.56) 100%
          );
        }

        .hero-orb-v1__orb-image {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 100%;
          height: 100%;
          object-fit: contain;
          transform: translate(-50%, -50%) scale(2.18);
          opacity: 0.96;
          filter: saturate(1.03) brightness(0.78) contrast(1.1);
        }

        .hero-orb-v1__orb-darken {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background:
            radial-gradient(
              circle at 50% 58%,
              rgba(18, 18, 42, 0) 0%,
              rgba(12, 12, 28, 0.08) 36%,
              rgba(8, 10, 22, 0.22) 66%,
              rgba(5, 6, 14, 0.34) 100%
            ),
            radial-gradient(
              circle at 50% 78%,
              rgba(6, 7, 18, 0) 0%,
              rgba(6, 7, 18, 0.14) 42%,
              rgba(6, 7, 18, 0.34) 82%,
              rgba(6, 7, 18, 0.48) 100%
            );
          mix-blend-mode: multiply;
          opacity: 0.96;
        }

        .hero-orb-v1__orb-core-lift {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: radial-gradient(
            circle at 50% 36%,
            rgba(255, 244, 255, 0.12) 0%,
            rgba(244, 220, 255, 0.08) 14%,
            rgba(212, 190, 255, 0.04) 28%,
            rgba(255, 255, 255, 0) 44%
          );
          mix-blend-mode: screen;
          opacity: 0.88;
          animation: heroOrbCoreLift 10s ease-in-out infinite;
        }

        .hero-orb-v1__orb-star-lift {
          position: absolute;
          inset: 8%;
          border-radius: 999px;
          background:
            radial-gradient(circle at 42% 36%, rgba(255, 236, 250, 0.18) 0%, rgba(255, 236, 250, 0) 7%),
            radial-gradient(circle at 56% 44%, rgba(255, 228, 246, 0.16) 0%, rgba(255, 228, 246, 0) 6%),
            radial-gradient(circle at 63% 31%, rgba(255, 245, 255, 0.16) 0%, rgba(255, 245, 255, 0) 6%),
            radial-gradient(circle at 34% 48%, rgba(255, 230, 245, 0.13) 0%, rgba(255, 230, 245, 0) 5%),
            radial-gradient(circle at 52% 53%, rgba(255, 239, 255, 0.14) 0%, rgba(255, 239, 255, 0) 5%);
          filter: blur(1.2px);
          mix-blend-mode: screen;
          opacity: 0.7;
          animation: heroOrbStarLift 10s ease-in-out infinite;
        }

        .hero-orb-v1__orb-edge-falloff {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          box-shadow:
            inset 0 0 0 1px rgba(255, 245, 255, 0.05),
            inset 0 -34px 46px rgba(8, 10, 20, 0.28),
            inset 0 0 60px rgba(8, 10, 20, 0.14);
          pointer-events: none;
        }

        .hero-orb-v1__front-veil {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: radial-gradient(
            circle at 50% 34%,
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.03) 22%,
            rgba(255, 255, 255, 0.008) 40%,
            rgba(255, 255, 255, 0) 58%
          );
          mix-blend-mode: screen;
          opacity: 0.64;
          animation: heroOrbFrontVeil 10s ease-in-out infinite;
        }

        .hero-orb-v1__lower-veil {
          position: absolute;
          left: 10%;
          right: 10%;
          bottom: 2%;
          height: 26%;
          border-radius: 999px;
          background: radial-gradient(
            ellipse at center,
            rgba(10, 12, 26, 0) 0%,
            rgba(10, 12, 26, 0.08) 44%,
            rgba(10, 12, 26, 0.18) 74%,
            rgba(10, 12, 26, 0.26) 100%
          );
          filter: blur(8px);
          opacity: 0.88;
        }

        .hero-orb-v1__specular-bloom {
          position: absolute;
          left: 25%;
          top: 15%;
          width: 50%;
          height: 34%;
          border-radius: 999px;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.09) 0%,
            rgba(214, 224, 255, 0.04) 42%,
            rgba(255, 255, 255, 0) 76%
          );
          filter: blur(14px);
          opacity: 0.64;
          animation: heroOrbSpecular 10s ease-in-out infinite;
        }

        .hero-orb-v1--hovered .hero-orb-v1__aura--outer {
          opacity: 0.82;
        }

        .hero-orb-v1--hovered .hero-orb-v1__aura--core {
          opacity: 0.92;
        }

        .hero-orb-v1--hovered .hero-orb-v1__orb-backglow {
          opacity: 0.94;
        }

        .hero-orb-v1--hovered .hero-orb-v1__orb-core-lift {
          opacity: 0.96;
        }

        .hero-orb-v1--hovered .hero-orb-v1__orb-star-lift {
          opacity: 0.82;
        }

        .hero-orb-v1--hovered .hero-orb-v1__specular-bloom {
          opacity: 0.74;
        }

        .hero-orb-v1--reduced-motion .hero-orb-v1__fabric,
        .hero-orb-v1--reduced-motion .hero-orb-v1__aura--outer,
        .hero-orb-v1--reduced-motion .hero-orb-v1__aura--core,
        .hero-orb-v1--reduced-motion .hero-orb-v1__ground-glow,
        .hero-orb-v1--reduced-motion .hero-orb-v1__ground-core,
        .hero-orb-v1--reduced-motion .hero-orb-v1__orb-wrap,
        .hero-orb-v1--reduced-motion .hero-orb-v1__orb-backglow,
        .hero-orb-v1--reduced-motion .hero-orb-v1__orb-core-lift,
        .hero-orb-v1--reduced-motion .hero-orb-v1__orb-star-lift,
        .hero-orb-v1--reduced-motion .hero-orb-v1__front-veil,
        .hero-orb-v1--reduced-motion .hero-orb-v1__specular-bloom {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
        }

        @keyframes heroOrbFabricBreath {
          0%,
          100% {
            opacity: 0.36;
            transform: translate(-50%, -50%) scale(0.97);
          }
          50% {
            opacity: 0.74;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        @keyframes heroOrbAuraOuter {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(0.95);
            opacity: 0.58;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
            opacity: 0.82;
          }
        }

        @keyframes heroOrbAuraCore {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(0.96);
            opacity: 0.56;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
            opacity: 0.88;
          }
        }

        @keyframes heroOrbGroundPulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(0.95);
            opacity: 0.58;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.06);
            opacity: 0.82;
          }
        }

        @keyframes heroOrbGroundCore {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(0.96);
            opacity: 0.7;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.06);
            opacity: 0.92;
          }
        }

        @keyframes heroOrbBreath {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(0.972);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.052);
          }
        }

        @keyframes heroOrbGlow {
          0%,
          100% {
            transform: scale(0.95);
            opacity: 0.72;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.92;
          }
        }

        @keyframes heroOrbCoreLift {
          0%,
          100% {
            opacity: 0.74;
            transform: scale(0.985);
          }
          50% {
            opacity: 0.92;
            transform: scale(1.02);
          }
        }

        @keyframes heroOrbStarLift {
          0%,
          100% {
            opacity: 0.58;
            transform: scale(0.99);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.02);
          }
        }

        @keyframes heroOrbFrontVeil {
          0%,
          100% {
            opacity: 0.54;
            transform: scale(0.988);
          }
          50% {
            opacity: 0.68;
            transform: scale(1.015);
          }
        }

        @keyframes heroOrbSpecular {
          0%,
          100% {
            opacity: 0.56;
            transform: scale(0.985);
          }
          50% {
            opacity: 0.72;
            transform: scale(1.03);
          }
        }

        @media (max-width: 1200px) {
          .hero-orb-v1 {
            width: min(100%, 660px);
            height: 460px;
          }

          .hero-orb-v1__stage {
            width: 680px;
            height: 520px;
          }

          .hero-orb-v1__orb-wrap {
            width: 308px;
            height: 308px;
          }
        }

        @media (max-width: 960px) {
          .hero-orb-v1 {
            width: min(100%, 560px);
            height: 400px;
          }

          .hero-orb-v1__stage {
            width: 560px;
            height: 430px;
          }

          .hero-orb-v1__orb-wrap {
            width: 272px;
            height: 272px;
            top: 48%;
          }

          .hero-orb-v1__aura--outer {
            width: 600px;
            height: 600px;
          }

          .hero-orb-v1__aura--core {
            width: 430px;
            height: 430px;
          }
        }

        @media (max-width: 640px) {
          .hero-orb-v1 {
            width: min(100%, 420px);
            height: 310px;
          }

          .hero-orb-v1__fabric {
            width: 760px;
            height: 540px;
            filter: blur(48px);
          }

          .hero-orb-v1__stage {
            width: 420px;
            height: 320px;
          }

          .hero-orb-v1__orb-wrap {
            width: 214px;
            height: 214px;
            top: 48.5%;
          }

          .hero-orb-v1__aura--outer {
            width: 450px;
            height: 450px;
            filter: blur(46px);
          }

          .hero-orb-v1__aura--core {
            width: 320px;
            height: 320px;
            filter: blur(32px);
          }

          .hero-orb-v1__ground-glow {
            width: 240px;
          }

          .hero-orb-v1__ground-core {
            width: 146px;
          }
        }
      `}</style>
    </div>
  );
}