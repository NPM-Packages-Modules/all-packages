import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import type { ChartType, DrawingTool, Order } from "../types.js";
import { useTrading } from "./TradingProvider.js";
import { CoinSelector } from "./CoinSelector.js";
import { TimeframeSelector } from "./TimeframeSelector.js";
import { VolumeControl } from "./VolumeControl.js";
import { StopLoss, TakeProfit } from "./RiskInputs.js";
import { DrawingTools } from "./DrawingTools.js";

const panel: CSSProperties = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: 8,
  padding: 12,
  color: "#e2e8f0",
};

const btn: CSSProperties = {
  background: "#1e293b",
  color: "#e2e8f0",
  border: "1px solid #334155",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 12,
};

const buyBtn: CSSProperties = { ...btn, background: "#166534", borderColor: "#22c55e" };
const sellBtn: CSSProperties = { ...btn, background: "#7f1d1d", borderColor: "#ef4444" };

export interface AccountPanelProps {
  style?: CSSProperties;
  className?: string;
}

/** Balance / equity / margin summary from TradingProvider. */
export function AccountPanel({ style, className }: AccountPanelProps) {
  const { accountSummary, userBalance, refresh } = useTrading();
  const a = accountSummary;
  return (
    <div className={className} style={{ ...panel, ...style }} data-mt5="AccountPanel">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <strong>Account</strong>
        <button type="button" style={btn} onClick={() => void refresh()}>
          Refresh
        </button>
      </div>
      <Row label="Balance" value={fmt(a?.balance ?? userBalance, a?.currency)} />
      <Row label="Equity" value={fmt(a?.equity ?? userBalance, a?.currency)} />
      <Row label="Margin" value={fmt(a?.margin, a?.currency)} />
      <Row label="Free margin" value={fmt(a?.freeMargin, a?.currency)} />
      <Row label="Leverage" value={a?.leverage ? `1:${a.leverage}` : "—"} />
    </div>
  );
}

export interface PositionsPanelProps {
  style?: CSSProperties;
  className?: string;
  onClose?: (order: Order) => void;
}

/** Open positions / orders list with optional close action. */
export function PositionsPanel({ style, className, onClose }: PositionsPanelProps) {
  const { orders, client, refresh } = useTrading();
  const open = orders.filter((o) => !o.status || o.status === "open" || o.status === "pending");

  return (
    <div className={className} style={{ ...panel, ...style }} data-mt5="PositionsPanel">
      <strong style={{ display: "block", marginBottom: 8 }}>Positions ({open.length})</strong>
      {open.length === 0 ? (
        <div style={{ opacity: 0.6, fontSize: 13 }}>No open positions</div>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {open.map((o) => (
            <div
              key={o.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
                padding: 8,
                background: "#020617",
                borderRadius: 6,
              }}
            >
              <div style={{ fontSize: 12 }}>
                <div>
                  <strong>{o.symbol}</strong> · {o.side.toUpperCase()} · {o.volume}
                </div>
                <div style={{ opacity: 0.7 }}>@ {o.openPrice}</div>
              </div>
              <button
                type="button"
                style={btn}
                onClick={async () => {
                  if (onClose) onClose(o);
                  else {
                    await client.closeOrder(o.id);
                    await refresh();
                  }
                }}
              >
                Close
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export interface MarketWatchProps {
  style?: CSSProperties;
  className?: string;
  limit?: number;
}

/** Live symbol watchlist (bid/ask/spread). */
export function MarketWatch({ style, className, limit = 20 }: MarketWatchProps) {
  const { symbols, selectedSymbol, setSelectedSymbol, symbolsLoading } = useTrading();
  const list = symbols.slice(0, limit);

  return (
    <div className={className} style={{ ...panel, ...style }} data-mt5="MarketWatch">
      <strong style={{ display: "block", marginBottom: 8 }}>Market Watch</strong>
      {symbolsLoading ? <div style={{ opacity: 0.6 }}>Loading…</div> : null}
      <div style={{ display: "grid", gap: 4, maxHeight: 320, overflow: "auto" }}>
        {list.map((s) => (
          <button
            key={s.symbol}
            type="button"
            onClick={() => setSelectedSymbol(s.symbol)}
            style={{
              ...btn,
              textAlign: "left",
              background: s.symbol === selectedSymbol ? "#1d4ed8" : "#020617",
              display: "grid",
              gridTemplateColumns: "1fr auto auto",
              gap: 8,
            }}
          >
            <span>{s.symbol}</span>
            <span style={{ opacity: 0.85 }}>{s.bid ?? "—"}</span>
            <span style={{ opacity: 0.85 }}>{s.ask ?? "—"}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export interface BuySellPanelProps {
  style?: CSSProperties;
  className?: string;
  showStopLoss?: boolean;
  showTakeProfit?: boolean;
}

/** Buy / Sell execution panel with volume + optional SL/TP. */
export function BuySellPanel({
  style,
  className,
  showStopLoss = true,
  showTakeProfit = true,
}: BuySellPanelProps) {
  const { selectedSymbol, currentSymbolData, placeTrade, volume } = useTrading();
  const [sl, setSl] = useState("");
  const [slOn, setSlOn] = useState(false);
  const [tp, setTp] = useState("");
  const [tpOn, setTpOn] = useState(false);
  const [busy, setBusy] = useState(false);

  const bid = currentSymbolData?.bid;
  const ask = currentSymbolData?.ask;

  const submit = async (side: "buy" | "sell") => {
    setBusy(true);
    try {
      await placeTrade({
        side,
        volume,
        stopLoss: slOn && sl ? Number(sl) : null,
        takeProfit: tpOn && tp ? Number(tp) : null,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={className} style={{ ...panel, ...style }} data-mt5="BuySellPanel">
      <div style={{ marginBottom: 8 }}>
        <strong>{selectedSymbol}</strong>
        <div style={{ fontSize: 12, opacity: 0.75 }}>
          Bid {bid ?? "—"} · Ask {ask ?? "—"}
        </div>
      </div>
      <VolumeControl />
      {showStopLoss ? (
        <div style={{ marginTop: 8 }}>
          <StopLoss value={sl} onChange={setSl} enabled={slOn} onEnabledChange={setSlOn} />
        </div>
      ) : null}
      {showTakeProfit ? (
        <div style={{ marginTop: 8 }}>
          <TakeProfit value={tp} onChange={setTp} enabled={tpOn} onEnabledChange={setTpOn} />
        </div>
      ) : null}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
        <button type="button" style={sellBtn} disabled={busy} onClick={() => void submit("sell")}>
          Sell {bid ?? ""}
        </button>
        <button type="button" style={buyBtn} disabled={busy} onClick={() => void submit("buy")}>
          Buy {ask ?? ""}
        </button>
      </div>
    </div>
  );
}

export interface TradePanelProps {
  style?: CSSProperties;
  className?: string;
}

/** Composite trade panel: symbol, buy/sell, and positions. */
export function TradePanel({ style, className }: TradePanelProps) {
  return (
    <div className={className} style={{ display: "grid", gap: 12, ...style }} data-mt5="TradePanel">
      <CoinSelector />
      <BuySellPanel />
      <PositionsPanel />
    </div>
  );
}

export interface ChartTypeSelectorProps {
  style?: CSSProperties;
  className?: string;
}

const CHART_TYPES: ChartType[] = ["candles", "bars", "line", "area"];

export function ChartTypeSelector({ style, className }: ChartTypeSelectorProps) {
  const { chartType, setChartType } = useTrading();
  return (
    <div className={className} style={{ display: "inline-flex", gap: 4, ...style }} data-mt5="ChartTypeSelector">
      {CHART_TYPES.map((t) => (
        <button
          key={t}
          type="button"
          style={{ ...btn, background: chartType === t ? "#3b82f6" : "#1e293b" }}
          onClick={() => setChartType(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export interface TopBarProps {
  style?: CSSProperties;
  className?: string;
  showChartType?: boolean;
  showTimeframes?: boolean;
  showDrawingTools?: boolean;
  rightSlot?: ReactNode;
}

/** Top chrome: symbol, timeframe, chart type, drawings. */
export function TopBar({
  style,
  className,
  showChartType = true,
  showTimeframes = true,
  showDrawingTools = true,
  rightSlot,
}: TopBarProps) {
  const { selectedSymbol, userBalance, accountSummary } = useTrading();
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 10,
        padding: "8px 0",
        ...style,
      }}
      data-mt5="TopBar"
    >
      <CoinSelector />
      <strong style={{ fontSize: 14 }}>{selectedSymbol}</strong>
      {showTimeframes ? <TimeframeSelector /> : null}
      {showChartType ? <ChartTypeSelector /> : null}
      {showDrawingTools ? <DrawingTools showLabel={false} /> : null}
      <div style={{ marginLeft: "auto", fontSize: 12, opacity: 0.85 }}>
        Bal {fmt(accountSummary?.balance ?? userBalance, accountSummary?.currency)}
      </div>
      {rightSlot}
    </div>
  );
}

export interface LeftSidebarProps {
  style?: CSSProperties;
  className?: string;
  showMarketWatch?: boolean;
  showAccount?: boolean;
  showTrade?: boolean;
  children?: ReactNode;
}

/** Left navigation column with market watch / account / trade. */
export function LeftSidebar({
  style,
  className,
  showMarketWatch = true,
  showAccount = true,
  showTrade = true,
  children,
}: LeftSidebarProps) {
  return (
    <aside
      className={className}
      style={{ display: "grid", gap: 12, width: 260, ...style }}
      data-mt5="LeftSidebar"
    >
      {showMarketWatch ? <MarketWatch /> : null}
      {showAccount ? <AccountPanel /> : null}
      {showTrade ? <BuySellPanel /> : null}
      {children}
    </aside>
  );
}

export interface MarketExecutionModalProps {
  open: boolean;
  onClose: () => void;
  side?: "buy" | "sell";
  style?: CSSProperties;
  className?: string;
}

/** Modal for market order confirmation / execution. */
export function MarketExecutionModal({
  open,
  onClose,
  side = "buy",
  style,
  className,
}: MarketExecutionModalProps) {
  const { selectedSymbol, volume, placeTrade, currentSymbolData } = useTrading();
  const [busy, setBusy] = useState(false);
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(2,6,23,0.72)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{ ...panel, width: 360, ...style }}
        data-mt5="MarketExecutionModal"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <strong>
            {side.toUpperCase()} {selectedSymbol}
          </strong>
          <button type="button" style={btn} onClick={onClose}>
            ✕
          </button>
        </div>
        <Row label="Volume" value={String(volume)} />
        <Row
          label="Price"
          value={String(side === "buy" ? currentSymbolData?.ask ?? "—" : currentSymbolData?.bid ?? "—")}
        />
        <button
          type="button"
          style={{ ...(side === "buy" ? buyBtn : sellBtn), width: "100%", marginTop: 12 }}
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await placeTrade({ side });
              onClose();
            } finally {
              setBusy(false);
            }
          }}
        >
          Confirm {side}
        </button>
      </div>
    </div>
  );
}

export interface ToolCustomizationModalProps {
  open: boolean;
  onClose: () => void;
  style?: CSSProperties;
  className?: string;
}

/** Modal to tweak active drawing tool color / visibility defaults. */
export function ToolCustomizationModal({
  open,
  onClose,
  style,
  className,
}: ToolCustomizationModalProps) {
  const { activeTool, setActiveTool, drawingsVisible, setDrawingsVisible, showGrid, setShowGrid } =
    useTrading();
  const [color, setColor] = useState("#a78bfa");
  const tools: Array<Exclude<DrawingTool, null>> = useMemo(
    () => ["crosshair", "trendline", "channel", "fibonacci", "rectangle", "price-level"],
    [],
  );

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(2,6,23,0.72)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        className={className}
        style={{ ...panel, width: 380, ...style }}
        data-mt5="ToolCustomizationModal"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <strong>Tool settings</strong>
          <button type="button" style={btn} onClick={onClose}>
            ✕
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {tools.map((t) => (
            <button
              key={t}
              type="button"
              style={{ ...btn, background: activeTool === t ? "#3b82f6" : "#1e293b" }}
              onClick={() => setActiveTool(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          Color
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={drawingsVisible}
            onChange={(e) => setDrawingsVisible(e.target.checked)}
          />
          Drawings visible
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} />
          Show grid
        </label>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0" }}>
      <span style={{ opacity: 0.7 }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function fmt(n?: number | null, currency?: string): string {
  if (n === undefined || n === null || Number.isNaN(n)) return "—";
  const s = n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return currency ? `${s} ${currency}` : s;
}
