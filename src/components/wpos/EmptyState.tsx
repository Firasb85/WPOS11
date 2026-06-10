import { useLanguage } from "@/lib/wpos/context/LanguageContext";

interface EmptyStateProps {
  title: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, titleAr, description, descriptionAr, icon, action }: EmptyStateProps) {
  const { lang } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      {icon && (
        <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
        {lang === "ar" && titleAr ? titleAr : title}
      </h3>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-sm">
          {lang === "ar" && descriptionAr ? descriptionAr : description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
