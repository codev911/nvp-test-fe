import { renderHook, waitFor } from '@testing-library/react';
import {
  useEmployeeList,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from '@/hooks/useEmployees';
import { createQueryWrapper } from '../utils';

vi.mock('@/lib/api', () => ({
  fetchEmployees: vi.fn(async () => ({ data: [{ id: '1', name: 'A', age: 20, position: 'Dev', salary: 1, createdAt: '', updatedAt: '' }], total: 1 })),
  createEmployees: vi.fn(async () => ({})),
  updateEmployees: vi.fn(async () => ({})),
  deleteEmployees: vi.fn(async () => ({})),
  importEmployeesCsv: vi.fn(async () => ({})),
}));

const api = await import('@/lib/api');

describe('useEmployees hook', () => {
  it('fetches employees with search and sort', async () => {
    const wrapper = createQueryWrapper();
    const { result } = renderHook(
      () =>
        useEmployeeList({
          search: 'A',
          page: 1,
          sort: 'name',
          sortType: 'asc',
          token: 'token',
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.data?.data[0].name).toBe('A'));
    expect(api.fetchEmployees).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'A', sort: 'name', sortType: 'asc' }),
    );
  });

  it('create/update/delete mutations call APIs', async () => {
    const wrapper = createQueryWrapper();
    const create = renderHook(() => useCreateEmployee('token'), { wrapper }).result;
    const update = renderHook(() => useUpdateEmployee('token'), { wrapper }).result;
    const del = renderHook(() => useDeleteEmployee('token'), { wrapper }).result;

    await create.current.mutateAsync({ name: 'B', age: 21, position: 'QA', salary: 2 });
    await update.current.mutateAsync({ id: '1', payload: { name: 'C' } });
    await del.current.mutateAsync('1');

    expect(api.createEmployees).toHaveBeenCalled();
    expect(api.updateEmployees).toHaveBeenCalled();
    expect(api.deleteEmployees).toHaveBeenCalled();
  });
});
