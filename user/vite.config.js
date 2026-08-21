import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const shared = path.resolve(dir, '../shared');

export default defineConfig({
  /**
   * Odatda '/' — Vercel/Netlify da o'z domenida turadi.
   * Backend bitta portdan tarqatsa (npm run build:server) BUILD_BASE beriladi.
   */
  base: process.env.BUILD_BASE || '/',
  plugins: [react()],
  resolve: {
    alias: { '@shared': shared },
    // shared/ app root idan tashqarida — react nusxasi bitta bo'lishi uchun
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: { '/api': { target: 'http://localhost:5001', changeOrigin: true } },
    fs: { allow: [dir, shared] },
  },
});
