import { useAuth } from "../../context/AuthContext";
import CitizenDashboard from "./CitizenDashboard";
import VolunteerDashboard from "./VolunteerDashboard";
import ResponderDashboard from "./ResponderDashboard";
import AuthorityDashboard from "./AuthorityDashboard";
import DisasterOfficerDashboard from "./DisasterOfficerDashboard";
import AdminDashboard from "./AdminDashboard";

const BY_ROLE = {
  CITIZEN: CitizenDashboard,
  COMMUNITY_VOLUNTEER: VolunteerDashboard,
  RESPONDER: ResponderDashboard,
  LOCAL_AUTHORITY: AuthorityDashboard,
  DISASTER_MANAGEMENT_OFFICER: DisasterOfficerDashboard,
  SYSTEM_ADMINISTRATOR: AdminDashboard,
};

/** /dashboard — same shell for everyone, content switches by user.role */
export default function Dashboard() {
  const { user } = useAuth();
  const Component = BY_ROLE[user.role] || CitizenDashboard;
  return <Component user={user} />;
}

/** Consistent greeting banner across roles */
export function WelcomeBanner({ user, subtitle, extra }) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-lagoon-700 via-lagoon-600 to-sky-700 p-5 text-white sm:p-6">
      <div className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-36 w-36 rounded-full bg-sky-300/15 blur-2xl" />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-bold sm:text-2xl">স্বাগতম, {user.name}</h1>
          <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-lagoon-50/90 sm:text-sm">{subtitle}</p>
        </div>
        {extra}
      </div>
    </div>
  );
}
