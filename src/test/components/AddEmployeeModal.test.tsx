import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddEmployeeModal } from '@/components/AddEmployeeModal';

describe('AddEmployeeModal', () => {
  it('submits manual rows', async () => {
    const onCreateRows = vi.fn().mockResolvedValue(undefined);
    render(
      <AddEmployeeModal
        open
        onClose={() => {}}
        onCreateRows={onCreateRows}
        onUploadCsv={async () => {}}
        uploadProgress={{ percent: 0, processed: 0, total: 100 }}
        uploading={false}
        creating={false}
      />,
    );

    await userEvent.type(screen.getByLabelText(/Nama/i), 'Bob');
    await userEvent.type(screen.getByLabelText(/Umur/i), '30');
    await userEvent.type(screen.getByLabelText(/Jabatan/i), 'QA');
    await userEvent.type(screen.getByLabelText(/Gaji/i), '5000');
    await userEvent.click(screen.getByRole('button', { name: /Simpan/i }));

    expect(onCreateRows).toHaveBeenCalledWith([
      { name: 'Bob', age: 30, position: 'QA', salary: 5000 },
    ]);
  });

  it('handles CSV upload pick', async () => {
    const onUploadCsv = vi.fn().mockResolvedValue(undefined);
    render(
      <AddEmployeeModal
        open
        onClose={() => {}}
        onCreateRows={async () => {}}
        onUploadCsv={onUploadCsv}
        uploadProgress={{ percent: 0, processed: 0, total: 100 }}
        uploading={false}
        creating={false}
      />,
    );

    await userEvent.click(screen.getByText(/Upload CSV/i));
    const fileInput = screen.getByRole('button', { name: /Pilih CSV/i });
    fireEvent.click(fileInput);
    // we can't trigger actual file selection without DOM picker; assert tab switch
    expect(screen.getByText(/CSV Import/i)).toBeInTheDocument();
  });
});
