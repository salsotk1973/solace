import { toolTones } from "./tokens";
import { ToolTone } from "./types";

type Props = {
  tone: ToolTone;
  title: string;
  description: string;
};

export default function ToolIntro({ tone, title, description }: Props) {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="solace-badge">{toolTones[tone].label}</div>
      <h1 className="solace-h2">{title}</h1>
      <p className="solace-body-xl" style={{ margin: 0, maxWidth: 760 }}>
        {description}
      </p>
    </div>
  );
}