import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { Search, AlertTriangle, CheckCircle, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";
export const Route = createFileRoute("/_authenticated/process-engineering/mining")({
  component: ProcessMiningPage,
});
function ProcessMiningPage() {
  const l = "ar";
  const results = [
    {
      proc: "Order Fulfillment",
      pA: "تنفيذ الطلبات",
      exp: "15m",
      act: "22m",
      var: 46.7,
      bn: [{ s: "Step 3: Inventory Check", sA: "الخطوة 3: فحص المخزون", d: "3.2x expected" }],
      skip: 0,
      rw: 5.2,
      df: 8,
    },
    {
      proc: "Invoice Processing",
      pA: "معالجة الفواتير",
      exp: "10m",
      act: "14m",
      var: 40,
      bn: [{ s: "Step 2: Verification", sA: "الخطوة 2: التحقق", d: "2.8x expected" }],
      skip: 0,
      rw: 3.1,
      df: 5,
    },
    {
      proc: "Customer Registration",
      pA: "تسجيل العملاء",
      exp: "8m",
      act: "9m",
      var: 12.5,
      bn: [],
      skip: 0,
      rw: 1.0,
      df: 2,
    },
  ];
  return (
    <div>
      <PageHeader
        title="Process Mining"
        titleAr="تعدين العمليات"
        description="Compare expected vs actual process execution to detect bottlenecks"
        descriptionAr="مقارنة التنفيذ المتوقع مع الفعلي لاكتشاف الاختناقات"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Processes Analyzed"
          titleAr="عمليات محللة"
          value="3"
          icon={<Search />}
          currentLang={l}
        />
        <StatsCard
          title="Bottlenecks"
          titleAr="اختناقات"
          value="2"
          icon={<AlertTriangle />}
          status="critical"
          currentLang={l}
        />
        <StatsCard
          title="Avg Variance"
          titleAr="متوسط التباين"
          value="33%"
          icon={<ArrowUp />}
          status="warning"
          currentLang={l}
        />
        <StatsCard
          title="Skipped Steps"
          titleAr="خطوات محذوفة"
          value="0"
          icon={<CheckCircle />}
          status="good"
          currentLang={l}
        />
      </div>
      {results.map((r, i) => (
        <Card key={i} className="mb-4">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <span>{l === "ar" ? r.pA : r.proc}</span>
                <StatusBadge
                  status={r.var >= 30 ? "red" : r.var >= 15 ? "yellow" : "green"}
                  size="sm"
                  label={`${r.var}% var`}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500">{l === "ar" ? "متوقع" : "Expected"}</p>
              <p className="text-lg font-bold text-green-600">{r.exp}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">{l === "ar" ? "فعلي" : "Actual"}</p>
              <p className="text-lg font-bold text-red-600">{r.act}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">{l === "ar" ? "إعادة عمل" : "Rework"}</p>
              <p className="text-lg font-bold text-orange-600">{r.rw}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">{l === "ar" ? "تأخير" : "Delays"}</p>
              <p className="text-lg font-bold text-yellow-600">{r.df}x</p>
            </div>
          </div>
          {r.bn.length > 0 && (
            <div>
              <p className="text-xs font-medium text-red-600 mb-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {l === "ar" ? "الاختناقات المكتشفة" : "Detected Bottlenecks"}
              </p>
              <div className="space-y-2">
                {r.bn.map((b, j) => (
                  <div
                    key={j}
                    className="flex items-center gap-3 p-2.5 bg-red-50 dark:bg-red-900/20 rounded-lg"
                  >
                    <ArrowRight className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium">{l === "ar" ? b.sA : b.s}</span>
                    <span className="text-xs text-red-600 ml-auto">{b.d}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
