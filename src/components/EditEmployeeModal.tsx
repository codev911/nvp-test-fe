import { FormEvent, useEffect, useState } from 'react';
import { Modal } from './Modal';
import type { Employee } from '@/types';

type Props = {
  open: boolean;
  employee: Employee | null;
  onClose: () => void;
  onSave: (payload: { name: string; age: number; position: string; salary: number }) => Promise<void>;
  saving: boolean;
};

export function EditEmployeeModal({ open, employee, onClose, onSave, saving }: Props) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setAge(String(employee.age));
      setPosition(employee.position);
      setSalary(String(employee.salary));
    }
  }, [employee]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!employee) return;
    setError('');
    try {
      await onSave({
        name,
        age: Number(age),
        position,
        salary: Number(salary),
      });
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Gagal update');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit data">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm text-slate-300 space-y-1">
            <span className="text-slate-500">Nama</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none"
            />
          </label>
          <label className="text-sm text-slate-300 space-y-1">
            <span className="text-slate-500">Umur</span>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none"
            />
          </label>
          <label className="text-sm text-slate-300 space-y-1">
            <span className="text-slate-500">Jabatan</span>
            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none"
            />
          </label>
          <label className="text-sm text-slate-300 space-y-1">
            <span className="text-slate-500">Gaji</span>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none"
            />
          </label>
        </div>
        {error && (
          <div className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2">{error}</div>
        )}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-semibold shadow-glow disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan perubahan'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
