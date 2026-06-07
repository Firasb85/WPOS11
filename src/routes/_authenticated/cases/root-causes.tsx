import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { FormSelect } from "~/components/wpos/FormInput";
import { BookOpen, Search, AlertTriangle, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRootCauseMetrics } from "@/hooks/useAnalytics";
export const Route = createFileRoute("/_authenticated/cases/root-causes")({
  component: RootCauseKBPage,
});
function RootCauseKBPage() {
  const { data: rootCauses } = useRootCauseMetrics();
  const l = "ar";
  const [cat, setCat] = useState("all");
  const causes = [
    {
      code: "SKL-001",
      nA: "نقص المهارات التقنية",
      nE: "Technical Skill Deficiency",
      cat: "skill_gap",
      cA: "فجوة مهارية",
      desc: "Employee lacks required technical skills for the role",
      symptoms: ["Struggles with technical tasks", "Requires frequent assistance"],
      methods: ["Skills assessment test", "Practical demonstration"],
      actions: ["Technical training program", "Assign technical mentor"],
    },
    {
      code: "SKL-002",
      nA: "ضعف مهارات التحليل",
      nE: "Weak Analytical Skills",
      cat: "skill_gap",
      cA: "فجوة مهارية",
      desc: "Difficulty analyzing data",
      symptoms: ["Slow data processing", "Incorrect conclusions"],
      methods: ["Data analysis test", "Case study"],
      actions: ["Data literacy program", "Pair with senior analyst"],
    },
    {
      code: "KNW-001",
      nA: "نقص المعرفة بالمنتج",
      nE: "Product Knowledge Gap",
      cat: "knowledge_gap",
      cA: "فجوة معرفية",
      desc: "Insufficient product knowledge",
      symptoms: ["Unable to answer questions", "Incorrect recommendations"],
      methods: ["Product assessment", "Quality review"],
      actions: ["Product training", "Shadow senior colleagues"],
    },
    {
      code: "PRC-001",
      nA: "ضعف العملية",
      nE: "Process Inefficiency",
      cat: "process_issue",
      cA: "مشكلة إجرائية",
      desc: "Bottlenecks affecting performance",
      symptoms: ["Multiple KPIs declining", "High cycle times"],
      methods: ["Process audit", "Time-motion study"],
      actions: ["Redesign process flow", "Remove unnecessary steps"],
    },
    {
      code: "MOT-001",
      nA: "انخفاض الدافعية",
      nE: "Low Motivation",
      cat: "motivation_issue",
      cA: "تحفيز",
      desc: "Low engagement",
      symptoms: ["Declining trend", "Minimal participation"],
      methods: ["One-on-one discussion", "Engagement survey"],
      actions: ["Career discussion", "Recognition program"],
    },
  ];
  const filtered = cat === "all" ? causes : causes.filter((c) => c.cat === cat);
  const [sel, setSel] = useState<string | null>(null);
  const selected = sel ? causes.find((c) => c.code === sel) : null;
  return (
    <div>
      <PageHeader
        title="Root Cause Knowledge Base"
        titleAr="قاعدة المعرفة للأسباب الجذرية"
        description="Library of identified root causes with indicators and validation methods"
        descriptionAr="مكتبة الأسباب الجذرية مع المؤشرات وطرق التحقق"
        currentLang={l}
        actions={
          <FormSelect
            options={[
              { value: "all", label: "All Categories", labelAr: "جميع الفئات" },
              { value: "skill_gap", label: "Skill Gap", labelAr: "فجوة مهارية" },
              { value: "knowledge_gap", label: "Knowledge Gap", labelAr: "فجوة معرفية" },
              { value: "process_issue", label: "Process Issue", labelAr: "مشكلة إجرائية" },
              { value: "motivation_issue", label: "Motivation", labelAr: "تحفيز" },
            ]}
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            currentLang={l}
          />
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-2">
          {filtered.map((rc, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${sel === rc.code ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-300"}`}
              onClick={() => setSel(rc.code)}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-mono text-gray-500">{rc.code}</span>
              </div>
              <p className="text-sm font-medium mt-1">{l === "ar" ? rc.nA : rc.nE}</p>
              <p className="text-xs text-gray-500">
                {l === "ar" ? rc.cA : rc.cat.replace("_", " ")}
              </p>
            </div>
          ))}
        </div>
        <div className="lg:col-span-2">
          {selected ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{l === "ar" ? selected.nA : selected.nE}</CardTitle>
                </CardHeader>
                <p className="text-sm text-gray-600 mb-4">{selected.desc}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-orange-600 flex items-center gap-1 mb-2">
                      <AlertTriangle className="w-3 h-3" />
                      {l === "ar" ? "الأعراض" : "Symptoms"}
                    </p>
                    <ul className="space-y-1">
                      {selected.symptoms.map((s, j) => (
                        <li key={j} className="text-xs text-gray-600 flex items-start gap-1">
                          <span className="text-orange-500 mt-0.5">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-blue-600 flex items-center gap-1 mb-2">
                      <Search className="w-3 h-3" />
                      {l === "ar" ? "طرق التحقق" : "Validation"}
                    </p>
                    <ul className="space-y-1">
                      {selected.methods.map((m, j) => (
                        <li key={j} className="text-xs text-gray-600 flex items-start gap-1">
                          <span className="text-blue-500 mt-0.5">•</span>
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <ArrowRight className="w-3 h-3 inline mr-1" />
                    {l === "ar" ? "الإجراءات الموصى بها" : "Recommended Actions"}
                  </CardTitle>
                </CardHeader>
                <div className="flex flex-wrap gap-2">
                  {selected.actions.map((a, j) => (
                    <span
                      key={j}
                      className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{l === "ar" ? "اختر سبباً جذرياً لعرض التفاصيل" : "Select a root cause"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
