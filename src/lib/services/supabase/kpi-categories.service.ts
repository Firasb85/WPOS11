import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type KpiCategory = Database["public"]["Tables"]["kpi_categories"]["Row"];
type KpiCategoryInsert = Database["public"]["Tables"]["kpi_categories"]["Insert"];

export const kpiCategoriesService = {
  async list() {
    const { data, error } = await supabase.from("kpi_categories").select("*").order("name");

    if (error) throw error;
    return data as KpiCategory[];
  },

  async create(input: KpiCategoryInsert) {
    const { data, error } = await supabase.from("kpi_categories").insert(input).select().single();

    if (error) throw error;
    return data as KpiCategory;
  },

  async delete(id: string) {
    const { error } = await supabase.from("kpi_categories").delete().eq("id", id);

    if (error) throw error;
  },
};
