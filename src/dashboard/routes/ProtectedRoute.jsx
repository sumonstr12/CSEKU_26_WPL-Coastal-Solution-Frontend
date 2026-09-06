import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoaderCircle, WavesHorizontal } from "lucide-react";
import { useAuth } from "../context/AuthContext";

/** Full-screen brand loader used while the session is restored */
export function AuthLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-mist">
      <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-lagoon-500 to-lagoon-700 text-white shadow-lift">
        <WavesHorizontal size={28} />
        <span className="absolute inset-0 animate-ping-soft rounded-2xl bg-lagoon-400/40" />
      </span>
      <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
        <LoaderCircle size={16} className="animate-spin text-lagoon-600" />
        CoastalGuard BD লোড হচ্ছে...
      </p>
    </div>
  );
}

/** Requires an authenticated session; otherwise redirects to /login */
export default function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") return <AuthLoader />;
  if (status === "guest") return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return <Outlet />;
}
