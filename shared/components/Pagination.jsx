import { Button } from './ui/Button';

export function Pagination({ meta, onChange }) {
  if (meta.pages <= 1) return null;
  const { page, pages, total, limit } = meta;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      <p className="text-xs text-slate-500">{from}–{to} / {total}</p>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>Oldingi</Button>
        <span className="text-sm text-slate-600">{page} / {pages}</span>
        <Button variant="secondary" size="sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>Keyingi</Button>
      </div>
    </div>
  );
}
