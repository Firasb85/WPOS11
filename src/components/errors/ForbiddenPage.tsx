import { Link } from "@tanstack/react-router";
import { ShieldX } from "lucide-react";

/**
 * 403 Forbidden page.
 * Shown when a user navigates to a route they don't have permission for.
 */
export function ForbiddenPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
          <ShieldX className="h-8 w-8 text-orange-600 dark:text-orange-400" />
        </div>
        <h1 className="text-5xl font-bold text-foreground">403</h1>
        <h2 className="mt-2 text-xl font-semibold text-foreground">
          Access Denied
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You don&apos;t have permission to access this page. Contact your
          administrator if you believe this is an error.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
