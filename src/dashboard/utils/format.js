// Bangla number + time formatting helpers

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

/** Convert ASCII digits in any value to Bangla digits */
export const bn = (value) => String(value).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);

/** Format a number with thousand separators + Bangla digits: 2450 → ২,৪৫০ */
export const bnNum = (n) => bn(Number(n || 0).toLocaleString("en-US"));

/** Compact number for charts: 24500 → ২৪.৫ হাজার */
export const bnCompact = (n) => {
  const v = Number(n || 0);
  if (v >= 100000) return `${bn((v / 100000).toFixed(1))} লক্ষ`;
  if (v >= 1000) return `${bn((v / 1000).toFixed(v >= 10000 ? 0 : 1))} হাজার`;
  return bn(v);
};

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

/** Relative time in Bangla: "১৫ মিনিট আগে" */
export const timeAgoBn = (ts) => {
  const diff = Date.now() - Number(ts);
  if (diff < MIN) return "এইমাত্র";
  if (diff < HOUR) return `${bn(Math.floor(diff / MIN))} মিনিট আগে`;
  if (diff < DAY) return `${bn(Math.floor(diff / HOUR))} ঘণ্টা আগে`;
  if (diff < 2 * DAY) return "গতকাল";
  if (diff < 7 * DAY) return `${bn(Math.floor(diff / DAY))} দিন আগে`;
  const d = new Date(ts);
  return `${bn(d.getDate())}/${bn(d.getMonth() + 1)}/${bn(d.getFullYear())}`;
};

/** Clock time with Bangla period: "দুপুর ১২:৩০" */
export const clockBn = (ts) => {
  const d = new Date(ts);
  const h = d.getHours();
  const period =
    h >= 4 && h < 12 ? "সকাল" : h >= 12 && h < 15 ? "দুপুর" : h >= 15 && h < 18 ? "বিকাল" : h >= 18 && h < 20 ? "সন্ধ্যা" : "রাত";
  const hh = h % 12 === 0 ? 12 : h % 12;
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${period} ${bn(hh)}:${bn(mm)}`;
};

/** Full Bangla date: "শুক্রবার, ১৩ জুন ২০২৬" */
const BN_DAYS = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
const BN_MONTHS = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
export const dateBn = (ts = Date.now()) => {
  const d = new Date(ts);
  return `${BN_DAYS[d.getDay()]}, ${bn(d.getDate())} ${BN_MONTHS[d.getMonth()]} ${bn(d.getFullYear())}`;
};

/** Greeting by hour */
export const greetingBn = () => {
  const h = new Date().getHours();
  if (h >= 4 && h < 12) return "শুভ সকাল";
  if (h >= 12 && h < 15) return "শুভ দুপুর";
  if (h >= 15 && h < 18) return "শুভ বিকেল";
  if (h >= 18 && h < 20) return "শুভ সন্ধ্যা";
  return "শুভ রাত্রি";
};
