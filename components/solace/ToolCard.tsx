import { ReactNode } from "react";
import { toolTones } from "./tokens";
import { ToolTone } from "./types";

type Props = {
  tone: ToolTone;
  children: ReactNode;
  padding?: number;
};

export default function ToolCard({ tone, children, padding = 32 }: Props) {
  const token = toolTones[tone];

  return (
    <div className="solace-card">
      <div className="solace-tool-accent" style={{ background: token.accent }} />
      <div className="solace-card-inner solace-surface" style={{ padding }}>
        {children}
      </div>
    </div>
  );
}