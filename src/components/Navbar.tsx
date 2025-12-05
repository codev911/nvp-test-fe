type NavbarProps = {
  userName?: string;
  onLogout: () => void;
  onOpenNotifications: () => void;
  hasUnread: boolean;
  processing?: boolean;
  processLabel?: string;
};

export function Navbar({ userName, onLogout, onOpenNotifications, hasUnread, processing, processLabel }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/70 border-b border-slate-900 px-6 md:px-10 py-4">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-500/80 to-indigo-500/80 flex items-center justify-center text-slate-900 font-bold shadow-glow">
            ◦
          </div>
          <div>
            <div className="text-sm uppercase tracking-[0.3em] text-slate-500">Example</div>
            <div className="text-lg font-semibold text-slate-100">Control Panel</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {processing && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-400/40 text-amber-100 text-xs">
              <span className="h-2 w-2 rounded-full bg-amber-300 animate-pulse" />
              {processLabel || 'Processing...'}
            </div>
          )}
          <button
            onClick={onOpenNotifications}
            className="relative h-11 px-4 rounded-xl bg-slate-900/70 border border-slate-800 text-slate-200 hover:border-cyan-500/50 hover:text-cyan-200 transition"
          >
            Alerts
            {hasUnread && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-cyan-400 shadow-glow border border-slate-900" />
            )}
          </button>
          <div className="hidden md:flex flex-col items-end text-sm">
            <span className="text-slate-400">Signed in</span>
            <span className="text-slate-100 font-semibold">{userName || 'Anon'}</span>
          </div>
          <button
            onClick={onLogout}
            className="h-11 rounded-xl px-4 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-800 text-slate-200 hover:border-rose-400/50 hover:text-rose-100 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
