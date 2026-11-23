# Testes

## Unitários e integração (Vitest)

```bash
npm test
```

Cobertura:
- `rules-engine` — coerência de nível, dependências de PWA/auth/desktop, ações de correção.
- `prompt-engine` — seções obrigatórias e adaptação (PWA, Desktop, Auth, API).
- `validation` — validação por etapa e estado completo.
- `specification` — pipeline, normalização, exemplos, níveis.
- `storage` — CRUD, versões, recuperação, exportadores.
- `ai` — provedor determinístico.
- integração — Wizard → Specification → Prompt → Exportação.

## E2E (Playwright)

```bash
npx playwright install chromium
npm run test:e2e
```

Fluxo validado: criar projeto → ideia → plataformas → engenharia → nível → revisão → geração → cópia → exportação JSON.

## Type e lint

```bash
npm run typecheck
npm run lint
```
