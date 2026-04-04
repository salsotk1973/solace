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

function createSeededRandom(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

const DUST_DOTS: DustDot[] = (() => {
  const random = createSeededRandom(240405);
  return Array.from({ length: 14 }, (_, id) => ({
    id,
    left: 4 + random() * 92,
    top: 6 + random() * 86,
    size: 0.5 + random() * 1.2,
    alpha: 0.012 + random() * 0.02,
    duration: 120 + random() * 120,
    delay: -(random() * 220),
    tx: -8 + random() * 16,
    ty: -6 + random() * 12,
  }));
})();

export function SolaceAmbientDust() {
  const dust = useMemo(() => DUST_DOTS, []);
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
