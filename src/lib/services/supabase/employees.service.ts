import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Employee = Database["public"]["Tables"]["employees"]["Row"];
type EmployeeInsert = Database["public"]["Tables"]["employees"]["Insert"];
type EmployeeUpdate = Database["public"]["Tables"]["employees"]["Update"];

export interface EmployeeListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  teamId?: string;
}

export const employeesService = {
  async list(params: EmployeeListParams = {}) {
    const { page = 1, pageSize = 20, search, teamId } = params;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("employees")
      .select("*, teams(name, departments(name))", { count: "exact" })
      .is("deleted_at", null)
      .order("first_name")
      .range(from, to);

    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,employee_code.ilike.%${search}%`,
      );
    }

    if (teamId) {
      query = query.eq("team_id", teamId);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { data: data ?? [], total: count ?? 0, page, pageSize };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("employees")
      .select("*, teams(name, departments(name, branches(name, companies(name))))")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error) throw error;
    return data;
  },

  async create(input: EmployeeInsert) {
    const { data, error } = await supabase.from("employees").insert(input).select().single();

    if (error) throw error;
    return data as Employee;
  },

  async update(id: string, input: EmployeeUpdate) {
    const { data, error } = await supabase
      .from("employees")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Employee;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("employees")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  },
};
