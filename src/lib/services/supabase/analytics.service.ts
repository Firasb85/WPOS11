import { supabase } from "@/integrations/supabase/client";

export const analyticsService = {
  async getDepartmentMetrics() {
    const { data: depts } = await supabase
      .from("departments")
      .select("id, name")
      .is("deleted_at", null);
    const { data: emps } = await supabase
      .from("employees")
      .select("id, team_id, teams(department_id)")
      .is("deleted_at", null)
      .eq("is_active", true);
    const { data: snaps } = await supabase
      .from("performance_snapshots")
      .select("employee_id, status, gap_percentage");

    const deptMap: Record<
      string,
      { name: string; employees: number; greenKpis: number; yellowKpis: number; redKpis: number }
    > = {};
    for (const d of depts ?? []) {
      deptMap[d.id] = { name: d.name, employees: 0, greenKpis: 0, yellowKpis: 0, redKpis: 0 };
    }

    // Count employees per department
    for (const e of emps ?? []) {
      const t = (e as Record<string, unknown>).teams as Record<string, unknown> | null;
      const deptId = t?.department_id as string;
      if (deptId && deptMap[deptId]) deptMap[deptId].employees++;
    }

    // Count snapshot statuses per employee's department
    for (const s of snaps ?? []) {
      const emp = (emps ?? []).find((e) => e.id === s.employee_id);
      const t = (emp as Record<string, unknown>)?.teams as Record<string, unknown> | null;
      const deptId = t?.department_id as string;
      if (deptId && deptMap[deptId]) {
        if (s.status === "green") deptMap[deptId].greenKpis++;
        else if (s.status === "yellow") deptMap[deptId].yellowKpis++;
        else if (s.status === "red") deptMap[deptId].redKpis++;
      }
    }

    return Object.entries(deptMap).map(([id, d]) => ({ id, ...d }));
  },

  async getEvidenceMetrics() {
    const { data } = await supabase
      .from("evidence")
      .select("evidence_type, reliability, reliability_score")
      .is("deleted_at", null);
    const items = data ?? [];
    const byType: Record<string, number> = {};
    const byReliability: Record<string, number> = {};
    for (const e of items) {
      byType[e.evidence_type] = (byType[e.evidence_type] ?? 0) + 1;
      byReliability[e.reliability ?? "medium"] =
        (byReliability[e.reliability ?? "medium"] ?? 0) + 1;
    }
    return { total: items.length, byType, byReliability };
  },

  async getDiagnosticMetrics() {
    const { data } = await supabase
      .from("diagnostic_reports")
      .select("status, maturity_level, confidence_score, department_id, departments(name)")
      .is("deleted_at", null);
    const items = data ?? [];
    const byStatus: Record<string, number> = {};
    const byDept: Record<string, { count: number; totalConf: number }> = {};
    let totalMaturity = 0;
    let totalConfidence = 0;

    for (const d of items) {
      byStatus[d.status ?? "draft"] = (byStatus[d.status ?? "draft"] ?? 0) + 1;
      totalMaturity += d.maturity_level ?? 1;
      totalConfidence += d.confidence_score ?? 0;
      const deptName =
        (((d as Record<string, unknown>).departments as Record<string, unknown>)?.name as string) ??
        "Unknown";
      if (!byDept[deptName]) byDept[deptName] = { count: 0, totalConf: 0 };
      byDept[deptName].count++;
      byDept[deptName].totalConf += d.confidence_score ?? 0;
    }

    return {
      total: items.length,
      avgMaturity: items.length ? +(totalMaturity / items.length).toFixed(1) : 0,
      avgConfidence: items.length ? +(totalConfidence / items.length).toFixed(1) : 0,
      byStatus,
      byDepartment: Object.entries(byDept).map(([name, v]) => ({
        name,
        count: v.count,
        avgConfidence: +(v.totalConf / v.count).toFixed(1),
      })),
    };
  },

  async getRootCauseMetrics() {
    const { data } = await supabase
      .from("diagnostic_hypotheses")
      .select("category, confidence_score, rank_order")
      .eq("rank_order", 1);
    const items = data ?? [];
    const byCategory: Record<string, number> = {};
    for (const h of items) {
      byCategory[h.category] = (byCategory[h.category] ?? 0) + 1;
    }
    const total = items.length || 1;
    return Object.entries(byCategory)
      .map(([category, count]) => ({
        category: category.replace("_", " "),
        count,
        pct: +((count / total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count);
  },
};
