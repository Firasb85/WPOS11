import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { FormSelect, FormTextarea } from "~/components/wpos/FormInput";
import { Plus, Play } from "lucide-react";
import { useState } from "react";
import { useCeoDashboard } from "@/hooks/useDashboard";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
export const Route = createFileRoute("/_authenticated/rules-engine/")({
  component: RulesEnginePage,
});
function RulesEnginePage() {
  const { t, lang: l } = useLanguage();
  const { data: _metrics, isLoading: _metricsLoading } = useCeoDashboard();
  const [type, setType] = useState("all");
  const [testResult, setTestResult] = useState<string | null>(null);
  const rules = [
    {
      code: "DIAG-CONF-001",
      nE: "Diagnostic Confidence Rule",
      nA: "قاعدة الثقة التشخيصية",
      t: "diagnostic",
      tA: "تشخيص",
      cat: "Diagnostic Quality",
      pri: 1,
      st: true,
      rules: [{ c: "minEvidenceCount >= 3" }, { c: "requireVerifiedEvidence: true" }],
      acts: ["setMaturityFloor: 2", "labelRequired"],
    },
    {
      code: "KPI-ALERT-001",
      nE: "Critical KPI Alert",
      nA: "تنبيه مؤشر حرج",
      t: "kpi",
      tA: "مؤشر",
      cat: "KPI Monitoring",
      pri: 1,
      st: true,
      rules: [{ c: "status = red" }, { c: "duration >= 3 periods" }],
      acts: ["createNotification", "escalateTo: dept_manager", "createCase"],
    },
    {
      code: "RISK-HIGH-001",
      nE: "High Risk Escalation",
      nA: "تصعيد مخاطرة عالية",
      t: "risk",
      tA: "مخاطرة",
      cat: "Risk Management",
      pri: 2,
      st: true,
      rules: [{ c: "riskScore > 70" }],
      acts: ["notifyManagers", "scheduleReview", "priority: high"],
    },
  ];
  const types = [
    { v: "all", l: "All Rules", lA: "جميع القواعد" },
    { v: "diagnostic", l: "Diagnostic", lA: "تشخيص" },
    { v: "kpi", l: "KPI", lA: "مؤشر" },
    { v: "escalation", l: "Escalation", lA: "تصعيد" },
    { v: "workflow", l: "Workflow", lA: "سير عمل" },
    { v: "notification", l: "Notification", lA: "إشعار" },
    { v: "maturity", l: "Maturity", lA: "نضج" },
    { v: "risk", l: "Risk", lA: "مخاطرة" },
  ];
  const filtered = type === "all" ? rules : rules.filter((r) => r.t === type);
  return (
    <div>
      <PageHeader
        title="Business Rules Engine"
        titleAr="محرك قواعد الأعمال"
        description="Centralized configurable rules engine for diagnostics, KPIs, escalation, and more"
        descriptionAr="محرك قواعد مركزي قابل للتكوين للتشخيص والمؤشرات والتصعيد والمزيد"
        currentLang={l}
        actions={
          <div className="flex items-center gap-2">
            <FormSelect
              options={types.map((t) => ({ value: t.v, label: t.l, labelAr: t.lA }))}
              value={type}
              onChange={(e) => setType(e.target.value)}
              currentLang={l}
            />
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              <Plus className="w-4 h-4" />
              <span>{l === "ar" ? "قاعدة جديدة" : "New Rule"}</span>
            </button>
          </div>
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {types
          .filter((t) => t.v !== "all")
          .map((t, i) => (
            <Card
              key={i}
              className="text-center cursor-pointer hover:shadow-md"
              onClick={() => setType(t.v)}
            >
              <p className="text-lg font-bold text-blue-600">
                {rules.filter((r) => r.t === t.v).length}
              </p>
              <p className="text-xs text-gray-500">{l === "ar" ? t.lA : t.l}</p>
            </Card>
          ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((r, i) => (
            <Card key={i} className="hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-gray-400">{r.code}</span>
                    <StatusBadge status={"active"} size="sm" label={r.st ? "Active" : "Inactive"} />
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                      {l === "ar" ? r.tA : r.t}
                    </span>
                  </div>
                  <h3 className="font-medium">{l === "ar" ? r.nA : r.nE}</h3>
                  <p className="text-xs text-gray-500">
                    {r.cat} · Priority {r.pri}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">v{r.pri}.0</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Conditions</p>
                  <div className="space-y-1">
                    {r.rules.map((rl, j) => (
                      <div
                        key={j}
                        className="px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded text-xs font-mono text-gray-600"
                      >
                        {rl.c}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">{t("Actions", "الإجراءات")}</p>
                  <div className="space-y-1">
                    {r.acts.map((a, j) => (
                      <div
                        key={j}
                        className="px-2 py-1 bg-blue-50 rounded text-xs font-mono text-blue-700"
                      >
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() =>
                    setTestResult(
                      `Rule ${r.code} executed successfully. ${r.acts.length} action(s) triggered.`,
                    )
                  }
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs hover:bg-gray-50"
                >
                  <Play className="w-3 h-3" />
                  <span>{l === "ar" ? "اختبار" : "Test"}</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                <Play className="w-4 h-4 inline mr-1" />
                {l === "ar" ? "اختبار القاعدة" : "Rule Tester"}
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <FormSelect
                label={l === "ar" ? "القاعدة" : "Rule"}
                labelAr="القاعدة"
                options={rules.map((r) => ({ value: r.code, label: r.nE, labelAr: r.nA }))}
                value="DIAG-CONF-001"
                currentLang={l}
              />
              <FormTextarea
                label={l === "ar" ? "سياق الاختبار" : "Test Context"}
                labelAr="سياق الاختبار"
                placeholder={l === "ar" ? "JSON سياق الاختبار..." : "Test context JSON..."}
                currentLang={l}
              />
              <button aria-label="Run rule" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                <Play className="w-4 h-4 inline mr-1" />
                {l === "ar" ? "تشغيل الاختبار" : "Run Test"}
              </button>
              {testResult && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs font-medium text-green-700">Result</p>
                  <p className="text-sm text-green-600 mt-1">{testResult}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
