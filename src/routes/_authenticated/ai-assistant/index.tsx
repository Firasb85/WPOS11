import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { FormSelect, FormTextarea } from "~/components/wpos/FormInput";
import {
  Bot,
  AlertTriangle,
  Lightbulb,
  FileSearch,
  User,
  Activity,
  Send,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { useCeoDashboard } from "@/hooks/useDashboard";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
export const Route = createFileRoute("/_authenticated/ai-assistant/")({
  component: AiAssistantPage,
});
function AiAssistantPage() {
  const { t } = useLanguage();
  const { data: _metrics, isLoading: _metricsLoading } = useCeoDashboard();
  const l = "ar";
  const [mode, setMode] = useState("summarize");
  const interactions = [
    {
      type: "summarize",
      q: "Summarize diagnostic for Ahmad Khalid",
      r: "This diagnostic report identifies a Data Analysis skill gap as the primary root cause (84% confidence). The employee's competency level is 2/4. Recommended action: technical training program. Human validation required before proceeding.",
      time: "1m ago",
    },
    {
      type: "compare",
      q: "Compare Q1 vs Q2 performance",
      r: "Performance declined from 82% to 78% (-4.9%) overall. Skill gap-related issues increased by 15%. Process-related issues remained stable. Recommended: focus on skill development programs. Human review recommended.",
      time: "5m ago",
    },
  ];
  return (
    <div>
      <PageHeader
        title={t("AI Assistant", "المساعد الذكي")}
        titleAr="المساعد الذكي"
        description="AI-powered insights — all outputs require human validation"
        descriptionAr="رؤى مدعومة بالذكاء الاصطناعي — جميع المخرجات تتطلب التحقق البشري"
        currentLang={l}
      />
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
            {l === "ar" ? "تنبيه: مساعد استشاري فقط" : "Notice: Advisory-Only Assistant"}
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-300">
            {l === "ar"
              ? "جميع المخرجات هي توصيات. لا يتخذ أي قرارات. الموافقة البشرية مطلوبة دائماً."
              : "All outputs are recommendations. No decisions are made. Human approval is always required."}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-2">
          <button
            aria-label="Action"
            onClick={() => setMode("summarize")}
            className={`w-full p-3 rounded-lg border text-left transition-all ${mode === "summarize" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-300"}`}
          >
            <FileSearch className="w-4 h-4 text-blue-600 mb-1" />
            <p className="text-sm font-medium">
              {l === "ar" ? "تلخيص تشخيص" : "Summarize Diagnostic"}
            </p>
            <p className="text-xs text-gray-500">
              {l === "ar" ? "إنشاء ملخص لتقرير تشخيصي" : "Generate summary of diagnostic report"}
            </p>
          </button>
          <button
            aria-label="Action"
            onClick={() => setMode("explain")}
            className={`w-full p-3 rounded-lg border text-left transition-all ${mode === "explain" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-300"}`}
          >
            <Lightbulb className="w-4 h-4 text-yellow-600 mb-1" />
            <p className="text-sm font-medium">
              {l === "ar" ? "شرح الأسباب" : "Explain Root Causes"}
            </p>
            <p className="text-xs text-gray-500">
              {l === "ar" ? "شرح الأسباب الجذرية" : "Explain root cause analysis"}
            </p>
          </button>
          <button
            aria-label="Action"
            onClick={() => setMode("compare")}
            className={`w-full p-3 rounded-lg border text-left transition-all ${mode === "compare" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-300"}`}
          >
            <Activity className="w-4 h-4 text-purple-600 mb-1" />
            <p className="text-sm font-medium">{l === "ar" ? "مقارنة فترات" : "Compare Periods"}</p>
            <p className="text-xs text-gray-500">
              {l === "ar" ? "مقارنة الأداء عبر الفترات" : "Compare performance across periods"}
            </p>
          </button>
          <button
            aria-label="Action"
            onClick={() => setMode("insights")}
            className={`w-full p-3 rounded-lg border text-left transition-all ${mode === "insights" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-300"}`}
          >
            <Bot className="w-4 h-4 text-green-600 mb-1" />
            <p className="text-sm font-medium">{l === "ar" ? "رؤى ذكية" : "Generate Insights"}</p>
            <p className="text-xs text-gray-500">
              {l === "ar" ? "توليد رؤى تشغيلية" : "Generate operational insights"}
            </p>
          </button>
        </div>
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <FormSelect
              label={l === "ar" ? "نوع الاستعلام" : "Query Type"}
              labelAr="نوع الاستعلام"
              options={[
                { value: "summarize", label: "Summarize Diagnostic", labelAr: "تلخيص تشخيص" },
                { value: "explain", label: "Explain Root Causes", labelAr: "شرح الأسباب" },
                { value: "compare", label: "Compare Periods", labelAr: "مقارنة فترات" },
                { value: "insights", label: "Generate Insights", labelAr: "رؤى ذكية" },
              ]}
              value={mode}
              currentLang={l}
            />
            <FormTextarea
              label={l === "ar" ? "السياق" : "Context"}
              labelAr="السياق"
              placeholder={l === "ar" ? "أدخل سياق التحليل..." : "Enter analysis context..."}
              currentLang={l}
            />
            <div className="flex justify-end">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Send className="w-4 h-4" />
                <span>{l === "ar" ? "توليد" : "Generate"}</span>
              </button>
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Shield className="w-4 h-4 inline mr-1" />
                {l === "ar" ? "النتائج الأخيرة" : "Recent Results"}
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {interactions.map((ix, i) => (
                <div
                  key={i}
                  className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-l-4 border-blue-500"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium uppercase text-blue-600">{ix.type}</span>
                    <span className="text-xs text-gray-400 ml-auto">{ix.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{ix.q}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{ix.r}</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{l === "ar" ? "التحقق البشري مطلوب" : "Human validation required"}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
