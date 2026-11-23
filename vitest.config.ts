import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@po/types': `${root}packages/types/src/index.ts`,
      '@po/core': `${root}packages/core/src/index.ts`,
      '@po/rules-engine': `${root}packages/rules-engine/src/index.ts`,
      '@po/validation': `${root}packages/validation/src/index.ts`,
      '@po/prompt-engine': `${root}packages/prompt-engine/src/index.ts`,
      '@po/storage': `${root}packages/storage/src/index.ts`,
      '@po/ai': `${root}packages/ai/src/index.ts`,
      '@po/ui': `${root}packages/ui/src/index.ts`,
    },
  },
  test: {
    environment: 'node',
    setupFiles: ['tests/setup.ts'],
    include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],
    coverage: { reporter: ['text', 'html'] },
  },
});
