'use client';

import { useState, useEffect, useCallback } from 'react';

export function usePolling<T>(fetcher: () => Promise<T>, intervalMs: number = 30000) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const result = await fetcher();
      setData(result);
    } catch (e) {
      console.error('Polling error:', e);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, intervalMs);
    return () => clearInterval(id);
  }, [refresh, intervalMs]);

  return { data, loading, refresh };
}
