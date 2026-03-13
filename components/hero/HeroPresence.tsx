"use client";

const SHOW_RIPPLES = false;
const SHOW_FABRIC_BREATH = true;

export default function HeroPresence() {
  return (
    <div
      style={{
        position: "relative",
        width: 980,
        height: 820,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      {SHOW_FABRIC_BREATH && (
        <div className="solace-fabric-breath" aria-hidden="true" />
      )}

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          top: "51.5%",
          width: 1040,
          height: 1040,
          borderRadius: "999px",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(194,178,255,0.14) 0%, rgba(194,178,255,0.08) 30%, rgba(194,178,255,0.035) 52%, rgba(194,178,255,0.012) 64%, rgba(194,178,255,0) 78%)",
          filter: "blur(84px)",
          zIndex: 0,
          animation: "solaceAuraBreathSync 10s linear infinite",
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          top: "55.4%",
          width: 760,
          height: 760,
          borderRadius: "999px",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(205,186,255,0.22) 0%, rgba(186,162,255,0.13) 34%, rgba(186,162,255,0.055) 56%, rgba(186,162,255,0) 74%)",
          filter: "blur(50px)",
          zIndex: 1,
          animation: "solaceCoreAuraSync 10s linear infinite",
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          top: "73.4%",
          width: 460,
          height: 100,
          transform: "translate(-50%, -50%)",
          borderRadius: "999px",
          background:
            "radial-gradient(ellipse at center, rgba(118,84,220,0.16) 0%, rgba(118,84,220,0.07) 44%, rgba(118,84,220,0.02) 70%, rgba(118,84,220,0) 84%)",
          filter: "blur(24px)",
          zIndex: 2,
          animation: "solaceGroundPulseSync 10s linear infinite",
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          top: "73.52%",
          width: 235,
          height: 32,
          transform: "translate(-50%, -50%)",
          borderRadius: "999px",
          background:
            "radial-gradient(ellipse at center, rgba(102,72,196,0.28) 0%, rgba(102,72,196,0.10) 50%, rgba(102,72,196,0) 84%)",
          filter: "blur(12px)",
          zIndex: 3,
          animation: "solaceGroundCoreSync 10s linear infinite",
        }}
      />

      {SHOW_RIPPLES && (
        <>
          <div className="solace-ripple-base" />
          <div className="solace-ripple-volume ripple1" />
          <div className="solace-ripple-volume ripple2" />
          <div className="solace-ripple-volume ripple3" />
          <div className="solace-ripple-volume ripple4" />
        </>
      )}

      <div
        style={{
          position: "relative",
          width: 860,
          height: 720,
          zIndex: 4,
        }}
      >
        <div className="solace-orb-wrap">
          <div className="solace-orb-backglow" />

          <div className="solace-orb-image-frame">
            <img
              src="/hero/solace-orb.png"
              alt=""
              className="solace-orb-image"
              draggable={false}
            />
          </div>

          <div className="solace-orb-frontveil" />
          <div className="solace-orb-lowerveil" />
        </div>
      </div>

      <style jsx>{`
        .solace-fabric-breath {
          position: absolute;
          left: 50%;
          top: 56%;
          width: 1600px;
          height: 1200px;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          z-index: 0;
          pointer-events: none;

          background: radial-gradient(
            ellipse at center,
            rgba(60, 45, 115, 0.65) 0%,
            rgba(60, 45, 115, 0.45) 20%,
            rgba(60, 45, 115, 0.25) 40%,
            rgba(60, 45, 115, 0.1) 60%,
            rgba(60, 45, 115, 0) 80%
          );

          filter: blur(80px);
          mix-blend-mode: multiply;
          animation: solaceFabricBreathSync 10s linear infinite;
        }

        .solace-orb-wrap {
          position: absolute;
          left: 50%;
          top: 53%;
          width: 468px;
          height: 468px;
          transform: translate(-50%, -50%);
          animation: solaceOrbBreathSync 10s linear infinite;
        }

        .solace-orb-backglow {
          position: absolute;
          inset: -48px;
          border-radius: 999px;
          background: radial-gradient(
            circle,
            rgba(224, 212, 255, 0.32) 0%,
            rgba(191, 167, 255, 0.15) 38%,
            rgba(191, 167, 255, 0.055) 60%,
            rgba(191, 167, 255, 0) 78%
          );
          filter: blur(34px);
          animation: solaceOrbGlowSync 10s linear infinite;
        }

        .solace-orb-image-frame {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 999px;
        }

        .solace-orb-image {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 100%;
          height: 100%;
          object-fit: contain;
          transform: translate(-50%, -50%) scale(2.22);
        }

        @keyframes solaceFabricBreathSync {
          0% {
            opacity: 0.2;
            transform: translate(-50%, -50%) scale(0.96);
          }
          50% {
            opacity: 0.85;
            transform: translate(-50%, -50%) scale(1.18);
          }
          100% {
            opacity: 0.2;
            transform: translate(-50%, -50%) scale(0.96);
          }
        }

        @keyframes solaceOrbBreathSync {
          0% {
            transform: translate(-50%, -50%) scale(0.96);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.13);
          }
          100% {
            transform: translate(-50%, -50%) scale(0.96);
          }
        }

        @keyframes solaceOrbGlowSync {
          0% {
            transform: scale(0.94);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.12);
            opacity: 1;
          }
          100% {
            transform: scale(0.94);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}