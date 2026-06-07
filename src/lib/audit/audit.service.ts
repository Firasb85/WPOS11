/**
 * WPOS Audit Trail Service
 *
 * Tracks security-relevant events for compliance and forensics.
 * In production, this writes to the audit_logs database table.
 * Falls back to structured logging when DATABASE_URL is unavailable.
 */
import { logger } from "./logger";

export type AuditAction =
  | "auth.login"
  | "auth.logout"
  | "auth.login_failed"
  | "auth.password_change"
  | "user.create"
  | "user.update"
  | "user.delete"
  | "user.activate"
  | "user.deactivate"
  | "role.create"
  | "role.update"
  | "role.delete"
  | "permission.grant"
  | "permission.revoke"
  | "config.update"
  | "api_key.create"
  | "api_key.revoke"
  | "data.export"
  | "report.generate"
  | "diagnostic.create"
  | "diagnostic.approve"
  | "diagnostic.reject"
  | "case.create"
  | "case.close"
  | "case.escalate";

export interface AuditEvent {
  action: AuditAction;
  userId?: string;
  entityType: string;
  entityId?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Record an audit event.
 * Attempts database write first; falls back to structured logging.
 */
export async function recordAuditEvent(event: AuditEvent): Promise<void> {
  const entry = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  // Always log for observability
  logger.info(`[AUDIT] ${event.action}`, entry);

  // Attempt database write if available
  try {
    if (typeof process !== "undefined" && process.env?.DATABASE_URL) {
      // Dynamic import to avoid client bundle inclusion
      const { executeQuery } = await import("@/lib/wpos/db/client");
      await executeQuery(
        `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, description, ip_address)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          event.userId ?? null,
          event.action,
          event.entityType,
          event.entityId ?? null,
          event.description ?? null,
          event.ipAddress ?? null,
        ],
      );
    }
  } catch (error) {
    // Never let audit failures crash the application
    logger.error("[AUDIT] Failed to persist audit event", {
      error: error instanceof Error ? error.message : String(error),
      event: entry,
    });
  }
}

/** Convenience wrappers */
export const audit = {
  login: (userId: string, ip?: string) =>
    recordAuditEvent({
      action: "auth.login",
      userId,
      entityType: "session",
      description: "User logged in",
      ipAddress: ip,
    }),

  logout: (userId: string) =>
    recordAuditEvent({
      action: "auth.logout",
      userId,
      entityType: "session",
      description: "User logged out",
    }),

  loginFailed: (email: string, ip?: string) =>
    recordAuditEvent({
      action: "auth.login_failed",
      entityType: "session",
      description: `Failed login attempt for ${email}`,
      ipAddress: ip,
    }),

  userModified: (
    action: "user.create" | "user.update" | "user.delete",
    userId: string,
    targetUserId: string,
    description: string,
  ) =>
    recordAuditEvent({
      action,
      userId,
      entityType: "user",
      entityId: targetUserId,
      description,
    }),

  configChanged: (userId: string, key: string, description: string) =>
    recordAuditEvent({
      action: "config.update",
      userId,
      entityType: "config",
      entityId: key,
      description,
    }),

  apiKeyEvent: (action: "api_key.create" | "api_key.revoke", userId: string, keyId: string) =>
    recordAuditEvent({
      action,
      userId,
      entityType: "api_key",
      entityId: keyId,
      description: `API key ${action === "api_key.create" ? "created" : "revoked"}`,
    }),
};
