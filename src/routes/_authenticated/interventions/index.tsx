import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card} from "~/components/wpos/Card";
import { DataTable } from "~/components/wpos/DataTable";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useInterventionLibrary, useCreateInterventionTemplate } from "@/hooks/useCases";
import { Plus, Activity} from "lucide-react";

export const Route = createFileRoute("/_authenticated/interventions/")({
  component: InterventionsPage,
});

function InterventionsPage() {
  const { t, lang: l } = useLanguage();
  const { data: interventions, isLoading } = useInterventionLibrary();
  const createMutation = useCreateInterventionTemplate();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    type: "training",
    description: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(formData);
      toast.success("Created successfully");
    } catch (err) {
      toast.error("Failed to create: " + (err instanceof Error ? err.message : "Unknown error"));
      return;
    }
    setFormData({ name_en: "", name_ar: "", type: "training", description: "" });
    setShowForm(false);
  };

  const typeColors: Record<string, string> = {
    training: "blue",
    coaching: "green",
    mentoring: "purple",
    process_redesign: "orange",
    tool_upgrade: "cyan",
    other: "gray",
  };

  const tableData = (interventions ?? []).map((iv) => ({
    id: (iv as Record<string, unknown>).id as string,
    name:
      l === "ar" && (iv as Record<string, unknown>).name_ar
        ? String((iv as Record<string, unknown>).name_ar)
        : String((iv as Record<string, unknown>).name_en ?? ""),
    code: String((iv as Record<string, unknown>).code ?? "-"),
    type: String((iv as Record<string, unknown>).type ?? "other"),
    description: String((iv as Record<string, unknown>).description ?? "-").slice(0, 80),
  }));

  return (
    <div>
      <PageHeader
        title="Intervention Library"
        titleAr="مكتبة التدخلات"
        description="Define reusable intervention templates"
        descriptionAr="تعريف قوالب التدخلات القابلة لإعادة الاستخدام"
        currentLang={l}
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            {t("Add Intervention", "إضافة تدخل")}
          </button>
        }
      />

      {showForm && (
        <Card className="mb-6">
          <h3 className="text-sm font-semibold mb-4">
            {t("New Intervention Template", "قالب تدخل جديد")}
          </h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Name (EN)", "الاسم (EN)")} *
              </label>
              <input
                required
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Name (AR)", "الاسم (AR)")}
              </label>
              <input
                value={formData.name_ar}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Type", "النوع")} *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="training">{t("Training", "تدريب")}</option>
                <option value="coaching">{t("Coaching", "توجيه")}</option>
                <option value="mentoring">{t("Mentoring", "إرشاد")}</option>
                <option value="process_redesign">
                  {t("Process Redesign", "إعادة تصميم العملية")}
                </option>
                <option value="tool_upgrade">{t("Tool Upgrade", "ترقية الأدوات")}</option>
                <option value="other">{t("Other", "أخرى")}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Description", "الوصف")}
              </label>
              <input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div className="md:col-span-2 flex gap-2 justify-end">
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
                {createMutation.isPending
                  ? t("Creating...", "جاري الإنشاء...")
                  : t("Create", "إنشاء")}
              </button>
            </div>
          </form>
        </Card>
      )}

      <DataTable
        columns={[
          {
            key: "name",
            label: t("Intervention", "التدخل"),
            sortable: true,
            render: (row) => (
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{row.name}</span>
              </div>
            ),
          },
          { key: "code", label: t("Code", "الرمز") },
          {
            key: "type",
            label: t("Type", "النوع"),
            render: (row) => (
              <StatusBadge
                status={typeColors[row.type] ?? "gray"}
                label={row.type.replace("_", " ")}
              />
            ),
          },
          { key: "description", label: t("Description", "الوصف") },
        ]}
        data={tableData}
        isLoading={isLoading}
        searchable
      />

      {!isLoading && tableData.length === 0 && !showForm && (
        <div className="text-center py-12 text-gray-400">
          <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">
            {t(
              "No intervention templates yet. Add templates to use when creating cases.",
              "لا توجد قوالب تدخل بعد. أضف قوالب لاستخدامها عند إنشاء الحالات.",
            )}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            {t("Add Intervention", "إضافة تدخل")}
          </button>
        </div>
      )}
    </div>
  );
}
