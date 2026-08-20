import { useState } from 'react';
import { api } from '@shared/lib/api';
import { formatDate } from '@shared/lib/utils';
import { useAuth } from '@shared/context/AuthContext';
import { useToast } from '@shared/context/ToastContext';
import { useAsync } from '@shared/hooks/useAsync';
import { PageHeader } from '@shared/components/PageHeader';
import { ConfirmDialog } from '@shared/components/ConfirmDialog';
import { Card } from '@shared/components/ui/Card';
import { Badge } from '@shared/components/ui/Badge';
import { Button } from '@shared/components/ui/Button';
import { Input, Select } from '@shared/components/ui/Field';
import { EmptyState, ErrorState, LoadingState } from '@shared/components/ui/States';

const roleOptions = [
  { value: 'user', label: 'Foydalanuvchi' },
  { value: 'admin', label: 'Admin' },
];

export default function Users() {
  const { user: me } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const { data, loading, error, refetch } = useAsync(() => api.get('/users').then((r) => r.data), []);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const users = (data || []).filter((u) => {
    const q = search.trim().toLowerCase();
    return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const patch = async (id, payload) => {
    setBusy(true);
    try {
      await api.patch(`/users/${id}`, payload);
      toast('Yangilandi');
      refetch();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await api.delete(`/users/${deleting._id}`);
      toast('Foydalanuvchi o‘chirildi');
      setDeleting(null);
      refetch();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Foydalanuvchilar" subtitle="Rollarni boshqarish va bloklash" />

      <div className="mb-4 max-w-sm">
        <Input placeholder="Ism yoki email bo‘yicha qidirish..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : users.length === 0 ? (
        <EmptyState title="Foydalanuvchi topilmadi" />
      ) : (
        <Card className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Foydalanuvchi</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Holat</th>
                <th className="px-4 py-3">Ro‘yxatdan o‘tgan</th>
                <th className="px-4 py-3 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const self = u._id === me._id;
                return (
                  <tr key={u._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{u.name} {self && <span className="text-xs text-slate-400">(siz)</span>}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      {self ? (
                        <Badge tone="bg-indigo-50 text-indigo-700 ring-indigo-200">Admin</Badge>
                      ) : (
                        <Select
                          className="w-40"
                          disabled={busy}
                          options={roleOptions}
                          value={u.role}
                          onChange={(e) => patch(u._id, { role: e.target.value })}
                        />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={u.isActive ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-red-50 text-red-700 ring-red-200'}>
                        {u.isActive ? 'Faol' : 'Bloklangan'}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {!self && (
                          <>
                            <Button variant="ghost" size="sm" disabled={busy} onClick={() => patch(u._id, { isActive: !u.isActive })}>
                              {u.isActive ? 'Bloklash' : 'Faollashtirish'}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => setDeleting(u)}>
                              O‘chirish
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      <ConfirmDialog
        open={!!deleting}
        loading={busy}
        message={`${deleting?.name} va uning barcha yozuvlari o‘chiriladi. Davom etilsinmi?`}
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
