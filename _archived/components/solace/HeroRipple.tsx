"use client";

export default function HeroRipple() {
  return (
    <div className="solace-ripple-wrapper">
      <div className="solace-sphere" />
      <div className="ripple r1" />
      <div className="ripple r2" />
      <div className="ripple r3" />

      <style jsx>{`
        .solace-ripple-wrapper {
          position: relative;
          width: 420px;
          height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .solace-sphere {
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: radial-gradient(
              circle at 32% 28%,
              rgba(255, 255, 255, 0.9) 0%,
              rgba(255, 255, 255, 0.35) 12%,
              rgba(170, 150, 240, 0.55) 30%,
              rgba(130, 110, 220, 0.9) 100%
            ),
            linear-gradient(145deg, #b8aaf0, #7f74dc);

          box-shadow: 0 40px 90px rgba(120, 100, 220, 0.25);
        }

        .ripple {
          position: absolute;
          border-radius: 50%;
          border: 2px solid rgba(180, 170, 255, 0.4);
          animation: ripple 6s infinite ease-out;
        }

        .r1 {
          width: 320px;
          height: 320px;
          animation-delay: 0s;
        }

        .r2 {
          width: 360px;
          height: 360px;
          animation-delay: 2s;
        }

        .r3 {
          width: 400px;
          height: 400px;
          animation-delay: 4s;
        }

        @keyframes ripple {
          0% {
            transform: scale(0.9);
            opacity: 0.4;
          }

          70% {
            transform: scale(1.15);
            opacity: 0.08;
          }

          100% {
            transform: scale(1.25);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}