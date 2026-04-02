import { ReactNode } from "react";

type SurfaceTone = "cloud" | "lavender" | "mint";

type SurfaceProps = {
  children: ReactNode;
  tone?: SurfaceTone;
  padding?: number;
};

export default function Surface({
  children,
  tone = "cloud",
  padding = 34,
}: SurfaceProps) {
  const tones: Record<SurfaceTone, string> = {
    cloud:
      "linear-gradient(180deg, rgba(255,255,255,0.80) 0%, rgba(255,255,255,0.62) 100%)",
    lavender:
      "linear-gradient(180deg, rgba(242,237,255,0.82) 0%, rgba(255,255,255,0.64) 100%)",
    mint:
      "linear-gradient(180deg, rgba(234,247,240,0.82) 0%, rgba(255,255,255,0.64) 100%)",
  };

  return (
    <div
      className="solace-surface-card"
      style={{
        padding,
        background: tones[tone],

        /* stable architectural surface */
        transform: "none",
        boxShadow:
          "0 18px 60px rgba(70,80,120,0.08), inset 0 1px 0 rgba(255,255,255,0.65)",
      }}
    >
      {children}
    </div>
  );
}