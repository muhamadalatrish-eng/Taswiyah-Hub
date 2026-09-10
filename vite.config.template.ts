import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

const API_URL = process.env.VITE_API_URL || 'http://localhost:3000';
const BASE_PATH = process.env.VITE_BASE_PATH || '/';
const PORT = parseInt(process.env.VITE_PORT || '5173');

export default defineConfig({
  plugins: [vue()],
  base: BASE_PATH,
  server: {
    port: PORT,
    host: 'localhost',
    strictPort: false,
    cors: true,
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'vue',
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
