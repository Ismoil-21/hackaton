import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { APP_NAME } from '@shared/domain.js';
import { Sidebar } from './Sidebar';

export function Layout({ nav, variant = 'user' }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar nav={nav} variant={variant} open={open} onClose={() => setOpen(false)} />

      <div className="min-w-0 flex-1">
        {/* mobil topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="Menyu">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 5.5h14v1.5H3V5.5Zm0 4h14V11H3V9.5Zm0 4h14V15H3v-1.5Z" /></svg>
          </button>
          <span className="font-semibold text-slate-900">{APP_NAME}</span>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
