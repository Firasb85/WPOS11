/**
 * Consistent loading skeleton component.
 */

interface LoadingSkeletonProps {
  variant?: "card" | "table" | "stats" | "page";
  count?: number;
}

export function LoadingSkeleton({ variant = "card", count = 3 }: LoadingSkeletonProps) {
  if (variant === "stats") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="h-12 bg-gray-50 dark:bg-gray-800/50 animate-pulse" />
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="h-14 border-t border-gray-100 dark:border-gray-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (variant === "page") {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse"
            />
          ))}
        </div>
        <div className="h-64 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-24 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse"
        />
      ))}
    </div>
  );
}
