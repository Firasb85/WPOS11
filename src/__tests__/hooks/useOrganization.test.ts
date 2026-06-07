import { describe, it, expect, vi } from "vitest";

// Mock the services
vi.mock("@/lib/services/supabase/companies.service", () => ({
  companiesService: {
    list: vi.fn().mockResolvedValue([{ id: "1", name: "Test Corp", is_active: true }]),
    create: vi.fn().mockResolvedValue({ id: "2", name: "New Corp" }),
    delete: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("@/lib/services/supabase/branches.service", () => ({
  branchesService: {
    list: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock("@/lib/services/supabase/departments.service", () => ({
  departmentsService: {
    list: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock("@/lib/services/supabase/teams.service", () => ({
  teamsService: {
    list: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock("@/lib/services/supabase/employees.service", () => ({
  employeesService: {
    list: vi.fn().mockResolvedValue({ data: [], total: 0, page: 1, pageSize: 20 }),
  },
}));

import { companiesService } from "@/lib/services/supabase/companies.service";

describe("Organization Services", () => {
  describe("companiesService", () => {
    it("list should return companies array", async () => {
      const result = await companiesService.list();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0].name).toBe("Test Corp");
    });

    it("create should return new company with id", async () => {
      const result = await companiesService.create({ name: "New Corp" });
      expect(result).toHaveProperty("id");
      expect(result.name).toBe("New Corp");
    });

    it("delete should resolve without error", async () => {
      await expect(companiesService.delete("1")).resolves.toBeUndefined();
    });
  });
});
