import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Generic async data hook for dashboard sections.
 * Returns { data, loading, error, refetch } — drives skeletons,
 * error panels and retry behaviour consistently across the app.
 */
export function useDashboard(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const mounted = useRef(true);

  const load = useCallback(async (silent = false) => {
    if (!silent) setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fetcher();
      if (mounted.current) setState({ data, loading: false, error: null });
    } catch (error) {
      if (mounted.current) setState({ data: null, loading: false, error: error?.message || "তথ্য লোড করা যায়নি" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mounted.current = true;
    load();
    return () => (mounted.current = false);
  }, [load]);

  return { ...state, refetch: () => load(), silentRefetch: () => load(true), setData: (updater) => setState((s) => ({ ...s, data: typeof updater === "function" ? updater(s.data) : updater })) };
}

/** Smooth count-up animation for stat values (runs once per target change). */
export function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    const to = Number(target);
    if (!Number.isFinite(to)) return undefined;
    const from = 0;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return value;
}
