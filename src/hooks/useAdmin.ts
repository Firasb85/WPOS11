import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/lib/services/supabase/admin.service";

export function useAuditLogs(limit?: number) {
  return useQuery({
    queryKey: ["audit-logs", limit],
    queryFn: () => adminService.listAuditLogs(limit),
  });
}
export function useRoles() {
  return useQuery({ queryKey: ["roles"], queryFn: () => adminService.listRoles() });
}
export function usePermissions() {
  return useQuery({ queryKey: ["permissions"], queryFn: () => adminService.listPermissions() });
}
export function useRolePermissions(roleId?: string) {
  return useQuery({
    queryKey: ["role-permissions", roleId],
    queryFn: () => adminService.listRolePermissions(roleId),
  });
}
export function useSystemUsers() {
  return useQuery({ queryKey: ["system-users"], queryFn: () => adminService.listUsers() });
}
export function useActiveSessions() {
  return useQuery({
    queryKey: ["active-sessions"],
    queryFn: () => adminService.listActiveSessions(),
  });
}
export function useJobProfiles() {
  return useQuery({ queryKey: ["job-profiles"], queryFn: () => adminService.listJobProfiles() });
}
export function useKpiRelationships() {
  return useQuery({
    queryKey: ["kpi-relationships"],
    queryFn: () => adminService.listKpiRelationships(),
  });
}
export function useProcessDependencies() {
  return useQuery({
    queryKey: ["process-dependencies"],
    queryFn: () => adminService.listProcessDependencies(),
  });
}
export function useCompetencyLevels(competencyId?: string) {
  return useQuery({
    queryKey: ["competency-levels", competencyId],
    queryFn: () => adminService.listCompetencyLevels(competencyId),
  });
}
