import {
  BadgeCheck,
  BookOpen,
  ChartColumn,
  FileText,
  House,
  Landmark,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  Map,
  MapPinned,
  Megaphone,
  Radar,
  Bell,
  Server,
  Siren,
  Target,
  UserCheck,
  Users,
  UsersRound,
  Warehouse,
  CircleUser,
  HandHeart,
  MonitorCheck,
  NotebookPen,
  Eye,
} from "lucide-react";

/**
 * ============================================================
 *  CoastalGuard BD — Role-based dashboard navigation config
 * ============================================================
 *  ONE sidebar component renders EVERY role from this config.
 *  Never hardcode role menus inside components.
 *
 *  item = { to, label, icon, badgeKey?, external?, end? }
 *  - external: navigates to the public site (Home)
 *  - badgeKey: resolved at runtime from dashboardService.getBadgeCounts
 */

const HOME_ITEM = { to: "/", label: "হোম", icon: House, external: true, end: true };
const DASHBOARD_ITEM = { to: "/dashboard", label: "ড্যাশবোর্ড", icon: LayoutDashboard, end: true };
const NOTIFICATIONS_ITEM = { to: "/dashboard/notifications", label: "বিজ্ঞপ্তি", icon: Bell, badgeKey: "notifications" };
const PROFILE_ITEM = { to: "/profile", label: "প্রোফাইল", icon: CircleUser };
const MAP_ITEM = { to: "/dashboard/map", label: "দুর্যোগ মানচিত্র", icon: Map };
const SHELTERS_ITEM = { to: "/dashboard/shelters", label: "আশ্রয়কেন্দ্র", icon: Warehouse };
const REPORTS_ITEM = { to: "/dashboard/reports", label: "দুর্যোগ রিপোর্ট", icon: FileText, badgeKey: "reports" };
const VERIFICATION_ITEM = { to: "/dashboard/verification", label: "রিপোর্ট যাচাই", icon: BadgeCheck, badgeKey: "verification" };
const AREAS_ITEM = { to: "/dashboard/areas", label: "প্রশাসনিক এলাকা", icon: Landmark };
const OPERATIONS_ITEM = { to: "/dashboard/rescue-operations", label: "উদ্ধার কার্যক্রম", icon: LifeBuoy, badgeKey: "operations" };

export const DASHBOARD_MENUS = {
  /* ---------------- CITIZEN ---------------- */
  CITIZEN: {
    quickActions: [{ to: "/dashboard/report-disaster", label: "দুর্যোগ রিপোর্ট করুন", icon: Megaphone, tone: "warning" }],
    sections: [
      { title: "প্রধান মেনু", items: [HOME_ITEM, DASHBOARD_ITEM] },
      {
        title: "আমার কার্যক্রম",
        items: [
          { to: "/dashboard/my-reports", label: "আমার রিপোর্ট", icon: NotebookPen, badgeKey: "myReports" },
          { to: "/dashboard/report-disaster", label: "দুর্যোগ রিপোর্ট করুন", icon: Megaphone },
          { to: "/dashboard/shelters", label: "নিকটস্থ আশ্রয়কেন্দ্র", icon: Warehouse },
          MAP_ITEM,
          { to: "/dashboard/awareness", label: "সচেতনতা", icon: BookOpen },
        ],
      },
      { title: "অ্যাকাউন্ট", items: [NOTIFICATIONS_ITEM, PROFILE_ITEM] },
    ],
  },

  /* ---------------- COMMUNITY VOLUNTEER ---------------- */
  COMMUNITY_VOLUNTEER: {
    quickActions: [
      { to: "/dashboard/availability", label: "Availability পরিবর্তন করুন", icon: UserCheck, tone: "primary" },
      { to: "/dashboard/community-reports", label: "কমিউনিটি রিপোর্ট দেখুন", icon: Eye, tone: "soft" },
    ],
    sections: [
      { title: "প্রধান মেনু", items: [HOME_ITEM, DASHBOARD_ITEM] },
      {
        title: "কার্যক্রম",
        items: [
          REPORTS_ITEM,
          { to: "/dashboard/community-reports", label: "কমিউনিটি রিপোর্ট", icon: Users, badgeKey: "community" },
          { to: "/dashboard/assistance", label: "সহায়তা কার্যক্রম", icon: HandHeart, badgeKey: "assistance" },
          SHELTERS_ITEM,
          MAP_ITEM,
          { to: "/dashboard/my-area", label: "আমার এলাকা", icon: MapPinned },
        ],
      },
      {
        title: "অ্যাকাউন্ট",
        items: [{ to: "/dashboard/availability", label: "Availability", icon: UserCheck }, NOTIFICATIONS_ITEM, PROFILE_ITEM],
      },
    ],
  },

  /* ---------------- RESPONDER ---------------- */
  RESPONDER: {
    quickActions: [
      { to: "/dashboard/rescue-requests", label: "জরুরি অনুরোধ দেখুন", icon: Siren, tone: "danger" },
      { to: "/dashboard/availability", label: "Availability আপডেট", icon: UserCheck, tone: "soft" },
    ],
    sections: [
      { title: "প্রধান মেনু", items: [HOME_ITEM, DASHBOARD_ITEM] },
      {
        title: "জরুরি সাড়া",
        items: [
          OPERATIONS_ITEM,
          { to: "/dashboard/missions", label: "Assigned Missions", icon: Target, badgeKey: "missions" },
          { to: "/dashboard/rescue-requests", label: "জরুরি অনুরোধ", icon: Siren, badgeKey: "requests" },
          REPORTS_ITEM,
          SHELTERS_ITEM,
          MAP_ITEM,
          { to: "/dashboard/my-area", label: "আমার এলাকা", icon: MapPinned },
        ],
      },
      {
        title: "অ্যাকাউন্ট",
        items: [{ to: "/dashboard/availability", label: "Availability", icon: UserCheck }, NOTIFICATIONS_ITEM, PROFILE_ITEM],
      },
    ],
  },

  /* ---------------- LOCAL AUTHORITY ---------------- */
  LOCAL_AUTHORITY: {
    quickActions: [{ to: "/dashboard/verification", label: "পেন্ডিং রিপোর্ট যাচাই করুন", icon: BadgeCheck, tone: "primary" }],
    sections: [
      { title: "প্রধান মেনু", items: [HOME_ITEM, DASHBOARD_ITEM] },
      {
        title: "স্থানীয় ব্যবস্থাপনা",
        items: [REPORTS_ITEM, VERIFICATION_ITEM, SHELTERS_ITEM, OPERATIONS_ITEM, MAP_ITEM, AREAS_ITEM],
      },
      { title: "অ্যাকাউন্ট", items: [NOTIFICATIONS_ITEM, PROFILE_ITEM] },
    ],
  },

  /* ---------------- DISASTER MANAGEMENT OFFICER ---------------- */
  DISASTER_MANAGEMENT_OFFICER: {
    quickActions: [{ to: "/dashboard/monitoring", label: "জনপদ সার্বিক চিত্র দেখুন", icon: Radar, tone: "primary" }],
    sections: [
      { title: "প্রধান মেনু", items: [HOME_ITEM, DASHBOARD_ITEM] },
      {
        title: "পর্যবেক্ষণ ও সমন্বয়",
        items: [
          { to: "/dashboard/monitoring", label: "দুর্যোগ পর্যবেক্ষণ", icon: Radar, badgeKey: "monitoring" },
          REPORTS_ITEM,
          VERIFICATION_ITEM,
          OPERATIONS_ITEM,
          SHELTERS_ITEM,
          MAP_ITEM,
          { to: "/dashboard/risk-analysis", label: "ঝুঁকি বিশ্লেষণ", icon: ChartColumn },
          AREAS_ITEM,
        ],
      },
      { title: "অ্যাকাউন্ট", items: [NOTIFICATIONS_ITEM, PROFILE_ITEM] },
    ],
  },

  /* ---------------- SYSTEM ADMINISTRATOR ---------------- */
  SYSTEM_ADMINISTRATOR: {
    quickActions: [{ to: "/dashboard/system-monitoring", label: "সিস্টেম অবস্থা দেখুন", icon: MonitorCheck, tone: "primary" }],
    sections: [
      { title: "প্রধান মেনু", items: [HOME_ITEM, DASHBOARD_ITEM] },
      {
        title: "সিস্টেম ব্যবস্থাপনা",
        items: [
          { to: "/dashboard/users", label: "ব্যবহারকারী", icon: UsersRound },
          REPORTS_ITEM,
          { to: "/dashboard/disaster-types", label: "দুর্যোগের ধরন", icon: Layers },
          SHELTERS_ITEM,
          { to: "/dashboard/rescue-teams", label: "উদ্ধারকারী দল", icon: Users },
          AREAS_ITEM,
          VERIFICATION_ITEM,
          { to: "/dashboard/system-monitoring", label: "System Monitoring", icon: Server },
        ],
      },
      { title: "অ্যাকাউন্ট", items: [NOTIFICATIONS_ITEM, PROFILE_ITEM] },
    ],
  },
};

/** Flat list of all menu items for a role */
export const getMenuForRole = (role) => DASHBOARD_MENUS[role] || DASHBOARD_MENUS.CITIZEN;

/**
 * Route access map — derived from the menu config.
 * A dashboard path is allowed for a role only when the role's menu includes it.
 */
export const getRouteRoleMap = () => {
  const map = {};
  Object.entries(DASHBOARD_MENUS).forEach(([role, menu]) => {
    menu.sections.forEach((section) =>
      section.items.forEach((item) => {
        if (item.external) return; // public route, no guard
        if (!map[item.to]) map[item.to] = new Set();
        map[item.to].add(role);
      })
    );
  });
  const out = {};
  Object.entries(map).forEach(([path, set]) => (out[path] = Array.from(set)));
  return out;
};

export const ROUTE_ROLES = getRouteRoleMap();

/** Resolve the current page title + parent from any path (used in topbar) */
export const findNavMeta = (pathname) => {
  for (const menu of Object.values(DASHBOARD_MENUS)) {
    for (const section of menu.sections) {
      for (const item of section.items) {
        const match = item.end ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`);
        if (item.to !== "/" && match) return { section: section.title, label: item.label, icon: item.icon };
      }
    }
  }
  if (pathname === "/dashboard" || pathname === "/") return { section: "প্রধান মেনু", label: "ড্যাশবোর্ড", icon: LayoutDashboard };
  return { section: "ড্যাশবোর্ড", label: "CoastalGuard BD", icon: LayoutDashboard };
};
