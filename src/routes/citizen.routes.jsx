import { Route } from "react-router-dom";

export default function CitizenRoutes() {
  return (
    <Route path="/citizen" element={<CitizenLayout />}>
      <Route path="dashboard" element={<CitizenDashboard />} />
      <Route path="report" element={<CreateReport />} />
      <Route path="reports" element={<MyReports />} />
      <Route path="reports/:id" element={<ReportDetails />} />
      <Route path="alerts" element={<Alerts />} />
      <Route path="help" element={<HelpRequest />} />
      <Route path="profile" element={<Profile />} />
    </Route>
  );
}