/**
 * Client-side audit event logger.
 * Calls the audit service to record CRUD actions.
 * Safe to call from React Query onSuccess callbacks.
 */
import { supabase } from "@/integrations/supabase/client";

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "APPROVE"
  | "REJECT"
  | "SUBMIT"
  | "EXPORT";

interface AuditParams {
  action: AuditAction;
  entityType: string;
  entityId?: string;
  description?: string;
}

export async function logAuditEvent(params: AuditParams): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("audit_logs").insert({
      user_id: user?.id ?? null,
      action: params.action.toLowerCase(),
      entity_type: params.entityType,
      entity_id: params.entityId ?? null,
      description: params.description ?? `${params.action} ${params.entityType}`,
    });
  } catch {
    // Never let audit failures crash the app
    console.warn("[Audit] Failed to log event:", params);
  }
}
