import { Route, Routes } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage";
import Dashboard from "../pages/dashboard/Dashboard";
import ReportsPage from "../pages/dashboard/ReportsPage";
import SheltersPage from "../pages/dashboard/SheltersPage";
import MapPage from "../pages/dashboard/MapPage";
import NotificationsPage from "../pages/dashboard/NotificationsPage";
import ReportDisasterPage from "../pages/dashboard/ReportDisasterPage";
import AvailabilityPage from "../pages/dashboard/AvailabilityPage";
import SectionPage from "../pages/dashboard/SectionPage";
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import "../assets/dashboard.css"

const GR = (path, element) => <RoleBasedRoute path={path}>{element}</RoleBasedRoute>;

/** All role-scoped dashboard routes in one declarative table */
const DASHBOARD_ROUTES = [
  { path: "my-reports", el: <ReportsPage mode="mine" /> },
  { path: "report-disaster", el: <ReportDisasterPage /> },
  { path: "reports", el: <ReportsPage mode="all" /> },
  { path: "community-reports", el: <ReportsPage mode="community" /> },
  { path: "shelters", el: <SheltersPage /> },
  { path: "map", el: <MapPage /> },
  { path: "notifications", el: <NotificationsPage /> },
  { path: "awareness", el: <SectionPage sectionKey="awareness" /> },
  { path: "assistance", el: <SectionPage sectionKey="assistance" /> },
  { path: "my-area", el: <SectionPage sectionKey="my-area" /> },
  { path: "availability", el: <AvailabilityPage /> },
  { path: "rescue-operations", el: <SectionPage sectionKey="rescue-operations" /> },
  { path: "missions", el: <SectionPage sectionKey="missions" /> },
  { path: "rescue-requests", el: <SectionPage sectionKey="rescue-requests" /> },
  { path: "verification", el: <SectionPage sectionKey="verification" /> },
  { path: "monitoring", el: <SectionPage sectionKey="monitoring" /> },
  { path: "risk-analysis", el: <SectionPage sectionKey="risk-analysis" /> },
  { path: "areas", el: <SectionPage sectionKey="areas" /> },
  { path: "users", el: <SectionPage sectionKey="users" /> },
  { path: "disaster-types", el: <SectionPage sectionKey="disaster-types" /> },
  { path: "rescue-teams", el: <SectionPage sectionKey="rescue-teams" /> },
  { path: "system-monitoring", el: <SectionPage sectionKey="system-monitoring" /> },
];

export default function AppRoutes() {
  return (
    <Routes>
      {/* public site */}
      <Route path="/" element={<HomePage />} />
      <Route path="/flogin" element={<LoginPage />} />
      <Route path="/fregister" element={<RegisterPage />} />

      {/* authenticated area — dashboard shell (single sidebar for all roles) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {DASHBOARD_ROUTES.map((r) => (
            <Route key={r.path} path={`/dashboard/${r.path}`} element={GR(`/dashboard/${r.path}`, r.el)} />
          ))}
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
