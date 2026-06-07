type PageHeaderProps = {
  title: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  actions?: React.ReactNode;
  currentLang?: "ar" | "en";
};

export function PageHeader({
  title,
  titleAr,
  description,
  descriptionAr,
  actions,
  currentLang = "en",
}: PageHeaderProps) {
  const resolvedTitle = currentLang === "ar" && titleAr ? titleAr : title;
  const resolvedDescription = currentLang === "ar" && descriptionAr ? descriptionAr : description;

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{resolvedTitle}</h1>
        {resolvedDescription && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{resolvedDescription}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
