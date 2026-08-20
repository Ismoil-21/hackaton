import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '@shared/lib/api';

const FILTER_KEYS = ['search', 'category', 'status', 'priority'];

/**
 * Ro'yxat + filter + qidiruv + sahifalash.
 * Holat URL query da saqlanadi -> sidebar havolalari, brauzer "orqaga" tugmasi
 * va havolani ulashish o'zi ishlaydi.
 */
export function useRequests({ scope = 'all', limit = 10 } = {}) {
  const [sp, setSp] = useSearchParams();
  const qs = sp.toString();

  const filters = useMemo(
    () => Object.fromEntries(FILTER_KEYS.map((k) => [k, sp.get(k) || ''])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [qs]
  );
  const page = Math.max(1, Number(sp.get('page')) || 1);
  const sort = useMemo(
    () => ({ sortBy: sp.get('sortBy') || 'createdAt', order: sp.get('order') === 'asc' ? 'asc' : 'desc' }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [qs]
  );

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0, limit });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reqId = useRef(0);

  const patchParams = useCallback(
    (patch, { resetPage = true, replace = false } = {}) => {
      setSp(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [k, v] of Object.entries(patch)) {
            if (v === '' || v === undefined || v === null) next.delete(k);
            else next.set(k, String(v));
          }
          if (resetPage) next.delete('page');
          return next;
        },
        { replace }
      );
    },
    [setSp]
  );

  const fetchData = useCallback(async () => {
    const id = ++reqId.current;
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit, ...sort, ...filters };
      if (scope === 'mine') params.mine = true;
      Object.keys(params).forEach((k) => params[k] === '' && delete params[k]);
      const res = await api.get('/requests', { params });
      if (id !== reqId.current) return; // eski javobni tashlab yuborish
      setItems(res.data);
      setMeta(res.meta);
    } catch (err) {
      if (id !== reqId.current) return;
      setError(err.message);
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  }, [page, limit, sort, filters, scope]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return {
    items, meta, loading, error, refetch: fetchData,
    filters, page, sort,
    // qidiruvda har bosilgan harf tarixni to'ldirmasligi uchun `replace`
    updateFilter: useCallback(
      (key, value) => patchParams({ [key]: value }, { replace: key === 'search' }),
      [patchParams]
    ),
    resetFilters: useCallback(() => patchParams(Object.fromEntries(FILTER_KEYS.map((k) => [k, '']))), [patchParams]),
    setPage: useCallback((p) => patchParams({ page: p > 1 ? p : '' }, { resetPage: false }), [patchParams]),
    setSort: useCallback((s) => patchParams(s), [patchParams]),
  };
}
