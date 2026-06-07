import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { DataTable } from "~/components/wpos/DataTable";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import {
  Plus,
  FileSearch,
  Lightbulb,
  CheckCircle,
  XCircle,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
export const Route = createFileRoute("/_authenticated/diagnostics/")({
  component: DiagnosticsPage,
});

const catColors: Record<string, string> = {
  skill_gap: "bg-blue-100 border-blue-300",
  knowledge_gap: "bg-indigo-100 border-indigo-300",
  process_issue: "bg-purple-100 border-purple-300",
  tool_issue: "bg-orange-100 border-orange-300",
  environmental_issue: "bg-pink-100 border-pink-300",
  resource_issue: "bg-teal-100 border-teal-300",
  management_issue: "bg-red-100 border-red-300",
  motivation_issue: "bg-yellow-100 border-yellow-300",
  workload_issue: "bg-cyan-100 border-cyan-300",
  policy_issue: "bg-gray-100 border-gray-300",
};

function DiagnosticsPage() {
  const [selected, setSelected] = useState<string | null>("1");
  const reports = [
    {
      id: "1",
      title: "Ahmad Khalid - Efficiency Decline",
      employee: "Ahmad Khalid",
      dept: "Operations",
      status: "under_review" as const,
      date: "2026-06-04",
      risk: "high",
      hypotheses: [
        {
          category: "skill_gap",
          hypothesis: "Employee lacks advanced analytics skills needed for process optimization",
          confidence: 85,
          supporting: [
            "KPI trend shows decline after process change",
            "No advanced training in 6 months",
          ],
          contradicting: ["Employee has 5 years experience"],
          actions: ["Schedule advanced analytics training", "Pair with senior analyst"],
        },
        {
          category: "process_issue",
          hypothesis: "New workflow introduced last month has efficiency bottlenecks",
          confidence: 72,
          supporting: ["Process change coincided with drop", "Similar issues in other teams"],
          contradicting: ["Other members adapted"],
          actions: ["Review workflow steps", "Conduct time-motion study"],
        },
        {
          category: "tool_issue",
          hypothesis: "System upgrade may be causing data processing delays",
          confidence: 45,
          supporting: ["IT reported system issues"],
          contradicting: ["No direct correlation"],
          actions: ["Check system logs"],
        },
      ],
      evidence: [
        { source: "KPI Report May 2026", desc: "Efficiency dropped from 85% to 78%", rel: "high" },
        { source: "Supervisor Observation", desc: "Longer processing times", rel: "high" },
      ],
    },
    {
      id: "2",
      title: "Omar Hassan - Attendance",
      employee: "Omar Hassan",
      dept: "Operations",
      status: "draft" as const,
      date: "2026-06-03",
      risk: "medium",
      hypotheses: [
        {
          category: "motivation_issue",
          hypothesis: "Low engagement due to repetitive tasks",
          confidence: 60,
          supporting: ["3 unexcused absences", "Dissatisfaction in 1:1"],
          contradicting: ["Good performance before"],
          actions: ["Career discussion", "Consider rotation"],
        },
      ],
      evidence: [{ source: "Attendance System", desc: "3 unexcused absences", rel: "high" }],
    },
  ];
  const sel = reports.find((r) => r.id === selected);

  const confColor = (s: number) =>
    s >= 80 ? "text-green-600" : s >= 60 ? "text-yellow-600" : "text-red-600";

  return (
    <div>
      <PageHeader
        title="Diagnostic Reports"
        description="Evidence-based performance diagnostics"
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" />
            New Diagnostic
          </button>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DataTable
            columns={[
              {
                key: "title",
                label: "Report",
                sortable: true,
                render: (i) => (
                  <div className="flex items-center gap-2">
                    <FileSearch className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-sm">{i.title}</span>
                  </div>
                ),
              },
              { key: "dept", label: "Dept" },
              { key: "date", label: "Date" },
              {
                key: "risk",
                label: "Risk",
                render: (i) => (
                  <StatusBadge
                    status={i.risk === "high" ? "red" : i.risk === "medium" ? "yellow" : "green"}
                    label={i.risk}
                  />
                ),
              },
              { key: "status", label: "Status", render: (i) => <StatusBadge status={i.status} /> },
            ]}
            data={reports}
            onRowClick={(i) => setSelected(i.id)}
          />
        </div>
        <div className="lg:col-span-2">
          {sel ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{sel.title}</CardTitle>
                </CardHeader>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Employee: {sel.employee}</span>
                  <span>|</span>
                  <span>Dept: {sel.dept}</span>
                  <span>|</span>
                  <StatusBadge status={sel.status} />
                </div>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      Hypotheses
                    </div>
                  </CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  {sel.hypotheses.map((h, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-xl border ${catColors[h.category] || "border-gray-200"}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-gray-500 uppercase">
                              Hypothesis {i + 1}
                            </span>
                            <span className="px-2 py-0.5 bg-white rounded text-xs font-medium">
                              {h.category.replace("_", " ")}
                            </span>
                          </div>
                          <p className="font-medium text-gray-900">{h.hypothesis}</p>
                        </div>
                        <div className="text-center">
                          <p className={`text-2xl font-bold ${confColor(h.confidence)}`}>
                            {h.confidence}%
                          </p>
                          <p className="text-xs text-gray-500">Confidence</p>
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="text-xs font-medium text-green-600 flex items-center gap-1 mb-2">
                          <CheckCircle className="w-3 h-3" />
                          Supporting
                        </p>
                        <ul className="space-y-1">
                          {h.supporting.map((s, j) => (
                            <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-green-500">•</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {h.contradicting.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-red-600 flex items-center gap-1 mb-2">
                            <XCircle className="w-3 h-3" />
                            Contradicting
                          </p>
                          <ul className="space-y-1">
                            {h.contradicting.map((c, j) => (
                              <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                                <span className="text-red-500">•</span>
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="bg-gray-50 rounded-lg p-3 border">
                        <p className="text-xs font-medium text-blue-600 flex items-center gap-1 mb-2">
                          <ArrowRight className="w-3 h-3" />
                          Actions
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {h.actions.map((a, j) => (
                            <span
                              key={j}
                              className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Evidence Summary
                    </div>
                  </CardTitle>
                </CardHeader>
                <div className="space-y-2">
                  {sel.evidence.map((e, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium">{e.source}</p>
                        <p className="text-xs text-gray-500">{e.desc}</p>
                      </div>
                      <StatusBadge
                        status={e.rel === "high" ? "green" : "yellow"}
                        size="sm"
                        label={e.rel}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <FileSearch className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select a report to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
