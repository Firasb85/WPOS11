import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/lib/services/supabase/dashboard.service";

export function useCeoDashboard() {
  return useQuery({
    queryKey: ["dashboard", "ceo"],
    queryFn: () => dashboardService.getCeoMetrics(),
    staleTime: 30_000, // refresh every 30s
  });
}
