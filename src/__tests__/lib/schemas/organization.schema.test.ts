import { describe, it, expect } from "vitest";
import {
  companySchema,
  branchSchema,
  employeeSchema,
  kpiSchema,
  snapshotSchema,
} from "@/lib/schemas/organization.schema";

describe("Organization Schemas", () => {
  describe("companySchema", () => {
    it("should accept valid company", () => {
      expect(companySchema.safeParse({ name: "Acme Corp" }).success).toBe(true);
    });

    it("should reject empty name", () => {
      expect(companySchema.safeParse({ name: "" }).success).toBe(false);
    });

    it("should reject invalid email", () => {
      expect(companySchema.safeParse({ name: "Acme", email: "notanemail" }).success).toBe(false);
    });

    it("should accept empty email", () => {
      expect(companySchema.safeParse({ name: "Acme", email: "" }).success).toBe(true);
    });
  });

  describe("branchSchema", () => {
    it("should require company_id as UUID", () => {
      expect(branchSchema.safeParse({ name: "HQ", company_id: "not-uuid" }).success).toBe(false);
    });

    it("should accept valid branch", () => {
      expect(
        branchSchema.safeParse({
          name: "HQ",
          company_id: "550e8400-e29b-41d4-a716-446655440000",
        }).success,
      ).toBe(true);
    });
  });

  describe("employeeSchema", () => {
    it("should require first and last name", () => {
      expect(employeeSchema.safeParse({ first_name: "", last_name: "Doe" }).success).toBe(false);
    });

    it("should accept valid employee", () => {
      expect(
        employeeSchema.safeParse({
          first_name: "John",
          last_name: "Doe",
        }).success,
      ).toBe(true);
    });
  });

  describe("kpiSchema", () => {
    it("should require name and code", () => {
      expect(kpiSchema.safeParse({ name: "KPI" }).success).toBe(false);
      expect(kpiSchema.safeParse({ name: "KPI", code: "K1" }).success).toBe(true);
    });
  });

  describe("snapshotSchema", () => {
    it("should require employee, KPI, period, and values", () => {
      expect(
        snapshotSchema.safeParse({
          employee_id: "550e8400-e29b-41d4-a716-446655440000",
          kpi_id: "550e8400-e29b-41d4-a716-446655440001",
          period: "2026-06",
          target_value: 95,
          actual_value: 78,
        }).success,
      ).toBe(true);
    });

    it("should reject negative values", () => {
      expect(
        snapshotSchema.safeParse({
          employee_id: "550e8400-e29b-41d4-a716-446655440000",
          kpi_id: "550e8400-e29b-41d4-a716-446655440001",
          period: "2026-06",
          target_value: -5,
          actual_value: 78,
        }).success,
      ).toBe(false);
    });
  });
});
