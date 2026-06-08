import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  legal_name: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
});

export const branchSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company_id: z.string().uuid("Select a company"),
  code: z.string().optional(),
  city: z.string().optional(),
});

export const departmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  branch_id: z.string().uuid("Select a branch"),
  code: z.string().optional(),
  description: z.string().optional(),
});

export const teamSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  department_id: z.string().uuid("Select a department"),
  code: z.string().optional(),
});

export const employeeSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  employee_code: z.string().optional(),
  team_id: z.string().optional(),
  employment_status: z.string().default("active"),
});

export const kpiSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(1, "Code is required"),
  category_id: z.string().optional(),
  target_value: z.number().optional(),
  unit: z.string().optional(),
  measurement_frequency: z.string().default("monthly"),
  is_higher_better: z.boolean().default(true),
});

export const snapshotSchema = z.object({
  employee_id: z.string().uuid("Select an employee"),
  kpi_id: z.string().uuid("Select a KPI"),
  period: z.string().min(1, "Period is required"),
  target_value: z.number().min(0, "Target must be positive"),
  actual_value: z.number().min(0, "Actual must be positive"),
});

export type CompanyInput = z.infer<typeof companySchema>;
export type BranchInput = z.infer<typeof branchSchema>;
export type DepartmentInput = z.infer<typeof departmentSchema>;
export type TeamInput = z.infer<typeof teamSchema>;
export type EmployeeInput = z.infer<typeof employeeSchema>;
export type KpiInput = z.infer<typeof kpiSchema>;
export type SnapshotInput = z.infer<typeof snapshotSchema>;
