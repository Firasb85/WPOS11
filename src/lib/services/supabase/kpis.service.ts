import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Kpi = Database["public"]["Tables"]["kpis"]["Row"];
type KpiInsert = Database["public"]["Tables"]["kpis"]["Insert"];
type KpiUpdate = Database["public"]["Tables"]["kpis"]["Update"];

export const kpisService = {
  async list(categoryId?: string) {
    let query = supabase.from("kpis").select("*, kpi_categories(name)").order("name");

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("kpis")
      .select("*, kpi_categories(name)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(input: KpiInsert) {
    const { data, error } = await supabase.from("kpis").insert(input).select().single();

    if (error) throw error;
    return data as Kpi;
  },

  async update(id: string, input: KpiUpdate) {
    const { data, error } = await supabase
      .from("kpis")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Kpi;
  },

  async delete(id: string) {
    const { error } = await supabase.from("kpis").delete().eq("id", id);
    if (error) throw error;
  },
};
