import { domain, dotOf } from '@shared/domain.js';

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
  { title: 'Tizim', items: [{ label: 'Foydalanuvchilar', to: '/users' }] },
];
