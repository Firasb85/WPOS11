import { useAtRiskEmployees, useAtRiskDepartments } from "@/hooks/useRiskPrediction";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { Card, CardHeader, CardTitle } from "@/components/wpos/Card";
import { AtRiskBadge } from "./AtRiskBadge";
import { AlertTriangle, UserCircle, Building, Shield } from "lucide-react";

/**
 * At-Risk Employees Panel — shows employees predicted to breach KPIs.
 * Drop this into any dashboard page.
 */
export function AtRiskEmployeesPanel() {
  const { t } = useLanguage();
  const { data: employees, isLoading } = useAtRiskEmployees();

  if (isLoading) {
    return (
      <Card>
        <div className="h-48 animate-pulse bg-gray-100 rounded-lg" />
      </Card>
    );
  }

  const items = employees ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <AlertTriangle className="w-4 h-4 inline mr-2 text-red-500" />
          {t("At-Risk Employees", "موظفون معرضون للخطر")}
          {items.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">
              {items.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      {items.length === 0 ? (
        <div className="text-center py-6 text-gray-400">
          <Shield className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">
            {t(
              "No employees at risk. All KPIs are on track.",
              "لا يوجد موظفون معرضون للخطر. جميع المؤشرات على المسار الصحيح.",
            )}
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {items.map((emp) => (
            <div
              key={emp.id}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  emp.riskLevel === "critical"
                    ? "bg-red-100"
                    : emp.riskLevel === "high"
                      ? "bg-orange-100"
                      : "bg-yellow-100"
                }`}
              >
                <UserCircle
                  className={`w-5 h-5 ${
                    emp.riskLevel === "critical"
                      ? "text-red-600"
                      : emp.riskLevel === "high"
                        ? "text-orange-600"
                        : "text-yellow-600"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {emp.name}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                  <span>{emp.department}</span>
                  <span>·</span>
                  <span>{emp.kpiName}</span>
                  <span>·</span>
                  <span className="text-red-500 font-medium">Gap: {emp.currentGapPct}%</span>
                </div>
              </div>
              <AtRiskBadge
                probability={emp.breachProbability}
                riskLevel={emp.riskLevel}
                trend={emp.trend}
              />
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <p className="text-[10px] text-gray-400 mt-3 italic">
          {t(
            "Predictions based on gap trends, severity, and consecutive red periods.",
            "التنبؤات مبنية على اتجاهات الفجوات والشدة والفترات الحمراء المتتالية.",
          )}
        </p>
      )}
    </Card>
  );
}

/**
 * At-Risk Departments Panel.
 */
export function AtRiskDepartmentsPanel() {
  const { t } = useLanguage();
  const { data: departments, isLoading } = useAtRiskDepartments();

  if (isLoading) {
    return (
      <Card>
        <div className="h-32 animate-pulse bg-gray-100 rounded-lg" />
      </Card>
    );
  }

  const items = departments ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Building className="w-4 h-4 inline mr-2 text-orange-500" />
          {t("At-Risk Departments", "إدارات معرضة للخطر")}
        </CardTitle>
      </CardHeader>

      {items.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">
          {t("All departments on track", "جميع الإدارات على المسار")}
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((dept) => (
            <div
              key={dept.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">{dept.name}</p>
                  <p className="text-[10px] text-gray-500">
                    {dept.atRiskCount} {t("employees at risk", "موظفين معرضين")}
                  </p>
                </div>
              </div>
              <AtRiskBadge
                probability={dept.avgBreachProbability}
                riskLevel={dept.riskLevel}
                size="md"
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
