import { describe, expect, it } from 'vitest';
import { generatePrompt, sectionsOf } from '@po/prompt-engine';
import { buildSpecification } from '@po/core';
import { makeState } from '../helpers';

describe('Prompt Engine', () => {
  it('gera todas as seções obrigatórias', () => {
    const prompt = generatePrompt(buildSpecification(makeState()));
    const sections = sectionsOf(prompt);
    expect(sections).toContain('PAPEL DO AGENTE');
    expect(sections).toContain('OBJETIVO');
    expect(sections).toContain('REQUISITOS FUNCIONAIS');
    expect(sections).toContain('ARQUITETURA');
    expect(sections).toContain('CRITÉRIOS DE ACEITAÇÃO');
    expect(sections).toContain('CONDIÇÕES DE CONCLUSÃO');
  });

  it('omite PWA e Desktop quando desativados', () => {
    const prompt = generatePrompt(buildSpecification(makeState({ platforms: ['web'] })));
    expect(prompt).not.toContain('# PWA');
    expect(prompt).not.toContain('# DESKTOP');
  });

  it('inclui PWA e Desktop quando ativados', () => {
    const prompt = generatePrompt(buildSpecification(makeState({ platforms: ['web', 'pwa', 'desktop'] })));
    expect(prompt).toContain('# PWA');
    expect(prompt).toContain('# DESKTOP');
  });

  it('omite autenticação quando desativada', () => {
    const prompt = generatePrompt(buildSpecification(makeState({ engineering: { authentication: false }, platforms: ['web'] })));
    expect(prompt).not.toContain('# AUTENTICAÇÃO');
  });

  it('reflete requisitos funcionais informados', () => {
    const prompt = generatePrompt(buildSpecification(makeState({ idea: { features: 'Cadastro de clientes\nRelatórios mensais' } })));
    expect(prompt).toContain('Cadastro de clientes');
    expect(prompt).toContain('Relatórios mensais');
  });
});
