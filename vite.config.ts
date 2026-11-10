/// <reference types="vitest/config" />
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8')) as {
  version: string;
};

export default defineConfig(({ mode }) => ({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    react(),
    mode !== 'test' &&
      VitePWA({
        registerType: 'prompt',
        injectRegister: false,
        includeAssets: ['icon.svg'],
        manifest: {
          name: 'PASI-kalkylator',
          short_name: 'PASI',
          description: 'Räkna ut PASI (Psoriasis Area and Severity Index).',
          lang: 'sv',
          start_url: '.',
          scope: '.',
          display: 'standalone',
          background_color: '#f6f8f8',
          theme_color: '#1d6b66',
          icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,webmanifest}'],
          cleanupOutdatedCaches: true,
        },
      }),
  ],
  resolve:
    mode === 'test'
      ? {
          alias: {
            'virtual:pwa-register/react': fileURLToPath(
              new URL('./src/test/pwaRegisterMock.ts', import.meta.url),
            ),
          },
        }
      : undefined,
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
}));
