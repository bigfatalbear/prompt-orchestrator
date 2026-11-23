import type { ReactNode } from 'react';
import type { CoherenceReport, Platform, PowerLevel } from '@po/types';
import { getLevel, WIZARD_STEPS, type LevelInfo } from '@po/core';
import { TechnicalExplainer, WarningCard } from './primitives';

export function AppShell({ sidebar, topBar, children }: { sidebar?: ReactNode; topBar?: ReactNode; children: ReactNode }) {
  return (
    <div className="po-shell min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {topBar}
      <div className="mx-auto flex w-full max-w-[1600px]">
        {sidebar && <aside className="po-sidebar hidden w-64 shrink-0 border-r border-slate-200 p-4 md:block dark:border-slate-800">{sidebar}</aside>}
        <main className="po-main min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function TopBar({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <header className="po-topbar sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:px-6">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-semibold">{title}</p>
          {subtitle && <p className="truncate text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      </div>
    </header>
  );
}

export function Sidebar({ items, active, onSelect, footer }: {
  items: Array<{ id: string; label: string; icon: string }>;
  active: string;
  onSelect: (id: string) => void;
  footer?: ReactNode;
}) {
  return (
    <nav aria-label="Navegação principal" className="flex h-full flex-col gap-1">
      {items.map((item) => (
        <button key={item.id} type="button" onClick={() => onSelect(item.id)} aria-current={active === item.id ? 'page' : undefined}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${active === item.id ? 'bg-indigo-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}>
          <span aria-hidden="true">{item.icon}</span>{item.label}
        </button>
      ))}
      <div className="mt-auto pt-4">{footer}</div>
    </nav>
  );
}

export function ProgressBar({ step, percent }: { step: number; percent: number }) {
  return (
    <div className="po-progress">
      <div className="mb-2 flex justify-between text-xs font-medium text-slate-500">
        <span>Etapa {step} de {WIZARD_STEPS.length}</span><span>{Math.round(percent)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800" role="progressbar" aria-valuenow={Math.round(percent)} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all duration-300" style={{ width: `${percent}%` }} />
      </div>
      <ol className="mt-3 grid grid-cols-3 gap-1 sm:grid-cols-6">
        {WIZARD_STEPS.map((item) => (
          <li key={item.id} className={`truncate rounded-md px-2 py-1 text-center text-[11px] ${item.id === step ? 'bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : item.id < step ? 'text-emerald-600' : 'text-slate-400'}`}>
            {item.id < step ? '✓ ' : ''}{item.id}. {item.title}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function WizardStepView({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="po-step">
      <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
      <p className="mb-6 mt-1 text-sm text-slate-500">{description}</p>
      {children}
    </section>
  );
}

export function OptionCard({ selected, title, description, icon, onClick, technical, explanation, disabled }: {
  selected: boolean; title: string; description: string; icon: string;
  onClick: () => void; technical?: string; explanation?: string; disabled?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-pressed={selected}
      className={`po-option group flex w-full flex-col rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 ${selected ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 dark:bg-indigo-950/50' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'}`}>
      <span className="flex items-center justify-between">
        <span className="text-2xl" aria-hidden="true">{icon}</span>
        <span className={`h-5 w-5 rounded-full border-2 ${selected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`} aria-hidden="true" />
      </span>
      <span className="mt-3 font-semibold">{title}</span>
      <span className="mt-1 text-sm text-slate-500">{description}</span>
      {technical && explanation && <TechnicalExplainer technical={technical} explanation={explanation} />}
    </button>
  );
}

export function ToggleOption({ checked, title, description, technical, explanation, tooltip, impact, icon, onChange }: {
  checked: boolean; title: string; description: string; technical: string; explanation: string;
  tooltip: string; impact: string; icon: string; onChange: (value: boolean) => void;
}) {
  return (
    <div className={`po-toggle rounded-xl border p-3 transition ${checked ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl" aria-hidden="true">{icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{title}</span>
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-300">Impacto {impact}</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
          <TechnicalExplainer technical={technical} explanation={explanation} />
          <p className="mt-1 text-[11px] italic text-slate-400" title={tooltip}>{tooltip}</p>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" aria-label={title} />
          <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-indigo-600 peer-focus:ring-2 peer-focus:ring-indigo-500 dark:bg-slate-700" />
          <span className="absolute left-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
        </label>
      </div>
    </div>
  );
}

export function LevelSelector({ value, onChange }: { value: PowerLevel; onChange: (level: PowerLevel) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5" role="radiogroup" aria-label="Nível de potência">
      {[1, 2, 3, 4, 5].map((level) => {
        const info: LevelInfo = getLevel(level as PowerLevel);
        const active = value === level;
        return (
          <button key={level} type="button" role="radio" aria-checked={active} onClick={() => onChange(level as PowerLevel)}
            className={`po-level rounded-xl border-2 p-4 text-left transition hover:-translate-y-0.5 ${active ? 'shadow-lg' : 'border-slate-200 dark:border-slate-700'}`}
            style={active ? { borderColor: info.color, boxShadow: `0 0 0 2px ${info.color}33` } : undefined}>
            <span className="text-2xl" style={{ color: info.color }} aria-hidden="true">{level === 1 ? '🔵' : level === 2 ? '🟢' : level === 3 ? '🟡' : level === 4 ? '🟠' : '🟣'}</span>
            <p className="mt-2 font-bold" style={{ color: info.color }}>Nível {level}</p>
            <p className="text-sm font-semibold">{info.name}</p>
            <p className="mt-1 text-xs text-slate-500">{info.description}</p>
            <ul className="mt-2 space-y-0.5 text-[11px] text-slate-500">{info.includes.slice(0, 3).map((item) => <li key={item}>• {item}</li>)}</ul>
          </button>
        );
      })}
    </div>
  );
}

export function ConsistencyAlert({ report, onAction }: { report: CoherenceReport; onAction: (actionId: string, level?: PowerLevel) => void }) {
  if (!report.warnings.length) return null;
  return (
    <div className="space-y-3">
      {report.warnings.map((warning) => (
        <WarningCard key={warning.id} title={warning.title}>
          <p>{warning.message}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {warning.actions.map((action) => (
              <button key={action.id} type="button" onClick={() => onAction(action.id, warning.suggestedLevel)}
                className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-500">
                {action.label}
              </button>
            ))}
          </div>
        </WarningCard>
      ))}
    </div>
  );
}

export function PlatformHint({ selected }: { selected: Platform[] }) {
  return <p className="text-sm text-slate-500">Selecionadas: {selected.length ? selected.join(', ') : 'nenhuma ainda'}</p>;
}
