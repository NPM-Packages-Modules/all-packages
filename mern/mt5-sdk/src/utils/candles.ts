import type { Candle, Timeframe } from "../types.js";

const TF_SECONDS: Record<Timeframe, number> = {
  "1m": 60,
  "5m": 300,
  "15m": 900,
  "30m": 1800,
  "1h": 3600,
  "4h": 14400,
  "1d": 86400,
  "1w": 604800,
  "1M": 2592000,
};

export function timeframeToSeconds(tf: Timeframe): number {
  return TF_SECONDS[tf] ?? 60;
}

/** Normalize unix seconds / ms / ISO-ish values to unix seconds. */
export function normalizeTime(value: number | string): number {
  if (typeof value === "string") {
    const n = Number(value);
    if (!Number.isNaN(n)) return normalizeTime(n);
    const ms = Date.parse(value);
    return Number.isNaN(ms) ? 0 : Math.floor(ms / 1000);
  }
  if (value > 1e12) return Math.floor(value / 1000);
  return Math.floor(value);
}

export function alignToTimeframe(unixSeconds: number, timeframe: Timeframe): number {
  const step = timeframeToSeconds(timeframe);
  return Math.floor(unixSeconds / step) * step;
}

export function normalizeCandleTimes(candles: Candle[]): Candle[] {
  return candles.map((c) => ({ ...c, time: normalizeTime(c.time) }));
}

export function processSingleCandle(c: Candle): Candle | null {
  const time = normalizeTime(c.time);
  const open = Number(c.open);
  const high = Number(c.high);
  const low = Number(c.low);
  const close = Number(c.close);
  if (![time, open, high, low, close].every(Number.isFinite)) return null;
  return {
    time,
    open,
    high: Math.max(high, open, close),
    low: Math.min(low, open, close),
    close,
    volume: c.volume === undefined ? undefined : Number(c.volume),
  };
}

export function processCandles(candles: Candle[]): Candle[] {
  const out: Candle[] = [];
  for (const c of candles) {
    const n = processSingleCandle(c);
    if (n) out.push(n);
  }
  return out.sort((a, b) => a.time - b.time);
}

export function validateTimeOrdering(candles: Candle[]): boolean {
  for (let i = 1; i < candles.length; i++) {
    const prev = candles[i - 1];
    const cur = candles[i];
    if (!prev || !cur || cur.time <= prev.time) return false;
  }
  return true;
}

export function detectGaps(candles: Candle[], timeframe: Timeframe): number[] {
  const step = timeframeToSeconds(timeframe);
  const gaps: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    const prev = candles[i - 1];
    const cur = candles[i];
    if (!prev || !cur) continue;
    const expected = prev.time + step;
    if (cur.time > expected) gaps.push(expected);
  }
  return gaps;
}
