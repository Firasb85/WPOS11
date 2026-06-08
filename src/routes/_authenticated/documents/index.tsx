import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { Plus, FileText, Download, Search, Clock, User, Tag } from "lucide-react";
import { useCeoDashboard } from "@/hooks/useDashboard";
export const Route = createFileRoute("/_authenticated/documents/")({ component: DocumentsPage });
function DocumentsPage() {
  const { data: metrics, isLoading: _metricsLoading } = useCeoDashboard();
  const l = "ar";
  const types: { [k: string]: any }[] = [];
  const docs: { [k: string]: any }[] = [];
  return (
    <div>
      <PageHeader
        title="Document Management"
        titleAr="إدارة المستندات"
        description="Central repository for policies, SOPs, and training materials"
        descriptionAr="مستودع مركزي للسياسات والإجراءات ومواد التدريب"
        currentLang={l}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" />
            <span>{l === "ar" ? "مستند جديد" : "New Document"}</span>
          </button>
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {types.map((t, i) => (
          <Card key={i} className="text-center hover:shadow-md cursor-pointer">
            <p className="text-2xl font-bold text-blue-600">{t.c}</p>
            <p className="text-xs text-gray-500 mt-1">
              {l === "ar" ? t.tA : t.type.replace("_", " ")}
            </p>
          </Card>
        ))}
      </div>
      <Card>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-left">
                {l === "ar" ? "المستند" : "Document"}
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-left">
                {l === "ar" ? "النوع" : "Type"}
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">
                {l === "ar" ? "الإصدار" : "Ver"}
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-left">
                {l === "ar" ? "التصنيف" : "Category"}
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-left">
                {l === "ar" ? "الحالة" : "Status"}
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-left">
                {l === "ar" ? "التاريخ" : "Date"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {docs.map((d, i) => (
              <tr key={i} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">{l === "ar" ? d.tA : d.tE}</p>
                      <p className="text-xs text-gray-400 font-mono">{d.code}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm capitalize">
                  {l === "ar"
                    ? types.find((t) => t.type === d.type)?.tA || d.type
                    : d.type.replace("_", " ")}
                </td>
                <td className="px-4 py-3 text-center text-sm">v{d.ver}</td>
                <td className="px-4 py-3 text-sm">{d.cat}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={d.st} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{d.dt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
