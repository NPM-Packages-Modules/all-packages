import type { CSSProperties } from "react";
import type { Timeframe } from "../types.js";
import { useTrading } from "./TradingProvider.js";

const TFS: Timeframe[] = ["1m", "5m", "15m", "30m", "1h", "4h", "1d", "1w"];

export interface TimeframeSelectorProps {
  style?: CSSProperties;
  className?: string;
}

export function TimeframeSelector({ style, className }: TimeframeSelectorProps) {
  const { selectedTimeframe, setSelectedTimeframe } = useTrading();
  return (
    <div className={className} style={{ display: "inline-flex", gap: 4, ...style }}>
      {TFS.map((tf) => (
        <button
          key={tf}
          type="button"
          onClick={() => setSelectedTimeframe(tf)}
          style={{
            background: selectedTimeframe === tf ? "#3b82f6" : "#1e293b",
            color: "#e2e8f0",
            border: "1px solid #334155",
            borderRadius: 4,
            padding: "4px 8px",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          {tf}
        </button>
      ))}
    </div>
  );
}
