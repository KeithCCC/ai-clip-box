import { defineConfig } from 'vite';
import webExtension from 'vite-plugin-web-extension';

export default defineConfig({
  plugins: [
    webExtension({
      manifest: './manifest.json',
      watchFilePaths: ['src/**/*', 'public/**/*'],
      additionalInputs: ['src/popup.html'],
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '@shared': '../shared/src',
    },
  },
});
