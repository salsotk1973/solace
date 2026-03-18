"use client";

import { useEffect, useRef, useState } from "react";

export default function MindAnchor() {
  const pathRef = useRef<SVGPathElement>(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (!pathRef.current) return;

    const chaotic =
      "M100,200 C150,50 250,350 350,200 C450,50 550,350 650,200";
    const clean =
      "M100,200 C250,160 450,160 650,200";

    const path = pathRef.current;

    let progress = 0;
    let animationFrame: number;

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function interpolatePath(t: number) {
      // simple manual morph (since paths share structure)
      const c = chaotic.match(/-?\d+\.?\d*/g)!.map(Number);
      const d = clean.match(/-?\d+\.?\d*/g)!.map(Number);

      const result = c.map((val, i) => lerp(val, d[i], t));

      return `M${result[0]},${result[1]} C${result[2]},${result[3]} ${result[4]},${result[5]} ${result[6]},${result[7]} C${result[8]},${result[9]} ${result[10]},${result[11]} ${result[12]},${result[13]}`;
    }

    function animate() {
      progress += 0.008; // slow + premium

      if (progress > 1) progress = 1;

      path.setAttribute("d", interpolatePath(progress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    }

    if (resolved) {
      progress = 0;
      animate();
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [resolved]);

  return (
    <div className="wrap" onClick={() => setResolved(true)}>
      <svg viewBox="0 0 750 400" className="svg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="grad" x1="0%" y1="0%" x2="100%">
            <stop offset="0%" stopColor="#a8b5ff" />
            <stop offset="50%" stopColor="#d6dcff" />
            <stop offset="100%" stopColor="#a8b5ff" />
          </linearGradient>
        </defs>

        {/* ambient glow */}
        <path
          d="M100,200 C150,50 250,350 350,200 C450,50 550,350 650,200"
          className="cord glow"
        />

        {/* main cord */}
        <path
          ref={pathRef}
          d="M100,200 C150,50 250,350 350,200 C450,50 550,350 650,200"
          className="cord main"
        />
      </svg>

      <style jsx>{`
        .wrap {
          width: 100%;
          max-width: 720px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 260px;
          cursor: pointer;
        }

        .svg {
          width: 100%;
          height: 100%;
        }

        .cord {
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        /* thick glowing body */
        .main {
          stroke: url(#grad);
          stroke-width: 18;
          filter: url(#glow);
          opacity: 0.95;
        }

        /* soft halo */
        .glow {
          stroke: #cfd6ff;
          stroke-width: 40;
          opacity: 0.15;
          filter: blur(20px);
        }

        @media (max-width: 640px) {
          .wrap {
            height: 200px;
          }

          .main {
            stroke-width: 14;
          }

          .glow {
            stroke-width: 30;
          }
        }
      `}</style>
    </div>
  );
}