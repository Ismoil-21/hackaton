import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/context/AuthContext';
import { APP_NAME } from '@shared/domain.js';
import { AuthLayout } from './AuthLayout';
import { Button } from '@shared/components/ui/Button';
import { Field, Input } from '@shared/components/ui/Field';

export default function Login({ showRegister = true, title = 'Tizimga kirish' }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Email formati noto‘g‘ri';
    if (form.password.length < 6) err.password = 'Kamida 6 ta belgi';
    setErrors(err);
    setMessage('');
    if (Object.keys(err).length) return;

    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from || '/', { replace: true });
    } catch (e2) {
      setErrors(e2.errors || {});
      setMessage(e2.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={title} subtitle={`${APP_NAME} hisobingizga kiring`}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        {message && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{message}</div>}

        <Field label="Email" error={errors.email} required>
          <Input type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="siz@example.com" />
        </Field>

        <Field label="Parol" error={errors.password} required>
          <Input type="password" autoComplete="current-password" value={form.password} onChange={set('password')} error={errors.password} placeholder="••••••" />
        </Field>

        <Button type="submit" loading={loading} className="w-full">Kirish</Button>

        {showRegister && (
          <p className="text-center text-sm text-slate-500">
            Hisobingiz yo‘qmi? <Link to="/register" className="font-medium text-indigo-600 hover:underline">Ro‘yxatdan o‘tish</Link>
          </p>
        )}
        <p className="rounded-lg bg-slate-50 px-3 py-2 text-center text-xs text-slate-500">
          Demo: admin@demo.uz / admin123 &nbsp;•&nbsp; ali@demo.uz / user123
        </p>
      </form>
    </AuthLayout>
  );
}
