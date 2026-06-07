// WPOS Library Index
// Re-exports all WPOS modules for easy importing

// Types
export * from "./types";

// Constants
export { navigation } from "./constants/navigation";

// Context
export { LanguageProvider, useLanguage } from "./context/LanguageContext";

// Auth
export * from "./auth";

// Database
export * from "./db/client";
export {
  roles,
  permissions,
  rolePermissions,
  users,
  sessions,
  auditLogs,
  companies,
  branches,
  departments,
  teams,
  jobFamilies,
  jobGrades,
  jobs,
  employees,
  kpiCategories,
  kpis,
  performanceSnapshots,
  evidence,
  diagnosticReports,
  diagnosticHypotheses,
  cases,
  rootCauses,
  riskRegisters,
  tenants,
  apiKeys,
  notificationTemplates,
} from "./db/schema";

export type { Session, Case, RootCause, Tenant, ApiKey, RiskRegister } from "./db/schema";
