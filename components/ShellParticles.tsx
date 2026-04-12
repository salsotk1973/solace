"use client";

import { useEffect, useState, type CSSProperties } from "react";

interface Dot {
  id: number;
  size: number;
  left: number;
  bottom: number;
  alpha: number;
  duration: number;
  delay: number;
  ty: number;
  tx: number;
  rgb: string;
  pulseDuration: number;
  pulseDelay: number;
}

const PURPLE_SHADES = [
  "148,110,220",
  "120,88,198",
  "178,148,240",
  "100,78,185",
  "195,165,248",
];

export default function ShellParticles() {
  const [isMounted, setIsMounted] = useState(false);
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    let isActive = true;
    const frameId = window.requestAnimationFrame(() => {
      if (!isActive) return;

      setIsMounted(true);
      setDots(
        Array.from({ length: 120 }, (_, id) => ({
          id,
          size: 0.8 + Math.random() * 2.6,
          left: 2 + Math.random() * 96,
          bottom: Math.random() * 20,
          alpha: 0.08 + Math.random() * 0.28,
          duration: 14 + Math.random() * 22,
          delay: -(Math.random() * 32),
          ty: 40 + Math.random() * 50,
          tx: -50 + Math.random() * 100,
          rgb: PURPLE_SHADES[Math.floor(Math.random() * PURPLE_SHADES.length)],
          pulseDuration: 2 + Math.random() * 3,
          pulseDelay: -(Math.random() * 5),
        })),
      );
    });

    return () => {
      isActive = false;
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {isMounted &&
        dots.map((dot) => (
          <div
            key={dot.id}
            style={
              {
                position: "absolute",
                width: `${dot.size}px`,
                height: `${dot.size}px`,
                borderRadius: "50%",
                backgroundColor: "rgba(var(--rgb), var(--a))",
                left: `${dot.left}%`,
                bottom: `${dot.bottom}%`,
                animation:
                  "riseUp var(--d) ease-in-out infinite var(--dl), purplePulse var(--pd) ease-in-out infinite var(--poff)",
                "--ty": `-${dot.ty}vh`,
                "--tx": `${dot.tx}px`,
                "--d": `${dot.duration}s`,
                "--dl": `${dot.delay}s`,
                "--rgb": dot.rgb,
                "--a": `${dot.alpha}`,
                "--size": `${dot.size}`,
                "--pd": `${dot.pulseDuration}s`,
                "--poff": `${dot.pulseDelay}s`,
              } as CSSProperties
            }
          />
        ))}
    </div>
  );
}
