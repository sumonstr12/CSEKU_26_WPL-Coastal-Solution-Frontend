import { Routes, Route } from "react-router-dom";

import AuthRoutes from "./auth.routes";
import CitizenRoutes from "./citizen.routes";
import ResponderRoutes from "./responder.routes";
import AuthorityRoutes from "./authority.routes";
import OfficerRoutes from "./officer.routes";
import AdminRoutes from "./admin.routes";

import Home from "../pages/Home";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<Home />} />

      {/* Authentication */}
      <AuthRoutes />

      {/* Citizen */}
      <CitizenRoutes />

      {/* Volunteer / Responder */}
      <ResponderRoutes />

      {/* Local Authority */}
      <AuthorityRoutes />

      {/* Disaster Management Officer */}
      <OfficerRoutes />

      {/* System Administrator */}
      <AdminRoutes />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}