import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMenuForRole } from "../../config/dashboardMenuConfig";
import { dashboardService } from "../../services/dashboardService";
import DashboardTopbar from "./DashboardTopbar";
import Sidebar from "./Sidebar";
import { cn } from "../../utils/cn.js";


export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("cgbd.sidebar") === "collapsed");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [badges, setBadges] = useState({});

  const menu = getMenuForRole(user?.role);

  useEffect(() => {
    localStorage.setItem("cgbd.sidebar", collapsed ? "collapsed" : "expanded");
  }, [collapsed]);

  /* close drawer + scroll to top on navigation */
  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  /* sidebar badge counts (notifications, pending queues, …) */
  useEffect(() => {
    let on = true;
    dashboardService.getBadgeCounts(user.role).then((d) => on && setBadges(d)).catch(() => {});
    return () => (on = false);
  }, [user?.role, location.pathname]);

  return (
    <div className="min-h-screen">
      <DashboardTopbar
        user={user}
        pathname={location.pathname}
        unreadCount={badges.notifications || 0}
        onOpenMobileNav={() => setMobileOpen(true)}
        onLogout={logout}
      />

      <Sidebar
        menu={menu}
        user={user}
        badges={badges}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <main className={cn("min-h-screen pt-16 transition-[padding] duration-300 ease-out", collapsed ? "lg:pl-[76px]" : "lg:pl-72")}>
        <div key={location.pathname} className="mx-auto w-full max-w-[1380px] animate-fade-up px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet context={{ badges }} />
        </div>
      </main>
    </div>
  );
}
