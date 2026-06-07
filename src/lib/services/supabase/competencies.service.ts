import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Competency = Database["public"]["Tables"]["competencies"]["Row"];

export const competenciesService = {
  async list() {
    const { data, error } = await supabase
      .from("competencies")
      .select("*")
      .is("deleted_at", null)
      .order("competency_name_en");
    if (error) throw error;
    return data as Competency[];
  },
  async create(input: Database["public"]["Tables"]["competencies"]["Insert"]) {
    const { data, error } = await supabase.from("competencies").insert(input).select().single();
    if (error) throw error;
    return data as Competency;
  },
  async delete(id: string) {
    const { error } = await supabase
      .from("competencies")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  },

  // ── Employee Competencies ──
  async listEmployeeCompetencies(employeeId?: string) {
    let query = supabase
      .from("employee_competencies")
      .select(
        "*, competencies(competency_name_en, competency_name_ar, category), employees(first_name, last_name)",
      )
      .order("assessment_date", { ascending: false });
    if (employeeId) query = query.eq("employee_id", employeeId);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
};
