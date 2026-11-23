import type { ProjectState, Specification } from '@po/types';
import { buildSpecification } from '@po/core';
import { generatePrompt } from '@po/prompt-engine';

export interface AIProvider {
  id: string;
  name: string;
  available(): boolean;
  generate(state: ProjectState): Promise<string>;
  analyze(state: ProjectState): Promise<Specification>;
  improve(prompt: string): Promise<string>;
  validate(prompt: string): Promise<string[]>;
}

/** Motor local determinístico — funciona sem internet, sem chave e sem IA externa. */
export const deterministicProvider: AIProvider = {
  id: 'deterministic',
  name: 'Motor local (determinístico)',
  available: () => true,
  async analyze(state) {
    return buildSpecification(state);
  },
  async generate(state) {
    return generatePrompt(buildSpecification(state));
  },
  async improve(prompt) {
    return prompt;
  },
  async validate(prompt) {
    const issues: string[] = [];
    if (!prompt.trim()) issues.push('O prompt está vazio.');
    if (!prompt.includes('# PAPEL DO AGENTE')) issues.push('Falta a seção de papel do agente.');
    if (!prompt.includes('# CRITÉRIOS DE ACEITAÇÃO')) issues.push('Faltam critérios de aceitação.');
    if (/^\s*(?:[-*]\s*)?(TODO|FIXME|PLACEHOLDER)\b/im.test(prompt)) issues.push('O prompt contém marcadores de pendência.');
    return issues;
  },
};

const registry = new Map<string, AIProvider>([[deterministicProvider.id, deterministicProvider]]);

export function registerProvider(provider: AIProvider): void {
  registry.set(provider.id, provider);
}

export function getProvider(id: string): AIProvider {
  return registry.get(id) ?? deterministicProvider;
}

export function listProviders(): AIProvider[] {
  return [...registry.values()];
}

/**
 * Adapter para APIs compatíveis com OpenAI. A chave nunca é armazenada pelo
 * núcleo: ela deve ser fornecida pelo host (backend seguro ou keychain do SO).
 */
export function createOpenAICompatibleProvider(config: {
  endpoint: string;
  model: string;
  getToken: () => Promise<string>;
}): AIProvider {
  return {
    id: 'openai-compatible',
    name: `API compatível (${config.model})`,
    available: () => Boolean(config.endpoint),
    async analyze(state) {
      return buildSpecification(state);
    },
    async generate(state) {
      const local = await deterministicProvider.generate(state);
      const token = await config.getToken();
      if (!token) return local;
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: 'system', content: 'Você refina prompts técnicos. Preserve todas as seções e requisitos.' },
            { role: 'user', content: local },
          ],
        }),
      });
      if (!response.ok) return local;
      const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
      return data.choices?.[0]?.message?.content || local;
    },
    async improve(prompt) {
      return prompt;
    },
    async validate(prompt) {
      return deterministicProvider.validate(prompt);
    },
  };
}
