import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { DataTable } from "~/components/wpos/DataTable";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useJobs, useDeleteJob } from "@/hooks/useJobs";
import { Briefcase, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/jobs/list")({
  component: JobsListPage,
});

function JobsListPage() {
  const { t, lang: l } = useLanguage();
  const { data: jobs, isLoading } = useJobs();
  const deleteMutation = useDeleteJob();

  const tableData = (jobs ?? []).map((j) => ({
    id: j.id,
    title: j.title,
    status: j.status ?? "active",
  }));

  return (
    <div>
      <PageHeader
        title="Jobs"
        titleAr="الوظائف"
        description="Manage job definitions"
        descriptionAr="إدارة تعريفات الوظائف"
        currentLang={l}
      />
      <DataTable
        columns={[
          {
            key: "title",
            label: t("Title", "المسمى"),
            sortable: true,
            render: (row) => (
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{row.title}</span>
              </div>
            ),
          },
          {
            key: "status",
            label: t("Status", "الحالة"),
            render: (row) => (
              <StatusBadge
                status={row.status === "active" ? "green" : "gray"}
                label={row.status}
              />
            ),
          },
          {
            key: "id",
            label: "",
            render: (row) => (
              <button
                onClick={() => deleteMutation.mutate(row.id)}
                className="p-1 text-red-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ),
          },
        ]}
        data={tableData}
        isLoading={isLoading}
        searchable
      />
    </div>
  );
}
