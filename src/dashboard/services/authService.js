/**
 * Authentication service — mock-backed, shaped like the real DRF auth API.
 * Swap login()/me() internals with http() calls when backend connects.
 */
import { mockRequest } from "./api";
import { users } from "./mock/mockData";
import myaxios from "../../utils/myaxios";

const SESSION_KEY = "cgbd.session";

/** Strip anything that must never reach the UI (defense-in-depth). */
const sanitizeUser = (u) => {
  if (!u) return null;
  const { password, otp, otp_created_at, is_superuser, is_staff, ...safe } = u;
  return safe;
};

export const authService = {
  async login(phoneRaw, _password) {
    // Real implementation: await http('/auth/login/', { method:'POST', body:{ phone, password } })
    const found = users.find((u) => u.phoneRaw === phoneRaw);
    const user = await mockRequest(() => found || null);
    if (!user) throw new Error("মোবাইল নম্বর বা পাসওয়ার্ড সঠিক নয়");
    return this.persist(user);
  },

  /** One-tap demo login used by the demo role panel on the login screen. */
  async loginWithRole(role) {
    const user = await mockRequest(() => users.find((u) => u.role === role) || users[0], [220, 420]);
    return this.persist(user);
  },

  async register(payload) {
    // Real implementation: await http('/auth/register/', { method:'POST', body })
    const user = await mockRequest(() => ({
      id: `u-${Date.now()}`,
      name: payload.name,
      nameEn: payload.nameEn || payload.name,
      role: payload.role || "CITIZEN",
      phone: payload.phoneDisplay,
      phoneRaw: payload.phoneRaw,
      email: payload.email || "",
      division: payload.division,
      district: payload.district,
      upazila: payload.upazila,
      availability: payload.role === "COMMUNITY_VOLUNTEER" ? "AVAILABLE" : undefined,
      joinedAt: Date.now(),
    }));
    return this.persist(user);
  },

  async me() {
  try {
    const response = await myaxios.get("users/me/");

    const profile = response.data?.data;

    if (!profile) return null;

    const user = {
      id: profile.id,
      name: profile.full_name,
      nameEn: profile.full_name,
      role: profile.role,
      phone: profile.phone_number,
      phoneRaw: profile.phone_number,
      email: profile.email || "",
      district: profile.district || "",
      availability: profile.role === "COMMUNITY_VOLUNTEER"
        ? "AVAILABLE"
        : undefined,
      joinedAt: profile.date_joined,
    };

    return this.persist(user);
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return null;
  }
},

  persist(user) {
    const safe = sanitizeUser(user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
    return safe;
  },

  updateSession(patch) {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const next = { ...JSON.parse(raw), ...patch };
    localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    return next;
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },
};
