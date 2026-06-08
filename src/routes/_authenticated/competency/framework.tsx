import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { Brain, Layers, Target, Award, TrendingUp } from "lucide-react";
import { useCompetencies } from "@/hooks/useCompetencies";
import { useCompetencyLevels } from "@/hooks/useAdmin";

export const Route = createFileRoute("/_authenticated/competency/framework")({
  component: CompetencyFrameworkPage,
});

function CompetencyFrameworkPage() {
  const { t, lang: l } = useLanguage();
  const { data: levelsData, isLoading: _levelsLoading } = useCompetencyLevels();
  const { data: competencies, isLoading: _competenciesLoading } = useCompetencies();

  const frameworks: { [k: string]: any }[] = [];

  const levels: { [k: string]: any }[] = [];

  return (
    <div>
      <PageHeader
        title="Competency Framework"
        titleAr="إطار الكفاءات"
        description="Define and manage competency frameworks and proficiency levels"
        descriptionAr="تعريف وإدارة أطر الكفاءات ومستويات الإتقان"
        currentLang={l}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {frameworks.map((fw) => (
          <Card key={fw.code} className={`border ${fw.color}`}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border flex items-center justify-center">
                <fw.icon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {l === "ar" ? fw.nameAr : fw.nameEn}
                </h3>
                <p className="text-xs text-gray-500 font-mono">{fw.code}</p>
                <div className="flex gap-4 mt-2">
                  <span className="text-xs text-gray-500">
                    {fw.count} {t("competencies", "كفاءة")}
                  </span>
                  <span className="text-xs text-gray-500">
                    {fw.levels} {t("levels", "مستويات")}
                  </span>
                  <span className="text-xs capitalize text-gray-500">{fw.type}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <TrendingUp className="w-4 h-4 inline mr-2" />
            {t("Proficiency Levels", "مستويات الإتقان")}
          </CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {levels.map((lv) => (
            <div
              key={lv.level}
              className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                {lv.level}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {l === "ar" ? lv.nameAr : lv.nameEn}
                </p>
                <p className="text-xs text-gray-500">{l === "ar" ? lv.descAr : lv.descEn}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
