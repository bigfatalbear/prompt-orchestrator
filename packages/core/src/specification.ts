import type { ProjectState, Specification } from '@po/types';
import { analyzeCoherence, analyzeDependencies } from '@po/rules-engine';
import { validateProjectState } from '@po/validation';
import { syncDerivedConfig } from './factory';

/**
 * Pipeline: normalização → validação → dependências → coerência → arquitetura → spec.
 * Nunca gera o prompt diretamente da interface.
 */
export function buildSpecification(input: ProjectState): Specification {
  const state = syncDerivedConfig(input);
  const validation = validateProjectState(state);
  const dependencies = analyzeDependencies(state);
  const coherence = analyzeCoherence(state);
  const level = state.project.level;

  return {
    project: { name: state.project.name, description: state.project.description, level },
    idea: state.idea,
    users: state.users,
    platforms: state.platforms,
    engineering: state.engineering,
    architecture: {
      style: level >= 3 ? 'arquitetura modular em camadas com separação de responsabilidades' : 'monolito simples e direto',
      modules: state.architecture.modules,
      patterns: state.architecture.patterns,
    },
    database: state.database,
    authentication: state.authentication,
    security: state.security,
    api: state.api,
    pwa: state.pwa,
    desktop: state.desktop,
    testing: state.testing,
    deployment: state.deployment,
    git: state.git,
    ai: state.ai,
    dependencies,
    coherence,
    validation,
    generatedAt: new Date().toISOString(),
  };
}
