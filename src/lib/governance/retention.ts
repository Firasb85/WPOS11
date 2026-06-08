/**
 * Data Governance — Retention Policies.
 * Defines data retention rules and archival logic.
 */

export interface RetentionPolicy {
  entityType: string;
  retentionDays: number;
  action: "archive" | "delete" | "anonymize";
  description: string;
}

export const RETENTION_POLICIES: RetentionPolicy[] = [
  {
    entityType: "audit_logs",
    retentionDays: 365,
    action: "archive",
    description: "Audit logs archived after 1 year",
  },
  {
    entityType: "sessions",
    retentionDays: 90,
    action: "delete",
    description: "Expired sessions deleted after 90 days",
  },
  {
    entityType: "performance_snapshots",
    retentionDays: 730,
    action: "archive",
    description: "Performance data archived after 2 years",
  },
  {
    entityType: "diagnostic_reports",
    retentionDays: 1095,
    action: "archive",
    description: "Diagnostic reports archived after 3 years",
  },
  {
    entityType: "evidence",
    retentionDays: 730,
    action: "archive",
    description: "Evidence archived after 2 years",
  },
  {
    entityType: "cases",
    retentionDays: 1095,
    action: "archive",
    description: "Closed cases archived after 3 years",
  },
  {
    entityType: "notifications",
    retentionDays: 90,
    action: "delete",
    description: "Read notifications deleted after 90 days",
  },
];

/**
 * Get all entities past their retention period.
 * In production, this would be a server-side cron job.
 */
export function getRetentionPolicySummary() {
  return RETENTION_POLICIES.map((p) => ({
    ...p,
    retentionPeriod:
      p.retentionDays >= 365
        ? `${Math.round(p.retentionDays / 365)} year(s)`
        : `${p.retentionDays} days`,
  }));
}
