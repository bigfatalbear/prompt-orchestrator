import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { ProjectState, ProjectSummary, ProjectVersion, ExportFormat } from '@po/types';

interface OrchestratorDB extends DBSchema {
  projects: { key: string; value: ProjectState };
  versions: { key: string; value: ProjectVersion; indexes: { 'by-project': string } };
  settings: { key: string; value: unknown };
}

const DB_NAME = 'prompt-orchestrator';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<OrchestratorDB>> | null = null;

export function getDatabase(): Promise<IDBPDatabase<OrchestratorDB>> {
  if (!dbPromise) {
    dbPromise = openDB<OrchestratorDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('projects')) db.createObjectStore('projects', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('versions')) {
          const store = db.createObjectStore('versions', { keyPath: 'id' });
          store.createIndex('by-project', 'projectId');
        }
        if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings');
      },
    });
  }
  return dbPromise;
}

export async function saveProject(state: ProjectState): Promise<void> {
  const db = await getDatabase();
  await db.put('projects', state);
}

export async function getProject(id: string): Promise<ProjectState | undefined> {
  const db = await getDatabase();
  return db.get('projects', id);
}

export async function listProjects(): Promise<ProjectSummary[]> {
  const db = await getDatabase();
  const projects = await db.getAll('projects');
  return projects
    .map((state) => ({
      id: state.id,
      name: state.project.name || state.idea.name || 'Projeto sem nome',
      description: state.project.description || state.idea.description,
      level: state.project.level,
      platforms: state.platforms,
      status: state.metadata.status,
      updatedAt: state.metadata.updatedAt,
      createdAt: state.metadata.createdAt,
    }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDatabase();
  const tx = db.transaction(['projects', 'versions'], 'readwrite');
  const versions = await tx.objectStore('versions').index('by-project').getAllKeys(id);
  for (const key of versions) await tx.objectStore('versions').delete(key);
  await tx.objectStore('projects').delete(id);
  await tx.done;
}

export async function duplicateProject(id: string, newId: string): Promise<ProjectState | undefined> {
  const original = await getProject(id);
  if (!original) return undefined;
  const now = new Date().toISOString();
  const copy: ProjectState = {
    ...structuredClone(original),
    id: newId,
    project: { ...original.project, name: `${original.project.name} (cópia)` },
    metadata: { ...original.metadata, createdAt: now, updatedAt: now, version: 1, status: 'draft' },
  };
  await saveProject(copy);
  return copy;
}

export async function saveVersion(state: ProjectState, label?: string): Promise<ProjectVersion> {
  const db = await getDatabase();
  const version: ProjectVersion = {
    id: `${state.id}-v${state.metadata.version}`,
    projectId: state.id,
    version: state.metadata.version,
    createdAt: new Date().toISOString(),
    label: label ?? `Versão ${state.metadata.version}`,
    state: structuredClone(state),
  };
  await db.put('versions', version);
  return version;
}

export async function listVersions(projectId: string): Promise<ProjectVersion[]> {
  const db = await getDatabase();
  const versions = await db.getAllFromIndex('versions', 'by-project', projectId);
  return versions.sort((a, b) => b.version - a.version);
}

export async function getVersion(id: string): Promise<ProjectVersion | undefined> {
  const db = await getDatabase();
  return db.get('versions', id);
}

export async function deleteVersion(id: string): Promise<void> {
  const db = await getDatabase();
  await db.delete('versions', id);
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  const db = await getDatabase();
  await db.put('settings', value, key);
}

export async function getSetting<T>(key: string): Promise<T | undefined> {
  const db = await getDatabase();
  return (await db.get('settings', key)) as T | undefined;
}

export interface Recovery {
  projectId: string;
  savedAt: string;
  step: number;
}

export const setRecovery = (data: Recovery) => setSetting('recovery', data);
export const getRecovery = () => getSetting<Recovery>('recovery');
export const clearRecovery = async () => {
  const db = await getDatabase();
  await db.delete('settings', 'recovery');
};

export async function exportProject(state: ProjectState, format: ExportFormat): Promise<string> {
  if (format === 'json') return JSON.stringify(state, null, 2);
  if (format === 'yaml') return toYaml(state);
  if (format === 'md') return `# ${state.project.name}\n\n${state.project.description}\n\n## Especificação\n\n${state.generatedPrompt || 'Especificação não gerada.'}\n`;
  return `${state.project.name}\n\n${state.project.description}\n\n${state.generatedPrompt || 'Especificação não gerada.'}\n`;
}

export function toYaml(value: unknown, indent = 0): string {
  const pad = ' '.repeat(indent);
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (item && typeof item === 'object') return `${pad}- ${toYaml(item, indent + 2).trimStart()}`;
      return `${pad}- ${String(item)}`;
    }).join('\n');
  }
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).map(([key, item]) => {
      if (Array.isArray(item) || (item && typeof item === 'object')) {
        return `${pad}${key}:\n${toYaml(item, indent + 2)}`;
      }
      return `${pad}${key}: ${JSON.stringify(item)}`;
    }).join('\n');
  }
  return `${pad}${JSON.stringify(value)}`;
}

export function downloadFile(name: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
