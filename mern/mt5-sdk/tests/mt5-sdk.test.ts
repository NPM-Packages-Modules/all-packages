import { describe, expect, it, vi } from "vitest";
import {
  Mt5Client,
  VERSION,
  version,
  alignToTimeframe,
  detectGaps,
  getSymbolConfig,
  isCryptoSymbol,
  isForexSymbol,
  isWithinTradingSession,
  normalizeTime,
  processCandles,
  timeframeToSeconds,
  validateTimeOrdering,
} from "../src/index.js";

describe("package version", () => {
  it("exports 2.3.6", () => {
    expect(VERSION).toBe("2.3.6");
    expect(version).toBe("2.3.6");
  });
});

describe("candle utils", () => {
  it("normalizes ms and seconds", () => {
    expect(normalizeTime(1_700_000_000)).toBe(1_700_000_000);
    expect(normalizeTime(1_700_000_000_000)).toBe(1_700_000_000);
  });

  it("aligns to timeframe", () => {
    expect(alignToTimeframe(1000, "1m")).toBe(960);
    expect(timeframeToSeconds("15m")).toBe(900);
  });

  it("processes and validates candles", () => {
    const candles = processCandles([
      { time: 300, open: 2, high: 3, low: 1, close: 2.5 },
      { time: 100, open: 1, high: 2, low: 0.5, close: 1.5 },
      { time: 200, open: 1.5, high: 2.5, low: 1, close: 2 },
    ]);
    expect(candles.map((c) => c.time)).toEqual([100, 200, 300]);
    expect(validateTimeOrdering(candles)).toBe(true);
    expect(detectGaps(candles, "1m")).toEqual([160, 260]);
  });
});

describe("symbols", () => {
  it("classifies symbols", () => {
    expect(isForexSymbol("EURUSD")).toBe(true);
    expect(isCryptoSymbol("BTCUSD")).toBe(true);
    expect(getSymbolConfig("XAUUSD").category).toBe("metals");
  });

  it("session check for crypto is always open", () => {
    expect(isWithinTradingSession("BTCUSD", new Date("2026-01-03T12:00:00Z"))).toBe(true);
  });
});

describe("Mt5Client", () => {
  it("fetches candles with query params", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      expect(String(url)).toContain("/api/v1/chart/candles");
      expect(String(url)).toContain("symbol=EURUSD");
      return {
        ok: true,
        text: async () =>
          JSON.stringify({
            data: [{ time: 100, open: 1, high: 2, low: 0.5, close: 1.5 }],
          }),
      };
    });

    const client = new Mt5Client({
      baseUrl: "https://api.example.com",
      endpoints: { candles: "/api/v1/chart/candles", symbols: "/s", trades: "/t", account: "/a" },
      fetch: fetchMock as unknown as typeof fetch,
    });

    const candles = await client.getCandles({ symbol: "EURUSD", timeframe: "15m", limit: 100 });
    expect(candles).toHaveLength(1);
    expect(candles[0]?.close).toBe(1.5);
  });

  it("places trades via POST", async () => {
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      expect(init?.method).toBe("POST");
      return {
        ok: true,
        text: async () =>
          JSON.stringify({
            ok: true,
            order: { id: "1", symbol: "EURUSD", side: "buy", volume: 0.1, openPrice: 1.1 },
          }),
      };
    });

    const client = new Mt5Client({
      baseUrl: "https://api.example.com",
      fetch: fetchMock as unknown as typeof fetch,
    });

    const res = await client.placeTrade({ symbol: "EURUSD", side: "buy", volume: 0.1 });
    expect(res.ok).toBe(true);
    expect(res.order?.id).toBe("1");
  });
});
