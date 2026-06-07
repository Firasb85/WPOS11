// Stub server actions — not currently wired to the backend.
import {
  employeeService,
  CreateEmployeeInput,
  EmployeeFilter,
} from "~/lib/services/employee.service";

export async function createEmployeeAction(input: CreateEmployeeInput) {
  return employeeService.create(input, "system");
}

export async function listEmployeesAction(filters: EmployeeFilter) {
  return employeeService.list(filters);
}

export async function getEmployeeAction(id: string) {
  return employeeService.get(id);
}

export async function updateEmployeeAction(id: string, input: Partial<CreateEmployeeInput>) {
  return employeeService.update(id, input, "system");
}

export async function deleteEmployeeAction(_id: string) {
  return { success: true };
}
