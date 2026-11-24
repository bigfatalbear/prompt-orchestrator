import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const alias = {
  '@po/types': `${root}packages/types/src/index.ts`,
  '@po/core': `${root}packages/core/src/index.ts`,
  '@po/rules-engine': `${root}packages/rules-engine/src/index.ts`,
  '@po/validation': `${root}packages/validation/src/index.ts`,
  '@po/prompt-engine': `${root}packages/prompt-engine/src/index.ts`,
  '@po/storage': `${root}packages/storage/src/index.ts`,
  '@po/ai': `${root}packages/ai/src/index.ts`,
  '@po/ui': `${root}packages/ui/src/index.ts`,
};

export default defineConfig({
  base: '/prompt-orchestrator/',
  resolve: { alias },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Prompt Orchestrator',
        short_name: 'PromptOrch',
        description: 'Transforme uma ideia em uma especificação profissional pronta para agentes de IA.',
        theme_color: '#4f46e5',
        background_color: '#f8fafc',
        display: 'standalone',
        start_url: '/prompt-orchestrator/',
        scope: '/prompt-orchestrator/',
        lang: 'pt-BR',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
        shortcuts: [
          { name: 'Novo projeto', url: '/prompt-orchestrator/?new=1', description: 'Criar um novo projeto' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,webmanifest}'],
        navigateFallback: '/prompt-orchestrator/index.html',
      },
    }),
  ],
  build: { outDir: 'dist', sourcemap: false },
  server: { port: 5173 },
});
