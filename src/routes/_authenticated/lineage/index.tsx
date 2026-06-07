import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { Share2, Database, ArrowRight, GitBranch } from "lucide-react";

export const Route = createFileRoute("/_authenticated/lineage/")({
  component: DataLineagePage,
});

function DataLineagePage() {
  const { t, lang: l } = useLanguage();

  const lineageEntries = [
    {
      source: "HR System",
      sourceType: "Employee",
      target: "WPOS",
      targetType: "Performance Snapshot",
      type: "feeds",
    },
    {
      source: "WPOS",
      sourceType: "KPI Measurement",
      target: "WPOS",
      targetType: "Diagnostic Report",
      type: "triggers",
    },
    {
      source: "WPOS",
      sourceType: "Diagnostic Report",
      target: "WPOS",
      targetType: "Case",
      type: "creates",
    },
    {
      source: "WPOS",
      sourceType: "Case",
      target: "WPOS",
      targetType: "Intervention",
      type: "triggers",
    },
    {
      source: "WPOS",
      sourceType: "Intervention",
      target: "WPOS",
      targetType: "Follow-Up",
      type: "requires",
    },
    {
      source: "ERP",
      sourceType: "Financial Data",
      target: "WPOS",
      targetType: "KPI",
      type: "feeds",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Data Lineage"
        titleAr="نسب البيانات"
        description="Track data flow and dependencies across the system"
        descriptionAr="تتبع تدفق البيانات والتبعيات عبر النظام"
        currentLang={l}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="text-center">
          <Database className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">3</p>
          <p className="text-xs text-gray-500">{t("Data Sources", "مصادر البيانات")}</p>
        </Card>
        <Card className="text-center">
          <Share2 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{lineageEntries.length}</p>
          <p className="text-xs text-gray-500">{t("Lineage Paths", "مسارات النسب")}</p>
        </Card>
        <Card className="text-center">
          <GitBranch className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">8</p>
          <p className="text-xs text-gray-500">{t("Entity Types", "أنواع الكيانات")}</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("Data Flow Map", "خريطة تدفق البيانات")}</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {lineageEntries.map((entry, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              <div className="flex-1 text-right">
                <p className="text-sm font-medium">{entry.source}</p>
                <p className="text-xs text-gray-500">{entry.sourceType}</p>
              </div>
              <div className="flex items-center gap-2 px-3">
                <ArrowRight className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">
                  {entry.type}
                </span>
                <ArrowRight className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{entry.target}</p>
                <p className="text-xs text-gray-500">{entry.targetType}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
