"use client";

type Props = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

export default function RangeRow({ label, value, onChange }: Props) {
  return (
    <label style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <span className="solace-body" style={{ color: "#2b3442" }}>
          {label}
        </span>
        <span className="solace-chip">{value}/10</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%" }}
      />
    </label>
  );
}