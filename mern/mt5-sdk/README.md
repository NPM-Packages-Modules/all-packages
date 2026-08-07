# mt5-sdkx

**Author:** [Aftab Ahmad Khan](https://github.com/aftab-ahmad-khan-dev)  
**Package:** [`mt5-sdkx`](https://www.npmjs.com/package/mt5-sdkx) · **Version:** `2.3.6`  
**Repo:** [NPM-Packages-Modules/mern](https://github.com/NPM-Packages-Modules/mern/tree/main/mt5-sdk)  
**License:** MIT

**Topics:** `candlestick` · `chart` · `lightweight-charts` · `mern-packages` · `merndev` · `mt5` · `mt5-sdk` · `nodejs` · `npm-pm` · `react` · `trading` · `typescript`

TradingView-style **MetaTrader 5** chart SDK for React / MERN. Drop-in style API compatible with `@nabeeltahirdeveloper/chart-sdk` (^2.3.8): `TradingProvider`, `Chart`, toolbar controls, trading panels, drawing tools, plus a headless REST/WebSocket client for your MT5 bridge backend.

> Published as **`mt5-sdkx`** because the unscoped name `mt5-sdk` is already taken on npm by an unrelated package.

---

## Install

```bash
npm install mt5-sdkx
```

### Peer dependencies

```bash
npm install react react-dom lightweight-charts
```

| Peer | Version |
| --- | --- |
| `react` | `>=17` |
| `react-dom` | `>=17` |
| `lightweight-charts` | `^4.1.0` (required for `<Chart />`) |

---

## Quick start

```jsx
import { TradingProvider, Chart, TradingToolbar } from "mt5-sdkx";

export default function App() {
  return (
    <TradingProvider baseUrl="https://your-api-url.com">
      <TradingToolbar />
      <Chart />
    </TradingProvider>
  );
}
```

### MT5 backend endpoints

```jsx
import { TradingProvider, Chart, TradingToolbar, TopBar, LeftSidebar } from "mt5-sdkx";

export default function Mt5Terminal() {
  return (
    <TradingProvider
      baseUrl="https://api-mt5-project.com"
      socketBaseUrl="wss://api-mt5-project.com"
      endpoints={{
        candles: "/api/v1/chart/candles",
        symbols: "/api/v1/symbols",
        trades: "/api/v1/trades",
        account: "/api/v1/user/account",
      }}
    >
      <TopBar />
      <div style={{ display: "flex", gap: 12 }}>
        <LeftSidebar />
        <div style={{ flex: 1 }}>
          <TradingToolbar />
          <Chart height={520} />
        </div>
      </div>
    </TradingProvider>
  );
}
```

---

## Package identity

| Field | Value |
| --- | --- |
| npm name | `mt5-sdkx` |
| folder | `mern/mt5-sdk` |
| version | `2.3.6` |
| author | Aftab Ahmad Khan |
| GitHub | https://github.com/aftab-ahmad-khan-dev |
| Monorepo package | https://github.com/NPM-Packages-Modules/mern/tree/main/mt5-sdk |
| Issues | https://github.com/NPM-Packages-Modules/mern/issues |

```ts
import { VERSION, version } from "mt5-sdkx";
console.log(VERSION, version); // "2.3.6"
```

---

## Components

All UI components must render inside `<TradingProvider>`.

### TradingProvider

Provides symbols, candles, orders, account, drawing state, and the HTTP client.

```jsx
<TradingProvider
  baseUrl="https://your-api-url.com"
  socketBaseUrl="wss://your-api-url.com"
  endpoints={{
    candles: "/api/chart/candles",
    symbols: "/api/symbols",
    trades: "/api/trades",
    account: "/api/user/account",
  }}
  headers={{ Authorization: "Bearer <token>" }}
  defaultSymbol="EURUSD"
  defaultTimeframe="15m"
>
  {children}
</TradingProvider>
```

| Prop | Type | Description |
| --- | --- | --- |
| `baseUrl` | `string` | Backend API origin. If omitted: `VITE_BASE_URL` or `http://localhost:8000` |
| `socketBaseUrl` | `string` | WebSocket origin (defaults from `baseUrl`) |
| `endpoints` | `Partial<EndpointMap>` | Override path map |
| `headers` | `Record<string,string>` | Extra HTTP headers (auth, tenant, etc.) |
| `defaultSymbol` | `string` | Initial symbol (`EURUSD`) |
| `defaultTimeframe` | `Timeframe` | Initial TF (`15m`) |
| `children` | `ReactNode` | App tree |

**Default endpoints**

```ts
{
  candles: "/api/chart/candles",
  symbols: "/api/symbols",
  trades: "/api/trades",
  account: "/api/user/account",
}
```

### Chart

Candlestick / bars / line / area chart with live updates and order price lines.

```jsx
<Chart height={480} className="mt5-chart" />
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `height` | `number` | `480` | Chart height (px) |
| `className` | `string` | — | CSS class |
| `style` | `CSSProperties` | — | Inline styles |

Requires peer `lightweight-charts`.

### TradingToolbar

One-row toolbar: symbol, volume, SL, TP, drawing tools.

```jsx
<TradingToolbar
  showCoinSelector
  showVolumeControl
  showStopLoss
  showTakeProfit
  showDrawingTools
  showDividers
  volume={0.1}
  onVolumeChange={setVolume}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `showCoinSelector` | `boolean` | `true` | Symbol selector |
| `showVolumeControl` | `boolean` | `true` | Lot size |
| `showStopLoss` | `boolean` | `true` | SL control |
| `showTakeProfit` | `boolean` | `true` | TP control |
| `showDrawingTools` | `boolean` | `true` | Drawing tools |
| `showDividers` | `boolean` | `true` | Section dividers |
| `volume` / `onVolumeChange` | controlled volume | — | Optional controlled mode |
| `stopLoss` / `onStopLossChange` / `stopLossEnabled` / `onStopLossEnabledChange` | SL state | — | Optional controlled |
| `takeProfit` / `onTakeProfitChange` / `takeProfitEnabled` / `onTakeProfitEnabledChange` | TP state | — | Optional controlled |
| `coinSelectorProps` / `volumeControlProps` / `stopLossProps` / `takeProfitProps` / `drawingToolsProps` | `object` | `{}` | Pass-through props |
| `style` / `className` | — | — | Styling |

### CoinSelector

Searchable Forex / Metals / Crypto symbol dropdown.

```jsx
<CoinSelector />
```

### VolumeControl

Lot-size stepper with presets (controlled or uncontrolled).

```jsx
const [volume, setVolume] = useState(0.1);
<VolumeControl value={volume} onChange={setVolume} min={0.01} max={100} step={0.01} />
```

| Prop | Type | Default |
| --- | --- | --- |
| `value` | `number` | — |
| `onChange` | `(n: number) => void` | — |
| `min` / `max` / `step` | `number` | `0.01` / `100` / `0.01` |
| `presets` | `number[]` | `[0.01, 0.05, 0.1, 0.5, 1.0]` |
| `showPresets` / `showLabel` | `boolean` | `true` |
| `label` | `string` | `"Vol"` |

### StopLoss / TakeProfit

Risk inputs with on/off toggle and price/pips mode.

```jsx
<StopLoss value={sl} onChange={setSl} enabled={slOn} onEnabledChange={setSlOn} />
<TakeProfit value={tp} onChange={setTp} enabled={tpOn} onEnabledChange={setTpOn} />
```

| Prop | Type | Default |
| --- | --- | --- |
| `value` | `string` | — |
| `onChange` | `(v: string) => void` | — |
| `enabled` / `onEnabledChange` | `boolean` / fn | — |
| `mode` / `onModeChange` | `"price" \| "pips"` | `"price"` |
| `showToggle` / `showModeSwitch` / `showLabel` | `boolean` | `true` |
| `label` | `string` | `"SL"` / `"TP"` |

### DrawingTools

Crosshair, Trend, Channel, Fibonacci, Rectangle, Price Level.

```jsx
<DrawingTools showLabel showDelete showVisibility />
```

### TimeframeSelector / ChartTypeSelector

```jsx
<TimeframeSelector />
<ChartTypeSelector /> {/* candles | bars | line | area */}
```

---

## Layout & trading panels

| Component | Role |
| --- | --- |
| `TopBar` | Symbol + timeframe + chart type + drawings + balance |
| `LeftSidebar` | Market watch + account + buy/sell column |
| `MarketWatch` | Bid/ask watchlist |
| `AccountPanel` | Balance, equity, margin, leverage |
| `BuySellPanel` | Market buy/sell with volume + SL/TP |
| `PositionsPanel` | Open orders with close action |
| `TradePanel` | CoinSelector + BuySellPanel + PositionsPanel |
| `MarketExecutionModal` | Confirm market order dialog |
| `ToolCustomizationModal` | Drawing tool / grid settings dialog |

```jsx
import {
  TradingProvider,
  TopBar,
  LeftSidebar,
  Chart,
  MarketExecutionModal,
  ToolCustomizationModal,
} from "mt5-sdkx";
import { useState } from "react";

function Terminal() {
  const [execOpen, setExecOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <TradingProvider baseUrl="https://api-mt5-project.com">
      <TopBar
        rightSlot={
          <>
            <button onClick={() => setToolsOpen(true)}>Tools</button>
            <button onClick={() => setExecOpen(true)}>Trade</button>
          </>
        }
      />
      <div style={{ display: "flex", gap: 12 }}>
        <LeftSidebar />
        <Chart height={560} />
      </div>
      <MarketExecutionModal open={execOpen} onClose={() => setExecOpen(false)} side="buy" />
      <ToolCustomizationModal open={toolsOpen} onClose={() => setToolsOpen(false)} />
    </TradingProvider>
  );
}
```

---

## Compose controls yourself

```jsx
import {
  TradingProvider,
  Chart,
  CoinSelector,
  VolumeControl,
  StopLoss,
  TakeProfit,
  DrawingTools,
} from "mt5-sdkx";
import { useState } from "react";

function App() {
  const [volume, setVolume] = useState(0.1);

  return (
    <TradingProvider baseUrl="https://your-api-url.com">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <CoinSelector />
        <VolumeControl value={volume} onChange={setVolume} />
        <StopLoss />
        <TakeProfit />
        <DrawingTools />
      </div>
      <Chart />
    </TradingProvider>
  );
}
```

---

## Hooks & globals

```jsx
import { useTrading, setChartBaseUrl, setSocketBaseUrl } from "mt5-sdkx";

const {
  selectedSymbol,
  setSelectedSymbol,
  selectedTimeframe,
  setSelectedTimeframe,
  symbols,
  symbolsLoading,
  candles,
  candlesLoading,
  orders,
  userBalance,
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
  placeTrade,
  refresh,
  client,
} = useTrading();
```

```ts
setChartBaseUrl("https://api-mt5-project.com");
setSocketBaseUrl("wss://api-mt5-project.com");
```

---

## Headless client (Node / Express / Next API)

Use without React for server routes, workers, or scripts.

```ts
import {
  Mt5Client,
  createMt5Client,
  processCandles,
  setChartBaseUrl,
  setEndpoints,
} from "mt5-sdkx";

setChartBaseUrl("https://api-mt5-project.com");
setEndpoints({
  candles: "/api/v1/chart/candles",
  symbols: "/api/v1/symbols",
  trades: "/api/v1/trades",
  account: "/api/v1/user/account",
});

const client = createMt5Client({
  headers: { Authorization: "Bearer <token>" },
});

const raw = await client.getCandles({ symbol: "EURUSD", timeframe: "15m", limit: 200 });
const candles = processCandles(raw);

const symbols = await client.getSymbols();
const account = await client.getAccount();
const orders = await client.getOrders();

await client.placeTrade({ symbol: "EURUSD", side: "buy", volume: 0.1 });
await client.closeOrder(orders[0].id);
```

### Expected backend shapes

**Candles** — array or `{ data: Candle[] }`

```json
[{ "time": 1710000000, "open": 1.08, "high": 1.09, "low": 1.07, "close": 1.085, "volume": 120 }]
```

**Symbols** — array or `{ data: SymbolInfo[] }`

```json
[{ "symbol": "EURUSD", "description": "Euro vs US Dollar", "bid": 1.0841, "ask": 1.0843 }]
```

**Account** — object or `{ data: AccountSummary }`

```json
{ "balance": 10000, "equity": 10025.5, "margin": 200, "freeMargin": 9825.5, "leverage": 100, "currency": "USD" }
```

**Trades** — GET list / POST place / DELETE `…/trades/:id` close

---

## WebSocket

```ts
import { Mt5Socket, setSocketBaseUrl } from "mt5-sdkx";

setSocketBaseUrl("wss://api-mt5-project.com");
const sock = new Mt5Socket();
sock.connect();
sock.subscribe("ticks", "EURUSD");
sock.subscribe("candles", "EURUSD");

sock.onTick((t) => console.log(t.symbol, t.bid, t.ask));
sock.onCandle((c) => console.log(c.time, c.close));
```

Message types understood: `tick` / `quote`, `candle` / `kline`.

---

## Utilities

### Candles

```ts
import {
  processCandles,
  processSingleCandle,
  normalizeTime,
  normalizeCandleTimes,
  alignToTimeframe,
  timeframeToSeconds,
  validateTimeOrdering,
  detectGaps,
} from "mt5-sdkx";
```

### Symbols

```ts
import {
  SYMBOL_CONFIG,
  getSymbolConfig,
  isForexSymbol,
  isCryptoSymbol,
  isMetalSymbol,
  is24x7Symbol,
  isWithinTradingSession,
  categorizeSymbols,
} from "mt5-sdkx";
```

---

## Full export map (chart-sdk parity + MT5 extras)

**React UI:** `TradingProvider`, `useTrading`, `Chart`, `TradingToolbar`, `CoinSelector`, `VolumeControl`, `StopLoss`, `TakeProfit`, `DrawingTools`, `TimeframeSelector`, `ChartTypeSelector`, `TopBar`, `LeftSidebar`, `MarketWatch`, `AccountPanel`, `BuySellPanel`, `PositionsPanel`, `TradePanel`, `MarketExecutionModal`, `ToolCustomizationModal`

**Config:** `setChartBaseUrl`, `setSocketBaseUrl`, `setEndpoints`, `setDefaultHeaders`, `getChartBaseUrl`, `getSocketBaseUrl`, `getEndpoints`, `DEFAULT_ENDPOINTS`

**Client:** `Mt5Client`, `createMt5Client`, `Mt5ApiError`, `Mt5Socket`

**Utils:** candle + symbol helpers above

**Meta:** `VERSION`, `version`

---

## TypeScript

```ts
import type {
  Candle,
  SymbolInfo,
  Order,
  AccountSummary,
  TradeRequest,
  Timeframe,
  ChartType,
  EndpointMap,
  TradingContextValue,
  Mt5SdkConfigInput,
} from "mt5-sdkx";
```

---

## Scripts (package maintainers)

```bash
cd mern/mt5-sdk
npm install
npm test
npm run build
npm run typecheck
npm publish   # publishes mt5-sdkx@2.3.6
```

---

## Compatibility note

Public component / hook / util names mirror `@nabeeltahirdeveloper/chart-sdk` ^2.3.8 so MT5 apps can migrate by swapping the import to `mt5-sdkx` and pointing `baseUrl` / `endpoints` at your MT5 bridge. This package is **original MIT software** by Aftab Ahmad Khan — not a republish of that package’s bundle.

---

## License

MIT © [Aftab Ahmad Khan](https://github.com/aftab-ahmad-khan-dev)
