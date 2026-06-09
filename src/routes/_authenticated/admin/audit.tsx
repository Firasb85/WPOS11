import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { ForbiddenPage } from "@/components/errors/ForbiddenPage";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useAuditLogs } from "@/hooks/useAdmin";
import { exportToCSV } from "@/lib/export/csv";
import { toast } from "sonner";
import {
  ScrollText,
  Download,
  Filter,
  X,
  UserCircle,
  Calendar,
  Activity,
  Search,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/audit")({
  component: AuditLogsPage,
});

function AuditLogsPage() {
  const { t, lang: l } = useLanguage();
  const { data: logs, isLoading, isLoading: _auditLoading } = useAuditLogs(500);

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filterUser, setFilterUser] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [filterEntity, setFilterEntity] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Extract unique values for filter dropdowns
  const _uniqueUsers = useMemo(() => {
    const set = new Set<string>();
    (logs ?? []).forEach((log) => {
      const r = log as Record<string, unknown>;
      if (r.user_id) set.add(String(r.user_id));
    });
    return Array.from(set);
  }, [logs]);

  const uniqueActions = useMemo(() => {
    const set = new Set<string>();
    (logs ?? []).forEach((log) => {
      const r = log as Record<string, unknown>;
      if (r.action) set.add(String(r.action));
    });
    return Array.from(set).sort();
  }, [logs]);

  const uniqueEntities = useMemo(() => {
    const set = new Set<string>();
    (logs ?? []).forEach((log) => {
      const r = log as Record<string, unknown>;
      if (r.entity_type) set.add(String(r.entity_type));
    });
    return Array.from(set).sort();
  }, [logs]);

  // Apply filters
  const filtered = useMemo(() => {
    let items = (logs ?? []) as Array<Record<string, unknown>>;

    if (filterUser) {
      items = items.filter((l) => String(l.user_id ?? "") === filterUser);
    }
    if (filterAction) {
      items = items.filter((l) => String(l.action ?? "") === filterAction);
    }
    if (filterEntity) {
      items = items.filter((l) => String(l.entity_type ?? "") === filterEntity);
    }
    if (filterDateFrom) {
      const from = new Date(filterDateFrom).getTime();
      items = items.filter((l) => new Date(String(l.created_at ?? "")).getTime() >= from);
    }
    if (filterDateTo) {
      const to = new Date(filterDateTo + "T23:59:59").getTime();
      items = items.filter((l) => new Date(String(l.created_at ?? "")).getTime() <= to);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (l) =>
          String(l.description ?? "")
            .toLowerCase()
            .includes(q) ||
          String(l.action ?? "")
            .toLowerCase()
            .includes(q) ||
          String(l.entity_type ?? "")
            .toLowerCase()
            .includes(q),
      );
    }

    return items;
  }, [logs, filterUser, filterAction, filterEntity, filterDateFrom, filterDateTo, searchQuery]);

  const activeFilterCount = [
    filterUser,
    filterAction,
    filterEntity,
    filterDateFrom,
    filterDateTo,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilterUser("");
    setFilterAction("");
    setFilterEntity("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setSearchQuery("");
  };

  const handleExport = () => {
    const data = filtered.map((l) => ({
      action: String(l.action ?? ""),
      entity_type: String(l.entity_type ?? ""),
      entity_id: String(l.entity_id ?? ""),
      description: String(l.description ?? ""),
      user_id: String(l.user_id ?? ""),
      ip_address: String(l.ip_address ?? ""),
      date: l.created_at ? new Date(String(l.created_at)).toISOString() : "",
    }));
    exportToCSV(
      data,
      [
        { key: "date", label: "Date" },
        { key: "action", label: "Action" },
        { key: "entity_type", label: "Entity" },
        { key: "description", label: "Description" },
        { key: "user_id", label: "User ID" },
        { key: "ip_address", label: "IP Address" },
      ],
      "audit_logs",
    );
    toast.success(t(`Exported ${data.length} audit records`, `تم تصدير ${data.length} سجل تدقيق`));
  };

  const actionColors: Record<string, string> = {
    login: "bg-blue-100 text-blue-700",
    logout: "bg-gray-100 text-gray-700",
    create: "bg-green-100 text-green-700",
    update: "bg-yellow-100 text-yellow-700",
    delete: "bg-red-100 text-red-700",
    approve: "bg-emerald-100 text-emerald-700",
    reject: "bg-orange-100 text-orange-700",
  };

  return (
    <PermissionGuard allowedRoles={["ADMIN", "CEO"]} fallback={<ForbiddenPage />}>
      <div>
        <PageHeader
          title="Audit Logs"
          titleAr="سجلات التدقيق"
          description="Track all system activities for compliance — live data"
          descriptionAr="تتبع جميع أنشطة النظام للامتثال — بيانات حية"
          currentLang={l}
          actions={
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm ${showFilters ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
              >
                <Filter className="w-4 h-4" />
                {t("Filters", "الفلاتر")}
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                {t("Export CSV", "تصدير CSV")}
              </button>
            </div>
          }
        />

        {/* Filter Panel */}
        {showFilters && (
          <Card className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                {t("Filter Audit Logs", "تصفية سجلات التدقيق")}
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                >
                  <X className="w-3 h-3" /> {t("Clear all", "مسح الكل")}
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  <Search className="w-3 h-3 inline mr-1" />
                  {t("Search", "بحث")}
                </label>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("Search descriptions...", "بحث في الأوصاف...")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                />
              </div>

              {/* Action Type */}
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  <Activity className="w-3 h-3 inline mr-1" />
                  {t("Action", "الإجراء")}
                </label>
                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                >
                  <option value="">{t("All actions", "كل الإجراءات")}</option>
                  {uniqueActions.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              {/* Entity Type */}
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  {t("Entity", "الكيان")}
                </label>
                <select
                  value={filterEntity}
                  onChange={(e) => setFilterEntity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                >
                  <option value="">{t("All entities", "كل الكيانات")}</option>
                  {uniqueEntities.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {t("From", "من")}
                </label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {t("To", "إلى")}
                </label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                />
              </div>
            </div>

            <p className="text-[10px] text-gray-400 mt-3">
              {t(
                `Showing ${filtered.length} of ${(logs ?? []).length} records`,
                `عرض ${filtered.length} من ${(logs ?? []).length} سجل`,
              )}
            </p>
          </Card>
        )}

        {/* Results summary */}
        {activeFilterCount > 0 && !showFilters && (
          <div className="flex items-center gap-2 mb-3 text-xs text-blue-600">
            <Filter className="w-3 h-3" />
            {t(
              `${activeFilterCount} filter(s) active — ${filtered.length} results`,
              `${activeFilterCount} فلتر(فلاتر) نشطة — ${filtered.length} نتيجة`,
            )}
            <button onClick={clearFilters} className="underline">
              {t("Clear", "مسح")}
            </button>
          </div>
        )}

        {/* Table */}
        <Card padding="none">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">
              {t("Loading...", "جاري التحميل...")}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 p-6">
              <ScrollText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                {t(
                  "No audit logs found matching your filters.",
                  "لم يتم العثور على سجلات تدقيق مطابقة.",
                )}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 dark:bg-gray-900/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      {t("Time", "الوقت")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      {t("Action", "الإجراء")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      {t("Entity", "الكيان")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      {t("Description", "الوصف")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      {t("User", "المستخدم")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      {t("IP", "العنوان")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.slice(0, 200).map((log) => {
                    const action = String(log.action ?? "");
                    const actionLower = action.toLowerCase();
                    const colorClass =
                      Object.entries(actionColors).find(([k]) => actionLower.includes(k))?.[1] ??
                      "bg-gray-100 text-gray-700";

                    return (
                      <tr key={String(log.id)} className="hover:bg-gray-50">
                        <td className="px-4 py-2.5 text-xs text-gray-500 whitespace-nowrap">
                          {log.created_at ? new Date(String(log.created_at)).toLocaleString() : "-"}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-medium ${colorClass}`}
                          >
                            {action}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-xs font-mono text-gray-600">
                          {String(log.entity_type ?? "-")}
                        </td>
                        <td className="px-4 py-2.5 text-xs text-gray-600 max-w-[300px] truncate">
                          {String(log.description ?? "-")}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <UserCircle className="w-3.5 h-3.5" />
                            {String(log.user_id ?? "-").slice(0, 8)}...
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-gray-400">
                          {String(log.ip_address ?? "-")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length > 200 && (
                <p className="text-xs text-gray-400 text-center py-2">
                  {t(
                    `Showing first 200 of ${filtered.length} results. Export CSV for full data.`,
                    `عرض أول 200 من ${filtered.length} نتيجة. صدّر CSV للبيانات الكاملة.`,
                  )}
                </p>
              )}
            </div>
          )}
        </Card>
      </div>
    </PermissionGuard>
  );
}
