import { supabase } from "@/integrations/supabase/client";

export const dashboardService = {
  async getCeoMetrics() {
    const [employees, departments, kpis, snapshots, diagnostics, evidence] = await Promise.all([
      supabase
        .from("employees")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null)
        .eq("is_active", true),
      supabase
        .from("departments")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null),
      supabase.from("kpis").select("id", { count: "exact", head: true }),
      supabase.from("performance_snapshots").select("status, gap_percentage"),
      supabase
        .from("diagnostic_reports")
        .select("status, maturity_level, confidence_score")
        .is("deleted_at", null),
      supabase.from("evidence").select("id", { count: "exact", head: true }).is("deleted_at", null),
    ]);

    const snapshotRows = snapshots.data ?? [];
    const redCount = snapshotRows.filter((s) => s.status === "red").length;
    const yellowCount = snapshotRows.filter((s) => s.status === "yellow").length;
    const greenCount = snapshotRows.filter((s) => s.status === "green").length;
    const totalSnaps = snapshotRows.length;
    const perfIndex =
      totalSnaps > 0 ? Math.round(((greenCount + yellowCount * 0.5) / totalSnaps) * 100) : 100;

    const diagRows = diagnostics.data ?? [];
    const avgMaturity =
      diagRows.length > 0
        ? (diagRows.reduce((s, d) => s + (d.maturity_level ?? 1), 0) / diagRows.length).toFixed(1)
        : "0";

    return {
      totalEmployees: employees.count ?? 0,
      totalDepartments: departments.count ?? 0,
      totalKpis: kpis.count ?? 0,
      totalEvidence: evidence.count ?? 0,
      performanceIndex: perfIndex,
      kpiStatus: { green: greenCount, yellow: yellowCount, red: redCount },
      totalDiagnostics: diagRows.length,
      avgMaturity: Number(avgMaturity),
      diagnosticsByStatus: {
        draft: diagRows.filter((d) => d.status === "draft").length,
        under_review: diagRows.filter((d) => d.status === "under_review").length,
        approved: diagRows.filter((d) => d.status === "approved").length,
      },
    };
  },
};
