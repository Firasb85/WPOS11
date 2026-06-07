import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Department = Database["public"]["Tables"]["departments"]["Row"];
type DepartmentInsert = Database["public"]["Tables"]["departments"]["Insert"];
type DepartmentUpdate = Database["public"]["Tables"]["departments"]["Update"];

export const departmentsService = {
  async list(branchId?: string) {
    let query = supabase
      .from("departments")
      .select("*, branches(name, companies(name))")
      .is("deleted_at", null)
      .order("name");

    if (branchId) {
      query = query.eq("branch_id", branchId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("departments")
      .select("*, branches(name)")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error) throw error;
    return data;
  },

  async create(input: DepartmentInsert) {
    const { data, error } = await supabase.from("departments").insert(input).select().single();

    if (error) throw error;
    return data as Department;
  },

  async update(id: string, input: DepartmentUpdate) {
    const { data, error } = await supabase
      .from("departments")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Department;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("departments")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  },
};
