import type { EndpointMap, Mt5SdkConfig, Mt5SdkConfigInput } from "./types.js";
import { DEFAULT_ENDPOINTS } from "./types.js";

let chartBaseUrl = "http://localhost:8000";
let socketBaseUrl = "ws://localhost:8000";
let endpoints: EndpointMap = { ...DEFAULT_ENDPOINTS };
let defaultHeaders: Record<string, string> = {};

export function setChartBaseUrl(url: string): void {
  chartBaseUrl = url.replace(/\/$/, "");
}

export function setSocketBaseUrl(url: string): void {
  socketBaseUrl = url.replace(/\/$/, "");
}

export function setEndpoints(partial: Partial<EndpointMap>): void {
  endpoints = { ...endpoints, ...partial };
}

export function setDefaultHeaders(headers: Record<string, string>): void {
  defaultHeaders = { ...headers };
}

export function getChartBaseUrl(): string {
  return chartBaseUrl;
}

export function getSocketBaseUrl(): string {
  return socketBaseUrl;
}

export function getEndpoints(): EndpointMap {
  return { ...endpoints };
}

export function getDefaultHeaders(): Record<string, string> {
  return { ...defaultHeaders };
}

export function resolveConfig(partial?: Mt5SdkConfigInput): Mt5SdkConfig {
  const envBase =
    typeof process !== "undefined" && process.env?.["VITE_BASE_URL"]
      ? process.env["VITE_BASE_URL"]
      : undefined;

  return {
    baseUrl: (partial?.baseUrl ?? chartBaseUrl ?? envBase ?? "http://localhost:8000").replace(
      /\/$/,
      "",
    ),
    socketBaseUrl: (partial?.socketBaseUrl ?? socketBaseUrl).replace(/\/$/, ""),
    endpoints: { ...DEFAULT_ENDPOINTS, ...endpoints, ...partial?.endpoints },
    headers: { ...defaultHeaders, ...partial?.headers },
    fetch: partial?.fetch,
  };
}

export function applyProviderConfig(cfg: Mt5SdkConfigInput): Mt5SdkConfig {
  const resolved = resolveConfig(cfg);
  setChartBaseUrl(resolved.baseUrl);
  if (resolved.socketBaseUrl) setSocketBaseUrl(resolved.socketBaseUrl);
  setEndpoints(resolved.endpoints);
  if (resolved.headers) setDefaultHeaders(resolved.headers);
  return resolved;
}
