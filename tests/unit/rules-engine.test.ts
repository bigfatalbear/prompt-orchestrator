import { describe, expect, it } from 'vitest';
import { analyzeCoherence, analyzeDependencies, applyCoherenceAction } from '@po/rules-engine';
import { makeState } from '../helpers';

describe('Rules Engine', () => {
  it('detecta nível abaixo dos recursos ativados e sugere o nível correto', () => {
    const state = makeState({
      project: { name: 'X', description: '', level: 1 },
      engineering: { cicd: true, audit: true, api: true },
    });
    const report = analyzeCoherence(state);
    const mismatch = report.warnings.find((item) => item.id === 'level-mismatch');
    expect(mismatch).toBeDefined();
    expect(mismatch?.suggestedLevel).toBe(5);
    expect(mismatch?.actions.map((item) => item.id)).toEqual(['adjust-level', 'keep']);
  });

  it('não altera a configuração automaticamente, apenas sugere', () => {
    const state = makeState({ project: { name: 'X', description: '', level: 1 }, engineering: { cicd: true } });
    expect(state.project.level).toBe(1);
    const adjusted = applyCoherenceAction(state, 'adjust-level', 4);
    expect(adjusted.project.level).toBe(4);
  });

  it('exige dependências de PWA', () => {
    const state = makeState({ platforms: ['pwa'] });
    state.pwa = { enabled: true, manifest: true, serviceWorker: false, cacheStrategy: false, https: true, installPrompt: false };
    const dependencies = analyzeDependencies(state);
    expect(dependencies.find((item) => item.id === 'pwa.serviceWorker')?.satisfied).toBe(false);
    expect(analyzeCoherence(state).warnings.some((item) => item.id === 'pwa-without-sw')).toBe(true);
  });

  it('identifica dependências de autenticação e desktop', () => {
    const state = makeState({
      engineering: { authentication: true, desktop: true },
      platforms: ['web', 'desktop'],
    });
    const ids = analyzeDependencies(state).map((item) => item.id);
    expect(ids).toContain('authentication.session');
    expect(ids).toContain('desktop.packaging');
  });

  it('reporta coerência quando tudo está consistente', () => {
    const report = analyzeCoherence(makeState({ project: { name: 'X', description: '', level: 4 } }));
    expect(report.coherent).toBe(true);
    expect(report.warnings).toHaveLength(0);
  });
});
