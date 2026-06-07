import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/reports/diagnostics")({
  component: () => null,
  beforeLoad: () => {
    throw redirect({ to: "/diagnostics" });
  },
});
