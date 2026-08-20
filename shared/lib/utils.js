export const cx = (...c) => c.filter(Boolean).join(' ');

const pad = (n) => String(n).padStart(2, '0');

/** 20.08.2026 19:16 */
export const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/** 20.08.2026 */
export const formatDay = (iso) => (iso ? formatDate(iso).split(' ')[0] : '—');

export const formatFieldValue = (field, value) => {
  if (value === undefined || value === null || value === '') return '—';
  if (field.type === 'checkbox') return value ? 'Ha' : 'Yo‘q';
  if (field.type === 'date') return formatDay(value);
  return String(value);
};
