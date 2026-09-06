/**
 * Bangla localization helpers — digits, dates, relative time, initials, phone.
 * ICU-independent (works the same in every Node/browser runtime).
 */

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
export function toBanglaDigits(value) {
  return String(value).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}
const BN_MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];
function parseDate(iso) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "2026-08-12" → "১২ আগস্ট ২০২৬" */
export function formatDateBn(iso) {
  if (!iso) return null;
  const date = parseDate(iso);
  if (!date) return null;
  return `${toBanglaDigits(date.getDate())} ${BN_MONTHS[date.getMonth()]} ${toBanglaDigits(date.getFullYear())}`;
}
function banglaPeriod(hour) {
  if (hour >= 4 && hour < 6) return "ভোর";
  if (hour >= 6 && hour < 12) return "সকাল";
  if (hour >= 12 && hour < 16) return "দুপুর";
  if (hour >= 16 && hour < 18) return "বিকাল";
  if (hour >= 18 && hour < 20) return "সন্ধ্যা";
  return "রাত";
}
function formatTimeBn(date) {
  const hour24 = date.getHours();
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${banglaPeriod(hour24)} ${toBanglaDigits(hour12)}:${toBanglaDigits(minutes)}`;
}

/** "১২ আগস্ট ২০২৬, সকাল ৯:১৫" */
export function formatDateTimeBn(iso) {
  if (!iso) return null;
  const date = parseDate(iso);
  if (!date) return null;
  return `${formatDateBn(iso)}, ${formatTimeBn(date)}`;
}

/** "আজ, রাত ১১:৪২" / "গতকাল, বিকাল ৪:৩০" / falls back to full date */
export function formatRelativeBn(iso) {
  if (!iso) return null;
  const date = parseDate(iso);
  if (!date) return null;
  const now = new Date();
  const startOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dayDiff = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);
  if (dayDiff === 0) {
    const minutesAgo = Math.floor((now.getTime() - date.getTime()) / 60_000);
    if (minutesAgo >= 0 && minutesAgo < 2) return "এইমাত্র সক্রিয়";
    return `আজ, ${formatTimeBn(date)}`;
  }
  if (dayDiff === 1) return `গতকাল, ${formatTimeBn(date)}`;
  return formatDateTimeBn(iso);
}

/** "01715432108" → "০১৭১৫-৪৩২১০৮" */
export function formatPhoneBn(phone) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  const formatted =
    digits.length === 11 && digits.startsWith("01")
      ? `${digits.slice(0, 5)}-${digits.slice(5)}`
      : phone;
  return toBanglaDigits(formatted);
}

/** "Sumon Roy" → "SR", "সুমন রায়" → "সুরা" */
export function getInitials(name) {
  if (!name) return "ব্য";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "ব্য";
  const first = Array.from(words[0])[0] ?? "";
  const last =
    words.length > 1 ? (Array.from(words[words.length - 1])[0] ?? "") : "";
  return (first + last).toUpperCase();
}

/** ঘন্টা-ভিত্তিক অভিবাদন */
export function banglaGreeting() {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 6) return "শুভ ভোর";
  if (hour >= 6 && hour < 12) return "শুভ সকাল";
  if (hour >= 12 && hour < 16) return "শুভ দুপুর";
  if (hour >= 16 && hour < 18) return "শুভ বিকাল";
  if (hour >= 18 && hour < 20) return "শুভ সন্ধ্যা";
  return "শুভ রাত্রি";
}
