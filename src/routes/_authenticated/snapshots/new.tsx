import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useEmployeesList } from "@/hooks/useOrganization";
import { useKpis, useCreateSnapshot } from "@/hooks/useKpis";
import { Save, Calculator } from "lucide-react";

export const Route = createFileRoute("/_authenticated/snapshots/new")({
  component: NewSnapshotPage,
});

function NewSnapshotPage() {
  const { t, lang: l } = useLanguage();
  const navigate = useNavigate();
  const { data: employeesData } = useEmployeesList({ pageSize: 500 });
  const { data: kpis } = useKpis();
  const createMutation = useCreateSnapshot();

  const [formData, setFormData] = useState({
    employee_id: "",
    kpi_id: "",
    period: new Date().toISOString().slice(0, 7), // YYYY-MM
    target_value: "",
    actual_value: "",
  });

  const target = Number(formData.target_value) || 0;
  const actual = Number(formData.actual_value) || 0;
  const gap = actual - target;
  const gapPct = target !== 0 ? ((gap / target) * 100).toFixed(1) : "0";
  const status = Number(gapPct) < -10 ? "red" : Number(gapPct) < 0 ? "yellow" : "green";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync({
      employee_id: formData.employee_id,
      kpi_id: formData.kpi_id,
      period: formData.period,
      target_value: target,
      actual_value: actual,
    });
    navigate({ to: "/snapshots" });
  };

  const employees = employeesData?.data ?? [];

  return (
    <div>
      <PageHeader
        title="Record Performance Snapshot"
        titleAr="تسجيل لقطة أداء"
        description="Capture an employee's KPI measurement for a specific period"
        descriptionAr="تسجيل قياس مؤشر أداء لموظف لفترة محددة"
        currentLang={l}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        {emp.first_name} {emp.last_name}{" "}
                        {emp.employee_code ? `(${emp.employee_code})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("KPI", "المؤشر")} *
                  </label>
                  <select
                    required
                    value={formData.kpi_id}
                    onChange={(e) => setFormData({ ...formData, kpi_id: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  >
                    <option value="">{t("Select KPI", "اختر المؤشر")}</option>
                    {(kpis ?? []).map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.name} ({k.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("Period", "الفترة")} *
                  </label>
                  <input
                    type="month"
                    required
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("Target Value", "القيمة المستهدفة")} *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.target_value}
                    onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("Actual Value", "القيمة الفعلية")} *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.actual_value}
                    onChange={(e) => setFormData({ ...formData, actual_value: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => navigate({ to: "/snapshots" })}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {t("Cancel", "إلغاء")}
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {createMutation.isPending
                    ? t("Saving...", "جاري الحفظ...")
                    : t("Save Snapshot", "حفظ اللقطة")}
                </button>
              </div>
            </form>
          </Card>
        </div>

        {/* Live Gap Calculator */}
        <div>
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-semibold">{t("Gap Calculator", "حاسبة الفجوة")}</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">{t("Target", "الهدف")}</span>
                <span className="text-sm font-medium">{target || "-"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">{t("Actual", "الفعلي")}</span>
                <span className="text-sm font-medium">{actual || "-"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">{t("Gap", "الفجوة")}</span>
                <span
                  className={`text-sm font-bold ${gap >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {gap >= 0 ? "+" : ""}
                  {gap}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">{t("Gap %", "% الفجوة")}</span>
                <span
                  className={`text-sm font-bold ${Number(gapPct) >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {Number(gapPct) >= 0 ? "+" : ""}
                  {gapPct}%
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">{t("Status", "الحالة")}</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold text-white ${status === "green" ? "bg-green-500" : status === "yellow" ? "bg-yellow-500" : "bg-red-500"}`}
                >
                  {status.toUpperCase()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
