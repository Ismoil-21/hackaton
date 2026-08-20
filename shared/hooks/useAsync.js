import { useCallback, useEffect, useState } from 'react';

/** Bitta so'rov uchun: { data, loading, error, refetch } */
export function useAsync(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(() => {
    setLoading(true);
    setError(null);
    return fn()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, deps);

  useEffect(() => { run(); }, [run]);

  return { data, loading, error, refetch: run, setData };
}
