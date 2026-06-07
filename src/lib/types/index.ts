// WPOS - Core Types and Interfaces

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  roleId: string;
  roleName: string;
  isActive: boolean;
  language: string;
  theme: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  isSystem: boolean;
  permissions: Permission[];
  createdAt: string;
}

export interface Permission {
  id: string;
  code: string;
  name: string;
  description?: string;
  module: string;
  action: string;
}

export interface Company {
  id: string;
  name: string;
  legalName?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Branch {
  id: string;
  companyId: string;
  companyName?: string;
  name: string;
  code?: string;
  city?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Department {
  id: string;
  branchId: string;
  branchName?: string;
  name: string;
  code?: string;
  description?: string;
  managerName?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Team {
  id: string;
  departmentId: string;
  departmentName?: string;
  name: string;
  code?: string;
  description?: string;
  teamLeaderName?: string;
  memberCount?: number;
  isActive: boolean;
  createdAt: string;
}

export interface Employee {
  id: string;
  employeeCode?: string;
  firstName: string;
  lastName: string;
  fullNameAr?: string;
  email?: string;
  phone?: string;
  hireDate?: string;
  employmentStatus: string;
  jobTitle?: string;
  teamName?: string;
  departmentName?: string;
  managerName?: string;
  isActive: boolean;
  createdAt: string;
}

export interface JobFamily {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
}

export interface JobGrade {
  id: string;
  name: string;
  code: string;
  level: number;
  minSalary?: number;
  maxSalary?: number;
  createdAt: string;
}

export interface JobProfile {
  id: string;
  title: string;
  familyName?: string;
  gradeName?: string;
  skills?: string[];
  certifications?: string[];
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  profileName?: string;
  employeeName?: string;
  departmentName?: string;
  status: string;
  createdAt: string;
}

export interface Process {
  id: string;
  name: string;
  code: string;
  description?: string;
  ownerName?: string;
  departmentName?: string;
  riskLevel: string;
  criticality: string;
  steps?: ProcessStep[];
  createdAt: string;
}

export interface ProcessStep {
  id: string;
  processId: string;
  stepNumber: number;
  name: string;
  description?: string;
  expectedDuration?: string;
  commonErrors?: string[];
  requiredTools?: string[];
  createdAt: string;
}

export interface KpiCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
}

export interface Kpi {
  id: string;
  name: string;
  code: string;
  categoryName?: string;
  targetValue?: number;
  unit?: string;
  measurementFrequency: string;
  isHigherBetter: boolean;
  ownerName?: string;
  warningThreshold?: number;
  criticalThreshold?: number;
  createdAt: string;
}

export interface PerformanceSnapshot {
  id: string;
  employeeName?: string;
  kpiName?: string;
  period: string;
  targetValue?: number;
  actualValue?: number;
  gapValue?: number;
  gapPercentage?: number;
  status: "green" | "yellow" | "red";
  trend?: string;
  createdAt: string;
}

export type EvidenceType =
  | "quantitative"
  | "qualitative"
  | "behavioral"
  | "system_generated"
  | "contextual"
  | "temporal";

export interface Evidence {
  id: string;
  employeeName?: string;
  evidenceType: EvidenceType;
  source: string;
  sourceDate?: string;
  reliability: "high" | "medium" | "low";
  description: string;
  createdAt: string;
}

export type DiagnosticCategory =
  | "skill_gap"
  | "knowledge_gap"
  | "process_issue"
  | "tool_issue"
  | "environmental_issue"
  | "resource_issue"
  | "management_issue"
  | "motivation_issue"
  | "workload_issue"
  | "policy_issue";

export type DiagnosticStatus = "draft" | "under_review" | "reviewed" | "final";

export interface DiagnosticHypothesis {
  id: string;
  reportId: string;
  category: DiagnosticCategory;
  hypothesis: string;
  confidenceScore?: number;
  supportingEvidence: unknown;
  contradictingEvidence: unknown;
  validationActions: unknown;
  rankOrder: number;
  reasoning: string;
  createdAt: string;
}

export interface DiagnosticReport {
  id: string;
  title: string;
  employeeName?: string;
  departmentName?: string;
  status: DiagnosticStatus;
  riskAssessment?: string;
  managerReview?: string;
  finalDiagnosis?: string;
  isManagerReviewed: boolean;
  isFinal: boolean;
  hypotheses?: DiagnosticHypothesis[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userName?: string;
  action: string;
  entityType: string;
  description?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface NavItem {
  label: string;
  labelAr: string;
  href: string;
  icon: string;
  module: string;
  children?: NavItem[];
  permission?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
