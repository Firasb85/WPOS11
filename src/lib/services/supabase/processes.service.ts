import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Process = Database["public"]["Tables"]["processes"]["Row"];

export const processesService = {
  async list() {
    const { data, error } = await supabase
      .from("processes")
      .select("*, departments(name)")
      .is("deleted_at", null)
      .order("name");
    if (error) throw error;
    return data;
  },
  async create(input: Database["public"]["Tables"]["processes"]["Insert"]) {
    const { data, error } = await supabase.from("processes").insert(input).select().single();
    if (error) throw error;
    return data as Process;
  },
  async delete(id: string) {
    const { error } = await supabase
      .from("processes")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  },

  // ── Process Steps ──
  async listSteps(processId: string) {
    const { data, error } = await supabase
      .from("process_steps")
      .select("*")
      .eq("process_id", processId)
      .order("step_number");
    if (error) throw error;
    return data;
  },
  async createStep(input: Database["public"]["Tables"]["process_steps"]["Insert"]) {
    const { data, error } = await supabase.from("process_steps").insert(input).select().single();
    if (error) throw error;
    return data;
  },
};
