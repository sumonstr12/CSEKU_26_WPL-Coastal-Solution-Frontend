import { Link } from "react-router-dom";
import { LayoutDashboard, ShieldAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ROUTE_ROLES } from "../config/dashboardMenuConfig";

/**
 * Role guard — wraps dashboard routes. Access is derived from the
 * sidebar menu config: if a path isn't in a role's menu, that role
 * can never reach it here either.
 *
 * NOTE: this is UX layering only — the DRF backend remains the
 * real authorization boundary.
 */
export default function RoleBasedRoute({ path, roles, children }) {
  const { user } = useAuth();
  const allowed = roles || ROUTE_ROLES[path] || [];

  if (!allowed.includes(user?.role)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
          <ShieldAlert size={30} />
        </span>
        <h2 className="mt-4 text-lg font-bold text-slate-800">এই পাতায় আপনার প্রবেশাধিকার নেই</h2>
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-500">
          এই অংশটি অন্য ভূমিকার ব্যবহারকারীদের জন্য সংরক্ষিত। আপনার ভূমিকা অনুযায়ী শুধুমাত্র প্রাসঙ্গিক তথ্য ও কার্যক্রমই দেখানো হয়।
        </p>
        <Link to="/dashboard" className="btn-primary mt-6">
          <LayoutDashboard size={16} />
          আমার ড্যাশবোর্ডে ফিরুন
        </Link>
      </div>
    );
  }

  return children;
}
