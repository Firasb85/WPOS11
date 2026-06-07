import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type JobFamily = Database["public"]["Tables"]["job_families"]["Row"];
type JobGrade = Database["public"]["Tables"]["job_grades"]["Row"];
type Job = Database["public"]["Tables"]["jobs"]["Row"];

export const jobsService = {
  // ── Job Families ──
  async listFamilies() {
    const { data, error } = await supabase
      .from("job_families")
      .select("*")
      .is("deleted_at", null)
      .order("name");
    if (error) throw error;
    return data as JobFamily[];
  },
  async createFamily(input: Database["public"]["Tables"]["job_families"]["Insert"]) {
    const { data, error } = await supabase.from("job_families").insert(input).select().single();
    if (error) throw error;
    return data as JobFamily;
  },
  async deleteFamily(id: string) {
    const { error } = await supabase
      .from("job_families")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  },

  // ── Job Grades ──
  async listGrades() {
    const { data, error } = await supabase
      .from("job_grades")
      .select("*")
      .is("deleted_at", null)
      .order("level");
    if (error) throw error;
    return data as JobGrade[];
  },
  async createGrade(input: Database["public"]["Tables"]["job_grades"]["Insert"]) {
    const { data, error } = await supabase.from("job_grades").insert(input).select().single();
    if (error) throw error;
    return data as JobGrade;
  },
  async deleteGrade(id: string) {
    const { error } = await supabase
      .from("job_grades")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  },

  // ── Jobs ──
  async listJobs() {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .is("deleted_at", null)
      .order("title");
    if (error) throw error;
    return data;
  },
  async createJob(input: Database["public"]["Tables"]["jobs"]["Insert"]) {
    const { data, error } = await supabase.from("jobs").insert(input).select().single();
    if (error) throw error;
    return data as Job;
  },
  async deleteJob(id: string) {
    const { error } = await supabase
      .from("jobs")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  },
};
