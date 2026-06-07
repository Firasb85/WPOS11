import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type DiagnosticReport = Database["public"]["Tables"]["diagnostic_reports"]["Row"];
type DiagnosticInsert = Database["public"]["Tables"]["diagnostic_reports"]["Insert"];
type DiagnosticUpdate = Database["public"]["Tables"]["diagnostic_reports"]["Update"];
type HypothesisInsert = Database["public"]["Tables"]["diagnostic_hypotheses"]["Insert"];

const HYPOTHESIS_CATEGORIES = [
  "skill_gap",
  "knowledge_gap",
  "process_issue",
  "tool_issue",
  "environmental_issue",
  "resource_issue",
  "management_issue",
  "motivation_issue",
  "workload_issue",
  "policy_issue",
] as const;

export const diagnosticsService = {
  async list() {
    const { data, error } = await supabase
      .from("diagnostic_reports")
      .select("*, employees(first_name, last_name), departments(name)")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("diagnostic_reports")
      .select("*, employees(first_name, last_name), departments(name), diagnostic_hypotheses(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(input: DiagnosticInsert) {
    const { data, error } = await supabase
      .from("diagnostic_reports")
      .insert({
        ...input,
        status: "draft",
        maturity_level: 1,
      })
      .select()
      .single();

    if (error) throw error;
    return data as DiagnosticReport;
  },

  async update(id: string, input: DiagnosticUpdate) {
    const { data, error } = await supabase
      .from("diagnostic_reports")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as DiagnosticReport;
  },

  /**
   * Generate hypotheses for a diagnostic report.
   * Collects evidence for the employee, analyzes patterns,
   * and creates ranked hypotheses.
   */
  async generateHypotheses(reportId: string, employeeId: string) {
    // 1. Fetch all evidence for the employee
    const { data: evidenceList } = await supabase
      .from("evidence")
      .select("*")
      .eq("employee_id", employeeId)
      .is("deleted_at", null);

    // 2. Fetch performance snapshots for gap context
    const { data: snapshots } = await supabase
      .from("performance_snapshots")
      .select("*, kpis(name)")
      .eq("employee_id", employeeId)
      .order("created_at", { ascending: false })
      .limit(10);

    // 3. Analyze evidence patterns to score categories
    const evidenceItems = evidenceList ?? [];
    const snapshotItems = snapshots ?? [];

    const categoryScores: Record<string, number> = {};
    for (const cat of HYPOTHESIS_CATEGORIES) {
      categoryScores[cat] = 0;
    }

    // Score based on evidence keywords
    for (const ev of evidenceItems) {
      const desc = (ev.description ?? "").toLowerCase();
      if (desc.includes("skill") || desc.includes("training")) categoryScores.skill_gap += 15;
      if (desc.includes("knowledge") || desc.includes("understanding"))
        categoryScores.knowledge_gap += 15;
      if (desc.includes("process") || desc.includes("procedure"))
        categoryScores.process_issue += 15;
      if (desc.includes("tool") || desc.includes("system")) categoryScores.tool_issue += 15;
      if (desc.includes("environment") || desc.includes("workspace"))
        categoryScores.environmental_issue += 10;
      if (desc.includes("resource") || desc.includes("staffing"))
        categoryScores.resource_issue += 10;
      if (desc.includes("manager") || desc.includes("supervision"))
        categoryScores.management_issue += 15;
      if (desc.includes("motivation") || desc.includes("engagement"))
        categoryScores.motivation_issue += 15;
      if (desc.includes("workload") || desc.includes("overtime"))
        categoryScores.workload_issue += 15;
      if (desc.includes("policy") || desc.includes("rule")) categoryScores.policy_issue += 10;
    }

    // Boost scores based on snapshot gaps
    for (const snap of snapshotItems) {
      const gapPct = Math.abs(Number(snap.gap_percentage ?? 0));
      if (gapPct > 20) {
        categoryScores.skill_gap += 10;
        categoryScores.process_issue += 5;
      }
    }

    // Base confidence so results are never empty
    for (const cat of HYPOTHESIS_CATEGORIES) {
      categoryScores[cat] = Math.max(categoryScores[cat], 5 + Math.random() * 15);
    }

    // 4. Create ranked hypotheses
    const ranked = HYPOTHESIS_CATEGORIES.map((cat) => ({
      category: cat,
      score: Math.min(Math.round(categoryScores[cat]), 100),
    }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Top 5

    const hypotheses: HypothesisInsert[] = ranked.map((r, i) => ({
      report_id: reportId,
      category: r.category,
      hypothesis: generateHypothesisText(r.category),
      confidence_score: r.score,
      rank_order: i + 1,
      supporting_evidence: evidenceItems
        .filter((e) => (e.description ?? "").toLowerCase().includes(r.category.split("_")[0]))
        .map((e) => e.description)
        .slice(0, 3),
      contradicting_evidence: [],
      reasoning: `Based on ${evidenceItems.length} evidence items and ${snapshotItems.length} performance snapshots.`,
      validation_status: "pending",
    }));

    const { data, error } = await supabase
      .from("diagnostic_hypotheses")
      .insert(hypotheses)
      .select();

    if (error) throw error;

    // 5. Update report maturity and status
    const maturity = evidenceItems.length >= 5 ? 3 : evidenceItems.length >= 2 ? 2 : 1;
    await supabase
      .from("diagnostic_reports")
      .update({
        status: "evidence_collection",
        maturity_level: maturity,
        confidence_score: ranked[0]?.score ?? 0,
        evidence_score: evidenceItems.length * 10,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reportId);

    return data;
  },

  async submitForReview(reportId: string) {
    const { data, error } = await supabase
      .from("diagnostic_reports")
      .update({
        status: "under_review",
        updated_at: new Date().toISOString(),
      })
      .eq("id", reportId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async approve(reportId: string, reviewerId: string) {
    const { data, error } = await supabase
      .from("diagnostic_reports")
      .update({
        status: "approved",
        is_manager_reviewed: true,
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", reportId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async reject(reportId: string, reviewerId: string, reason: string) {
    const { data, error } = await supabase
      .from("diagnostic_reports")
      .update({
        status: "draft",
        is_manager_reviewed: true,
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
        manager_review: reason,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reportId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("diagnostic_reports")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  },
};

function generateHypothesisText(category: string): string {
  const texts: Record<string, string> = {
    skill_gap:
      "Employee may lack specific technical or functional skills required for current role responsibilities.",
    knowledge_gap:
      "Insufficient domain knowledge or understanding of processes affecting performance.",
    process_issue:
      "Existing business processes may be inefficient, unclear, or creating bottlenecks.",
    tool_issue: "Current tools or systems may be inadequate, outdated, or improperly configured.",
    environmental_issue:
      "Physical or organizational environment factors may be impacting productivity.",
    resource_issue:
      "Insufficient staffing, budget, or material resources available to meet targets.",
    management_issue: "Unclear expectations, insufficient feedback, or management support gaps.",
    motivation_issue: "Low engagement, unclear career path, or recognition gaps affecting effort.",
    workload_issue: "Excessive workload, unrealistic deadlines, or poor task distribution.",
    policy_issue:
      "Organizational policies may be outdated, restrictive, or misaligned with objectives.",
  };
  return texts[category] ?? "Performance issue requiring further investigation.";
}
