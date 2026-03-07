"use client";

import { toolTones } from "./tokens";
import { ToolTone } from "./types";

type Props = {
  tone: ToolTone;
  title?: string;
  subtitle?: string;
};

export default function ReflectionMoment({
  tone,
  title = "Thank you for sharing that.",
  subtitle = "Give us a moment to reflect.",
}: Props) {
  const token = toolTones[tone];

  return (
    <div
      className="solace-result"
      style={{
        display: "grid",
        placeItems: "center",
        gap: 18,
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      <div className="solace-breathing-orb" style={{ background: token.orb }} />
      <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <h3 className="solace-h3">{title}</h3>
        <p className="solace-body" style={{ margin: 0 }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}