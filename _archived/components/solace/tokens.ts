import { ToolTone } from "./types";

export const toolTones: Record<
  ToolTone,
  {
    label: string;
    accent: string;
    orb: string;
    button: string;
  }
> = {
  clarity: {
    label: "Quiet reflection",
    accent:
      "linear-gradient(135deg, rgba(243,244,246,0.95) 0%, rgba(229,231,235,0.62) 100%)",
    orb: "linear-gradient(135deg, #e8ebf1 0%, #dce1e9 100%)",
    button: "linear-gradient(135deg, #8d96a6 0%, #adb5c1 100%)",
  },
  decision: {
    label: "Analytical calm",
    accent:
      "linear-gradient(135deg, rgba(230,240,255,0.95) 0%, rgba(221,232,255,0.64) 100%)",
    orb: "linear-gradient(135deg, #b9d1ff 0%, #d5e3ff 100%)",
    button: "linear-gradient(135deg, #6d8fff 0%, #88a8ff 100%)",
  },
  overthinking: {
    label: "Grounding",
    accent:
      "linear-gradient(135deg, rgba(234,247,240,0.96) 0%, rgba(223,243,231,0.64) 100%)",
    orb: "linear-gradient(135deg, #bfe4cb 0%, #d8f1e0 100%)",
    button: "linear-gradient(135deg, #6ea882 0%, #8bc09c 100%)",
  },
  burnout: {
    label: "Restorative",
    accent:
      "linear-gradient(135deg, rgba(255,244,230,0.95) 0%, rgba(255,235,214,0.66) 100%)",
    orb: "linear-gradient(135deg, #ffd5b3 0%, #ffe5cb 100%)",
    button: "linear-gradient(135deg, #f0a76f 0%, #f3ba8c 100%)",
  },
  weekly: {
    label: "Evening reflection",
    accent:
      "linear-gradient(135deg, rgba(241,236,255,0.95) 0%, rgba(232,224,255,0.66) 100%)",
    orb: "linear-gradient(135deg, #d9caf8 0%, #ebdefd 100%)",
    button: "linear-gradient(135deg, #9a84de 0%, #b09ae7 100%)",
  },
};