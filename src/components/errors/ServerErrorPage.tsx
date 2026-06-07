/**
 * 500 Internal Server Error page.
 * Rendered for unexpected server-side failures.
 */
export function ServerErrorPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-5xl font-bold text-foreground">500</h1>
        <h2 className="mt-2 text-xl font-semibold text-foreground">Internal Server Error</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. Our team has been notified and is working on a fix.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
