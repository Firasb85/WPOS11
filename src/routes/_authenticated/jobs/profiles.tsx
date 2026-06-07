import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { Plus, FileText, Briefcase, Award } from "lucide-react";
import { useState } from "react";
export const Route = createFileRoute("/_authenticated/jobs/profiles")({
  component: JobProfilesPage,
});
function JobProfilesPage() {
  const [selected, setSelected] = useState<string | null>("1");
  const profiles = [
    {
      id: "1",
      title: "Senior Analyst",
      family: "Operations",
      grade: "Senior",
      skills: ["Data Analysis", "Reporting", "SQL"],
      certs: ["CMA", "CFA"],
    },
    {
      id: "2",
      title: "HR Specialist",
      family: "Human Resources",
      grade: "Junior",
      skills: ["Recruitment", "Payroll", "HRIS"],
      certs: ["SHRM"],
    },
    {
      id: "3",
      title: "Financial Analyst",
      family: "Finance",
      grade: "Senior",
      skills: ["Financial Modeling", "Budgeting"],
      certs: ["CMA"],
    },
  ];
  const detail = profiles.find((p) => p.id === selected);
  return (
    <div>
      <PageHeader
        title="Job Profiles"
        description="Manage job profiles"
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" />
            Add Profile
          </button>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {profiles.map((p) => (
            <div
              key={p.id}
              className={`p-4 rounded-xl border cursor-pointer ${selected === p.id ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-300"}`}
              onClick={() => setSelected(p.id)}
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="font-medium text-sm">{p.title}</h3>
              </div>
              <p className="text-xs text-gray-500">
                {p.family} - {p.grade}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {p.skills.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-2">
          {detail ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{detail.title}</CardTitle>
                </CardHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Family</p>
                    <p className="text-sm font-medium">{detail.family}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Grade</p>
                    <p className="text-sm font-medium">{detail.grade}</p>
                  </div>
                </div>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Skills
                    </div>
                  </CardTitle>
                </CardHeader>
                <div className="flex flex-wrap gap-2">
                  {detail.skills.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Certifications
                    </div>
                  </CardTitle>
                </CardHeader>
                <div className="flex flex-wrap gap-2">
                  {detail.certs.map((c) => (
                    <span
                      key={c}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p>Select a profile to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
