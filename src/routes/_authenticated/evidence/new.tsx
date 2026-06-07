import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useEmployeesList } from "@/hooks/useOrganization";
import { useCreateEvidence } from "@/hooks/useDiagnosticWorkflow";
import { useAuth } from "@/hooks/useAuth";
import { Save, Upload } from "lucide-react";

export const Route = createFileRoute("/_authenticated/evidence/new")({
  component: NewEvidencePage,
});

function NewEvidencePage() {
  const { t, lang: l } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: employeesData, isLoading: _employeesDataLoading } = useEmployeesList({
    pageSize: 500,
  });
  const createMutation = useCreateEvidence();
  const [formData, setFormData] = useState({
    employee_id: "",
    evidence_type: "quantitative",
    source: "",
    description: "",
    reliability: "medium",
    source_date: new Date().toISOString().slice(0, 10),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync({
      ...formData,
      submitted_by: user?.id ?? null,
    });
    navigate({ to: "/evidence" });
  };

  const employees = employeesData?.data ?? [];

  return (
    <div>
      <PageHeader
        title="Submit Evidence"
        titleAr="تقديم دليل"
        description="Record a new evidence item for an employee"
        descriptionAr="تسجيل عنصر دليل جديد لموظف"
        currentLang={l}
      />
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("Employee", "الموظف")} *
            </label>
            <select
              required
              value={formData.employee_id}
              onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
            >
              <option value="">{t("Select employee", "اختر الموظف")}</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Evidence Type", "نوع الدليل")} *
              </label>
              <select
                required
                value={formData.evidence_type}
                onChange={(e) => setFormData({ ...formData, evidence_type: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
              >
                <option value="quantitative">{t("Quantitative", "كمي")}</option>
                <option value="qualitative">{t("Qualitative", "نوعي")}</option>
                <option value="behavioral">{t("Behavioral", "سلوكي")}</option>
                <option value="system_generated">{t("System Generated", "منشأ من النظام")}</option>
                <option value="contextual">{t("Contextual", "سياقي")}</option>
                <option value="temporal">{t("Temporal", "زمني")}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Reliability", "الموثوقية")}
              </label>
              <select
                value={formData.reliability}
                onChange={(e) => setFormData({ ...formData, reliability: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
              >
                <option value="high">{t("High", "عالية")}</option>
                <option value="medium">{t("Medium", "متوسطة")}</option>
                <option value="low">{t("Low", "منخفضة")}</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Source", "المصدر")} *
              </label>
              <input
                required
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder={t("e.g. HR System, Manager", "مثال: نظام HR، المدير")}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Source Date", "تاريخ المصدر")}
              </label>
              <input
                type="date"
                value={formData.source_date}
                onChange={(e) => setFormData({ ...formData, source_date: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("Description", "الوصف")} *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t("Describe the evidence in detail...", "صف الدليل بالتفصيل...")}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate({ to: "/evidence" })}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {t("Cancel", "إلغاء")}
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              {createMutation.isPending
                ? t("Submitting...", "جاري التقديم...")
                : t("Submit Evidence", "تقديم الدليل")}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
