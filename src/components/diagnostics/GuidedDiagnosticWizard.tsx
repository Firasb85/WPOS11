import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  X,
  ChevronRight,
  ChevronLeft,
  UserCircle,
  ClipboardCheck,
  Brain,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2,
  Sparkles,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { useEmployeesList } from "@/hooks/useOrganization";
import { useSnapshots } from "@/hooks/useKpis";
import {
  useCreateDiagnostic,
  useCreateEvidence,
  useGenerateHypotheses,
} from "@/hooks/useDiagnosticWorkflow";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { ConfidenceGauge } from "~/components/wpos/ConfidenceGauge";

interface WizardProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { id: "skill_gap", en: "Skill Gap", ar: "فجوة مهارية", icon: "🎯" },
  { id: "knowledge_gap", en: "Knowledge Gap", ar: "فجوة معرفية", icon: "📚" },
  { id: "process_issue", en: "Process Issue", ar: "مشكلة إجرائية", icon: "⚙️" },
  { id: "tool_issue", en: "Tool Issue", ar: "مشكلة أدوات", icon: "🔧" },
  { id: "environmental_issue", en: "Environmental", ar: "مشكلة بيئية", icon: "🏢" },
  { id: "resource_issue", en: "Resource Issue", ar: "مشكلة موارد", icon: "📦" },
  { id: "management_issue", en: "Management", ar: "مشكلة إدارية", icon: "👔" },
  { id: "motivation_issue", en: "Motivation", ar: "مشكلة تحفيز", icon: "💡" },
  { id: "workload_issue", en: "Workload", ar: "مشكلة عبء عمل", icon: "⚖️" },
  { id: "policy_issue", en: "Policy Issue", ar: "مشكلة سياسات", icon: "📋" },
];

/**
 * Keyword → category scoring rules.
 * Mirrored verbatim from `diagnostics.service.ts → generateHypotheses`
 * so the UI shows the user the same scoring the engine applies.
 * Changing these constants requires updating both files in the same commit.
 */
const SCORING_RULES: Record<string, { keywords: string[]; points: number }> = {
  skill_gap:           { keywords: ["skill", "training"],                   points: 15 },
  knowledge_gap:       { keywords: ["knowledge", "understanding"],          points: 15 },
  process_issue:       { keywords: ["process", "procedure"],                points: 15 },
  tool_issue:          { keywords: ["tool", "system"],                      points: 15 },
  environmental_issue: { keywords: ["environment", "workspace"],            points: 10 },
  resource_issue:      { keywords: ["resource", "staffing"],                points: 10 },
  management_issue:    { keywords: ["manager", "supervision"],              points: 15 },
  motivation_issue:    { keywords: ["motivation", "engagement"],            points: 15 },
  workload_issue:      { keywords: ["workload", "overtime"],                points: 15 },
  policy_issue:        { keywords: ["policy", "rule"],                      points: 10 },
};

/**
 * Reliability multiplier — high-reliability evidence counts more.
 * Mirrored from the snapshot → maturity scoring in diagnostics.service.ts.
 */
const RELIABILITY_MULTIPLIER: Record<string, number> = {
  high: 1.0,
  medium: 0.75,
  low: 0.5,
};

const EVIDENCE_TYPES = [
  { id: "quantitative", en: "Quantitative", ar: "كمي" },
  { id: "qualitative", en: "Qualitative", ar: "نوعي" },
  { id: "behavioral", en: "Behavioral", ar: "سلوكي" },
  { id: "system_generated", en: "System Generated", ar: "منشأ من النظام" },
  { id: "contextual", en: "Contextual", ar: "سياقي" },
  { id: "temporal", en: "Temporal", ar: "زمني" },
];

interface EvidenceItem {
  type: string;
  source: string;
  description: string;
  reliability: string;
}

export function GuidedDiagnosticWizard({ open, onClose }: WizardProps) {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: empData } = useEmployeesList({ pageSize: 500 });
  const { data: snapshots } = useSnapshots();
  const createDiagnostic = useCreateDiagnostic();
  const createEvidence = useCreateEvidence();
  const generateHypotheses = useGenerateHypotheses();

  const [step, setStep] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  /**
   * Auto-expand the breakdown panel when the analyst has any evidence
   * to attach — they almost always want to see how it scored.
   * Manual toggle still available.
   */
  useEffect(() => {
    if (evidenceItems.length > 0 && !showBreakdown) {
      setShowBreakdown(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evidenceItems.length === 1]); // only when first evidence is added

  // Evidence form state
  const [evType, setEvType] = useState("quantitative");
  const [evSource, setEvSource] = useState("");
  const [evDesc, setEvDesc] = useState("");
  const [evReliability, setEvReliability] = useState("medium");

  const employees = empData?.data ?? [];

  /**
   * Explainability: compute per-category breakdown showing exactly which
   * evidence items contribute, by which keyword, and how many points.
   * This mirrors the backend scoring in `diagnostics.service.ts → generateHypotheses`
   * so what the user sees here is what the engine will compute server-side.
   */
  const scoringBreakdown = useMemo(() => {
    const byCategory: Record<
      string,
      {
        categoryId: string;
        points: number;
        items: { evidenceIndex: number; keyword: string; points: number; reliability: string; source: string; description: string }[];
      }
    > = {};
    for (const cat of CATEGORIES) {
      byCategory[cat.id] = { categoryId: cat.id, points: 0, items: [] };
    }
    evidenceItems.forEach((ev, i) => {
      const desc = (ev.description || "").toLowerCase();
      const mult = RELIABILITY_MULTIPLIER[ev.reliability] ?? 0.75;
      for (const [catId, rule] of Object.entries(SCORING_RULES)) {
        for (const kw of rule.keywords) {
          if (desc.includes(kw)) {
            const pts = Math.round(rule.points * mult);
            byCategory[catId].points += pts;
            byCategory[catId].items.push({
              evidenceIndex: i,
              keyword: kw,
              points: pts,
              reliability: ev.reliability,
              source: ev.source,
              description: ev.description,
            });
          }
        }
      }
    });
    return byCategory;
  }, [evidenceItems]);

  // Find underperforming employees (RED snapshots)
  const underperformers = employees.filter((emp) => {
    const empSnaps = (snapshots ?? []).filter((s) => s.employee_id === emp.id);
    return empSnaps.some((s) => s.status === "red");
  });

  const selectedEmpData = employees.find((e) => e.id === selectedEmployee);
  const empSnapshots = (snapshots ?? []).filter((s) => s.employee_id === selectedEmployee);
  const redSnaps = empSnapshots.filter((s) => s.status === "red");

  const addEvidence = () => {
    if (!evSource.trim() || !evDesc.trim()) return;
    setEvidenceItems([
      ...evidenceItems,
      { type: evType, source: evSource, description: evDesc, reliability: evReliability },
    ]);
    setEvSource("");
    setEvDesc("");
    toast.success(t("Evidence added", "تم إضافة الدليل"));
  };

  const removeEvidence = (idx: number) => {
    setEvidenceItems(evidenceItems.filter((_, i) => i !== idx));
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleSubmit = async () => {
    if (!selectedEmployee || !title.trim() || evidenceItems.length < 1) {
      toast.error(t("Please complete all required fields", "يرجى إكمال جميع الحقول المطلوبة"));
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create diagnostic report
      const report = await createDiagnostic.mutateAsync({
        title,
        employee_id: selectedEmployee,
        performance_summary:
          summary +
          (selectedCategories.length > 0
            ? `\n\nSuspected categories: ${selectedCategories.join(", ")}`
            : ""),
        generated_by: user?.id ?? null,
      });

      // 2. Save all evidence items
      for (const ev of evidenceItems) {
        await createEvidence.mutateAsync({
          employee_id: selectedEmployee,
          evidence_type: ev.type,
          source: ev.source,
          description: ev.description,
          reliability: ev.reliability,
          source_date: new Date().toISOString(),
          submitted_by: user?.id ?? null,
        });
      }

      // 3. Generate hypotheses
      await generateHypotheses.mutateAsync({
        reportId: report.id,
        employeeId: selectedEmployee,
      });

      toast.success(
        t("Diagnostic report created with hypotheses!", "تم إنشاء التقرير التشخيصي مع الفرضيات!"),
      );
      onClose();
      navigate({ to: "/diagnostics" });
    } catch (err) {
      toast.error(
        t("Failed to create diagnostic", "فشل إنشاء التشخيص") +
          ": " +
          (err instanceof Error ? err.message : ""),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = useCallback(() => {
    switch (step) {
      case 1:
        return !!selectedEmployee;
      case 2:
        return evidenceItems.length >= 1;
      case 3:
        return selectedCategories.length >= 1;
      case 4:
        return !!title.trim();
      default:
        return true;
    }
  }, [step, selectedEmployee, evidenceItems.length, selectedCategories.length, title]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t("Guided Diagnostic", "التشخيص الموجه")}
              </h2>
              <p className="text-xs text-gray-500">
                {t(`Step ${step} of 4`, `الخطوة ${step} من 4`)}
              </p>
            </div>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 py-3 flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                {step > s ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
              <span
                className={`text-xs hidden sm:block ${step >= s ? "text-gray-900 dark:text-white font-medium" : "text-gray-400"}`}
              >
                {s === 1
                  ? t("Employee", "الموظف")
                  : s === 2
                    ? t("Evidence", "الأدلة")
                    : s === 3
                      ? t("Categories", "التصنيفات")
                      : t("Review", "المراجعة")}
              </span>
              {s < 4 && (
                <div className={`flex-1 h-0.5 ${step > s ? "bg-blue-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Step 1: Select Employee */}
          {step === 1 && (() => {
            // Sort underperformers by severity (most red KPIs first)
            const sortedUnderperformers = [...underperformers].sort((a, b) => {
              const aRed = (snapshots ?? []).filter(
                (s) => s.employee_id === a.id && s.status === "red",
              ).length;
              const bRed = (snapshots ?? []).filter(
                (s) => s.employee_id === b.id && s.status === "red",
              ).length;
              return bRed - aRed;
            });
            return (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-1">
                    {t("Select Underperforming Employee", "اختر الموظف ذو الأداء المنخفض")}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    {t(
                      "Employees with RED KPI status are highlighted. Sorted by severity (most RED KPIs first).",
                      "الموظفون ذوو حالة مؤشرات حمراء مميزون. مرتبون حسب الخطورة (الأكثر مؤشرات حمراء أولاً).",
                    )}
                  </p>
                </div>

                {sortedUnderperformers.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-red-700 dark:text-red-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {t(
                          `${sortedUnderperformers.length} employees at risk`,
                          `${sortedUnderperformers.length} موظفين في خطر`,
                        )}
                      </p>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">
                        {t("Sorted by severity", "مرتب حسب الخطورة")}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {sortedUnderperformers.map((emp) => {
                        const redCount = (snapshots ?? []).filter(
                          (s) => s.employee_id === emp.id && s.status === "red",
                        ).length;
                        const yellowCount = (snapshots ?? []).filter(
                          (s) => s.employee_id === emp.id && s.status === "yellow",
                        ).length;
                        const isSelected = selectedEmployee === emp.id;
                        // Severity badge (Critical if >=3 RED, Elevated if 1-2 RED)
                        const severity =
                          redCount >= 3
                            ? {
                                badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
                                label: t("Critical", "حرج"),
                              }
                            : redCount > 0
                              ? {
                                  badge:
                                    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
                                  label: t("Elevated", "مرتفع"),
                                }
                              : {
                                  badge:
                                    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
                                  label: t("Watch", "مراقبة"),
                                };

                        return (
                          <button
                            aria-label="Action"
                            key={emp.id}
                            onClick={() => setSelectedEmployee(emp.id)}
                            className={`relative flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                              isSelected
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-500"
                                : "border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-900/10 hover:border-red-300"
                            }`}
                          >
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isSelected
                                  ? "bg-blue-100 dark:bg-blue-900/40"
                                  : "bg-red-100 dark:bg-red-900/40"
                              }`}
                            >
                              <UserCircle
                                className={`w-5 h-5 ${isSelected ? "text-blue-600 dark:text-blue-300" : "text-red-600 dark:text-red-300"}`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium truncate">
                                  {emp.first_name} {emp.last_name}
                                </p>
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider whitespace-nowrap ${severity.badge}`}
                                >
                                  {severity.label}
                                </span>
                              </div>
                              {emp.employee_code && (
                                <p className="text-[10px] text-gray-500 font-mono">
                                  {emp.employee_code}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-red-600 dark:text-red-300 font-semibold tabular-nums">
                                  🔴 {redCount}
                                </span>
                                {yellowCount > 0 && (
                                  <span className="text-[10px] text-yellow-600 dark:text-yellow-300 font-semibold tabular-nums">
                                    🟡 {yellowCount}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 dark:bg-green-900/15 border border-green-200 dark:border-green-900/50 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-900 dark:text-green-200">
                        {t("No RED KPIs right now", "لا توجد مؤشرات حمراء حالياً")}
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">
                        {t(
                          "All employees are at or above target. You can still open a diagnostic for any employee below.",
                          "جميع الموظفون عند الهدف أو فوقه. لا يزال بإمكانك فتح تشخيص لأي موظف.",
                        )}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {t("Or select any employee", "أو اختر أي موظف")}
                  </label>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  >
                    <option value="">{t("Select employee...", "اختر الموظف...")}</option>
                    {employees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.first_name} {e.last_name}{" "}
                        {e.employee_code ? `(${e.employee_code})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedEmployee && redSnaps.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-lg overflow-hidden">
                    <div className="px-3 py-2 border-b border-red-200 dark:border-red-900/50 bg-red-100/50 dark:bg-red-900/20">
                      <p className="text-xs font-semibold text-red-900 dark:text-red-200 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {t("Performance Issues Detected", "مشاكل أداء مكتشفة")} ·{" "}
                        {redSnaps.length}
                      </p>
                    </div>
                    <table className="w-full text-xs">
                      <tbody className="divide-y divide-red-200/70 dark:divide-red-900/30">
                        {redSnaps.map((s) => {
                          const kpi = (s as Record<string, unknown>).kpis as Record<
                            string,
                            unknown
                          > | null;
                          const gap =
                            s.gap_percentage != null ? Number(s.gap_percentage) : null;
                          return (
                            <tr key={s.id}>
                              <td className="px-3 py-1.5 text-red-800 dark:text-red-200 font-medium">
                                {(kpi?.name as string) ?? "KPI"}
                              </td>
                              <td className="px-3 py-1.5 text-right font-mono tabular-nums">
                                <span
                                  className={
                                    gap !== null && gap < -25
                                      ? "text-red-700 font-bold"
                                      : "text-red-600"
                                  }
                                >
                                  {gap !== null ? `${gap.toFixed(1)}%` : "N/A"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <p className="text-[11px] text-gray-500 dark:text-gray-400 text-center pt-2">
                  {t(
                    "Tip: a well-scoped diagnostic starts with one underperforming employee, not a department-wide review.",
                    "نصيحة: التشخيص الجيد يبدأ بموظف واحد، وليس مراجعة على مستوى الإدارة.",
                  )}
                </p>
              </div>
            );
          })()}

          {/* Step 2: Attach Evidence */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-1">
                  {t("Attach Evidence", "إرفاق الأدلة")}
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  {t(
                    "Add at least 1 evidence item. More evidence = better diagnosis.",
                    "أضف عنصر دليل واحد على الأقل. المزيد من الأدلة = تشخيص أفضل.",
                  )}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {t("Type", "النوع")}
                  </label>
                  <select
                    value={evType}
                    onChange={(e) => setEvType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                  >
                    {EVIDENCE_TYPES.map((et) => (
                      <option key={et.id} value={et.id}>
                        {lang === "ar" ? et.ar : et.en}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {t("Source", "المصدر")}
                  </label>
                  <input
                    value={evSource}
                    onChange={(e) => setEvSource(e.target.value)}
                    placeholder={t("e.g. HR System", "مثال: نظام HR")}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("Description", "الوصف")}
                </label>
                <textarea
                  rows={2}
                  value={evDesc}
                  onChange={(e) => setEvDesc(e.target.value)}
                  placeholder={t("Describe the evidence...", "صف الدليل...")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm resize-none"
                />
              </div>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {t("Reliability", "الموثوقية")}
                  </label>
                  <select
                    value={evReliability}
                    onChange={(e) => setEvReliability(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                  >
                    <option value="high">{t("High", "عالية")}</option>
                    <option value="medium">{t("Medium", "متوسطة")}</option>
                    <option value="low">{t("Low", "منخفضة")}</option>
                  </select>
                </div>
                <button
                  aria-label="Add item"
                  onClick={addEvidence}
                  disabled={!evSource.trim() || !evDesc.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                  {t("Add", "أضف")}
                </button>
              </div>

              {evidenceItems.length > 0 && (
                <div className="space-y-2 mt-2">
                  <p className="text-xs font-medium text-gray-500">
                    {t(
                      `${evidenceItems.length} evidence item(s)`,
                      `${evidenceItems.length} عنصر(عناصر) دليل`,
                    )}
                  </p>
                  {evidenceItems.map((ev, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                    >
                      <ClipboardCheck className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-medium">
                            {ev.type}
                          </span>
                          <span className="text-[10px] text-gray-400">{ev.source}</span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">{ev.description}</p>
                      </div>
                      <button
                        onClick={() => removeEvidence(i)}
                        className="p-1 text-red-400 hover:text-red-600 flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Select Diagnostic Categories */}
          {step === 3 && (() => {
            // Compute top-of-step summary stats
            const totalPoints = Object.values(scoringBreakdown).reduce((s, b) => s + b.points, 0);
            const totalMatches = Object.values(scoringBreakdown).reduce(
              (s, b) => s + b.items.length,
              0,
            );
            const matchedCats = CATEGORIES.filter(
              (c) => scoringBreakdown[c.id]?.items.length,
            ).length;
            // Sort categories: matched (by score desc) first, then unmatched
            const sortedCats = [...CATEGORIES].sort((a, b) => {
              const ap = scoringBreakdown[a.id]?.points ?? 0;
              const bp = scoringBreakdown[b.id]?.points ?? 0;
              return bp - ap;
            });
            return (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-1">
                    {t("Suspected Root Cause Categories", "تصنيفات الأسباب الجذرية المشتبهة")}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    {t(
                      "Categories are ranked by their match score — top scorers first. Select the ones you suspect; the engine will validate against evidence.",
                      "التصنيفات مرتبة حسب درجة المطابقة — الأعلى أولاً. اختر ما تشتبه به؛ سيتحقق المحرك من الأدلة.",
                    )}
                  </p>
                </div>

                {/* ── Step summary stats row ── */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-900 dark:text-blue-200 tabular-nums">
                      {totalPoints}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-blue-700 dark:text-blue-400 font-semibold">
                      {t("Total points", "إجمالي النقاط")}
                    </div>
                  </div>
                  <div className="text-center border-x border-blue-200/50 dark:border-blue-800/50">
                    <div className="text-lg font-bold text-blue-900 dark:text-blue-200 tabular-nums">
                      {totalMatches}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-blue-700 dark:text-blue-400 font-semibold">
                      {t("Matches", "مطابقات")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-900 dark:text-blue-200 tabular-nums">
                      {matchedCats}/{CATEGORIES.length}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-blue-700 dark:text-blue-400 font-semibold">
                      {t("Cats scored", "تصنيفات مُحرَّزة")}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {sortedCats.map((cat) => {
                    const catScore = scoringBreakdown[cat.id]?.points ?? 0;
                    const catMatches = scoringBreakdown[cat.id]?.items.length ?? 0;
                    const isSelected = selectedCategories.includes(cat.id);
                    const isMatched = catMatches > 0;

                    // Four states for clarity:
                    //  1. selected + matched   → strong blue (primary action)
                    //  2. selected + unmatched → soft blue (analyst override)
                    //  3. unselected + matched → green accent + "Recommended"
                    //  4. unselected + unm...  → plain
                    let cls: string;
                    let badge: string | null = null;
                    if (isSelected && isMatched) {
                      cls = "border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-500";
                    } else if (isSelected) {
                      cls = "border-blue-300 bg-blue-50/50 dark:bg-blue-900/15";
                    } else if (isMatched) {
                      cls = "border-emerald-300 bg-emerald-50/40 dark:bg-emerald-900/15 hover:border-emerald-400";
                      badge = t("Recommended", "مُوصى به");
                    } else {
                      cls = "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
                    }

                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`relative flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${cls}`}
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-medium truncate">
                              {lang === "ar" ? cat.ar : cat.en}
                            </p>
                            {badge && (
                              <span className="px-1.5 py-0 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                {badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-500 mt-0.5 tabular-nums">
                            {isMatched ? (
                              <>
                                <span className="font-semibold text-blue-700 dark:text-blue-300">
                                  {catMatches} {t("match", "مطابقة")}
                                </span>
                                {" · "}
                                <span className="font-mono">{catScore} pts</span>
                              </>
                            ) : (
                              <span className="opacity-60">
                                {t("no matches yet", "لا مطابقات بعد")}
                              </span>
                            )}
                          </p>
                        </div>
                        {isSelected ? (
                          <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        ) : isMatched ? (
                          <span
                            className="w-4 h-4 rounded-full border-2 border-emerald-400 flex-shrink-0"
                            aria-hidden="true"
                          />
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                {/* ── Explainability: scoring breakdown panel ── */}
                <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowBreakdown((p) => !p)}
                    aria-expanded={showBreakdown}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {t("View scoring breakdown", "عرض تفصيل التسجيل")}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {t("Why this score?", "لماذا هذه الدرجة؟")}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform ${showBreakdown ? "rotate-180" : ""}`}
                    />
                  </button>
                  {showBreakdown && (
                    <div className="p-4 space-y-4 bg-white dark:bg-gray-900">
                      <p className="text-xs text-gray-500">
                        {t(
                          "Each point below is the contribution of a single evidence item, weighted by reliability. The total drives the confidence score shown in Step 4.",
                          "كل نقطة أدناه هي مساهمة عنصر دليل واحد، مرجحة بالموثوقية. المجموع يحرك درجة الثقة المعروضة في الخطوة 4.",
                        )}
                      </p>

                      {/* ── Score board: ranked categories with stacked bars ── */}
                      <ScoreBoard
                        breakdown={scoringBreakdown}
                        categories={CATEGORIES}
                        lang={lang}
                        t={t}
                      />

                      {/* ── "What would boost" hints ── */}
                      {evidenceItems.length > 0 && (
                        <WhatWouldBoost
                          breakdown={scoringBreakdown}
                          categories={CATEGORIES}
                          lang={lang}
                          t={t}
                        />
                      )}

                      {evidenceItems.length === 0 && (
                        <p className="text-xs text-amber-600">
                          {t(
                            "No evidence attached yet. Add evidence in Step 2 to see scoring.",
                            "لا توجد أدلة مرفقة بعد. أضف أدلة في الخطوة 2 لرؤية التسجيل.",
                          )}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Step 4: Review & Submit */}
          {step === 4 && (() => {
            // Compute preview confidence from current scoring breakdown
            // (top category's points become the headline confidence %)
            const sortedBreakdown = Object.values(scoringBreakdown).sort(
              (a, b) => b.points - a.points,
            );
            const topCategory = sortedBreakdown[0];
            const previewConfidence = topCategory ? Math.min(topCategory.points, 100) : 0;
            const totalEvidencePoints = sortedBreakdown.reduce((s, b) => s + b.points, 0);
            return (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-1">
                    {t("Review & Generate Report", "مراجعة وإنشاء التقرير")}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    {t(
                      "Provide a title and review your selections before generating the diagnostic.",
                      "قدم عنواناً وراجع اختياراتك قبل إنشاء التشخيص.",
                    )}
                  </p>
                </div>

                {/* ── Pre-submit confidence preview ── */}
                <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-200 text-blue-900 dark:bg-blue-800/40 dark:text-blue-200">
                      {t("Pre-submit estimate", "تقدير قبل الإرسال")}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Circular gauge */}
                    <ConfidenceGauge
                      value={previewConfidence}
                      size={64}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                        {t(
                          previewConfidence >= 60
                            ? "Strong confidence — likely ready for review"
                            : previewConfidence >= 30
                              ? "Moderate confidence — review evidence quality"
                              : "Low confidence — add more evidence",
                          previewConfidence >= 60
                            ? "ثقة عالية — جاهز للمراجعة على الأرجح"
                            : previewConfidence >= 30
                              ? "ثقة متوسطة — راجع جودة الأدلة"
                              : "ثقة منخفضة — أضف مزيداً من الأدلة"
                        )}
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5 tabular-nums">
                        {t(
                          `${totalEvidencePoints} total points across ${sortedBreakdown.length} categor${sortedBreakdown.length === 1 ? "y" : "ies"}`,
                          `${totalEvidencePoints} نقطة إجمالية عبر ${sortedBreakdown.length} تصنيف`,
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── Manager Approval — safety-feature framing ── */}
                <div className="rounded-xl border-2 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 dark:bg-amber-800/40 dark:text-amber-200">
                          {t("Required Safety Step", "خطوة أمان مطلوبة")}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                        {t("Manager Approval", "موافقة المدير")}
                      </h4>
                      <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                        {t(
                          "Final diagnosis requires human approval before becoming a case. No case, intervention, or HR record is created until a manager signs off.",
                          "التشخيص النهائي يتطلب موافقة بشرية قبل أن يصبح حالة. لا تُنشأ أي حالة أو تدخل أو سجل موارد بشرية حتى يوقّع المدير.",
                        )}
                      </p>
                    </div>
                  </div>

                  {/* ── Post-submit lifecycle timeline ── */}
                  <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800/40">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-amber-900 dark:text-amber-200 mb-2">
                      {t("After you submit", "بعد الإرسال")}
                    </p>
                    <ol className="space-y-2 text-[11px] text-amber-800 dark:text-amber-300">
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800/60 flex items-center justify-center font-bold text-amber-900 dark:text-amber-200 flex-shrink-0 text-[10px]">
                          1
                        </span>
                        <span>
                          {t(
                            "Report enters 'Under Review' status.",
                            "يدخل التقرير حالة 'قيد المراجعة'.",
                          )}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800/60 flex items-center justify-center font-bold text-amber-900 dark:text-amber-200 flex-shrink-0 text-[10px]">
                          2
                        </span>
                        <span>
                          {t(
                            "A manager reviews and either approves or rejects with notes (audit-logged).",
                            "يراجع المدير ويعتمد أو يرفض مع ملاحظات (مسجلة في سجل التدقيق).",
                          )}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800/60 flex items-center justify-center font-bold text-amber-900 dark:text-amber-200 flex-shrink-0 text-[10px]">
                          3
                        </span>
                        <span>
                          {t(
                            "Only after approval can a Case be created — and only from the report page.",
                            "لا تُنشأ الحالة إلا بعد الاعتماد، ومن صفحة التقرير فقط.",
                          )}
                        </span>
                      </li>
                    </ol>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {t("Report Title", "عنوان التقرير")} *
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t(
                      "e.g. Q2 Performance Gap — Ahmad Khalid",
                      "مثال: فجوة أداء الربع الثاني — أحمد خالد",
                    )}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {t("Summary Notes (optional)", "ملاحظات (اختياري)")}
                  </label>
                  <textarea
                    rows={2}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm resize-none"
                  />
                </div>

                {/* ── Summary card ── */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 overflow-hidden">
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
                      {t("Summary", "ملخص")}
                    </p>
                  </div>
                  <div className="p-4 space-y-2.5">
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-500">{t("Employee", "الموظف")}</span>
                      <span className="font-medium">
                        {selectedEmpData
                          ? `${selectedEmpData.first_name} ${selectedEmpData.last_name}`
                          : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-500">{t("Evidence Items", "عناصر الأدلة")}</span>
                      <span className="font-medium tabular-nums">{evidenceItems.length}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-500">{t("Categories", "التصنيفات")}</span>
                      <span className="font-medium tabular-nums">{selectedCategories.length}</span>
                    </div>
                    {selectedCategories.length > 0 && (
                      <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex flex-wrap gap-1.5">
                          {selectedCategories.map((c) => {
                            const cat = CATEGORIES.find((x) => x.id === c);
                            const pts = scoringBreakdown[c]?.points ?? 0;
                            return (
                              <span
                                key={c}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs border border-blue-200 dark:border-blue-900/50"
                              >
                                <span>{cat?.icon}</span>
                                <span>{lang === "ar" ? cat?.ar : cat?.en}</span>
                                {pts > 0 && (
                                  <span className="text-[10px] font-mono opacity-70 tabular-nums">
                                    ·{pts}
                                  </span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 1 ? t("Cancel", "إلغاء") : t("Back", "رجوع")}
          </button>

          {step < 4 ? (
            <button
              aria-label="Expand sidebar"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-blue-700"
            >
              {t("Next", "التالي")}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              aria-label="Action"
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isSubmitting
                ? t("Generating...", "جاري التوليد...")
                : t("Generate Diagnostic", "إنشاء التشخيص")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ScoreBoard — ranked categories with stacked contribution bars.

   Each row shows:
     • category icon + name
     • matches count
     • running total points
     • a horizontal stacked bar where each segment is one evidence
       item, width-proportional to its contribution.

   This is the "running score" view — every segment is one matched
   keyword × evidence item, so adding/removing evidence visibly
   changes the bar live.
   ───────────────────────────────────────────────────────────────────────── */

interface ScoreBoardProps {
  breakdown: Record<
    string,
    {
      categoryId: string;
      points: number;
      items: { evidenceIndex: number; keyword: string; points: number; reliability: string; source: string; description: string }[];
    }
  >;
  categories: typeof CATEGORIES;
  lang: "en" | "ar";
  t: (en: string, ar: string) => string;
}

function ScoreBoard({ breakdown, categories, lang, t }: ScoreBoardProps) {
  const ranked = Object.values(breakdown)
    .filter((b) => b.items.length > 0)
    .sort((a, b) => b.points - a.points);

  if (ranked.length === 0) {
    return (
      <p className="text-xs text-gray-500 italic">
        {t(
          "No keyword matches yet. Add evidence mentioning skills, processes, tools, workload, etc. to score categories.",
          "لا توجد مطابقات كلمات مفتاحية بعد. أضف أدلة تذكر المهارات أو العمليات أو الأدوات أو عبء العمل لتسجيل التصنيفات.",
        )}
      </p>
    );
  }

  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-md divide-y divide-gray-100 dark:divide-gray-800">
      <div className="grid grid-cols-12 gap-2 px-3 py-1.5 text-[10px] uppercase tracking-wider text-gray-400 font-medium">
        <div className="col-span-4">{t("Category", "التصنيف")}</div>
        <div className="col-span-2 text-center">{t("Matches", "مطابقات")}</div>
        <div className="col-span-2 text-right">{t("Score", "الدرجة")}</div>
        <div className="col-span-4">{t("Contribution", "المساهمة")}</div>
      </div>
      {ranked.map((b) => {
        const cat = categories.find((c) => c.id === b.categoryId);
        const label = cat ? (lang === "ar" ? cat.ar : cat.en) : b.categoryId;
        return (
          <div key={b.categoryId} className="grid grid-cols-12 gap-2 px-3 py-2 items-center">
            <div className="col-span-4 flex items-center gap-2 min-w-0">
              <span className="text-base flex-shrink-0">{cat?.icon}</span>
              <span className="text-xs font-medium truncate">{label}</span>
            </div>
            <div className="col-span-2 text-center text-xs text-gray-500">
              {b.items.length}
            </div>
            <div className="col-span-2 text-right">
              <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400">
                {b.points} pts
              </span>
            </div>
            <div className="col-span-4">
              <ContributionBar items={b.items} total={b.points} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * ContributionBar — stacked horizontal bar.
 * Each evidence item is a segment, width-proportional to its points.
 * Hovering shows the source + keyword tooltip.
 */
function ContributionBar({
  items,
  total,
}: {
  items: { evidenceIndex: number; keyword: string; points: number; reliability: string }[];
  total: number;
}) {
  if (total === 0) {
    return <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded" />;
  }
  // Colour by reliability (high → blue, medium → indigo, low → slate)
  const colorByReliability: Record<string, string> = {
    high: "bg-blue-500",
    medium: "bg-indigo-400",
    low: "bg-slate-400",
  };
  return (
    <div className="flex h-2 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
      {items.map((it, i) => (
        <div
          key={i}
          className={`${colorByReliability[it.reliability] ?? "bg-blue-500"} hover:opacity-80 transition-opacity`}
          style={{ width: `${(it.points / total) * 100}%` }}
          title={`#${it.evidenceIndex + 1} · "${it.keyword}" → +${it.points} pts (${it.reliability})`}
        />
      ))}
    </div>
  );
}

/**
 * WhatWouldBoost — for each unmatched category, list the keywords that
 * WOULD add points if the analyst adds evidence containing them.
 * Closes the gap between "I added 5 evidence items but only 2 categories scored"
 * and "what do I do next".
 */
function WhatWouldBoost({ breakdown, categories, lang, t }: ScoreBoardProps) {
  const unmatched = categories
    .filter((c) => !breakdown[c.id] || breakdown[c.id].items.length === 0)
    .map((c) => ({
      id: c.id,
      label: lang === "ar" ? c.ar : c.en,
      icon: c.icon,
      keywords: SCORING_RULES[c.id]?.keywords ?? [],
      points: SCORING_RULES[c.id]?.points ?? 0,
    }));

  if (unmatched.length === 0) return null;

  return (
    <div className="border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-900/10 rounded-md p-3">
      <p className="text-[11px] font-semibold text-amber-900 dark:text-amber-300 mb-2">
        {t(
          "What would boost unmatched categories?",
          "ماذا سيعزز التصنيفات غير المطابقة؟",
        )}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5">
        {unmatched.slice(0, 6).map((c) => (
          <div key={c.id} className="flex items-start gap-1.5 text-[10px] text-amber-800 dark:text-amber-300">
            <span className="flex-shrink-0">{c.icon}</span>
            <span className="min-w-0">
              <span className="font-medium">{c.label}: </span>
              <span className="font-mono">
                {c.keywords.map((kw, i) => (
                  <span key={kw}>
                    "{kw}"
                    {i < c.keywords.length - 1 ? ", " : ""}
                  </span>
                ))}
              </span>
              <span className="opacity-70"> → +{c.points} pts each</span>
            </span>
          </div>
        ))}
        {unmatched.length > 6 && (
          <div className="text-[10px] text-amber-700 dark:text-amber-400 col-span-full">
            {t(
              `+ ${unmatched.length - 6} more categories — see score board above.`,
              `+ ${unmatched.length - 6} تصنيفات أخرى — انظر لوحة الدرجات أعلاه.`,
            )}
          </div>
        )}
      </div>
    </div>
  );
}
