import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  action?: {
    label: string;
    labelAr?: string;
    onClick: () => void;
  };
}

/**
 * Consistent empty state component — use when a list/table has no data.
 */
export function EmptyState({
  icon: Icon,
  title,
  titleAr,
  description,
  descriptionAr,
  action,
}: EmptyStateProps) {
  const { lang } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5">
        {lang === "ar" && titleAr ? titleAr : title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm mb-5">
        {lang === "ar" && descriptionAr ? descriptionAr : description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm shadow-blue-600/20"
        >
          {lang === "ar" && action.labelAr ? action.labelAr : action.label}
        </button>
      )}
    </div>
  );
}
