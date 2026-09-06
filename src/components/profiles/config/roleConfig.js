import {
  Activity,
  AtSign,
  BadgeCheck,
  Building2,
  CalendarCheck,
  CalendarDays,
  Clock3,
  HeartHandshake,
  Home,
  IdCard,
  Landmark,
  LifeBuoy,
  Mail,
  Map,
  MapPin,
  MapPinned,
  Phone,
  ShieldCheck,
  Siren,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import { ALL_DISTRICTS } from "@/components/profiles/data/administrativeAreas";
/* ------------------------------------------------------------------ */
/* Roles                                                               */
/* ------------------------------------------------------------------ */

export const ROLES = [
  "CITIZEN",
  "COMMUNITY_VOLUNTEER",
  "RESPONDER",
  "LOCAL_AUTHORITY",
  "DISASTER_MANAGEMENT_OFFICER",
  "SYSTEM_ADMINISTRATOR",
];
export const ROLE_CONFIG = {
  CITIZEN: {
    label: "নাগরিক",
    icon: UserRound,
    badge: "bg-sky-50 text-sky-700 ring-sky-200/80",
    avatar: "from-sky-500 via-cyan-500 to-teal-600",
    personalTitle: "নাগরিক তথ্য",
    personalDescription: "আপনার মৌলিক পরিচয় ও যোগাযোগের তথ্য",
    roleCardTitle: "নাগরিক তথ্য",
    roleCardIcon: UserRound,
    roleCardDescription: "",
    roleCardFields: [],
    locationFields: ["district", "administrative_area", "address"],
    showHeaderStatus: false,
    completionFields: [
      "full_name",
      "phone_number",
      "email",
      "date_of_birth",
      "district",
      "administrative_area",
      "address",
    ],
  },
  COMMUNITY_VOLUNTEER: {
    label: "কমিউনিটি স্বেচ্ছাসেবক",
    icon: HeartHandshake,
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200/80",
    avatar: "from-teal-500 via-emerald-500 to-cyan-600",
    personalTitle: "ব্যক্তিগত তথ্য",
    personalDescription: "আপনার মৌলিক পরিচয় ও যোগাযোগের তথ্য",
    roleCardTitle: "স্বেচ্ছাসেবক তথ্য",
    roleCardIcon: HeartHandshake,
    roleCardDescription: "প্রাতিষ্ঠানিক তথ্য ও প্রাপ্যতার অবস্থা",
    roleCardFields: ["organization", "availability_status"],
    locationFields: ["district", "administrative_area"],
    showHeaderStatus: true,
    completionFields: [
      "full_name",
      "phone_number",
      "email",
      "date_of_birth",
      "district",
      "organization",
      "administrative_area",
      "availability_status",
    ],
  },
  RESPONDER: {
    label: "উদ্ধারকর্মী",
    icon: LifeBuoy,
    badge: "bg-orange-50 text-orange-700 ring-orange-200/80",
    avatar: "from-amber-500 via-orange-500 to-red-500",
    personalTitle: "ব্যক্তিগত তথ্য",
    personalDescription: "আপনার মৌলিক পরিচয় ও যোগাযোগের তথ্য",
    roleCardTitle: "উদ্ধারকর্মীর তথ্য",
    roleCardIcon: LifeBuoy,
    roleCardDescription:
      "উদ্ধার কার্যক্রমের ধরন, প্রতিষ্ঠান ও দায়িত্বপ্রাপ্ত এলাকা",
    roleCardFields: [
      "responder_type",
      "organization",
      "availability_status",
      "administrative_areas",
    ],
    locationFields: ["district"],
    showHeaderStatus: true,
    completionFields: [
      "full_name",
      "phone_number",
      "email",
      "date_of_birth",
      "district",
      "responder_type",
      "organization",
      "availability_status",
      "administrative_areas",
    ],
  },
  LOCAL_AUTHORITY: {
    label: "স্থানীয় কর্তৃপক্ষ",
    icon: Landmark,
    badge: "bg-indigo-50 text-indigo-700 ring-indigo-200/80",
    avatar: "from-sky-600 via-indigo-500 to-blue-600",
    personalTitle: "ব্যক্তিগত তথ্য",
    personalDescription: "আপনার মৌলিক পরিচয় ও যোগাযোগের তথ্য",
    roleCardTitle: "স্থানীয় কর্তৃপক্ষের তথ্য",
    roleCardIcon: Landmark,
    roleCardDescription: "দাপ্তরিক পদবি, প্রতিষ্ঠান ও দায়িত্বপ্রাপ্ত এলাকা",
    roleCardFields: ["designation", "organization"],
    locationFields: ["district", "administrative_area"],
    showHeaderStatus: false,
    completionFields: [
      "full_name",
      "phone_number",
      "email",
      "district",
      "organization",
      "designation",
      "administrative_area",
    ],
  },
  DISASTER_MANAGEMENT_OFFICER: {
    label: "দুর্যোগ ব্যবস্থাপনা কর্মকর্তা",
    icon: TriangleAlert,
    badge: "bg-teal-50 text-teal-700 ring-teal-200/80",
    avatar: "from-teal-600 via-cyan-600 to-blue-700",
    personalTitle: "ব্যক্তিগত তথ্য",
    personalDescription: "আপনার মৌলিক পরিচয় ও যোগাযোগের তথ্য",
    roleCardTitle: "দুর্যোগ ব্যবস্থাপনা কর্মকর্তার তথ্য",
    roleCardIcon: TriangleAlert,
    roleCardDescription: "দাপ্তরিক তথ্য ও কার্যক্রমের এলাকা",
    roleCardFields: ["designation", "organization"],
    locationFields: ["district", "administrative_area"],
    showHeaderStatus: false,
    completionFields: [
      "full_name",
      "phone_number",
      "email",
      "district",
      "organization",
      "designation",
      "administrative_area",
    ],
  },
  SYSTEM_ADMINISTRATOR: {
    label: "সিস্টেম প্রশাসক",
    icon: ShieldCheck,
    badge: "bg-violet-50 text-violet-700 ring-violet-200/80",
    avatar: "from-violet-600 via-indigo-600 to-slate-800",
    personalTitle: "ব্যক্তিগত তথ্য",
    personalDescription: "প্রশাসকের মৌলিক পরিচয় ও যোগাযোগের তথ্য",
    roleCardTitle: "সিস্টেম প্রশাসকের তথ্য",
    roleCardIcon: ShieldCheck,
    roleCardDescription: "সিস্টেম প্রশাসকের দাপ্তরিক তথ্য",
    roleCardFields: ["designation"],
    locationFields: ["district"],
    showHeaderStatus: false,
    completionFields: [
      "full_name",
      "username",
      "phone_number",
      "email",
      "designation",
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Field metadata (label + icon, shared by display & edit surfaces)    */
/* ------------------------------------------------------------------ */

export const FIELD_META = {
  full_name: {
    label: "পূর্ণ নাম",
    icon: UserRound,
  },
  username: {
    label: "ইউজারনেম",
    icon: AtSign,
  },
  phone_number: {
    label: "মোবাইল নম্বর",
    icon: Phone,
  },
  email: {
    label: "ইমেইল",
    icon: Mail,
  },
  date_of_birth: {
    label: "জন্মতারিখ",
    icon: CalendarDays,
  },
  district: {
    label: "জেলা",
    icon: MapPin,
  },
  address: {
    label: "ঠিকানা",
    icon: Home,
  },
  date_joined: {
    label: "যোগদানের তারিখ",
    icon: CalendarCheck,
  },
  last_login: {
    label: "সর্বশেষ লগইন",
    icon: Clock3,
  },
  account_status: {
    label: "অ্যাকাউন্ট স্ট্যাটাস",
    icon: ShieldCheck,
  },
  role: {
    label: "ভূমিকা",
    icon: IdCard,
  },
  organization: {
    label: "প্রতিষ্ঠান",
    icon: Building2,
  },
  designation: {
    label: "পদবি",
    icon: BadgeCheck,
  },
  responder_type: {
    label: "উদ্ধারকর্মীর ধরন",
    icon: Siren,
  },
  availability_status: {
    label: "প্রাপ্যতার অবস্থা",
    icon: Activity,
  },
  administrative_area: {
    label: "প্রশাসনিক এলাকা",
    icon: MapPinned,
  },
  administrative_areas: {
    label: "দায়িত্বপ্রাপ্ত এলাকা",
    icon: Map,
  },
};

/** Fields that span the full width when rendered in a two-column grid. */
export const WIDE_FIELDS = new Set([
  "administrative_area",
  "administrative_areas",
  "address",
]);

/** Personal card fields shared by every role. */
export const PERSONAL_FIELDS = [
  "full_name",
  "username",
  "phone_number",
  "email",
  "date_of_birth",
];

/** Account card fields shared by every role. */
export const ACCOUNT_FIELDS = [
  "role",
  "account_status",
  "date_joined",
  "last_login",
];

/* ------------------------------------------------------------------ */
/* Status & enum label maps                                            */
/* ------------------------------------------------------------------ */

export const VOLUNTEER_STATUS_UI = {
  AVAILABLE: {
    label: "বর্তমানে উপলব্ধ",
    dot: "bg-emerald-500",
    classes: "bg-emerald-50 text-emerald-700 ring-emerald-200/90",
  },
  BUSY: {
    label: "ব্যস্ত",
    dot: "bg-amber-500",
    classes: "bg-amber-50 text-amber-700 ring-amber-200/90",
  },
  UNAVAILABLE: {
    label: "বর্তমানে অনুপলব্ধ",
    dot: "bg-slate-400",
    classes: "bg-slate-100 text-slate-600 ring-slate-300/70",
  },
};
export const RESPONDER_STATUS_UI = {
  AVAILABLE: VOLUNTEER_STATUS_UI.AVAILABLE,
  ON_MISSION: {
    label: "মিশনে আছেন",
    dot: "bg-orange-500",
    classes: "bg-orange-50 text-orange-700 ring-orange-200/90",
  },
  UNAVAILABLE: VOLUNTEER_STATUS_UI.UNAVAILABLE,
};
export const RESPONDER_TYPE_LABELS = {
  FIELD_OFFICER: "ফিল্ড অফিসার",
  RESCUE_TEAM: "উদ্ধারকারী দল",
  MEDICAL_RESPONDER: "চিকিৎসা সহায়তাকারী",
  EMERGENCY_RESPONDER: "জরুরি উদ্ধারকর্মী",
};
export const ACCOUNT_STATUS_UI = {
  ACTIVE: {
    label: "সক্রিয়",
    dot: "bg-emerald-500",
    classes: "bg-emerald-50 text-emerald-700 ring-emerald-200/90",
  },
  SUSPENDED: {
    label: "স্থগিত",
    dot: "bg-rose-500",
    classes: "bg-rose-50 text-rose-700 ring-rose-200/90",
  },
  PENDING: {
    label: "যাচাই অপেক্ষমাণ",
    dot: "bg-amber-500",
    classes: "bg-amber-50 text-amber-700 ring-amber-200/90",
  },
};

/* ------------------------------------------------------------------ */
/* Edit-form configuration                                             */
/* ------------------------------------------------------------------ */

const DISTRICT_OPTIONS = [...new Set(ALL_DISTRICTS)].map((name) => ({
  value: name,
  label: name,
}));
const VOLUNTEER_STATUS_OPTIONS = Object.entries(VOLUNTEER_STATUS_UI).map(
  ([value, ui]) => ({
    value,
    label: ui.label,
  }),
);
const RESPONDER_STATUS_OPTIONS = Object.entries(RESPONDER_STATUS_UI).map(
  ([value, ui]) => ({
    value,
    label: ui.label,
  }),
);
const RESPONDER_TYPE_OPTIONS = Object.entries(RESPONDER_TYPE_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  }),
);
const personalBasics = [
  {
    key: "full_name",
    type: "text",
    section: "personal",
    placeholder: "আপনার পূর্ণ নাম লিখুন",
  },
  {
    key: "email",
    type: "email",
    section: "personal",
    placeholder: "example@email.com",
  },
  {
    key: "date_of_birth",
    type: "date",
    section: "personal",
  },
];
const districtField = {
  key: "district",
  type: "select",
  section: "personal",
  options: DISTRICT_OPTIONS,
  placeholder: "জেলা নির্বাচন করুন",
};
export const EDIT_FIELDS = {
  CITIZEN: [
    ...personalBasics,
    districtField,
    {
      key: "address",
      type: "textarea",
      section: "role",
      fullWidth: true,
      placeholder: "গ্রাম/রোড/ডাকঘরসহ আপনার ঠিকানা লিখুন",
    },
    {
      key: "administrative_area",
      type: "area",
      section: "role",
      fullWidth: true,
    },
  ],
  COMMUNITY_VOLUNTEER: [
    ...personalBasics,
    districtField,
    {
      key: "organization",
      type: "text",
      section: "role",
      placeholder: "যেমন: বাংলাদেশ রেড ক্রিসেন্ট সোসাইটি",
    },
    {
      key: "availability_status",
      type: "select",
      section: "role",
      options: VOLUNTEER_STATUS_OPTIONS,
    },
    {
      key: "administrative_area",
      type: "area",
      section: "role",
      fullWidth: true,
    },
  ],
  RESPONDER: [
    ...personalBasics,
    districtField,
    {
      key: "responder_type",
      type: "select",
      section: "role",
      options: RESPONDER_TYPE_OPTIONS,
      placeholder: "ধরন নির্বাচন করুন",
    },
    {
      key: "organization",
      type: "text",
      section: "role",
      placeholder: "যেমন: ফায়ার সার্ভিস ও সিভিল ডিফেন্স",
    },
    {
      key: "availability_status",
      type: "select",
      section: "role",
      options: RESPONDER_STATUS_OPTIONS,
    },
    {
      key: "administrative_areas",
      type: "multi-area",
      section: "role",
      fullWidth: true,
    },
  ],
  LOCAL_AUTHORITY: [
    ...personalBasics,
    districtField,
    {
      key: "designation",
      type: "text",
      section: "role",
      placeholder: "যেমন: উপজেলা নির্বাহী কর্মকর্তা",
    },
    {
      key: "organization",
      type: "text",
      section: "role",
      placeholder: "যেমন: কয়রা উপজেলা প্রশাসন",
    },
    {
      key: "administrative_area",
      type: "area",
      section: "role",
      fullWidth: true,
    },
  ],
  DISASTER_MANAGEMENT_OFFICER: [
    ...personalBasics,
    districtField,
    {
      key: "designation",
      type: "text",
      section: "role",
      placeholder: "যেমন: দুর্যোগ ব্যবস্থাপনা কর্মকর্তা",
    },
    {
      key: "organization",
      type: "text",
      section: "role",
      placeholder: "যেমন: দুর্যোগ ব্যবস্থাপনা অধিদপ্তর",
    },
    {
      key: "administrative_area",
      type: "area",
      section: "role",
      fullWidth: true,
    },
  ],
  SYSTEM_ADMINISTRATOR: [
    ...personalBasics,
    {
      key: "designation",
      type: "text",
      section: "role",
      placeholder: "যেমন: সিস্টেম প্রশাসক",
    },
  ],
};

/** Fields that can never be edited from the profile form. */
export const READONLY_FIELD_KEYS = ["phone_number", "username", "role"];
