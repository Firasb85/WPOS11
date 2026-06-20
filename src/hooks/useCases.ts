import { logAuditEvent } from "@/lib/audit/hook";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { casesService } from "@/lib/services/supabase/cases.service";

export function useCases() {
  return useQuery({
    queryKey: ["cases"],
    queryFn: () => casesService.list(),
  });
}

export function useCase(id: string) {
  return useQuery({
    queryKey: ["cases", id],
    queryFn: () => casesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCaseFromDiagnostic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (diagnosticReportId: string) =>
      casesService.createFromDiagnostic(diagnosticReportId),
    onSuccess: () => {
      logAuditEvent({ action: "CREATE", entityType: "case" });
      qc.invalidateQueries({ queryKey: ["cases"] });
      qc.invalidateQueries({ queryKey: ["diagnostics"] });
    },
  });
}

export function useUpdateCaseStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      casesService.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cases"] }),
  });
}

export function useDeleteCase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => casesService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cases"] }),
  });
}

export function useAddIntervention() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      caseId,
      input,
    }: {
      caseId: string;
      input: {
        intervention_id?: string;
        custom_description?: string;
        cost?: number;
        duration?: string;
      };
    }) => casesService.addIntervention(caseId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cases"] }),
  });
}

export function useAddActionPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      caseId,
      input,
    }: {
      caseId: string;
      input: { description: string; start_date?: string; end_date?: string };
    }) => casesService.addActionPlan(caseId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cases"] }),
  });
}

export function useAddFollowUp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      caseId,
      input,
    }: {
      caseId: string;
      input: {
        follow_up_type: string;
        check_in_date: string;
        kpi_value_before?: number;
        kpi_value_after?: number;
        notes?: string;
        result?: string;
      };
    }) => casesService.addFollowUp(caseId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cases"] }),
  });
}

export function useInterventionLibrary() {
  return useQuery({
    queryKey: ["intervention-library"],
    queryFn: () => casesService.listInterventionLibrary(),
  });
}

export function useFollowUps() {
  return useQuery({
    queryKey: ["follow-ups"],
    queryFn: () => casesService.listFollowUps(),
  });
}

export function useCreateInterventionTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      name_en: string;
      name_ar?: string;
      type: string;
      description?: string;
    }) => casesService.createInterventionTemplate(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["intervention-library"] }),
  });
}
