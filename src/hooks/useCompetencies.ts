import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { competenciesService } from "@/lib/services/supabase/competencies.service";
import type { Database } from "@/integrations/supabase/types";

export function useCompetencies() {
  return useQuery({
    queryKey: ["competencies"],
    queryFn: () => competenciesService.list(),
  });
}

export function useCreateCompetency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Database["public"]["Tables"]["competencies"]["Insert"]) =>
      competenciesService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["competencies"] }),
  });
}

export function useDeleteCompetency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => competenciesService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["competencies"] }),
  });
}

export function useEmployeeCompetencies(employeeId?: string) {
  return useQuery({
    queryKey: ["employee-competencies", employeeId],
    queryFn: () => competenciesService.listEmployeeCompetencies(employeeId),
  });
}
