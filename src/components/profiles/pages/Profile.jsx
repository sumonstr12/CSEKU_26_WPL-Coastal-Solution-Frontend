import { useEffect } from "react";
import ProfileView from "@/components/profiles/components/profile/ProfileView";

export default function ProfilePage() {
  useEffect(() => {
    document.title = "আমার প্রোফাইল | CoastalGuard BD";
  }, []);
  return <ProfileView />;
}
