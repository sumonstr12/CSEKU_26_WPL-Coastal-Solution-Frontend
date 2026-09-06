import { AuthProvider } from "../dashboard/context/AuthContext"; 
import AppRoutes from "../dashboard/routes/AppRoutes";

const DashboardRoute = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default DashboardRoute;