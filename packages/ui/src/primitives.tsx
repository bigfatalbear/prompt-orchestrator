import type { ReactNode } from 'react';
import { useEffect } from 'react';

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="po-tooltip group relative inline-flex">
      {children}
      <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-56 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block group-focus-within:block dark:bg-slate-700">
        {label}
      </span>
    </span>
  );
}

export function TechnicalExplainer({ technical, explanation }: { technical: string; explanation: string }) {
  return (
    <div className="po-explainer mt-1 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs dark:border-slate-700 dark:bg-slate-800">
      <p><strong>Técnico:</strong> {technical}</p>
      <p className="mt-1 text-emerald-700 dark:text-emerald-400"><strong>Em palavras simples:</strong> {explanation}</p>
    </div>
  );
}

export function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="po-card rounded-xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-900 dark:bg-sky-950/40">
      <h3 className="font-semibold text-sky-800 dark:text-sky-300">ℹ️ {title}</h3>
      <div className="mt-1 text-sm text-sky-900 dark:text-sky-200">{children}</div>
    </section>
  );
}

export function WarningCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="po-card rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40" role="alert">
      <h3 className="font-semibold text-amber-800 dark:text-amber-300">⚠️ {title}</h3>
      <div className="mt-1 text-sm text-amber-900 dark:text-amber-200">{children}</div>
    </section>
  );
}

export function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4" role="presentation" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl bg-white p-5 shadow-2xl dark:bg-slate-900" onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Fechar" className="rounded-lg px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-700">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Toast({ message, tone = 'success', onClose }: { message: string; tone?: 'success' | 'error' | 'info'; onClose?: () => void }) {
  const color = tone === 'error' ? 'bg-red-600' : tone === 'info' ? 'bg-sky-600' : 'bg-emerald-600';
  return (
    <div role="status" className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-lg ${color} px-4 py-3 text-sm text-white shadow-xl`}>
      <span>{message}</span>
      {onClose && <button type="button" onClick={onClose} aria-label="Fechar aviso">✕</button>}
    </div>
  );
}

export function ConfirmDialog({ open, title, message, onConfirm, onCancel }: {
  open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-lg bg-slate-200 px-4 py-2 text-sm dark:bg-slate-700">Cancelar</button>
        <button type="button" onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white">Confirmar</button>
      </div>
    </Modal>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="po-empty flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
      <span className="text-3xl">🗂️</span>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = 'Processando…' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-700">
      <span className="po-spinner h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" aria-hidden="true" />
      {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/40">
      <h3 className="font-semibold text-red-700 dark:text-red-300">Não conseguimos concluir esta etapa.</h3>
      <p className="mt-1 text-sm text-red-800 dark:text-red-200">{message}</p>
      <p className="mt-2 text-xs text-red-700 dark:text-red-400">Tente novamente. Se o problema continuar, salve seu projeto e reabra o aplicativo.</p>
      {onRetry && <button type="button" onClick={onRetry} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white">Tentar novamente</button>}
    </div>
  );
}

export function SuccessState({ message }: { message: string }) {
  return (
    <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
      <span aria-hidden="true">✅</span> {message}
    </div>
  );
}
