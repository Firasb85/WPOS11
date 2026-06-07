import { describe, it, expect } from "vitest";
import { createDiagnosticSchema } from "@/lib/schemas/diagnostic.schema";

describe("createDiagnosticSchema", () => {
  it("should validate a correct diagnostic input", () => {
    const input = {
      title: "Performance Gap Analysis",
      employeeId: "550e8400-e29b-41d4-a716-446655440000",
      departmentId: "550e8400-e29b-41d4-a716-446655440001",
      symptoms: ["Missed quota"],
    };

    const result = createDiagnosticSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("should reject title shorter than 5 characters", () => {
    const input = {
      title: "Hi",
      employeeId: "550e8400-e29b-41d4-a716-446655440000",
      departmentId: "550e8400-e29b-41d4-a716-446655440001",
      symptoms: ["Missed quota"],
    };

    const result = createDiagnosticSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject invalid UUID for employeeId", () => {
    const input = {
      title: "Valid Title Here",
      employeeId: "not-a-uuid",
      departmentId: "550e8400-e29b-41d4-a716-446655440001",
      symptoms: ["Missed quota"],
    };

    const result = createDiagnosticSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject empty symptoms array", () => {
    const input = {
      title: "Valid Title Here",
      employeeId: "550e8400-e29b-41d4-a716-446655440000",
      departmentId: "550e8400-e29b-41d4-a716-446655440001",
      symptoms: [],
    };

    const result = createDiagnosticSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should accept optional hypotheses", () => {
    const input = {
      title: "Valid Title Here",
      employeeId: "550e8400-e29b-41d4-a716-446655440000",
      departmentId: "550e8400-e29b-41d4-a716-446655440001",
      symptoms: ["Missed quota"],
      hypotheses: [
        {
          category: "skill_gap" as const,
          hypothesis: "Lacks advanced Excel skills",
          confidenceScore: 78,
        },
      ],
    };

    const result = createDiagnosticSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
});
