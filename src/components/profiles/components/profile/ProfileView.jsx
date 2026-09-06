import {
  Flag,
  KeyRound,
  LockKeyhole,
  MapPin,
  MapPinned,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useProfile } from "@/components/profiles/hooks/useProfile";
import {
  ACCOUNT_FIELDS,
  FIELD_META,
  PERSONAL_FIELDS,
  ROLE_CONFIG,
  ROLES,
} from "@/components/profiles/config/roleConfig";
import { isFieldEmpty, resolveFieldValue } from "@/components/profiles/lib/fields";
import { toBanglaDigits } from "@/components/profiles/lib/bn";
import { cn } from "@/components/profiles/lib/utils";
import AdministrativeAreaDisplay from "./AdministrativeAreaDisplay";
import ProfileCompletion from "./ProfileCompletion";
import ProfileErrorState from "./ProfileErrorState";
import ProfileField, { ProfileFieldGrid } from "./ProfileField";
import ProfileHeader from "./ProfileHeader";
import ProfileSection from "./ProfileSection";
import ProfileSkeleton from "./ProfileSkeleton";

/* ------------------------------------------------------------------ */
/* Demo role switcher                                                  */
/* ------------------------------------------------------------------ */

function RoleDemoSwitcher({ active, onSwitch }) {
  return (
    <div className="animate-fade-in mb-6 rounded-3xl border border-dashed border-teal-300/70 bg-teal-50/50 px-4 py-3.5 sm:px-5">
      <p className="flex items-center gap-2 text-[13px] font-semibold text-teal-900">
        <Sparkles className="size-4 shrink-0 text-teal-600" />
        ডেমো প্রিভিউ — ভূমিকা পরিবর্তন করে প্রতিটি রোলের প্রোফাইল দেখুন
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {ROLES.map((role) => {
          const config = ROLE_CONFIG[role];
          const Icon = config.icon;
          const isActive = role === active;
          return (
            <button
              key={role}
              type="button"
              onClick={() => onSwitch(role)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200",
                isActive
                  ? "bg-linear-to-r from-teal-600 to-cyan-700 text-white shadow-md shadow-teal-700/25"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-700",
              )}
            >
              <Icon className="size-3.5" strokeWidth={2.3} />
              {config.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section cards                                                       */
/* ------------------------------------------------------------------ */

function PersonalCard({ user }) {
  const config = ROLE_CONFIG[user.role];
  return (
    <ProfileSection
      title={config.personalTitle}
      icon={UserRound}
      description={config.personalDescription}
    >
      <ProfileFieldGrid user={user} keys={PERSONAL_FIELDS} />
    </ProfileSection>
  );
}
function RoleCard({ user }) {
  const config = ROLE_CONFIG[user.role];
  if (config.roleCardFields.length === 0) return null;
  const indigoTone =
    user.role === "SYSTEM_ADMINISTRATOR" || user.role === "LOCAL_AUTHORITY";
  return (
    <ProfileSection
      title={config.roleCardTitle}
      icon={config.roleCardIcon}
      description={config.roleCardDescription}
      tone={indigoTone ? "indigo" : "teal"}
    >
      <ProfileFieldGrid user={user} keys={config.roleCardFields} />
    </ProfileSection>
  );
}
function LocationCard({ user }) {
  const config = ROLE_CONFIG[user.role];
  const showDistrict = config.locationFields.includes("district");
  const showArea = config.locationFields.includes("administrative_area");
  const showAddress = config.locationFields.includes("address");
  const area = user.profile?.administrative_area ?? null;
  const areaVisible = showArea && !isFieldEmpty("administrative_area", area);
  const districtVisible =
    showDistrict && !isFieldEmpty("district", user.district);
  const addressVisible = showAddress && !isFieldEmpty("address", user.address);
  if (!areaVisible && !districtVisible && !addressVisible) return null;
  return (
    <ProfileSection
      title="অবস্থান"
      icon={MapPin}
      description="আপনার এলাকার প্রশাসনিক অবস্থান"
    >
      <div className="space-y-6">
        {(districtVisible || addressVisible) && (
          <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {districtVisible && (
              <ProfileField fieldKey="district" user={user} />
            )}
            {addressVisible && (
              <ProfileField
                fieldKey="address"
                user={user}
                className="sm:col-span-2"
              />
            )}
          </dl>
        )}
        {areaVisible && (
          <div>
            <div className="mb-2.5 flex items-center gap-1.5 text-[13px] font-medium text-slate-500">
              <MapPinned
                className="size-3.5 text-teal-600/80"
                strokeWidth={2.2}
              />
              {FIELD_META.administrative_area.label}
            </div>
            <AdministrativeAreaDisplay area={area} variant="rows" />
          </div>
        )}
      </div>
    </ProfileSection>
  );
}
function AccountCard({ user }) {
  const indigoTone = user.role === "SYSTEM_ADMINISTRATOR";
  return (
    <ProfileSection
      title="অ্যাকাউন্ট তথ্য"
      icon={ShieldCheck}
      description="ভূমিকা, সদস্যতা ও সুরক্ষা সামারি"
      tone={indigoTone ? "indigo" : "teal"}
    >
      <ProfileFieldGrid user={user} keys={ACCOUNT_FIELDS} />
    </ProfileSection>
  );
}
function SecurityCard() {
  const items = [
    {
      icon: LockKeyhole,
      text: "মোবাইল নম্বর, ইউজারনেম ও ভূমিকা পরিবর্তনযোগ্য নয়",
    },
    {
      icon: KeyRound,
      text: "পাসওয়ার্ড বা OTP কখনও কারো সাথে শেয়ার করবেন না",
    },
    {
      icon: Flag,
      text: "সন্দেহজনক কার্যকলাপ দেখলে প্রশাসককে জানান",
    },
  ];
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_-16px_rgba(13,148,136,0.18)] sm:p-6">
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
        <ShieldCheck className="size-5 text-teal-600" strokeWidth={2.1} />
        নিরাপত্তা ও গোপনীয়তা
      </h2>
      <ul className="mt-4 space-y-3">
        {items.map(({ icon: Icon, text }) => (
          <li
            key={text}
            className="flex items-start gap-2.5 text-[13px] leading-relaxed text-slate-600"
          >
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600 ring-1 ring-inset ring-teal-100">
              <Icon className="size-3.5" strokeWidth={2.2} />
            </span>
            {text}
          </li>
        ))}
      </ul>
    </section>
  );
}
function HotlineCard() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-amber-200/70 bg-linear-to-br from-amber-50 to-orange-50 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
      <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-amber-200/40 blur-2xl" />
      <h2 className="flex items-center gap-2 text-base font-bold text-amber-900">
        <PhoneCall className="size-5 text-amber-700" strokeWidth={2.1} />
        জরুরি সহায়তা
      </h2>
      <p className="mt-2 text-[13px] leading-relaxed text-amber-800/80">
        দুর্যোগকালীন জরুরি অবস্থায় জাতীয় জরুরি সেবায় কল করুন।
      </p>
      <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/80 px-3.5 py-2 text-lg font-bold tracking-wide text-amber-900 ring-1 ring-inset ring-amber-200">
        {toBanglaDigits(999)}
        <span className="text-xs font-medium text-amber-700/80">
          সার্বক্ষণিক, টোল-ফ্রি
        </span>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page view                                                           */
/* ------------------------------------------------------------------ */

export default function ProfileView() {
  const { profile, loading, error, role, switchRole } = useProfile();
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
      <RoleDemoSwitcher active={role} onSwitch={switchRole} />

      {error && !loading ? (
        <ProfileErrorState />
      ) : loading || !profile ? (
        <ProfileSkeleton />
      ) : (
        <div key={profile.role}>
          <ProfileHeader user={profile} />
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <PersonalCard user={profile} />
              <RoleCard user={profile} />
              <LocationCard user={profile} />
              <AccountCard user={profile} />
            </div>
            <aside className="space-y-6">
              <ProfileCompletion user={profile} />
              <SecurityCard />
              <HotlineCard />
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
