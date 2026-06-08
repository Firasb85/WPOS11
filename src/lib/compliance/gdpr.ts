/**
 * GDPR Compliance Module.
 * Handles data export requests, deletion requests, and consent management.
 */
import { supabase } from "@/integrations/supabase/client";
import { exportToJSON } from "@/lib/export/csv";

/**
 * Export ALL user data (GDPR Article 20 — Right to Data Portability).
 */
export async function exportUserData(userId: string): Promise<void> {
  const tables = [
    { table: "employees", field: "user_id" },
    { table: "evidence", field: "submitted_by" },
    { table: "diagnostic_reports", field: "generated_by" },
    { table: "audit_logs", field: "user_id" },
    { table: "sessions", field: "user_id" },
  ];

  const allData: Record<string, unknown> = {
    exported_at: new Date().toISOString(),
    user_id: userId,
  };

  for (const { table, field } of tables) {
    try {
      const { data } = await supabase
        .from(table as "employees")
        .select("*")
        .eq(field, userId);
      allData[table] = data ?? [];
    } catch {
      allData[table] = [];
    }
  }

  // Get user profile
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    allData.profile = {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in: user.last_sign_in_at,
      metadata: user.user_metadata,
    };
  }

  exportToJSON(allData, `wpos_user_data_${userId}`);
}

/**
 * Request data deletion (GDPR Article 17 — Right to Erasure).
 * Creates a deletion request record. Actual deletion handled by admin.
 */
export async function requestDataDeletion(
  userId: string,
  reason?: string,
): Promise<{ success: boolean; requestId?: string }> {
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .insert({
        user_id: userId,
        action: "gdpr_deletion_request",
        entity_type: "user",
        entity_id: userId,
        description: `GDPR deletion request: ${reason ?? "User requested account deletion"}`,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, requestId: (data as Record<string, unknown>).id as string };
  } catch {
    return { success: false };
  }
}

/**
 * Consent management — tracks what the user has consented to.
 */
export interface ConsentRecord {
  type: "analytics" | "marketing" | "essential" | "performance";
  granted: boolean;
  timestamp: string;
}

const CONSENT_KEY = "wpos_consent";

export function getConsent(): ConsentRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(CONSENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function setConsent(consents: ConsentRecord[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consents));
}

export function hasConsent(type: ConsentRecord["type"]): boolean {
  return getConsent().some((c) => c.type === type && c.granted);
}
