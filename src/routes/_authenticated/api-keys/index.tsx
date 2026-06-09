import { createFileRoute } from "@tanstack/react-router";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { ForbiddenPage } from "@/components/errors/ForbiddenPage";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { Plus, Key, Copy, Clock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useCeoDashboard } from "@/hooks/useDashboard";
export const Route = createFileRoute("/_authenticated/api-keys/")({ component: ApiKeysPage });
function ApiKeysPage() {
  const { data: _metrics, isLoading: _metricsLoading } = useCeoDashboard();
  const l = "ar";
  const [showKey, setShowKey] = useState<string | null>(null);
  const keys = [
    {
      prefix: "ACME",
      name: "Production ERP Integration",
      perms: ["diagnostics:read", "cases:read", "employees:read"],
      last: "2026-06-06 14:30",
      exp: "2027-06-06",
      active: true,
    },
    {
      prefix: "ACME",
      name: "CRM Sync",
      perms: ["employees:read", "employees:write"],
      last: "2026-06-05 09:15",
      exp: "2027-06-05",
      active: true,
    },
    {
      prefix: "ACME",
      name: "BI Reporting",
      perms: ["kpis:read", "snapshots:read", "reports:read"],
      last: "2026-06-04 11:00",
      exp: "2026-12-04",
      active: false,
    },
  ];
  return (
    <PermissionGuard allowedRoles={["ADMIN", "CEO"]} fallback={<ForbiddenPage />}>
      <div>
        <PageHeader
          title="API Keys"
          titleAr="مفاتيح API"
          description="Manage API integrations for ERP, HR, CRM, and BI systems"
          descriptionAr="إدارة تكاملات API لأنظمة ERP و HR و CRM و BI"
          currentLang={l}
          actions={
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              <Plus className="w-4 h-4" />
              <span>{l === "ar" ? "مفتاح جديد" : "New Key"}</span>
            </button>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <p className="text-2xl font-bold text-blue-600">3</p>
            <p className="text-xs text-gray-500">{l === "ar" ? "إجمالي المفاتيح" : "Total Keys"}</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-green-600">2</p>
            <p className="text-xs text-gray-500">{l === "ar" ? "نشطة" : "Active"}</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-gray-400">12</p>
            <p className="text-xs text-gray-500">
              {l === "ar" ? "مكالمات اليوم" : "Today's Calls"}
            </p>
          </Card>
        </div>
        <div className="space-y-3">
          {keys.map((k, i) => (
            <Card key={i}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-100">
                    <Key className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{k.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                        {k.prefix}_****_****
                      </span>
                      <button
                        onClick={() => setShowKey(showKey === k.prefix ? null : k.prefix)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showKey === k.prefix ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {k.perms.map((p, j) => (
                        <span
                          key={j}
                          className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-mono text-gray-500"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={k.active ? "active" : "inactive"} size="sm" />
                  <p className="text-xs text-gray-400 mt-1">
                    <Clock className="w-3 h-3 inline mr-0.5" />
                    {k.last}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PermissionGuard>
  );
}
