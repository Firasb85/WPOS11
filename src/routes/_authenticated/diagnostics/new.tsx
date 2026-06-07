import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useEmployeesList, useDepartments } from "@/hooks/useOrganization";
import { useEvidence, useCreateEvidence } from "@/hooks/useDiagnosticWorkflow";
import { useCreateDiagnostic, useGenerateHypotheses } from "@/hooks/useDiagnosticWorkflow";
import { useAuth } from "@/hooks/useAuth";
import { Stethoscope, Plus, Brain, FileText, Upload } from "lucide-react";

export const Route = createFileRoute("/_authenticated/diagnostics/new")({
  component: NewDiagnosticPage,
});

function NewDiagnosticPage() {
  const { t, lang: l } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: employeesData, isLoading: _employeesDataLoading } = useEmployeesList({
    pageSize: 500,
  });
  const { data: departments } = useDepartments();
  const createDiagnostic = useCreateDiagnostic();
  const generateHypotheses = useGenerateHypotheses();
  const createEvidence = useCreateEvidence();

  const [step, setStep] = useState(1);
  const [reportId, setReportId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    employee_id: "",
    department_id: "",
    performance_summary: "",
  });
  const [evidenceForm, setEvidenceForm] = useState({
    evidence_type: "quantitative",
    source: "",
    description: "",
    reliability: "medium",
  });

  const selectedEmployee = formData.employee_id;
  const { data: existingEvidence } = useEvidence(selectedEmployee || undefined);

  // Step 1: Create the diagnostic report
  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createDiagnostic.mutateAsync({
      title: formData.title,
      employee_id: formData.employee_id,
      department_id: formData.department_id || null,
      performance_summary: formData.performance_summary || null,
      generated_by: user?.id ?? null,
    });
    setReportId(result.id);
    setStep(2);
  };

  // Step 2: Add evidence
  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEvidence.mutateAsync({
      employee_id: formData.employee_id,
      evidence_type: evidenceForm.evidence_type,
      source: evidenceForm.source,
      description: evidenceForm.description,
      reliability: evidenceForm.reliability,
      source_date: new Date().toISOString(),
      submitted_by: user?.id ?? null,
    });
    setEvidenceForm({
      evidence_type: "quantitative",
      source: "",
      description: "",
      reliability: "medium",
    });
  };

  // Step 3: Generate hypotheses
  const handleGenerate = async () => {
    if (!reportId) return;
    await generateHypotheses.mutateAsync({
      reportId,
      employeeId: formData.employee_id,
    });
    navigate({ to: "/diagnostics" });
  };

  const employees = employeesData?.data ?? [];

  return (
    <div>
      <PageHeader
        title="New Diagnostic Investigation"
        titleAr="تحقيق تشخيصي جديد"
        description="Create a diagnostic report with evidence collection and hypothesis generation"
        descriptionAr="إنشاء تقرير تشخيصي مع جمع الأدلة وتوليد الفرضيات"
        currentLang={l}
      />

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { n: 1, label: t("Report Details", "تفاصيل التقرير") },
          { n: 2, label: t("Collect Evidence", "جمع الأدلة") },
          { n: 3, label: t("Generate Hypotheses", "توليد الفرضيات") },
        ].map((s) => (
          <div key={s.n} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s.n ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              {s.n}
            </div>
            <span
              className={`text-sm ${step >= s.n ? "text-gray-900 font-medium" : "text-gray-400"}`}
            >
              {s.label}
            </span>
            {s.n < 3 && (
              <div className={`flex-1 h-0.5 ${step > s.n ? "bg-blue-600" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Report Details */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>
              <Stethoscope className="w-5 h-5 inline mr-2" />
              {t("Diagnostic Report Details", "تفاصيل التقرير التشخيصي")}
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleCreateReport} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Title", "العنوان")} *
              </label>
              <input
                required
                minLength={5}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t(
                  "e.g. Sales Performance Gap Analysis",
                  "مثال: تحليل فجوة أداء المبيعات",
                )}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
              />
            </div>
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
                      {emp.first_name} {emp.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("Department", "الإدارة")}
                </label>
                <select
                  value={formData.department_id}
                  onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                >
                  <option value="">{t("Select", "اختر")}</option>
                  {(departments ?? []).map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Performance Summary", "ملخص الأداء")}
              </label>
              <textarea
                rows={3}
                value={formData.performance_summary}
                onChange={(e) => setFormData({ ...formData, performance_summary: e.target.value })}
                placeholder={t(
                  "Describe the observed performance issues...",
                  "صف مشكلات الأداء الملاحظة...",
                )}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm resize-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={createDiagnostic.isPending}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {createDiagnostic.isPending
                  ? t("Creating...", "جاري الإنشاء...")
                  : t("Next: Collect Evidence", "التالي: جمع الأدلة")}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Step 2: Evidence Collection */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Upload className="w-5 h-5 inline mr-2" />
                {t("Add Evidence", "إضافة دليل")}
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleAddEvidence} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("Evidence Type", "نوع الدليل")} *
                </label>
                <select
                  required
                  value={evidenceForm.evidence_type}
                  onChange={(e) =>
                    setEvidenceForm({ ...evidenceForm, evidence_type: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                >
                  <option value="quantitative">{t("Quantitative", "كمي")}</option>
                  <option value="qualitative">{t("Qualitative", "نوعي")}</option>
                  <option value="behavioral">{t("Behavioral", "سلوكي")}</option>
                  <option value="system_generated">
                    {t("System Generated", "منشأ من النظام")}
                  </option>
                  <option value="contextual">{t("Contextual", "سياقي")}</option>
                  <option value="temporal">{t("Temporal", "زمني")}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("Source", "المصدر")} *
                </label>
                <input
                  required
                  value={evidenceForm.source}
                  onChange={(e) => setEvidenceForm({ ...evidenceForm, source: e.target.value })}
                  placeholder={t(
                    "e.g. KPI System, Manager observation",
                    "مثال: نظام المؤشرات، ملاحظة المدير",
                  )}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("Description", "الوصف")} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={evidenceForm.description}
                  onChange={(e) =>
                    setEvidenceForm({ ...evidenceForm, description: e.target.value })
                  }
                  placeholder={t("Describe the evidence in detail...", "صف الدليل بالتفصيل...")}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("Reliability", "الموثوقية")}
                </label>
                <select
                  value={evidenceForm.reliability}
                  onChange={(e) =>
                    setEvidenceForm({ ...evidenceForm, reliability: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                >
                  <option value="high">{t("High", "عالية")}</option>
                  <option value="medium">{t("Medium", "متوسطة")}</option>
                  <option value="low">{t("Low", "منخفضة")}</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={createEvidence.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                {createEvidence.isPending
                  ? t("Adding...", "جاري الإضافة...")
                  : t("Add Evidence", "إضافة دليل")}
              </button>
            </form>
          </Card>

          <div>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>
                  <FileText className="w-5 h-5 inline mr-2" />
                  {t("Collected Evidence", "الأدلة المجمعة")} ({(existingEvidence ?? []).length})
                </CardTitle>
              </CardHeader>
              {(existingEvidence ?? []).length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  {t(
                    "No evidence collected yet. Add at least 2 items.",
                    "لا توجد أدلة بعد. أضف عنصرين على الأقل.",
                  )}
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {(existingEvidence ?? []).map((ev) => (
                    <div key={ev.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {ev.evidence_type}
                        </span>
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          {ev.reliability}
                        </span>
                        <span className="text-xs text-gray-400 ml-auto">{ev.source}</span>
                      </div>
                      <p className="text-xs text-gray-600">{ev.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {t("Back", "رجوع")}
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={(existingEvidence ?? []).length < 1}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {t("Next: Generate Hypotheses", "التالي: توليد الفرضيات")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Generate Hypotheses */}
      {step === 3 && (
        <Card className="text-center py-12">
          <Brain className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t("Ready to Analyze", "جاهز للتحليل")}</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            {t(
              `The system will analyze ${(existingEvidence ?? []).length} evidence items and performance data to generate ranked diagnostic hypotheses.`,
              `سيحلل النظام ${(existingEvidence ?? []).length} عنصر دليل وبيانات الأداء لتوليد فرضيات تشخيصية مرتبة.`,
            )}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {t("Back", "رجوع")}
            </button>
            <button
              onClick={handleGenerate}
              disabled={generateHypotheses.isPending}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
            >
              <Brain className="w-4 h-4" />
              {generateHypotheses.isPending
                ? t("Analyzing...", "جاري التحليل...")
                : t("Generate Hypotheses", "توليد الفرضيات")}
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
