import type { ProjectSummary } from '@po/types';
import { getLevel, PLATFORMS } from '@po/core';
import { EmptyState } from './primitives';

export function ProjectCard({ project, onOpen, onDuplicate, onRename, onExport, onDelete, onHistory }: {
  project: ProjectSummary;
  onOpen: () => void;
  onDuplicate: () => void;
  onRename: () => void;
  onExport: () => void;
  onDelete: () => void;
  onHistory: () => void;
}) {
  const level = getLevel(project.level);
  const platforms = project.platforms.map((id) => PLATFORMS.find((item) => item.id === id)?.label ?? id).join(', ');
  return (
    <li className="po-project rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{project.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{project.description || 'Sem descrição'}</p>
        </div>
        <span className="shrink-0 rounded-full px-2 py-1 text-[11px] font-medium" style={{ color: level.color, backgroundColor: `${level.color}1f` }}>Nível {project.level}</span>
      </div>
      <p className="mt-3 text-xs text-slate-500">Plataformas: {platforms || '—'}</p>
      <p className="mt-1 text-xs text-slate-400">Atualizado em {new Date(project.updatedAt).toLocaleString('pt-BR')}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={onOpen} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white">Abrir</button>
        <button type="button" onClick={onRename} className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs dark:bg-slate-700">Renomear</button>
        <button type="button" onClick={onDuplicate} className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs dark:bg-slate-700">Duplicar</button>
        <button type="button" onClick={onHistory} className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs dark:bg-slate-700">Histórico</button>
        <button type="button" onClick={onExport} className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs dark:bg-slate-700">Exportar</button>
        <button type="button" onClick={onDelete} className="rounded-lg bg-red-100 px-3 py-1.5 text-xs text-red-700 dark:bg-red-950 dark:text-red-300">Excluir</button>
      </div>
    </li>
  );
}

export function ProjectList({ projects, onOpen, onDuplicate, onRename, onExport, onDelete, onHistory, onNew }: {
  projects: ProjectSummary[];
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string) => void;
  onExport: (id: string) => void;
  onDelete: (id: string) => void;
  onHistory: (id: string) => void;
  onNew: () => void;
}) {
  if (!projects.length) {
    return <EmptyState title="Nenhum projeto ainda" description="Transforme uma ideia em uma especificação profissional pronta para um agente de IA." action={<button type="button" onClick={onNew} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">Criar meu primeiro projeto</button>} />;
  }
  return (
    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project}
          onOpen={() => onOpen(project.id)} onDuplicate={() => onDuplicate(project.id)}
          onRename={() => onRename(project.id)} onExport={() => onExport(project.id)}
          onDelete={() => onDelete(project.id)} onHistory={() => onHistory(project.id)} />
      ))}
    </ul>
  );
}
