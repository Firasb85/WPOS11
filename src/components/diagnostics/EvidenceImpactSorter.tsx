import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { ArrowDown, ArrowUp, Zap, ClipboardCheck } from "lucide-react";

interface EvidenceItem {
  id: string;
  evidence_type: string;
  source: string;
  description: string;
  reliability: string | null;
  reliability_score: number | null;
}

interface Props {
  evidence: EvidenceItem[];
}

// Keyword impact scoring — how strongly each keyword signals a root cause
const IMPACT_KEYWORDS: Record<string, { weight: number; themes: string[] }> = {
  // High-impact (direct performance indicators)
  "target missed": { weight: 9, themes: ["performance"] },
  "quota not met": { weight: 9, themes: ["performance"] },
  declined: { weight: 8, themes: ["trend"] },
  dropped: { weight: 8, themes: ["trend"] },
  complaint: { weight: 8, themes: ["quality"] },
  "error rate": { weight: 8, themes: ["quality"] },
  failed: { weight: 7, themes: ["quality"] },
  // Medium-impact (contributing factors)
  training: { weight: 6, themes: ["skill"] },
  absent: { weight: 6, themes: ["attendance"] },
  late: { weight: 5, themes: ["attendance"] },
  overtime: { weight: 5, themes: ["workload"] },
  workload: { weight: 5, themes: ["workload"] },
  tool: { weight: 5, themes: ["tools"] },
  system: { weight: 4, themes: ["tools"] },
  process: { weight: 5, themes: ["process"] },
  procedure: { weight: 5, themes: ["process"] },
  // Lower-impact (contextual)
  observation: { weight: 3, themes: ["context"] },
  feedback: { weight: 3, themes: ["context"] },
  mentioned: { weight: 2, themes: ["context"] },
  noted: { weight: 2, themes: ["context"] },
};

function calculateImpactScore(item: EvidenceItem): {
  score: number;
  themes: string[];
} {
  const desc = item.description.toLowerCase();
  let score = 0;
  const themes = new Set<string>();

  // 1. Keyword analysis
  for (const [keyword, config] of Object.entries(IMPACT_KEYWORDS)) {
    if (desc.includes(keyword)) {
      score += config.weight;
      config.themes.forEach((t) => themes.add(t));
    }
  }

  // 2. Reliability bonus
  const relBonus = item.reliability === "high" ? 3 : item.reliability === "medium" ? 1 : 0;
  score += relBonus;

  // 3. Evidence type weight
  const typeBonus: Record<string, number> = {
    quantitative: 3,
    system_generated: 3,
    behavioral: 2,
    qualitative: 1,
    contextual: 1,
    temporal: 2,
  };
  score += typeBonus[item.evidence_type] ?? 0;

  // 4. Description length bonus (more detail = more useful)
  if (item.description.length > 100) score += 1;
  if (item.description.length > 200) score += 1;

  // Normalize to 0-10
  score = Math.min(Math.round(score), 10);

  return { score, themes: Array.from(themes) };
}

/**
 * EvidenceImpactSorter — displays evidence items with correlation strength
 * weights and allows sorting by impact score.
 */
export function EvidenceImpactSorter({ evidence }: Props) {
  const { t } = useLanguage();
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  const scored = useMemo(() => {
    return evidence
      .map((ev) => ({
        ...ev,
        impact: calculateImpactScore(ev),
      }))
      .sort((a, b) =>
        sortDir === "desc" ? b.impact.score - a.impact.score : a.impact.score - b.impact.score,
      );
  }, [evidence, sortDir]);

  const toggleSort = () => setSortDir((d) => (d === "desc" ? "asc" : "desc"));

  if (evidence.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400">
        <ClipboardCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">{t("No evidence to analyze", "لا توجد أدلة للتحليل")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange-500" />
          {t("Evidence by Impact Score", "الأدلة حسب درجة التأثير")}
        </h4>
        <button
          onClick={toggleSort}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 border rounded"
        >
          {sortDir === "desc" ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
          {t("Impact", "التأثير")}
        </button>
      </div>

      <div className="space-y-2">
        {scored.map((ev) => (
          <div
            key={ev.id}
            className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800"
          >
            {/* Impact score gauge */}
            <div className="flex flex-col items-center flex-shrink-0 w-12">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                  ev.impact.score >= 8
                    ? "bg-red-500"
                    : ev.impact.score >= 5
                      ? "bg-orange-500"
                      : ev.impact.score >= 3
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                }`}
              >
                {ev.impact.score}
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5">/10</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-medium">
                  {ev.evidence_type.replace("_", " ")}
                </span>
                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">
                  {ev.reliability ?? "medium"}
                </span>
                <span className="text-[10px] text-gray-400">{ev.source}</span>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                {ev.description}
              </p>
              {/* Themes */}
              {ev.impact.themes.length > 0 && (
                <div className="flex gap-1 mt-1.5">
                  {ev.impact.themes.map((theme) => (
                    <span
                      key={theme}
                      className="px-1.5 py-0.5 bg-orange-50 text-orange-600 border border-orange-200 rounded text-[9px] font-medium capitalize"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Impact bar */}
            <div className="flex-shrink-0 w-16">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    ev.impact.score >= 8
                      ? "bg-red-500"
                      : ev.impact.score >= 5
                        ? "bg-orange-500"
                        : ev.impact.score >= 3
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                  }`}
                  style={{ width: `${ev.impact.score * 10}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
