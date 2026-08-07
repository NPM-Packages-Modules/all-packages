import type { SymbolInfo } from "../types.js";

const CRYPTO = /^(BTC|ETH|BNB|XRP|SOL|ADA|DOGE|DOT|AVAX|MATIC|LINK|LTC|SHIB|TRX|UNI)/i;
const METALS = /^(XAU|XAG|XPT|XPD|GOLD|SILVER)/i;
const FOREX =
  /^(EUR|GBP|USD|JPY|AUD|NZD|CAD|CHF|SEK|NOK|DKK|TRY|ZAR|MXN|SGD|HKD){2}$/i;

export const SYMBOL_CONFIG: Record<string, { digits: number; category: SymbolInfo["category"] }> = {
  EURUSD: { digits: 5, category: "forex" },
  GBPUSD: { digits: 5, category: "forex" },
  USDJPY: { digits: 3, category: "forex" },
  XAUUSD: { digits: 2, category: "metals" },
  XAGUSD: { digits: 3, category: "metals" },
  BTCUSD: { digits: 2, category: "crypto" },
  ETHUSD: { digits: 2, category: "crypto" },
};

export function getSymbolConfig(symbol: string): {
  digits: number;
  category: SymbolInfo["category"];
} {
  const key = symbol.replace(/[^A-Za-z]/g, "").toUpperCase();
  const known = SYMBOL_CONFIG[key];
  if (known) return known;
  if (isCryptoSymbol(symbol)) return { digits: 2, category: "crypto" };
  if (isMetalSymbol(symbol)) return { digits: 2, category: "metals" };
  if (isForexSymbol(symbol)) return { digits: 5, category: "forex" };
  return { digits: 5, category: "other" };
}

export function isCryptoSymbol(symbol: string): boolean {
  return CRYPTO.test(symbol.replace(/[^A-Za-z]/g, ""));
}

export function isForexSymbol(symbol: string): boolean {
  const s = symbol.replace(/[^A-Za-z]/g, "").toUpperCase();
  return FOREX.test(s) && !isCryptoSymbol(s) && !isMetalSymbol(s);
}

export function isMetalSymbol(symbol: string): boolean {
  return METALS.test(symbol.replace(/[^A-Za-z]/g, ""));
}

/** 24×7 markets (crypto) vs session-based FX/metals. */
export function is24x7Symbol(symbol: string): boolean {
  return isCryptoSymbol(symbol);
}

/**
 * Rough weekday UTC session check for FX (Sun 22:00 – Fri 22:00 UTC).
 * Crypto always returns true.
 */
export function isWithinTradingSession(symbol: string, at: Date = new Date()): boolean {
  if (is24x7Symbol(symbol)) return true;
  const day = at.getUTCDay(); // 0 Sun … 6 Sat
  const minutes = at.getUTCHours() * 60 + at.getUTCMinutes();
  if (day === 6) return false; // Saturday
  if (day === 0) return minutes >= 22 * 60; // Sunday after 22:00
  if (day === 5) return minutes < 22 * 60; // Friday before 22:00
  return true;
}

export function categorizeSymbols(symbols: SymbolInfo[]): {
  forex: SymbolInfo[];
  metals: SymbolInfo[];
  crypto: SymbolInfo[];
  other: SymbolInfo[];
} {
  const forex: SymbolInfo[] = [];
  const metals: SymbolInfo[] = [];
  const crypto: SymbolInfo[] = [];
  const other: SymbolInfo[] = [];
  for (const s of symbols) {
    const cat = s.category ?? getSymbolConfig(s.symbol).category;
    if (cat === "forex") forex.push(s);
    else if (cat === "metals") metals.push(s);
    else if (cat === "crypto") crypto.push(s);
    else other.push(s);
  }
  return { forex, metals, crypto, other };
}
