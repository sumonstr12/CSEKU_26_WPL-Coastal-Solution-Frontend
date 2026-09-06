import { Routes, Route } from "react-router-dom";
import { ProfileProvider } from "@/components/profiles/hooks/useProfile";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileEditModal from "@/components/profiles/components/profile/ProfileEditModal";
import Home from "@/pages/Home";
import ProfilePage from "@/components/profiles/pages/Profile";


// was App.jsx (Profile Project)
export default function ProfileRoutes() {
  return (
    <div className="cg-mesh flex min-h-screen flex-col antialiased">
      <ProfileProvider>
        <Navbar />
        <main className="flex-1">
          <ProfilePage />
        </main>
        <Footer />
        <ProfileEditModal />
      </ProfileProvider>
    </div>
  );
}