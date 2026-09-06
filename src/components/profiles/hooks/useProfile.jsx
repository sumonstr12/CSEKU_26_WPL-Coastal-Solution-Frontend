import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { profileService } from "@/components/profiles/services/profileService";
const ProfileContext = createContext(null);
export const DEFAULT_ROLE = "COMMUNITY_VOLUNTEER";
const TOAST_ICON = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
};
const TOAST_ICON_CLASS = {
  success: "text-emerald-500",
  error: "text-rose-500",
  info: "text-sky-500",
};
export function ProfileProvider({ children }) {
  const [role, setRole] = useState(DEFAULT_ROLE);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const showToast = useCallback((message, kind = "info") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({
      id: Date.now(),
      message,
      kind,
    });
    toastTimer.current = setTimeout(() => setToast(null), 3600);
  }, []);
  const load = useCallback(async (target) => {
    setLoading(true);
    setError(null);
    try {
      const res = await profileService.getProfile(target);
      setProfile(res.data);
    } catch {
      setError("load_failed");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load(role);
  }, [role, load]);
  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );
  const switchRole = useCallback(
    (next) => {
      if (next === role) return;
      setEditOpen(false);
      setRole(next);
    },
    [role],
  );
  const reload = useCallback(() => {
    void load(role);
  }, [role, load]);
  const openEdit = useCallback(() => {
    if (profile && !loading) setEditOpen(true);
  }, [profile, loading]);
  const closeEdit = useCallback(() => setEditOpen(false), []);
  const saveProfile = useCallback(
    async (payload) => {
      setSaving(true);
      try {
        const res = await profileService.updateProfile(role, payload);
        setProfile(res.data);
        setEditOpen(false);
        showToast("প্রোফাইল সফলভাবে আপডেট হয়েছে।", "success");
        return true;
      } catch {
        showToast("প্রোফাইল আপডেট করা যায়নি। আবার চেষ্টা করুন।", "error");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [role, showToast],
  );
  const value = useMemo(
    () => ({
      profile,
      role,
      loading,
      error,
      saving,
      editOpen,
      reload,
      switchRole,
      openEdit,
      closeEdit,
      saveProfile,
      showToast,
    }),
    [
      profile,
      role,
      loading,
      error,
      saving,
      editOpen,
      reload,
      switchRole,
      openEdit,
      closeEdit,
      saveProfile,
      showToast,
    ],
  );
  const ToastIcon = toast ? TOAST_ICON[toast.kind] : null;
  return (
    <ProfileContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-20 z-120 flex justify-center px-4"
      >
        {toast && ToastIcon && (
          <div
            key={toast.id}
            className="animate-toast-in pointer-events-auto flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white/95 py-2.5 pl-3 pr-4 shadow-xl shadow-slate-900/10 backdrop-blur-md"
          >
            <ToastIcon
              className={`size-5 shrink-0 ${TOAST_ICON_CLASS[toast.kind]}`}
              strokeWidth={2.2}
            />
            <p className="text-sm font-medium text-slate-700">
              {toast.message}
            </p>
          </div>
        )}
      </div>
    </ProfileContext.Provider>
  );
}
export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within <ProfileProvider>");
  return ctx;
}
