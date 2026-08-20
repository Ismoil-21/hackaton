import { ApiError } from '../utils/ApiError.js';
import { domain } from '../../../shared/domain.js';

/**
 * Oddiy, dependency-siz validator.
 * rules = { email: ['required','email'], password: ['required', ['min',6]] }
 */
const checks = {
  required: (v) => (v === undefined || v === null || String(v).trim() === '' ? 'Majburiy maydon' : null),
  email: (v) => (!v || /^\S+@\S+\.\S+$/.test(v) ? null : 'Email formati noto‘g‘ri'),
  min: (v, n) => (!v || String(v).length >= n ? null : `Kamida ${n} ta belgi`),
  max: (v, n) => (!v || String(v).length <= n ? null : `Ko‘pi bilan ${n} ta belgi`),
};

export const validate = (rules) => (req, _res, next) => {
  const errors = {};
  for (const [field, list] of Object.entries(rules)) {
    for (const rule of list) {
      const [name, arg] = Array.isArray(rule) ? rule : [rule];
      const msg = checks[name](req.body[field], arg);
      if (msg) { errors[field] = msg; break; }
    }
  }
  if (Object.keys(errors).length) return next(ApiError.badRequest('Ma’lumotlar noto‘g‘ri', errors));
  next();
};

/** domain.fields asosida metadata ni tozalaydi va tekshiradi */
export function normalizeMetadata(raw = {}, { partial = false } = {}) {
  const errors = {};
  const out = {};

  for (const f of domain.fields) {
    const has = Object.prototype.hasOwnProperty.call(raw, f.key);
    if (partial && !has) continue;

    let value = raw[f.key];
    const empty = value === undefined || value === null || value === '';

    if (f.required && empty) { errors[`metadata.${f.key}`] = `${f.label} majburiy`; continue; }
    if (empty) { out[f.key] = f.type === 'checkbox' ? false : ''; continue; }

    if (f.type === 'number') {
      const n = Number(value);
      if (Number.isNaN(n)) { errors[`metadata.${f.key}`] = `${f.label} raqam bo‘lishi kerak`; continue; }
      if (f.min !== undefined && n < f.min) { errors[`metadata.${f.key}`] = `${f.label} ≥ ${f.min}`; continue; }
      value = n;
    } else if (f.type === 'checkbox') {
      value = value === true || value === 'true';
    } else {
      value = String(value).slice(0, 500);
    }
    out[f.key] = value;
  }

  return { metadata: out, errors };
}
