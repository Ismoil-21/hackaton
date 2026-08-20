import { cx } from '@shared/lib/utils';

export const Card = ({ className, children }) => (
  <div className={cx('rounded-xl border border-slate-200 bg-white shadow-sm', className)}>{children}</div>
);
