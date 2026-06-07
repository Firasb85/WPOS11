import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Evidence = Database["public"]["Tables"]["evidence"]["Row"];
type EvidenceInsert = Database["public"]["Tables"]["evidence"]["Insert"];

export const evidenceService = {
  async list(employeeId?: string) {
    let query = supabase
      .from("evidence")
      .select("*, employees(first_name, last_name)")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (employeeId) {
      query = query.eq("employee_id", employeeId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async create(input: EvidenceInsert) {
    const { data, error } = await supabase.from("evidence").insert(input).select().single();

    if (error) throw error;
    return data as Evidence;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("evidence")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  },
};
