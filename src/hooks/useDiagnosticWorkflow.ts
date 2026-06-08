import { logAuditEvent } from "@/lib/audit/hook";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { evidenceService } from "@/lib/services/supabase/evidence.service";
import { diagnosticsService } from "@/lib/services/supabase/diagnostics.service";
import type { Database } from "@/integrations/supabase/types";

// ── Evidence ──────────────────────────────────────────────

export function useEvidence(employeeId?: string) {
  return useQuery({
    queryKey: ["evidence", employeeId],
    queryFn: () => evidenceService.list(employeeId),
  });
}

export function useCreateEvidence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Database["public"]["Tables"]["evidence"]["Insert"]) =>
      evidenceService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["evidence"] }),
  });
}

// ── Diagnostics ───────────────────────────────────────────

export function useDiagnostics() {
  return useQuery({
    queryKey: ["diagnostics"],
    queryFn: () => diagnosticsService.list(),
  });
}

export function useDiagnostic(id: string) {
  return useQuery({
    queryKey: ["diagnostics", id],
    queryFn: () => diagnosticsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateDiagnostic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Database["public"]["Tables"]["diagnostic_reports"]["Insert"]) =>
      diagnosticsService.create(input),
    onSuccess: (data) => {
      logAuditEvent({
        action: "CREATE",
        entityType: "diagnostic_report",
        entityId: (data as Record<string, unknown>)?.id as string,
      });
      qc.invalidateQueries({ queryKey: ["diagnostics"] });
    },
  });
}

export function useGenerateHypotheses() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, employeeId }: { reportId: string; employeeId: string }) =>
      diagnosticsService.generateHypotheses(reportId, employeeId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["diagnostics"] }),
  });
}

export function useSubmitForReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reportId: string) => diagnosticsService.submitForReview(reportId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["diagnostics"] }),
  });
}

export function useApproveDiagnostic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, reviewerId }: { reportId: string; reviewerId: string }) =>
      diagnosticsService.approve(reportId, reviewerId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["diagnostics"] }),
  });
}

export function useRejectDiagnostic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      reportId,
      reviewerId,
      reason,
    }: {
      reportId: string;
      reviewerId: string;
      reason: string;
    }) => diagnosticsService.reject(reportId, reviewerId, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["diagnostics"] }),
  });
}

export function useDeleteDiagnostic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => diagnosticsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["diagnostics"] }),
  });
}
