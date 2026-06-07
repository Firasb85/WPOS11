// WPOS Diagnostic & Evidence Layer Types
// Labels: "Diagnostic Insight" | "Hypothesis" | "Evidence-Based Observation"

export interface QuantitativeEvidence {
  id: string;
  evidenceId: string;
  metricName: string;
  actualValue?: number;
  benchmarkValue?: number;
  variance?: number;
  variancePct?: number;
  interpretation?: string;
  createdAt: string;
}
export interface QualitativeEvidence {
  id: string;
  evidenceId: string;
  sourceType: string;
  observation: string;
  category?: string;
  recordedBy?: string;
  recordedAt: string;
}
export interface SystemBehavioralEvidence {
  id: string;
  evidenceId: string;
  metricType: string;
  currentValue?: number;
  previousValue?: number;
  changePct?: number;
  trend: string;
  processId?: string;
  systemLog?: string;
  createdAt: string;
}
export interface ContextualEvidence {
  id: string;
  evidenceId: string;
  contextType: string;
  contextValue?: string;
  impactAssessment?: string;
  createdAt: string;
}
export interface TemporalEvidence {
  id: string;
  evidenceId: string;
  period: string;
  metricName: string;
  value30day?: number;
  value60day?: number;
  value90day?: number;
  trend30day: string;
  trend60day: string;
  trend90day: string;
  overallTrend: string;
  createdAt: string;
}
export interface Contradiction {
  id: string;
  reportId?: string;
  contradictionType: string;
  description: string;
  evidenceAId?: string;
  evidenceBId?: string;
  severity: string;
  createdAt: string;
}
export type ReviewStatus = "pending" | "under_review" | "reviewed" | "approved" | "rejected";
export type ManagerDecision = "accepted" | "rejected" | "modified";
export interface ManagerReview {
  id: string;
  reportId: string;
  reviewerId: string;
  reviewerName?: string;
  reviewStatus: ReviewStatus;
  hypothesisId?: string;
  decision?: ManagerDecision;
  comments?: string;
  modifiedHypothesis?: string;
  reviewedAt?: string;
  createdAt: string;
}
export interface ValidationAction {
  id: string;
  hypothesisId: string;
  actionDescription: string;
  assignedTo?: string;
  assigneeName?: string;
  dueDate?: string;
  status: string;
  completedAt?: string;
  result?: string;
  createdAt: string;
}
export interface EnhancedHypothesis {
  id: string;
  reportId: string;
  category: string;
  hypothesis: string;
  hypothesisAr?: string;
  label: "Diagnostic Insight" | "Hypothesis" | "Evidence-Based Observation";
  confidenceScore?: number;
  evidenceScore?: number;
  evidenceStrengthIndex?: number;
  supportingEvidence: unknown;
  contradictingEvidence: unknown;
  validationActions: unknown;
  rankOrder: number;
  reasoning: string;
  managerDecision?: ManagerDecision;
  managerComment?: string;
  createdAt: string;
}
export interface HypothesisEvidenceMapping {
  id: string;
  hypothesisId: string;
  evidenceId: string;
  evidenceDescription?: string;
  relationshipType: "supporting" | "contradicting";
  weight: number;
  createdAt: string;
}
export interface EnhancedDiagnosticReport {
  id: string;
  employeeId?: string;
  employeeName?: string;
  title: string;
  status: string;
  maturityLevel: number;
  confidenceScore?: number;
  evidenceScore?: number;
  evidenceStrengthIndex?: number;
  contradictionCount: number;
  managerReviewCount: number;
  isManagerReviewed: boolean;
  isApproved: boolean;
  isFinal: boolean;
  generatedBy?: string;
  reviewedBy?: string;
  approvedBy?: string;
  hypotheses?: EnhancedHypothesis[];
  evidence?: unknown[];
  contradictions?: Contradiction[];
  managerReviews?: ManagerReview[];
  createdAt: string;
}
export interface EvidenceDashboardMetrics {
  totalEvidence: number;
  byType: { type: string; count: number; pct: number }[];
  byReliability: { range: string; count: number }[];
  verifiedPct: number;
  avgReliability: number;
  recentItems: { id: string; type: string; source: string; date: string; reliability: number }[];
}
export interface RootCauseDashboardMetrics {
  topCauses: { category: string; count: number; pct: number; trend: string }[];
  departmentsAtRisk: { department: string; riskScore: number; openDiagnostics: number }[];
  trendOverTime: { period: string; categories: Record<string, number> }[];
  criticalCases: { id: string; employee: string; issue: string; risk: string; date: string }[];
}
export interface DiagnosticDashboardMetrics {
  totalReports: number;
  avgMaturity: number;
  avgConfidence: number;
  underReview: number;
  approved: number;
  byDepartment: { department: string; count: number; avgConfidence: number }[];
  recentReports: {
    id: string;
    title: string;
    employee: string;
    status: string;
    confidence: number;
  }[];
}
