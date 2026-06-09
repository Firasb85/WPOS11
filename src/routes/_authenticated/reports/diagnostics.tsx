import { createFileRoute, redirect } from "@tanstack/react-router";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
export const Route = createFileRoute("/_authenticated/reports/diagnostics")({
  component: () => null,
  beforeLoad: () => {
    throw redirect({ to: "/diagnostics" });
  },
});
