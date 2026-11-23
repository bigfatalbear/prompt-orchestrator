# Arquitetura

## Visão geral

Monorepo npm workspaces com uma base de código compartilhada entre Web, PWA e Desktop.

```
apps/
  web/       Vite + React + PWA (app shell)
  desktop/   Tauri (wrapper nativo)
packages/
  types/          contratos TypeScript
  core/           catálogos, factory, Specification Engine
  rules-engine/   dependências, coerência, recomendações
  validation/     esquemas Zod e validação por etapa
  prompt-engine/  geração adaptativa do prompt
  storage/        IndexedDB, versões, exportadores
  ai/             AIProvider + motor determinístico
  ui/             design system e componentes
tests/            unit, integration, e2e
```

## Fluxo de dados

```
IDEIA → WIZARD → ProjectState → normalize → validate → dependencies
      → coherence → architecture → Specification → Prompt Engine → Prompt
```

O Prompt Engine **nunca** lê diretamente a interface. Ele consome somente `Specification`.

## Responsibility

- `core`: regras de negócio e catálogos. Não importa UI.
- `rules-engine`: análise de coerência e matriz de dependências.
- `validation`: contratos de entrada por etapa.
- `storage`: persistência local e exportação.
- `ai`: abstração de provedores; local-first por padrão.
- `ui`: componentes visuais sem regras de negócio.

## Estado

`ProjectState` contém: `project`, `idea`, `users`, `platforms`, `engineering`, `architecture`, `database`, `authentication`, `security`, `api`, `pwa`, `desktop`, `testing`, `deployment`, `git`, `ai`, `validation`, `generatedSpecification`, `generatedPrompt`, `metadata`.

`syncDerivedConfig` mantém os subobjetos derivados coerentes quando plataformas, engenharia ou nível mudam.

## IA

`AIProvider` expõe `generate()`, `analyze()`, `improve()` e `validate()`. O provedor determinístico é sempre disponível. Adapters externos devem ser registrados via `registerProvider()` e receber credenciais do host — nunca do código-fonte.
