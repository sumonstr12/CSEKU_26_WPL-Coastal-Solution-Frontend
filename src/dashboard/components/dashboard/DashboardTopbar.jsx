import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, CircleUser, House, LayoutDashboard, LogOut, Menu, Phone } from "lucide-react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { dateBn } from "../../utils/format";
import { bn } from "../../utils/format";
import { roleOf } from "../../config/roleConfig";
import { findNavMeta } from "../../config/dashboardMenuConfig";
import ConfirmDialog from "./ConfirmDialog";
import { BrandMark } from "./Sidebar";
import { cn } from "../../utils/cn.js";

/**
 * Dashboard topbar — replaces the public navbar inside /dashboard.
 * LEFT: brand (→ public homepage) · RIGHT: profile dropdown + logout.
 */
export default function DashboardTopbar({ user, onOpenMobileNav, onLogout, unreadCount = 0, pathname }) {
  const [dropOpen, setDropOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const navigate = useNavigate();
  const role = roleOf(user?.role);
  const meta = findNavMeta(pathname);
  const ref = useClickOutside(() => setDropOpen(false), dropOpen);

  const menuItems = [
    { to: "/profile", label: "আমার প্রোফাইল", icon: CircleUser },
    { to: "/dashboard", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
    { to: "/", label: "হোম", icon: House },
  ];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="flex h-full items-center justify-between gap-3 px-3 sm:px-5">
          {/* left: hamburger + brand + page context */}
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-4">
            <button onClick={onOpenMobileNav} className="btn-icon lg:hidden" aria-label="মেনু খুলুন">
              <Menu size={20} />
            </button>
            <div className="shrink-0">
              <BrandMark />
            </div>
            <div className="hidden h-8 w-px bg-slate-200 md:block" />
            <div className="hidden min-w-0 items-center gap-2.5 md:flex">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-lagoon-50 text-lagoon-600">
                <meta.icon size={16} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">{meta.section}</p>
                <p className="truncate text-[13px] font-bold leading-4 text-slate-700">{meta.label}</p>
              </div>
            </div>
          </div>

          {/* right: date, hotline, bell, profile */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <span className="mr-1 hidden text-xs font-medium text-slate-400 xl:block">{dateBn()}</span>

            <a href="tel:999" className="mr-1 hidden items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100 sm:inline-flex" title="জাতীয় জরুরি সেবা">
              <Phone size={13} />
              ৯৯৯
            </a>

            <Link to="/dashboard/notifications" className="btn-icon relative" aria-label="বিজ্ঞপ্তি">
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                  {bn(unreadCount > 9 ? "৯+" : unreadCount)}
                </span>
              )}
            </Link>

            {/* profile dropdown */}
            <div className="relative" ref={ref}>
              <button
                onClick={() => setDropOpen((v) => !v)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border px-1.5 py-1.5 transition sm:px-2.5",
                  dropOpen ? "border-lagoon-300 bg-lagoon-50/60" : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                )}
              >
                <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br text-sm font-bold text-white", role.avatar)}>
                  {user?.name?.slice(0, 1)}
                </span>
                <span className="hidden text-left md:block">
                  <span className="block max-w-[130px] truncate text-[13px] font-bold leading-4 text-slate-700">{user?.name}</span>
                  <span className="block text-[11px] font-medium text-lagoon-600">{role.label}</span>
                </span>
                <ChevronDown size={15} className={cn("text-slate-400 transition-transform duration-200", dropOpen && "rotate-180")} />
              </button>

              {dropOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-60 animate-pop-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lift">
                  <div className="border-b border-slate-100 bg-linear-to-br from-lagoon-50/80 to-white px-4 py-3.5">
                    <p className="truncate text-sm font-bold text-slate-800">{user?.name}</p>
                    <p className="mt-0.5 truncate text-xs text-slate-400">{user?.phone}</p>
                    <span className={cn("chip mt-2", role.pill)}>
                      <role.icon size={11} />
                      {role.label}
                    </span>
                  </div>
                  <nav className="p-1.5">
                    {menuItems.map((m) => (
                      <Link
                        key={m.to}
                        to={m.to}
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-slate-600 transition hover:bg-lagoon-50 hover:text-lagoon-700"
                      >
                        <m.icon size={16} className="text-slate-400" />
                        {m.label}
                      </Link>
                    ))}
                    <div className="my-1.5 h-px bg-slate-100" />
                    <button
                      onClick={() => {
                        setDropOpen(false);
                        setConfirmLogout(true);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      লগআউট
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <ConfirmDialog
        open={confirmLogout}
        title="আপনি কি লগআউট করতে চান?"
        message="আপনার অসম্পন্ন কাজ সংরক্ষিত থাকবে। যেকোনো সময় আবার লগইন করতে পারবেন।"
        confirmLabel="লগআউট"
        cancelLabel="বাতিল"
        onCancel={() => setConfirmLogout(false)}
        onConfirm={() => {
          setConfirmLogout(false);
          onLogout();
          navigate("/login");
        }}
      />
    </>
  );
}
