/**
 * MiniSparkline — tiny SVG line chart for trend indicators.
 *
 * Renders a series of values as an 80x24 px line with optional
 * area fill below. Colour comes from the trend prop:
 *   - "up"   → green
 *   - "down" → red
 *   - "flat" → slate
 *
 * Use on StatCards, table rows, or anywhere a quick trend
 * visualisation is needed.
 */
export function MiniSparkline({
  values,
  trend = "flat",
  width = 80,
  height = 24,
}: {
  values: number[];
  trend?: "up" | "down" | "flat";
  width?: number;
  height?: number;
}) {
  if (!values || values.length < 2) {
    return (
      <div
        className="bg-gray-100 dark:bg-gray-800 rounded inline-block"
        style={{ width, height }}
      />
    );
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const stroke =
    trend === "up"
      ? "#15803d"
      : trend === "down"
        ? "#b91c1c"
        : "#64748b";
  const fill =
    trend === "up"
      ? "rgba(21, 160, 77, 0.08)"
      : trend === "down"
        ? "rgba(185, 28, 28, 0.08)"
        : "rgba(100, 116, 139, 0.08)";
  const area = `0,${height} ${pts} ${width},${height}`;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="inline-block"
    >
      <polygon points={area} fill={fill} />
      <polyline
        points={pts}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
