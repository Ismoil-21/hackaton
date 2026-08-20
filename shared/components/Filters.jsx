import { useEffect, useState } from 'react';
import { domain } from '@shared/domain.js';
import { Input, Select } from './ui/Field';
import { Button } from './ui/Button';

const opts = (list) => list.map((i) => ({ value: i.value, label: i.label }));

export function Filters({ filters, updateFilter, resetFilters, total }) {
  const [q, setQ] = useState(filters.search);
  const active = Object.values(filters).some(Boolean);

  // tashqaridan o'zgarsa (sidebar, filtr tozalash) inputni moslashtirish
  useEffect(() => { setQ(filters.search); }, [filters.search]);

  // yozayotganda debounce
  useEffect(() => {
    if (q === filters.search) return;
    const t = setTimeout(() => updateFilter('search', q), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Input placeholder="Qidirish (sarlavha, tavsif)..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select placeholder="Barcha kategoriya" options={opts(domain.categories)} value={filters.category} onChange={(e) => updateFilter('category', e.target.value)} />
        <Select placeholder="Barcha status" options={opts(domain.statuses)} value={filters.status} onChange={(e) => updateFilter('status', e.target.value)} />
        <Select placeholder="Barcha muhimlik" options={opts(domain.priorities)} value={filters.priority} onChange={(e) => updateFilter('priority', e.target.value)} />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-slate-500">Jami: {total}</p>
        {active && <Button variant="ghost" size="sm" onClick={resetFilters}>Filtrni tozalash</Button>}
      </div>
    </div>
  );
}
