import { CircleUser, HandHeart, LifeBuoy, Landmark, Radar, ShieldHalf } from "lucide-react";

/**
 * Role registry — labels, badge styling and avatar gradients.
 * Single source of truth for role display across the whole app.
 */
export const ROLES = {
  CITIZEN: {
    key: "CITIZEN",
    label: "নাগরিক",
    labelEn: "Citizen",
    icon: CircleUser,
    avatar: "from-sky-500 to-cyan-700",
    pill: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
    dot: "bg-sky-500",
  },
  COMMUNITY_VOLUNTEER: {
    key: "COMMUNITY_VOLUNTEER",
    label: "কমিউনিটি স্বেচ্ছাসেবক",
    labelEn: "Community Volunteer",
    icon: HandHeart,
    avatar: "from-emerald-500 to-teal-700",
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  RESPONDER: {
    key: "RESPONDER",
    label: "জরুরি উদ্ধারকারী",
    labelEn: "Emergency Responder",
    icon: LifeBuoy,
    avatar: "from-amber-500 to-orange-700",
    pill: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
    dot: "bg-amber-500",
  },
  LOCAL_AUTHORITY: {
    key: "LOCAL_AUTHORITY",
    label: "স্থানীয় প্রশাসন",
    labelEn: "Local Authority",
    icon: Landmark,
    avatar: "from-lagoon-500 to-cyan-800",
    pill: "bg-lagoon-50 text-lagoon-700 ring-1 ring-lagoon-200",
    dot: "bg-lagoon-500",
  },
  DISASTER_MANAGEMENT_OFFICER: {
    key: "DISASTER_MANAGEMENT_OFFICER",
    label: "দুর্যোগ ব্যবস্থাপনা কর্মকর্তা",
    labelEn: "Disaster Management Officer",
    icon: Radar,
    avatar: "from-cyan-600 to-blue-800",
    pill: "bg-cyan-50 text-cyan-800 ring-1 ring-cyan-200",
    dot: "bg-cyan-600",
  },
  SYSTEM_ADMINISTRATOR: {
    key: "SYSTEM_ADMINISTRATOR",
    label: "সিস্টেম প্রশাসক",
    labelEn: "System Administrator",
    icon: ShieldHalf,
    avatar: "from-slate-600 to-slate-800",
    pill: "bg-slate-100 text-slate-700 ring-1 ring-slate-300",
    dot: "bg-slate-500",
  },
};

export const roleOf = (role) => ROLES[role] || ROLES.CITIZEN;

/** Availability states used by volunteers & responders */
export const AVAILABILITY = {
  AVAILABLE: { label: "বর্তমানে উপলব্ধ", chip: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  ON_MISSION: { label: "মিশনে আছেন", chip: "bg-amber-50 text-amber-800 ring-1 ring-amber-200", dot: "bg-amber-500" },
  UNAVAILABLE: { label: "বর্তমানে অনুপলব্ধ", chip: "bg-slate-100 text-slate-600 ring-1 ring-slate-300", dot: "bg-slate-400" },
};
