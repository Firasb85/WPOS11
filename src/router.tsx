import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  // Configured for enterprise performance and caching stability
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes (prevents immediate refetch)
        retry: 1, // Minimize retry spam on failure
        refetchOnWindowFocus: false, // Prevents layout thrashing when returning to the tab
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  // Observability Integration Hook (Sentry/Datadog)
  router.subscribe("onResolved", (state) => {
    // window.Sentry?.addBreadcrumb({ category: 'navigation', message: `Mapsd to ${state.location.pathname}` });
    // console.debug(`[Router] Navigated to: ${state.location.pathname}`);
  });

  return router;
};

// Strongly type the router for strict mode compliance across the app
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
