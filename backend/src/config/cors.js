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

export const corsOptions = {
  origin(origin, cb) {
    // origin yo'q = same-origin, curl, server-to-server
    if (!origin) return cb(null, true);
    if (matchers.some((m) => m(clean(origin)))) return cb(null, true);
    console.warn(`✗ CORS rad etildi: ${origin} (ruxsat etilganlar: ${allowed.join(', ') || 'yo‘q'})`);
    cb(null, false);
  },
  credentials: true,
};

export const allowedOrigins = allowed;
