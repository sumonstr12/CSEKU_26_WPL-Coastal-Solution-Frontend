import { Link } from "react-router-dom";
import { LifeBuoy, PanelLeftClose, PanelLeftOpen, Phone, WavesHorizontal, X } from "lucide-react";
import { roleOf, AVAILABILITY } from "../../config/roleConfig";
import SidebarItem from "./SidebarItem";
import { cn } from "../../utils/cn.js";

/** Brand block shared by drawer + collapsed hover cards */
export function BrandMark({ subtitle = true, onClick }) {
  return (
    <Link to="/" onClick={onClick} className="group flex items-center gap-2.5">
      <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-lagoon-500 to-lagoon-700 text-white shadow-md shadow-lagoon-600/25 transition-transform duration-300 group-hover:scale-105">
        <WavesHorizontal size={22} strokeWidth={2.2} />
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white bg-orange-500">
          <LifeBuoy size={9} />
        </span>
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-bold leading-tight text-slate-800">
          CoastalGuard <span className="text-lagoon-600">BD</span>
        </span>
        {subtitle && <span className="block truncate text-[10.5px] font-medium text-slate-400">উপকূলীয় দুর্যোগ ব্যবস্থাপনা</span>}
      </span>
    </Link>
  );
}

/**
 * THE one and only sidebar — every role renders from DASHBOARD_MENUS.
 * Desktop: fixed column (w-72 / w-20). Mobile: off-canvas drawer.
 */
export default function Sidebar({ menu, user, badges = {}, collapsed, onToggleCollapsed, mobileOpen, onCloseMobile }) {
  const role = roleOf(user?.role);
  const availability = user?.availability ? AVAILABILITY[user.availability] : null;

  const body = (isDrawer) => (
    <div className="flex h-full min-h-0 flex-col">
      {/* drawer-only header (desktop logo lives in the topbar) */}
      {isDrawer ? (
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-4">
          <BrandMark onClick={onCloseMobile} />
          <button onClick={onCloseMobile} className="btn-icon">
            <X size={19} />
          </button>
        </div>
      ) : (
        <div className="px-3 pt-3">
          <button
            onClick={onToggleCollapsed}
            title={collapsed ? "সাইডবার বড় করুন" : "সাইডবার ছোট করুন"}
            className={cn(
              "flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-lagoon-700",
              collapsed && "justify-center px-0"
            )}
          >
            {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
            {!collapsed && "সাইডবার ছোট করুন"}
          </button>
        </div>
      )}

      {/* navigation */}
      <nav className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-4">
        {menu.sections.map((section, si) => (
          <div key={si}>
            {!collapsed ? (
              <p className="mb-1.5 px-3 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{section.title}</p>
            ) : (
              si > 0 && <div className="mx-auto mb-2.5 mt-1 h-px w-8 bg-slate-200" />
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <SidebarItem
                  key={item.to + item.label}
                  item={item}
                  collapsed={collapsed && !isDrawer}
                  badge={item.badgeKey ? badges[item.badgeKey] : 0}
                  onNavigate={isDrawer ? onCloseMobile : undefined}
                />
              ))}
            </div>
          </div>
        ))}

        {/* quick actions */}
        {(!collapsed || isDrawer) && menu.quickActions?.length > 0 && (
          <div>
            <p className="mb-1.5 px-3 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">দ্রুত কার্যক্রম</p>
            <div className="space-y-2 rounded-2xl bg-sand-50 p-2.5">
              {menu.quickActions.map((q) => {
                const tones = {
                  primary: "bg-lagoon-600 text-white hover:bg-lagoon-700 shadow-sm shadow-lagoon-600/25",
                  warning: "bg-amber-500 text-white hover:bg-amber-600 shadow-sm shadow-amber-500/25",
                  danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-500/25",
                  soft: "bg-white text-lagoon-700 border border-lagoon-200 hover:border-lagoon-400 hover:bg-lagoon-50",
                };
                return (
                  <Link
                    key={q.to + q.label}
                    to={q.to}
                    onClick={isDrawer ? onCloseMobile : undefined}
                    className={cn("flex items-center gap-2.5 rounded-xl px-1.5 py-1.5 text-[13px] font-bold transition active:scale-[0.98]", q.tone === "soft" ? "p-2" : "p-2.5", tones[q.tone || "soft"])}
                  >
                    <q.icon size={16} />
                    <span className="min-w-0 flex-1 truncate">{q.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* hotline + user card pinned to bottom */}
      <div className="border-t border-slate-100 px-3 py-3">
        {(!collapsed || isDrawer) && (
          <a href="tel:999" className="mb-3 flex items-center gap-3 rounded-xl bg-red-50 px-3.5 py-3 transition hover:bg-red-100/80">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <span className="absolute h-full w-full animate-ping-soft rounded-xl bg-red-300/50" />
              <Phone size={17} className="relative" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium text-red-400">জাতীয় জরুরি সেবা</span>
              <span className="block text-base font-bold leading-5 text-red-600">৯৯৯</span>
            </span>
          </a>
        )}

        <Link
          to="/profile"
          onClick={isDrawer ? onCloseMobile : undefined}
          title={collapsed && !isDrawer ? user?.name : undefined}
          className={cn(
            "group flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-2.5 transition hover:border-lagoon-300 hover:shadow-card",
            collapsed && !isDrawer && "justify-center border-transparent bg-transparent p-0 hover:shadow-none"
          )}
        >
          <span className={cn("relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-sm font-bold text-white", role.avatar)}>
            {user?.name?.slice(0, 1)}
            <span className={cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white", availability ? availability.dot : "bg-emerald-500")} />
          </span>
          {(!collapsed || isDrawer) && (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-bold text-slate-700 group-hover:text-lagoon-800">{user?.name}</span>
              <span className={cn("chip mt-0.5 px-1.5! py-0! text-[10px]!", role.pill)}>{role.label}</span>
            </span>
          )}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* desktop */}
      <aside
        className={cn(
          "fixed bottom-0 left-0 top-16 z-30 hidden border-r border-slate-200/80 bg-white transition-[width] duration-300 ease-out lg:block",
          collapsed ? "w-[76px]" : "w-72"
        )}
      >
        {body(false)}
      </aside>

      {/* mobile drawer */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", mobileOpen ? "" : "pointer-events-none")}>
        <div
          onClick={onCloseMobile}
          className={cn("absolute inset-0 bg-lagoon-950/45 backdrop-blur-[2px] transition-opacity duration-300", mobileOpen ? "opacity-100" : "opacity-0")}
        />
        <aside
          className={cn(
            "absolute bottom-0 left-0 top-0 w-[290px] max-w-[85vw] bg-white shadow-lift transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {body(true)}
        </aside>
      </div>
    </>
  );
}
