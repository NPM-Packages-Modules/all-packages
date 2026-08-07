import { useEffect, useRef, type CSSProperties } from "react";
import { useTrading } from "./TradingProvider.js";

export interface ChartProps {
  height?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Candlestick chart backed by TradingProvider candles.
 * Requires peer dependency `lightweight-charts`.
 */
export function Chart({ height = 480, className, style }: ChartProps) {
  const { candles, chartType, showGrid, orders, drawingsVisible, chartObjects } = useTrading();
  const containerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seriesRef = useRef<any>(null);

  useEffect(() => {
    let disposed = false;
    let resizeObs: ResizeObserver | undefined;

    async function mount() {
      const el = containerRef.current;
      if (!el) return;

      let createChart: typeof import("lightweight-charts").createChart;
      try {
        ({ createChart } = await import("lightweight-charts"));
      } catch {
        el.textContent =
          "Install peer dependency: npm install lightweight-charts";
        return;
      }
      if (disposed || !containerRef.current) return;

      const chart = createChart(el, {
        width: el.clientWidth,
        height,
        layout: {
          background: { color: "#0b1220" },
          textColor: "#c9d1d9",
        },
        grid: {
          vertLines: { visible: showGrid, color: "#1f2a3a" },
          horzLines: { visible: showGrid, color: "#1f2a3a" },
        },
        timeScale: { borderColor: "#2a3648" },
        rightPriceScale: { borderColor: "#2a3648" },
      });
      chartRef.current = chart;

      const series =
        chartType === "area"
          ? chart.addAreaSeries({
              lineColor: "#3b82f6",
              topColor: "rgba(59,130,246,0.35)",
              bottomColor: "rgba(59,130,246,0.02)",
            })
          : chartType === "line"
            ? chart.addLineSeries({ color: "#3b82f6", lineWidth: 2 })
            : chartType === "bars"
              ? chart.addBarSeries({
                  upColor: "#22c55e",
                  downColor: "#ef4444",
                })
              : chart.addCandlestickSeries({
                  upColor: "#22c55e",
                  downColor: "#ef4444",
                  borderVisible: false,
                  wickUpColor: "#22c55e",
                  wickDownColor: "#ef4444",
                });
      seriesRef.current = series;

      resizeObs = new ResizeObserver(() => {
        if (containerRef.current) {
          chart.applyOptions({ width: containerRef.current.clientWidth });
        }
      });
      resizeObs.observe(el);
    }

    void mount();
    return () => {
      disposed = true;
      resizeObs?.disconnect();
      chartRef.current?.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [chartType, height, showGrid]);

  useEffect(() => {
    const series = seriesRef.current;
    if (!series || !candles.length) return;
    if (chartType === "line" || chartType === "area") {
      series.setData(candles.map((c) => ({ time: c.time as never, value: c.close })));
    } else {
      series.setData(
        candles.map((c) => ({
          time: c.time as never,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        })),
      );
    }
    chartRef.current?.timeScale().fitContent();
  }, [candles, chartType]);

  useEffect(() => {
    const series = seriesRef.current;
    if (!series?.createPriceLine) return;
    // Clear previous lines by remounting series data only — price lines are additive;
    // lightweight-charts has no remove-all, so we skip if drawings hidden.
    if (!drawingsVisible) return;
    for (const o of orders) {
      if (o.status && o.status !== "open") continue;
      series.createPriceLine({
        price: o.openPrice,
        color: o.side === "buy" ? "#22c55e" : "#ef4444",
        lineWidth: 1,
        lineStyle: 2,
        axisLabelVisible: true,
        title: `${o.side.toUpperCase()} ${o.volume}`,
      });
    }
    for (const obj of chartObjects) {
      if (obj.visible === false || !obj.points[0]) continue;
      series.createPriceLine({
        price: obj.points[0].price,
        color: obj.color ?? "#a78bfa",
        lineWidth: 1,
        title: obj.tool,
      });
    }
  }, [orders, chartObjects, drawingsVisible]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height, position: "relative", ...style }}
      data-mt5-chart
    />
  );
}
