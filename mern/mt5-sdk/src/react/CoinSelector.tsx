import { useMemo, useState, type CSSProperties } from "react";
import { useTrading } from "./TradingProvider.js";
import { categorizeSymbols } from "../utils/symbols.js";

export interface CoinSelectorProps {
  style?: CSSProperties;
  className?: string;
}

export function CoinSelector({ style, className }: CoinSelectorProps) {
  const { symbols, selectedSymbol, setSelectedSymbol, symbolsLoading } = useTrading();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const groups = useMemo(() => {
    const filtered = symbols.filter((s) =>
      s.symbol.toLowerCase().includes(q.toLowerCase()) ||
      (s.description ?? "").toLowerCase().includes(q.toLowerCase()),
    );
    return categorizeSymbols(filtered);
  }, [symbols, q]);

  return (
    <div className={className} style={{ position: "relative", minWidth: 140, ...style }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={btnStyle}
        disabled={symbolsLoading}
      >
        {selectedSymbol}
        <span style={{ opacity: 0.6, marginLeft: 6 }}>▾</span>
      </button>
      {open && (
        <div style={menuStyle}>
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search symbol"
            style={inputStyle}
          />
          {(
            [
              ["Forex", groups.forex],
              ["Metals", groups.metals],
              ["Crypto", groups.crypto],
              ["Other", groups.other],
            ] as const
          ).map(([label, list]) =>
            list.length ? (
              <div key={label}>
                <div style={groupLabel}>{label}</div>
                {list.map((s) => (
                  <button
                    key={s.symbol}
                    type="button"
                    style={itemStyle}
                    onClick={() => {
                      setSelectedSymbol(s.symbol);
                      setOpen(false);
                      setQ("");
                    }}
                  >
                    <strong>{s.symbol}</strong>
                    {s.description ? (
                      <span style={{ opacity: 0.6, marginLeft: 8 }}>{s.description}</span>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}

const btnStyle: CSSProperties = {
  background: "#111827",
  color: "#e5e7eb",
  border: "1px solid #374151",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
  width: "100%",
  textAlign: "left",
};

const menuStyle: CSSProperties = {
  position: "absolute",
  zIndex: 50,
  top: "110%",
  left: 0,
  right: 0,
  maxHeight: 280,
  overflow: "auto",
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: 8,
  padding: 8,
};

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  marginBottom: 8,
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid #334155",
  background: "#020617",
  color: "#e2e8f0",
};

const groupLabel: CSSProperties = {
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: 0.6,
  color: "#94a3b8",
  margin: "6px 4px",
};

const itemStyle: CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "left",
  background: "transparent",
  border: "none",
  color: "#e2e8f0",
  padding: "6px 8px",
  borderRadius: 4,
  cursor: "pointer",
};
