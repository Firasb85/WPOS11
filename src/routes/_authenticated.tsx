import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  component: DashboardLayout,
  beforeLoad: async () => {
    // Check if user is authenticated before loading any protected route
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw redirect({
        to: "/login",
      });
    }
  },
});
