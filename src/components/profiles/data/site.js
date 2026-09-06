import {
  FileText,
  LifeBuoy,
  MapPinned,
  Tent,
  TriangleAlert,
  Users,
} from "lucide-react";
export const NAV_ITEMS = [
  {
    label: "হোম",
    path: "/",
  },
  {
    label: "দুর্যোগের খবর",
    path: "/disasters",
  },
  {
    label: "রিপোর্ট করুন",
    path: "/report",
  },
  {
    label: "আশ্রয়কেন্দ্র",
    path: "/shelters",
  },
  {
    label: "সহায়তা ও উদ্ধার",
    path: "/rescue",
  },
  {
    label: "মানচিত্র",
    path: "/map",
  },
  {
    label: "সচেতনতা",
    path: "/awareness",
  },
  {
    label: "আমাদের সম্পর্কে",
    path: "/about",
  },
];
export const SITE = {
  name: "CoastalGuard BD",
  tagline: "উপকূলীয় দুর্যোগ ব্যবস্থাপনা প্ল্যাটফর্ম",
  mission: "উপকূলীয় জনগণের জন্য নিরাপদ ও সচেতন বাংলাদেশ।",
  email: "contact@coastalguard-bd.org",
  phone: "+880 2 4104 0100",
  phoneBn: "+৮৮০ ২ ৪১০৪ ০১০০",
  emergencyBn: "৯৯৯",
  emergencyDigits: "999",
};
export const HOTLINE_ITEMS = [
  {
    label: "জাতীয় জরুরি সেবা",
    value: "৯৯৯",
    digits: "999",
  },
  {
    label: "দুর্যোগ তথ্য সহায়তা",
    value: "১০৯০",
    digits: "1090",
  },
  {
    label: "স্বাস্থ্য বাতায়ন",
    value: "১৬২৬৩",
    digits: "16263",
  },
];

/** Configurable community statistics — edit here, reflected everywhere */

export const COMMUNITY_STATS = [
  {
    id: "reports",
    value: "১,২৫০+",
    label: "নাগরিক রিপোর্ট",
    icon: FileText,
    tone: "teal",
  },
  {
    id: "volunteers",
    value: "৮৫০+",
    label: "সক্রিয় স্বেচ্ছাসেবক",
    icon: Users,
    tone: "orange",
  },
  {
    id: "shelters",
    value: "৩২০+",
    label: "আশ্রয়কেন্দ্র",
    icon: Tent,
    tone: "sky",
  },
  {
    id: "areas",
    value: "২৫+",
    label: "উপকূলীয় এলাকা",
    icon: MapPinned,
    tone: "green",
  },
];

/** Live status panel — configurable operational snapshot */
export const LIVE_STATS = [
  {
    id: "active-disasters",
    value: "৩",
    label: "সক্রিয় দুর্যোগ",
    icon: TriangleAlert,
    tone: "amber",
  },
  {
    id: "high-risk-areas",
    value: "৮",
    label: "উচ্চ ঝুঁকিপূর্ণ এলাকা",
    icon: MapPinned,
    tone: "red",
  },
  {
    id: "reports-24h",
    value: "১৪৭",
    label: "রিপোর্টকৃত ঘটনা (২৪ ঘণ্টা)",
    icon: FileText,
    tone: "teal",
  },
  {
    id: "active-shelters",
    value: "৩২০",
    label: "সক্রিয় আশ্রয়কেন্দ্র",
    icon: Tent,
    tone: "sky",
  },
  {
    id: "ongoing-rescue",
    value: "৬",
    label: "চলমান উদ্ধার কার্যক্রম",
    icon: LifeBuoy,
    tone: "green",
  },
];
export const CURRENT_ALERT = {
  title: "ঘূর্ণিঝড় সতর্কতা জারি",
  areas: ["খুলনা", "সাতক্ষীরা", "বাগেরহাট"],
  updated: "আজ সকাল ৯টা ৩০ মিনিট",
  source: "দুর্যোগ ব্যবস্থাপনা অধিদপ্তর",
};
