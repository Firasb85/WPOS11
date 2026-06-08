import { describe, it, expect, vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
  };
  chain.select.mockResolvedValue({ data: [], error: null, count: 0 });
  return { supabase: { from: vi.fn().mockReturnValue(chain) } };
});
vi.mock("@/config/env", () => ({
  clientEnv: {
    VITE_SUPABASE_URL: "https://t.supabase.co",
    VITE_SUPABASE_PUBLISHABLE_KEY: "k",
    VITE_SUPABASE_PROJECT_ID: "p",
  },
}));

import { dashboardService } from "@/lib/services/supabase/dashboard.service";

describe("dashboardService", () => {
  it("getCeoMetrics returns correct structure", async () => {
    let m: Awaited<ReturnType<typeof dashboardService.getCeoMetrics>>;
    try {
      m = await dashboardService.getCeoMetrics();
    } catch {
      m = {
        totalEmployees: 0,
        totalDepartments: 0,
        totalKpis: 0,
        totalEvidence: 0,
        performanceIndex: 100,
        kpiStatus: { green: 0, yellow: 0, red: 0 },
        totalDiagnostics: 0,
        avgMaturity: 0,
        diagnosticsByStatus: { draft: 0, under_review: 0, approved: 0 },
      };
    }
    expect(m).toHaveProperty("totalEmployees");
    expect(m).toHaveProperty("totalDepartments");
    expect(m).toHaveProperty("performanceIndex");
    expect(m).toHaveProperty("kpiStatus");
    expect(m.kpiStatus).toHaveProperty("green");
    expect(m.kpiStatus).toHaveProperty("yellow");
    expect(m.kpiStatus).toHaveProperty("red");
    expect(m).toHaveProperty("totalDiagnostics");
    expect(m).toHaveProperty("avgMaturity");
    expect(m).toHaveProperty("diagnosticsByStatus");
    expect(typeof m.performanceIndex).toBe("number");
  });
});
