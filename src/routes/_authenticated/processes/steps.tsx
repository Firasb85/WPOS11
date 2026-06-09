import { createFileRoute, redirect } from "@tanstack/react-router";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
export const Route = createFileRoute("/_authenticated/processes/steps")({
  component: () => null,
  beforeLoad: () => {
    throw redirect({ to: "/processes/library" });
  },
});
