import { Modal } from './Modal';
import type { Employee } from '@/types';

type Props = {
  open: boolean;
  employee: Employee | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
};

export function ConfirmDeleteModal({ open, employee, onClose, onConfirm, loading }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Hapus data">
      <div className="space-y-4">
        <p className="text-slate-300">
          Yakin ingin menghapus{' '}
          <span className="font-semibold text-slate-100">{employee?.name || 'entri ini'}</span>? Proses tidak dapat
          dibatalkan.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-400 to-amber-500 text-slate-950 font-semibold shadow-glow disabled:opacity-60"
          >
            {loading ? 'Menghapus...' : 'Ya, hapus'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
