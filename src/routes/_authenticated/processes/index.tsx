import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { DataTable } from "~/components/wpos/DataTable";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useProcesses, useCreateProcess, useDeleteProcess } from "@/hooks/useProcesses";
import { useDepartments } from "@/hooks/useOrganization";
import { Plus, GitMerge, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/processes/")({
  component: ProcessesIndexPage,
});

function ProcessesIndexPage() {
  const { t, lang: l } = useLanguage();
  const { data: processes, isLoading } = useProcesses();
  const { data: depts } = useDepartments();
  const createMutation = useCreateProcess();
  const deleteMutation = useDeleteProcess();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    department_id: "",
    risk_level: "medium",
    criticality: "medium",
    description: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        ...formData,
        department_id: formData.department_id || null,
      });
      toast.success("Created successfully");
    } catch (err) {
      toast.error("Failed to create: " + (err instanceof Error ? err.message : "Unknown error"));
      return;
    }
    setFormData({
      name: "",
      code: "",
      department_id: "",
      risk_level: "medium",
      criticality: "medium",
      description: "",
    });
    setShowForm(false);
  };

  const tableData = (processes ?? []).map((p) => {
    const dept = (p as Record<string, unknown>).departments as Record<string, unknown> | null;
    return {
      id: p.id,
      name: p.name,
      code: p.code ?? "-",
      department: (dept?.name as string) ?? "-",
      risk: p.risk_level ?? "medium",
      criticality: p.criticality ?? "medium",
    };
  });

  return (
    <div>
      <PageHeader
        title="Processes"
        titleAr="العمليات"
        description="Manage business processes"
        descriptionAr="إدارة عمليات العمل"
        currentLang={l}
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            {t("Add Process", "إضافة عملية")}
          </button>
        }
      />
      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Name", "الاسم")} *
              </label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Code", "الرمز")} *
              </label>
              <input
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Department", "الإدارة")}
              </label>
              <select
                value={formData.department_id}
                onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">{t("Select", "اختر")}</option>
                {(depts ?? []).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {t("Cancel", "إلغاء")}
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {createMutation.isPending ? t("Creating...", "جاري...") : t("Create", "إنشاء")}
              </button>
            </div>
          </form>
        </Card>
      )}
      <DataTable
        columns={[
          {
            key: "name",
            label: t("Process", "العملية"),
            sortable: true,
            render: (row) => (
              <div className="flex items-center gap-2">
                <GitMerge className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{row.name}</span>
              </div>
            ),
          },
          { key: "code", label: t("Code", "الرمز") },
          { key: "department", label: t("Department", "الإدارة") },
          {
            key: "risk",
            label: t("Risk", "المخاطر"),
            render: (row) => (
              <StatusBadge
                status={
                  row.risk === "critical"
                    ? "red"
                    : row.risk === "high"
                      ? "orange"
                      : row.risk === "medium"
                        ? "yellow"
                        : "green"
                }
                label={row.risk}
              />
            ),
          },
          {
            key: "criticality",
            label: t("Criticality", "الأهمية"),
            render: (row) => (
              <StatusBadge
                status={
                  row.criticality === "critical"
                    ? "red"
                    : row.criticality === "high"
                      ? "orange"
                      : "yellow"
                }
                label={row.criticality}
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
