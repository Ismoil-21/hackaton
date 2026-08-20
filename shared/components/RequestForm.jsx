import { useEffect, useState } from 'react';
import { api } from '@shared/lib/api';
import { domain } from '@shared/domain.js';
import { useAuth } from '@shared/context/AuthContext';
import { useToast } from '@shared/context/ToastContext';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Field, Input, Select, Textarea, Checkbox } from './ui/Field';

const opts = (list) => list.map((i) => ({ value: i.value, label: i.label }));

/** domain.fields dan bo'sh metadata yasash */
const emptyMeta = () =>
  Object.fromEntries(domain.fields.map((f) => [f.key, f.type === 'checkbox' ? false : '']));

const initialForm = () => ({
  title: '',
  description: '',
  category: domain.defaults.category,
  priority: domain.defaults.priority,
  status: domain.defaults.status,
  assignedTo: '',
  metadata: emptyMeta(),
});

const fromDoc = (doc) => ({
  title: doc.title ?? '',
  description: doc.description ?? '',
  category: doc.category,
  priority: doc.priority,
  status: doc.status,
  assignedTo: doc.assignedTo?._id ?? '',
  metadata: { ...emptyMeta(), ...(doc.metadata || {}) },
});

/**
 * Create + Edit uchun bitta forma.
 * `record` berilsa edit rejimi.
 */
export function RequestForm({ open, onClose, record, onSaved, users = [] }) {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(record ? fromDoc(record) : initialForm());
    setErrors({});
  }, [open, record]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setMeta = (key, value) => setForm((f) => ({ ...f, metadata: { ...f.metadata, [key]: value } }));

  const validate = () => {
    const e = {};
    if (form.title.trim().length < 3) e.title = 'Kamida 3 ta belgi';
    if (form.title.trim().length > 140) e.title = 'Ko‘pi bilan 140 ta belgi';
    for (const f of domain.fields) {
      const v = form.metadata[f.key];
      if (f.required && (v === '' || v === null || v === undefined)) e[`metadata.${f.key}`] = `${f.label} majburiy`;
      if (f.type === 'number' && v !== '' && Number.isNaN(Number(v))) e[`metadata.${f.key}`] = 'Raqam kiriting';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...form };
      if (!isAdmin) { delete payload.status; delete payload.assignedTo; }
      const res = record
        ? await api.patch(`/requests/${record._id}`, payload)
        : await api.post('/requests', payload);
      toast(record ? 'Saqlandi' : `${domain.entity.one} yaratildi`);
      onSaved?.(res.data);
      onClose();
    } catch (err) {
      setErrors(err.errors || {});
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={record ? `${domain.entity.one}ni tahrirlash` : domain.entity.createLabel}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>Bekor qilish</Button>
          <Button form="request-form" type="submit" loading={saving}>{record ? 'Saqlash' : 'Yaratish'}</Button>
        </>
      }
    >
      <form id="request-form" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label={domain.titleLabel} error={errors.title} required>
            <Input value={form.title} onChange={(e) => set('title', e.target.value)} error={errors.title} placeholder={`${domain.titleLabel}...`} />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label={domain.descriptionLabel} error={errors.description}>
            <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Batafsil ma'lumot..." />
          </Field>
        </div>

        <Field label="Kategoriya">
          <Select options={opts(domain.categories)} value={form.category} onChange={(e) => set('category', e.target.value)} />
        </Field>

        <Field label="Muhimlik">
          <Select options={opts(domain.priorities)} value={form.priority} onChange={(e) => set('priority', e.target.value)} />
        </Field>

        {isAdmin && (
          <>
            <Field label="Status">
              <Select options={opts(domain.statuses)} value={form.status} onChange={(e) => set('status', e.target.value)} />
            </Field>
            <Field label="Mas'ul">
              <Select
                placeholder="Tayinlanmagan"
                options={users.map((u) => ({ value: u._id, label: `${u.name} (${u.email})` }))}
                value={form.assignedTo}
                onChange={(e) => set('assignedTo', e.target.value)}
              />
            </Field>
          </>
        )}

        {domain.fields.map((f) => {
          const err = errors[`metadata.${f.key}`];
          const value = form.metadata[f.key];
          if (f.type === 'checkbox') {
            return (
              <div key={f.key} className="flex items-end pb-2">
                <Checkbox label={f.label} checked={!!value} onChange={(e) => setMeta(f.key, e.target.checked)} />
              </div>
            );
          }
          return (
            <Field key={f.key} label={f.label} error={err} required={f.required}>
              {f.type === 'select' ? (
                <Select options={f.options || []} placeholder="Tanlang" value={value} onChange={(e) => setMeta(f.key, e.target.value)} error={err} />
              ) : (
                <Input
                  type={f.type === 'datetime' ? 'datetime-local' : f.type}
                  min={f.min}
                  placeholder={f.placeholder}
                  value={value}
                  onChange={(e) => setMeta(f.key, e.target.value)}
                  error={err}
                />
              )}
            </Field>
          );
        })}
      </form>
    </Modal>
  );
}
