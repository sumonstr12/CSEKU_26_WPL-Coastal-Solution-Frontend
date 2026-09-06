import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { bn } from "../../utils/format";
import { cn } from "../../utils/cn.js";

/**
 * Single sidebar navigation entry.
 * - external items (Home) jump to the public site
 * - badge = numeric count from the badge map
 * - collapsed = icon-only with hover tooltip
 */
export default function SidebarItem({ item, collapsed, badge, onNavigate }) {
  const { icon: Icon, label, to, external, end } = item;

  /* Tooltip shown in collapsed mode */
  const tooltip = collapsed && (
    <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 animate-fade-in whitespace-nowrap rounded-lg bg-lagoon-900 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
      {label}
      <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-lagoon-900" />
    </span>
  );

  const badgeChip = badge > 0 && (
    <span className={cn("ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500/90 px-1.5 text-[10px] font-bold text-white", collapsed && "absolute -right-0.5 -top-0.5 ml-0 h-4 min-w-4 text-[9px]")}>
      {bn(badge > 99 ? "৯৯+" : badge)}
    </span>
  );

  if (external) {
    return (
      <Link
        to={to}
        onClick={onNavigate}
        title={collapsed ? label : undefined}
        className={cn(
          "group relative flex items-center gap-3 rounded-xl border border-dashed border-lagoon-300/70 px-3 py-2.5 text-sm font-semibold text-lagoon-700 transition-all duration-200 hover:border-lagoon-400 hover:bg-lagoon-50",
          collapsed ? "justify-center px-0" : ""
        )}
      >
        <span className="relative shrink-0">
          <Icon size={19} strokeWidth={2} />
        </span>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1 truncate">{label}</span>
            <span className="inline-flex items-center gap-0.5 rounded-md bg-lagoon-100/80 px-1.5 py-0.5 text-[10px] font-bold text-lagoon-600">
              <ArrowUpRight size={11} />
              পাবলিক
            </span>
          </>
        )}
        {tooltip}
      </Link>
    );
  }

  return (
    <NavLink
      to={to}
      end={end ?? to === "/dashboard"}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={({ isActive }) => cn("nav-item group", isActive && "active", collapsed && "justify-center px-0")}
    >
      {({ isActive }) => (
        <>
          <span className={cn("relative shrink-0", isActive ? "text-lagoon-700" : "text-slate-400 group-hover:text-lagoon-600")}>
            <Icon size={19} strokeWidth={2} />
            {collapsed && badgeChip}
          </span>
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1 truncate">{label}</span>
              {!collapsed && badgeChip}
            </>
          )}
          {tooltip}
        </>
      )}
    </NavLink>
  );
}
