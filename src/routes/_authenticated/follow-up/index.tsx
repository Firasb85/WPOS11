import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card} from "~/components/wpos/Card";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { Calendar, Minus } from "lucide-react";
import { useCases } from "@/hooks/useCases";
export const Route = createFileRoute("/_authenticated/follow-up/")({ component: FollowUpPage });
function FollowUpPage() {
  const { data: _cases, isLoading: _casesLoading } = useCases();
  const l = "ar";
  const items = [
    {
      case: "CAS-001",
      emp: "Ahmad Khalid",
      empAr: "أحمد خالد",
      type: "30 Day",
      typeAr: "30 يوم",
      date: "2026-07-04",
      kpiBefore: 78,
      kpiAfter: 82,
      improvement: 5.1,
      result: "improvement",
      st: "pending",
    },
    {
      case: "CAS-002",
      emp: "Omar Hassan",
      empAr: "عمر حسن",
      type: "30 Day",
      typeAr: "30 يوم",
      date: "2026-06-25",
      kpiBefore: 85,
      kpiAfter: 84,
      improvement: -1.2,
      result: "decline",
      st: "pending",
    },
    {
      case: "CAS-003",
      emp: "Layla Ibrahim",
      empAr: "ليلى إبراهيم",
      type: "60 Day",
      typeAr: "60 يوم",
      date: "2026-07-15",
      kpiBefore: 90,
      kpiAfter: 93,
      improvement: 3.3,
      result: "improvement",
      st: "completed",
    },
    {
      case: "CAS-004",
      emp: "Nadia Karim",
      empAr: "نادية كريم",
      type: "90 Day",
      typeAr: "90 يوم",
      date: "2026-08-01",
      kpiBefore: 75,
      kpiAfter: 75,
      improvement: 0,
      result: "no_change",
      st: "scheduled",
    },
  ];
  return (
    <div>
      <PageHeader
        title="Follow-Up System"
        titleAr="نظام المتابعة"
        description="30/60/90-day check-ins to measure improvement"
        descriptionAr="متابعة 30/60/90 يوماً لقياس التحسن"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="text-center">
          <p className="text-2xl font-bold text-green-600">12</p>
          <p className="text-xs text-gray-500 mt-1">{l === "ar" ? "تحسن" : "Improvement"}</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-yellow-600">4</p>
          <p className="text-xs text-gray-500 mt-1">{l === "ar" ? "لا تغيير" : "No Change"}</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-red-600">3</p>
          <p className="text-xs text-gray-500 mt-1">{l === "ar" ? "تراجع" : "Decline"}</p>
        </Card>
      </div>
      <div className="space-y-3">
        {items.map((it, i) => (
          <Card key={i}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-gray-500">{it.case}</span>
                  <span className="text-sm font-medium">{l === "ar" ? it.empAr : it.emp}</span>
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                    {l === "ar" ? it.typeAr : it.type}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  <Calendar className="w-3 h-3 inline mr-0.5" />
                  {it.date} · {l === "ar" ? "المؤشر" : "KPI"}: {it.kpiBefore} → {it.kpiAfter}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  {it.result === "improvement" ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : it.result === "decline" ? (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  ) : (
                    <Minus className="w-4 h-4 text-gray-400" />
                  )}
                  <span
                    className={`text-lg font-bold ${it.result === "improvement" ? "text-green-600" : it.result === "decline" ? "text-red-600" : "text-gray-500"}`}
                  >
                    {it.improvement > 0 ? "+" : ""}
                    {it.improvement}%
                  </span>
                </div>
                <StatusBadge status={it.st} size="sm" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
function TrendingUp(_props: Record<string, unknown>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
function TrendingDown(_props: Record<string, unknown>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}
