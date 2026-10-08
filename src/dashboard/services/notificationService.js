/**
 * বিজ্ঞপ্তির একমাত্র ডেটা লেয়ার।
 * পথ, লিমিট, ফলব্যাক — সব notificationConfig.js-এ।
 */
import myaxios from "../../utils/myaxios";
import { NOTIFICATION_CONFIG } from "../config/notificationConfig";
import { mockRequest } from "./api";
import { mockMarkAllRead, mockSetNotificationRead, notifications } from "./mock/mockData";

let lastSource = "api";

const mockList = (role) => notifications[role] || notifications.default || [];

function statusOf(error) {
  return error?.response?.status || error?.status || 0;
}

/** 404 / নেটওয়ার্ক হলে মক। 401/403 হলে খালি — ভুয়া বিজ্ঞপ্তি দেখাবে না। */
function fallbackList(role, error) {
  const status = statusOf(error);
  if (status === 401 || status === 403 || !NOTIFICATION_CONFIG.mockFallback) {
    lastSource = "api";
    if (status === 401 || status === 403) return [];
    throw error;
  }
  lastSource = "mock";
  return null;
}

export const notificationService = {
  get source() {
    return lastSource;
  },

  /**
   * তালিকা + অপঠিত সংখ্যা একসাথে।
   * summary না পেলে তালিকা থেকেই গোনে, যাতে ব্যাজ আর ড্রপডাউন আলাদা না হয়।
   */
  async load(role) {
    try {
      const { data } = await myaxios.get(NOTIFICATION_CONFIG.api.list);
      const items = Array.isArray(data) ? data : [];
      lastSource = "api";
      let unread = items.filter((n) => !n.read).length;
      try {
        const sum = await myaxios.get(NOTIFICATION_CONFIG.api.summary);
        const n = Number(sum.data?.unread);
        if (Number.isFinite(n)) unread = n;
      } catch {
        /* summary না থাকলে তালিকার অপঠিত সংখ্যাই ব্যাজ */
      }
      return { items, unread };
    } catch (error) {
      const mocked = fallbackList(role, error);
      if (mocked !== null) return { items: mocked, unread: 0 };
      const items = await mockRequest(() => mockList(role));
      return { items, unread: items.filter((n) => !n.read).length };
    }
  },

  async list(role) {
    const { items } = await this.load(role);
    return items;
  },

  /** সাইডবার ব্যাজ + টপবারের ঘণ্টা */
  async unreadCount(role) {
    const { unread } = await this.load(role);
    return unread;
  },

  async markAll(role) {
    if (lastSource === "mock") {
      mockMarkAllRead(role);
      return mockRequest(() => mockList(role));
    }
    const { data } = await myaxios.post(NOTIFICATION_CONFIG.api.readAll);
    return data?.items || data || [];
  },

  async setRead(role, id, read) {
    if (lastSource === "mock") {
      mockSetNotificationRead(role, id, read);
      return mockRequest(() => mockList(role).find((n) => n.id === id) || null);
    }
    const { data } = await myaxios.post(NOTIFICATION_CONFIG.api.readOne(id), { read });
    return data?.item || data;
  },
};
