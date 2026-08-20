import { domain, toneOf } from '@shared/domain.js';
import { cx } from '@shared/lib/utils';

/**
 * stats: { total, byStatus }
 * Kartaga bosilganda status filtri qo'yiladi (sidebar bilan bir xil holatni boshqaradi).
 */
export function StatsCards({ stats, loading, activeStatus = '', onSelect }) {
  const cells = [
    { key: '', label: 'Jami', value: stats?.total ?? 0, tone: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
    ...domain.statuses.map((s) => ({
      key: s.value,
      label: s.label,
      value: stats?.byStatus?.[s.value] ?? 0,
      tone: toneOf(domain.statuses, s.value),
    })),
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cells.map((c) => {
        const active = activeStatus === c.key;
        return (
          <button
            key={c.key || 'all'}
            type="button"
            onClick={() => onSelect?.(c.key)}
            className={cx(
              'rounded-xl border bg-white p-4 text-left shadow-sm transition hover:border-slate-300 hover:shadow',
              active ? 'border-indigo-400 ring-1 ring-indigo-200' : 'border-slate-200'
            )}
          >
            <p className="truncate text-xs font-medium text-slate-500">{c.label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {loading ? <span className="inline-block h-7 w-10 animate-pulse rounded bg-slate-200" /> : c.value}
            </p>
            <span className={cx('mt-2 inline-block h-1 w-8 rounded-full ring-4', c.tone)} />
          </button>
        );
      })}
    </div>
  );
}
