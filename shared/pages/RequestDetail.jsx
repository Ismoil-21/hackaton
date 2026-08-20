import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '@shared/lib/api';
import { domain, labelOf, toneOf } from '@shared/domain.js';
import { formatDate, formatFieldValue } from '@shared/lib/utils';
import { useAuth } from '@shared/context/AuthContext';
import { useToast } from '@shared/context/ToastContext';
import { useAsync } from '@shared/hooks/useAsync';
import { Card } from '@shared/components/ui/Card';
import { Badge } from '@shared/components/ui/Badge';
import { Button } from '@shared/components/ui/Button';
import { Select } from '@shared/components/ui/Field';
import { ErrorState, LoadingState } from '@shared/components/ui/States';
import { RequestForm } from '@shared/components/RequestForm';
import { ConfirmDialog } from '@shared/components/ConfirmDialog';

const Row = ({ label, children }) => (
  <div className="flex justify-between gap-4 border-b border-slate-100 py-2 last:border-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-right text-sm font-medium text-slate-800">{children}</span>
  </div>
);

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const { data: item, loading, error, refetch, setData } = useAsync(() => api.get(`/requests/${id}`).then((r) => r.data), [id]);
  const users = useAsync(() => (isAdmin ? api.get('/users').then((r) => r.data) : Promise.resolve([])), [isAdmin]);

  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!item) return null;

  const patch = async (payload) => {
    setBusy(true);
    try {
      const res = await api.patch(`/requests/${id}`, payload);
      setData(res.data);
      toast('Yangilandi');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await api.delete(`/requests/${id}`);
      toast('O‘chirildi');
      navigate('/', { replace: true });
    } catch (err) {
      toast(err.message, 'error');
      setBusy(false);
    }
  };

  return (
    <>
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">← Orqaga</button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-xl font-semibold text-slate-900">{item.title}</h1>
              <div className="flex gap-2">
                <Badge tone={toneOf(domain.statuses, item.status)}>{labelOf(domain.statuses, item.status)}</Badge>
                <Badge tone={toneOf(domain.priorities, item.priority)}>{labelOf(domain.priorities, item.priority)}</Badge>
              </div>
            </div>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
              {item.description || 'Tavsif kiritilmagan.'}
            </p>

            {domain.fields.length > 0 && (
              <div className="mt-6">
                <h2 className="mb-2 text-sm font-semibold text-slate-700">Qo‘shimcha ma’lumot</h2>
                <div className="rounded-lg bg-slate-50 px-4 py-2">
                  {domain.fields.map((f) => (
                    <Row key={f.key} label={f.label}>{formatFieldValue(f, item.metadata?.[f.key])}</Row>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-2">
              <Button onClick={() => setEditOpen(true)}>Tahrirlash</Button>
              <Button variant="danger" onClick={() => setConfirmOpen(true)}>O‘chirish</Button>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <h2 className="mb-2 text-sm font-semibold text-slate-700">Ma’lumot</h2>
            <Row label="Kategoriya">{labelOf(domain.categories, item.category)}</Row>
            <Row label="Muallif">{item.userId?.name ?? '—'}</Row>
            <Row label="Mas'ul">{item.assignedTo?.name ?? 'Tayinlanmagan'}</Row>
            <Row label="Yaratilgan">{formatDate(item.createdAt)}</Row>
            <Row label="Yangilangan">{formatDate(item.updatedAt)}</Row>
          </Card>

          {isAdmin && (
            <Card className="p-5">
              <h2 className="mb-3 text-sm font-semibold text-slate-700">Admin boshqaruvi</h2>
              <div className="flex flex-col gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-600">Status</span>
                  <Select
                    disabled={busy}
                    options={domain.statuses.map((s) => ({ value: s.value, label: s.label }))}
                    value={item.status}
                    onChange={(e) => patch({ status: e.target.value })}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-600">Mas'ul</span>
                  <Select
                    disabled={busy || users.loading}
                    placeholder="Tayinlanmagan"
                    options={(users.data || []).map((u) => ({ value: u._id, label: u.name }))}
                    value={item.assignedTo?._id ?? ''}
                    onChange={(e) => patch({ assignedTo: e.target.value })}
                  />
                </label>
              </div>
            </Card>
          )}
        </div>
      </div>

      <RequestForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        record={item}
        users={users.data || []}
        onSaved={setData}
      />
      <ConfirmDialog
        open={confirmOpen}
        loading={busy}
        message={`"${item.title}" o‘chirilsinmi?`}
        onConfirm={remove}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}
