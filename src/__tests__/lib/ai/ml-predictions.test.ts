import { describe, it, expect } from "vitest";
import { predictPerformance, batchPredict } from "@/lib/ai/ml-predictions";

describe("ML Prediction Engine", () => {
  const sampleData = [
    { period: "2026-01", actual: 92, target: 95, gap: -3.2 },
    { period: "2026-02", actual: 88, target: 95, gap: -7.4 },
    { period: "2026-03", actual: 85, target: 95, gap: -10.5 },
    { period: "2026-04", actual: 82, target: 95, gap: -13.7 },
    { period: "2026-05", actual: 78, target: 95, gap: -17.9 },
  ];

  it("should predict next value using linear regression", () => {
    const result = predictPerformance("emp-1", "Ahmad", "CSAT", sampleData);
    expect(result.predictedNextValue).toBeLessThan(78);
    expect(result.predictedNextValue).toBeGreaterThan(50);
  });

  it("should detect declining trend", () => {
    const result = predictPerformance("emp-1", "Ahmad", "CSAT", sampleData);
    expect(["declining", "critical"].includes(result.trend)).toBe(true);
    expect(result.trendVelocity).toBeLessThan(0);
  });

  it("should calculate high breach probability", () => {
    const result = predictPerformance("emp-1", "Ahmad", "CSAT", sampleData);
    expect(result.breachProbability).toBeGreaterThan(50);
    expect(result.breachProbability).toBeLessThanOrEqual(95);
  });

  it("should generate forecast periods", () => {
    const result = predictPerformance("emp-1", "Ahmad", "CSAT", sampleData, 3);
    expect(result.forecastPeriods).toHaveLength(3);
    expect(result.forecastPeriods[0].period).toBe("T+1");
    expect(result.forecastPeriods[0].lower).toBeLessThan(result.forecastPeriods[0].predicted);
    expect(result.forecastPeriods[0].upper).toBeGreaterThan(result.forecastPeriods[0].predicted);
  });

  it("should identify risk factors", () => {
    const result = predictPerformance("emp-1", "Ahmad", "CSAT", sampleData);
    expect(result.riskFactors.length).toBeGreaterThan(0);
  });

  it("should handle stable data", () => {
    const stable = [
      { period: "2026-01", actual: 94, target: 95, gap: -1 },
      { period: "2026-02", actual: 95, target: 95, gap: 0 },
      { period: "2026-03", actual: 93, target: 95, gap: -2 },
      { period: "2026-04", actual: 95, target: 95, gap: 0 },
    ];
    const result = predictPerformance("emp-2", "Nadia", "CSAT", stable);
    expect(result.trend === "stable" || result.trend === "improving").toBe(true);
    expect(result.breachProbability).toBeLessThan(40);
  });

  it("should batch predict sorted by risk", () => {
    const emps = [
      { id: "e1", name: "A", kpi: "K1", snapshots: sampleData },
      { id: "e2", name: "B", kpi: "K2", snapshots: [
        { period: "2026-01", actual: 88, target: 90, gap: -2 },
        { period: "2026-02", actual: 85, target: 90, gap: -5 },
      ]},
    ];
    const results = batchPredict(emps);
    expect(results).toHaveLength(2);
    expect(results[0].breachProbability).toBeGreaterThanOrEqual(results[1].breachProbability);
  });

  it("should filter employees with < 2 data points", () => {
    const results = batchPredict([{ id: "e", name: "X", kpi: "K", snapshots: [{ period: "P", actual: 1, target: 2, gap: -50 }] }]);
    expect(results).toHaveLength(0);
  });
});
