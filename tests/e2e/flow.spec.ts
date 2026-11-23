import { expect, test } from '@playwright/test';

test('fluxo completo: criar projeto, preencher, gerar e exportar', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('PROMPT ORCHESTRATOR', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Criar meu primeiro projeto →' }).click();

  // Etapa 1 — ideia
  await page.getByPlaceholder('Ex.: Sistema de Gestão de CFTV').fill('Sistema de Ordens de Serviço');
  await page.getByPlaceholder('Conte o que o sistema deve fazer, como ele será usado e o que você espera alcançar.')
    .fill('Sistema para registrar ordens de serviço, acompanhar status, gerar orçamentos e emitir relatórios mensais para a equipe.');
  await page.getByPlaceholder('Ex.: pequenos ateliês').fill('Pequenos ateliês');
  await page.getByRole('button', { name: 'Continuar →' }).click();

  // Etapa 2 — plataformas
  await page.getByRole('button', { name: /Web App/ }).click();
  await page.getByRole('button', { name: /PWA/ }).first().click();
  await expect(page.getByText('Selecionadas: web, pwa')).toBeVisible();
  await page.getByRole('button', { name: 'Continuar →' }).click();

  // Etapa 3 — engenharia
  await expect(page.getByText('Testes automatizados')).toBeVisible();
  await page.getByRole('button', { name: 'Continuar →' }).click();

  // Etapa 4 — nível
  await page.getByRole('radio', { name: /Nível 4/ }).click();
  await page.getByRole('button', { name: 'Continuar →' }).click();

  // Etapa 5 — revisão
  await expect(page.getByText('Revisão', { exact: false }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Continuar →' }).click();

  // Etapa 6 — resultado
  await expect(page.getByText('Seu projeto está pronto')).toBeVisible();
  await expect(page.getByLabel('Editor do prompt')).toContainText('# PAPEL DO AGENTE');
  await page.getByRole('button', { name: 'Copiar prompt' }).click();
  await expect(page.getByText('Prompt copiado!')).toBeVisible();

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'JSON', exact: true }).first().click();
  expect((await download).suggestedFilename()).toMatch(/\.json$/);
});
