import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  currentLang?: string;
  actions?: ReactNode;
}

export function PageHeader({
  title,
  titleAr,
  description,
  descriptionAr,
  currentLang = "en",
  actions,
}: PageHeaderProps) {
  const isAr = currentLang === "ar";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          {isAr && titleAr ? titleAr : title}
        </h1>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {isAr && descriptionAr ? descriptionAr : description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}
