import { useMemo } from "react";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";

interface EvidenceItem {
  evidence_type: string;
  reliability: string | null;
  description: string;
}

interface HeatmapProps {
  evidence: EvidenceItem[];
}

const EVIDENCE_LABELS: Record<string, { en: string; ar: string }> = {
  quantitative: { en: "Quantitative", ar: "كمي" },
  qualitative: { en: "Qualitative", ar: "نوعي" },
  behavioral: { en: "Behavioral", ar: "سلوكي" },
  system_generated: { en: "System Gen.", ar: "منشأ النظام" },
  contextual: { en: "Contextual", ar: "سياقي" },
  temporal: { en: "Temporal", ar: "زمني" },
};

// Keywords that signal correlation between evidence types
const KEYWORD_GROUPS: Record<string, string[]> = {
  attendance: ["attendance", "absent", "late", "leave", "sick", "حضور", "غياب"],
  productivity: ["output", "productivity", "target", "quota", "delivery", "إنتاجية", "هدف"],
  quality: ["quality", "error", "defect", "complaint", "accuracy", "جودة", "خطأ"],
  training: ["training", "skill", "certification", "learning", "course", "تدريب", "مهارة"],
  engagement: ["engagement", "motivation", "satisfaction", "morale", "مشاركة", "تحفيز"],
  process: ["process", "procedure", "workflow", "bottleneck", "عملية", "إجراء"],
};

/**
 * Evidence Correlation Heatmap — visualizes co-occurrence patterns
 * between evidence types using keyword analysis.
 * Pure SVG implementation (no D3 dependency).
 */
export function EvidenceCorrelationHeatmap({ evidence }: HeatmapProps) {
  const { t, lang } = useLanguage();

  const { matrix, types, maxVal } = useMemo(() => {
    const allTypes = Object.keys(EVIDENCE_LABELS);
    const typesPresent = allTypes.filter((type) => evidence.some((e) => e.evidence_type === type));
    if (typesPresent.length === 0) return { matrix: [], types: allTypes, maxVal: 1 };

    // Build co-occurrence matrix based on shared keyword themes
    const m: number[][] = [];
    let max = 1;

    for (let i = 0; i < allTypes.length; i++) {
      m[i] = [];
      const typeI = evidence.filter((e) => e.evidence_type === allTypes[i]);
      for (let j = 0; j < allTypes.length; j++) {
        if (i === j) {
          // Diagonal: count of this type
          m[i][j] = typeI.length;
          max = Math.max(max, m[i][j]);
          continue;
        }
        const typeJ = evidence.filter((e) => e.evidence_type === allTypes[j]);
        // Count keyword theme overlaps
        let correlation = 0;
        for (const group of Object.values(KEYWORD_GROUPS)) {
          const iHas = typeI.some((e) =>
            group.some((kw) => e.description.toLowerCase().includes(kw)),
          );
          const jHas = typeJ.some((e) =>
            group.some((kw) => e.description.toLowerCase().includes(kw)),
          );
          if (iHas && jHas) correlation++;
        }
        m[i][j] = correlation;
        max = Math.max(max, correlation);
      }
    }
    return { matrix: m, types: allTypes, maxVal: max };
  }, [evidence]);

  const cellSize = 48;
  const labelWidth = 90;
  const svgWidth = labelWidth + types.length * cellSize + 10;
  const svgHeight = labelWidth + types.length * cellSize + 10;

  const getColor = (value: number, isDiagonal: boolean): string => {
    if (isDiagonal) {
      if (value === 0) return "#f3f4f6";
      const intensity = Math.min(value / Math.max(maxVal, 1), 1);
      const r = Math.round(59 + (219 - 59) * (1 - intensity));
      const g = Math.round(130 + (239 - 130) * (1 - intensity));
      const b = Math.round(246 + (246 - 246) * (1 - intensity));
      return `rgb(${r},${g},${b})`;
    }
    if (value === 0) return "#f9fafb";
    const intensity = Math.min(value / Math.max(maxVal, 1), 1);
    if (intensity > 0.6) return "#dc2626"; // Strong correlation
    if (intensity > 0.3) return "#f97316"; // Moderate
    return "#fbbf24"; // Weak
  };

  if (evidence.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-sm">
          {t("No evidence data to visualize", "لا توجد بيانات أدلة للتصور")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          {t("Evidence Correlation Matrix", "مصفوفة ارتباط الأدلة")}
        </h4>
        <div className="flex items-center gap-3 text-[10px] text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-400" />
            {t("Weak", "ضعيف")}
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-orange-500" />
            {t("Moderate", "متوسط")}
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-600" />
            {t("Strong", "قوي")}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg width={svgWidth} height={svgHeight} className="font-sans">
          {/* Column headers */}
          {types.map((type, j) => (
            <text
              key={`col-${type}`}
              x={labelWidth + j * cellSize + cellSize / 2}
              y={labelWidth - 8}
              textAnchor="end"
              transform={`rotate(-45, ${labelWidth + j * cellSize + cellSize / 2}, ${labelWidth - 8})`}
              className="fill-gray-600 dark:fill-gray-400"
              fontSize={9}
            >
              {(lang === "ar" ? EVIDENCE_LABELS[type]?.ar : EVIDENCE_LABELS[type]?.en) ?? type}
            </text>
          ))}

          {/* Rows */}
          {types.map((typeI, i) => (
            <g key={`row-${typeI}`}>
              {/* Row label */}
              <text
                x={labelWidth - 6}
                y={labelWidth + i * cellSize + cellSize / 2 + 3}
                textAnchor="end"
                className="fill-gray-600 dark:fill-gray-400"
                fontSize={9}
              >
                {(lang === "ar" ? EVIDENCE_LABELS[typeI]?.ar : EVIDENCE_LABELS[typeI]?.en) ?? typeI}
              </text>

              {/* Cells */}
              {types.map((typeJ, j) => {
                const value = matrix[i]?.[j] ?? 0;
                const isDiag = i === j;
                return (
                  <g key={`cell-${i}-${j}`}>
                    <rect
                      x={labelWidth + j * cellSize + 1}
                      y={labelWidth + i * cellSize + 1}
                      width={cellSize - 2}
                      height={cellSize - 2}
                      rx={4}
                      fill={getColor(value, isDiag)}
                      className="transition-colors"
                    >
                      <title>
                        {`${EVIDENCE_LABELS[typeI]?.en} × ${EVIDENCE_LABELS[typeJ]?.en}: ${value}`}
                      </title>
                    </rect>
                    {value > 0 && (
                      <text
                        x={labelWidth + j * cellSize + cellSize / 2}
                        y={labelWidth + i * cellSize + cellSize / 2 + 4}
                        textAnchor="middle"
                        fontSize={11}
                        fontWeight="bold"
                        className={
                          isDiag ? "fill-white" : value > 0 ? "fill-white" : "fill-gray-400"
                        }
                      >
                        {value}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          ))}
        </svg>
      </div>

      <p className="text-[10px] text-gray-400 italic">
        {t(
          "Diagonal = evidence count per type. Off-diagonal = shared keyword themes (attendance, productivity, quality, training, engagement, process).",
          "القطري = عدد الأدلة لكل نوع. خارج القطري = مواضيع مشتركة (الحضور، الإنتاجية، الجودة، التدريب، المشاركة، العمليات).",
        )}
      </p>
    </div>
  );
}
