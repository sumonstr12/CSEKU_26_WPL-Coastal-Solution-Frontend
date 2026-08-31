import { Route } from "react-router-dom";



export default function OfficerRoutes() {
  return (
    <Route path="/officer" element={<OfficerLayout />}>
      <Route path="dashboard" element={<OfficerDashboard />} />

      <Route path="incidents" element={<IncidentManagement />} />

      <Route
        path="incidents/:id"
        element={<IncidentReview />}
      />

      <Route
        path="incidents/:id/verify"
        element={<VerifyIncident />}
      />

      <Route
        path="incidents/:id/assign"
        element={<AssignResponder />}
      />

      <Route path="alerts" element={<PublishAlert />} />

      <Route path="analytics" element={<Analytics />} />
    </Route>
  );
}