# Build

## Web / PWA

```bash
npm run build
```

Artefatos em `apps/web/dist/`:
- `index.html`
- `assets/*.js`, `assets/*.css`
- `manifest.webmanifest`
- `sw.js` e `workbox-*.js`
- `icons/icon-192.png`, `icons/icon-512.png`

## Desktop (Tauri)

Pré-requisitos no Linux: `webkit2gtk-4.1`, `gtk3`, `libayatana-appindicator3`, `librsvg2` e toolchain Rust.

```bash
npm run desktop:build
```

Artefatos em `apps/desktop/src-tauri/target/release/bundle/`:
- `deb/Prompt Orchestrator_1.0.0_amd64.deb`
- `rpm/Prompt Orchestrator-1.0.0-1.x86_64.rpm`
- `appimage/Prompt Orchestrator_1.0.0_amd64.AppImage`

### Instalação no Linux

```bash
sudo dpkg -i "Prompt Orchestrator_1.0.0_amd64.deb"   # Debian/Ubuntu
sudo rpm -i "Prompt Orchestrator-1.0.0-1.x86_64.rpm" # Fedora/RHEL
chmod +x "Prompt Orchestrator_1.0.0_amd64.AppImage" && ./"Prompt Orchestrator_1.0.0_amd64.AppImage"
```

### Dados e atualização

- Dados do aplicativo: diretório padrão da plataforma (`~/.local/share/com.promptorchestrator.app` no Linux).
- Atualização: o config do Tauri já reserva o mecanismo de updater; ativar com `tauri-plugin-updater` quando houver feed de releases assinado.
- Desinstalação: `sudo apt remove prompt-orchestrator` ou remover o AppImage.

### Windows/macOS

Os binários de Windows e macOS exigem toolchains de cross-compilação (MSVC / Xcode) e não podem ser gerados em Linux. A configuração `targets: "all"` já os inclui quando o build roda nessas plataformas.
