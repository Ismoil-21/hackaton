import { cx } from '@shared/lib/utils';

export const Badge = ({ tone = 'bg-slate-100 text-slate-700 ring-slate-200', children, className }) => (
  <span className={cx('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset', tone, className)}>
    {children}
  </span>
);
