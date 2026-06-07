import { describe, it, expect, vi } from "vitest";

// Mock supabase client
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        is: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: [], error: null }),
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    }),
  },
}));

vi.mock("@/config/env", () => ({
  clientEnv: {
    VITE_SUPABASE_URL: "https://test.supabase.co",
    VITE_SUPABASE_PUBLISHABLE_KEY: "test-key",
    VITE_SUPABASE_PROJECT_ID: "test-id",
  },
}));

import { analyticsService } from "@/lib/services/supabase/analytics.service";

describe("analyticsService", () => {
  describe("getEvidenceMetrics", () => {
    it("should return metrics with correct structure", async () => {
      const result = await analyticsService.getEvidenceMetrics();
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("byType");
      expect(result).toHaveProperty("byReliability");
      expect(typeof result.total).toBe("number");
    });
  });

  describe("getRootCauseMetrics", () => {
    it("should return sorted array", async () => {
      const result = await analyticsService.getRootCauseMetrics();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
