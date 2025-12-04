import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createEmployee,
  deleteEmployee,
  importEmployeesFromCsv,
  listEmployees,
  updateEmployee,
} from '@/lib/mockBackend';
import type { Employee } from '@/types';

export const PAGE_SIZE = 80;

export function useEmployeeList(search: string, page: number) {
  return useQuery({
    queryKey: ['employees', search, page],
    queryFn: () => listEmployees({ search, page, pageSize: PAGE_SIZE }),
    placeholderData: (prev) => prev,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) =>
      createEmployee(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Omit<Employee, 'id' | 'createdAt'>>;
    }) => updateEmployee(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useImportEmployees(
  onProgress: (info: { percent: number; processed: number; total: number }) => void,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => importEmployeesFromCsv(content, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}
