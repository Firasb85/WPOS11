/**
 * Sparkline — minimal inline SVG trend chart.
 * Highlights downward trends in red.
 */

interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  isDowntrend?: boolean;
}

export function Sparkline({
  values,
  width = 80,
  height = 24,
  isDowntrend = false,
}: SparklineProps) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 2;

  const points = values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (width - pad * 2);
      const y = pad + (1 - (v - min) / range) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const color = isDowntrend ? "#ef4444" : "#22c55e";
  const lastPoint = values[values.length - 1];
  const lastX = width - pad;
  const lastY = pad + (1 - (lastPoint - min) / range) * (height - pad * 2);

  return (
    <svg
      width={width}
      height={height}
      className="inline-block"
      aria-label={`Trend: ${values.join(", ")}`}
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r={2.5} fill={color} />
    </svg>
  );
}

/**
 * Detect if a KPI has a downward trend over 3+ consecutive periods.
 */
export function detectDowntrend(values: number[]): boolean {
  if (values.length < 3) return false;
  // Check last 3 values (most recent first)
  for (let i = 0; i < values.length - 2; i++) {
    if (values[i] < values[i + 1] && values[i + 1] < values[i + 2]) {
      return true;
    }
  }
  return false;
}
