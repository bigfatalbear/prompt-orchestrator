import { describe, expect, it } from 'vitest';
import { canAdvance, validateProjectState, validateStep } from '@po/validation';
import { createEmptyProject } from '@po/core';
import { makeState } from '../helpers';

describe('Validation', () => {
  it('bloqueia avanço sem ideia preenchida', () => {
    expect(canAdvance(1, createEmptyProject())).toBe(false);
    expect(canAdvance(1, makeState())).toBe(true);
  });

  it('exige ao menos uma plataforma', () => {
    const state = makeState({ platforms: [] });
    expect(validateStep(2, state).some((item) => item.path === 'platforms')).toBe(true);
  });

  it('rejeita estado inválido', () => {
    const state = makeState();
    state.idea.description = '';
    expect(validateProjectState(state).some((item) => item.path === 'idea.description')).toBe(true);
  });
});
