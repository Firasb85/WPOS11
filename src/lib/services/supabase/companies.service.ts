import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Company = Database["public"]["Tables"]["companies"]["Row"];
type CompanyInsert = Database["public"]["Tables"]["companies"]["Insert"];
type CompanyUpdate = Database["public"]["Tables"]["companies"]["Update"];

export const companiesService = {
  async list() {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .is("deleted_at", null)
      .order("name");

    if (error) throw error;
    return data as Company[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error) throw error;
    return data as Company;
  },

  async create(input: CompanyInsert) {
    const { data, error } = await supabase.from("companies").insert(input).select().single();

    if (error) throw error;
    return data as Company;
  },

  async update(id: string, input: CompanyUpdate) {
    const { data, error } = await supabase
      .from("companies")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Company;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("companies")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  },
};
