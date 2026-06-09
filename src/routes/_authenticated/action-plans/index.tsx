import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { Plus, Calendar } from "lucide-react";
import { useCases } from "@/hooks/useCases";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
export const Route = createFileRoute("/_authenticated/action-plans/")({
  component: ActionPlansPage,
});
function ActionPlansPage() {
  const { t, lang: l } = useLanguage();
  const { data: _cases, isLoading: _casesLoading } = useCases();
  const plans = [
    {
      case: "CAS-001",
      emp: "Ahmad Khalid",
      empAr: "أحمد خالد",
      count: 3,
      completed: 1,
      progress: 33,
      st: "active",
      due: "2026-07-04",
    },
    {
      case: "CAS-002",
      emp: "Omar Hassan",
      empAr: "عمر حسن",
      count: 2,
      completed: 0,
      progress: 15,
      st: "active",
      due: "2026-06-25",
    },
    {
      case: "CAS-003",
      emp: "Layla Ibrahim",
      empAr: "ليلى إبراهيم",
      count: 4,
      completed: 2,
      progress: 50,
      st: "active",
      due: "2026-06-30",
    },
  ];
  return (
    <div>
      <PageHeader
        title={t("Action Plans", "خطط العمل")}
        titleAr="خطط العمل"
        description="Track action items across all open cases"
        descriptionAr="تتبع إجراءات العمل عبر جميع الحالات المفتوحة"
        currentLang={l}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" />
            <span>{l === "ar" ? "إجراء جديد" : "New Action"}</span>
          </button>
        }
      />
      <div className="space-y-4">
        {plans.map((p, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium">
                  {p.case} — {l === "ar" ? p.empAr : p.emp}
                </p>
                <p className="text-xs text-gray-500">
                  {p.count} {l === "ar" ? "إجراءات" : "actions"} · {p.completed}{" "}
                  {l === "ar" ? "مكتملة" : "completed"}
                </p>
              </div>
              <StatusBadge status={p.st} label={l === "ar" ? "نشط" : "Active"} />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${p.progress}%` }}
                />
              </div>
              <span className="text-sm font-bold text-blue-600">{p.progress}%</span>
              <span className="text-xs text-gray-400">
                <Calendar className="w-3 h-3 inline mr-0.5" />
                {p.due}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
