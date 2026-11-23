import type { Engineering, Idea, Platform, ProjectState } from '@po/types';
import { createEmptyProject, syncDerivedConfig } from '@po/core';

type TestPatch = Omit<Partial<ProjectState>, 'project' | 'idea' | 'engineering'> & {
  project?: Partial<ProjectState['project']>;
  idea?: Partial<Idea>;
  engineering?: Partial<Engineering>;
  platforms?: Platform[];
};

export function makeState(patch: TestPatch = {}): ProjectState {
  const base = createEmptyProject();
  return syncDerivedConfig({
    ...base,
    ...patch,
    project: { ...base.project, name: 'Projeto Teste', level: 3, ...patch.project },
    idea: {
      ...base.idea,
      name: 'Projeto Teste',
      description: 'Sistema para gerenciar solicitações e gerar relatórios mensais completos.',
      features: 'Cadastro de clientes\nEmissão de relatórios',
      audience: 'Pequenas empresas',
      ...patch.idea,
    },
    platforms: patch.platforms ?? ['web'],
    engineering: { ...base.engineering, ...patch.engineering },
  });
}
