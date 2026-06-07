import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { FormSelect } from "~/components/wpos/FormInput";
import { Grid3x3, AlertTriangle, Building2, GitMerge } from "lucide-react";
import { useDepartmentMetrics } from "@/hooks/useAnalytics";

export const Route = createFileRoute("/_authenticated/risk/heatmaps")({ component: HeatmapsPage });

function HeatmapSquare({
  label,
  value,
  size = 1,
  max = 5,
}: {
  label: string;
  value: number;
  size?: number;
  max?: number;
}) {
  const intensity = Math.min(1, value / max);
  const r = Math.round(255 * intensity);
  const g = Math.round(255 * (1 - intensity));
  const bg = `rgba(${r},${g},0,0.6)`;
  return (
    <div className="flex flex-col items-center p-1.5" style={{ flex: `1 0 ${100 / 6}%` }}>
      <div
        className="w-full aspect-square rounded-md flex items-center justify-center text-xs font-bold text-white"
        style={{ backgroundColor: bg, fontSize: `${8 + size * 2}px` }}
      >
        {value}
      </div>
      <span className="text-[9px] text-gray-400 mt-0.5 truncate w-full text-center">{label}</span>
    </div>
  );
}

function makeHeatmap(
  title: string,
  tA: string,
  categories: string[],
  items: Record<string, unknown>[],
  empKey: string,
  valKey: string,
  l: "ar" | "en",
) {
  return (
    <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      <p className="text-sm font-medium mb-3">{l === "ar" ? tA : title}</p>
      <div className="flex flex-wrap">
        {items.map((item, i) => (
          <HeatmapSquare
            key={i}
            label={String(
              l === "ar"
                ? item.empAr || item.nA || item.dA || item.nameAr || ""
                : item[empKey] || "",
            )}
            value={Number(item[valKey] || item.value || 0)}
            max={5}
          />
        ))}
      </div>
    </div>
  );
}

function HeatmapsPage() {
  const { data: deptMetrics, isLoading: _deptMetricsLoading } = useDepartmentMetrics();
  const l = "ar";
  const skillGapData = [
    { empAr: "أحمد خالد", data: 3 },
    { empAr: "ليلى إبراهيم", data: 2 },
    { empAr: "عمر حسن", data: 4 },
    { empAr: "نادية كريم", data: 1 },
    { empAr: "حسين علي", data: 0 },
    { empAr: "سارة أحمد", data: 2 },
    { empAr: "فهد العتيبي", data: 1 },
    { empAr: "نورة الفيصل", data: 0 },
  ];
  const deptRiskData = [
    { dA: "العمليات", data: 4 },
    { dA: "الموارد البشرية", data: 2 },
    { dA: "المالية", data: 3 },
    { dA: "تقنية المعلومات", data: 1 },
    { dA: "المبيعات", data: 3 },
    { dA: "التسويق", data: 2 },
  ];
  const processFailData = [
    { nA: "معالجة الطلبات", data: 5 },
    { nA: "تسليم الطلبات", data: 4 },
    { nA: "فوترة", data: 3 },
    { nA: "تدقيق المخزون", data: 2 },
    { nA: "تسجيل العملاء", data: 2 },
    { nA: "الموافقات", data: 1 },
  ];
  const rootCauseData = [
    { nA: "فجوة مهارية", data: 5 },
    { nA: "مشكلة إجرائية", data: 4 },
    { nA: "فجوة معرفية", data: 3 },
    { nA: "مشكلة أدوات", data: 3 },
    { nA: "تحفيز", data: 2 },
    { nA: "قضايا إدارية", data: 2 },
    { nA: "موارد", data: 1 },
    { nA: "سياسات", data: 1 },
  ];

  return (
    <div>
      <PageHeader
        title="Organizational Heatmaps"
        titleAr="الخرائط الحرارية المؤسسية"
        description="Visualize skill gaps, risks, process failures, and root causes"
        descriptionAr="تصور فجوات المهارات والمخاطر وأعطال العمليات والأسباب الجذرية"
        currentLang={l}
        actions={
          <FormSelect
            options={[{ value: "all", label: "All Heatmaps", labelAr: "جميع الخرائط" }]}
            value="all"
            currentLang={l}
          />
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Grid3x3 className="w-4 h-4 inline mr-1 text-orange-500" />
              {l === "ar" ? "فجوات المهارات" : "Skill Gap Heatmap"}
            </CardTitle>
          </CardHeader>
          <p className="text-xs text-gray-500 mb-3">
            {l === "ar" ? "شدة الفجوة حسب الموظف (0-5)" : "Gap intensity by employee (0-5)"}
          </p>
          <div className="flex flex-wrap">
            {skillGapData.map((item, i) => (
              <HeatmapSquare key={i} label={item.empAr} value={item.data} max={5} />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <div className="w-4 h-4 rounded bg-green-400"></div>
            <span>{l === "ar" ? "لا توجد فجوة" : "No gap"}</span>
            <div className="w-4 h-4 rounded bg-red-500 ml-2"></div>
            <span>{l === "ar" ? "فجوة حرجة" : "Critical gap"}</span>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <Building2 className="w-4 h-4 inline mr-1 text-red-500" />
              {l === "ar" ? "مخاطر الإدارات" : "Department Risk Heatmap"}
            </CardTitle>
          </CardHeader>
          <p className="text-xs text-gray-500 mb-3">
            {l === "ar" ? "مستوى المخاطرة حسب الإدارة" : "Risk level by department"}
          </p>
          <div className="flex flex-wrap">
            {deptRiskData.map((item, i) => (
              <HeatmapSquare key={i} label={item.dA} value={item.data} max={5} />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <div className="w-4 h-4 rounded bg-green-400"></div>
            <span>{l === "ar" ? "مخاطرة منخفضة" : "Low risk"}</span>
            <div className="w-4 h-4 rounded bg-red-500 ml-2"></div>
            <span>{l === "ar" ? "مخاطرة حرجة" : "Critical risk"}</span>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <GitMerge className="w-4 h-4 inline mr-1 text-purple-500" />
              {l === "ar" ? "فشل العمليات" : "Process Failure Heatmap"}
            </CardTitle>
          </CardHeader>
          <p className="text-xs text-gray-500 mb-3">
            {l === "ar" ? "تكرار الفشل حسب العملية" : "Failure frequency by process"}
          </p>
          <div className="flex flex-wrap">
            {processFailData.map((item, i) => (
              <HeatmapSquare key={i} label={item.nA} value={item.data} max={5} />
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <AlertTriangle className="w-4 h-4 inline mr-1 text-amber-500" />
              {l === "ar" ? "الأسباب الجذرية" : "Root Cause Heatmap"}
            </CardTitle>
          </CardHeader>
          <p className="text-xs text-gray-500 mb-3">
            {l === "ar" ? "تكرار السبب الجذري" : "Root cause frequency"}
          </p>
          <div className="flex flex-wrap">
            {rootCauseData.map((item, i) => (
              <HeatmapSquare key={i} label={item.nA} value={item.data} max={5} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
