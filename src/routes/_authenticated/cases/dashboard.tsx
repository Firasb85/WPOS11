import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useCases } from "@/hooks/useCases";
import { Briefcase, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/cases/dashboard")({
  component: CaseDashboardPage,
});

function CaseDashboardPage() {
  const { t, lang: l } = useLanguage();
  const { data: cases, isLoading } = useCases();
  const items = (cases ?? []) as unknown as Array<Record<string, unknown>>;

  const byStatus: Record<string, number> = {};
  const byPriority: Record<string, number> = {};
  for (const c of items) {
    const s = (c.status as string) ?? "open";
    const p = (c.priority as string) ?? "medium";
    byStatus[s] = (byStatus[s] ?? 0) + 1;
    byPriority[p] = (byPriority[p] ?? 0) + 1;
  }
  const open = (byStatus["open"] ?? 0) + (byStatus["under_investigation"] ?? 0);
  const resolved = byStatus["resolved"] ?? 0;
  const critical = byPriority["critical"] ?? 0;

  const statusColors: Record<string, string> = {
    open: "bg-blue-500",
    under_investigation: "bg-yellow-500",
    action_planned: "bg-purple-500",
    monitoring: "bg-orange-500",
    resolved: "bg-green-500",
    closed: "bg-gray-500",
  };

  return (
    <div>
      <PageHeader
        title="Case Dashboard"
        titleAr="لوحة الحالات"
        description="Case management metrics — live data"
        descriptionAr="مقاييس إدارة الحالات — بيانات حية"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title={t("Total Cases", "إجمالي الحالات")}
          value={String(items.length)}
          icon={<Briefcase />}
        />
        <StatsCard
          title={t("Open", "مفتوحة")}
          value={String(open)}
          icon={<Clock />}
          status="warning"
        />
        <StatsCard
          title={t("Resolved", "تم الحل")}
          value={String(resolved)}
          icon={<CheckCircle />}
          status="good"
        />
        <StatsCard
          title={t("Critical", "حرجة")}
          value={String(critical)}
          icon={<AlertTriangle />}
          status={critical > 0 ? "critical" : "good"}
        />
      </div>
      {isLoading ? (
        <div className="h-48 bg-white rounded-xl border animate-pulse" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("Cases by Status", "حسب الحالة")}</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {Object.entries(byStatus).map(([s, count]) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${statusColors[s] ?? "bg-gray-400"}`} />
                  <span className="text-sm flex-1 capitalize">{s.replace("_", " ")}</span>
                  <span className="text-sm font-bold">{count}</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${statusColors[s] ?? "bg-gray-400"}`}
                      style={{ width: `${(count / Math.max(items.length, 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {Object.keys(byStatus).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  {t("No cases yet", "لا توجد حالات")}
                </p>
              )}
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("Cases by Priority", "حسب الأولوية")}</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "critical", color: "text-red-600 bg-red-50" },
                { key: "high", color: "text-orange-600 bg-orange-50" },
                { key: "medium", color: "text-yellow-600 bg-yellow-50" },
                { key: "low", color: "text-green-600 bg-green-50" },
              ].map((p) => (
                <div key={p.key} className={`p-4 rounded-lg ${p.color} text-center`}>
                  <p className="text-2xl font-bold">{byPriority[p.key] ?? 0}</p>
                  <p className="text-xs font-medium mt-1 capitalize">{p.key}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
