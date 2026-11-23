import { describe, expect, it } from 'vitest';
import {
  clearRecovery,
  deleteProject,
  exportProject,
  getProject,
  getRecovery,
  listProjects,
  listVersions,
  saveProject,
  saveVersion,
  setRecovery,
  toYaml,
} from '@po/storage';
import { makeState } from '../helpers';

describe('Storage', () => {
  it('salva, lista, reabre e exclui projetos', async () => {
    const project = makeState();
    await saveProject(project);
    expect((await getProject(project.id))?.project.name).toBe('Projeto Teste');
    expect((await listProjects()).some((item) => item.id === project.id)).toBe(true);
    await deleteProject(project.id);
    expect(await getProject(project.id)).toBeUndefined();
  });

  it('mantém histórico de versões', async () => {
    const project = makeState();
    await saveProject(project);
    await saveVersion(project, 'v1');
    const versions = await listVersions(project.id);
    expect(versions).toHaveLength(1);
    expect(versions[0].label).toBe('v1');
    expect(versions[0].state.id).toBe(project.id);
    await deleteProject(project.id);
  });

  it('persiste recuperação de sessão', async () => {
    await setRecovery({ projectId: 'abc', savedAt: '2026-01-01', step: 2 });
    expect((await getRecovery())?.step).toBe(2);
    await clearRecovery();
    expect(await getRecovery()).toBeUndefined();
  });

  it('exporta em JSON, YAML, MD e TXT', async () => {
    const project = { ...makeState(), generatedPrompt: '# PAPEL DO AGENTE\n\nTeste' };
    expect(JSON.parse(await exportProject(project, 'json')).id).toBe(project.id);
    expect(await exportProject(project, 'yaml')).toContain('project:');
    expect(await exportProject(project, 'md')).toContain('# Projeto Teste');
    expect(await exportProject(project, 'txt')).toContain('PAPEL DO AGENTE');
    expect(toYaml({ a: 1, b: [1, 2] })).toContain('a: 1');
  });
});
