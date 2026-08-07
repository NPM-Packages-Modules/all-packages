import { useState, type CSSProperties } from "react";
import type { RiskMode } from "../types.js";

export interface RiskInputProps {
  value?: string;
  onChange?: (value: string) => void;
  enabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  mode?: RiskMode;
  onModeChange?: (mode: RiskMode) => void;
  showToggle?: boolean;
  showModeSwitch?: boolean;
  showLabel?: boolean;
  label?: string;
  accent?: string;
  style?: CSSProperties;
  className?: string;
}

export function RiskInput({
  value,
  onChange,
  enabled,
  onEnabledChange,
  mode,
  onModeChange,
  showToggle = true,
  showModeSwitch = true,
  showLabel = true,
  label = "SL",
  accent = "#ef4444",
  style,
  className,
}: RiskInputProps) {
  const [innerValue, setInnerValue] = useState(value ?? "");
  const [innerEnabled, setInnerEnabled] = useState(enabled ?? false);
  const [innerMode, setInnerMode] = useState<RiskMode>(mode ?? "price");

  const currentValue = value !== undefined ? value : innerValue;
  const currentEnabled = enabled !== undefined ? enabled : innerEnabled;
  const currentMode = mode ?? innerMode;

  return (
    <div className={className} style={{ display: "inline-flex", alignItems: "center", gap: 6, ...style }}>
      {showLabel ? <span style={{ fontSize: 12, color: accent, fontWeight: 600 }}>{label}</span> : null}
      {showToggle ? (
        <button
          type="button"
          style={{
            ...chip,
            background: currentEnabled ? accent : "#1e293b",
            color: currentEnabled ? "#fff" : "#e2e8f0",
          }}
          onClick={() => {
            const next = !currentEnabled;
            if (enabled === undefined) setInnerEnabled(next);
            onEnabledChange?.(next);
          }}
        >
          {currentEnabled ? "On" : "Off"}
        </button>
      ) : null}
      <input
        disabled={!currentEnabled}
        value={currentValue}
        onChange={(e) => {
          if (value === undefined) setInnerValue(e.target.value);
          onChange?.(e.target.value);
        }}
        placeholder={currentMode === "pips" ? "pips" : "price"}
        style={{ ...input, opacity: currentEnabled ? 1 : 0.5 }}
      />
      {showModeSwitch ? (
        <button
          type="button"
          style={chip}
          onClick={() => {
            const next: RiskMode = currentMode === "price" ? "pips" : "price";
            if (mode === undefined) setInnerMode(next);
            onModeChange?.(next);
          }}
        >
          {currentMode === "price" ? "Price" : "Pips"}
        </button>
      ) : null}
    </div>
  );
}

export function StopLoss(props: Omit<RiskInputProps, "accent" | "label"> & { label?: string }) {
  return <RiskInput {...props} label={props.label ?? "SL"} accent="#ef4444" />;
}

export function TakeProfit(props: Omit<RiskInputProps, "accent" | "label"> & { label?: string }) {
  return <RiskInput {...props} label={props.label ?? "TP"} accent="#22c55e" />;
}

const chip: CSSProperties = {
  background: "#1e293b",
  color: "#e2e8f0",
  border: "1px solid #334155",
  borderRadius: 4,
  padding: "4px 8px",
  cursor: "pointer",
  fontSize: 12,
};

const input: CSSProperties = {
  width: 72,
  padding: "4px 6px",
  borderRadius: 4,
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#e2e8f0",
};
