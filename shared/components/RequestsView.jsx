import { useCallback, useState } from 'react';
import { api } from '@shared/lib/api';
import { domain } from '@shared/domain.js';
import { useAuth } from '@shared/context/AuthContext';
import { useToast } from '@shared/context/ToastContext';
import { useRequests } from '@shared/hooks/useRequests';
import { useAsync } from '@shared/hooks/useAsync';
import { PageHeader } from './PageHeader';
import { Filters } from './Filters';
import { Pagination } from './Pagination';
import { RequestList } from './RequestList';
import { RequestForm } from './RequestForm';
import { ConfirmDialog } from './ConfirmDialog';
import { StatsCards } from './StatsCards';
import { Button } from './ui/Button';
import { EmptyState, ErrorState, LoadingState } from './ui/States';

/**
 * User va Admin dashboard uchun umumiy ko'rinish.
 * scope='mine' -> faqat o'z yozuvlari; 'all' -> hammasi (faqat admin ko'ra oladi)
 */
export function RequestsView({ scope = 'mine', title, subtitle, showOwner = false }) {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const list = useRequests({ scope });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const stats = useAsync(
    () => api.get('/requests/stats', { params: scope === 'mine' ? { mine: true } : {} }).then((r) => r.data),
    [scope]
  );
  const users = useAsync(
    () => (isAdmin ? api.get('/users').then((r) => r.data) : Promise.resolve([])),
    [isAdmin]
  );

  const refreshAll = useCallback(() => {
    list.refetch();
    stats.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.refetch, stats.refetch]);

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (item) => { setEditing(item); setFormOpen(true); };

  const confirmDelete = async () => {
    setDeletingBusy(true);
    try {
      await api.delete(`/requests/${deleting._id}`);
      toast('O‘chirildi');
      setDeleting(null);
      refreshAll();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setDeletingBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title={title ?? domain.entity.many}
        subtitle={subtitle}
        action={<Button onClick={openCreate}>+ {domain.entity.createLabel}</Button>}
      />

      <StatsCards
        stats={stats.data}
        loading={stats.loading}
        activeStatus={list.filters.status}
        onSelect={(status) => list.updateFilter('status', status)}
      />

      <Filters
        filters={list.filters}
        updateFilter={list.updateFilter}
        resetFilters={list.resetFilters}
        total={list.meta.total}
      />

      {list.loading ? (
        <LoadingState />
      ) : list.error ? (
        <ErrorState message={list.error} onRetry={list.refetch} />
      ) : list.items.length === 0 ? (
        <EmptyState
          title={`${domain.entity.many} topilmadi`}
          description="Filtrni o‘zgartiring yoki yangi yozuv qo‘shing."
          action={<Button onClick={openCreate}>+ {domain.entity.createLabel}</Button>}
        />
      ) : (
        <>
          <RequestList
            items={list.items}
            showOwner={showOwner}
            sort={list.sort}
            onSort={list.setSort}
            onEdit={openEdit}
            onDelete={setDeleting}
          />
          <Pagination meta={list.meta} onChange={list.setPage} />
        </>
      )}

      <RequestForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        record={editing}
        users={users.data || []}
        onSaved={refreshAll}
      />

      <ConfirmDialog
        open={!!deleting}
        loading={deletingBusy}
        message={`"${deleting?.title}" o‘chirilsinmi? Bu amalni qaytarib bo‘lmaydi.`}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
