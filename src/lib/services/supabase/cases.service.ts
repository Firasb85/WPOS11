/**
 * Case Management Service.
 * Uses untyped Supabase client for tables not yet in generated types.
 * Run supabase/migrations/002_cases_interventions.sql first.
 */
import { createClient } from "@supabase/supabase-js";
import { clientEnv } from "@/config/env";

const db = createClient(clientEnv.VITE_SUPABASE_URL, clientEnv.VITE_SUPABASE_PUBLISHABLE_KEY);

export interface CaseRecord {
  id: string;
  case_number: string;
  diagnostic_report_id: string | null;
  employee_id: string;
  department_id: string | null;
  root_cause_category: string | null;
  priority: string;
  status: string;
  description: string | null;
  created_at: string | null;
}

let caseCounter = Date.now() % 10000;
function generateCaseNumber(): string {
  caseCounter += 1;
  return `CAS-${new Date().getFullYear()}-${String(caseCounter).padStart(4, "0")}`;
}

export const casesService = {
  async list(): Promise<CaseRecord[]> {
    const { data, error } = await db
      .from("cases")
      .select("*, employees(first_name, last_name), departments(name)")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as CaseRecord[];
  },

  async getById(id: string) {
    const { data, error } = await db
      .from("cases")
      .select("*, employees(first_name, last_name), departments(name)")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as CaseRecord;
  },

  async createFromDiagnostic(diagnosticReportId: string) {
    const { data: report, error: rErr } = await db
      .from("diagnostic_reports")
      .select("*, diagnostic_hypotheses(category, confidence_score, rank_order)")
      .eq("id", diagnosticReportId)
      .single();
    if (rErr) throw rErr;
    const r = report as Record<string, unknown>;
    const hyps = ((r.diagnostic_hypotheses ?? []) as Array<Record<string, unknown>>).sort(
      (a, b) => ((a.rank_order as number) ?? 99) - ((b.rank_order as number) ?? 99),
    );
    const top = hyps[0];
    const conf = (r.confidence_score as number) ?? 0;
    const prio = conf >= 80 ? "critical" : conf >= 60 ? "high" : conf < 30 ? "low" : "medium";

    const { data, error } = await db
      .from("cases")
      .insert({
        case_number: generateCaseNumber(),
        diagnostic_report_id: diagnosticReportId,
        employee_id: r.employee_id,
        department_id: r.department_id,
        root_cause_category: (top?.category as string) ?? null,
        priority: prio,
        status: "open",
        description: `Auto-created from diagnostic: ${r.title}`,
      })
      .select()
      .single();
    if (error) throw error;

    await db
      .from("diagnostic_reports")
      .update({ status: "final", is_final: true, updated_at: new Date().toISOString() })
      .eq("id", diagnosticReportId);
    return data as CaseRecord;
  },

  async updateStatus(id: string, status: string) {
    const u: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (status === "resolved" || status === "closed") u.closure_date = new Date().toISOString();
    const { data, error } = await db.from("cases").update(u).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await db
      .from("cases")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  },

  async addIntervention(caseId: string, input: { custom_description?: string; cost?: number }) {
    const { data, error } = await db
      .from("case_interventions")
      .insert({ case_id: caseId, ...input })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async addActionPlan(caseId: string, input: { description: string }) {
    const { data: ex } = await db
      .from("action_plans")
      .select("action_number")
      .eq("case_id", caseId)
      .order("action_number", { ascending: false })
      .limit(1);
    const next = (((ex as Array<Record<string, number>>) ?? [])[0]?.action_number ?? 0) + 1;
    const { data, error } = await db
      .from("action_plans")
      .insert({ case_id: caseId, action_number: next, ...input })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async addFollowUp(
    caseId: string,
    input: {
      follow_up_type: string;
      check_in_date: string;
      result?: string;
      notes?: string;
      kpi_value_before?: number;
      kpi_value_after?: number;
    },
  ) {
    const imp =
      input.kpi_value_before && input.kpi_value_after
        ? ((input.kpi_value_after - input.kpi_value_before) / input.kpi_value_before) * 100
        : null;
    const { data, error } = await db
      .from("follow_ups")
      .insert({
        case_id: caseId,
        ...input,
        improvement_pct: imp,
        status: input.result ? "completed" : "scheduled",
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async listInterventionLibrary(): Promise<Record<string, unknown>[]> {
    const { data, error } = await db
      .from("interventions")
      .select("*")
      .eq("is_active", true)
      .order("name_en");
    if (error) throw error;
    return (data ?? []) as Record<string, unknown>[];
  },

  async createInterventionTemplate(input: {
    name_en: string;
    name_ar?: string;
    type: string;
    description?: string;
  }) {
    const { data, error } = await db.from("interventions").insert(input).select().single();
    if (error) throw error;
    return data;
  },
};
