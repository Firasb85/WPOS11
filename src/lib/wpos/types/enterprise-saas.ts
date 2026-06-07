// WPOS Enterprise SaaS Types - Modules 1-15
export type ProcessExecStatus = "pending" | "running" | "completed" | "failed" | "abandoned";
export type MaturityLevel = 1 | 2 | 3 | 4 | 5;
export type DocType =
  | "policy"
  | "sop"
  | "work_instruction"
  | "training_material"
  | "evidence_attachment";
export type NotificationChannel = "in_app" | "email" | "sms" | "whatsapp";
export type PlanCode = "FREE" | "STARTER" | "PRO" | "ENTERPRISE";

// Module 1
export interface ProcessExecution {
  id: string;
  processId: string;
  processName?: string;
  employeeId: string;
  employeeName?: string;
  startedAt: string;
  endedAt?: string;
  duration?: string;
  status: ProcessExecStatus;
  totalSteps: number;
  completedSteps: number;
  failures: number;
  reworkCount: number;
  abandonment: boolean;
  delayMinutes: number;
}
export interface ExecutionStep {
  id: string;
  executionId: string;
  stepId: string;
  stepNumber: number;
  startedAt?: string;
  endedAt?: string;
  duration?: string;
  status: string;
  failed: boolean;
  rework: boolean;
  delayMinutes: number;
  errorDescription?: string;
}

// Module 2
export interface ProcessMiningResult {
  id: string;
  processId: string;
  processName?: string;
  analysisDate: string;
  expectedDuration?: string;
  actualAvgDuration?: string;
  bottleneckSteps: string[];
  skippedSteps: string[];
  reworkRate: number;
  delayFrequency: number;
  variancePct: number;
  recommendations: string[];
}

// Module 4
export interface MaturityAssessment {
  id: string;
  entityType: string;
  entityId: string;
  entityName?: string;
  assessmentDate: string;
  peopleScore: number;
  processesScore: number;
  kpisScore: number;
  evidenceScore: number;
  diagnosticsScore: number;
  overallScore: number;
  overallLevel: MaturityLevel;
  dimensions?: unknown;
  assessedBy?: string;
}
export interface MaturityDimension {
  name: string;
  nameAr: string;
  score: number;
  level: number;
  description: string;
}

// Module 5
export interface Document {
  id: string;
  code: string;
  titleAr: string;
  titleEn: string;
  docType: DocType;
  category?: string;
  content?: string;
  fileUrl?: string;
  version: number;
  status: string;
  authorId?: string;
  departmentId?: string;
  effectiveDate?: string;
  expiryDate?: string;
  tags?: string[];
  createdAt: string;
}

// Module 6
export interface WorkflowInstance {
  id: string;
  workflowId?: string;
  entityType: string;
  entityId: string;
  status: string;
  currentStep: number;
  totalSteps: number;
  initiatedBy?: string;
  initiatedAt: string;
}
export interface WorkflowApproval {
  id: string;
  instanceId: string;
  stepNumber: number;
  approverId: string;
  approverName?: string;
  status: string;
  comments?: string;
  decidedAt?: string;
}

// Module 7
export interface Notification {
  id: string;
  userId: string;
  type: string;
  titleAr?: string;
  titleEn?: string;
  bodyAr?: string;
  bodyEn?: string;
  entityType?: string;
  entityId?: string;
  isRead: boolean;
  channel: string;
  sentAt: string;
}

// Module 8
export interface AIInteraction {
  id: string;
  userId?: string;
  queryType: string;
  inputContext?: unknown;
  outputResponse?: string;
  confidenceScore?: number;
  requiresHumanValidation: boolean;
  createdAt: string;
}

// Module 10
export interface SubscriptionPlan {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  priceMonthly: number;
  priceYearly: number;
  maxUsers: number;
  maxEmployees: number;
  maxStorageGb: number;
  features: string[];
}
export interface CompanySubscription {
  id: string;
  companyId: string;
  companyName?: string;
  planId: string;
  planName?: string;
  status: string;
  startDate: string;
  endDate?: string;
  trialEndDate?: string;
  autoRenew: boolean;
  currentUsers: number;
  currentEmployees: number;
}
export interface Invoice {
  id: string;
  companyId: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
}

// Module 12
export interface ApiKey {
  id: string;
  companyId: string;
  keyPrefix: string;
  name?: string;
  permissions?: string[];
  lastUsedAt?: string;
  expiresAt?: string;
  isActive: boolean;
}

// Module 15
export interface EnterpriseReport {
  type: string;
  title: string;
  period: string;
  metrics: unknown;
  sections: unknown[];
}
