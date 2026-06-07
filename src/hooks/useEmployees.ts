import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  employeeService,
  type EmployeeFilter,
  type CreateEmployeeInput,
} from '~/lib/services/employee.service';

export function useEmployees(filters: EmployeeFilter) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: () => employeeService.list(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEmployeeInput) => employeeService.create(input, 'system'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (error) => {
      console.error('Failed to create employee:', error);
    }
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CreateEmployeeInput> }) =>
      employeeService.update(id, input, 'system'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });
}
