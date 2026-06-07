export interface Competency {
  id: string;
  competencyCode: string;
  competencyNameAr: string;
  competencyNameEn: string;
  category: string;
  description?: string;
  status: string;
  createdAt: string;
}
export interface CompetencyLevel {
  id: string;
  competencyId: string;
  levelNumber: 1 | 2 | 3 | 4 | 5;
  levelName: string;
  behavioralIndicators: string[];
  createdAt: string;
}
export interface JobCompetency {
  id: string;
  jobId: string;
  competencyId: string;
  requiredLevel: number;
  importanceWeight: number;
}
export interface EmployeeCompetency {
  id: string;
  employeeId: string;
  competencyId: string;
  currentLevel: number;
  requiredLevel?: number;
  gap?: number;
  assessmentDate: string;
}
export interface ProcessStepCompetency {
  id: string;
  processStepId: string;
  competencyId: string;
  requiredLevel: number;
}
export interface CompetencyGap {
  employeeId: string;
  employeeName: string;
  competencyId: string;
  competencyName: string;
  competencyCategory: string;
  requiredLevel: number;
  currentLevel: number;
  gap: number;
  criticality: "low" | "medium" | "high";
}
export interface CompetencyHeatmapCell {
  employeeId: string;
  employeeName: string;
  competencyName: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
}
export type VerificationStatus = "unverified" | "pending" | "verified" | "disputed";
export interface KpiRelationship {
  id: string;
  parentKpiId: string;
  childKpiId: string;
  relationshipType: string;
  impactWeight: number;
}
export interface ProcessDependency {
  id: string;
  processId: string;
  dependsOnProcessId: string;
  dependencyType: string;
  criticality: string;
}
export interface ProcessDependencyGraph {
  nodes: { id: string; name: string; riskLevel: string; criticality: string }[];
  edges: { from: string; to: string; type: string; criticality: string }[];
}
export type DiagnosticMaturityLevel = 1 | 2 | 3 | 4 | 5;
export interface DiagnosticMaturity {
  maturityLevel: DiagnosticMaturityLevel;
  confidenceScore?: number;
  evidenceScore?: number;
  validationStatus: string;
  historicalAlignmentScore?: number;
}
export interface RootCauseAnalytics {
  category: string;
  frequency: number;
  percentage: number;
  trend: "increasing" | "stable" | "decreasing";
}
export interface CompetencyGapTrend {
  period: string;
  competencyName: string;
  avgGap: number;
  employeeCount: number;
}
export interface ProcessFailureTrend {
  period: string;
  processName: string;
  failureCount: number;
  avgRiskScore: number;
}
export interface DiagnosticConfidenceTrend {
  period: string;
  avgConfidence: number;
  avgMaturityLevel: number;
  reportCount: number;
}
export interface EvidenceQualityMetrics {
  totalEvidence: number;
  averageReliability: number;
  verifiedPercentage: number;
  distributionByType: Record<string, number>;
  distributionByVerification: Record<string, number>;
}
export const EVIDENCE_RELIABILITY_DEFAULTS: Record<string, number> = {
  system_logs: 95,
  audit_findings: 90,
  kpi_measurements: 90,
  quality_audits: 85,
  customer_complaints: 70,
  supervisor_observations: 60,
  employee_statements: 50,
  peer_feedback: 40,
};
