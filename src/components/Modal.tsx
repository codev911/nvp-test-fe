import React from 'react';
import ReactDOM from 'react-dom';

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  widthClass?: string;
};

export function Modal({ open, title, onClose, children, widthClass = 'max-w-3xl' }: ModalProps) {
  if (!open) return null;
  const portalTarget = document.body;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div
        className={`relative w-full ${widthClass} rounded-2xl blurred-panel border border-slate-800 shadow-2xl p-6 md:p-8`}
      >
        <div className="flex items-start justify-between mb-4">
          {title ? <h2 className="text-xl font-semibold text-slate-100">{title}</h2> : <div />}
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>,
    portalTarget
  );
}
