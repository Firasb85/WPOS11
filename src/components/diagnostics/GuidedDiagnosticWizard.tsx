import { useState, useCallback, useMemo } from "react";
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
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-1">
                  {t("Select Underperforming Employee", "اختر الموظف ذو الأداء المنخفض")}
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  {t(
                    "Employees with RED KPI status are highlighted",
                    "الموظفون ذوو حالة مؤشرات حمراء مميزون",
                  )}
                </p>
              </div>

              {underperformers.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-red-600 mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {t(
                      `${underperformers.length} employees at risk`,
                      `${underperformers.length} موظفين في خطر`,
                    )}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {underperformers.map((emp) => (
                      <button
                        aria-label="Action"
                        key={emp.id}
                        onClick={() => setSelectedEmployee(emp.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${selectedEmployee === emp.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-red-200 bg-red-50/50 hover:border-red-300"}`}
                      >
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <UserCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {emp.first_name} {emp.last_name}
                          </p>
                          <p className="text-xs text-red-500">
                            {
                              (snapshots ?? []).filter(
                                (s) => s.employee_id === emp.id && s.status === "red",
                              ).length
                            }{" "}
                            RED KPIs
                          </p>
                        </div>
                      </button>
                    ))}
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
                      {e.first_name} {e.last_name} {e.employee_code ? `(${e.employee_code})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {selectedEmployee && redSnaps.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-red-700 mb-2">
                    {t("Performance Issues Detected:", "مشاكل أداء مكتشفة:")}
                  </p>
                  <div className="space-y-1">
                    {redSnaps.map((s) => {
                      const kpi = (s as Record<string, unknown>).kpis as Record<
                        string,
                        unknown
                      > | null;
                      return (
                        <div key={s.id} className="flex items-center justify-between text-xs">
                          <span className="text-red-600">{(kpi?.name as string) ?? "KPI"}</span>
                          <span className="font-mono text-red-700">
                            Gap:{" "}
                            {s.gap_percentage != null
                              ? `${Number(s.gap_percentage).toFixed(1)}%`
                              : "N/A"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

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
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-1">
                  {t("Suspected Root Cause Categories", "تصنيفات الأسباب الجذرية المشتبهة")}
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  {t(
                    "Select categories you suspect. The engine will validate against evidence.",
                    "اختر التصنيفات المشتبه بها. سيتحقق المحرك من الأدلة.",
                  )}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => {
                  const catScore = scoringBreakdown[cat.id]?.points ?? 0;
                  const catMatches = scoringBreakdown[cat.id]?.items.length ?? 0;
                  const isSelected = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{lang === "ar" ? cat.ar : cat.en}</p>
                        <p className="text-[10px] text-gray-500">
                          {t(
                            `${catMatches} match${catMatches === 1 ? "" : "es"} · ${catScore} pts`,
                            `${catMatches} مطابقة · ${catScore} نقطة`,
                          )}
                        </p>
                      </div>
                      {isSelected && <CheckCircle className="w-3 h-3 text-blue-600" />}
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
                    {evidenceItems.length === 0 && (
                      <p className="text-xs text-amber-600">
                        {t(
                          "No evidence attached yet. Add evidence in Step 2 to see scoring.",
                          "لا توجد أدلة مرفقة بعد. أضف أدلة في الخطوة 2 لرؤية التسجيل.",
                        )}
                      </p>
                    )}
                    {Object.values(scoringBreakdown)
                      .filter((b) => b.items.length > 0)
                      .sort((a, b) => b.points - a.points)
                      .map((b) => {
                        const cat = CATEGORIES.find((c) => c.id === b.categoryId);
                        return (
                          <div key={b.categoryId} className="border border-gray-100 dark:border-gray-800 rounded-md p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{cat?.icon}</span>
                                <span className="text-sm font-semibold">
                                  {cat ? (lang === "ar" ? cat.ar : cat.en) : b.categoryId}
                                </span>
                              </div>
                              <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                                +{b.points} pts
                              </span>
                            </div>
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="text-gray-400 text-[10px] uppercase">
                                  <th className="text-left pb-1 font-medium">
                                    {t("Evidence", "الدليل")}
                                  </th>
                                  <th className="text-left pb-1 font-medium">
                                    {t("Match", "مطابقة")}
                                  </th>
                                  <th className="text-right pb-1 font-medium">
                                    {t("Pts", "نقاط")}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {b.items.map((it, i) => (
                                  <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                                    <td className="py-1.5 pr-2">
                                      <p className="text-gray-700 dark:text-gray-300 line-clamp-1">
                                        {it.description}
                                      </p>
                                      <p className="text-[10px] text-gray-400">
                                        {it.source} · {it.reliability}
                                      </p>
                                    </td>
                                    <td className="py-1.5 pr-2">
                                      <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded text-[10px] font-mono">
                                        "{it.keyword}"
                                      </span>
                                    </td>
                                    <td className="py-1.5 text-right font-mono font-semibold text-blue-700 dark:text-blue-400">
                                      +{it.points}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      })}
                    {Object.values(scoringBreakdown).every((b) => b.items.length === 0) &&
                      evidenceItems.length > 0 && (
                        <p className="text-xs text-gray-500 italic">
                          {t(
                            "No keyword matches yet. Add evidence mentioning skills, processes, tools, workload, etc. to score categories.",
                            "لا توجد مطابقات كلمات مفتاحية بعد. أضف أدلة تذكر المهارات أو العمليات أو الأدوات أو عبء العمل لتسجيل التصنيفات.",
                          )}
                        </p>
                      )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
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
                    <ul className="text-[11px] text-amber-800 dark:text-amber-300 mt-2 space-y-0.5 list-disc list-inside">
                      <li>
                        {t(
                          "This report enters 'Under Review' status after generation.",
                          "يدخل هذا التقرير حالة 'قيد المراجعة' بعد الإنشاء.",
                        )}
                      </li>
                      <li>
                        {t(
                          "Only an authorized manager can promote it to a Case.",
                          "يمكن لمدير مفوض فقط ترقيته إلى حالة.",
                        )}
                      </li>
                      <li>
                        {t(
                          "Reviewer notes are recorded in the audit log.",
                          "تُسجل ملاحظات المراجع في سجل التدقيق.",
                        )}
                      </li>
                    </ul>
                  </div>
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

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("Employee", "الموظف")}</span>
                  <span className="font-medium">
                    {selectedEmpData
                      ? `${selectedEmpData.first_name} ${selectedEmpData.last_name}`
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("Evidence Items", "عناصر الأدلة")}</span>
                  <span className="font-medium">{evidenceItems.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("Categories", "التصنيفات")}</span>
                  <span className="font-medium">{selectedCategories.length}</span>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedCategories.map((c) => {
                    const cat = CATEGORIES.find((x) => x.id === c);
                    return (
                      <span
                        key={c}
                        className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                      >
                        {cat?.icon} {lang === "ar" ? cat?.ar : cat?.en}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
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
