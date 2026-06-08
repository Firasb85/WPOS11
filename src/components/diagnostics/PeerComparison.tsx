import { useMemo } from "react";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useSnapshots } from "@/hooks/useKpis";
import { useEmployeesList } from "@/hooks/useOrganization";
import { Users, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PeerComparisonProps {
  employeeId: string;
  employeeName: string;
}

/**
 * Peer Comparison View — shows how an employee's KPI performance
 * compares against their department average for the same metrics.
 */
export function PeerComparison({ employeeId, employeeName }: PeerComparisonProps) {
  const { t } = useLanguage();
  const { data: allSnapshots } = useSnapshots();
  const { data: empData } = useEmployeesList({ pageSize: 500 });

  const comparison = useMemo(() => {
    if (!allSnapshots || !empData?.data) return [];

    const employees = empData.data;
    const targetEmp = employees.find((e) => e.id === employeeId);
    if (!targetEmp) return [];

    // Find employee's team/department
    const teamId = targetEmp.team_id;

    // Find peers (same team or without team = same department fallback)
    const peerIds = employees
      .filter((e) => {
        if (e.id === employeeId) return false;
        if (teamId && e.team_id === teamId) return true;
        return false;
      })
      .map((e) => e.id);

    // Get employee's snapshots grouped by KPI
    const empSnaps = allSnapshots.filter((s) => s.employee_id === employeeId);
    const kpiMap: Record<
      string,
      { name: string; empActual: number; empTarget: number; peerActuals: number[] }
    > = {};

    for (const snap of empSnaps) {
      const kpi = (snap as Record<string, unknown>).kpis as Record<string, unknown> | null;
      const kpiId = snap.kpi_id ?? "";
      const kpiName = (kpi?.name as string) ?? "KPI";

      if (!kpiMap[kpiId]) {
        kpiMap[kpiId] = {
          name: kpiName,
          empActual: 0,
          empTarget: 0,
          peerActuals: [],
        };
      }
      kpiMap[kpiId].empActual = Number(snap.actual_value ?? 0);
      kpiMap[kpiId].empTarget = Number(snap.target_value ?? 0);
    }

    // Get peer snapshots for same KPIs
    for (const snap of allSnapshots) {
      if (!peerIds.includes(snap.employee_id ?? "")) continue;
      const kpiId = snap.kpi_id ?? "";
      if (kpiMap[kpiId]) {
        kpiMap[kpiId].peerActuals.push(Number(snap.actual_value ?? 0));
      }
    }

    return Object.entries(kpiMap).map(([kpiId, data]) => {
      const peerAvg =
        data.peerActuals.length > 0
          ? data.peerActuals.reduce((s, v) => s + v, 0) / data.peerActuals.length
          : null;

      const diff = peerAvg !== null ? data.empActual - peerAvg : null;

      return {
        kpiId,
        kpiName: data.name,
        empValue: data.empActual,
        target: data.empTarget,
        peerAvg: peerAvg !== null ? Math.round(peerAvg * 10) / 10 : null,
        peerCount: data.peerActuals.length,
        diff: diff !== null ? Math.round(diff * 10) / 10 : null,
        status: diff === null ? "neutral" : diff >= 0 ? "above" : "below",
      };
    });
  }, [allSnapshots, empData, employeeId]);

  if (comparison.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400">
        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">
          {t("No peer comparison data available", "لا توجد بيانات مقارنة بالأقران")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold flex items-center gap-2">
        <Users className="w-4 h-4 text-indigo-500" />
        {t("Peer Comparison", "مقارنة بالأقران")} — {employeeName}
      </h4>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-3 py-2 text-left font-semibold text-gray-500">
                {t("KPI", "المؤشر")}
              </th>
              <th className="px-3 py-2 text-center font-semibold text-gray-500">
                {t("Target", "الهدف")}
              </th>
              <th className="px-3 py-2 text-center font-semibold text-blue-600">
                {t("Employee", "الموظف")}
              </th>
              <th className="px-3 py-2 text-center font-semibold text-purple-600">
                {t("Dept Avg", "متوسط الإدارة")}
              </th>
              <th className="px-3 py-2 text-center font-semibold text-gray-500">
                {t("vs Peers", "مقابل الأقران")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {comparison.map((row) => (
              <tr key={row.kpiId} className="hover:bg-gray-50">
                <td className="px-3 py-2.5 font-medium">{row.kpiName}</td>
                <td className="px-3 py-2.5 text-center text-gray-500">{row.target}</td>
                <td className="px-3 py-2.5 text-center">
                  <span
                    className={`font-bold ${
                      row.empValue >= row.target ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {row.empValue}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-center">
                  {row.peerAvg !== null ? (
                    <span className="text-purple-600 font-medium">
                      {row.peerAvg}
                      <span className="text-[9px] text-gray-400 ml-1">({row.peerCount} peers)</span>
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-center">
                  {row.diff !== null ? (
                    <span
                      className={`inline-flex items-center gap-0.5 font-bold ${
                        row.diff >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {row.diff >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {row.diff >= 0 ? "+" : ""}
                      {row.diff}
                    </span>
                  ) : (
                    <Minus className="w-3 h-3 text-gray-300 mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
