# ADR 0001 — Decisões arquiteturais iniciais

## Contexto

Especificação pede Web + PWA + Desktop com uma única base de código, local-first e IA opcional.

## Decisões

1. **Monorepo npm workspaces** em vez de pnpm/turbo — evita dependências extras e funciona com Node puro.
2. **Pacotes como código-fonte TypeScript** com aliases no Vite/Vitest/tsc — elimina etapa de build de pacotes internos.
3. **Zustand** para estado — simples, sem boilerplate.
4. **IndexedDB via `idb`** — persistência local sem backend.
5. **Vite PWA + Workbox** — gera manifest e Service Worker reais no build.
6. **Tauri 2** — binários nativos com menor consumo que Electron.
7. **AIProvider determinístico por padrão** — garante funcionamento offline; adapters externos via registro.
8. **Permissão `actions: read` no deploy** — necessária para o `deploy-pages` encontrar o artifact (falha observada em projeto anterior).

## Consequências

- Build desktop de Windows/macOS depende de toolchains específicas e não é feito no CI Linux.
- Chaves de IA nunca entram no código; adapters recebem token do host.
- O prompt é gerado somente a partir da `Specification`, nunca da UI.
