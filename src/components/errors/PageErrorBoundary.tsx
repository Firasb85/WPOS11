import { type ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary";

interface PageErrorBoundaryProps {
  children: ReactNode;
  pageName?: string;
}

/**
 * Page-level error boundary with route context.
 * Wrap individual page/route components with this.
 *
 * Usage:
 *   <PageErrorBoundary pageName="Dashboard">
 *     <DashboardPage />
 *   </PageErrorBoundary>
 */
export function PageErrorBoundary({
  children,
  pageName = "page",
}: PageErrorBoundaryProps) {
  return (
    <ErrorBoundary
      boundary={`page_${pageName}`}
      fallback={(error, reset) => (
        <div className="flex min-h-[60vh] items-center justify-center p-8">
          <div className="max-w-md text-center">
            <h2 className="text-xl font-semibold text-foreground">
              This page couldn&apos;t load
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              There was a problem loading the {pageName} page. You can try again
              or navigate elsewhere.
            </p>
            {import.meta.env.DEV && (
              <pre className="mt-4 max-h-32 overflow-auto rounded bg-muted p-3 text-left text-xs text-muted-foreground">
                {error.message}
              </pre>
            )}
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={reset}
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Retry
              </button>
              <a
                href="/dashboard"
                className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
              >
                Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
