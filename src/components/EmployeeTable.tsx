import { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Employee } from '@/types';

type Props = {
  data: Employee[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  search: string;
  onSearch: (value: string) => void;
  onPageChange: (page: number) => void;
  onAdd: () => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
};

export function EmployeeTable({
  data,
  total,
  page,
  pageSize,
  loading,
  search,
  onSearch,
  onPageChange,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const rows = useMemo(() => (loading && data.length === 0 ? Array.from({ length: pageSize }) : data), [data, loading, pageSize]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 8,
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="rounded-3xl blurred-panel border border-slate-800 shadow-2xl">
      <div className="flex items-center gap-3 justify-between px-5 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-500/70 to-indigo-500/70 flex items-center justify-center text-slate-900 font-bold shadow-glow">
            +
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Roster</p>
            <p className="text-lg font-semibold text-slate-100">Karyawan</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Cari nama, posisi, umur..."
            className="w-56 rounded-xl bg-slate-900/70 border border-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition"
          />
          <button
            onClick={onAdd}
            className="rounded-xl px-4 py-2 bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-semibold shadow-glow hover:translate-y-[-1px] transition"
          >
            Tambah
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[2fr,1fr,1.2fr,1fr,0.9fr] text-xs uppercase tracking-[0.15em] text-slate-500 px-5 py-3 border-b border-slate-800">
        <div>Nama</div>
        <div>Umur</div>
        <div>Jabatan</div>
        <div>Gaji</div>
        <div className="text-right">Aksi</div>
      </div>

      <div ref={parentRef} className="max-h-[540px] overflow-auto">
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index] as Employee | undefined;
            const isLoadingRow = loading && data.length === 0;
            return (
              <div
                key={virtualRow.key}
                className="absolute left-0 right-0 px-5"
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                <div className="grid grid-cols-[2fr,1fr,1.2fr,1fr,0.9fr] items-center py-4 border-b border-slate-900/60 text-slate-100">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-slate-100">
                      {isLoadingRow ? placeholder('Nama') : row?.name ?? '-'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {isLoadingRow ? placeholder('ID') : row?.id?.slice(0, 8) ?? '—'}
                    </span>
                  </div>
                  <div className="text-slate-200">{isLoadingRow ? placeholder('Umur') : row?.age ?? '-'}</div>
                  <div className="text-slate-200">{isLoadingRow ? placeholder('Posisi') : row?.position ?? '-'}</div>
                  <div className="text-slate-200">
                    {isLoadingRow ? placeholder('Gaji') : row ? `Rp ${row.salary.toLocaleString('id-ID')}` : '-'}
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => row && onEdit(row)}
                      disabled={!row}
                      className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/70 text-xs text-cyan-200 hover:border-cyan-400/40 transition disabled:opacity-40"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => row && onDelete(row)}
                      disabled={!row}
                      className="px-3 py-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 text-xs text-rose-200 hover:border-rose-400/50 transition disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-4 border-t border-slate-800 text-sm text-slate-400">
        <div>
          Page {page} / {totalPages} • {total.toLocaleString('id-ID')} data
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="h-10 px-3 rounded-lg bg-slate-900/70 border border-slate-800 text-slate-200 disabled:opacity-40 hover:border-cyan-400/40 transition"
          >
            Prev
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="h-10 px-3 rounded-lg bg-slate-900/70 border border-slate-800 text-slate-200 disabled:opacity-40 hover:border-cyan-400/40 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function placeholder(label: string) {
  return <span className="inline-block animate-pulse bg-slate-800/80 h-3 rounded w-24">{label}</span>;
}
