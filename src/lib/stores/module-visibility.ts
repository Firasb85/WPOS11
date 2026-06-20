/**
 * Module Visibility Store
 *
 * Allows ADMIN to toggle which sidebar modules are visible for ALL users.
 * Persisted in localStorage; could be extended to save in Supabase.
 *
 * Keys match the `moduleKey` property on SecureNavItem.
 */

const STORAGE_KEY = "wpos_module_visibility";

export interface ModuleVisibilityConfig {
  [moduleKey: string]: boolean;
}

/** All modules are visible by default */
const DEFAULT_VISIBILITY: ModuleVisibilityConfig = {
  dashboards: true,
  organization: true,
  jobs: true,
  competency: true,
  processes: true,
  "process-engineering": true,
  kpis: true,
  snapshots: true,
  evidence: true,
  diagnostics: true,
  cases: true,
  interventions: true,
  journey: true,
  risk: true,
  maturity: true,
  "knowledge-graph": true,
  "ai-assistant": true,
  analytics: true,
  reports: true,
  notifications: true,
  admin: true,
  advanced: true,
  profile: true,
  integrations: true,
  "pilot-results": true,
};

export function getModuleVisibility(): ModuleVisibilityConfig {
  if (typeof window === "undefined") return DEFAULT_VISIBILITY;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_VISIBILITY, ...JSON.parse(stored) };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_VISIBILITY };
}

export function setModuleVisibility(config: ModuleVisibilityConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  // Dispatch event so sidebar re-renders
  window.dispatchEvent(new CustomEvent("wpos:module-visibility-changed"));
}

export function isModuleVisible(moduleKey: string): boolean {
  const config = getModuleVisibility();
  return config[moduleKey] !== false; // default true if key missing
}

export function getAllModuleKeys(): string[] {
  return Object.keys(DEFAULT_VISIBILITY);
}

export function getModuleLabel(key: string): string {
  const labels: Record<string, string> = {
    dashboards: "Dashboards",
    organization: "Organization",
    jobs: "Job Architecture",
    competency: "Competency",
    processes: "Process Architecture",
    "process-engineering": "Process Engineering",
    kpis: "KPIs",
    snapshots: "Performance Snapshots",
    evidence: "Evidence",
    diagnostics: "Diagnostics",
    cases: "Case Management",
    interventions: "Interventions",
    journey: "Performance Journey",
    risk: "Workforce Risk",
    maturity: "Maturity",
    "knowledge-graph": "Knowledge Graph",
    "ai-assistant": "Insights Assistant",
    "pilot-results": "Pilot Results",
    analytics: "Analytics",
    reports: "Reports",
    notifications: "Notifications",
    admin: "Administration",
    advanced: "Advanced",
  };
  return labels[key] || key;
}
