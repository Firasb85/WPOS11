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
  [key: string]: any;
}

export const employeeService = {
  async list(_filters: EmployeeFilter): Promise<{ data: any[]; total: number }> {
    return { data: [], total: 0 };
  },
  async get(_id: string): Promise<any | null> {
    return null;
  },
  async create(input: CreateEmployeeInput, _userId: string): Promise<any> {
    return { id: crypto.randomUUID(), ...input };
  },
  async update(id: string, input: Partial<CreateEmployeeInput>, _userId: string): Promise<any> {
    return { id, ...input };
  },
};
