import { Wind, WavesArrowUp, CloudRain, Mountain, Droplet } from "lucide-react";

/** Disaster type registry — icon, Bangla label, palette tone */
export const DISASTER_TYPES = {
  cyclone: {
    label: "ঘূর্ণিঝড়",
    icon: Wind,
    iconBox: "bg-sky-50 text-sky-600",
    bar: "#0284c7",
    backendId: 1,
  },

  surge: {
    label: "জলোচ্ছ্বাস",
    icon: WavesArrowUp,
    iconBox: "bg-blue-50 text-blue-600",
    bar: "#2563eb",
    backendId: 2,
  },

  flood: {
    label: "বন্যা",
    icon: CloudRain,
    iconBox: "bg-cyan-50 text-cyan-700",
    bar: "#0e7490",
    backendId: 3,
  },

  erosion: {
    label: "নদীভাঙন",
    icon: Mountain,
    iconBox: "bg-amber-50 text-amber-700",
    bar: "#b45309",
    backendId: 4,
  },

  rainfall: {
    label: "অতিবৃষ্টি",
    icon: CloudRain,
    iconBox: "bg-indigo-50 text-indigo-700",
    bar: "#4f46e5",
    backendId: 5,
  },

  salinity: {
    label: "লবণাক্ততা",
    icon: Droplet,
    iconBox: "bg-emerald-50 text-emerald-700",
    bar: "#047857",
    backendId: 6,
  },

  waterlogging: {
    label: "পানিবন্দী",
    icon: WavesArrowUp,
    iconBox: "bg-violet-50 text-violet-700",
    bar: "#7c3aed",
    backendId: 7,
  },
};

export const disasterType = (key) => DISASTER_TYPES[key] || DISASTER_TYPES.other;

/** Report lifecycle status */
export const REPORT_STATUS = {
  PENDING: { label: "যাচাই অপেক্ষিত", chip: "bg-amber-50 text-amber-800 ring-1 ring-amber-200" },
  VERIFIED: { label: "যাচাইকৃত", chip: "bg-lagoon-50 text-lagoon-700 ring-1 ring-lagoon-200" },
  IN_PROGRESS: { label: "কার্যক্রম চলমান", chip: "bg-sky-50 text-sky-700 ring-1 ring-sky-200" },
  RESOLVED: { label: "সমাধান হয়েছে", chip: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  REJECTED: { label: "বাতিল", chip: "bg-slate-100 text-slate-500 ring-1 ring-slate-200" },
};

/** Severity scale */
export const SEVERITY = {
  LOW: { label: "নিম্ন", chip: "bg-sky-50 text-sky-700 ring-1 ring-sky-200", dot: "bg-sky-500" },
  MODERATE: { label: "মাঝারি", chip: "bg-amber-50 text-amber-800 ring-1 ring-amber-200", dot: "bg-amber-500" },
  HIGH: { label: "উচ্চ", chip: "bg-orange-50 text-orange-700 ring-1 ring-orange-200", dot: "bg-orange-500" },
  CRITICAL: { label: "সংকটাপন্ন", chip: "bg-red-50 text-red-700 ring-1 ring-red-200", dot: "bg-red-600" },
};
