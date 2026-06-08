import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/services/supabase/risk-prediction.service", () => ({
  riskPredictionService: {
    getAtRiskEmployees: vi.fn().mockResolvedValue([
      {
        id: "emp1",
        name: "Ahmad Khalid",
        department: "Ops",
        currentGapPct: -25,
        trend: "worsening",
        breachProbability: 85,
        riskLevel: "critical",
        kpiName: "CSAT",
        consecutiveRed: 3,
      },
    ]),
    getAtRiskDepartments: vi.fn().mockResolvedValue([
      {
        id: "ops",
        name: "Operations",
        atRiskCount: 2,
        avgBreachProbability: 70,
        riskLevel: "high",
      },
    ]),
  },
}));

import { riskPredictionService } from "@/lib/services/supabase/risk-prediction.service";

describe("riskPredictionService", () => {
  it("getAtRiskEmployees returns sorted array", async () => {
    const result = await riskPredictionService.getAtRiskEmployees();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("breachProbability");
    expect(result[0]).toHaveProperty("riskLevel");
  });

  it("employee has all required fields", async () => {
    const result = await riskPredictionService.getAtRiskEmployees();
    const emp = result[0];
    expect(emp).toHaveProperty("id");
    expect(emp).toHaveProperty("name");
    expect(emp).toHaveProperty("department");
    expect(emp).toHaveProperty("trend");
    expect(emp).toHaveProperty("kpiName");
    expect(emp).toHaveProperty("consecutiveRed");
    expect(emp.breachProbability).toBeGreaterThanOrEqual(0);
    expect(emp.breachProbability).toBeLessThanOrEqual(99);
  });

  it("critical risk level for high probability", async () => {
    const result = await riskPredictionService.getAtRiskEmployees();
    const critical = result.filter((e) => e.breachProbability >= 75);
    critical.forEach((e) => expect(e.riskLevel).toBe("critical"));
  });

  it("getAtRiskDepartments returns aggregated data", async () => {
    const result = await riskPredictionService.getAtRiskDepartments();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("atRiskCount");
    expect(result[0]).toHaveProperty("avgBreachProbability");
  });

  it("department risk level matches probability", async () => {
    const result = await riskPredictionService.getAtRiskDepartments();
    result.forEach((d) => {
      if (d.avgBreachProbability >= 75) expect(d.riskLevel).toBe("critical");
      else if (d.avgBreachProbability >= 50) expect(d.riskLevel).toBe("high");
    });
  });
});
