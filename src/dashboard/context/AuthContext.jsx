import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";

/**
 * Auth context — the single source of truth for the signed-in user.
 * Backed by authService (currently mock; swap to DRF endpoints).
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | authed | guest

  useEffect(() => {
    let mounted = true;
    authService.me().then((u) => {
      if (!mounted) return;
      setUser(u);
      setStatus(u ? "authed" : "guest");
    });
    return () => (mounted = false);
  }, []);

  const login = useCallback(async (phoneRaw, password) => {
    const u = await authService.login(phoneRaw, password);
    setUser(u);
    setStatus("authed");
    return u;
  }, []);

  const loginWithRole = useCallback(async (role) => {
    const u = await authService.loginWithRole(role);
    setUser(u);
    setStatus("authed");
    return u;
  }, []);

  const register = useCallback(async (payload) => {
    const u = await authService.register(payload);
    setUser(u);
    setStatus("authed");
    return u;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setStatus("guest");
  }, []);

  /** Patch the in-session user (e.g. availability toggle) and persist. */
  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      authService.updateSession(patch);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ user, status, isAuthed: status === "authed", login, loginWithRole, register, logout, updateUser }),
    [user, status, login, loginWithRole, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
