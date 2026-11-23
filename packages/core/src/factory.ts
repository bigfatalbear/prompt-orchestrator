import type { Engineering, Example, PowerLevel, ProjectState } from '@po/types';

export const emptyEngineering = (): Engineering => ({
  git: true,
  conventionalCommits: false,
  modularArchitecture: false,
  tests: false,
  documentation: true,
  cicd: false,
  security: false,
  authentication: false,
  database: false,
  api: false,
  offline: false,
  pwa: false,
  desktop: false,
  observability: false,
  logs: false,
  audit: false,
  backup: false,
});

const newId = () => (globalThis.crypto?.randomUUID?.() ?? `proj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

export function createEmptyProject(): ProjectState {
  const now = new Date().toISOString();
  return {
    id: newId(),
    project: { name: '', description: '', level: 3 },
    idea: { name: '', description: '', audience: '', problem: '', features: '', similar: '' },
    users: [],
    platforms: [],
    engineering: emptyEngineering(),
    architecture: { style: 'monolito modular', modules: [], patterns: [] },
    database: { enabled: false, engine: 'indexeddb' },
    authentication: { enabled: false, providers: [], sessionStrategy: 'none' },
    security: { validation: true, sanitization: false, xssProtection: false, csp: false, secretManagement: false },
    api: { enabled: false, style: 'rest' },
    pwa: { enabled: false, manifest: false, serviceWorker: false, cacheStrategy: false, https: false, installPrompt: false },
    desktop: { enabled: false, runtime: 'tauri', packaging: false, updater: false },
    testing: { enabled: false, unit: false, integration: false, e2e: false },
    deployment: { cicd: false, target: 'none', artifacts: false },
    git: { enabled: true, conventionalCommits: false, provider: 'github' },
    ai: { provider: 'deterministic' },
    validation: [],
    generatedSpecification: null,
    generatedPrompt: '',
    metadata: { createdAt: now, updatedAt: now, version: 1, step: 1, status: 'draft' },
  };
}

/** Mantém os subobjetos derivados coerentes com as escolhas do Wizard. */
export function syncDerivedConfig(state: ProjectState): ProjectState {
  const e = state.engineering;
  const platforms = [...state.platforms];
  const hasPwa = platforms.includes('pwa') || e.pwa;
  const hasDesktop = platforms.includes('desktop') || e.desktop;
  if (hasPwa && !platforms.includes('pwa')) platforms.push('pwa');
  if (hasDesktop && !platforms.includes('desktop')) platforms.push('desktop');

  const level = state.project.level as PowerLevel;
  const isOffline = e.offline || hasPwa;
  return {
    ...state,
    platforms,
    engineering: {
      ...e,
      pwa: hasPwa,
      desktop: hasDesktop,
      offline: isOffline,
      tests: e.tests || level >= 3,
      security: e.security || level >= 3,
      git: e.git || level >= 1,
      cicd: e.cicd || level >= 4,
    },
    database: { ...state.database, enabled: e.database || level >= 3 || (e.authentication && level >= 2) },
    authentication: {
      ...state.authentication,
      enabled: e.authentication,
      providers: state.authentication.providers.length ? state.authentication.providers : e.authentication ? ['email'] : [],
      sessionStrategy: state.authentication.sessionStrategy === 'none' && e.authentication ? 'token' : state.authentication.sessionStrategy,
    },
    security: {
      ...state.security,
      sanitization: state.security.sanitization || level >= 3,
      xssProtection: state.security.xssProtection || level >= 3,
      csp: state.security.csp || level >= 4,
      secretManagement: state.security.secretManagement || level >= 4,
    },
    api: { ...state.api, enabled: e.api || level >= 4, style: state.api.style === 'none' ? 'rest' : state.api.style },
    pwa: {
      enabled: hasPwa,
      manifest: hasPwa,
      serviceWorker: hasPwa && (isOffline || level >= 2),
      cacheStrategy: hasPwa && isOffline,
      https: hasPwa,
      installPrompt: hasPwa,
    },
    desktop: {
      enabled: hasDesktop,
      runtime: state.desktop.runtime === 'none' ? 'tauri' : state.desktop.runtime,
      packaging: hasDesktop,
      updater: hasDesktop && level >= 4,
    },
    testing: {
      enabled: e.tests || level >= 3,
      unit: e.tests || level >= 3,
      integration: level >= 3,
      e2e: level >= 4,
    },
    deployment: {
      cicd: e.cicd || level >= 4,
      target: state.deployment.target,
      artifacts: state.deployment.artifacts || level >= 4,
    },
    git: { ...state.git, enabled: e.git || level >= 1, conventionalCommits: e.conventionalCommits || level >= 2 },
    architecture: {
      ...state.architecture,
      style: level >= 3 ? 'arquitetura modular em camadas' : 'monolito simples',
      modules: state.architecture.modules.length
        ? state.architecture.modules
        : ['domínio', 'interface', 'persistência', ...(e.api || level >= 4 ? ['api'] : [])],
      patterns: state.architecture.patterns.length
        ? state.architecture.patterns
        : level >= 3 ? ['separação de responsabilidades', 'tratamento centralizado de erros'] : [],
    },
  };
}

export function applyExample(base: ProjectState, example: Example): ProjectState {
  const engineering = { ...base.engineering, ...example.engineering };
  return syncDerivedConfig({
    ...base,
    project: { ...base.project, name: example.idea.name, description: example.idea.description, level: example.level },
    idea: { ...example.idea },
    users: [example.idea.audience].filter(Boolean),
    platforms: [...example.platforms],
    engineering,
  });
}

export function touch(state: ProjectState, patch: Partial<ProjectState>): ProjectState {
  const merged = syncDerivedConfig({ ...state, ...patch });
  return {
    ...merged,
    metadata: {
      ...merged.metadata,
      updatedAt: new Date().toISOString(),
      version: merged.metadata.version + 1,
    },
  };
}
