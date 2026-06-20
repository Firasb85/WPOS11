import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useFollowUps } from "@/hooks/useCases";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  CalendarClock,
  Activity,
  Sparkles,
  Target,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/follow-up/")({
  component: Follow_upPage,
});

function Follow_upPage() {
  const { t, lang, isRTL } = useLanguage();
  const { data: followUps, isLoading } = useFollowUps();
  const items = (followUps ?? []) as Array<Record<string, unknown>>;

  // Stats
  const total = items.length;
  const completed = items.filter((i) => i.status === "completed").length;
  const scheduled = items.filter((i) => i.status === "scheduled").length;
  const overdue = items.filter((i) => {
    if (i.status !== "scheduled") return false;
    const d = String(i.check_in_date ?? "");
    return d ? new Date(d).getTime() < Date.now() : false;
  }).length;

  // Average improvement across completed follow-ups with a real measurement
  const completedWithData = items.filter(
    (i) =>
      i.status === "completed" &&
      typeof i.kpi_value_before === "number" &&
      typeof i.kpi_value_after === "number",
  );
  const avgImprovement =
    completedWithData.length > 0
      ? completedWithData.reduce(
          (s, i) =>
            s +
            (((i.kpi_value_after as number) - (i.kpi_value_before as number)) /
              (i.kpi_value_before as number)) *
              100,
          0,
        ) / completedWithData.length
      : 0;

  // Sort by check-in date descending
  const sorted = [...items].sort(
    (a, b) =>
      new Date(String(b.check_in_date ?? 0)).getTime() -
      new Date(String(a.check_in_date ?? 0)).getTime(),
  );

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <PageHeader
        title="Follow-Up Tracking"
        titleAr="تتبع المتابعة"
        description="30 / 60 / 90-day intervention cycles with measurable improvement"
        descriptionAr="دورات متابعة 30 / 60 / 90 يوماً مع قياس التحسن"
        currentLang={lang}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title={t("Total Follow-Ups", "إجمالي المتابعات")}
          value={String(total)}
          icon={<Clock />}
          status="good"
        />
        <StatsCard
          title={t("Scheduled", "مجدولة")}
          value={String(scheduled)}
          icon={<CalendarClock />}
          status={overdue > 0 ? "critical" : "good"}
        />
        <StatsCard
          title={t("Completed", "مكتملة")}
          value={String(completed)}
          icon={<CheckCircle />}
          status="good"
        />
        <StatsCard
          title={t("Avg Improvement", "متوسط التحسن")}
          value={
            completedWithData.length > 0
              ? `${avgImprovement >= 0 ? "+" : ""}${avgImprovement.toFixed(1)}%`
              : "N/A"
          }
          icon={<TrendingUp />}
          status={
            avgImprovement >= 5
              ? "good"
              : avgImprovement >= 0
                ? "warning"
                : "critical"
          }
        />
      </div>

      {/* Overdue alert */}
      {overdue > 0 && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-900/50 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-900 dark:text-red-200">
              {t(
                `${overdue} overdue follow-up${overdue > 1 ? "s" : ""}`,
                `${overdue} متابعات متأخرة`,
              )}
            </p>
            <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">
              {t(
                "Schedule and conduct these check-ins to keep intervention cycles on track.",
                "جدول وأجر هذه المتابعات للحفاظ على سير دورات التدخل.",
              )}
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            <Activity className="w-4 h-4 inline mr-2" />
            {t("Follow-Up Cycles", "دورات المتابعة")}
            <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold tabular-nums">
              {total}
            </span>
          </CardTitle>
        </CardHeader>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"
              />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState t={t} />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {sorted.slice(0, 20).map((f, i) => {
              const caseData = (f.cases ?? null) as Record<string, unknown> | null;
              const emp =
                (caseData?.employees as Record<string, string> | null) ?? null;
              const empName = emp
                ? `${emp.first_name ?? ""} ${emp.last_name ?? ""}`.trim()
                : "—";
              const caseNum = String(caseData?.case_number ?? `FU-${i + 1}`);
              const cycleType = String(f.follow_up_type ?? "check-in");
              const checkInDate = String(f.check_in_date ?? "");
              const status = String(f.status ?? "scheduled");
              const before = typeof f.kpi_value_before === "number" ? f.kpi_value_before : null;
              const after = typeof f.kpi_value_after === "number" ? f.kpi_value_after : null;
              const imp =
                typeof f.improvement_pct === "number" ? f.improvement_pct : null;
              const computedImp =
                imp !== null
                  ? imp
                  : before !== null && after !== null && before !== 0
                    ? ((after - before) / before) * 100
                    : null;

              const overdueScheduled =
                status === "scheduled" &&
                checkInDate &&
                new Date(checkInDate).getTime() < Date.now();

              // Status palette
              const statusPalette = overdueScheduled
                ? {
                    bg: "bg-red-50 dark:bg-red-900/15",
                    border: "border-l-red-500",
                    badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
                    label: t("Overdue", "متأخر"),
                    text: "text-red-700 dark:text-red-400",
                  }
                : status === "completed"
                  ? {
                      bg: "bg-green-50/50 dark:bg-green-900/10",
                      border: "border-l-green-500",
                      badge:
                        "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
                      label: t("Completed", "مكتمل"),
                      text: "text-green-700 dark:text-green-400",
                    }
                  : {
                      bg: "bg-blue-50/40 dark:bg-blue-900/10",
                      border: "border-l-blue-500",
                      badge:
                        "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
                      label: t("Scheduled", "مجدول"),
                      text: "text-blue-700 dark:text-blue-400",
                    };

              return (
                <div
                  key={String(f.id ?? i)}
                  className={`flex items-stretch gap-4 p-4 border-l-4 ${statusPalette.border} ${statusPalette.bg} transition-colors`}
                >
                  {/* Date column */}
                  <div className="flex flex-col items-center justify-center min-w-[64px] text-center">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                      {formatDateMonth(checkInDate)}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums leading-none mt-1">
                      {formatDateDay(checkInDate)}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 tabular-nums">
                      {formatDateYear(checkInDate)}
                    </p>
                  </div>

                  {/* Content column */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {empName}
                      </span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs font-mono text-gray-500">{caseNum}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap ${statusPalette.badge}`}
                      >
                        {statusPalette.label}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wider">
                        {cycleType}
                      </span>
                    </div>

                    {before !== null && after !== null ? (
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                            {t("Before", "قبل")}
                          </span>
                          <span className="text-sm font-mono text-gray-500 tabular-nums">
                            {before.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-gray-300">→</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                            {t("After", "بعد")}
                          </span>
                          <span className="text-sm font-mono font-semibold text-gray-900 dark:text-white tabular-nums">
                            {after.toFixed(1)}
                          </span>
                        </div>
                        {computedImp !== null && (
                          <span
                            className={`text-xs font-bold tabular-nums ${computedImp >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {computedImp >= 0 ? "+" : ""}
                            {computedImp.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic mt-1">
                        {t(
                          "No KPI measurements attached to this follow-up.",
                          "لا توجد قياسات مؤشر مرتبطة بهذه المتابعة.",
                        )}
                      </p>
                    )}

                    {f.notes ? (
                      <p className="text-xs text-gray-500 mt-1.5 line-clamp-1 italic">
                        {String(f.notes)}
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}
            {sorted.length > 20 && (
              <div className="p-3 text-center text-xs text-gray-400">
                {t(
                  `Showing 20 of ${sorted.length} follow-ups.`,
                  `عرض 20 من ${sorted.length} متابعة.`,
                )}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Methodology */}
      <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/15 dark:to-indigo-900/15 border border-blue-100 dark:border-blue-900/50 rounded-lg flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1 flex items-center gap-2">
            <Target className="w-3.5 h-3.5" />
            {t("30 / 60 / 90-Day Cycle", "دورة 30 / 60 / 90 يوماً")}
          </p>
          <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
            {t(
              "Each case opens three follow-up windows: 30 days (early signal), 60 days (mid-cycle), and 90 days (closure). Improvement is computed from the KPI value attached to each follow-up vs. the value at case creation.",
              "كل حالة تفتح ثلاث نوافذ متابعة: 30 يوماً (إشارة مبكرة)، 60 يوماً (منتصف الدورة)، و90 يوماً (الإغلاق). يُحسب التحسن من قيمة المؤشر المرفقة مع كل متابعة مقارنة بالقيمة عند إنشاء الحالة.",
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Empty state — shown when no follow-ups exist yet.
 * Explains the 30/60/90 model and shows where to start.
 */
function EmptyState({ t }: { t: (en: string, ar: string) => string }) {
  return (
    <div className="p-10 text-center">
      <Clock className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
        {t("No follow-ups yet", "لا توجد متابعات بعد")}
      </p>
      <p className="text-xs text-gray-400 max-w-md mx-auto">
        {t(
          "Follow-ups are created when a Case reaches its 30, 60, or 90-day check-in window. Open a Case from an approved Diagnostic to start the cycle.",
          "تُنشأ المتابعات عندما تصل الحالة إلى نافذة المتابعة عند 30 أو 60 أو 90 يوماً. افتح حالة من تشخيص معتمد لبدء الدورة.",
        )}
      </p>
    </div>
  );
}

/** "Mar" / "أيار" — short month label */
function formatDateMonth(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short" });
}

/** Day of month */
function formatDateDay(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return String(d.getDate());
}

/** Year (or empty if current) */
function formatDateYear(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  return y === new Date().getFullYear() ? "" : String(y);
}
