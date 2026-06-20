import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";

/** Role-aware dashboard redirect targets */
const ROLE_DEFAULT_ROUTE: Record<string, string> = {
  ADMIN: "/dashboard/ceo",
  CEO: "/dashboard/ceo",
  MANAGER: "/dashboard/department",
  USER: "/dashboard/ceo",
};

/** Labels shown in the sidebar for each role */
export const ROLE_LABELS: Record<string, { en: string; ar: string }> = {
  ADMIN: { en: "System Administrator", ar: "مدير النظام" },
  CEO: { en: "Chief Executive", ar: "الرئيس التنفيذي" },
  MANAGER: { en: "Department Manager", ar: "مدير الإدارة" },
  USER: { en: "Team Member", ar: "عضو الفريق" },
};

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, role, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      if (import.meta.env.DEV) console.log("[WPOS Auth] No user session — redirecting to /login");
      navigate({ to: "/login", replace: true });
    }
  }, [user, isLoading, navigate]);

  // Log role for debugging
  useEffect(() => {
    if (user && role) {
      if (import.meta.env.DEV) console.log(`[WPOS Auth] Authenticated: ${user.email} | Role: ${role} | Default route: ${ROLE_DEFAULT_ROUTE[role] ?? "/dashboard/ceo"}`);
    }
  }, [user, role]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading workspace…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <DashboardLayout />;
}
