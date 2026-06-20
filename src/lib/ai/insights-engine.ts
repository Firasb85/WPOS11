/**
 * WPOS Insights Engine.
 * Generates structured suggestions from WPOS data patterns.
 * Uses rule-based analysis (no external LLM API required).
 *
 * NOTE: Framed in product copy as the "Insights" capability. Deterministic
 * SQL queries + thresholds — fully explainable, no black box.
 */
import { supabase } from "@/integrations/supabase/client";

export interface AIInsight {
  id: string;
  type: "warning" | "suggestion" | "achievement" | "trend";
  title: string;
  description: string;
  confidence: number; // 0-100
  priority: "critical" | "high" | "medium" | "low";
  entityType?: string;
  entityId?: string;
  actionable: boolean;
  suggestedAction?: string;
  generatedAt: string;
}

/**
 * Generate workforce insights from current data.
 */
export async function generateInsights(): Promise<AIInsight[]> {
  const insights: AIInsight[] = [];
  const now = new Date().toISOString();
  let counter = 0;
  const nextId = () => `insight-${++counter}`;

  try {
    // 1. Check for underperformers with no diagnostic
    const { data: redSnaps } = await supabase
      .from("performance_snapshots")
      .select("employee_id, employees(first_name, last_name)")
      .eq("status", "red");

    const { data: diagnostics } = await supabase
      .from("diagnostic_reports")
      .select("employee_id")
      .is("deleted_at", null);

    const diagEmployees = new Set((diagnostics ?? []).map((d) => d.employee_id));
    const uninvestigated = (redSnaps ?? []).filter((s) => !diagEmployees.has(s.employee_id));

    if (uninvestigated.length > 0) {
      const emp = (uninvestigated[0] as Record<string, unknown>).employees as Record<
        string,
        unknown
      > | null;
      insights.push({
        id: nextId(),
        type: "warning",
        title: `${uninvestigated.length} underperforming employee(s) without diagnostic`,
        description: `${emp ? `${emp.first_name} ${emp.last_name}` : "Employee"} and ${uninvestigated.length - 1} others have RED KPIs but no diagnostic investigation has been initiated.`,
        confidence: 95,
        priority: "high",
        actionable: true,
        suggestedAction: "Create a diagnostic report for each underperformer",
        generatedAt: now,
      });
    }

    // 2. Check for stale diagnostics (under review > 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: staleDiags } = await supabase
      .from("diagnostic_reports")
      .select("id, title")
      .eq("status", "under_review")
      .lt("updated_at", sevenDaysAgo);

    if ((staleDiags ?? []).length > 0) {
      insights.push({
        id: nextId(),
        type: "warning",
        title: `${(staleDiags ?? []).length} diagnostic(s) awaiting review for 7+ days`,
        description:
          "Delayed reviews slow down the performance improvement cycle. Consider setting review SLAs.",
        confidence: 90,
        priority: "medium",
        actionable: true,
        suggestedAction: "Review pending diagnostics or escalate to department head",
        generatedAt: now,
      });
    }

    // 3. Workforce trend analysis
    const { data: allSnaps } = await supabase.from("performance_snapshots").select("status");

    if (allSnaps && allSnaps.length > 0) {
      const greenPct =
        (allSnaps.filter((s) => s.status === "green").length / allSnaps.length) * 100;

      if (greenPct >= 80) {
        insights.push({
          id: nextId(),
          type: "achievement",
          title: `${Math.round(greenPct)}% of KPIs are GREEN`,
          description:
            "Your workforce performance is strong. Continue monitoring and maintaining current practices.",
          confidence: 95,
          priority: "low",
          actionable: false,
          generatedAt: now,
        });
      } else if (greenPct < 50) {
        insights.push({
          id: nextId(),
          type: "warning",
          title: `Only ${Math.round(greenPct)}% of KPIs are on target`,
          description:
            "More than half of your KPI measurements are below target. Consider a workforce-wide performance review.",
          confidence: 90,
          priority: "critical",
          actionable: true,
          suggestedAction: "Initiate department-level diagnostic reviews",
          generatedAt: now,
        });
      }
    }

    // 4. Check for departments without any KPI measurements
    const { data: depts } = await supabase
      .from("departments")
      .select("id, name")
      .is("deleted_at", null);
    const { data: empSnaps } = await supabase
      .from("performance_snapshots")
      .select("employee_id, employees(team_id, teams(department_id))");

    const measuredDepts = new Set(
      (empSnaps ?? [])
        .map((s) => {
          const emp = (s as Record<string, unknown>).employees as Record<string, unknown> | null;
          const team = emp?.teams as Record<string, unknown> | null;
          return team?.department_id as string;
        })
        .filter(Boolean),
    );

    const unmeasuredDepts = (depts ?? []).filter((d) => !measuredDepts.has(d.id));
    if (unmeasuredDepts.length > 0) {
      insights.push({
        id: nextId(),
        type: "suggestion",
        title: `${unmeasuredDepts.length} department(s) have no KPI measurements`,
        description: `Departments like "${unmeasuredDepts[0]?.name}" have no performance data. Start recording snapshots.`,
        confidence: 85,
        priority: "medium",
        actionable: true,
        suggestedAction: "Record performance snapshots for all departments",
        generatedAt: now,
      });
    }

    // 5. Evidence quality insight
    const { data: evidence } = await supabase
      .from("evidence")
      .select("reliability")
      .is("deleted_at", null);

    if (evidence && evidence.length > 0) {
      const highRel = evidence.filter((e) => e.reliability === "high").length;
      const highPct = (highRel / evidence.length) * 100;

      if (highPct < 30) {
        insights.push({
          id: nextId(),
          type: "suggestion",
          title: "Low proportion of high-reliability evidence",
          description: `Only ${Math.round(highPct)}% of evidence items are marked as high reliability. Consider using more system-generated data sources.`,
          confidence: 80,
          priority: "medium",
          actionable: true,
          suggestedAction:
            "Integrate system-generated evidence (KPI data, attendance records) for higher reliability",
          generatedAt: now,
        });
      }
    }
  } catch {
    // Never crash — return whatever insights we generated
  }

  return insights.sort((a, b) => {
    const pOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return (pOrder[a.priority] ?? 3) - (pOrder[b.priority] ?? 3);
  });
}
