import { env } from './env.js';

const clean = (s) => s.trim().replace(/\/$/, '');
const allowed = env.clientUrl.split(',').map(clean).filter(Boolean);

/** `https://*.vercel.app` kabi wildcard ni qo'llab-quvvatlaydi (preview deploy lar uchun) */
const toMatcher = (pattern) => {
  if (pattern === '*') return () => true;
  if (!pattern.includes('*')) return (origin) => origin === pattern;
  const rx = new RegExp(
    '^' + pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^.]*') + '$'
  );
  return (origin) => rx.test(origin);
};

const matchers = allowed.map(toMatcher);
const allowAll = allowed.length === 0;

if (allowAll)
  console.warn(
    '⚠ CLIENT_URL sozlanmagan — barcha origin larga ruxsat berilmoqda.\n' +
    '  Productionda quyidagicha qo‘ying:\n' +
    '  CLIENT_URL=https://sizning-user-panel.vercel.app,https://sizning-admin-panel.vercel.app'
  );

export const corsOptions = {
  origin(origin, cb) {
    // origin yo'q = same-origin, curl, server-to-server
    if (!origin) return cb(null, true);
    if (allowAll) return cb(null, true);
    if (matchers.some((m) => m(clean(origin)))) return cb(null, true);
    console.warn(`✗ CORS rad etildi: ${origin}\n  ruxsat etilganlar: ${allowed.join(', ')}`);
    cb(null, false);
  },
  credentials: true,
};

export const allowedOrigins = allowAll ? ['* (CLIENT_URL sozlanmagan)'] : allowed;
