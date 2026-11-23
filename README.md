# Prompt Orchestrator

> Transforme uma ideia em uma especificação profissional pronta para agentes de IA.

Plataforma local-first que conduz uma ideia informal por um Wizard de 6 etapas, valida a configuração, detecta incoerências, gera uma especificação estruturada e entrega um prompt executável para agentes de desenvolvimento (Cursor, Claude, ChatGPT, Gemini, Lovable etc.).

## Recursos

- **Wizard progressivo** com autosave e recuperação de sessão.
- **15 exemplos** em categorias como Finanças, CFTV, CRM, ERP, Estoque e Igreja.
- **Tradutor de tecnicismos** — cada opção técnica tem explicação em linguagem simples.
- **5 níveis de potência** com cores progressivas (azul → roxo).
- **Rules Engine** independente: dependências, conflitos e recomendações.
- **Specification Engine** — pipeline normalização → validação → coerência → arquitetura → spec.
- **Prompt Engine adaptativo** — só inclui seções relevantes à configuração.
- **Editor de prompt** com copiar, pesquisar, desfazer/refazer, preview Markdown e exportação TXT/MD/JSON/YAML.
- **Projetos, histórico de versões, duplicação, renomeação e restauração.**
- **PWA instalável** com Service Worker, cache e modo offline.
- **Desktop** com Tauri (deb, rpm e AppImage no Linux).
- **IA opcional**: motor determinístico local funciona sem internet; adapters externos são plugins.

## Executar

```bash
npm install
npm run dev          # http://localhost:5173
```

## Testar

```bash
npm test             # 24 testes unitários e de integração
npm run test:e2e     # Playwright (fluxo completo de ponta a ponta)
npm run typecheck
npm run lint
```

## Build

```bash
npm run build              # Web/PWA em apps/web/dist
npm run desktop:build      # Instaladores em apps/desktop/src-tauri/target/release/bundle
```

## Documentação

[Arquitetura](ARCHITECTURE.md) · [Desenvolvimento](DEVELOPMENT.md) · [Build](BUILD.md) · [Deploy](DEPLOY.md) · [Segurança](SECURITY.md) · [Testes](TESTING.md) · [Contribuindo](CONTRIBUTING.md) · [Changelog](CHANGELOG.md) · [Decisões](docs/adr/0001-decisoes-arquiteturais.md)

## Licença

MIT.
