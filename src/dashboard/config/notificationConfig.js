import { bn } from "../utils/format";

/**
 * ============================================================
 *  বিজ্ঞপ্তি সেটিং — শুধু এই ফাইল বদলালেই হবে
 * ============================================================
 *  সাইডবারের "বিজ্ঞপ্তি" ব্যাজ, টপবারের ঘণ্টা,
 *  আর বিজ্ঞপ্তি পেজ — তিনটাই এখান থেকে সংখ্যা ও লিংক নেয়।
 *
 *  ব্যাকএন্ডের লিমিট বদলাতে:
 *    dashboard/notification_service.py  →  LIST_LIMIT
 * ============================================================
 */
export const NOTIFICATION_CONFIG = {
  /** axios baseURL-এর পরের পাথ। শেষে স্ল্যাশ রাখুন। */
  api: {
    list: "dashboard/notifications/",
    summary: "dashboard/notifications/summary/",
    readAll: "dashboard/notifications/read-all/",
    /** একটা বিজ্ঞপ্তি পঠিত / অপঠিত করতে */
    readOne: (id) => `dashboard/notifications/${id}/read/`,
  },

  /**
   * সাইডবারের কোন মেনু-আইটেমে অপঠিত সংখ্যা বসবে।
   * dashboardMenuConfig.js-এর NOTIFICATIONS_ITEM.badgeKey-এর সাথে একই রাখুন।
   */
  badgeKey: "notifications",

  /** এই সংখ্যার বেশি হলে "৯+" / "৯৯+" দেখাবে */
  caps: {
    sidebar: 99,
    topbar: 9,
  },

  /** টপবারের ড্রপডাউনে সর্বোচ্চ কয়টা বিজ্ঞপ্তি */
  dropdownLimit: 5,

  /**
   * কত মিলিসেকেন্ড পর ব্যাজ আবার সার্ভার থেকে আনবে।
   * 0 দিলে অটো রিফ্রেশ বন্ধ।
   */
  pollMs: 30000,

  /**
   * নতুন API না থাকলে (ডেমো লগইন / 404) মক ডেটা দেখাবে।
   * লাইভে সবসময় ডাটাবেস চাইলে false করুন।
   */
  mockFallback: true,

  labels: {
    aria: "বিজ্ঞপ্তি",
    title: "বিজ্ঞপ্তি",
    empty: "কোনো নতুন বিজ্ঞপ্তি নেই",
    seeAll: "সব বিজ্ঞপ্তি দেখুন",
    markAll: "সব পঠিত",
  },

  /**
   * টপবার থেকে একটা বিজ্ঞপ্তিতে ক্লিক করলে কোথায় যাবে।
   * kind ব্যাকএন্ডের notification_type থেকে আসে
   * (alert, report, shelter, mission, verification, system)।
   */
  linksByKind: {
    alert: "/dashboard/notifications",
    report: "/dashboard/reports",
    shelter: "/dashboard/shelters",
    mission: "/dashboard/rescue-operations",
    verification: "/dashboard/verification",
    system: "/dashboard/notifications",
  },
};

/** 12 + cap 9 → "৯+"  |  4 → "৪"  |  0 → "" */
export function formatBadge(count, cap) {
  const n = Number(count) || 0;
  if (n <= 0) return "";
  if (n > cap) return bn(`${cap}+`);
  return bn(n);
}
