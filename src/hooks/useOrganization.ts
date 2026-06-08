import { logAuditEvent } from "@/lib/audit/hook";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  companiesService,
  branchesService,
  departmentsService,
  teamsService,
  employeesService,
} from "@/lib/services/supabase";
import type { EmployeeListParams } from "@/lib/services/supabase/employees.service";
import type { Database } from "@/integrations/supabase/types";

// ── Companies ─────────────────────────────────────────────

export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => companiesService.list(),
  });
}

export function useCreateCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Database["public"]["Tables"]["companies"]["Insert"]) =>
      companiesService.create(input),
    onSuccess: (data) => {
      logAuditEvent({
        action: "CREATE",
        entityType: "company",
        entityId: (data as Record<string, unknown>)?.id as string,
      });
      qc.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

export function useUpdateCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Database["public"]["Tables"]["companies"]["Update"];
    }) => companiesService.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companies"] }),
  });
}

export function useDeleteCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => companiesService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companies"] }),
  });
}

// ── Branches ──────────────────────────────────────────────

export function useBranches(companyId?: string) {
  return useQuery({
    queryKey: ["branches", companyId],
    queryFn: () => branchesService.list(companyId),
  });
}

export function useCreateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Database["public"]["Tables"]["branches"]["Insert"]) =>
      branchesService.create(input),
    onSuccess: () => {
      logAuditEvent({ action: "CREATE", entityType: "branch" });
      qc.invalidateQueries({ queryKey: ["branches"] });
    },
  });
}

export function useUpdateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Database["public"]["Tables"]["branches"]["Update"];
    }) => branchesService.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["branches"] }),
  });
}

export function useDeleteBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => branchesService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["branches"] }),
  });
}

// ── Departments ───────────────────────────────────────────

export function useDepartments(branchId?: string) {
  return useQuery({
    queryKey: ["departments", branchId],
    queryFn: () => departmentsService.list(branchId),
  });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Database["public"]["Tables"]["departments"]["Insert"]) =>
      departmentsService.create(input),
    onSuccess: () => {
      logAuditEvent({ action: "CREATE", entityType: "department" });
      qc.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

export function useUpdateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Database["public"]["Tables"]["departments"]["Update"];
    }) => departmentsService.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["departments"] }),
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => departmentsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["departments"] }),
  });
}

// ── Teams ─────────────────────────────────────────────────

export function useTeams(departmentId?: string) {
  return useQuery({
    queryKey: ["teams", departmentId],
    queryFn: () => teamsService.list(departmentId),
  });
}

export function useCreateTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Database["public"]["Tables"]["teams"]["Insert"]) =>
      teamsService.create(input),
    onSuccess: () => {
      logAuditEvent({ action: "CREATE", entityType: "team" });
      qc.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}

export function useUpdateTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Database["public"]["Tables"]["teams"]["Update"];
    }) => teamsService.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });
}

export function useDeleteTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => teamsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });
}

// ── Employees ─────────────────────────────────────────────

export function useEmployeesList(params: EmployeeListParams = {}) {
  return useQuery({
    queryKey: ["employees", params],
    queryFn: () => employeesService.list(params),
  });
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: ["employees", id],
    queryFn: () => employeesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Database["public"]["Tables"]["employees"]["Insert"]) =>
      employeesService.create(input),
    onSuccess: () => {
      logAuditEvent({ action: "CREATE", entityType: "employee" });
      qc.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useUpdateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Database["public"]["Tables"]["employees"]["Update"];
    }) => employeesService.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
  });
}

export function useDeleteEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => employeesService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
  });
}
