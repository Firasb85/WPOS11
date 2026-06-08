import { describe, it, expect, vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => {
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: "1", name: "KPI" }, error: null }),
  };
  chain.select.mockReturnValue(chain);
  chain.insert.mockReturnValue(chain);
  chain.order.mockResolvedValue({ data: [], error: null });
  return { supabase: { from: vi.fn().mockReturnValue(chain) } };
});
vi.mock("@/config/env", () => ({
  clientEnv: {
    VITE_SUPABASE_URL: "https://t.supabase.co",
    VITE_SUPABASE_PUBLISHABLE_KEY: "k",
    VITE_SUPABASE_PROJECT_ID: "p",
  },
}));

import { kpiCategoriesService } from "@/lib/services/supabase/kpi-categories.service";
import { kpisService } from "@/lib/services/supabase/kpis.service";

describe("kpiCategoriesService", () => {
  it("list returns array", async () => {
    expect(Array.isArray(await kpiCategoriesService.list())).toBe(true);
  });
  it("create returns object", async () => {
    expect(await kpiCategoriesService.create({ name: "Cat" })).toHaveProperty("id");
  });
  it("delete resolves", async () => {
    await expect(kpiCategoriesService.delete("1")).resolves.not.toThrow();
  });
});

describe("kpisService", () => {
  it("list returns array", async () => {
    expect(Array.isArray(await kpisService.list())).toBe(true);
  });
  it("create returns object", async () => {
    expect(
      await kpisService.create({
        name: "K",
        code: "K1",
        measurement_frequency: "monthly",
        is_higher_better: true,
      }),
    ).toHaveProperty("id");
  });
  it("delete resolves", async () => {
    await expect(kpisService.delete("1")).resolves.not.toThrow();
  });
});
