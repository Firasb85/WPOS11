import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  currentLang?: string;
  actions?: ReactNode;
  icon?: ReactNode;
}

export function PageHeader({ title, titleAr, description, descriptionAr, currentLang = "en", actions, icon }: PageHeaderProps) {
  const isAr = currentLang === "ar";

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
              {isAr && titleAr ? titleAr : title}
            </h1>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {isAr && descriptionAr ? descriptionAr : description}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
      <div className="mt-3 border-b border-gray-200 dark:border-gray-800" />
    </div>
  );
}
