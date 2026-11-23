# Desenvolvimento

## Requisitos

- Node.js 20+ (testado com 24)
- npm 11+
- Rust/Cargo 1.77+ (apenas para desktop)

## Setup

```bash
npm install
npm run dev
```

O Vite serve em `http://localhost:5173`. O Service Worker é registrado apenas em produção (build).

## Scripts

| Comando | Finalidade |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | build web/PWA |
| `npm run preview` | serve o build |
| `npm test` | Vitest (unit + integration) |
| `npm run test:e2e` | Playwright |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run desktop:dev` | Tauri dev |
| `npm run desktop:build` | instaladores |

## Convenções

- Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `perf:`, `build:`, `ci:`.
- Componentes em `packages/ui`; regras em `packages/core` e `packages/rules-engine`.
- Nenhuma regra de negócio dentro de componentes React.
- Todo módulo novo deve vir acompanhado de teste.
