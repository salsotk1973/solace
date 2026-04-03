import type { ReactNode } from "react";

const DOTS = [
  { top: "8%", left: "12%" },
  { top: "14%", left: "28%" },
  { top: "22%", left: "46%" },
  { top: "10%", left: "64%" },
  { top: "18%", left: "82%" },
  { top: "34%", left: "18%" },
  { top: "40%", left: "36%" },
  { top: "48%", left: "54%" },
  { top: "36%", left: "74%" },
  { top: "56%", left: "88%" },
  { top: "68%", left: "14%" },
  { top: "74%", left: "32%" },
  { top: "80%", left: "52%" },
  { top: "72%", left: "70%" },
  { top: "86%", left: "84%" },
];

export default function BgSubtle({ children }: { children: ReactNode }) {
  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none"
      >
        {DOTS.map((dot, index) => (
          <span
            key={index}
            style={{
              position: "absolute",
              top: dot.top,
              left: dot.left,
              width: "2px",
              height: "2px",
              borderRadius: "9999px",
              background: "rgba(255,255,255,0.05)",
            }}
          />
        ))}
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </>
  );
}
