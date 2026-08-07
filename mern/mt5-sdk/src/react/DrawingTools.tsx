import type { CSSProperties } from "react";
import type { DrawingTool } from "../types.js";
import { useTrading } from "./TradingProvider.js";

const TOOLS: Array<{ id: Exclude<DrawingTool, null>; label: string }> = [
  { id: "crosshair", label: "Cross" },
  { id: "trendline", label: "Trend" },
  { id: "channel", label: "Channel" },
  { id: "fibonacci", label: "Fib" },
  { id: "rectangle", label: "Rect" },
  { id: "price-level", label: "Level" },
];

export interface DrawingToolsProps {
  showLabel?: boolean;
  showDelete?: boolean;
  showVisibility?: boolean;
  label?: string;
  style?: CSSProperties;
  className?: string;
}

export function DrawingTools({
  showLabel = true,
  showDelete = true,
  showVisibility = true,
  label = "Draw",
  style,
  className,
}: DrawingToolsProps) {
  const {
    activeTool,
    setActiveTool,
    chartObjects,
    setChartObjects,
    drawingsVisible,
    setDrawingsVisible,
  } = useTrading();

  return (
    <div className={className} style={{ display: "inline-flex", alignItems: "center", gap: 4, ...style }}>
      {showLabel ? <span style={{ fontSize: 12, opacity: 0.7 }}>{label}</span> : null}
      {TOOLS.map((t) => (
        <button
          key={t.id}
          type="button"
          style={{
            ...chip,
            background: activeTool === t.id ? "#3b82f6" : "#1e293b",
          }}
          onClick={() => setActiveTool(t.id)}
          title={t.id}
        >
          {t.label}
        </button>
      ))}
      {showVisibility ? (
        <button type="button" style={chip} onClick={() => setDrawingsVisible(!drawingsVisible)}>
          {drawingsVisible ? "Hide" : "Show"}
        </button>
      ) : null}
      {showDelete ? (
        <button
          type="button"
          style={chip}
          disabled={!chartObjects.length}
          onClick={() => setChartObjects([])}
        >
          Clear
        </button>
      ) : null}
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
  fontSize: 12,
};
