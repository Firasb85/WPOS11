import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useRootCauseMetrics } from "@/hooks/useAnalytics";
import { Search, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/analytics/root-cause")({
  component: RootCauseAnalyticsPage,
});

function RootCauseAnalyticsPage() {
  const { t, lang: l } = useLanguage();
  const { data: causes, isLoading } = useRootCauseMetrics();
  const items = causes ?? [];
  const maxCount = Math.max(...items.map((c) => c.count), 1);

  return (
    <div>
      <PageHeader
        title="Root Cause Analysis"
        titleAr="تحليل الأسباب الجذرية"
        description="Distribution of root causes from diagnostic reports — live data"
        descriptionAr="توزيع الأسباب الجذرية من تقارير التشخيص — بيانات حية"
        currentLang={l}
      />
      {isLoading ? (
        <div className="h-64 bg-white rounded-xl border animate-pulse" />
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">
            {t(
              "No root cause data yet. Generate diagnostic hypotheses first.",
              "لا توجد بيانات أسباب جذرية بعد.",
            )}
          </p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              <BarChart3 className="w-4 h-4 inline mr-2" />
              {t("Root Cause Distribution", "توزيع الأسباب الجذرية")}
            </CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {items.map((c) => (
              <div key={c.category} className="flex items-center gap-4">
                <div className="w-36 text-sm font-medium capitalize">{c.category}</div>
                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                  <div
                    className="h-full bg-blue-500 rounded-lg transition-all"
                    style={{ width: `${(c.count / maxCount) * 100}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
                    {c.count} ({c.pct}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
