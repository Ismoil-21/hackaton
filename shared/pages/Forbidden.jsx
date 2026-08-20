import { useAuth } from '@shared/context/AuthContext';
import { Button } from '@shared/components/ui/Button';

export default function Forbidden({ hint }) {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-5xl font-semibold text-slate-300">403</p>
      <p className="font-medium text-slate-700">Bu panelga kirish huquqingiz yo‘q</p>
      <p className="max-w-sm text-sm text-slate-500">
        {user?.email} — <span className="font-medium">{user?.role}</span>. {hint}
      </p>
      <Button variant="secondary" onClick={logout}>Boshqa hisob bilan kirish</Button>
    </div>
  );
}
