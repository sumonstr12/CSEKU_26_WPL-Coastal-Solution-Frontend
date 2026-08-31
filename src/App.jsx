import CitizenDashboard from "./pages/CitizenDashboard";
import ReportDisaster from "./pages/ReportDisaster";
import ReportConfirmation from "./pages/ReportConfirmation";
import MyReports from "./pages/MyReports";
import ReportDetails from "./pages/ReportDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";

function DisasterMap() {
  return (
    <main className="page">
      <h1>Disaster Map</h1>
      <p>View reported incidents on the disaster map.</p>
    </main>
  );
}

function Alerts() {
  return (
    <main className="page">
      <h1>Alerts & Warnings</h1>
      <p>View official disaster alerts and warnings.</p>
    </main>
  );
}

function Help() {
  return (
    <main className="page">
      <h1>Help / SOS</h1>
      <p>Emergency assistance and support.</p>
    </main>
  );
}
function ProtectedRoute({ children }) {
  const isAuthenticated =
    localStorage.getItem("isAuthenticated") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/report" element={<ReportDisaster />} />
        <Route path="/confirmation" element={<ReportConfirmation />} />
        <Route path="/reports" element={<MyReports />} />
        <Route
  path="/report-details"
  element={<ReportDetails />}
/>
        <Route path="/map" element={<DisasterMap />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;