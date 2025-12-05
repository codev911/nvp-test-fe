import { fireEvent, render, screen } from '@testing-library/react';
import { EmployeeTable } from '@/components/EmployeeTable';

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: (opts: any) => {
    const count = opts.count ?? 0;
    const items = Array.from({ length: count }).map((_, idx) => ({
      key: idx,
      index: idx,
      start: idx * 10,
    }));
    return {
      getVirtualItems: () => items,
      getTotalSize: () => count * 10,
    };
  },
}));

const sample = [
  { id: '1', name: 'Alice', age: 25, position: 'Engineer', salary: 1000, createdAt: '', updatedAt: '' },
];

describe('EmployeeTable', () => {
  it('calls search and sort handlers', () => {
    const onSearch = vi.fn();
    const onSortChange = vi.fn();
    render(
      <EmployeeTable
        data={sample}
        total={1}
        page={1}
        pageSize={10}
        loading={false}
        search=""
        sortField="name"
        sortOrder="asc"
        onSearch={onSearch}
        onPageChange={() => {}}
        onSortChange={onSortChange}
        onAdd={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/Cari nama/i), { target: { value: 'alice' } });
    expect(onSearch).toHaveBeenCalledWith('alice');

    fireEvent.click(screen.getByText('Nama'));
    expect(onSortChange).toHaveBeenCalledWith('name');
  });

  it('calls page change', () => {
    const onPageChange = vi.fn();
    render(
      <EmployeeTable
        data={sample}
        total={30}
        page={2}
        pageSize={10}
        loading={false}
        search=""
        sortField="name"
        sortOrder="asc"
        onSearch={() => {}}
        onPageChange={onPageChange}
        onSortChange={() => {}}
        onAdd={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
      />,
    );

    fireEvent.click(screen.getByText('Prev'));
    expect(onPageChange).toHaveBeenCalled();
  });
});
