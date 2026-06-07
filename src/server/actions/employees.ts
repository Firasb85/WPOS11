'use server';

import { employeeService, CreateEmployeeInput, EmployeeFilter } from '~/lib/services/employee.service';
import { validateInput } from '~/lib/validation';
import { createEmployeeSchema } from '~/lib/schemas/employee.schema';
import { getSession } from '~/lib/auth';

export async function createEmployeeAction(input: CreateEmployeeInput) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const validated = validateInput(createEmployeeSchema, input);
  return employeeService.create(validated, session.user.id);
}

export async function listEmployeesAction(filters: EmployeeFilter) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  return employeeService.list(filters);
}

export async function getEmployeeAction(id: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  return employeeService.getById(id);
}

export async function updateEmployeeAction(
  id: string,
  input: Partial<CreateEmployeeInput>
) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  return employeeService.update(id, input, session.user.id);
}

export async function deleteEmployeeAction(id: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  return employeeService.delete(id, session.user.id);
}
