import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createEmployees,
  deleteEmployees,
  fetchEmployees,
  importEmployeesCsv,
  updateEmployees,
} from '@/lib/api';
import type { Employee } from '@/types';

export const PAGE_SIZE = 80;

export function useEmployeeList({
  search,
  page,
  sort,
  sortType,
  token,
}: {
  search: string;
  page: number;
  sort: string;
  sortType: 'asc' | 'desc';
  token: string;
}) {
  return useQuery({
    queryKey: ['employees', search, page, sort, sortType],
    queryFn: async () => {
      const result = await fetchEmployees({
        page,
        pageSize: PAGE_SIZE,
        sort,
        sortType,
        search,
        token,
      });
      return result;
    },
    placeholderData: (prev) => prev,
    enabled: Boolean(token),
  });
}

export function useCreateEmployee(token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) =>
      createEmployees([payload], token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useUpdateEmployee(token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Omit<Employee, 'id' | 'createdAt'>>;
    }) => updateEmployees([{ id, ...payload }], token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useDeleteEmployee(token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEmployees([id], token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useImportEmployees(
  onProgress: (info: { percent: number; processed: number; total: number }) => void,
  token: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      let percent = 10;
      let processed = 0;
      const total = 100;
      onProgress({ percent, processed, total });
      const ramp = setInterval(() => {
        percent = Math.min(95, percent + 5);
        processed = Math.min(total, processed + 5);
        onProgress({ percent, processed, total });
      }, 200);
      try {
        const res = await importEmployeesCsv(file, token);
        return res;
      } finally {
        clearInterval(ramp);
        onProgress({ percent: 100, processed: 100, total: 100 });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}
