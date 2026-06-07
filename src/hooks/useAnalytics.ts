import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/lib/services/supabase/analytics.service";

export function useDepartmentMetrics() {
  return useQuery({
    queryKey: ["analytics", "departments"],
    queryFn: () => analyticsService.getDepartmentMetrics(),
    staleTime: 60_000,
  });
}
export function useEvidenceMetrics() {
  return useQuery({
    queryKey: ["analytics", "evidence"],
    queryFn: () => analyticsService.getEvidenceMetrics(),
    staleTime: 60_000,
  });
}
export function useDiagnosticMetrics() {
  return useQuery({
    queryKey: ["analytics", "diagnostics"],
    queryFn: () => analyticsService.getDiagnosticMetrics(),
    staleTime: 60_000,
  });
}
export function useRootCauseMetrics() {
  return useQuery({
    queryKey: ["analytics", "root-causes"],
    queryFn: () => analyticsService.getRootCauseMetrics(),
    staleTime: 60_000,
  });
}
