import type { NotificationItem } from '@/types';

type Props = {
  items: NotificationItem[];
  onClose: () => void;
  onMarkRead: () => void;
};

export function NotificationPanel({ items, onClose, onMarkRead }: Props) {
  return (
    <div className="absolute right-0 z-50 w-80 rounded-2xl blurred-panel border border-slate-800 shadow-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Alerts</div>
        <div className="flex items-center gap-2">
          <button
            onClick={onMarkRead}
            className="text-xs px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-cyan-400/40 transition"
          >
            Tandai baca
          </button>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-100 transition"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {items.length === 0 && <div className="text-slate-500 text-sm">Belum ada notifikasi.</div>}
        {items.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-slate-100 flex flex-col gap-1"
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span className="text-sm font-semibold text-slate-100">{item.title}</span>
              <span className="text-[10px] text-slate-500 ml-auto">
                {new Date(item.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-slate-300 text-sm">{item.message}</p>
            {!item.read && <span className="text-[10px] text-cyan-300">baru</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
