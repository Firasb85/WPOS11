import { describe, it, expect } from "vitest";
import { RETENTION_POLICIES, getRetentionPolicySummary } from "@/lib/governance/retention";

describe("Data Retention Policies", () => {
  it("has policies for critical tables", () => {
    const tables = RETENTION_POLICIES.map((p) => p.entityType);
    expect(tables).toContain("audit_logs");
    expect(tables).toContain("sessions");
    expect(tables).toContain("performance_snapshots");
    expect(tables).toContain("diagnostic_reports");
  });

  it("all policies have valid actions", () => {
    for (const p of RETENTION_POLICIES) {
      expect(["archive", "delete", "anonymize"]).toContain(p.action);
    }
  });

  it("all retention periods are positive", () => {
    for (const p of RETENTION_POLICIES) {
      expect(p.retentionDays).toBeGreaterThan(0);
    }
  });

  it("summary formats retention periods correctly", () => {
    const summary = getRetentionPolicySummary();
    const auditLog = summary.find((s) => s.entityType === "audit_logs");
    expect(auditLog?.retentionPeriod).toBe("1 year(s)");
  });
});
