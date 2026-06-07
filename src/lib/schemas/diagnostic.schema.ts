import { z } from "zod";

export const createDiagnosticSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  employeeId: z.string().uuid("Invalid employee"),
  departmentId: z.string().uuid("Invalid department"),
  performanceSummary: z.string().min(20).optional(),
  evidenceSummary: z.string().min(20).optional(),
  symptoms: z.array(z.string()).min(1, "At least one symptom required"),
  hypotheses: z
    .array(
      z.object({
        category: z.enum([
          "skill_gap",
          "knowledge_gap",
          "process_issue",
          "tool_issue",
          "environmental_issue",
          "resource_issue",
          "management_issue",
          "motivation_issue",
          "workload_issue",
          "policy_issue",
        ]),
        hypothesis: z.string(),
        confidenceScore: z.number().min(0).max(100).optional(),
      }),
    )
    .optional(),
});

export type CreateDiagnosticInput = z.infer<typeof createDiagnosticSchema>;
