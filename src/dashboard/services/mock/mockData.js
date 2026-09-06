/**
 * ============================================================
 *  MOCK DATA STORE — CoastalGuard BD
 * ============================================================
 *  TEMPORARY data layer for UI development.
 *  Every object here mirrors the planned Django REST Framework
 *  API responses. Swap src/services/* to real HTTP calls and
 *  delete this file when the backend is connected.
 * ============================================================
 */

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const now = Date.now();

/* ---------------- Users (demo accounts) ---------------- */
export const users = [
  {
    id: "u-citizen",
    name: "রাশেদা খাতুন",
    nameEn: "Rasheda Khatun",
    role: "CITIZEN",
    phone: "০১৭১২-৩৪৫৬৭৮",
    phoneRaw: "01712345678",
    email: "rasheda@example.com",
    division: "খুলনা",
    district: "খুলনা",
    upazila: "কয়রা",
    joinedAt: now - 320 * DAY,
  },
  {
    id: "u-volunteer",
    name: "সুমন রায়",
    nameEn: "Sumon Roy",
    role: "COMMUNITY_VOLUNTEER",
    phone: "০১৮১৯-৪৫৬৭৮৯",
    phoneRaw: "01819456789",
    email: "sumon.roy@example.com",
    division: "খুলনা",
    district: "খুলনা",
    upazila: "কয়রা",
    organization: "সাইক্লোন প্রস্তুতি কর্মসূচি (সিপিপি)",
    availability: "AVAILABLE",
    joinedAt: now - 540 * DAY,
  },
  {
    id: "u-responder",
    name: "আরিফুল ইসলাম",
    nameEn: "Ariful Islam",
    role: "RESPONDER",
    phone: "০১৬১১-২২৩৩৪৪",
    phoneRaw: "01611223344",
    email: "ariful.r@example.com",
    division: "খুলনা",
    district: "খুলনা",
    upazila: "দাকোপ",
    organization: "ফায়ার সার্ভিস ও সিভিল ডিফেন্স",
    team: "উদ্ধারকারী দল — দাকোপ ১",
    availability: "ON_MISSION",
    joinedAt: now - 710 * DAY,
  },
  {
    id: "u-authority",
    name: "তানভীর আহমেদ",
    nameEn: "Tanvir Ahmed",
    role: "LOCAL_AUTHORITY",
    phone: "০১৭১৪-৯৮৭৬৫৪",
    phoneRaw: "01714987654",
    email: "tahmed.uno@example.gov.bd",
    division: "খুলনা",
    district: "খুলনা",
    upazila: "কয়রা",
    organization: "কয়রা উপজেলা প্রশাসন",
    designation: "উপজেলা নির্বাহী অফিসার",
    joinedAt: now - 880 * DAY,
  },
  {
    id: "u-dmo",
    name: "ড. নাজমুল হুদা",
    nameEn: "Dr. Nazmul Huda",
    role: "DISASTER_MANAGEMENT_OFFICER",
    phone: "০১৫৫২-১১৪৪৬৬",
    phoneRaw: "01552114466",
    email: "nazmul.huda@example.gov.bd",
    division: "খুলনা",
    district: "খুলনা",
    upazila: "খুলনা সদর",
    organization: "দুর্যোগ ব্যবস্থাপনা ও ত্রাণ মন্ত্রণালয়",
    designation: "জেলা দুর্যোগ ব্যবস্থাপনা ও ত্রাণ কর্মকর্তা",
    joinedAt: now - 1200 * DAY,
  },
  {
    id: "u-admin",
    name: "ফারিয়া রহমান",
    nameEn: "Faria Rahman",
    role: "SYSTEM_ADMINISTRATOR",
    phone: "০১৩০৩-৯৯৮৮৭৭",
    phoneRaw: "01303998877",
    email: "faria.admin@example.gov.bd",
    division: "ঢাকা",
    district: "ঢাকা",
    upazila: "ঢাকা সদর",
    organization: "CoastalGuard BD প্ল্যাটফর্ম",
    joinedAt: now - 1500 * DAY,
  },
];

/* Extra registered users — for the administrator user table */
export const adminUserRows = [
  { id: "usr-101", name: "মাহমুদা আক্তার", phone: "০১৭০১-২০৩০৪০", role: "CITIZEN", district: "সাতক্ষীরা", upazila: "শ্যামনগর", status: "সক্রিয়", joinedAt: now - 6 * DAY },
  { id: "usr-102", name: "জাহিদ হোসেন", phone: "০১৮২২-৩৩৪৪৫৫", role: "CITIZEN", district: "খুলনা", upazila: "দাকোপ", status: "সক্রিয়", joinedAt: now - 9 * DAY },
  { id: "usr-103", name: "শারমিন সুলতানা", phone: "০১৯১৫-৭৭৬৬৫৫", role: "COMMUNITY_VOLUNTEER", district: "পটুয়াখালী", upazila: "বাউফল", status: "সক্রিয়", joinedAt: now - 12 * DAY },
  { id: "usr-104", name: "রফিকুল ইসলাম", phone: "০১৬৩৪-৫৫৬৬৭৭", role: "COMMUNITY_VOLUNTEER", district: "ভোলা", upazila: "চরফ্যাশন", status: "নিষ্ক্রিয়", joinedAt: now - 40 * DAY },
  { id: "usr-105", name: "নূরুল আমিন", phone: "০১৩১৮-৯০৮০৭০", role: "RESPONDER", district: "ককসবাজার", upazila: "টেকনাফ", status: "সক্রিয়", joinedAt: now - 22 * DAY },
  { id: "usr-106", name: "সালেহা বেগম", phone: "০১৭৭৭-১২৩২৩৪", role: "CITIZEN", district: "বরগুনা", upazila: "পাথরঘাটা", status: "সক্রিয়", joinedAt: now - 3 * DAY },
  { id: "usr-107", name: "কামরুল হাসান", phone: "০১৫৫৩-৪৪৫৫৬৬", role: "RESPONDER", district: "চট্টগ্রাম", upazila: "সন্দ্বীপ", status: "সক্রিয়", joinedAt: now - 18 * DAY },
  { id: "usr-108", name: "আয়েশা সিদ্দিকা", phone: "০১৯৬৬-৮৮৯৯০০", role: "LOCAL_AUTHORITY", district: "নোয়াখালী", upazila: "হাতিয়া", status: "সক্রিয়", joinedAt: now - 27 * DAY },
  { id: "usr-109", name: "মিজানুর রহমান", phone: "০১৪০৪-২৩৪৫৬৭", role: "COMMUNITY_VOLUNTEER", district: "বাগেরহাট", upazila: "মোংলা", status: "সক্রিয়", joinedAt: now - 15 * DAY },
  { id: "usr-110", name: "তাসলিমা নাসরিন", phone: "০১৮৮৮-৫৪৩২১০", role: "CITIZEN", district: "খুলনা", upazila: "বটিয়াঘাটা", status: "সক্রিয়", joinedAt: now - 2 * DAY },
  { id: "usr-111", name: "হাবিবুর রহমান", phone: "০১৬৬৬-৩৪৫৬৭৮", role: "DISASTER_MANAGEMENT_OFFICER", district: "সাতক্ষীরা", upazila: "সদর", status: "সক্রিয়", joinedAt: now - 60 * DAY },
  { id: "usr-112", name: "ফারুক আহমেদ", phone: "০১৭৬৬-৭৮৯০১২", role: "CITIZEN", district: "লক্ষ্মীপুর", upazila: "রামগতি", status: "নিষ্ক্রিয়", joinedAt: now - 75 * DAY },
  { id: "usr-113", name: "রুমানা পারভিন", phone: "০১৫১৫-১৯২৮৩৭", role: "COMMUNITY_VOLUNTEER", district: "খুলনা", upazila: "কয়রা", status: "সক্রিয়", joinedAt: now - 8 * DAY },
  { id: "usr-114", name: "বেলাল হোসেন", phone: "০১৯৪৪-৬৫৪৩২১", role: "RESPONDER", district: "খুলনা", upazila: "দাকোপ", status: "সক্রিয়", joinedAt: now - 33 * DAY },
];

/* ---------------- Disaster reports ---------------- */
export const reports = [
  { id: "RPT-2571", type: "surge", severity: "CRITICAL", status: "IN_PROGRESS", title: "অস্বাভাবিক জলোচ্ছ্বাসে নিম্ন এলাকা প্লাবিত", district: "খুলনা", upazila: "কয়রা", place: "দক্ষিণ বেদকাশী ইউনিয়ন", reporter: { name: "জিল্লুর রহমান", role: "CITIZEN" }, time: now - 35 * MIN, affected: 340, verifiedBy: "কয়রা উপজেলা প্রশাসন", description: "জোয়ারের পানি বাঁধ টপকে গ্রামে ঢুকছে। প্রায় ৮০টি পরিবার ঘর ছেড়েছে। বাঁধের পশ্চিম পাশে ফাটল দেখা দিয়েছে।" },
  { id: "RPT-2570", type: "surge", severity: "HIGH", status: "VERIFIED", title: "ভাঙন কবলিত গ্রামে লবণ পানি প্রবেশ", district: "খুলনা", upazila: "কয়রা", place: "মহারাজপুর", reporter: { name: "রাশেদা খাতুন", role: "CITIZEN" }, time: now - 2 * HOUR, affected: 120, verifiedBy: "সুমন রায় (স্বেচ্ছাসেবক)", description: "কপিলাক্ষ্মী নদীর বাঁধে ফাটল। পানি উঠছে, মাছের ঘের ডুবে গেছে।" },
  { id: "RPT-2569", type: "cyclone", severity: "HIGH", status: "VERIFIED", title: "প্রবল ঝড়ে ঘরবাড়ি ও গাছপালা ক্ষতিগ্রস্ত", district: "সাতক্ষীরা", upazila: "শ্যামনগর", place: "মুন্সিগঞ্জ", reporter: { name: "আব্দুল করিম", role: "COMMUNITY_VOLUNTEER" }, time: now - 3 * HOUR, affected: 210, verifiedBy: "শ্যামনগর উপজেলা প্রশাসন", description: "রাতের ঝড়ে টিনের চাল উড়েছে, বৈদ্যুতিক খুঁটি ভেঙেছে। রাস্তা প্রায় অচল।" },
  { id: "RPT-2568", type: "erosion", severity: "HIGH", status: "VERIFIED", title: "কবলন্দ নদীর ভাঙনে জরুরি অবস্থা", district: "পটুয়াখালী", upazila: "বাউফল", place: "কালাইয়া", reporter: { name: "সুমাইয়া আক্তার", role: "CITIZEN" }, time: now - 5 * HOUR, affected: 95, verifiedBy: "বাউফল উপজেলা প্রশাসন", description: "নদীভাঙনে ১২টি বাড়ি হুমকিতে। বালুর বস্তা ফেলা হচ্ছে, তবে যথেষ্ট নয়।" },
  { id: "RPT-2567", type: "surge", severity: "MODERATE", status: "PENDING", title: "চরাঞ্চলে জোয়ারের পানি বেড়েছে", district: "ভোলা", upazila: "চরফ্যাশন", place: "চর নাজির", reporter: { name: "মোয়াজ্জেম হোসেন", role: "CITIZEN" }, time: now - 40 * MIN, affected: 60, verifiedBy: null, description: "মেঘনার পানি চরের রাস্তা পেরিয়ে বাড়িঘরে ঢুকছে। কোনো উদ্ধারকারী এখনো আসেনি।" },
  { id: "RPT-2566", type: "surge", severity: "HIGH", status: "PENDING", title: "মাছের ঘের প্লাবিত, জেলেরা অন্তরীণ থাকছে না", district: "বরগুনা", upazila: "পাথরঘাটা", place: "কঠালতলী", reporter: { name: "ইদ্রিস আলী", role: "CITIZEN" }, time: now - 55 * MIN, affected: 45, verifiedBy: null, description: "ক্রমাগত জোয়ারে ঘেরের পাড় ভেঙেছে। লবণাক্ত পানি পুকুরে মিশেছে।" },
  { id: "RPT-2565", type: "flood", severity: "MODERATE", status: "PENDING", title: "ভারী বর্ষণে ফসলি জমি ডুবেছে", district: "নোয়াখালী", upazila: "সুবর্ণচর", place: "চর জব্বার", reporter: { name: "নাসির উদ্দিন", role: "COMMUNITY_VOLUNTEER" }, time: now - 80 * MIN, affected: 200, verifiedBy: null, description: "টানা বৃষ্টিতে সয়া ও আখ জমির পানি নামছে না। ড্রেনেজ ব্যবস্থা অচল।" },
  { id: "RPT-2564", type: "cyclone", severity: "MODERATE", status: "VERIFIED", title: "ঝড়ো হাওয়ায় নৌ-যোগাযোগ ব্যাহত", district: "ককসবাজার", upazila: "মহেশখালী", place: "বড় মহেশখালী", reporter: { name: "শফি আলম", role: "CITIZEN" }, time: now - 4 * HOUR, affected: 150, verifiedBy: "মহেশখালী উপজেলা প্রশাসন", description: "ট্রলার চলাচল বন্ধ। প্রায় ৩০ জন যাত্রী ঘাটে আটকা।" },
  { id: "RPT-2563", type: "salinity", severity: "MODERATE", status: "VERIFIED", title: "খালের পানির লবণাক্ততা বেড়েছে", district: "বাগেরহাট", upazila: "শরণখোলা", place: "রায়েন্দা", reporter: { name: "আমিনুল হক", role: "COMMUNITY_VOLUNTEER" }, time: now - 8 * HOUR, affected: 75, verifiedBy: "শরণখোলা উপজেলা প্রশাসন", description: "খালের পানি সবুজাভ, গরু-ছাগল পান করছে না। পানীয় জলের সংকট।" },
  { id: "RPT-2562", type: "flood", severity: "LOW", status: "RESOLVED", title: "বৃষ্টির পানি জমে রাস্তা ক্ষতিগ্রস্ত", district: "লক্ষ্মীপুর", upazila: "রামগতি", place: "চর আলেকজান্ডার", reporter: { name: "হাফেজ উল্লাহ", role: "CITIZEN" }, time: now - 1 * DAY, affected: 35, verifiedBy: "রামগতি উপজেলা প্রশাসন", description: "ইউনিয়ন পরিষদ পানি নিষ্কাশন করে রাস্তা মেরামত করেছে।" },
  { id: "RPT-2561", type: "surge", severity: "HIGH", status: "IN_PROGRESS", title: "বাঁধ ভেঙে লবণাক্ত পানি প্রবেশ", district: "সাতক্ষীরা", upazila: "আশাশুনি", place: "প্রতাপনগর", reporter: { name: "বিলকিস বানু", role: "CITIZEN" }, time: now - 6 * HOUR, affected: 500, verifiedBy: "আশাশুনি উপজেলা প্রশাসন", description: "পানি উন্নয়ন বোর্ডের বাঁধ ভেঙে ৩টি গ্রাম প্লাবিত। আশ্রয়কেন্দ্র খোলা হয়েছে।" },
  { id: "RPT-2560", type: "fire", severity: "MODERATE", status: "RESOLVED", title: "ঝুপড়ি বস্তিতে আগুন", district: "চট্টগ্রাম", upazila: "সন্দ্বীপ", place: "সন্তোষপুর", reporter: { name: "জয়নাল আবেদীন", role: "CITIZEN" }, time: now - 2 * DAY, affected: 28, verifiedBy: "ফায়ার সার্ভিস", description: "৭টি ঝুপড়ি পুড়ে গেছে। ফায়ার সার্ভিস আগুন নিয়ন্ত্রণে এনেছে।" },
  { id: "RPT-2559", type: "erosion", severity: "CRITICAL", status: "IN_PROGRESS", title: "সন্দ্বীপ চ্যানেলে তীব্র ভাঙন", district: "চট্টগ্রাম", upazila: "সন্দ্বীপ", place: "উরিরচর", reporter: { name: "সুলতান মাহমুদ", role: "COMMUNITY_VOLUNTEER" }, time: now - 9 * HOUR, affected: 260, verifiedBy: "জেলা প্রশাসন", description: "রাতের জোয়ারে ৫০ মিটার চর ভেঙেছে। স্থানীয় বাজার হুমকিতে।" },
  { id: "RPT-2558", type: "cyclone", severity: "LOW", status: "RESOLVED", title: "ঝড়ো হাওয়ায় সাইনবোর্ড উড়েছে", district: "খুলনা", upazila: "বটিয়াঘাটা", place: "বাজুয়া", reporter: { name: "গৌরাঙ্গ বিশ্বাস", role: "CITIZEN" }, time: now - 3 * DAY, affected: 5, verifiedBy: "ইউনিয়ন পরিষদ", description: "রাস্তার ধারের গাছ ভেঙে পড়েছিল, কাটিয়ে সরানো হয়েছে।" },
];

/* The logged-in citizen's own reports */
export const myReports = [
  { id: "RPT-2570", type: "surge", severity: "HIGH", status: "VERIFIED", title: "ভাঙন কবলিত গ্রামে লবণ পানি প্রবেশ", district: "খুলনা", upazila: "কয়রা", place: "মহারাজপুর", time: now - 2 * HOUR, affected: 120, description: "কপিলাক্ষ্মী নদীর বাঁধে ফাটল। পানি উঠছে, মাছের ঘের ডুবে গেছে।" },
  { id: "RPT-2488", type: "erosion", severity: "MODERATE", status: "RESOLVED", title: "বাঁধের পাশে মাটি ধসে পড়েছে", district: "খুলনা", upazila: "কয়রা", place: "উত্তর বেদকাশী", time: now - 16 * DAY, affected: 20, description: "জিও-ব্যাগ ফেলে সুরক্ষা দেওয়া হয়েছে।" },
  { id: "RPT-2401", type: "flood", severity: "MODERATE", status: "RESOLVED", title: "ঘেরে পানি জমে ফসল নষ্ট", district: "খুলনা", upazila: "কয়রা", place: "কয়রা সদর", time: now - 45 * DAY, affected: 40, description: "পানি নিষ্কাশন সম্পন্ন।" },
  { id: "RPT-2320", type: "salinity", severity: "LOW", status: "VERIFIED", title: "টিউবওয়েলের পানিতে লবণ বেড়েছে", district: "খুলনা", upazila: "কয়রা", place: "মহারাজপুর", time: now - 90 * DAY, affected: 12, description: "সংশ্লিষ্ট দপ্তরে তথ্য প্রেরণ করা হয়েছে।" },
];

/* ---------------- Active disasters / alerts ---------------- */
export const activeDisasters = [
  { id: "DIS-31", type: "surge", severity: "CRITICAL", title: "ঘূর্ণিঝড় পরবর্তী জলোচ্ছ্বাস সতর্কতা", areas: ["সাতক্ষীরা", "খুলনা", "বাগেরহাট"], startedAt: now - 5 * HOUR, signal: "বিপৎ সংকেত ৬", affectedEstimate: "৮৫,০০০+", source: "বাংলাদেশ আবহাওয়া অধিদপ্তর" },
  { id: "DIS-30", type: "erosion", severity: "HIGH", title: "মেঘনা তীরে তীব্র নদীভাঙন", areas: ["ভোলা", "পটুয়াখালী", "লক্ষ্মীপুর"], startedAt: now - 28 * HOUR, signal: null, affectedEstimate: "৪,২০০+", source: "পানি উন্নয়ন বোর্ড" },
  { id: "DIS-29", type: "flood", severity: "MODERATE", title: "ভারী বর্ষণজনিত জলাবদ্ধতা", areas: ["নোয়াখালী", "ফেনী"], startedAt: now - 2 * DAY, signal: null, affectedEstimate: "১২,৫০০+", source: "বন্যা পূর্বাভাস কেন্দ্র" },
  { id: "DIS-28", type: "cyclone", severity: "HIGH", title: "গভীর সাগরে নিম্নচাপ — শক্তিশালী হওয়ার প্রবণতা", areas: ["চট্টগ্রাম", "ককসবাজার", "ভোলা"], startedAt: now - 9 * HOUR, signal: "বিপৎ সংকেত ৩", affectedEstimate: "পর্যবেক্ষণাধীন", source: "বাংলাদেশ আবহাওয়া অধিদপ্তর" },
];

/* ---------------- Shelters ---------------- */
export const shelters = [
  { id: "SH-11", name: "কয়রা মডেল সরকারি প্রাথম বিদ্যালয় আশ্রয়কেন্দ্র", district: "খুলনা", upazila: "কয়রা", capacity: 1200, occupied: 480, status: "OPEN", facilities: ["খাবার", "বিশুদ্ধ পানি", "শৌচাগার", "প্রাথমিক চিকিৎসা", "গোবাদি পশুর জায়গা"], distance: "১.২ কিমি", water: true, power: true },
  { id: "SH-12", name: "মুজিব কিল্লা — দক্ষিণ বেদকাশী", district: "খুলনা", upazila: "কয়রা", capacity: 2500, occupied: 1830, status: "OPEN", facilities: ["খাবার", "বিশুদ্ধ পানি", "সোলার বিদ্যুৎ", "র‍্যাম্প"], distance: "৩.৮ কিমি", water: true, power: true },
  { id: "SH-13", name: "মহারাজপুর উচ্চ বিদ্যালয় শেড", district: "খুলনা", upazila: "কয়রা", capacity: 800, occupied: 120, status: "OPEN", facilities: ["বিশুদ্ধ পানি", "শৌচাগার"], distance: "৫.৫ কিমি", water: true, power: false },
  { id: "SH-21", name: "শ্যামনগর আশ্রয়কেন্দ্র", district: "সাতক্ষীরা", upazila: "শ্যামনগর", capacity: 1800, occupied: 1650, status: "CROWDED", facilities: ["খাবার", "বিশুদ্ধ পানি", "প্রাথমিক চিকিৎসা"], distance: "৮ কিমি", water: true, power: true },
  { id: "SH-22", name: "প্রতাপনগর বহুমুখী কিল্লা", district: "সাতক্ষীরা", upazila: "আশাশুনি", capacity: 2000, occupied: 1760, status: "CROWDED", facilities: ["খাবার", "শৌচাগার", "গোবাদি পশুর জায়গা"], distance: "১১ কিমি", water: true, power: false },
  { id: "SH-31", name: "মোংলা ইপিজেড কিল্লা", district: "বাগেরহাট", upazila: "মোংলা", capacity: 3000, occupied: 640, status: "OPEN", facilities: ["খাবার", "বিশুদ্ধ পানি", "সোলার বিদ্যুৎ", "প্রাথমিক চিকিৎসা", "র‍্যাম্প"], distance: "১৪ কিমি", water: true, power: true },
  { id: "SH-41", name: "চরফ্যাশন সরকারি কলেজ আশ্রয়কেন্দ্র", district: "ভোলা", upazila: "চরফ্যাশন", capacity: 1500, occupied: 410, status: "OPEN", facilities: ["বিশুদ্ধ পানি", "শৌচাগার", "খাবার"], distance: "৬ কিমি", water: true, power: true },
  { id: "SH-51", name: "টেকনাফ ঘূর্ণিঝড় আশ্রয়কেন্দ্র", district: "ককসবাজার", upazila: "টেকনাফ", capacity: 2200, occupied: 260, status: "OPEN", facilities: ["খাবার", "বিশুদ্ধ পানি", "প্রাথমিক চিকিৎসা", "র‍্যাম্প"], distance: "৯ কিমি", water: true, power: true },
  { id: "SH-61", name: "সন্দ্বীপ মডেল কিল্লা", district: "চট্টগ্রাম", upazila: "সন্দ্বীপ", capacity: 1400, occupied: 0, status: "READY", facilities: ["বিশুদ্ধ পানি", "সোলার বিদ্যুৎ"], distance: "৭ কিমি", water: true, power: true },
  { id: "SH-71", name: "বাউফল বহুমুখী আশ্রয়কেন্দ্র", district: "পটুয়াখালী", upazila: "বাউফল", capacity: 1100, occupied: 780, status: "OPEN", facilities: ["খাবার", "শৌচাগার"], distance: "৪ কিমি", water: true, power: false },
];

/* ---------------- Missions & rescue ---------------- */
export const missions = [
  { id: "MSN-114", title: "দক্ষিণ বেদকাশী — আটকে পড়া পরিবার উদ্ধার", place: "কয়রা, খুলনা", type: "জলোচ্ছ্বাস উদ্ধার", priority: "CRITICAL", status: "IN_PROGRESS", assignedAt: now - 70 * MIN, people: 34, team: "উদ্ধারকারী দল — দাকোপ ১", progress: 55 },
  { id: "MSN-113", title: "প্রতাপনগর বাঁধ-অঞ্চল সচেতনতা ও সরেজমিন মূল্যায়ন", place: "আশাশুনি, সাতক্ষীরা", type: "মূল্যায়ন", priority: "HIGH", status: "IN_PROGRESS", assignedAt: now - 5 * HOUR, people: null, team: "উদ্ধারকারী দল — দাকোপ ১", progress: 30 },
  { id: "MSN-112", title: "মুজিব কিল্লা — ত্রাণ সামগ্রী বণ্টন", place: "কয়রা, খুলনা", type: "ত্রাণ বণ্টন", priority: "MODERATE", status: "ASSIGNED", assignedAt: now - 2 * HOUR, people: 410, team: "উদ্ধারকারী দল — দাকোপ ১", progress: 0 },
  { id: "MSN-109", title: "শ্যামনগর — ক্ষতিগ্রস্ত সড়ক পুনঃউদ্ধার", place: "শ্যামনগর, সাতক্ষীরা", type: "অবকাঠামো", priority: "MODERATE", status: "DONE", assignedAt: now - 2 * DAY, people: null, team: "উদ্ধারকারী দল — দাকোপ ১", progress: 100 },
];

export const rescueRequests = [
  { id: "REQ-901", place: "দক্ষিণ বেদকাশী, কয়রা", district: "খুলনা", need: "পানিবন্দী ১২ জন — নৌকা প্রয়োজন", severity: "CRITICAL", time: now - 12 * MIN, status: "OPEN", contact: "০১৭২২-৮৮৩৩৪৪" },
  { id: "REQ-899", place: "প্রতাপনগর, আশাশুনি", district: "সাতক্ষীরা", need: "বুড়ো ও শিশুসহ ৫ পরিবার উঠানে স্থানান্তর", severity: "HIGH", time: now - 28 * MIN, status: "OPEN", contact: "০১৯৩৩-৪৫৫৬৬৭" },
  { id: "REQ-898", place: "কালাইয়া, বাউফল", district: "পটুয়াখালী", need: "ভাঙন কবলিত বাড়ি থেকে সামান্য মালপত্র সরানো", severity: "MODERATE", time: now - 44 * MIN, status: "OPEN", contact: "০১৮৪৪-৯৯০০১১" },
  { id: "REQ-897", place: "চর নাজির, চরফ্যাশন", district: "ভোলা", need: "অসুস্থ রোগীকে স্বাস্থ্যকেন্দ্রে নেওয়া", severity: "HIGH", time: now - 65 * MIN, status: "ASSIGNED", contact: "০১৬৫৫-৩৪৪৫৫৬" },
  { id: "REQ-896", place: "কঠালতলী, পাথরঘাটা", district: "বরগুনা", need: "খাবার ও বিশুদ্ধ পানি সরবরাহ", severity: "MODERATE", time: now - 2 * HOUR, status: "OPEN", contact: "০১৭৬৬-১১২২৩৩" },
];

export const operations = [
  { id: "OP-77", title: "দক্ষিণ বেদকাশী উদ্ধার অভিযান", district: "খুলনা", type: "জলোচ্ছ্বাস উদ্ধার", status: "IN_PROGRESS", lead: "আরিফুল ইসলাম", startedAt: now - 70 * MIN, teams: 2, rescued: 34 },
  { id: "OP-76", title: "প্রতাপনগর স্থানান্তর অভিযান", district: "সাতক্ষীরা", type: "স্থানান্তর", status: "IN_PROGRESS", lead: "কামরুন নাহার", startedAt: now - 3 * HOUR, teams: 1, rescued: 120 },
  { id: "OP-75", title: "বাউফল ভাঙন সুরক্ষা সহায়তা", district: "পটুয়াখালী", type: "ভাঙন সহায়তা", status: "IN_PROGRESS", lead: "বেলাল হোসেন", startedAt: now - 7 * HOUR, teams: 1, rescued: 18 },
  { id: "OP-74", title: "মহেশখালী যাত্রী উদ্ধার", district: "ককসবাজার", type: "উদ্ধার", status: "DONE", lead: "নূরুল আমিন", startedAt: now - 1 * DAY, teams: 1, rescued: 62 },
];

export const teams = [
  { id: "TM-01", name: "উদ্ধারকারী দল — দাকোপ ১", lead: "আরিফুল ইসলাম", members: 12, status: "ON_MISSION", area: "খুলনা (কয়রা-দাকোপ)", type: "বহুমুখী" },
  { id: "TM-02", name: "উদ্ধারকারী দল — দাকোপ ২", lead: "বেলাল হোসেন", members: 10, status: "READY", area: "খুলনা (দাকোপ)", type: "জলোচ্ছ্বাস" },
  { id: "TM-03", name: "উদ্ধারকারী দল — শ্যামনগর", lead: "কামরুন নাহার", members: 14, status: "ON_MISSION", area: "সাতক্ষীরা (শ্যামনগর)", type: "বহুমুখী" },
  { id: "TM-04", name: "উদ্ধারকারী দল — মোংলা", lead: "শরিফুল ইসলাম", members: 9, status: "READY", area: "বাগেরহাট (মোংলা)", type: "নৌ-উদ্ধার" },
  { id: "TM-05", name: "উদ্ধারকারী দল — চরফ্যাশন", lead: "জাকির হোসেন", members: 11, status: "REST", area: "ভোলা (চরফ্যাশন)", type: "সাধারণ" },
];

export const assistanceTasks = [
  { id: "AT-31", title: "মুজিব কিল্লায় নিবন্ধন সহায়তা", place: "দক্ষিণ বেদকাশী, কয়রা", due: "আজ বিকাল ৪টা", status: "ONGOING", detail: "আশ্রয়কেন্দ্রে আসা পরিবারের তালিকা হালনাগাদ করা" },
  { id: "AT-30", title: "পানীয় জল বিতরণ — মহারাজপুর", place: "মহারাজপুর, কয়রা", due: "আজ সন্ধ্যা ৬টা", status: "PENDING", detail: "পানির প্যাকেট ৩০০টি — পরিবার তালিকা অনুযায়ী" },
  { id: "AT-29", title: "ঝুঁকিপূর্ণ ঘর চিহ্নিতকরণ", place: "উত্তর বেদকাশী, কয়রা", due: "আগামীকাল সকাল", status: "PENDING", detail: "বাঁধ-সংলগ্ন ৪০টি বাড়ি সশরীর পরিদর্শন" },
  { id: "AT-27", title: "সচেতনতামূলক মাইকিং সহায়তা", place: "কয়রা সদর", due: "সম্পন্ন", status: "DONE", detail: "আশ্রয়কেন্দ্রের ঠিকানা ও সতর্কবার্তা প্রচার" },
];

/* ---------------- Areas ---------------- */
export const areaTree = {
  "খুলনা বিভাগ": {
    খুলনা: ["কয়রা", "দাকোপ", "বটিয়াঘাটা", "পাইকগাছা"],
    সাতক্ষীরা: ["শ্যামনগর", "আশাশুনি", "কালীগঞ্জ", "দেবহাটা"],
    বাগেরহাট: ["মোংলা", "শরণখোলা", "মোরেলগঞ্জ", "রামপাল"],
  },
  "বরিশাল বিভাগ": {
    পটুয়াখালী: ["বাউফল", "দশমিনা", "গলাচিপা", "কলাপাড়া"],
    বরগুনা: ["পাথরঘাটা", "আমতলী", "বামনা"],
    ভোলা: ["চরফ্যাশন", "মনপুরা", "দৌলতখান", "লামছড়ি"],
  },
  "চট্টগ্রাম বিভাগ": {
    চট্টগ্রাম: ["সন্দ্বীপ", "মিরসরাই", "সীতাকুণ্ড", "বাঁশখালী"],
    ককসবাজার: ["টেকনাফ", "উখিয়া", "মহেশখালী", "কুতুবদিয়া"],
    নোয়াখালী: ["সুবর্ণচর", "হাতিয়া", "কোম্পানীগঞ্জ"],
  },
};

export const districtRisk = [
  { district: "সাতক্ষীরা", risk: 92, reports: 18, trend: "up" },
  { district: "খুলনা", risk: 84, reports: 24, trend: "up" },
  { district: "বাগেরহাট", risk: 71, reports: 12, trend: "same" },
  { district: "ভোলা", risk: 66, reports: 9, trend: "up" },
  { district: "পটুয়াখালী", risk: 61, reports: 8, trend: "down" },
  { district: "বরগুনা", risk: 55, reports: 6, trend: "same" },
  { district: "নোয়াখালী", risk: 47, reports: 11, trend: "up" },
  { district: "চট্টগ্রাম", risk: 38, reports: 7, trend: "down" },
  { district: "ককসবাজার", risk: 34, reports: 4, trend: "down" },
];

/* Schematic coastal map coordinates (420 × 560 canvas) */
export const mapDistricts = [
  { name: "সাতক্ষীরা", x: 86, y: 398, risk: 92 },
  { name: "খুলনা", x: 104, y: 372, risk: 84 },
  { name: "বাগেরহাট", x: 128, y: 386, risk: 71 },
  { name: "পিরোজপুর", x: 152, y: 372, risk: 49 },
  { name: "বরগুনা", x: 148, y: 402, risk: 55 },
  { name: "পটুয়াখালী", x: 180, y: 404, risk: 61 },
  { name: "ভোলা", x: 210, y: 394, risk: 66 },
  { name: "বরিশাল", x: 172, y: 350, risk: 42 },
  { name: "লক্ষ্মীপুর", x: 226, y: 336, risk: 51 },
  { name: "নোয়াখালী", x: 246, y: 352, risk: 47 },
  { name: "ফেনী", x: 262, y: 324, risk: 33 },
  { name: "চট্টগ্রাম", x: 358, y: 318, risk: 38 },
  { name: "ককসবাজার", x: 378, y: 432, risk: 34 },
];

/* ---------------- Charts ---------------- */
export const userDistribution = [
  { label: "নাগরিক", value: 1840, color: "#0ea5e9" },
  { label: "স্বেচ্ছাসেবক", value: 312, color: "#10b981" },
  { label: "উদ্ধারকারী", value: 96, color: "#f59e0b" },
  { label: "স্থানীয় প্রশাসন", value: 54, color: "#277476" },
  { label: "দুর্যোগ কর্মকর্তা", value: 22, color: "#0891b2" },
  { label: "প্রশাসক", value: 8, color: "#64748b" },
];

export const reportsByType = [
  { label: "জলোচ্ছ্বাস", value: 86, color: "#2563eb" },
  { label: "ঘূর্ণিঝড়", value: 64, color: "#0ea5e9" },
  { label: "নদীভাঙন", value: 41, color: "#b45309" },
  { label: "বন্যা", value: 33, color: "#0e7490" },
  { label: "লবণাক্ততা", value: 18, color: "#047857" },
  { label: "অন্যান্য", value: 12, color: "#94a3b8" },
];

export const monthlyTrend = [
  { label: "ডিসে", value: 14 },
  { label: "জানু", value: 9 },
  { label: "ফেব্রু", value: 7 },
  { label: "মার্চ", value: 12 },
  { label: "এপ্রিল", value: 28 },
  { label: "মে", value: 46 },
  { label: "জুন", value: 62 },
];

/* ---------------- System monitoring ---------------- */
export const systemServices = [
  { name: "API সার্ভার", detail: "rest.coastalguard.gov.bd", status: "HEALTHY", uptime: "৯৯.৯৭%", latency: "১৪২ মি.সে.", icon: "Server" },
  { name: "ডাটাবেস ক্লাস্টার", detail: "প্রাইমারি + রেপ্লিকা", status: "HEALTHY", uptime: "৯৯.৯৯%", latency: "১৮ মি.সে.", icon: "Database" },
  { name: "এসএমএস গেটওয়ে", detail: "সতর্কবার্তা ডেলিভারি", status: "DEGRADED", uptime: "৯৮.২১%", latency: "৮২০ মি.সে.", icon: "MessageSquare" },
  { name: "মানচিত্র টাইল সার্ভার", detail: "জিওস্পেশিয়াল ডেটা", status: "HEALTHY", uptime: "৯৯.৮৪%", latency: "৯৬ মি.সে.", icon: "Map" },
  { name: "রিয়েলটাইম পুশ", detail: "WebSocket চ্যানেল", status: "HEALTHY", uptime: "৯৯.৯১%", latency: "৬০ মি.সে.", icon: "Radio" },
];

/* ---------------- Awareness content ---------------- */
export const awarenessItems = [
  { icon: "Wind", tone: "sky", title: "ঘূর্ণিঝড়ের আগে যা করবেন", points: ["বিপৎ সংকেত শুনুন — রেডিও/টিভি/মাইকিং", "শুকনো খাবার, পানি, ওষুধ, টর্চ প্রস্তুত রাখুন", "ঘরের দরজা-জানালা শক্ত করে বাঁধুন"] },
  { icon: "WavesArrowUp", tone: "blue", title: "জলোচ্ছ্বাসের সময় নিরাপদ থাকুন", points: ["নিকটস্থ আশ্রয়কেন্দ্র বা উঁচু স্থানে যান", "বাঁধের কাছাকাছি ভিড় করবেন না", "গোবাদি পশুকে উঁচু জায়গায় বাঁধুন"] },
  { icon: "Phone", tone: "emerald", title: "জরুরি নম্বরসমূহ", points: ["জাতীয় জরুরি সেবা: ৯৯৯", "দুর্যোগ সতর্কতা: ১০৯০", "স্বাস্থ্য বাতায়ন: ১৬২৬৩"] },
  { icon: "Droplet", tone: "cyan", title: "লবণাক্ততা ও পানীয় জল", points: ["বৃষ্টির পানি সংরক্ষণ করুন", "পুকুরে লবণ পানি ঢুকতে দেবেন না", "লবণাক্ত পানি ফুটিয়ে নিলেও লবণ যায় না"] },
];

/* ---------------- Anything else ---------------- */
export const notifications = {
  CITIZEN: [
    { id: "n1", kind: "alert", title: "জলোচ্ছ্বাস সতর্কতা — কয়রা অঞ্চল", body: "আপনার এলাকায় বিপৎ সংকেত ৬ জারি হয়েছে। নিকটস্থ আশ্রয়কেন্দ্র দেখুন।", time: now - 20 * MIN, read: false },
    { id: "n2", kind: "report", title: "আপনার রিপোর্ট যাচাইকৃত হয়েছে", body: "RPT-2570 — কয়রা উপজেলা প্রশাসন রিপোর্টটি যাচাই করেছে।", time: now - 2 * HOUR, read: false },
    { id: "n3", kind: "shelter", title: "মুজিব কিল্লা আশ্রয়কেন্দ্র চালু", body: "দক্ষিণ বেদকাশী মুজিব কিল্লায় আশ্রয় নেওয়া শুরু হয়েছে।", time: now - 5 * HOUR, read: true },
    { id: "n4", kind: "system", title: "নতুন সচেতনতা নির্দেশিকা", body: "ঘূর্ণিঝড় প্রস্তুতি তালিকা এখন বাংলায় ডাউনলোডযোগ্য।", time: now - 1 * DAY, read: true },
  ],
  COMMUNITY_VOLUNTEER: [
    { id: "n1", kind: "mission", title: "নতুন সহায়তা কার্যক্রম বরাদ্দ", body: "মুজিব কিল্লায় নিবন্ধন সহায়তা — আজ বিকাল ৪টা।", time: now - 45 * MIN, read: false },
    { id: "n2", kind: "alert", title: "জলোচ্ছ্বাস সতর্কতা — কয়রা অঞ্চল", body: "বিপৎ সংকেত ৬ জারি। আপনার এলাকার পরিস্থিতি পর্যবেক্ষণ করুন।", time: now - 20 * MIN, read: false },
    { id: "n3", kind: "report", title: "কমিউনিটি রিপোর্টে ৩টি নতুন জমা", body: "কয়রা অঞ্চলে নতুন ৩টি রিপোর্ট যাচাই অপেক্ষমাণ।", time: now - 3 * HOUR, read: false },
    { id: "n4", kind: "system", title: "সাপ্তাহিক স্বেচ্ছাসেবক ব্রিফিং", body: "শুক্রবার সকাল ১০টা — উপজেলা পরিষদ হলরুম।", time: now - 1 * DAY, read: true },
  ],
  RESPONDER: [
    { id: "n1", kind: "mission", title: "জরুরি মিশন বরাদ্দ — MSN-114", body: "দক্ষিণ বেদকাশী: পানিবন্দী পরিবার উদ্ধার। অবিলম্বে যোগ দিন।", time: now - 12 * MIN, read: false },
    { id: "n2", kind: "alert", title: "জরুরি অনুরোধ: নৌকা প্রয়োজন", body: "REQ-901 — দক্ষিণ বেদকাশী, কয়রা।", time: now - 12 * MIN, read: false },
    { id: "n3", kind: "report", title: "মিশন MSN-113 আপডেট", body: "প্রতাপনগর মূল্যায়ন ৩০% সম্পন্ন হয়েছে।", time: now - 2 * HOUR, read: true },
    { id: "n4", kind: "system", title: "সরঞ্জাম জমা নেওয়ার তাগাদা", body: "উদ্ধার সরঞ্জাম মজুদ রেজিস্ট্রি হালনাগাদ করুন।", time: now - 1 * DAY, read: true },
  ],
  LOCAL_AUTHORITY: [
    { id: "n1", kind: "verification", title: "৫টি রিপোর্ট যাচাই অপেক্ষিত", body: "কয়রা উপজেলায় নতুন নাগরিক রিপোর্ট জমা হয়েছে।", time: now - 50 * MIN, read: false },
    { id: "n2", kind: "alert", title: "জলোচ্ছ্বাস সতর্কতা — বিপৎ সংকেত ৬", body: "সাতক্ষীরা, খুলনা, বাগেরহাট অঞ্চলে সতর্কতা জারি।", time: now - 20 * MIN, read: false },
    { id: "n3", kind: "shelter", title: "আশ্রয়কেন্দ্র ধারণক্ষমতা ৭৫%", body: "মুজিব কিল্লা — দক্ষিণ বেদকাশী। অতিরিক্ত ভ্যান্ডার প্রয়োজন।", time: now - 1 * HOUR, read: false },
    { id: "n4", kind: "system", title: "মাসিক প্রতিবেদন দাখিলের শেষ দিন", body: "উপজেলা দুর্যোগ প্রতিবেদন ১৫ তারিখের মধ্যে জমা দিন।", time: now - 2 * DAY, read: true },
  ],
  DISASTER_MANAGEMENT_OFFICER: [
    { id: "n1", kind: "alert", title: "নতুন নিম্নচাপ — বঙ্গোপসাগর", body: "গভীর নিম্নচাপ ঘূর্ণিঝড়ে রূপ নিতে পারে। পর্যবেক্ষণ চ্যানেল সক্রিয়।", time: now - 9 * HOUR, read: false },
    { id: "n2", kind: "verification", title: "খুলনা অঞ্চলে ১৮টি রিপোর্ট পেন্ডিং", body: "জেলার অপেক্ষমাণ যাচাই সারি হালনাগাদ দেখুন।", time: now - 2 * HOUR, read: false },
    { id: "n3", kind: "mission", title: "OP-77 উদ্ধার অভিযান চলমান", body: "দক্ষিণ বেদকাশী — ৩৪ জন উদ্ধার, অভিযান চলছে।", time: now - 70 * MIN, read: false },
    { id: "n4", kind: "system", title: "আঞ্চলিক সমন্বয় সভা", body: "রবিবার সকাল ১১টা — ভিডিও কনফারেন্স লিংক প্রেরিত হয়েছে।", time: now - 1 * DAY, read: true },
  ],
  SYSTEM_ADMINISTRATOR: [
    { id: "n1", kind: "system", title: "এসএমএস গেটওয়ে লেটেন্সি বেড়েছে", body: "গত ১ ঘণ্টায় ডেলিভারি সময়সীমা ৮২০ মি.সে. পর্যবেক্ষণ করুন।", time: now - 30 * MIN, read: false },
    { id: "n2", kind: "report", title: "নতুন ব্যবহারকারী নিবন্ধন স্পাইক", body: "শেষ ২৪ ঘণ্টায় ২১৪ জন নতুন নাগরিক যুক্ত হয়েছেন।", time: now - 90 * MIN, read: false },
    { id: "n3", kind: "verification", title: "যাচাই সারি — ১৮টি পেন্ডিং", body: "ভূমিকা-ভিত্তিক যাচাইঃ স্থানীয় প্রশাসন কর্তৃক বিলম্বিত।", time: now - 3 * HOUR, read: true },
    { id: "n4", kind: "system", title: "সাপ্তাহিক ব্যাকআপ সম্পন্ন", body: "ডাটাবেস ব্যাকআপ সফলভাবে সংরক্ষিত হয়েছে।", time: now - 1 * DAY, read: true },
  ],
};

export const activities = {
  CITIZEN: [
    { id: "a1", kind: "report", title: "দুর্যোগ রিপোর্ট জমা দেওয়া হয়েছে", place: "মহারাজপুর, কয়রা", time: now - 2 * HOUR },
    { id: "a2", kind: "shelter", title: "আশ্রয়কেন্দ্রের তথ্য আপডেট হয়েছে", place: "দাকোপ, খুলনা", time: now - 6 * HOUR },
    { id: "a3", kind: "alert", title: "জরুরি সতর্কতা জারি হয়েছে", place: "খুলনা অঞ্চল", time: now - 12 * HOUR },
    { id: "a4", kind: "mission", title: "উদ্ধার কার্যক্রম শুরু হয়েছে", place: "দক্ষিণ বেদকাশী", time: now - 1 * DAY },
  ],
  COMMUNITY_VOLUNTEER: [
    { id: "a1", kind: "mission", title: "নিবন্ধন সহায়তা চলমান", place: "মুজিব কিল্লা, কয়রা", time: now - 1 * HOUR },
    { id: "a2", kind: "report", title: "কমিউনিটি রিপোর্ট যাচাই সহায়তা", place: "মহারাজপুর", time: now - 3 * HOUR },
    { id: "a3", kind: "shelter", title: "আশ্রয়কেন্দ্র মজুদ তালিকা আপডেট", place: "কয়রা সদর", time: now - 1 * DAY },
    { id: "a4", kind: "mission", title: "সচেতনতা মাইকিং সম্পন্ন", place: "কয়রা সদর", time: now - 2 * DAY },
  ],
  default: [
    { id: "a1", kind: "alert", title: "জরুরি সতর্কতা জারি হয়েছে", place: "খুলনা অঞ্চল", time: now - 20 * MIN },
    { id: "a2", kind: "report", title: "দুর্যোগ রিপোর্ট যাচাইকৃত", place: "কয়রা, খুলনা", time: now - 2 * HOUR },
    { id: "a3", kind: "shelter", title: "আশ্রয়কেন্দ্রের তথ্য আপডেট হয়েছে", place: "দাকোপ, খুলনা", time: now - 4 * HOUR },
    { id: "a4", kind: "mission", title: "উদ্ধার কার্যক্রম শুরু হয়েছে", place: "প্রতাপনগর", time: now - 6 * HOUR },
    { id: "a5", kind: "system", title: "নতুন নির্দেশিকা প্রকাশিত", place: "পরিকল্পনা বাহিনী", time: now - 1 * DAY },
  ],
};

export const systemActivity = [
  { id: "s1", kind: "user", title: "নতুন ব্যবহারকারী নিবন্ধন", body: "সালেহা বেগম — নাগরিক, পাথরঘাটা, বরগুনা", time: now - 18 * MIN },
  { id: "s2", kind: "report", title: "নতুন দুর্যোগ রিপোর্ট জমা", body: "RPT-2571 — দক্ষিণ বেদকাশী, কয়রা (জলোচ্ছ্বাস)", time: now - 35 * MIN },
  { id: "s3", kind: "verification", title: "রিপোর্ট যাচাই সম্পন্ন", body: "RPT-2569 — শ্যামনগর উপজেলা প্রশাসন", time: now - 58 * MIN },
  { id: "s4", kind: "shelter", title: "আশ্রয়কেন্দ্র মজুদ আপডেট", body: "শ্যামনগর আশ্রয়কেন্দ্র — ধারণক্ষমতা ৯২%", time: now - 2 * HOUR },
  { id: "s5", kind: "mission", title: "উদ্ধার অভিযান চালু", body: "OP-77 — দক্ষিণ বেদকাশী, ২টি দল মোতায়েন", time: now - 70 * MIN },
  { id: "s6", kind: "user", title: "নতুন উদ্ধারকারী যোগদান", body: "নূরুল আমিন — টেকনাফ, ককসবাজার", time: now - 5 * HOUR },
];

export const disasterTypeRows = [
  { key: "surge", occurrences: 86, activeAlerts: 4, season: "জ্যৈষ্ঠ–ভাদ্র, কার্তিক", guideline: "জলোচ্ছ্বাস প্রস্তুতি নির্দেশিকা ৪.২" },
  { key: "cyclone", occurrences: 64, activeAlerts: 2, season: "বৈশাখ–জ্যৈষ্ঠ, কার্তিক", guideline: "ঘূর্ণিঝড় ব্যবস্থাপনা SOP ৩.১" },
  { key: "erosion", occurrences: 41, activeAlerts: 1, season: "সারা বছর", guideline: "ভাঙন জরুরি প্রটোকল ২.০" },
  { key: "flood", occurrences: 33, activeAlerts: 2, season: "বর্ষা মৌসুম", guideline: "বন্যা সাড়া নির্দেশিকা ১.৯" },
  { key: "salinity", occurrences: 18, activeAlerts: 0, season: "শুকনো মৌসুম", guideline: "লবণাক্ততা পর্যবেক্ষণ পদ্ধতি ১.২" },
  { key: "fire", occurrences: 12, activeAlerts: 0, season: "শীত–গ্রীষ্ম", guideline: "অগ্নি নিরাপত্তা ম্যানুয়াল" },
];

export const availabilityLog = [
  { status: "ON_MISSION", note: "MSN-114 — দক্ষিণ বেদকাশী উদ্ধার", time: now - 70 * MIN },
  { status: "AVAILABLE", note: "নিয়মিত ডিউটিতে ফিরেছি", time: now - 2 * DAY },
  { status: "UNAVAILABLE", note: "ব্যক্তিগত কারণ — ১ দিন", time: now - 5 * DAY },
  { status: "AVAILABLE", note: "সাপ্তাহিক ডিউটি শুরু", time: now - 6 * DAY },
];

/* -------- In-memory mutations (replace with API writes) -------- */
let reportSeq = 2572;
export const mockAddReport = (payload) => {
  const report = {
    id: `RPT-${reportSeq++}`,
    status: "PENDING",
    verifiedBy: null,
    time: Date.now(),
    ...payload,
  };
  reports.unshift(report);
  myReports.unshift({ ...report });
  return report;
};

export const mockVerifyReport = (id, action, by = "কয়রা উপজেলা প্রশাসন") => {
  const r = reports.find((x) => x.id === id);
  if (r) {
    r.status = action === "VERIFY" ? "VERIFIED" : "REJECTED";
    r.verifiedBy = by;
  }
  return r;
};

export const mockMarkAllRead = (role) => {
  (notifications[role] || []).forEach((n) => (n.read = true));
};

export const mockSetAvailability = (user, status) => {
  user.availability = status;
  availabilityLog.unshift({ status, note: "নিজে থেকে আপডেট করা হয়েছে", time: Date.now() });
};

export const mockCompleteTask = (id) => {
  const t = assistanceTasks.find((x) => x.id === id);
  if (t) t.status = "DONE";
};
