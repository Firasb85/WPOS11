import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { FormSelect } from "~/components/wpos/FormInput";
import { Activity, Stethoscope, Briefcase, ClipboardList, Clock } from "lucide-react";
import { useEmployeesList } from "@/hooks/useOrganization";
export const Route = createFileRoute("/_authenticated/journey/")({ component: JourneyPage });
function JourneyPage() {
  const { data: _employees, isLoading: _employeesLoading } = useEmployeesList({ pageSize: 50 });
  const l = "ar";
  const entries = [
    {
      date: "2026-06-04",
      title: "Diagnostic Report Generated",
      tA: "تم إنشاء التقرير التشخيصي",
      type: "diagnostic",
      detail: "Production Efficiency: Red",
      detailA: "كفاءة الإنتاج: أحمر",
      icon: Stethoscope,
      c: "text-blue-600 bg-blue-50",
    },
    {
      date: "2026-06-04",
      title: "Case Opened — CAS-001",
      tA: "تم فتح الحالة",
      type: "case",
      detail: "Root Cause: Skill Gap",
      detailA: "السبب: فجوة مهارية",
      icon: Briefcase,
      c: "text-purple-600 bg-purple-50",
    },
    {
      date: "2026-06-10",
      title: "Action Plan Created",
      tA: "تم إنشاء خطة العمل",
      type: "action",
      detail: "3 actions assigned",
      detailA: "3 إجراءات مخصصة",
      icon: ClipboardList,
      c: "text-green-600 bg-green-50",
    },
    {
      date: "2026-06-10",
      title: "Data Analysis Training Started",
      tA: "بدأ التدريب على تحليل البيانات",
      type: "intervention",
      detail: "TRN-002 · 3 weeks",
      detailA: "3 أسابيع",
      icon: Activity,
      c: "text-orange-600 bg-orange-50",
    },
    {
      date: "2026-06-13",
      title: "Training Progress: 45%",
      tA: "تقدم التدريب: 45%",
      type: "action",
      detail: "Module 2 of 5 completed",
      detailA: "الوحدة 2 من 5",
      icon: Clock,
      c: "text-cyan-600 bg-cyan-50",
    },
  ];
  return (
    <div>
      <PageHeader
        title="Performance Journey"
        titleAr="رحلة الأداء"
        description="Timeline view of employee performance development"
        descriptionAr="عرض زمني لتطوير أداء الموظف"
        currentLang={l}
        actions={
          <FormSelect
            options={[
              { value: "emp1", label: "Ahmad Khalid", labelAr: "أحمد خالد" },
              { value: "emp2", label: "Layla Ibrahim", labelAr: "ليلى إبراهيم" },
            ]}
            value="emp1"
            currentLang={l}
          />
        }
      />
      <Card>
        <div className="relative">
          <div className="absolute top-0 left-6 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
          {entries.map((e, i) => {
            const IC = e.icon;
            return (
              <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-full ${e.c} flex items-center justify-center`}>
                    <IC className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {l === "ar" ? e.tA : e.title}
                    </h4>
                    <span className="text-xs text-gray-400">{e.date}</span>
                  </div>
                  <p className="text-xs text-gray-500">{l === "ar" ? e.detailA : e.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
