import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Branch = Database["public"]["Tables"]["branches"]["Row"];
type BranchInsert = Database["public"]["Tables"]["branches"]["Insert"];
type BranchUpdate = Database["public"]["Tables"]["branches"]["Update"];

export const branchesService = {
  async list(companyId?: string) {
    let query = supabase
      .from("branches")
      .select("*, companies(name)")
      .is("deleted_at", null)
      .order("name");

    if (companyId) {
      query = query.eq("company_id", companyId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("branches")
      .select("*, companies(name)")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error) throw error;
    return data;
  },

  async create(input: BranchInsert) {
    const { data, error } = await supabase.from("branches").insert(input).select().single();

    if (error) throw error;
    return data as Branch;
  },

  async update(id: string, input: BranchUpdate) {
    const { data, error } = await supabase
      .from("branches")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Branch;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("branches")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  },
};
