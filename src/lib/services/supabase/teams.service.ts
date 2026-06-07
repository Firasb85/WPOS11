import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Team = Database["public"]["Tables"]["teams"]["Row"];
type TeamInsert = Database["public"]["Tables"]["teams"]["Insert"];
type TeamUpdate = Database["public"]["Tables"]["teams"]["Update"];

export const teamsService = {
  async list(departmentId?: string) {
    let query = supabase
      .from("teams")
      .select("*, departments(name, branches(name))")
      .is("deleted_at", null)
      .order("name");

    if (departmentId) {
      query = query.eq("department_id", departmentId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("teams")
      .select("*, departments(name)")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error) throw error;
    return data;
  },

  async create(input: TeamInsert) {
    const { data, error } = await supabase.from("teams").insert(input).select().single();

    if (error) throw error;
    return data as Team;
  },

  async update(id: string, input: TeamUpdate) {
    const { data, error } = await supabase
      .from("teams")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Team;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("teams")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  },
};
