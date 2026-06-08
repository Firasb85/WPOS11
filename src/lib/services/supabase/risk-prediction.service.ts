import { supabase } from "@/integrations/supabase/client";

export interface AtRiskEmployee {
  id: string;
  name: string;
  department: string;
  currentGapPct: number;
  trend: "worsening" | "stable" | "improving";
  breachProbability: number; // 0-100
  riskLevel: "critical" | "high" | "medium" | "low";
  kpiName: string;
  consecutiveRed: number;
}

export interface AtRiskDepartment {
  id: string;
  name: string;
  atRiskCount: number;
  avgBreachProbability: number;
  riskLevel: "critical" | "high" | "medium" | "low";
}

/**
 * Proactive Risk Prediction Service.
 * Analyzes snapshot trends to predict future KPI breaches.
 *
 * Algorithm:
 * 1. Fetch last N snapshots per employee
 * 2. Calculate gap trend (slope of gap_percentage over time)
 * 3. If trending negative → extrapolate to next period
 * 4. Assign breach probability based on:
 *    - Current gap severity
 *    - Trend direction & velocity
 *    - Consecutive red periods
 */
export const riskPredictionService = {
  async getAtRiskEmployees(): Promise<AtRiskEmployee[]> {
    // Fetch all snapshots with employee + KPI data
    const { data: snapshots, error } = await supabase
      .from("performance_snapshots")
      .select(
        "id, employee_id, kpi_id, status, gap_percentage, created_at, employees(first_name, last_name, teams(departments(name))), kpis(name)",
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (!snapshots || snapshots.length === 0) return [];

    // Group snapshots by employee
    const byEmployee: Record<string, typeof snapshots> = {};
    for (const snap of snapshots) {
      const eid = snap.employee_id ?? "";
      if (!byEmployee[eid]) byEmployee[eid] = [];
      byEmployee[eid].push(snap);
    }

    const results: AtRiskEmployee[] = [];

    for (const [empId, empSnaps] of Object.entries(byEmployee)) {
      if (empSnaps.length === 0) continue;

      const latest = empSnaps[0];
      const emp = (latest as Record<string, unknown>).employees as Record<string, unknown> | null;
      const kpi = (latest as Record<string, unknown>).kpis as Record<string, unknown> | null;
      const team = emp?.teams as Record<string, unknown> | null;
      const dept = team?.departments as Record<string, unknown> | null;

      const name = emp ? `${emp.first_name} ${emp.last_name}` : "Unknown";
      const department = (dept?.name as string) ?? "Unknown";
      const kpiName = (kpi?.name as string) ?? "KPI";

      // Calculate trend from gap percentages
      const gaps = empSnaps.map((s) => Number(s.gap_percentage ?? 0)).slice(0, 6); // Last 6 periods

      const currentGap = gaps[0] ?? 0;

      // Calculate trend direction
      let trend: "worsening" | "stable" | "improving" = "stable";
      if (gaps.length >= 2) {
        const avgRecent = (gaps[0] + (gaps[1] ?? 0)) / Math.min(gaps.length, 2);
        const avgOlder =
          gaps.length >= 4 ? (gaps[2] + (gaps[3] ?? 0)) / 2 : (gaps[gaps.length - 1] ?? 0);
        const diff = avgRecent - avgOlder;
        if (diff < -3) trend = "worsening";
        else if (diff > 3) trend = "improving";
      }

      // Count consecutive red periods
      let consecutiveRed = 0;
      for (const s of empSnaps) {
        if (s.status === "red") consecutiveRed++;
        else break;
      }

      // Calculate breach probability
      let breachProb = 0;

      // Factor 1: Current gap severity (0-40 points)
      if (currentGap < -20) breachProb += 40;
      else if (currentGap < -10) breachProb += 25;
      else if (currentGap < -5) breachProb += 15;
      else if (currentGap < 0) breachProb += 5;

      // Factor 2: Trend direction (0-30 points)
      if (trend === "worsening") breachProb += 30;
      else if (trend === "stable" && currentGap < 0) breachProb += 15;

      // Factor 3: Consecutive red periods (0-30 points)
      breachProb += Math.min(consecutiveRed * 10, 30);

      breachProb = Math.min(Math.round(breachProb), 99);

      // Only include employees with meaningful risk
      if (breachProb >= 20) {
        const riskLevel: AtRiskEmployee["riskLevel"] =
          breachProb >= 75
            ? "critical"
            : breachProb >= 50
              ? "high"
              : breachProb >= 30
                ? "medium"
                : "low";

        results.push({
          id: empId,
          name,
          department,
          currentGapPct: Number(currentGap.toFixed(1)),
          trend,
          breachProbability: breachProb,
          riskLevel,
          kpiName,
          consecutiveRed,
        });
      }
    }

    // Sort by breach probability descending
    return results.sort((a, b) => b.breachProbability - a.breachProbability);
  },

  async getAtRiskDepartments(): Promise<AtRiskDepartment[]> {
    const employees = await this.getAtRiskEmployees();

    const byDept: Record<string, { count: number; totalProb: number }> = {};

    for (const emp of employees) {
      if (!byDept[emp.department]) {
        byDept[emp.department] = { count: 0, totalProb: 0 };
      }
      byDept[emp.department].count++;
      byDept[emp.department].totalProb += emp.breachProbability;
    }

    return Object.entries(byDept)
      .map(([name, d]) => {
        const avgProb = Math.round(d.totalProb / d.count);
        return {
          id: name,
          name,
          atRiskCount: d.count,
          avgBreachProbability: avgProb,
          riskLevel: (avgProb >= 75
            ? "critical"
            : avgProb >= 50
              ? "high"
              : avgProb >= 30
                ? "medium"
                : "low") as AtRiskDepartment["riskLevel"],
        };
      })
      .sort((a, b) => b.avgBreachProbability - a.avgBreachProbability);
  },
};
