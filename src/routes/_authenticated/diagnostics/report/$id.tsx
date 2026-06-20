import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { MaturityBadge } from "~/components/wpos/MaturityBadge";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import {
  useDiagnostic,
  useSubmitForReview,
  useApproveDiagnostic,
  useRejectDiagnostic,
} from "@/hooks/useDiagnosticWorkflow";
import { useAuth } from "@/hooks/useAuth";
import { Stethoscope, Brain, CheckCircle, XCircle, Send, FileText, ChevronDown } from "lucide-react";
import { useState } from "react";

/**
 * Contribution bar — stacked horizontal bar where each segment is one
 * supporting evidence item, width-proportional to its implicit weight.
 * Mirrors the wizard's running-score visualisation so the report page
 * shows the same shape the analyst saw when generating the hypothesis.
 */
function HypothesisContributionBar({
  items,
  total,
}: {
  items: string[];
  total: number;
}) {
  if (total === 0 || items.length === 0) {
    return <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded" />;
  }
  const segW = 100 / items.length;
  return (
    <div className="flex h-2 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
      {items.map((it, i) => (
        <div
          key={i}
          className="bg-blue-500 hover:opacity-80 transition-opacity"
          style={{ width: `${segW}%` }}
          title={it}
        />
      ))}
    </div>
  );
}
import { PeerComparison } from "@/components/diagnostics/PeerComparison";
import { useCreateCaseFromDiagnostic } from "@/hooks/useCases";
import { useNavigate } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";

export const Route = createFileRoute("/_authenticated/diagnostics/report/$id")({
  component: DiagnosticReportPage,
});

function DiagnosticReportPage() {
  const { t, lang: l } = useLanguage();
  const { id } = Route.useParams();
  const { user } = useAuth();
  const { data: report, isLoading } = useDiagnostic(id);
  const submitForReview = useSubmitForReview();
  const approveMutation = useApproveDiagnostic();
  const rejectMutation = useRejectDiagnostic();
  const createCase = useCreateCaseFromDiagnostic();
  const navigate = useNavigate();
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-white rounded-xl border animate-pulse" />
        ))}
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-20 text-gray-400">
        <Stethoscope className="w-12 h-12 mx-auto mb-3" />
        <p>{t("Report not found", "التقرير غير موجود")}</p>
      </div>
    );
  }

  const emp = (report as Record<string, unknown>).employees as Record<string, unknown> | null;
  const dept = (report as Record<string, unknown>).departments as Record<string, unknown> | null;
  const hypotheses = ((report as Record<string, unknown>).diagnostic_hypotheses ?? []) as Array<
    Record<string, unknown>
  >;

  const statusColors: Record<string, string> = {
    draft: "yellow",
    evidence_collection: "blue",
    under_review: "orange",
    approved: "green",
    rejected: "red",
    final: "green",
  };

  const handleSubmit = async () => {
    await submitForReview.mutateAsync(report.id);
  };

  const handleApprove = async () => {
    await approveMutation.mutateAsync({
      reportId: report.id,
      reviewerId: user?.id ?? "",
    });
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    await rejectMutation.mutateAsync({
      reportId: report.id,
      reviewerId: user?.id ?? "",
      reason: rejectReason,
    });
    setShowReject(false);
    setRejectReason("");
  };

  return (
    <div>
      <PageHeader
        title={report.title}
        titleAr={report.title}
        description={`${t("Diagnostic Report", "تقرير تشخيصي")} — ${emp ? `${emp.first_name} ${emp.last_name}` : ""}`}
        descriptionAr={`${t("Diagnostic Report", "تقرير تشخيصي")} — ${emp ? `${emp.first_name} ${emp.last_name}` : ""}`}
        currentLang={l}
      />

      {/* Status Bar */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs text-gray-500">{t("Status", "الحالة")}</p>
            <StatusBadge
              status={statusColors[report.status ?? "draft"] ?? "gray"}
              label={(report.status ?? "draft").replace("_", " ")}
            />
          </div>
          <div>
            <p className="text-xs text-gray-500">{t("Maturity", "النضج")}</p>
            <MaturityBadge
              level={(report.maturity_level ?? 1) as 1 | 2 | 3 | 4 | 5}
              size="sm"
              currentLang={l}
            />
          </div>
          <div>
            <p className="text-xs text-gray-500">{t("Confidence", "الثقة")}</p>
            <span className="text-sm font-bold">{report.confidence_score ?? 0}%</span>
          </div>
          <div>
            <p className="text-xs text-gray-500">{t("Employee", "الموظف")}</p>
            <span className="text-sm font-medium">
              {emp ? `${emp.first_name} ${emp.last_name}` : "-"}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500">{t("Department", "الإدارة")}</p>
            <span className="text-sm">{(dept?.name as string) ?? "-"}</span>
          </div>

          {/* Action Buttons */}
          <div className="ml-auto flex gap-2">
            {report.status === "draft" && (
              <button
                aria-label="Send message"
                onClick={handleSubmit}
                disabled={submitForReview.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {submitForReview.isPending
                  ? t("Submitting...", "جاري الإرسال...")
                  : t("Submit for Review", "إرسال للمراجعة")}
              </button>
            )}
            {report.status === "under_review" && (
              <>
                <button
                  aria-label="Action"
                  onClick={handleApprove}
                  disabled={approveMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  {t("Approve", "اعتماد")}
                </button>
                <button
                  onClick={() => setShowReject(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium"
                >
                  <XCircle className="w-4 h-4" />
                  {t("Reject", "رفض")}
                </button>
              </>
            )}
            {report.status === "approved" && (
              <button
                onClick={async () => {
                  const c = await createCase.mutateAsync(report.id);
                  if (c?.id) navigate({ to: "/cases" });
                }}
                disabled={createCase.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                <Briefcase className="w-4 h-4" />
                {createCase.isPending
                  ? t("Creating Case...", "جاري إنشاء الحالة...")
                  : t("Create Case", "إنشاء حالة")}
              </button>
            )}
          </div>
        </div>

        {/* Reject Reason Form */}
        {showReject && (
          <div className="mt-4 pt-4 border-t space-y-2">
            <label className="block text-sm font-medium">
              {t("Rejection Reason", "سبب الرفض")}
            </label>
            <textarea
              rows={2}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm resize-none"
              placeholder={t(
                "Explain why this report is being rejected...",
                "اشرح سبب رفض هذا التقرير...",
              )}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowReject(false)}
                className="px-3 py-1.5 border rounded-lg text-sm"
              >
                {t("Cancel", "إلغاء")}
              </button>
              <button
                onClick={handleReject}
                disabled={rejectMutation.isPending || !rejectReason.trim()}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm disabled:opacity-50"
              >
                {t("Confirm Reject", "تأكيد الرفض")}
              </button>
            </div>
          </div>
        )}

        {/* Manager Review Note */}
        {report.manager_review && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500 mb-1">{t("Manager Review", "مراجعة المدير")}</p>
            <p className="text-sm bg-yellow-50 p-3 rounded-lg">{report.manager_review}</p>
          </div>
        )}
      </Card>

      {/* Performance Summary */}
      {report.performance_summary && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              <FileText className="w-4 h-4 inline mr-2" />
              {t("Performance Summary", "ملخص الأداء")}
            </CardTitle>
          </CardHeader>
          <p className="text-sm text-gray-600">{report.performance_summary}</p>
        </Card>
      )}

      {/* Hypotheses */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Brain className="w-4 h-4 inline mr-2" />
            {t("Diagnostic Hypotheses", "الفرضيات التشخيصية")} ({hypotheses.length})
          </CardTitle>
        </CardHeader>
        {hypotheses.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            {t(
              "No hypotheses generated yet. Go back and generate them.",
              "لم يتم توليد فرضيات بعد.",
            )}
          </p>
        ) : (
          <div className="space-y-4">
            {hypotheses
              .sort((a, b) => ((a.rank_order as number) ?? 99) - ((b.rank_order as number) ?? 99))
              .map((hyp, i) => {
                const conf = (hyp.confidence_score as number) ?? 0;
                const supporting = Array.isArray(hyp.supporting_evidence)
                  ? (hyp.supporting_evidence as string[])
                  : [];
                const breakdownId = `hyp-breakdown-${hyp.id ?? i}`;
                return (
                  <div
                    key={hyp.id as string}
                    className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-sm font-semibold capitalize">
                          {((hyp.category as string) ?? "").replace("_", " ")}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-blue-600">
                        {conf}% {t("confidence", "ثقة")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{hyp.hypothesis as string}</p>
                    {hyp.reasoning != null && (
                      <p className="text-xs text-gray-400 italic">{String(hyp.reasoning ?? "")}</p>
                    )}

                    {/* Why this score? affordance */}
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById(breakdownId);
                        if (el) el.classList.toggle("hidden");
                      }}
                      aria-expanded="false"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-purple-700 dark:text-purple-300 hover:underline"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      {t("Why this score?", "لماذا هذه الدرجة؟")}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <div id={breakdownId} className="hidden mt-2 p-3 bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-900 rounded-md">
                      <p className="text-[11px] text-gray-500 mb-2">
                        {t(
                          "This score is a transparent sum of keyword-matched evidence items, weighted by reliability. There is no hidden model — only the rules you can inspect below.",
                          "هذه الدرجة هي مجموع شفاف لعناصر الأدلة المطابقة بالكلمات المفتاحية، مرجحة بالموثوقية. لا يوجد نموذج مخفي — فقط القواعد التي يمكنك فحصها أدناه.",
                        )}
                      </p>

                      {/* Stacked contribution bar — visual running-score for this hypothesis */}
                      {supporting.length > 0 && (
                        <div className="mb-3">
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                            {t("Per-evidence contribution", "مساهمة كل دليل")}
                          </p>
                          <HypothesisContributionBar items={supporting} total={conf} />
                        </div>
                      )}

                      {supporting.length > 0 ? (
                        <ul className="text-xs space-y-1.5">
                          {supporting.map((ev, k) => (
                            <li key={k} className="flex items-start gap-2">
                              <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300">{ev}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-gray-500 italic">
                          {t(
                            "No supporting evidence was attached to this hypothesis at generation time.",
                            "لم تُرفق أدلة داعمة بهذه الفرضية وقت التوليد.",
                          )}
                        </p>
                      )}
                      <p className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-400">
                        {t(
                          `Score formula: min(100, sum(keyword_match_points × reliability_weight)). Each category keyword match adds 10–15 points; high-reliability evidence counts at full weight.`,
                          `صيغة الدرجة: min(100, مجموع(نقاط مطابقة الكلمة المفتاحية × وزن الموثوقية)). كل مطابقة تضيف 10-15 نقطة؛ أدلة الموثوقية العالية تُحسب بوزن كامل.`,
                        )}
                      </p>
                    </div>

                    {Array.isArray(hyp.supporting_evidence) &&
                      (hyp.supporting_evidence as string[]).length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 font-medium mb-1">
                            {t("Supporting Evidence:", "أدلة داعمة:")}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {(hyp.supporting_evidence as string[]).map((e, j) => (
                              <span
                                key={j}
                                className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs"
                              >
                                {e}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                );
              })}
          </div>
        )}
      </Card>

      {/* Peer Comparison */}
      {report.employee_id && (
        <Card className="mt-6">
          <PeerComparison
            employeeId={report.employee_id}
            employeeName={emp ? `${emp.first_name} ${emp.last_name}` : ""}
          />
        </Card>
      )}
    </div>
  );
}
