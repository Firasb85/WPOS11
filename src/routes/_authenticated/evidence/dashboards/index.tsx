import { EvidenceImpactSorter } from "@/components/diagnostics/EvidenceImpactSorter";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useEvidenceMetrics } from "@/hooks/useAnalytics";
import { EvidenceCorrelationHeatmap } from "@/components/diagnostics/EvidenceCorrelationHeatmap";
import { useEvidence } from "@/hooks/useDiagnosticWorkflow";
import { ClipboardCheck, BarChart3, Shield } from "lucide-react";

export const Route = createFileRoute("/_authenticated/evidence/dashboards/")({
  component: EvidenceDashboardPage,
});

function EvidenceDashboardPage() {
  const { t, lang: l } = useLanguage();
  const { data: allEvidence } = useEvidence();
  const { data: metrics, isLoading } = useEvidenceMetrics();
  const m = metrics ?? { total: 0, byType: {}, byReliability: {} };

  const typeColors: Record<string, string> = {
    quantitative: "bg-blue-500",
    qualitative: "bg-purple-500",
    behavioral: "bg-green-500",
    system_generated: "bg-gray-500",
    contextual: "bg-orange-500",
    temporal: "bg-cyan-500",
  };

  return (
    <div>
      <PageHeader
        title="Evidence Dashboard"
        titleAr="لوحة الأدلة"
        description="Evidence quality and distribution metrics — live data"
        descriptionAr="مقاييس جودة وتوزيع الأدلة — بيانات حية"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard
          title={t("Total Evidence", "إجمالي الأدلة")}
          value={String(m.total)}
          icon={<ClipboardCheck />}
          status="good"
        />
        <StatsCard
          title={t("Evidence Types", "أنواع الأدلة")}
          value={String(Object.keys(m.byType).length)}
          icon={<BarChart3 />}
          status="good"
        />
        <StatsCard
          title={t("High Reliability", "موثوقية عالية")}
          value={String(m.byReliability["high"] ?? 0)}
          icon={<Shield />}
          status="good"
        />
      </div>
      {isLoading ? (
        <div className="h-64 bg-white rounded-xl border animate-pulse" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("By Type", "حسب النوع")}</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {Object.entries(m.byType).map(([type, count]) => (
                <div key={type} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${typeColors[type] ?? "bg-gray-400"}`} />
                  <span className="text-sm flex-1 capitalize">{type.replace("_", " ")}</span>
                  <span className="text-sm font-bold">{count}</span>
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${typeColors[type] ?? "bg-gray-400"}`}
                      style={{ width: `${m.total > 0 ? ((count as number) / m.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
              {Object.keys(m.byType).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  {t("No evidence yet", "لا توجد أدلة بعد")}
                </p>
              )}
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("By Reliability", "حسب الموثوقية")}</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: "high", color: "bg-green-50 text-green-600", label: t("High", "عالية") },
                {
                  key: "medium",
                  color: "bg-yellow-50 text-yellow-600",
                  label: t("Medium", "متوسطة"),
                },
                { key: "low", color: "bg-red-50 text-red-600", label: t("Low", "منخفضة") },
              ].map((r) => (
                <div key={r.key} className={`p-4 rounded-lg text-center ${r.color}`}>
                  <p className="text-2xl font-bold">{m.byReliability[r.key] ?? 0}</p>
                  <p className="text-xs font-medium mt-1">{r.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
      <Card className="mt-6">
        <EvidenceImpactSorter
          evidence={
            (allEvidence ?? []) as Array<{
              id: string;
              evidence_type: string;
              source: string;
              description: string;
              reliability: string | null;
              reliability_score: number | null;
            }>
          }
        />
      </Card>
      <Card className="mt-6">
        <EvidenceCorrelationHeatmap
          evidence={
            (allEvidence ?? []) as Array<{
              evidence_type: string;
              reliability: string | null;
              description: string;
            }>
          }
        />
      </Card>
    </div>
  );
}
