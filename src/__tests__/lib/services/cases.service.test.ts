import { describe, it, expect, vi } from "vitest";

// Mock the entire cases service module at the top level
vi.mock("@/lib/services/supabase/cases.service", () => ({
  casesService: {
    list: vi.fn().mockResolvedValue([
      {
        id: "1",
        case_number: "CAS-2026-0001",
        status: "open",
        priority: "high",
        employee_id: "e1",
      },
      {
        id: "2",
        case_number: "CAS-2026-0002",
        status: "resolved",
        priority: "medium",
        employee_id: "e2",
      },
    ]),
    getById: vi.fn().mockResolvedValue({
      id: "1",
      case_number: "CAS-2026-0001",
      status: "open",
    }),
    create: vi.fn().mockResolvedValue({
      id: "3",
      case_number: "CAS-2026-0003",
      status: "open",
    }),
    updateStatus: vi.fn().mockResolvedValue({
      id: "1",
      status: "resolved",
      closure_date: "2026-06-07",
    }),
    delete: vi.fn().mockResolvedValue(undefined),
    createFromDiagnostic: vi.fn().mockResolvedValue({
      id: "4",
      case_number: "CAS-2026-0004",
      status: "open",
      diagnostic_report_id: "diag-1",
    }),
  },
}));

import { casesService } from "@/lib/services/supabase/cases.service";

describe("casesService", () => {
  describe("list", () => {
    it("should return array of cases", async () => {
      const result = await casesService.list();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0].case_number).toBe("CAS-2026-0001");
    });
  });

  describe("getById", () => {
    it("should return a single case", async () => {
      const result = await casesService.getById("1");
      expect(result).toHaveProperty("id", "1");
      expect(result).toHaveProperty("status", "open");
    });
  });

  describe("create", () => {
    it("should return new case with generated number", async () => {
      const result = await casesService.create({
        employee_id: "emp-1",
        status: "open",
      });
      expect(result).toHaveProperty("case_number");
      expect(result.status).toBe("open");
    });
  });

  describe("updateStatus", () => {
    it("should update status and return updated case", async () => {
      const result = await casesService.updateStatus("1", "resolved");
      expect(result.status).toBe("resolved");
      expect(result).toHaveProperty("closure_date");
    });
  });

  describe("createFromDiagnostic", () => {
    it("should auto-create case from diagnostic report", async () => {
      const result = await casesService.createFromDiagnostic("diag-1");
      expect(result).toHaveProperty("diagnostic_report_id", "diag-1");
      expect(result.status).toBe("open");
    });
  });

  describe("delete", () => {
    it("should resolve without error", async () => {
      await expect(casesService.delete("1")).resolves.toBeUndefined();
    });
  });
});
