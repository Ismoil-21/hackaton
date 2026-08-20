import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const shared = path.resolve(dir, '../shared');

export default defineConfig(({ command }) => ({
  // build da /admin/ ostida turadi (backend static qilib bersa ham ishlaydi)
  base: command === 'build' ? '/admin/' : '/',
  plugins: [react()],
  resolve: { alias: { '@shared': shared } },
  server: {
    port: 5174,
    strictPort: true,
    proxy: { '/api': { target: 'http://localhost:5001', changeOrigin: true } },
    fs: { allow: [dir, shared] },
  },
}));
