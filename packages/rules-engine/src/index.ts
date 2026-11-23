import type {
  CoherenceReport,
  CoherenceWarning,
  Dependency,
  ProjectState,
  PowerLevel,
} from '@po/types';

interface DependencyRule {
  from: string;
  key: string;
  label: string;
  description: string;
  required: boolean;
  check: (state: ProjectState) => boolean;
}

export const DEPENDENCY_RULES: DependencyRule[] = [
  { from: 'pwa', key: 'manifest', label: 'Manifest', description: 'Define nome, ícones e modo standalone.', required: true, check: (s) => s.pwa.manifest },
  { from: 'pwa', key: 'serviceWorker', label: 'Service Worker', description: 'Controla cache e funcionamento offline.', required: true, check: (s) => s.pwa.serviceWorker },
  { from: 'pwa', key: 'cacheStrategy', label: 'Estratégia de cache', description: 'Define o que fica salvo para uso offline.', required: true, check: (s) => s.pwa.cacheStrategy || !s.pwa.serviceWorker },
  { from: 'pwa', key: 'https', label: 'HTTPS em produção', description: 'Service Workers exigem conexão segura.', required: true, check: (s) => s.pwa.https },
  { from: 'authentication', key: 'session', label: 'Gerenciamento de sessão', description: 'Mantém o usuário autenticado com segurança.', required: true, check: (s) => !s.authentication.enabled || s.authentication.sessionStrategy !== 'none' },
  { from: 'authentication', key: 'security', label: 'Segurança', description: 'Protege credenciais e dados da sessão.', required: true, check: (s) => !s.authentication.enabled || s.security.validation },
  { from: 'authentication', key: 'persistence', label: 'Persistência', description: 'Armazena a sessão e os dados do usuário.', required: true, check: (s) => !s.authentication.enabled || s.database.enabled },
  { from: 'desktop', key: 'runtime', label: 'Runtime desktop', description: 'Executa o aplicativo fora do navegador.', required: true, check: (s) => !s.desktop.enabled || s.desktop.runtime !== 'none' },
  { from: 'desktop', key: 'packaging', label: 'Empacotamento', description: 'Gera o instalador para o sistema operacional.', required: true, check: (s) => !s.desktop.enabled || s.desktop.packaging },
  { from: 'offline', key: 'cache', label: 'Cache', description: 'Guarda arquivos e dados para uso sem internet.', required: true, check: (s) => !s.engineering.offline || s.pwa.cacheStrategy || s.database.enabled },
  { from: 'offline', key: 'indexeddb', label: 'IndexedDB', description: 'Persiste dados localmente no navegador.', required: false, check: (s) => !s.engineering.offline || s.database.enabled },
  { from: 'offline', key: 'sync', label: 'Sincronização', description: 'Reconcilia dados locais quando a conexão volta.', required: false, check: (s) => !s.engineering.offline || s.api.enabled || s.database.enabled },
];

const ADVANCED_KEYS: Array<{ key: keyof ProjectState['engineering']; label: string; min: PowerLevel }> = [
  { key: 'cicd', label: 'CI/CD', min: 4 },
  { key: 'api', label: 'API', min: 4 },
  { key: 'observability', label: 'Observabilidade', min: 4 },
  { key: 'logs', label: 'Logs', min: 4 },
  { key: 'audit', label: 'Auditoria', min: 5 },
  { key: 'backup', label: 'Backup', min: 4 },
  { key: 'modularArchitecture', label: 'Arquitetura modular', min: 3 },
];

export function analyzeDependencies(state: ProjectState): Dependency[] {
  return DEPENDENCY_RULES.map((rule) => {
    const active =
      (rule.from === 'pwa' && (state.pwa.enabled || state.platforms.includes('pwa'))) ||
      (rule.from === 'authentication' && state.authentication.enabled) ||
      (rule.from === 'desktop' && (state.desktop.enabled || state.platforms.includes('desktop'))) ||
      (rule.from === 'offline' && state.engineering.offline);
    return {
      id: `${String(rule.from)}.${rule.key}`,
      label: rule.label,
      description: rule.description,
      from: String(rule.from),
      required: rule.required && active,
      satisfied: rule.check(state),
    };
  }).filter((dependency) => dependency.required || dependency.satisfied);
}

export function analyzeCoherence(state: ProjectState): CoherenceReport {
  const level = state.project.level as PowerLevel;
  const warnings: CoherenceWarning[] = [];
  const advancedActive = ADVANCED_KEYS.filter((item) => state.engineering[item.key] && item.min > level);

  if (advancedActive.length) {
    const suggested = Math.max(...advancedActive.map((item) => item.min)) as PowerLevel;
    warnings.push({
      id: 'level-mismatch',
      title: 'Sua configuração está acima do nível selecionado.',
      message: `Você escolheu um projeto de nível ${level}, mas ativou ${advancedActive.map((item) => item.label).join(', ')} — recursos normalmente usados em arquiteturas avançadas.`,
      severity: 'warning',
      suggestedLevel: suggested,
      actions: [
        { id: 'adjust-level', label: `Ajustar para nível ${suggested}` },
        { id: 'keep', label: 'Manter minhas escolhas' },
      ],
    });
  }

  if (state.platforms.includes('pwa') && !state.pwa.serviceWorker) {
    warnings.push({
      id: 'pwa-without-sw',
      title: 'PWA sem Service Worker',
      message: 'Sem Service Worker, o aplicativo não poderá funcionar offline nem ser instalado corretamente.',
      severity: 'warning',
      actions: [{ id: 'enable-sw', label: 'Ativar Service Worker' }],
    });
  }

  if (state.engineering.authentication && !state.engineering.security) {
    warnings.push({
      id: 'auth-without-security',
      title: 'Autenticação sem segurança reforçada',
      message: 'Projeto com login deve incluir validação, sanitização e proteção de segredos.',
      severity: 'warning',
      actions: [{ id: 'enable-security', label: 'Ativar segurança' }],
    });
  }

  const missing = analyzeDependencies(state).filter((item) => item.required && !item.satisfied);
  for (const dependency of missing) {
    warnings.push({
      id: `missing-${dependency.id}`,
      title: `Dependência pendente: ${dependency.label}`,
      message: dependency.description,
      severity: 'error',
      actions: [{ id: `fix-${dependency.id}`, label: 'Corrigir configuração' }],
    });
  }

  const recommendations: string[] = [];
  if (level >= 4 && !state.engineering.tests) recommendations.push('Ative testes automatizados para este nível.');
  if (level >= 5 && !state.engineering.audit) recommendations.push('Considere auditoria para atender o nível Enterprise.');
  if (state.engineering.offline && !state.database.enabled) recommendations.push('Ative persistência local para suportar offline.');
  if (state.engineering.api && !state.engineering.documentation) recommendations.push('Documente a API antes da implementação.');

  return {
    warnings,
    dependencies: analyzeDependencies(state),
    recommendations,
    coherent: warnings.filter((item) => item.severity === 'error').length === 0,
  };
}

export function applyCoherenceAction(state: ProjectState, actionId: string, suggestedLevel?: PowerLevel): ProjectState {
  if (actionId === 'adjust-level' && suggestedLevel) {
    return { ...state, project: { ...state.project, level: suggestedLevel } };
  }
  if (actionId === 'enable-sw') {
    return { ...state, pwa: { ...state.pwa, serviceWorker: true, manifest: true, https: true }, engineering: { ...state.engineering, pwa: true } };
  }
  if (actionId === 'enable-security') {
    return { ...state, engineering: { ...state.engineering, security: true }, security: { ...state.security, validation: true, sanitization: true, xssProtection: true, secretManagement: true } };
  }
  return state;
}
