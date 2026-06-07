import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

/**
 * Generic query hook factory for list endpoints.
 */
export function useListQuery<TData, TFilters = Record<string, unknown>>(
  key: string[],
  queryFn: (filters: TFilters) => Promise<TData>,
  options?: {
    filters?: TFilters;
    queryOptions?: Partial<UseQueryOptions<TData>>;
  },
) {
  return useQuery({
    queryKey: key,
    queryFn: () => queryFn(options?.filters as TFilters),
    ...options?.queryOptions,
  });
}

/**
 * Generic mutation hook factory with cache invalidation.
 */
export function useActionMutation<TInput, TOutput>(
  action: (input: TInput) => Promise<TOutput>,
  options?: {
    invalidateKeys?: string[][];
    onSuccess?: (data: TOutput) => void;
    onError?: (error: Error) => void;
  },
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: action,
    onSuccess: (data) => {
      if (options?.invalidateKeys) {
        options.invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}
