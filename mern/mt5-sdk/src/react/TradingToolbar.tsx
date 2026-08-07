import { useState, type CSSProperties, type ReactNode } from "react";
import { CoinSelector, type CoinSelectorProps } from "./CoinSelector.js";
import { DrawingTools, type DrawingToolsProps } from "./DrawingTools.js";
import { StopLoss, TakeProfit } from "./RiskInputs.js";
import { VolumeControl, type VolumeControlProps } from "./VolumeControl.js";

export interface TradingToolbarProps {
  showCoinSelector?: boolean;
  showVolumeControl?: boolean;
  showStopLoss?: boolean;
  showTakeProfit?: boolean;
  showDrawingTools?: boolean;
  showDividers?: boolean;
  volume?: number;
  onVolumeChange?: (v: number) => void;
  stopLoss?: string;
  onStopLossChange?: (v: string) => void;
  stopLossEnabled?: boolean;
  onStopLossEnabledChange?: (v: boolean) => void;
  takeProfit?: string;
  onTakeProfitChange?: (v: string) => void;
  takeProfitEnabled?: boolean;
  onTakeProfitEnabledChange?: (v: boolean) => void;
  coinSelectorProps?: CoinSelectorProps;
  volumeControlProps?: Partial<VolumeControlProps>;
  stopLossProps?: Record<string, unknown>;
  takeProfitProps?: Record<string, unknown>;
  drawingToolsProps?: DrawingToolsProps;
  style?: CSSProperties;
  className?: string;
}

export function TradingToolbar({
  showCoinSelector = true,
  showVolumeControl = true,
  showStopLoss = true,
  showTakeProfit = true,
  showDrawingTools = true,
  showDividers = true,
  volume,
  onVolumeChange,
  stopLoss,
  onStopLossChange,
  stopLossEnabled,
  onStopLossEnabledChange,
  takeProfit,
  onTakeProfitChange,
  takeProfitEnabled,
  onTakeProfitEnabledChange,
  coinSelectorProps,
  volumeControlProps,
  stopLossProps,
  takeProfitProps,
  drawingToolsProps,
  style,
  className,
}: TradingToolbarProps) {
  const [sl, setSl] = useState(stopLoss ?? "");
  const [slOn, setSlOn] = useState(stopLossEnabled ?? false);
  const [tp, setTp] = useState(takeProfit ?? "");
  const [tpOn, setTpOn] = useState(takeProfitEnabled ?? false);

  const parts: ReactNode[] = [];
  if (showCoinSelector) parts.push(<CoinSelector key="coin" {...coinSelectorProps} />);
  if (showVolumeControl)
    parts.push(
      <VolumeControl
        key="vol"
        value={volume}
        onChange={onVolumeChange}
        {...volumeControlProps}
      />,
    );
  if (showStopLoss)
    parts.push(
      <StopLoss
        key="sl"
        value={stopLoss ?? sl}
        onChange={(v) => {
          setSl(v);
          onStopLossChange?.(v);
        }}
        enabled={stopLossEnabled ?? slOn}
        onEnabledChange={(v) => {
          setSlOn(v);
          onStopLossEnabledChange?.(v);
        }}
        {...stopLossProps}
      />,
    );
  if (showTakeProfit)
    parts.push(
      <TakeProfit
        key="tp"
        value={takeProfit ?? tp}
        onChange={(v) => {
          setTp(v);
          onTakeProfitChange?.(v);
        }}
        enabled={takeProfitEnabled ?? tpOn}
        onEnabledChange={(v) => {
          setTpOn(v);
          onTakeProfitEnabledChange?.(v);
        }}
        {...takeProfitProps}
      />,
    );
  if (showDrawingTools) parts.push(<DrawingTools key="draw" {...drawingToolsProps} />);

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
    >
      {parts.map((node, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          {i > 0 && showDividers ? <span style={{ width: 1, height: 20, background: "#334155" }} /> : null}
          {node}
        </span>
      ))}
    </div>
  );
}
