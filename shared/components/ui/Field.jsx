import { cx } from '@shared/lib/utils';

const base =
  'w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ' +
  'placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:bg-slate-50';

export function Field({ label, error, hint, required, children }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      )}
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-red-600">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
}

export const Input = ({ error, className, ...p }) => (
  <input className={cx(base, error ? 'ring-red-400' : 'ring-slate-300', className)} {...p} />
);

export const Textarea = ({ error, className, ...p }) => (
  <textarea rows={4} className={cx(base, error ? 'ring-red-400' : 'ring-slate-300', className)} {...p} />
);

export const Select = ({ error, className, options = [], placeholder, ...p }) => (
  <select className={cx(base, 'pr-8', error ? 'ring-red-400' : 'ring-slate-300', className)} {...p}>
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((o) => (
      <option key={o.value} value={o.value}>{o.label}</option>
    ))}
  </select>
);

export const Checkbox = ({ label, className, ...p }) => (
  <label className={cx('flex items-center gap-2 text-sm text-slate-700', className)}>
    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" {...p} />
    {label}
  </label>
);
