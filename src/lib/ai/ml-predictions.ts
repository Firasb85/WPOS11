/**
 * WPOS Prediction Engine.
 *
 * Statistical forecasting for workforce performance.
 * Uses linear regression, moving averages, and anomaly detection.
 * No external ML libraries required — pure TypeScript math.
 *
 * NOTE: Framed in product copy as the "Predictive Insights" capability.
 * Deterministic, explainable, and does NOT depend on any LLM.
 */

export interface PredictionResult {
  employeeId: string;
  employeeName: string;
  kpiName: string;
  currentValue: number;
  targetValue: number;
  predictedNextValue: number;
  predictedGap: number;
  breachProbability: number;
  trend: "improving" | "stable" | "declining" | "critical";
  trendVelocity: number; // change per period
  anomalyScore: number; // 0-100, higher = more anomalous
  forecastPeriods: { period: string; predicted: number; lower: number; upper: number }[];
  confidence: number;
  riskFactors: string[];
}

interface DataPoint {
  period: string;
  actual: number;
  target: number;
  gap: number;
}

/**
 * Linear regression: y = mx + b
 */
function linearRegression(points: number[]): { slope: number; intercept: number; r2: number } {
  const n = points.length;
  if (n < 2) return { slope: 0, intercept: points[0] ?? 0, r2: 0 };

  const xs = points.map((_, i) => i);
  const sumX = xs.reduce((s, x) => s + x, 0);
  const sumY = points.reduce((s, y) => s + y, 0);
  const sumXY = xs.reduce((s, x, i) => s + x * points[i], 0);
  const sumX2 = xs.reduce((s, x) => s + x * x, 0);
  const sumY2 = points.reduce((s, y) => s + y * y, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // R-squared (goodness of fit)
  const meanY = sumY / n;
  const ssTotal = points.reduce((s, y) => s + (y - meanY) ** 2, 0);
  const ssResidual = points.reduce((s, y, i) => s + (y - (slope * i + intercept)) ** 2, 0);
  const r2 = ssTotal > 0 ? 1 - ssResidual / ssTotal : 0;

  return { slope, intercept, r2 };
}

/**
 * Exponential Moving Average (gives more weight to recent data)
 */
function ema(values: number[], alpha = 0.3): number {
  if (values.length === 0) return 0;
  let result = values[0];
  for (let i = 1; i < values.length; i++) {
    result = alpha * values[i] + (1 - alpha) * result;
  }
  return result;
}

/**
 * Standard deviation
 */
function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  return Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / (values.length - 1));
}

/**
 * Z-score anomaly detection
 */
function anomalyScore(value: number, values: number[]): number {
  if (values.length < 3) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const sd = stdDev(values);
  if (sd === 0) return 0;
  const zScore = Math.abs((value - mean) / sd);
  return Math.min(100, Math.round(zScore * 30)); // Scale to 0-100
}

/**
 * Generate predictions for an employee's KPI performance.
 */
export function predictPerformance(
  employeeId: string,
  employeeName: string,
  kpiName: string,
  dataPoints: DataPoint[],
  periodsAhead = 3,
): PredictionResult {
  const actuals = dataPoints.map((d) => d.actual);
  const targets = dataPoints.map((d) => d.target);
  const gaps = dataPoints.map((d) => d.gap);

  // Linear regression on actuals
  const reg = linearRegression(actuals);
  const currentValue = actuals[actuals.length - 1] ?? 0;
  const targetValue = targets[targets.length - 1] ?? 100;

  // Predict next value
  const nextIdx = actuals.length;
  const predictedNext = reg.slope * nextIdx + reg.intercept;
  const predictedGap = ((predictedNext - targetValue) / targetValue) * 100;

  // Trend classification
  const trendVelocity = reg.slope;
  let trend: PredictionResult["trend"] = "stable";
  if (trendVelocity < -5) trend = "critical";
  else if (trendVelocity < -1) trend = "declining";
  else if (trendVelocity > 1) trend = "improving";

  // Breach probability (combination of current gap + trend + volatility)
  const gapSeverity = Math.min(40, Math.abs(Math.min(0, gaps[gaps.length - 1] ?? 0)) * 2);
  const trendPenalty = trendVelocity < 0 ? Math.min(30, Math.abs(trendVelocity) * 5) : 0;
  const consecutiveDeclines = countConsecutiveDeclines(actuals);
  const consistencyPenalty = Math.min(30, consecutiveDeclines * 10);
  const breachProbability = Math.min(95, Math.max(5, gapSeverity + trendPenalty + consistencyPenalty));

  // Anomaly detection
  const anomaly = anomalyScore(currentValue, actuals);

  // Forecast with confidence bands
  const sd = stdDev(actuals);
  const forecastPeriods = Array.from({ length: periodsAhead }, (_, i) => {
    const idx = nextIdx + i;
    const predicted = reg.slope * idx + reg.intercept;
    const marginOfError = sd * 1.96 * Math.sqrt(1 + 1 / actuals.length + ((idx - actuals.length / 2) ** 2) / (actuals.length * stdDev(actuals.map((_, j) => j)) ** 2 || 1));
    return {
      period: `T+${i + 1}`,
      predicted: Math.round(predicted * 10) / 10,
      lower: Math.round((predicted - marginOfError) * 10) / 10,
      upper: Math.round((predicted + marginOfError) * 10) / 10,
    };
  });

  // Risk factors
  const riskFactors: string[] = [];
  if (consecutiveDeclines >= 3) riskFactors.push(`${consecutiveDeclines} consecutive declining periods`);
  if (trendVelocity < -3) riskFactors.push(`Rapid decline: ${trendVelocity.toFixed(1)} units/period`);
  if (anomaly > 60) riskFactors.push(`Anomalous performance (score: ${anomaly})`);
  if (gaps[gaps.length - 1] < -15) riskFactors.push(`Severe current gap: ${gaps[gaps.length - 1]?.toFixed(1)}%`);
  if (reg.r2 > 0.7 && reg.slope < 0) riskFactors.push(`Strong negative trend (R²=${reg.r2.toFixed(2)})`);

  return {
    employeeId,
    employeeName,
    kpiName,
    currentValue,
    targetValue,
    predictedNextValue: Math.round(predictedNext * 10) / 10,
    predictedGap: Math.round(predictedGap * 10) / 10,
    breachProbability: Math.round(breachProbability),
    trend,
    trendVelocity: Math.round(trendVelocity * 100) / 100,
    anomalyScore: anomaly,
    forecastPeriods,
    confidence: Math.round(Math.max(30, reg.r2 * 100)),
    riskFactors,
  };
}

function countConsecutiveDeclines(values: number[]): number {
  let count = 0;
  for (let i = values.length - 1; i > 0; i--) {
    if (values[i] < values[i - 1]) count++;
    else break;
  }
  return count;
}

/**
 * Batch predict for all employees with snapshot data.
 */
export function batchPredict(
  employees: { id: string; name: string; kpi: string; snapshots: DataPoint[] }[],
): PredictionResult[] {
  return employees
    .filter((e) => e.snapshots.length >= 2)
    .map((e) => predictPerformance(e.id, e.name, e.kpi, e.snapshots))
    .sort((a, b) => b.breachProbability - a.breachProbability);
}
