import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Snapshot = Database["public"]["Tables"]["performance_snapshots"]["Row"];
type SnapshotInsert = Database["public"]["Tables"]["performance_snapshots"]["Insert"];

export const snapshotsService = {
  async list(employeeId?: string) {
    let query = supabase
      .from("performance_snapshots")
      .select("*, employees(first_name, last_name), kpis(name, code)")
      .order("created_at", { ascending: false });

    if (employeeId) {
      query = query.eq("employee_id", employeeId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async create(input: SnapshotInsert) {
    // Calculate gap
    const target = Number(input.target_value ?? 0);
    const actual = Number(input.actual_value ?? 0);
    const gapValue = actual - target;
    const gapPercentage = target !== 0 ? (gapValue / target) * 100 : 0;
    let status: string = "green";
    if (gapPercentage < -10) status = "red";
    else if (gapPercentage < 0) status = "yellow";

    const { data, error } = await supabase
      .from("performance_snapshots")
      .insert({
        ...input,
        gap_value: gapValue,
        gap_percentage: gapPercentage,
        status,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Snapshot;
  },

  async delete(id: string) {
    const { error } = await supabase.from("performance_snapshots").delete().eq("id", id);

    if (error) throw error;
  },
};
