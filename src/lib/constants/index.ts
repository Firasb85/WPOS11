export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ORG_ADMIN: 'organization_admin',
  HR_DIRECTOR: 'hr_director',
  LD_MANAGER: 'ld_manager',
  DEPT_MANAGER: 'department_manager',
  SUPERVISOR: 'supervisor',
  ANALYST: 'analyst',
} as const;

export const EVIDENCE_TYPES = {
  QUANTITATIVE: 'quantitative',
  QUALITATIVE: 'qualitative',
  BEHAVIORAL: 'behavioral',
  SYSTEM_GENERATED: 'system_generated',
  CONTEXTUAL: 'contextual',
  TEMPORAL: 'temporal',
} as const;

export const DIAGNOSTIC_CATEGORIES = {
  SKILL_GAP: 'skill_gap',
  KNOWLEDGE_GAP: 'knowledge_gap',
  PROCESS_ISSUE: 'process_issue',
  TOOL_ISSUE: 'tool_issue',
  ENVIRONMENTAL_ISSUE: 'environmental_issue',
  RESOURCE_ISSUE: 'resource_issue',
  MANAGEMENT_ISSUE: 'management_issue',
  MOTIVATION_ISSUE: 'motivation_issue',
  WORKLOAD_ISSUE: 'workload_issue',
  POLICY_ISSUE: 'policy_issue',
} as const;

export const SNAPSHOT_STATUS = { GREEN: 'green', YELLOW: 'yellow', RED: 'red' } as const;

export const EVIDENCE_TYPE_LABELS: Record<string, { en: string; ar: string }> = {
  quantitative: { en: 'Quantitative', ar: 'كمي' },
  qualitative: { en: 'Qualitative', ar: 'نوعي' },
  behavioral: { en: 'Behavioral', ar: 'سلوكي' },
  system_generated: { en: 'System Generated', ar: 'منشأ من النظام' },
  contextual: { en: 'Contextual', ar: 'سياقي' },
  temporal: { en: 'Temporal', ar: 'زمني' },
};

export const DIAGNOSTIC_CATEGORY_LABELS: Record<string, { en: string; ar: string }> = {
  skill_gap: { en: 'Skill Gap', ar: 'فجوة مهارية' },
  knowledge_gap: { en: 'Knowledge Gap', ar: 'فجوة معرفية' },
  process_issue: { en: 'Process Issue', ar: 'مشكلة إجرائية' },
  tool_issue: { en: 'Tool Issue', ar: 'مشكلة أدوات' },
  environmental_issue: { en: 'Environmental Issue', ar: 'مشكلة بيئية' },
  resource_issue: { en: 'Resource Issue', ar: 'مشكلة موارد' },
  management_issue: { en: 'Management Issue', ar: 'مشكلة إدارية' },
  motivation_issue: { en: 'Motivation Issue', ar: 'مشكلة تحفيز' },
  workload_issue: { en: 'Workload Issue', ar: 'مشكلة عبء عمل' },
  policy_issue: { en: 'Policy Issue', ar: 'مشكلة سياسات' },
};

export const APP_NAME = 'WPOS';
export const APP_NAME_FULL = 'Workforce Performance Operating System';
export const APP_VERSION = '1.0.0';
export const DEFAULT_PAGE_SIZE = 20;

export const STATUS_COLORS: Record<string, string> = {
  green: '#22c55e', yellow: '#eab308', red: '#ef4444',
  good: '#22c55e', warning: '#eab308', critical: '#ef4444',
  low: '#22c55e', medium: '#eab308', high: '#f97316',
};
