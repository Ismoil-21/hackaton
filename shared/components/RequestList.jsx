import { Link } from 'react-router-dom';
import { domain, labelOf, toneOf } from '@shared/domain.js';
import { formatDate } from '@shared/lib/utils';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

function Actions({ item, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Link to={`/requests/${item._id}`}>
        <Button variant="ghost" size="sm">Ko‘rish</Button>
      </Link>
      <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>Tahrirlash</Button>
      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => onDelete(item)}>O‘chirish</Button>
    </div>
  );
}

/** Desktop da jadval, mobil da karta */
export function RequestList({ items, onEdit, onDelete, showOwner = false, onSort, sort }) {
  const sortable = (key, label) => (
    <button
      onClick={() => onSort?.({ sortBy: key, order: sort?.sortBy === key && sort?.order === 'desc' ? 'asc' : 'desc' })}
      className="inline-flex items-center gap-1 font-medium hover:text-slate-900"
    >
      {label}
      {sort?.sortBy === key && <span className="text-[10px]">{sort.order === 'desc' ? '▼' : '▲'}</span>}
    </button>
  );

  return (
    <>
      {/* desktop */}
      <Card className="hidden overflow-hidden md:block">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">{sortable('title', domain.titleLabel)}</th>
              {showOwner && <th className="px-4 py-3">Muallif</th>}
              <th className="px-4 py-3">Kategoriya</th>
              <th className="px-4 py-3">{sortable('status', 'Status')}</th>
              <th className="px-4 py-3">{sortable('priority', 'Muhimlik')}</th>
              <th className="px-4 py-3">{sortable('createdAt', 'Sana')}</th>
              <th className="px-4 py-3 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50">
                <td className="max-w-xs px-4 py-3">
                  <Link to={`/requests/${item._id}`} className="font-medium text-slate-900 hover:text-indigo-600">
                    {item.title}
                  </Link>
                  {item.assignedTo && <p className="text-xs text-slate-500">Mas'ul: {item.assignedTo.name}</p>}
                </td>
                {showOwner && <td className="px-4 py-3 text-slate-600">{item.userId?.name ?? '—'}</td>}
                <td className="px-4 py-3 text-slate-600">{labelOf(domain.categories, item.category)}</td>
                <td className="px-4 py-3"><Badge tone={toneOf(domain.statuses, item.status)}>{labelOf(domain.statuses, item.status)}</Badge></td>
                <td className="px-4 py-3"><Badge tone={toneOf(domain.priorities, item.priority)}>{labelOf(domain.priorities, item.priority)}</Badge></td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">{formatDate(item.createdAt)}</td>
                <td className="px-4 py-3"><Actions item={item} onEdit={onEdit} onDelete={onDelete} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* mobil */}
      <div className="flex flex-col gap-3 md:hidden">
        {items.map((item) => (
          <Card key={item._id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <Link to={`/requests/${item._id}`} className="font-medium text-slate-900">{item.title}</Link>
              <Badge tone={toneOf(domain.priorities, item.priority)}>{labelOf(domain.priorities, item.priority)}</Badge>
            </div>
            {item.description && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{item.description}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge tone={toneOf(domain.statuses, item.status)}>{labelOf(domain.statuses, item.status)}</Badge>
              <Badge>{labelOf(domain.categories, item.category)}</Badge>
              {showOwner && <span className="text-xs text-slate-500">{item.userId?.name}</span>}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
              <span className="text-xs text-slate-400">{formatDate(item.createdAt)}</span>
              <Actions item={item} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
