import { z } from 'zod';
import type { ProjectState, ValidationIssue } from '@po/types';

export const ideaSchema = z.object({
  name: z.string().trim().min(3, 'Informe um nome com pelo menos 3 caracteres.').max(120),
  description: z.string().trim().min(20, 'Descreva a ideia com pelo menos 20 caracteres.').max(4000),
  audience: z.string().trim().max(300),
  problem: z.string().trim().max(1000),
  features: z.string().trim().max(2000),
  similar: z.string().trim().max(500),
});

export const projectStateSchema = z.object({
  id: z.string().min(1),
  project: z.object({
    name: z.string().trim().min(3),
    description: z.string().trim().max(4000),
    level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  }),
  idea: ideaSchema,
  platforms: z.array(z.enum(['web', 'pwa', 'desktop'])).min(1, 'Selecione ao menos uma plataforma.'),
  generatedPrompt: z.string(),
});

export function validateStep(step: number, state: ProjectState): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const add = (path: string, message: string) => issues.push({ path, message, severity: 'error' });

  if (step === 1) {
    const result = ideaSchema.safeParse(state.idea);
    if (!result.success) {
      for (const error of result.error.issues) add(`idea.${error.path.join('.')}`, error.message);
    }
    if (!state.project.name.trim()) add('project.name', 'Informe o nome do projeto.');
    if (!state.idea.description.trim()) add('idea.description', 'Explique sua ideia com suas próprias palavras.');
  }
  if (step === 2 && state.platforms.length === 0) add('platforms', 'Selecione ao menos uma plataforma.');
  if (step === 4 && ![1, 2, 3, 4, 5].includes(state.project.level)) add('project.level', 'Escolha um nível de potência.');
  return issues;
}

export function validateProjectState(state: ProjectState): ValidationIssue[] {
  const result = projectStateSchema.safeParse(state);
  if (result.success) return [];
  return result.error.issues.map((error) => ({
    path: error.path.join('.'),
    message: error.message,
    severity: 'error' as const,
  }));
}

export function canAdvance(step: number, state: ProjectState): boolean {
  return validateStep(step, state).length === 0;
}
