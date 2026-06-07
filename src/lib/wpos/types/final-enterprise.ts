// WPOS Final Enterprise Types - Modules 31-42
export interface BusinessRule {
  id: string; code: string; nameAr?: string; nameEn?: string;
  ruleType: string; conditions: any; actions: any;
  priority: number; isActive: boolean; version: number;
  category?: string; description?: string; createdAt: string;
}
export interface FormDefinition {
  id: string; code: string; nameAr: string; nameEn: string;
  formType: string; schema: any; sections?: any;
  version: number; isActive: boolean; createdAt: string;
}
export interface DataLineageEntry {
  id: string; sourceEntityType: string; sourceEntityId: string;
  targetEntityType: string; targetEntityId: string;
  relationshipType: string; createdAt: string;
}
export interface StrategyModel {
  id: string; code: string; nameAr: string; nameEn: string;
  vision?: string; mission?: string;
  strategicObjectives?: any; strategicInitiatives?: any;
  balancedScorecard?: any; status: string; createdAt: string;
}
export interface Portfolio {
  id: string; code: string; nameAr: string; nameEn: string;
  type: string; parentId?: string; ownerId?: string;
  budget?: number; status: string; progress: number;
  startDate?: string; endDate?: string; createdAt: string;
}
export interface Benchmark {
  id: string; code: string; nameAr: string; nameEn: string;
  metricName: string; industryAvg: number; topPerformerAvg: number;
  companyValue: number; gap: number; insight?: string; recommendation?: string;
}
export interface DataCatalogEntry {
  id: string; code: string; nameAr: string; nameEn: string;
  entityType: string; source?: string; ownerId?: string;
  definition?: string; qualityScore?: number; refreshSchedule?: string;
}
export interface SimulationScenario {
  id: string; nameAr?: string; nameEn?: string;
  scenarioType: string; parameters: any; expectedImpact?: any;
  confidenceScore?: number; status: string;
}
export interface DigitalTwinSnapshot {
  id: string; snapshotDate: string; organizationGraph: any; metricsSummary?: any;
}
