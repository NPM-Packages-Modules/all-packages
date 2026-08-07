/** Shared MT5 trading types. */

export type Timeframe =
  | "1m"
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "4h"
  | "1d"
  | "1w"
  | "1M";

export type ChartType = "candles" | "bars" | "line" | "area";

export type DrawingTool =
  | "crosshair"
  | "trendline"
  | "channel"
  | "fibonacci"
  | "rectangle"
  | "price-level"
  | null;

export type RiskMode = "price" | "pips";

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface SymbolInfo {
  symbol: string;
  description?: string;
  digits?: number;
  category?: "forex" | "metals" | "crypto" | "indices" | "other";
  bid?: number;
  ask?: number;
  spread?: number;
}

export interface Order {
  id: string;
  symbol: string;
  side: "buy" | "sell";
  volume: number;
  openPrice: number;
  stopLoss?: number | null;
  takeProfit?: number | null;
  status?: "open" | "closed" | "pending";
  openedAt?: number;
}

export interface AccountSummary {
  balance: number;
  equity: number;
  margin?: number;
  freeMargin?: number;
  leverage?: number;
  currency?: string;
}

export interface TradeRequest {
  symbol: string;
  side: "buy" | "sell";
  volume: number;
  stopLoss?: number | null;
  takeProfit?: number | null;
  type?: "market" | "limit" | "stop";
  price?: number;
}

export interface TradeResponse {
  ok: boolean;
  order?: Order;
  message?: string;
}

export interface EndpointMap {
  candles: string;
  symbols: string;
  trades: string;
  account: string;
}

export interface Mt5SdkConfig {
  baseUrl: string;
  socketBaseUrl?: string;
  endpoints: EndpointMap;
  headers?: Record<string, string>;
  fetch?: typeof fetch;
}

export type Mt5SdkConfigInput = Omit<Partial<Mt5SdkConfig>, "endpoints"> & {
  endpoints?: Partial<EndpointMap>;
};

export interface CandlesQuery {
  symbol: string;
  timeframe: Timeframe;
  limit?: number;
  from?: number;
  to?: number;
}

export interface ChartObject {
  id: string;
  tool: Exclude<DrawingTool, null>;
  points: Array<{ time: number; price: number }>;
  color?: string;
  visible?: boolean;
}

export const DEFAULT_ENDPOINTS: EndpointMap = {
  candles: "/api/chart/candles",
  symbols: "/api/symbols",
  trades: "/api/trades",
  account: "/api/user/account",
};
