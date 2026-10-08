import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, CheckCheck, ChevronDown, CircleUser, House, LayoutDashboard, LogOut, Menu, Phone } from "lucide-react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { dateBn, timeAgoBn } from "../../utils/format";
import { roleOf } from "../../config/roleConfig";
import { findNavMeta } from "../../config/dashboardMenuConfig";
import { NOTIFICATION_CONFIG, formatBadge } from "../../config/notificationConfig";
import { kindOf } from "../../config/notificationKinds";
import { useNotifications } from "../../context/NotificationContext";
import ConfirmDialog from "./ConfirmDialog";
import { BrandMark } from "./Sidebar";
import { cn } from "../../utils/cn.js";

/**
 * Dashboard topbar — replaces the public navbar inside /dashboard.
 * LEFT: brand (→ public homepage) · RIGHT: profile dropdown + logout.
 */
export default function DashboardTopbar({ user, onOpenMobileNav, onLogout, pathname }) {
  const [dropOpen, setDropOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const navigate = useNavigate();
  const role = roleOf(user?.role);
  const meta = findNavMeta(pathname);
  const ref = useClickOutside(() => setDropOpen(false), dropOpen);
  const bellRef = useClickOutside(() => setBellOpen(false), bellOpen);
  const { items, unread, markAllRead, setRead } = useNotifications();
  const preview = items.slice(0, NOTIFICATION_CONFIG.dropdownLimit);
  const badge = formatBadge(unread, NOTIFICATION_CONFIG.caps.topbar);
  const labels = NOTIFICATION_CONFIG.labels;

  const openItem = async (n) => {
    setBellOpen(false);
    if (!n.read) {
      try {
        await setRead(n.id, true);
      } catch {
        /* ব্যাজ আগের সংখ্যায় ফিরে যাবে */
      }
    }
    navigate(NOTIFICATION_CONFIG.linksByKind[n.kind] || "/dashboard/notifications");
  };

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

            <div className="relative" ref={bellRef}>
              <button
                type="button"
                onClick={() => {
                  setDropOpen(false);
                  setBellOpen((v) => !v);
                }}
                className={cn("btn-icon relative", bellOpen && "bg-lagoon-50 text-lagoon-700")}
                aria-label={labels.aria}
                aria-expanded={bellOpen}
              >
                <Bell size={19} />
                {badge && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                    {badge}
                  </span>
                )}
              </button>

              {bellOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[min(22rem,calc(100vw-1.5rem))] animate-pop-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lift">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-bold text-slate-800">{labels.title}</p>
                    {unread > 0 && (
                      <button
                        type="button"
                        onClick={() => markAllRead().catch(() => {})}
                        className="inline-flex items-center gap-1 text-[12px] font-bold text-lagoon-700 hover:text-lagoon-800"
                      >
                        <CheckCheck size={14} />
                        {labels.markAll}
                      </button>
                    )}
                  </div>

                  {preview.length === 0 ? (
                    <p className="px-4 py-8 text-center text-[13px] font-medium text-slate-400">{labels.empty}</p>
                  ) : (
                    <ul className="max-h-[22rem] divide-y divide-slate-50 overflow-y-auto">
                      {preview.map((n) => {
                        const k = kindOf(n.kind);
                        return (
                          <li key={n.id}>
                            <button
                              type="button"
                              onClick={() => openItem(n)}
                              className={cn(
                                "flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-lagoon-50/50",
                                !n.read && "bg-lagoon-50/40"
                              )}
                            >
                              <span className={cn("mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", k.box)}>
                                <k.icon size={15} />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="flex items-center gap-1.5">
                                  <span className={cn("truncate text-[13px] font-bold", n.read ? "text-slate-600" : "text-slate-800")}>{n.title}</span>
                                  {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-lagoon-500" />}
                                </span>
                                <span className="mt-0.5 line-clamp-2 block text-[12px] leading-relaxed text-slate-500">{n.body}</span>
                                <span className="mt-1 block text-[11px] font-medium text-slate-400">{timeAgoBn(n.time)}</span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  <Link
                    to="/dashboard/notifications"
                    onClick={() => setBellOpen(false)}
                    className="block border-t border-slate-100 px-4 py-3 text-center text-[13px] font-bold text-lagoon-700 transition hover:bg-lagoon-50"
                  >
                    {labels.seeAll}
                  </Link>
                </div>
              )}
            </div>

            {/* profile dropdown */}
            <div className="relative" ref={ref}>
              <button
                onClick={() => {
                  setBellOpen(false);
                  setDropOpen((v) => !v);
                }}
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
