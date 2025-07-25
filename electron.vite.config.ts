import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@core': resolve(__dirname, 'src/core'),
      },
    },
    build: {
      outDir: 'dist/electron/main',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/gui/main/index.ts'),
        },
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist/electron/preload',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/gui/preload/index.ts'),
        },
      },
    },
  },
  renderer: {
    root: 'src/gui/renderer',
    build: {
      outDir: 'dist/electron/renderer',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/gui/renderer/index.html'),
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src/gui/renderer'),
        '@components': resolve(__dirname, 'src/gui/renderer/components'),
        '@hooks': resolve(__dirname, 'src/gui/renderer/hooks'),
        '@pages': resolve(__dirname, 'src/gui/renderer/pages'),
        '@store': resolve(__dirname, 'src/gui/renderer/store'),
        '@core': resolve(__dirname, 'src/core'),
      },
    },
  },
});