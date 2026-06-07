import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: () => null,
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/ceo" });
  },
});
