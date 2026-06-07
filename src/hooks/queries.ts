import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const QUERY_KEYS = {
  employees: ['employees'] as const,
  diagnostics: ['diagnostics'] as const,
  cases: ['cases'] as const,
  kpis: ['kpis'] as const,
};

// Generic query hook factory
export function useListQuery<T>(
  key: string[],
  queryFn: (filters: any) => Promise<any>,
  options?: any
) {
  return useQuery({
    queryKey: key,
    queryFn: () => queryFn(options?.filters),
    ...options?.queryOptions,
  });
}

// Generic mutation hook factory
export function useActionMutation<T, U>(
  action: (input: T) => Promise<U>,
  options?: {
    invalidateKeys?: string[][];
    onSuccess?: (data: U) => void;
    onError?: (error: Error) => void;
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: action,
    onSuccess: (data) => {
      if (options?.invalidateKeys) {
        options.invalidateKeys.forEach(key => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}
