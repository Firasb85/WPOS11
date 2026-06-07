// WPOS Workforce Development Platform Types
// Modules 1-12

export type CaseStatus = 'draft'|'open'|'under_investigation'|'action_planned'|'intervention_running'|'monitoring'|'resolved'|'closed'|'cancelled';
export type RiskLevel = 'low'|'medium'|'high'|'critical';
export type InterventionType = 'training'|'coaching'|'mentoring'|'field_observation'|'process_redesign'|'tool_upgrade'|'system_fix'|'territory_change'|'other';
export type FollowUpResult = 'improvement'|'no_change'|'decline';
export type CompetencyType = 'knowledge'|'skill'|'behavior'|'attitude';

// Module 1
export interface Case {
  id: string; caseNumber: string; diagnosticReportId?: string;
  employeeId: string; employeeName?: string; departmentId?: string; departmentName?: string;
  managerId?: string; managerName?: string; relatedKpiId?: string; relatedProcessId?: string;
  rootCauseCategory?: string; rootCauseCode?: string; priority: string;
  status: CaseStatus; dueDate?: string; closureDate?: string;
  description?: string; createdBy?: string; createdAt: string; updatedAt: string;
  interventions?: CaseIntervention[]; actionPlans?: ActionPlan[]; followUps?: FollowUp[];
}

// Module 2
export interface RootCause {
  id: string; code: string; nameAr: string; nameEn: string;
  category: string; description?: string;
  indicators?: string[]; symptoms?: string[];
  supportingEvidenceExamples?: string[]; contradictingEvidenceExamples?: string[];
  validationMethods?: string[]; recommendedActions?: string[];
  isActive: boolean; createdAt: string;
}

// Module 3
export interface CompetencyFramework {
  id: string; code: string; nameAr: string; nameEn: string;
  competencyType: CompetencyType; category: string; description?: string;
  level1Desc?: string; level2Desc?: string; level3Desc?: string; level4Desc?: string; level5Desc?: string;
  status: string; createdAt: string;
}

// Module 4
export interface CompetencyAssessment {
  id: string; employeeId: string; employeeName?: string;
  competencyId: string; competencyName?: string;
  assessedLevel: number; expectedLevel: number; gap: number;
  assessmentDate: string; assessedBy?: string; assessorName?: string;
  assessmentMethod?: string; notes?: string; nextAssessmentDate?: string;
}

// Module 5
export interface Intervention {
  id: string; code: string; nameAr: string; nameEn: string;
  type: InterventionType; description?: string;
  typicalCost?: number; typicalDuration?: string; expectedOutcome?: string;
  successMetrics?: string[]; isActive: boolean; createdAt: string;
}
export interface CaseIntervention {
  id: string; caseId: string; interventionId: string;
  interventionName?: string; interventionType?: string;
  customDescription?: string; cost?: number; duration?: string;
  ownerId?: string; ownerName?: string; status: string;
  outcome?: string; effectivenessScore?: number;
  startDate?: string; endDate?: string;
}

// Module 6
export interface ActionPlan {
  id: string; caseId: string; actionNumber: number;
  description: string; ownerId?: string; ownerName?: string;
  startDate?: string; endDate?: string; status: string;
  progress: number; result?: string; completedAt?: string;
}

// Module 7
export interface FollowUp {
  id: string; caseId: string; followUpType: string;
  checkInDate: string; status: string; result: FollowUpResult;
  kpiValueBefore?: number; kpiValueAfter?: number; improvementPct?: number;
  notes?: string; conductedBy?: string; conductedAt?: string;
}

// Module 8
export interface InterventionEffectiveness {
  id: string; interventionId: string; interventionName?: string;
  casesApplied: number; successfulOutcomes: number; failedOutcomes: number;
  avgImprovementPct?: number; successRate?: number; roiEstimate?: number;
}

// Module 9
export interface PerformanceJourneyEntry {
  id: string; employeeId: string; entryType: string;
  entryId?: string; title?: string; description?: string;
  entryDate: string; createdAt: string;
}

// Module 11
export interface RiskScore {
  id: string; employeeId?: string; employeeName?: string;
  teamId?: string; departmentId?: string; departmentName?: string;
  branchId?: string; score: number; level: RiskLevel;
  factors?: Record<string, unknown>; calculatedAt: string;
}

// Module 12
export interface ExecutiveAnalytics {
  topRootCauses: { category: string; count: number; pct: number }[];
  effectiveInterventions: { name: string; successRate: number; casesApplied: number }[];
  atRiskDepartments: { department: string; avgRiskScore: number; employeeCount: number }[];
  improvementTrends: { period: string; resolved: number; new: number; active: number }[];
  recoveryRates: { period: string; recovered: number; total: number; rate: number }[];
}
export interface RiskDashboardData {
  employeeScores: { name: string; department: string; score: number; level: string }[];
  teamScores: { name: string; avgScore: number; level: string; members: number }[];
  departmentScores: { name: string; avgScore: number; level: string; employees: number }[];
  distribution: { level: string; count: number; pct: number }[];
}
export interface CaseDashboardData {
  byStatus: { status: string; count: number }[];
  byPriority: { priority: string; count: number }[];
  byDepartment: { department: string; open: number; closed: number }[];
  monthlyTrend: { month: string; created: number; resolved: number }[];
  summary: { total: number; open: number; resolved: number; critical: number };
}
