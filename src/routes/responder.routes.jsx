import { Route } from "react-router-dom";


export default function ResponderRoutes() {
  return (
    <Route path="/responder" element={<ResponderLayout />}>
      <Route path="dashboard" element={<ResponderDashboard />} />
      <Route path="incidents" element={<AssignedIncidents />} />
      <Route path="incidents/:id" element={<IncidentDetails />} />
      <Route path="incidents/:id/update" element={<UpdateIncident />} />
      <Route path="actions" element={<ResponseActions />} />
    </Route>
  );
}