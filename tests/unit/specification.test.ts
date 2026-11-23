import { describe, expect, it } from 'vitest';
import { applyExample, buildSpecification, createEmptyProject, EXAMPLES, getLevel, syncDerivedConfig } from '@po/core';
import { makeState } from '../helpers';

describe('Specification Engine', () => {
  it('gera especificação complete com dependências e coerência', () => {
    const spec = buildSpecification(makeState({ platforms: ['web', 'pwa'] }));
    expect(spec.project.name).toBe('Projeto Teste');
    expect(spec.platforms).toContain('pwa');
    expect(spec.dependencies.length).toBeGreaterThan(0);
    expect(spec.coherence).toBeDefined();
    expect(spec.generatedAt).toBeTruthy();
  });

  it('normaliza configurações derivadas', () => {
    const state = makeState({ platforms: ['pwa'], project: { name: 'X', description: '', level: 3 } });
    expect(state.pwa.enabled).toBe(true);
    expect(state.pwa.manifest).toBe(true);
    expect(state.pwa.https).toBe(true);
    expect(state.testing.unit).toBe(true);
  });

  it('aplica exemplo completo e mantém edição possível', () => {
    const example = EXAMPLES.find((item) => item.id === 'cftv')!;
    const applied = applyExample(createEmptyProject(), example);
    expect(applied.idea.name).toBe(example.idea.name);
    expect(applied.platforms).toContain('desktop');
    expect(applied.project.level).toBe(4);
  });

  it('mantém os 5 níveis com cores progressivas', () => {
    const colors = [1, 2, 3, 4, 5].map((level) => getLevel(level as 1).color);
    expect(new Set(colors).size).toBe(5);
  });

  it('sincroniza banco quando autenticação é ativada', () => {
    const state = syncDerivedConfig(makeState({ engineering: { authentication: true } }));
    expect(state.database.enabled).toBe(true);
    expect(state.authentication.sessionStrategy).toBe('token');
  });
});
