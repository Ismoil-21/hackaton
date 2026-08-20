import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@shared/context/AuthContext';
import { APP_NAME } from '@shared/domain.js';
import { cx } from '@shared/lib/utils';
import { Button } from './ui/Button';

/**
 * nav = [{ title?, items: [{ label, to, params?, end?, icon?, badgeTone? }] }]
 * `params` — URL query (masalan { status: 'pending' }). Filtrlar URL da saqlanadi,
 * shuning uchun sidebar havolalari to'g'ridan-to'g'ri ro'yxatni filtrlaydi.
 */
function useIsActive() {
  const { pathname, search } = useLocation();
  const current = new URLSearchParams(search);

  return (item) => {
    if (pathname !== item.to) return false;
    const params = item.params ?? {};
    // "Barchasi" turidagi element: filtr qo'yilmagan bo'lsa aktiv
    if (Object.keys(params).length === 0) return !current.get('status');
    return Object.entries(params).every(([k, v]) => current.get(k) === String(v));
  };
}

const Dot = ({ tone }) => <span className={cx('h-2 w-2 shrink-0 rounded-full', tone ?? 'bg-slate-300')} />;

export function Sidebar({ nav, open, onClose, variant = 'user' }) {
  const { user, logout } = useAuth();
  const isActive = useIsActive();
  const isAdminApp = variant === 'admin';

  const linkTo = (item) => {
    const qs = new URLSearchParams(item.params ?? {}).toString();
    return { pathname: item.to, search: qs ? `?${qs}` : '' };
  };

  return (
    <>
      {/* mobil overlay */}
      {open && <div className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden" onClick={onClose} />}

      <aside
        className={cx(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform',
          'lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-4">
          <span className={cx('flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold text-white', isAdminApp ? 'bg-slate-900' : 'bg-indigo-600')}>
            {isAdminApp ? 'A' : 'HS'}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{APP_NAME}</p>
            <p className="text-xs text-slate-500">{isAdminApp ? 'Admin paneli' : 'Foydalanuvchi paneli'}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {nav.map((group, gi) => (
            <div key={gi} className={gi > 0 ? 'mt-6' : ''}>
              {group.title && (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{group.title}</p>
              )}
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = isActive(item);
                  return (
                    <NavLink
                      key={item.label}
                      to={linkTo(item)}
                      onClick={onClose}
                      className={cx(
                        'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition',
                        active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
                      )}
                    >
                      {item.tone ? <Dot tone={item.tone} /> : <span className="w-2" />}
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <div className="mb-2 px-1">
            <p className="truncate text-sm font-medium text-slate-800">{user?.name}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
          <Button variant="secondary" size="sm" className="w-full" onClick={logout}>Chiqish</Button>
        </div>
      </aside>
    </>
  );
}
