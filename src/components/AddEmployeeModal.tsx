import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Modal } from './Modal';

type ManualRow = {
  name: string;
  age: string;
  position: string;
  salary: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreateRows: (rows: Array<{ name: string; age: number; position: string; salary: number }>) => Promise<void>;
  onUploadCsv: (file: File) => Promise<void>;
  uploadProgress: { percent: number; processed: number; total: number };
  uploading: boolean;
  creating: boolean;
};

export function AddEmployeeModal({
  open,
  onClose,
  onCreateRows,
  onUploadCsv,
  uploadProgress,
  uploading,
  creating,
}: Props) {
  const [tab, setTab] = useState<'manual' | 'csv'>('manual');
  const [rows, setRows] = useState<ManualRow[]>([
    { name: '', age: '', position: '', salary: '' },
  ]);
  const [errors, setErrors] = useState<string | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) {
      setShowProgress(false);
      setRows([{ name: '', age: '', position: '', salary: '' }]);
      setErrors(null);
    }
  }, [open]);

  const manualDisabled = useMemo(
    () => rows.some((row) => !row.name || !row.age || !row.position || !row.salary),
    [rows]
  );

  const handleManualSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors(null);
    try {
      const payload = rows
        .filter((row) => row.name && row.position)
        .map((row) => ({
          name: row.name,
          age: Number(row.age) || 0,
          position: row.position,
          salary: Number(row.salary) || 0,
        }));
      if (payload.length === 0) {
        setErrors('Isi minimal satu baris.');
        return;
      }
      await onCreateRows(payload);
      setRows([{ name: '', age: '', position: '', salary: '' }]);
      onClose();
    } catch (err) {
      setErrors((err as Error).message || 'Gagal menambah data');
    }
  };

  const handleCsvPick = async (file?: File | null) => {
    if (!file) return;
    setErrors(null);
    setShowProgress(true);
    await onUploadCsv(file);
  };

  const addRow = () => setRows((prev) => [...prev, { name: '', age: '', position: '', salary: '' }]);
  const removeRow = (idx: number) => setRows((prev) => prev.filter((_, i) => i !== idx));

  return (
    <Modal open={open} onClose={onClose} title="Tambah entry" widthClass="max-w-5xl">
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setTab('manual')}
          className={`px-4 py-2 rounded-xl border text-sm ${
            tab === 'manual'
              ? 'border-cyan-400/60 bg-cyan-500/10 text-cyan-100'
              : 'border-slate-800 bg-slate-900/60 text-slate-300'
          }`}
        >
          Input manual
        </button>
        <button
          onClick={() => setTab('csv')}
          className={`px-4 py-2 rounded-xl border text-sm ${
            tab === 'csv'
              ? 'border-cyan-400/60 bg-cyan-500/10 text-cyan-100'
              : 'border-slate-800 bg-slate-900/60 text-slate-300'
          }`}
        >
          Upload CSV
        </button>
      </div>

      {tab === 'manual' && (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div className="space-y-3 max-h-[400px] overflow-auto pr-2">
            {rows.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-4 gap-3 items-start p-3 rounded-xl bg-slate-900/70 border border-slate-800"
              >
                <label className="text-sm text-slate-300 space-y-1">
                  <span className="text-slate-500">Nama</span>
                  <input
                    value={row.name}
                    onChange={(e) =>
                      setRows((prev) => prev.map((item, i) => (i === idx ? { ...item, name: e.target.value } : item)))
                    }
                    className="w-full rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </label>
                <label className="text-sm text-slate-300 space-y-1">
                  <span className="text-slate-500">Umur</span>
                  <input
                    type="number"
                    value={row.age}
                    onChange={(e) =>
                      setRows((prev) => prev.map((item, i) => (i === idx ? { ...item, age: e.target.value } : item)))
                    }
                    className="w-full rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </label>
                <label className="text-sm text-slate-300 space-y-1">
                  <span className="text-slate-500">Jabatan</span>
                  <input
                    value={row.position}
                    onChange={(e) =>
                      setRows((prev) =>
                        prev.map((item, i) => (i === idx ? { ...item, position: e.target.value } : item))
                      )
                    }
                    className="w-full rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </label>
                <label className="text-sm text-slate-300 space-y-1">
                  <span className="text-slate-500">Gaji</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={row.salary}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, salary: e.target.value } : item))
                        )
                      }
                      className="w-full rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none"
                    />
                    {rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(idx)}
                        className="h-10 px-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-100 text-xs"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>

          {errors && <div className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2">{errors}</div>}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={addRow}
              className="px-4 py-2 rounded-lg border border-slate-800 text-slate-200 bg-slate-900/80 hover:border-cyan-400/50 transition"
            >
              Tambah baris
            </button>
            <button
              type="submit"
              disabled={manualDisabled || creating}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-semibold shadow-glow disabled:opacity-50"
            >
              {creating ? 'Memproses...' : 'Simpan'}
            </button>
          </div>
        </form>
      )}

      {tab === 'csv' && (
        <div className="space-y-4">
          {!showProgress && (
            <div className="rounded-xl border border-dashed border-cyan-500/40 bg-cyan-500/5 p-6 text-center">
              <p className="text-slate-200 font-semibold mb-2">CSV Import</p>
              <p className="text-sm text-slate-400 mb-4">Unggah 20k baris pun tetap aman (streaming + queue).</p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => handleCsvPick(e.target.files?.[0])}
                className="hidden"
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-semibold shadow-glow"
              >
                Pilih CSV
              </button>
            </div>
          )}

          {(showProgress || uploading) && (
            <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Memproses CSV...</span>
                <span>{uploadProgress.percent}%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-200"
                  style={{ width: `${uploadProgress.percent}%` }}
                />
              </div>
              <div className="text-xs text-slate-500">
                {uploadProgress.processed} / {uploadProgress.total} baris
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
