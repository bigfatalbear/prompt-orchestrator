import { describe, expect, it } from 'vitest';
import { applyExample, buildSpecification, createEmptyProject, EXAMPLES } from '@po/core';
import { canAdvance, validateStep } from '@po/validation';
import { exportProject } from '@po/storage';
import { deterministicProvider } from '@po/ai';

describe('Fluxo completo: Wizard → Specification → Prompt', () => {
  it('transforma exemplo em prompt exportável sem IA externa', async () => {
    let state = createEmptyProject();
    expect(canAdvance(1, state)).toBe(false);

    state = applyExample(state, EXAMPLES.find((item) => item.id === 'financas')!);
    expect(canAdvance(1, state)).toBe(true);
    expect(canAdvance(2, state)).toBe(true);
    expect(validateStep(3, state)).toHaveLength(0);

    const spec = buildSpecification(state);
    const prompt = await deterministicProvider.generate(state);
    state = { ...state, generatedSpecification: spec, generatedPrompt: prompt };

    expect(spec.project.name).toBe('Finanças Pessoais');
    expect(spec.platforms).toContain('pwa');
    expect(prompt).toContain('# PAPEL DO AGENTE');
    expect(prompt).toContain('# CRITÉRIOS DE ACEITAÇÃO');
    expect(JSON.parse(await exportProject(state, 'json')).generatedPrompt).toBe(prompt);
    expect(await deterministicProvider.validate(prompt)).toHaveLength(0);
  });

  it('mantém prompt coerente com configuração multiplataforma', async () => {
    const state = applyExample(createEmptyProject(), EXAMPLES.find((item) => item.id === 'empresarial')!);
    const prompt = await deterministicProvider.generate(state);
    expect(prompt).toContain('# PWA');
    expect(prompt).toContain('# DESKTOP');
    expect(prompt).toContain('# AUTENTICAÇÃO');
    expect(prompt).toContain('# API');
    expect(prompt).toContain('# SEGURANÇA');
  });
});
