import { useMemo, useRef, useState } from 'react';
import type { ExportFormat } from '@po/types';
import { downloadFile } from '@po/storage';
import { Toast } from './primitives';
import { sectionsOf } from '@po/prompt-engine';

export function PromptEditor({ value, onChange, onRegenerate, onEditConfig, fileName = 'prompt' }: {
  value: string;
  onChange: (value: string) => void;
  onRegenerate: () => void;
  onEditConfig: () => void;
  fileName?: string;
}) {
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [toast, setToast] = useState('');
  const history = useRef<string[]>([value]);
  const index = useRef(0);

  const commit = (next: string) => {
    onChange(next);
    history.current = history.current.slice(0, index.current + 1);
    history.current.push(next);
    index.current += 1;
  };

  const undo = () => {
    if (index.current === 0) return;
    index.current -= 1;
    onChange(history.current[index.current]);
  };

  const redo = () => {
    if (index.current >= history.current.length - 1) return;
    index.current += 1;
    onChange(history.current[index.current]);
  };

  const sections = useMemo(() => sectionsOf(value), [value]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setToast('Prompt copiado!');
    } catch {
      setToast('Não foi possível copiar. Selecione o texto e copie manualmente.');
    }
  };

  const exportAs = (format: ExportFormat) => {
    const mime = format === 'json' ? 'application/json' : format === 'yaml' ? 'text/yaml' : 'text/markdown';
    downloadFile(`${fileName}.${format}`, value, mime);
    setToast(`Arquivo ${format.toUpperCase()} baixado.`);
  };

  return (
    <section className="po-editor rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={copy} className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white">Copiar prompt</button>
        <button type="button" onClick={() => exportAs('txt')} className="rounded-lg bg-slate-200 px-3 py-2 text-sm dark:bg-slate-700">TXT</button>
        <button type="button" onClick={() => exportAs('md')} className="rounded-lg bg-slate-200 px-3 py-2 text-sm dark:bg-slate-700">Markdown</button>
        <button type="button" onClick={() => exportAs('json')} className="rounded-lg bg-slate-200 px-3 py-2 text-sm dark:bg-slate-700">JSON</button>
        <button type="button" onClick={() => exportAs('yaml')} className="rounded-lg bg-slate-200 px-3 py-2 text-sm dark:bg-slate-700">YAML</button>
        <button type="button" onClick={onEditConfig} className="rounded-lg bg-slate-200 px-3 py-2 text-sm dark:bg-slate-700">Editar configuração</button>
        <button type="button" onClick={onRegenerate} className="rounded-lg bg-fuchsia-600 px-3 py-2 text-sm text-white">Regenerar</button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pesquisar no prompt…" aria-label="Pesquisar no prompt"
          className="min-w-48 flex-1 rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm dark:border-slate-600" />
        <button type="button" onClick={undo} className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600">↶ Desfazer</button>
        <button type="button" onClick={redo} className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600">↷ Refazer</button>
        <button type="button" onClick={() => setPreview((current) => !current)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600">{preview ? 'Editar' : 'Visualizar Markdown'}</button>
        <button type="button" onClick={() => setExpanded((current) => !current)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600">{expanded ? 'Reduzir' : 'Expandir'}</button>
      </div>

      <p className="mt-3 text-xs text-slate-500">{sections.length} seções · {value.length} caracteres</p>

      {preview ? (
        <div className="prose mt-3 max-w-none rounded-lg bg-slate-50 p-4 text-sm dark:bg-slate-800">
          {value.split('\n').map((line, i) => line.startsWith('# ')
            ? <h2 key={i} className="mt-4 text-base font-bold text-indigo-600 dark:text-indigo-300">{line.slice(2)}</h2>
            : <p key={i} className="text-slate-600 dark:text-slate-300">{line.replace(/^- /, '• ')}</p>)}
        </div>
      ) : (
        <textarea value={value} onChange={(event) => commit(event.target.value)} spellCheck={false}
          aria-label="Editor do prompt"
          className={`mt-3 w-full rounded-lg border border-slate-300 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100 focus:ring-2 focus:ring-indigo-500 ${expanded ? 'h-[60vh]' : 'h-64'}`} />
      )}

      {search && (
        <p className="mt-2 text-xs text-amber-600">
          {value.toLowerCase().includes(search.toLowerCase()) ? 'Termo encontrado no prompt.' : 'Nenhuma ocorrência encontrada.'}
        </p>
      )}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </section>
  );
}

export function HowToUse() {
  return (
    <aside className="po-guide rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm dark:border-emerald-900 dark:bg-emerald-950/40">
      <h3 className="font-semibold text-emerald-800 dark:text-emerald-300">Como usar</h3>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-emerald-900 dark:text-emerald-200">
        <li>Copie o prompt.</li>
        <li>Abra seu agente de desenvolvimento.</li>
        <li>Cole o prompt na primeira mensagem.</li>
        <li>Envie.</li>
      </ol>
      <p className="mt-3 text-xs text-emerald-700 dark:text-emerald-400">Compatível com Cursor, Claude, ChatGPT, Gemini, Lovable e outros agentes.</p>
    </aside>
  );
}
