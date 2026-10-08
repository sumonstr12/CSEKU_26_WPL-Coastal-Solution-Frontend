import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { NOTIFICATION_CONFIG } from "../config/notificationConfig";
import { useAuth } from "./AuthContext";
import { notificationService } from "../services/notificationService";

/**
 * সাইডবার ব্যাজ, টপবার ড্রপডাউন, বিজ্ঞপ্তি পেজ —
 * তিনটাই এই এক কনটেক্সট পড়ে। তাই পঠিত করলে সংখ্যা সাথে সাথে কমে।
 */
const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const role = user?.role;
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async (silent = false) => {
    if (!role) return;
    if (!silent) setLoading(true);
    setError(null);
    try {
      const { items: list, unread: count } = await notificationService.load(role);
      const rows = Array.isArray(list) ? list : [];
      setItems(rows);
      setUnread(Number(count) || 0);
      setLoaded(true);
      setLoading(false);
    } catch (e) {
      setError(e?.message || "বিজ্ঞপ্তি লোড করা যায়নি");
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    setLoaded(false);
    refresh(false);
    const wait = NOTIFICATION_CONFIG.pollMs;
    if (!wait) return undefined;
    const id = setInterval(() => refresh(true), wait);
    return () => clearInterval(id);
  }, [refresh]);

  const markAllRead = useCallback(async () => {
    const snapshot = items;
    const prevUnread = unread;
    setItems((rows) => rows.map((n) => ({ ...n, read: true })));
    setUnread(0);
    try {
      const next = await notificationService.markAll(role);
      if (Array.isArray(next)) setItems(next);
    } catch {
      setItems(snapshot);
      setUnread(prevUnread);
    }
  }, [items, unread, role]);

  const setRead = useCallback(async (id, read) => {
    const snapshot = items;
    const row = snapshot.find((n) => n.id === id);
    if (!row || Boolean(row.read) === Boolean(read)) return;
    setItems(snapshot.map((n) => (n.id === id ? { ...n, read } : n)));
    setUnread((n) => Math.max(0, n + (read ? -1 : 1)));
    try {
      await notificationService.setRead(role, id, read);
    } catch {
      setItems(snapshot);
      setUnread(snapshot.filter((n) => !n.read).length);
    }
  }, [items, role]);

  const toggleRead = useCallback((id) => {
    const row = items.find((n) => n.id === id);
    if (!row) return undefined;
    return setRead(id, !row.read);
  }, [items, setRead]);

  const value = useMemo(
    () => ({ items, unread, loading, error, loaded, refresh, markAllRead, setRead, toggleRead }),
    [items, unread, loading, error, loaded, refresh, markAllRead, setRead, toggleRead]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationProvider");
  return ctx;
}
