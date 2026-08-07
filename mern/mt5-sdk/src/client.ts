import { getChartBaseUrl, getDefaultHeaders, getEndpoints, resolveConfig } from "./config.js";
import type {
  AccountSummary,
  Candle,
  CandlesQuery,
  Mt5SdkConfig,
  Mt5SdkConfigInput,
  Order,
  SymbolInfo,
  TradeRequest,
  TradeResponse,
} from "./types.js";

export class Mt5ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "Mt5ApiError";
    this.status = status;
    this.body = body;
  }
}

function joinUrl(base: string, path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

function toQuery(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const o = payload as Record<string, unknown>;
    for (const key of ["data", "candles", "symbols", "orders", "trades", "results"]) {
      if (Array.isArray(o[key])) return o[key] as T[];
    }
  }
  return [];
}

function unwrapObject<T>(payload: unknown): T | null {
  if (!payload || typeof payload !== "object") return null;
  const o = payload as Record<string, unknown>;
  if ("data" in o && o.data && typeof o.data === "object") return o.data as T;
  return payload as T;
}

/**
 * HTTP client for MT5 bridge backends (candles, symbols, trades, account).
 * Endpoint paths match the chart-sdk style so existing MT5 APIs plug in cleanly.
 */
export class Mt5Client {
  private readonly cfg: Mt5SdkConfig;
  private readonly http: typeof fetch;

  constructor(config?: Mt5SdkConfigInput) {
    this.cfg = resolveConfig(config);
    this.http = this.cfg.fetch ?? globalThis.fetch.bind(globalThis);
  }

  get baseUrl(): string {
    return this.cfg.baseUrl;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    query?: Record<string, string | number | undefined>,
  ): Promise<T> {
    const url = joinUrl(this.cfg.baseUrl, path) + (query ? toQuery(query) : "");
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...this.cfg.headers,
    };
    let payload: string | undefined;
    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }

    const res = await this.http(url, { method, headers, body: payload });
    const text = await res.text();
    let json: unknown = null;
    if (text) {
      try {
        json = JSON.parse(text);
      } catch {
        json = text;
      }
    }
    if (!res.ok) {
      const msg =
        json && typeof json === "object" && "message" in json
          ? String((json as { message: unknown }).message)
          : `HTTP ${res.status}`;
      throw new Mt5ApiError(msg, res.status, json);
    }
    return json as T;
  }

  async getCandles(query: CandlesQuery): Promise<Candle[]> {
    const raw = await this.request<unknown>("GET", this.cfg.endpoints.candles, undefined, {
      symbol: query.symbol,
      timeframe: query.timeframe,
      limit: query.limit,
      from: query.from,
      to: query.to,
    });
    return unwrapList<Candle>(raw).map(normalizeCandle);
  }

  async getSymbols(): Promise<SymbolInfo[]> {
    const raw = await this.request<unknown>("GET", this.cfg.endpoints.symbols);
    return unwrapList<SymbolInfo>(raw);
  }

  async getAccount(): Promise<AccountSummary | null> {
    const raw = await this.request<unknown>("GET", this.cfg.endpoints.account);
    return unwrapObject<AccountSummary>(raw);
  }

  async getOrders(): Promise<Order[]> {
    const raw = await this.request<unknown>("GET", this.cfg.endpoints.trades);
    return unwrapList<Order>(raw);
  }

  async placeTrade(trade: TradeRequest): Promise<TradeResponse> {
    const raw = await this.request<unknown>("POST", this.cfg.endpoints.trades, trade);
    const data = unwrapObject<TradeResponse & { order?: Order }>(raw);
    if (!data) return { ok: false, message: "Empty response" };
    if ("ok" in data) return data as TradeResponse;
    return { ok: true, order: (data as { order?: Order }).order ?? (data as unknown as Order) };
  }

  async closeOrder(orderId: string): Promise<TradeResponse> {
    const path = `${this.cfg.endpoints.trades}/${encodeURIComponent(orderId)}`;
    const raw = await this.request<unknown>("DELETE", path);
    const data = unwrapObject<TradeResponse>(raw);
    return data ?? { ok: true };
  }
}

function normalizeCandle(c: Candle): Candle {
  return {
    time: Number(c.time),
    open: Number(c.open),
    high: Number(c.high),
    low: Number(c.low),
    close: Number(c.close),
    volume: c.volume === undefined ? undefined : Number(c.volume),
  };
}

/** Convenience helpers using module-level base URL / endpoints. */
export function createMt5Client(config?: Mt5SdkConfigInput): Mt5Client {
  return new Mt5Client({
    baseUrl: config?.baseUrl ?? getChartBaseUrl(),
    endpoints: { ...getEndpoints(), ...config?.endpoints },
    headers: { ...getDefaultHeaders(), ...config?.headers },
    socketBaseUrl: config?.socketBaseUrl,
    fetch: config?.fetch,
  });
}
