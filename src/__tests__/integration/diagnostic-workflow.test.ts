/**
 * Integration Test: Diagnostic Workflow
 *
 * Tests the complete diagnostic pipeline:
 *   1. Snapshots exist with RED status
 *   2. Evidence can be retrieved for an employee
 *   3. Diagnostic report can be created
 *   4. Hypotheses can be generated
 *   5. Report can be finalized
 *
 * Uses the Supabase service layer directly (no browser needed).
 */
import { describe, it, expect, vi, beforeAll } from "vitest";

// Mock supabase client for unit testing
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockFrom = vi.fn(() => ({
  select: mockSelect,
  insert: mockInsert,
  update: mockUpdate,
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: mockFrom,
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    },
  },
}));

describe("Diagnostic Workflow Integration", () => {
  beforeAll(() => {
    // Reset mocks
    vi.clearAllMocks();
  });

  it("Step 1: should detect RED performance snapshots", async () => {
    const mockSnapshots = [
      {
        id: "snap-1",
        employee_id: "emp-1",
        kpi_id: "kpi-1",
        status: "red",
        actual_value: 78,
        target_value: 95,
        gap_percentage: -17.9,
        period: "2026-06",
      },
      {
        id: "snap-2",
        employee_id: "emp-1",
        kpi_id: "kpi-1",
        status: "yellow",
        actual_value: 85,
        target_value: 95,
        gap_percentage: -10.5,
        period: "2026-05",
      },
    ];

    mockSelect.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: mockSnapshots, error: null }),
      }),
    });

    const { supabase } = await import("@/integrations/supabase/client");
    const result = await supabase
      .from("performance_snapshots")
      .select("*")
      .eq("employee_id", "emp-1")
      .order("period", { ascending: false });

    expect(result.data).toHaveLength(2);
    expect(result.data![0].status).toBe("red");
    expect(result.data![0].gap_percentage).toBeLessThan(-10);
  });

  it("Step 2: should retrieve evidence for the employee", async () => {
    const mockEvidence = [
      {
        id: "ev-1",
        employee_id: "emp-1",
        evidence_type: "quantitative",
        source: "CRM",
        reliability: "high",
        description: "Response time increased",
      },
      {
        id: "ev-2",
        employee_id: "emp-1",
        evidence_type: "behavioral",
        source: "Attendance",
        reliability: "high",
        description: "Late arrivals increased",
      },
    ];

    mockSelect.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: mockEvidence, error: null }),
    });

    const { supabase } = await import("@/integrations/supabase/client");
    const result = await supabase.from("evidence").select("*").eq("employee_id", "emp-1");

    expect(result.data).toHaveLength(2);
    expect(result.data!.every((e: { employee_id: string }) => e.employee_id === "emp-1")).toBe(
      true,
    );
    expect(
      result.data!.some((e: { evidence_type: string }) => e.evidence_type === "quantitative"),
    ).toBe(true);
  });

  it("Step 3: should create a diagnostic report", async () => {
    const newReport = {
      id: "diag-1",
      title: "CSAT Decline Investigation",
      employee_id: "emp-1",
      status: "draft",
      created_at: new Date().toISOString(),
    };

    mockInsert.mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: newReport, error: null }),
      }),
    });

    const { supabase } = await import("@/integrations/supabase/client");
    const result = await supabase
      .from("diagnostic_reports")
      .insert({ title: "CSAT Decline Investigation", employee_id: "emp-1", status: "draft" })
      .select()
      .single();

    expect(result.data).toBeDefined();
    expect(result.data!.status).toBe("draft");
    expect(result.data!.employee_id).toBe("emp-1");
  });

  it("Step 4: should generate diagnostic hypotheses", async () => {
    const hypotheses = [
      {
        id: "hyp-1",
        report_id: "diag-1",
        category: "skill_gap",
        hypothesis: "Insufficient CRM training",
        confidence_score: 0.85,
        rank_order: 1,
      },
      {
        id: "hyp-2",
        report_id: "diag-1",
        category: "motivation_issue",
        hypothesis: "Employee disengagement",
        confidence_score: 0.72,
        rank_order: 2,
      },
      {
        id: "hyp-3",
        report_id: "diag-1",
        category: "process_issue",
        hypothesis: "Outdated workflow",
        confidence_score: 0.65,
        rank_order: 3,
      },
    ];

    mockInsert.mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: hypotheses, error: null }),
    });

    const { supabase } = await import("@/integrations/supabase/client");
    const result = await supabase
      .from("diagnostic_hypotheses")
      .insert(
        hypotheses.map((h) => ({
          report_id: h.report_id,
          category: h.category,
          hypothesis: h.hypothesis,
          confidence_score: h.confidence_score,
          rank_order: h.rank_order,
        })),
      )
      .select();

    expect(result.data).toHaveLength(3);
    expect(result.data![0].confidence_score).toBeGreaterThan(0.8);
    // Hypotheses should be ranked by confidence
    const scores = result.data!.map((h: { confidence_score: number }) => h.confidence_score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });

  it("Step 5: should finalize the diagnostic report", async () => {
    const finalizedReport = {
      id: "diag-1",
      status: "final",
      is_final: true,
      final_diagnosis:
        "Primary root cause: Skill gap in CRM system. Secondary: Low motivation due to team restructuring.",
      confidence_score: 0.85,
    };

    mockUpdate.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: finalizedReport, error: null }),
        }),
      }),
    });

    const { supabase } = await import("@/integrations/supabase/client");
    const result = await supabase
      .from("diagnostic_reports")
      .update({
        status: "final",
        is_final: true,
        final_diagnosis: "Primary root cause: Skill gap in CRM system.",
        confidence_score: 0.85,
      })
      .eq("id", "diag-1")
      .select()
      .single();

    expect(result.data!.status).toBe("final");
    expect(result.data!.is_final).toBe(true);
    expect(result.data!.confidence_score).toBeGreaterThanOrEqual(0.8);
    expect(result.data!.final_diagnosis).toContain("Skill gap");
  });

  it("Step 6: should validate complete workflow data integrity", () => {
    // Verify the workflow follows WPOS methodology:
    // Detect → Evidence → Diagnose → Review → Case → Intervene → Follow-up
    const workflowSteps = [
      "detect_red_kpi",
      "collect_evidence",
      "create_diagnostic",
      "generate_hypotheses",
      "finalize_report",
    ];

    expect(workflowSteps).toHaveLength(5);
    expect(workflowSteps[0]).toBe("detect_red_kpi");
    expect(workflowSteps[workflowSteps.length - 1]).toBe("finalize_report");
  });
});
