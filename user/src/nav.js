import { domain, dotOf } from '@shared/domain.js';

/** Sidebar bo'limlari — statuslar domain config dan avtomatik chiqadi */
export const nav = [
  { items: [{ label: `Barcha ${domain.entity.many.toLowerCase()}`, to: '/' }] },
  {
    title: 'Holat bo‘yicha',
    items: domain.statuses.map((s) => ({
      label: s.label,
      to: '/',
      params: { status: s.value },
      tone: dotOf(domain.statuses, s.value),
    })),
  },
];
