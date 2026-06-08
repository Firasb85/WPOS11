import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useDiagnosticMetrics, useRootCauseMetrics } from "@/hooks/useAnalytics";
import { useEvidence } from "@/hooks/useDiagnosticWorkflow";
import { useEmployeesList } from "@/hooks/useOrganization";
import { useSnapshots } from "@/hooks/useKpis";
import { GuidedDiagnosticWizard } from "@/components/diagnostics/GuidedDiagnosticWizard";
import { EvidenceCorrelationHeatmap } from "@/components/diagnostics/EvidenceCorrelationHeatmap";
import { EvidenceImpactSorter } from "@/components/diagnostics/EvidenceImpactSorter";
import { PeerComparison } from "@/components/diagnostics/PeerComparison";
import {
  Stethoscope,
  Brain,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  BarChart3,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboards/diagnostic-intelligence")({
  component: DiagnosticIntelligencePage,
});

function DiagnosticIntelligencePage() {
  const { t, lang: l } = useLanguage();
  const { data: diagMetrics } = useDiagnosticMetrics();
  const { data: rootCauses } = useRootCauseMetrics();
  const { data: allEvidence } = useEvidence();
  const { data: empData } = useEmployeesList({ pageSize: 100 });
  const { data: snapshots } = useSnapshots();
  const [showWizard, setShowWizard] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState("");

  const dm = diagMetrics ?? {
    total: 0,
    avgMaturity: 0,
    avgConfidence: 0,
    byStatus: {},
    byDepartment: [],
  };
  const causes = rootCauses ?? [];
  const evidence = (allEvidence ?? []) as Array<{
    id: string;
    evidence_type: string;
    source: string;
    description: string;
    reliability: string | null;
    reliability_score: number | null;
  }>;
  const employees = empData?.data ?? [];

  // Find underperformers
  const underperformers = employees.filter((emp) =>
    (snapshots ?? []).some((s) => s.employee_id === emp.id && s.status === "red"),
  );

  const selectedEmp = employees.find((e) => e.id === selectedEmpId);

  return (
    <div>
      <PageHeader
        title="Performance Diagnostics"
        titleAr="تشخيصات الأداء"
        description="Step-by-step diagnostic engine with evidence analysis and root cause detection"
        descriptionAr="محرك التشخيص خطوة بخطوة مع تحليل الأدلة واكتشاف الأسباب الجذرية"
        currentLang={l}
        actions={
          <button
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
          >
            <Sparkles className="w-4 h-4" />
            {t("Start Guided Diagnostic", "بدء التشخيص الموجه")}
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title={t("Total Reports", "التقارير")}
          value={String(dm.total)}
          icon={<Stethoscope />}
          status="good"
        />
        <StatsCard
          title={t("Avg Maturity", "متوسط النضج")}
          value={String(dm.avgMaturity)}
          icon={<TrendingUp />}
          status={dm.avgMaturity >= 3 ? "good" : "warning"}
        />
        <StatsCard
          title={t("Avg Confidence", "متوسط الثقة")}
          value={`${dm.avgConfidence}%`}
          icon={<Brain />}
          status={dm.avgConfidence >= 60 ? "good" : "warning"}
        />
        <StatsCard
          title={t("At-Risk Employees", "موظفون في خطر")}
          value={String(underperformers.length)}
          icon={<AlertTriangle />}
          status={underperformers.length > 0 ? "critical" : "good"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Root Cause Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>
              <BarChart3 className="w-4 h-4 inline mr-2" />
              {t("Root Cause Distribution", "توزيع الأسباب الجذرية")}
            </CardTitle>
          </CardHeader>
          {causes.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              {t(
                "No data yet — run diagnostics first",
                "لا توجد بيانات — قم بتشغيل التشخيصات أولاً",
              )}
            </p>
          ) : (
            <div className="space-y-3">
              {causes.map((c) => (
                <div key={c.category} className="flex items-center gap-3">
                  <div className="w-28 text-xs font-medium capitalize truncate">{c.category}</div>
                  <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden relative">
                    <div
                      className="h-full bg-blue-500 rounded"
                      style={{
                        width: `${Math.max(c.pct, 5)}%`,
                      }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                      {c.count} ({c.pct}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Peer Comparison Selector */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Users className="w-4 h-4 inline mr-2" />
              {t("Employee Peer Comparison", "مقارنة الموظف بالأقران")}
            </CardTitle>
          </CardHeader>
          <div className="mb-3">
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
            >
              <option value="">
                {t("Select employee to compare...", "اختر موظفاً للمقارنة...")}
              </option>
              {underperformers.length > 0 && (
                <optgroup label={t("⚠ At-Risk Employees", "⚠ موظفون في خطر")}>
                  {underperformers.map((e) => (
                    <option key={e.id} value={e.id}>
                      🔴 {e.first_name} {e.last_name}
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label={t("All Employees", "جميع الموظفين")}>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.first_name} {e.last_name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          {selectedEmpId && selectedEmp ? (
            <PeerComparison
              employeeId={selectedEmpId}
              employeeName={`${selectedEmp.first_name} ${selectedEmp.last_name}`}
            />
          ) : (
            <p className="text-xs text-gray-400 text-center py-4">
              {t(
                "Select an employee above to see peer comparison",
                "اختر موظفاً أعلاه لعرض المقارنة",
              )}
            </p>
          )}
        </Card>
      </div>

      {/* Evidence Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <EvidenceImpactSorter evidence={evidence} />
        </Card>
        <Card>
          <EvidenceCorrelationHeatmap evidence={evidence} />
        </Card>
      </div>

      {/* By Department */}
      {dm.byDepartment.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("Diagnostics by Department", "التشخيصات حسب الإدارة")}</CardTitle>
          </CardHeader>
          <div className="space-y-2">
            {dm.byDepartment.map((d) => (
              <div
                key={d.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <span className="text-sm font-medium">{d.name}</span>
                  <span className="text-xs text-gray-400 ml-2">
                    {d.count} {t("reports", "تقارير")}
                  </span>
                </div>
                <span className="text-sm font-bold text-blue-600">
                  {d.avgConfidence}% {t("avg confidence", "متوسط الثقة")}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <GuidedDiagnosticWizard open={showWizard} onClose={() => setShowWizard(false)} />
    </div>
  );
}
