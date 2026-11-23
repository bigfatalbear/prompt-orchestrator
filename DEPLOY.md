# Deploy

## GitHub Pages

O workflow `.github/workflows/deploy.yml` roda a cada push em `main`:

1. `npm ci`
2. `npm run build`
3. upload de `apps/web/dist`
4. `actions/deploy-pages@v4`

Permissões necessárias: `contents: read`, `actions: read`, `pages: write`, `id-token: write`.
A permissão `actions: read` é obrigatória para o `deploy-pages` localizar o artifact.

Configure em **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## CI

`.github/workflows/ci.yml` valida lint, tipos, testes, build e a presença de manifest/Service Worker a cada push e PR.

## Local

```bash
npm run build
npm run preview   # http://localhost:4173
```
