import { MapPin, SquarePen, Waves } from "lucide-react";
import { ROLE_CONFIG } from "@/components/profiles/config/roleConfig";
import { getInitials } from "@/components/profiles/lib/bn";
import { cn } from "@/components/profiles/lib/utils";
import RoleBadge from "./RoleBadge";
import StatusBadge from "./StatusBadge";
import { useProfile } from "@/components/profiles/hooks/useProfile";
function WaveStrip() {
  return (
    <svg
      className="absolute bottom-0 left-0 h-10 w-full text-white/95"
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 32c120-18 240-22 360-12s240 24 360 22 240-16 360-22 240-2 360 12v16H0Z"
        fill="currentColor"
        fillOpacity="0.32"
      />
      <path
        d="M0 40c160-14 320-16 480-6s320 20 480 18 320-18 480-16v12H0Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default function ProfileHeader({ user }) {
  const { openEdit } = useProfile();
  const config = ROLE_CONFIG[user.role];
  const status = user.profile?.availability_status;
  const locationName =
    user.district ?? user.profile?.administrative_area?.district;
  return (
    <header className="animate-rise-in overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05),0_16px_40px_-20px_rgba(13,148,136,0.25)]">
      {/* Coastal banner */}
      <div className="relative h-32 bg-linear-to-r from-teal-700 via-cyan-700 to-blue-800 sm:h-40">
        <div className="cg-waves absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(38rem_14rem_at_85%_-30%,rgba(255,255,255,0.22),transparent_60%)]" />
        <Waves
          className="absolute right-6 top-6 size-10 text-white/25 sm:size-14"
          strokeWidth={1.6}
        />
        <span className="absolute left-6 top-6 hidden rounded-full bg-white/12 px-3 py-1 text-[11px] font-semibold tracking-wide text-white/85 ring-1 ring-white/20 backdrop-blur-sm sm:inline-block">
          CoastalGuard BD — সদস্য প্রোফাইল
        </span>
        <WaveStrip />
      </div>

      <div className="px-5 pb-6 sm:px-8">
        <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
            {/* Avatar */}
            <div
              className={cn(
                "relative size-24 shrink-0 rounded-full bg-linear-to-br p-0.75 shadow-xl shadow-slate-900/15 ring-4 ring-white sm:size-28",
                config.avatar,
              )}
            >
              <div className="flex size-full items-center justify-center rounded-full bg-white">
                <span
                  className={cn(
                    "bg-linear-to-br bg-clip-text text-2xl font-bold text-transparent sm:text-3xl",
                    config.avatar,
                  )}
                >
                  {getInitials(user.full_name)}
                </span>
              </div>
              <span className="absolute bottom-1 right-1 size-4 rounded-full bg-emerald-500 ring-[3px] ring-white" />
            </div>

            {/* Identity */}
            <div className="min-w-0 pb-0.5">
              <h1 className="truncate text-2xl font-bold tracking-tight text-slate-800 sm:text-[28px]">
                {user.full_name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <RoleBadge role={user.role} />
                {config.showHeaderStatus && status ? (
                  <StatusBadge role={user.role} status={status} />
                ) : null}
              </div>
              {locationName ? (
                <p className="mt-2.5 flex items-center gap-1.5 text-sm font-medium text-slate-500">
                  <MapPin className="size-4 text-teal-600" strokeWidth={2.2} />
                  {locationName}, বাংলাদেশ
                </p>
              ) : null}
            </div>
          </div>

          {/* Edit action */}
          <div className="shrink-0 lg:pb-1">
            <button
              type="button"
              onClick={openEdit}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-teal-600 to-cyan-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-700/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-700/35 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/30 active:translate-y-0 sm:w-auto"
            >
              <SquarePen
                className="size-4 transition-transform duration-300 group-hover:-rotate-6"
                strokeWidth={2.2}
              />
              প্রোফাইল সম্পাদনা
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
