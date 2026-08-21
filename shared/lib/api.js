import axios from 'axios';

export const TOKEN_KEY = 'hs_token';

/** Vite `base` (admin build i /admin/ ostida turadi) */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const appPath = () => location.pathname.slice(BASE.length) || '/';

/**
 * API manzili. VITE_API_URL ga `/api` qo'shishni unutish eng ko'p uchraydigan xato —
 * shuning uchun o'zi to'g'rilaydi:
 *   https://x.onrender.com      -> https://x.onrender.com/api
 *   https://x.onrender.com/api/ -> https://x.onrender.com/api
 *   (bo'sh)                     -> /api  (dev da vite proxy)
 */
function resolveBaseUrl(raw) {
  const url = (raw || '').trim().replace(/\/+$/, '');
  if (!url) return '/api';
  return url.endsWith('/api') ? url : `${url}/api`;
}

export const API_BASE_URL = resolveBaseUrl(import.meta.env.VITE_API_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  // Render bepul tarifi uyquga ketadi, birinchi so'rov ~50s davom etishi mumkin
  timeout: 45000,
  headers: { 'Content-Type': 'application/json' },
});

// har bir so'rovga token qo'shish
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Javob umuman kelmagan holatlar uchun tushunarli xabar */
function networkMessage(error) {
  if (error.response) return 'Kutilmagan xatolik';
  if (error.code === 'ECONNABORTED') return 'Server javob bermadi. Bir oz kuting va qayta urining.';
  return 'Serverga ulanib bo‘lmadi. API manzili yoki CORS sozlamasini tekshiring.';
}

// javobdan data ni ochish + xatoni bir xil shaklga keltirish
api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    const res = error.response;
    // token eskirgan -> login ga
    const path = appPath();
    if (res?.status === 401 && path !== '/login' && path !== '/register') {
      localStorage.removeItem(TOKEN_KEY);
      location.assign(`${BASE}/login`);
    }
    return Promise.reject({
      status: res?.status ?? 0,
      message: res?.data?.message || networkMessage(error),
      errors: res?.data?.errors || {},
    });
  }
);
