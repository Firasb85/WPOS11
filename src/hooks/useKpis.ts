import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { kpiCategoriesService } from "@/lib/services/supabase/kpi-categories.service";
import { kpisService } from "@/lib/services/supabase/kpis.service";
import { snapshotsService } from "@/lib/services/supabase/snapshots.service";
import type { Database } from "@/integrations/supabase/types";

// ── KPI Categories ────────────────────────────────────────

export function useKpiCategories() {
  return useQuery({
    queryKey: ["kpi-categories"],
    queryFn: () => kpiCategoriesService.list(),
  });
}

export function useCreateKpiCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Database["public"]["Tables"]["kpi_categories"]["Insert"]) =>
      kpiCategoriesService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kpi-categories"] }),
  });
}

export function useDeleteKpiCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => kpiCategoriesService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kpi-categories"] }),
  });
}

// ── KPIs ──────────────────────────────────────────────────

export function useKpis(categoryId?: string) {
  return useQuery({
    queryKey: ["kpis", categoryId],
    queryFn: () => kpisService.list(categoryId),
  });
}

export function useKpi(id: string) {
  return useQuery({
    queryKey: ["kpis", id],
    queryFn: () => kpisService.getById(id),
    enabled: !!id,
  });
}

export function useCreateKpi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Database["public"]["Tables"]["kpis"]["Insert"]) =>
      kpisService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kpis"] }),
  });
}

export function useDeleteKpi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => kpisService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kpis"] }),
  });
}

// ── Snapshots ─────────────────────────────────────────────

export function useSnapshots(employeeId?: string) {
  return useQuery({
    queryKey: ["snapshots", employeeId],
    queryFn: () => snapshotsService.list(employeeId),
  });
}

export function useCreateSnapshot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Database["public"]["Tables"]["performance_snapshots"]["Insert"]) =>
      snapshotsService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["snapshots"] }),
  });
}
