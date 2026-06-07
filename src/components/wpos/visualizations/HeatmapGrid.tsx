import type { CompetencyHeatmapCell } from "~/lib/wpos/types/enhancement-pack";

interface HeatmapGridProps {
  data: CompetencyHeatmapCell[];
  employees: string[];
  competencies: string[];
  currentLang?: "ar" | "en";
}

export function HeatmapGrid({
  data,
  employees,
  competencies,
  currentLang = "ar",
}: HeatmapGridProps) {
  const getColor = (gap: number) => {
    if (gap <= 0) return "bg-green-500";
    if (gap <= 1) return "bg-yellow-500";
    if (gap <= 2) return "bg-orange-500";
    return "bg-red-500";
  };

  const getCellValue = (empName: string, compName: string) => {
    return data.find((d) => d.employeeName === empName && d.competencyName === compName) || null;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr>
            <th
              className={`px-3 py-2 text-xs font-semibold text-gray-500 uppercase sticky left-0 bg-white dark:bg-gray-900 z-10 ${currentLang === "ar" ? "text-right" : "text-left"}`}
            >
              {currentLang === "ar" ? "الموظف / الكفاءة" : "Employee / Competency"}
            </th>
            {competencies.map((comp) => (
              <th
                key={comp}
                className="px-2 py-2 text-xs font-semibold text-gray-500 text-center min-w-[100px]"
              >
                {comp}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp} className="border-t border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-gray-900 whitespace-nowrap">
                {emp}
              </td>
              {competencies.map((comp) => {
                const cell = getCellValue(emp, comp);
                return (
                  <td key={comp} className="px-2 py-2 text-center">
                    {cell ? (
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={`w-8 h-8 rounded-md ${getColor(cell.gap)} flex items-center justify-center text-xs font-bold text-white`}
                          title={`Current: ${cell.currentLevel} | Required: ${cell.requiredLevel} | Gap: ${cell.gap}`}
                        >
                          {cell.currentLevel}
                        </div>
                        <span className="text-[10px] text-gray-400">
                          {cell.gap > 0 ? `+${cell.gap}` : "0"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
