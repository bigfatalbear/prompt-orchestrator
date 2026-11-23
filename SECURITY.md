# Segurança

## Princípios

- Local-first: dados ficam no IndexedDB do dispositivo; nenhum dado é enviado sem ação explícita.
- Nenhuma chave de API no código-fonte, no bundle ou no Git.
- Validação com Zod em todas as entradas estruturadas.
- Sanitização e proteção contra XSS no prompt gerado e nas mensagens de erro.
- CSP configurado no Tauri; recomenda-se CSP equivalente no servidor web.

## Chaves de IA

O adapter `createOpenAICompatibleProvider` recebe `getToken()` do host. O núcleo nunca armazena o token. Em desktop, use o keychain do sistema operacional; em web, um backend seguro.

## Dados locais

O banco usa `prompt-orchestrator` (IndexedDB). Não há sincronização automática com serviços externos. Exportações são geradas pelo próprio usuário.

## Responsável por reportar vulnerabilidades

Abra uma issue privada no repositório com descrição, impacto e passos de reprodução.
