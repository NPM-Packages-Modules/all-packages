import { useState, type CSSProperties } from "react";
import { useTrading } from "./TradingProvider.js";

export interface VolumeControlProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  presets?: number[];
  showPresets?: boolean;
  showLabel?: boolean;
  label?: string;
  style?: CSSProperties;
  className?: string;
}

export function VolumeControl({
  value,
  onChange,
  min = 0.01,
  max = 100,
  step = 0.01,
  presets = [0.01, 0.05, 0.1, 0.5, 1.0],
  showPresets = true,
  showLabel = true,
  label = "Vol",
  style,
  className,
}: VolumeControlProps) {
  const { volume, setVolume } = useTrading();
  const controlled = value !== undefined;
  const [inner, setInner] = useState(value ?? volume);
  const current = controlled ? value! : inner;

  const set = (n: number) => {
    const clamped = Math.min(max, Math.max(min, Number(n.toFixed(4))));
    if (!controlled) setInner(clamped);
    onChange?.(clamped);
    setVolume(clamped);
  };

  return (
    <div className={className} style={{ display: "inline-flex", alignItems: "center", gap: 6, ...style }}>
      {showLabel ? <span style={{ fontSize: 12, opacity: 0.7 }}>{label}</span> : null}
      <button type="button" style={chip} onClick={() => set(current - step)}>
        −
      </button>
      <input
        type="number"
        value={current}
        min={min}
        max={max}
        step={step}
        onChange={(e) => set(Number(e.target.value))}
        style={input}
      />
      <button type="button" style={chip} onClick={() => set(current + step)}>
        +
      </button>
      {showPresets
        ? presets.map((p) => (
            <button key={p} type="button" style={chip} onClick={() => set(p)}>
              {p}
            </button>
          ))
        : null}
    </div>
  );
}

const chip: CSSProperties = {
  background: "#1e293b",
  color: "#e2e8f0",
  border: "1px solid #334155",
  borderRadius: 4,
  padding: "4px 8px",
  cursor: "pointer",
};

const input: CSSProperties = {
  width: 64,
  padding: "4px 6px",
  borderRadius: 4,
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#e2e8f0",
};
