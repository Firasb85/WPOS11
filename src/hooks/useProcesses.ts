import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { processesService } from "@/lib/services/supabase/processes.service";
import type { Database } from "@/integrations/supabase/types";

export function useProcesses() {
  return useQuery({
    queryKey: ["processes"],
    queryFn: () => processesService.list(),
  });
}

export function useCreateProcess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Database["public"]["Tables"]["processes"]["Insert"]) =>
      processesService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["processes"] }),
  });
}

export function useDeleteProcess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => processesService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["processes"] }),
  });
}

export function useProcessSteps(processId: string) {
  return useQuery({
    queryKey: ["process-steps", processId],
    queryFn: () => processesService.listSteps(processId),
    enabled: !!processId,
  });
}
