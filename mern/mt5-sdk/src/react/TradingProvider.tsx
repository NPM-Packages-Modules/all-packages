import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Mt5Client } from "../client.js";
import { applyProviderConfig, setSocketBaseUrl } from "../config.js";
import { Mt5Socket } from "../socket.js";
import type {
  AccountSummary,
  Candle,
  ChartObject,
  ChartType,
  DrawingTool,
  EndpointMap,
  Order,
  SymbolInfo,
  Timeframe,
  TradeRequest,
} from "../types.js";
import { processCandles } from "../utils/candles.js";

export interface TradingContextValue {
  client: Mt5Client;
  selectedSymbol: string;
  setSelectedSymbol: (s: string) => void;
  selectedTimeframe: Timeframe;
  setSelectedTimeframe: (t: Timeframe) => void;
  symbols: SymbolInfo[];
  symbolsLoading: boolean;
  candles: Candle[];
  candlesLoading: boolean;
  orders: Order[];
  userBalance: number;
  accountSummary: AccountSummary | null;
  currentSymbolData: SymbolInfo | null;
  activeTool: DrawingTool;
  setActiveTool: (t: DrawingTool) => void;
  chartObjects: ChartObject[];
  setChartObjects: (objs: ChartObject[] | ((prev: ChartObject[]) => ChartObject[])) => void;
  drawingsVisible: boolean;
  setDrawingsVisible: (v: boolean) => void;
  showGrid: boolean;
  setShowGrid: (v: boolean) => void;
  chartType: ChartType;
  setChartType: (t: ChartType) => void;
  volume: number;
  setVolume: (v: number) => void;
  refresh: () => Promise<void>;
  placeTrade: (trade: Omit<TradeRequest, "symbol" | "volume"> & Partial<TradeRequest>) => Promise<void>;
}

const TradingContext = createContext<TradingContextValue | null>(null);

export interface TradingProviderProps {
  baseUrl?: string;
  socketBaseUrl?: string;
  endpoints?: Partial<EndpointMap>;
  headers?: Record<string, string>;
  defaultSymbol?: string;
  defaultTimeframe?: Timeframe;
  children: ReactNode;
}

export function TradingProvider({
  baseUrl,
  socketBaseUrl,
  endpoints,
  headers,
  defaultSymbol = "EURUSD",
  defaultTimeframe = "15m",
  children,
}: TradingProviderProps) {
  const cfg = useMemo(
    () => applyProviderConfig({ baseUrl, socketBaseUrl, endpoints, headers }),
    [baseUrl, socketBaseUrl, endpoints, headers],
  );

  const client = useMemo(() => new Mt5Client(cfg), [cfg]);

  const [selectedSymbol, setSelectedSymbol] = useState(defaultSymbol);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>(defaultTimeframe);
  const [symbols, setSymbols] = useState<SymbolInfo[]>([]);
  const [symbolsLoading, setSymbolsLoading] = useState(true);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [candlesLoading, setCandlesLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [accountSummary, setAccountSummary] = useState<AccountSummary | null>(null);
  const [activeTool, setActiveTool] = useState<DrawingTool>("crosshair");
  const [chartObjects, setChartObjects] = useState<ChartObject[]>([]);
  const [drawingsVisible, setDrawingsVisible] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [chartType, setChartType] = useState<ChartType>("candles");
  const [volume, setVolume] = useState(0.1);

  const refresh = useCallback(async () => {
    setSymbolsLoading(true);
    setCandlesLoading(true);
    try {
      const [syms, cnds, ords, acct] = await Promise.all([
        client.getSymbols().catch(() => [] as SymbolInfo[]),
        client
          .getCandles({ symbol: selectedSymbol, timeframe: selectedTimeframe, limit: 500 })
          .catch(() => [] as Candle[]),
        client.getOrders().catch(() => [] as Order[]),
        client.getAccount().catch(() => null),
      ]);
      setSymbols(syms);
      setCandles(processCandles(cnds));
      setOrders(ords);
      setAccountSummary(acct);
    } finally {
      setSymbolsLoading(false);
      setCandlesLoading(false);
    }
  }, [client, selectedSymbol, selectedTimeframe]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (socketBaseUrl) setSocketBaseUrl(socketBaseUrl);
    const sock = new Mt5Socket({ url: cfg.socketBaseUrl ?? cfg.baseUrl.replace(/^http/, "ws") });
    try {
      sock.connect();
      sock.subscribe("ticks", selectedSymbol);
      sock.subscribe("candles", selectedSymbol);
    } catch {
      /* websocket may be unavailable in SSR / tests */
    }
    const offTick = sock.onTick((tick) => {
      if (tick.symbol !== selectedSymbol) return;
      setSymbols((prev) =>
        prev.map((s) =>
          s.symbol === tick.symbol
            ? { ...s, bid: tick.bid, ask: tick.ask, spread: +(tick.ask - tick.bid).toFixed(5) }
            : s,
        ),
      );
    });
    const offCandle = sock.onCandle((c) => {
      if (c.symbol !== selectedSymbol) return;
      setCandles((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last && last.time === c.time) {
          next[next.length - 1] = {
            time: c.time,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
            volume: c.volume,
          };
        } else if (!last || c.time > last.time) {
          next.push({
            time: c.time,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
            volume: c.volume,
          });
        }
        return next;
      });
    });
    return () => {
      offTick();
      offCandle();
      sock.close();
    };
  }, [cfg.baseUrl, cfg.socketBaseUrl, selectedSymbol, socketBaseUrl]);

  const placeTrade = useCallback(
    async (trade: Omit<TradeRequest, "symbol" | "volume"> & Partial<TradeRequest>) => {
      await client.placeTrade({
        symbol: trade.symbol ?? selectedSymbol,
        volume: trade.volume ?? volume,
        side: trade.side ?? "buy",
        stopLoss: trade.stopLoss,
        takeProfit: trade.takeProfit,
        type: trade.type ?? "market",
        price: trade.price,
      });
      const ords = await client.getOrders().catch(() => [] as Order[]);
      setOrders(ords);
    },
    [client, selectedSymbol, volume],
  );

  const currentSymbolData = useMemo(
    () => symbols.find((s) => s.symbol === selectedSymbol) ?? null,
    [symbols, selectedSymbol],
  );

  const value: TradingContextValue = {
    client,
    selectedSymbol,
    setSelectedSymbol,
    selectedTimeframe,
    setSelectedTimeframe,
    symbols,
    symbolsLoading,
    candles,
    candlesLoading,
    orders,
    userBalance: accountSummary?.balance ?? 0,
    accountSummary,
    currentSymbolData,
    activeTool,
    setActiveTool,
    chartObjects,
    setChartObjects,
    drawingsVisible,
    setDrawingsVisible,
    showGrid,
    setShowGrid,
    chartType,
    setChartType,
    volume,
    setVolume,
    refresh,
    placeTrade,
  };

  return <TradingContext.Provider value={value}>{children}</TradingContext.Provider>;
}

export function useTrading(): TradingContextValue {
  const ctx = useContext(TradingContext);
  if (!ctx) {
    throw new Error("useTrading() must be used within <TradingProvider>");
  }
  return ctx;
}
