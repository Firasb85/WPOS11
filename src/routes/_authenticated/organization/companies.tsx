import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { DataTable } from "~/components/wpos/DataTable";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useCompanies, useCreateCompany, useDeleteCompany } from "@/hooks/useOrganization";
import { Plus, Building2, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/organization/companies")({
  component: CompaniesPage,
});

function CompaniesPage() {
  const { t, lang: l } = useLanguage();
  const { data: companies, isLoading } = useCompanies();
  const createMutation = useCreateCompany();
  const deleteMutation = useDeleteCompany();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    legal_name: "",
    city: "",
    country: "",
    email: "",
    phone: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync(formData);
    setFormData({ name: "", legal_name: "", city: "", country: "", email: "", phone: "" });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(t("Are you sure you want to delete this company?", "هل أنت متأكد من حذف هذه الشركة؟"))
    ) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const tableData = (companies ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    legalName: c.legal_name ?? "-",
    city: c.city ?? "-",
    country: c.country ?? "-",
    email: c.email ?? "-",
    phone: c.phone ?? "-",
    status: c.is_active ? "active" : "inactive",
  }));

  return (
    <div>
      <PageHeader
        title="Companies"
        titleAr="الشركات"
        description="Manage your organization's companies"
        descriptionAr="إدارة شركات مؤسستك"
        currentLang={l}
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            {t("Add Company", "إضافة شركة")}
          </button>
        }
      />

      {showForm && (
        <Card className="mb-6">
          <h3 className="text-sm font-semibold mb-4">{t("New Company", "شركة جديدة")}</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {t("Legal Name", "الاسم القانوني")}
              </label>
              <input
                value={formData.legal_name}
                onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("City", "المدينة")}
              </label>
              <input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Country", "البلد")}
              </label>
              <input
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Email", "البريد")}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Phone", "الهاتف")}
              </label>
              <input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
            label: t("Name", "الاسم"),
            sortable: true,
            render: (row) => (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{row.name}</span>
              </div>
            ),
          },
          { key: "legalName", label: t("Legal Name", "الاسم القانوني") },
          { key: "city", label: t("City", "المدينة") },
          { key: "country", label: t("Country", "البلد") },
          { key: "email", label: t("Email", "البريد") },
          {
            key: "status",
            label: t("Status", "الحالة"),
            render: (row) => (
              <StatusBadge status={row.status === "active" ? "green" : "red"} label={row.status} />
            ),
          },
          {
            key: "id",
            label: "",
            render: (row) => (
              <button
                onClick={() => handleDelete(row.id)}
                className="p-1 text-red-400 hover:text-red-600"
                title={t("Delete", "حذف")}
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

      {!isLoading && tableData.length === 0 && !showForm && (
        <div className="text-center py-12 text-gray-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">
            {t(
              "No companies yet. Add your first company to get started.",
              "لا توجد شركات بعد. أضف أول شركة للبدء.",
            )}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            {t("Add Company", "إضافة شركة")}
          </button>
        </div>
      )}
    </div>
  );
}
