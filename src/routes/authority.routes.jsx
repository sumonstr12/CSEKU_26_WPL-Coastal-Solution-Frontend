import { Route } from "react-router-dom";


export default function AuthorityRoutes() {
  return (
    <Route path="/authority" element={<AuthorityLayout />}>
      <Route path="dashboard" element={<AuthorityDashboard />} />
      <Route path="incidents" element={<Incidents />} />
      <Route path="map" element={<IncidentMap />} />
      <Route path="assignments" element={<Assignments />} />
      <Route path="resources" element={<Resources />} />
      <Route path="alerts" element={<Alerts />} />
    </Route>
  );
}