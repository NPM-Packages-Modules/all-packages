import { getSocketBaseUrl } from "./config.js";

export type TickHandler = (tick: {
  symbol: string;
  bid: number;
  ask: number;
  time: number;
}) => void;

export type CandleTickHandler = (candle: {
  symbol: string;
  timeframe: string;
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}) => void;

export interface Mt5SocketOptions {
  url?: string;
  protocols?: string | string[];
  reconnectMs?: number;
  WebSocketImpl?: typeof WebSocket;
}

/**
 * Lightweight WebSocket helper for MT5 bridge tick / candle streams.
 * Expects JSON messages: `{ type: 'tick'|'candle', ...payload }`.
 */
export class Mt5Socket {
  private ws: WebSocket | null = null;
  private readonly url: string;
  private readonly protocols?: string | string[];
  private readonly reconnectMs: number;
  private readonly WS: typeof WebSocket;
  private closedByUser = false;
  private tickHandlers = new Set<TickHandler>();
  private candleHandlers = new Set<CandleTickHandler>();

  constructor(opts: Mt5SocketOptions = {}) {
    this.url = opts.url ?? getSocketBaseUrl();
    this.protocols = opts.protocols;
    this.reconnectMs = opts.reconnectMs ?? 2000;
    this.WS = opts.WebSocketImpl ?? WebSocket;
  }

  connect(): void {
    this.closedByUser = false;
    if (this.ws && (this.ws.readyState === this.WS.OPEN || this.ws.readyState === this.WS.CONNECTING)) {
      return;
    }
    this.ws = this.protocols
      ? new this.WS(this.url, this.protocols)
      : new this.WS(this.url);

    this.ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(String(ev.data)) as Record<string, unknown>;
        const type = data.type ?? data.event;
        if (type === "tick" || type === "quote") {
          for (const h of this.tickHandlers) {
            h({
              symbol: String(data.symbol ?? ""),
              bid: Number(data.bid ?? data.price ?? 0),
              ask: Number(data.ask ?? data.price ?? 0),
              time: Number(data.time ?? Date.now() / 1000),
            });
          }
        } else if (type === "candle" || type === "kline") {
          for (const h of this.candleHandlers) {
            h({
              symbol: String(data.symbol ?? ""),
              timeframe: String(data.timeframe ?? data.interval ?? "1m"),
              time: Number(data.time ?? 0),
              open: Number(data.open ?? 0),
              high: Number(data.high ?? 0),
              low: Number(data.low ?? 0),
              close: Number(data.close ?? 0),
              volume: data.volume === undefined ? undefined : Number(data.volume),
            });
          }
        }
      } catch {
        /* ignore malformed */
      }
    };

    this.ws.onclose = () => {
      this.ws = null;
      if (!this.closedByUser) {
        setTimeout(() => this.connect(), this.reconnectMs);
      }
    };
  }

  subscribe(channel: string, symbol?: string): void {
    this.send({ action: "subscribe", channel, symbol });
  }

  unsubscribe(channel: string, symbol?: string): void {
    this.send({ action: "unsubscribe", channel, symbol });
  }

  onTick(handler: TickHandler): () => void {
    this.tickHandlers.add(handler);
    return () => this.tickHandlers.delete(handler);
  }

  onCandle(handler: CandleTickHandler): () => void {
    this.candleHandlers.add(handler);
    return () => this.candleHandlers.delete(handler);
  }

  send(payload: unknown): void {
    if (this.ws?.readyState === this.WS.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  close(): void {
    this.closedByUser = true;
    this.ws?.close();
    this.ws = null;
  }
}
