// Stub service — to be wired to Supabase queries.
export interface EmployeeFilter {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateEmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  [key: string]: unknown;
}

interface EmployeeRecord {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  [key: string]: unknown;
}

export const employeeService = {
  async list(_filters: EmployeeFilter): Promise<{ data: EmployeeRecord[]; total: number }> {
    return { data: [], total: 0 };
  },
  async get(_id: string): Promise<EmployeeRecord | null> {
    return null;
  },
  async create(input: CreateEmployeeInput, _userId: string): Promise<EmployeeRecord> {
    return { id: crypto.randomUUID(), ...input } as EmployeeRecord;
  },
  async update(
    id: string,
    input: Partial<CreateEmployeeInput>,
    _userId: string,
  ): Promise<EmployeeRecord> {
    return { id, ...input } as EmployeeRecord;
  },
};
