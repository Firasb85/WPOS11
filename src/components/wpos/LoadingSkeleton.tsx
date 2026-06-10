interface LoadingSkeletonProps {
  rows?: number;
  type?: "table" | "cards" | "page";
}

export function LoadingSkeleton({ rows = 5, type = "table" }: LoadingSkeletonProps) {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 animate-pulse">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-3" />
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "page") {
    return (
      <div className="animate-pulse space-y-5">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-72" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />)}
        </div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-4 py-3 flex gap-4 border-b border-gray-50 dark:border-gray-800/50">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        </div>
      ))}
    </div>
  );
}
