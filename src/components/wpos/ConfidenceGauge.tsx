/**
 * ConfidenceGauge — circular SVG progress indicator.
 *
 * Colour is derived from the score:
 *   >= 70 → green
 *   40–69 → amber
 *   < 40  → red
 *
 * Used wherever a hypothesis / preview / estimated confidence
 * needs a visual representation.
 */
export function ConfidenceGauge({
  value,
  size = 56,
  strokeWidth = 4,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const v = Math.max(0, Math.min(100, value ?? 0));
  const r = (size - strokeWidth * 2) / 2;
  const c = 2 * Math.PI * r;
  const dash = (v / 100) * c;
  const color =
    v >= 70 ? "#15803d" : v >= 40 ? "#b45309" : "#b91c1c";
  const bg = "#e2e8f0";
  return (
    <div
      className="relative inline-flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
      title={`Confidence: ${v}%`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={bg}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
        />
      </svg>
      <span
        className="absolute font-bold tabular-nums"
        style={{ fontSize: size * 0.28, color }}
      >
        {v}%
      </span>
    </div>
  );
}
