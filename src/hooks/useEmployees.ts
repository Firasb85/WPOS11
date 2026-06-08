/**
 * @deprecated — Use useEmployeesList/useCreateEmployee/etc from @/hooks/useOrganization instead.
 * This file re-exports from the canonical source for backward compatibility.
 */
export {
  useEmployeesList as useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from "@/hooks/useOrganization";
