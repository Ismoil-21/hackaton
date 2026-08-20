import { Button } from './Button';

export const Spinner = ({ className = 'h-5 w-5' }) => (
  <span className={`inline-block animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600 ${className}`} />
);

export const LoadingState = ({ label = 'Yuklanmoqda...' }) => (
  <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
    <Spinner className="h-7 w-7" />
    <p className="text-sm">{label}</p>
  </div>
);

export const ErrorState = ({ message = 'Xatolik yuz berdi', onRetry }) => (
  <div className="flex flex-col items-center gap-3 py-16 text-center">
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">!</div>
    <p className="text-sm text-slate-600">{message}</p>
    {onRetry && <Button variant="secondary" size="sm" onClick={onRetry}>Qayta urinish</Button>}
  </div>
);

export const EmptyState = ({ title = 'Hozircha bo‘sh', description, action }) => (
  <div className="flex flex-col items-center gap-2 py-16 text-center">
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h9A2.5 2.5 0 0 1 17 5.5v9a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 14.5v-9ZM6 7h8v1.5H6V7Zm0 4h5v1.5H6V11Z" /></svg>
    </div>
    <p className="font-medium text-slate-700">{title}</p>
    {description && <p className="max-w-sm text-sm text-slate-500">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);
