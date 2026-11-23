import { create } from 'zustand';
import type { ExportFormat, ProjectState, ProjectSummary, ProjectVersion } from '@po/types';
import { createEmptyProject, touch } from '@po/core';
import { getProvider } from '@po/ai';
import { canAdvance } from '@po/validation';
import {
  deleteProject as dbDeleteProject,
  deleteVersion,
  downloadFile,
  duplicateProject as dbDuplicateProject,
  exportProject,
  getProject,
  getRecovery,
  getSetting,
  listProjects,
  listVersions,
  saveProject,
  saveVersion,
  setRecovery,
  setSetting,
  clearRecovery,
} from '@po/storage';

export type View = 'home' | 'wizard' | 'result' | 'history';

interface AppState {
  view: View;
  project: ProjectState;
  projects: ProjectSummary[];
  versions: ProjectVersion[];
  recovery: { projectId: string; savedAt: string; step: number } | null;
  theme: 'light' | 'dark';
  toast: string | null;
  busy: boolean;
  init: () => Promise<void>;
  newProject: () => void;
  openProject: (id: string) => Promise<void>;
  update: (patch: Partial<ProjectState>) => void;
  goTo: (step: number) => void;
  next: () => string | null;
  back: () => void;
  saveNow: () => Promise<void>;
  generate: () => Promise<void>;
  regenerate: () => Promise<void>;
  exportAs: (format: ExportFormat) => Promise<void>;
  rename: (id: string, name: string) => Promise<void>;
  duplicate: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  openHistory: (id: string) => Promise<void>;
  restoreVersion: (versionId: string) => Promise<void>;
  dropVersion: (versionId: string) => Promise<void>;
  toggleTheme: () => void;
  dismissRecovery: () => Promise<void>;
  notify: (message: string | null) => void;
}

let autosaveTimer: ReturnType<typeof setTimeout> | null = null;

export const useApp = create<AppState>((set, get) => {
  const persist = (project: ProjectState) => {
    set({ project });
    void setRecovery({ projectId: project.id, savedAt: project.metadata.updatedAt, step: project.metadata.step });
    if (autosaveTimer) clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => { void saveProject(project); }, 600);
  };

  return {
    view: 'home',
    project: createEmptyProject(),
    projects: [],
    versions: [],
    recovery: null,
    theme: 'light',
    toast: null,
    busy: false,

    init: async () => {
      const [projects, recovery, theme] = await Promise.all([
        listProjects(), getRecovery(), getSetting<'light' | 'dark'>('theme'),
      ]);
      const resolvedTheme = theme ?? (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
      set({ projects, recovery, theme: resolvedTheme });
      if (new URLSearchParams(location.search).get('new') === '1') get().newProject();
    },

    newProject: () => {
      const project = createEmptyProject();
      set({ project, view: 'wizard' });
      persist(project);
    },

    openProject: async (id) => {
      const project = await getProject(id);
      if (!project) { get().notify('Projeto não encontrado.'); return; }
      set({ project, view: project.metadata.status === 'done' ? 'result' : 'wizard' });
    },

    update: (patch) => persist(touch(get().project, patch)),

    goTo: (step) => {
      const project = { ...get().project, metadata: { ...get().project.metadata, step } };
      set({ project });
      persist(project);
    },

    next: () => {
      const { project } = get();
      if (!canAdvance(project.metadata.step, project)) return 'Revise os campos destacados antes de continuar.';
      const step = Math.min(6, project.metadata.step + 1);
      get().goTo(step);
      return null;
    },

    back: () => get().goTo(Math.max(1, get().project.metadata.step - 1)),

    saveNow: async () => {
      const project = get().project;
      await saveProject(project);
      set({ projects: await listProjects() });
      get().notify('Projeto salvo.');
    },

    generate: async () => {
      set({ busy: true });
      try {
        const provider = getProvider(get().project.ai.provider);
        const spec = await provider.analyze(get().project);
        const prompt = await provider.generate(get().project);
        const project = touch(get().project, {
          generatedSpecification: spec,
          generatedPrompt: prompt,
          metadata: { ...get().project.metadata, status: 'done', step: 6 },
        });
        persist(project);
        await saveProject(project);
        await saveVersion(project, 'Geração do prompt');
        set({ view: 'result', projects: await listProjects() });
        get().notify('Especificação e prompt gerados.');
      } catch {
        get().notify('Não conseguimos gerar o resultado. Tente novamente.');
      } finally {
        set({ busy: false });
      }
    },

    regenerate: async () => {
      const provider = getProvider(get().project.ai.provider);
      const prompt = await provider.generate(get().project);
      get().update({ generatedPrompt: prompt });
      get().notify('Prompt regenerado.');
    },

    exportAs: async (format) => {
      const project = get().project;
      const content = await exportProject(project, format);
      downloadFile(`${(project.project.name || 'prompt-orchestrator').replace(/[^\w-]+/g, '-').toLowerCase()}.${format}`, content,
        format === 'json' ? 'application/json' : format === 'yaml' ? 'text/yaml' : 'text/plain');
      get().notify(`Exportado em ${format.toUpperCase()}.`);
    },

    rename: async (id, name) => {
      const project = await getProject(id);
      if (!project) return;
      const updated = touch(project, { project: { ...project.project, name } });
      await saveProject(updated);
      set({ projects: await listProjects(), project: get().project.id === id ? updated : get().project });
    },

    duplicate: async (id) => {
      const copy = await dbDuplicateProject(id, crypto.randomUUID());
      if (copy) { set({ projects: await listProjects() }); get().notify('Projeto duplicado.'); }
    },

    remove: async (id) => {
      await dbDeleteProject(id);
      set({ projects: await listProjects() });
      get().notify('Projeto excluído.');
    },

    openHistory: async (id) => {
      set({ versions: await listVersions(id), view: 'history' });
    },

    restoreVersion: async (versionId) => {
      const version = get().versions.find((item) => item.id === versionId);
      if (!version) return;
      const project = touch(version.state, {
        metadata: { ...version.state.metadata, version: version.state.metadata.version + 1 },
      });
      persist(project);
      await saveVersion(project, `Restauração da versão ${version.version}`);
      set({ view: 'wizard' });
      get().notify('Versão restaurada.');
    },

    dropVersion: async (versionId) => {
      await deleteVersion(versionId);
      set({ versions: get().versions.filter((item) => item.id !== versionId) });
      get().notify('Versão removida.');
    },

    toggleTheme: () => {
      const theme = get().theme === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', theme === 'dark');
      void setSetting('theme', theme);
      set({ theme });
    },

    dismissRecovery: async () => {
      await clearRecovery();
      set({ recovery: null });
    },

    notify: (toast) => set({ toast }),
  };
});
