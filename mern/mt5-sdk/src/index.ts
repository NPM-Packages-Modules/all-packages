export const VERSION = "2.3.6";
/** Alias matching chart-sdk `version` export. */
export const version = VERSION;

export type {
  Timeframe,
  ChartType,
  DrawingTool,
  RiskMode,
  Candle,
  SymbolInfo,
  Order,
  AccountSummary,
  TradeRequest,
  TradeResponse,
  EndpointMap,
  Mt5SdkConfig,
  Mt5SdkConfigInput,
  CandlesQuery,
  ChartObject,
} from "./types.js";
export { DEFAULT_ENDPOINTS } from "./types.js";

export {
  setChartBaseUrl,
  setSocketBaseUrl,
  setEndpoints,
  setDefaultHeaders,
  getChartBaseUrl,
  getSocketBaseUrl,
  getEndpoints,
  resolveConfig,
} from "./config.js";

export { Mt5Client, Mt5ApiError, createMt5Client } from "./client.js";
export { Mt5Socket } from "./socket.js";
export type { Mt5SocketOptions, TickHandler, CandleTickHandler } from "./socket.js";

export {
  timeframeToSeconds,
  normalizeTime,
  alignToTimeframe,
  normalizeCandleTimes,
  processSingleCandle,
  processCandles,
  validateTimeOrdering,
  detectGaps,
} from "./utils/candles.js";

export {
  SYMBOL_CONFIG,
  getSymbolConfig,
  isCryptoSymbol,
  isForexSymbol,
  isMetalSymbol,
  is24x7Symbol,
  isWithinTradingSession,
  categorizeSymbols,
} from "./utils/symbols.js";

export {
  TradingProvider,
  useTrading,
  Chart,
  TradingToolbar,
  CoinSelector,
  VolumeControl,
  StopLoss,
  TakeProfit,
  RiskInput,
  DrawingTools,
  TimeframeSelector,
  AccountPanel,
  PositionsPanel,
  MarketWatch,
  BuySellPanel,
  TradePanel,
  ChartTypeSelector,
  TopBar,
  LeftSidebar,
  MarketExecutionModal,
  ToolCustomizationModal,
} from "./react/index.js";
export type {
  TradingProviderProps,
  TradingContextValue,
  ChartProps,
  TradingToolbarProps,
  CoinSelectorProps,
  VolumeControlProps,
  RiskInputProps,
  DrawingToolsProps,
  TimeframeSelectorProps,
  AccountPanelProps,
  PositionsPanelProps,
  MarketWatchProps,
  BuySellPanelProps,
  TradePanelProps,
  ChartTypeSelectorProps,
  TopBarProps,
  LeftSidebarProps,
  MarketExecutionModalProps,
  ToolCustomizationModalProps,
} from "./react/index.js";
