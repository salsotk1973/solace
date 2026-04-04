"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

type DustDot = {
  id: number;
  left: number;
  top: number;
  size: number;
  alpha: number;
  duration: number;
  delay: number;
  tx: number;
  ty: number;
};

function createDust(): DustDot[] {
  return Array.from({ length: 14 }, (_, id) => ({
    id,
    left: 4 + Math.random() * 92,
    top: 6 + Math.random() * 86,
    size: 0.5 + Math.random() * 1.2,
    alpha: 0.012 + Math.random() * 0.02,
    duration: 120 + Math.random() * 120,
    delay: -(Math.random() * 220),
    tx: -8 + Math.random() * 16,
    ty: -6 + Math.random() * 12,
  }));
}

export function SolaceAmbientDust() {
  const dust = useMemo(() => createDust(), []);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {dust.map((dot) => (
          <span
            key={dot.id}
            style={
              {
                position: "absolute",
                left: `${dot.left}%`,
                top: `${dot.top}%`,
                width: `${dot.size}px`,
                height: `${dot.size}px`,
                borderRadius: "9999px",
                background: `rgba(214, 222, 240, ${dot.alpha})`,
                transform: "translate3d(0, 0, 0)",
                animation: reduceMotion
                  ? "none"
                  : `solaceDustDrift ${dot.duration}s ease-in-out infinite ${dot.delay}s`,
                "--tx": `${dot.tx}px`,
                "--ty": `${dot.ty}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <style jsx global>{`
        @keyframes solaceDustDrift {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 1;
          }
          50% {
            transform: translate3d(var(--tx), var(--ty), 0);
            opacity: 0.8;
          }
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
