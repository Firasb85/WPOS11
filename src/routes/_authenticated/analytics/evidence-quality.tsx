import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { Shield, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";
import { useEvidenceMetrics } from "@/hooks/useAnalytics";

export const Route = createFileRoute("/_authenticated/analytics/evidence-quality")({
  component: EvidenceQualityPage,
});

function EvidenceQualityPage() {
  const { data: evidenceMetrics } = useEvidenceMetrics();
  const l = "ar";
  const byType = [
    { label: "System Generated", la: "منشأ من النظام", count: 15, rel: 92 },
    { label: "Quantitative", la: "كمي", count: 12, rel: 85 },
    { label: "Qualitative", la: "نوعي", count: 8, rel: 60 },
    { label: "Behavioral", la: "سلوكي", count: 6, rel: 55 },
  ];
  const byVer = [
    {
      label: "Verified",
      la: "موثقة",
      count: 22,
      icon: CheckCircle,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Pending",
      la: "قيد الانتظار",
      count: 8,
      icon: Clock,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      label: "Unverified",
      la: "غير موثقة",
      count: 5,
      icon: XCircle,
      color: "text-gray-600 bg-gray-50",
    },
  ];
  return (
    <div>
      <PageHeader
        title="Evidence Quality"
        titleAr="جودة الأدلة"
        description="Analyze evidence reliability and verification"
        descriptionAr="تحليل موثوقية الأدلة"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Evidence"
          titleAr="إجمالي الأدلة"
          value="37"
          icon={<Shield />}
          currentLang={l}
        />
        <StatsCard
          title="Avg Reliability"
          titleAr="متوسط الموثوقية"
          value="78%"
          change={3.2}
          icon={<TrendingUp />}
          status="good"
          currentLang={l}
        />
        <StatsCard
          title="Verified"
          titleAr="موثقة"
          value="22"
          icon={<CheckCircle />}
          status="good"
          currentLang={l}
        />
        <StatsCard
          title="Unverified"
          titleAr="غير موثقة"
          value="5"
          icon={<XCircle />}
          status="warning"
          currentLang={l}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{l === "ar" ? "حسب النوع" : "By Type"}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {byType.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{l === "ar" ? item.la : item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{item.count}</span>
                      <span className="text-xs text-gray-400">| Ø {item.rel}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.rel >= 85 ? "bg-green-500" : item.rel >= 65 ? "bg-blue-500" : "bg-yellow-500"}`}
                      style={{ width: `${item.rel}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{l === "ar" ? "حالة التحقق" : "Verification Status"}</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {byVer.map((item, i) => {
              const Icon = item.icon;
              const pct = (item.count / 37) * 100;
              return (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${item.color}`}>
                  <Icon className="w-5 h-5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        {l === "ar" ? item.la : item.label}
                      </span>
                      <span className="text-sm font-bold">
                        {item.count} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${i === 0 ? "bg-green-500" : i === 1 ? "bg-yellow-500" : "bg-gray-400"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
