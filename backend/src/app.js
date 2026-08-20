import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';
import { env } from './config/env.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export const app = express();

app.use(cors({ origin: env.clientUrl.split(',').map((s) => s.trim()), credentials: true }));
app.use(express.json({ limit: '1mb' }));
if (!env.isProd) app.use(morgan('dev'));

app.use('/api', routes);

/**
 * Production: build qilingan panellarni shu serverning o'zi tarqatadi.
 *   user/dist   -> /
 *   admin/dist  -> /admin
 * Build yo'q bo'lsa e'tiborsiz qoldiriladi (dev da har biri o'z portida ishlaydi).
 */
const serveSpa = (urlPath, dir) => {
  const indexFile = path.join(dir, 'index.html');
  if (!fs.existsSync(indexFile)) return false;
  app.use(urlPath, express.static(dir));
  app.get(urlPath === '/' ? '/*' : `${urlPath}/*`, (req, res, next) =>
    req.path.startsWith('/api') ? next() : res.sendFile(indexFile)
  );
  return true;
};

// tartib muhim: avval /admin, keyin /
const served = [
  serveSpa('/admin', path.join(projectRoot, 'admin/dist')) && 'admin -> /admin',
  serveSpa('/', path.join(projectRoot, 'user/dist')) && 'user -> /',
].filter(Boolean);
if (served.length) console.log(`✓ Static: ${served.join(', ')}`);

app.use(notFound);
app.use(errorHandler);
