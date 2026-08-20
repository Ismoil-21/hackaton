import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/context/AuthContext';
import { APP_NAME } from '@shared/domain.js';
import { AuthLayout } from './AuthLayout';
import { Button } from '@shared/components/ui/Button';
import { Field, Input } from '@shared/components/ui/Field';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (form.name.trim().length < 2) err.name = 'Kamida 2 ta belgi';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Email formati noto‘g‘ri';
    if (form.password.length < 6) err.password = 'Kamida 6 ta belgi';
    if (form.password !== form.confirm) err.confirm = 'Parollar mos emas';
    setErrors(err);
    setMessage('');
    if (Object.keys(err).length) return;

    setLoading(true);
    try {
      const { name, email, password } = form;
      await register({ name, email, password });
      navigate('/', { replace: true });
    } catch (e2) {
      setErrors(e2.errors || {});
      setMessage(e2.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Ro‘yxatdan o‘tish" subtitle={`${APP_NAME} da yangi hisob yarating`}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        {message && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{message}</div>}

        <Field label="Ism" error={errors.name} required>
          <Input value={form.name} onChange={set('name')} error={errors.name} placeholder="Ismingiz" />
        </Field>
        <Field label="Email" error={errors.email} required>
          <Input type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="siz@example.com" />
        </Field>
        <Field label="Parol" error={errors.password} required>
          <Input type="password" autoComplete="new-password" value={form.password} onChange={set('password')} error={errors.password} placeholder="••••••" />
        </Field>
        <Field label="Parolni tasdiqlang" error={errors.confirm} required>
          <Input type="password" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} placeholder="••••••" />
        </Field>

        <Button type="submit" loading={loading} className="w-full">Ro‘yxatdan o‘tish</Button>

        <p className="text-center text-sm text-slate-500">
          Hisobingiz bormi? <Link to="/login" className="font-medium text-indigo-600 hover:underline">Kirish</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
