/**
 * Authentication service backed by the Django REST API.
 */
import myaxios from "../../utils/myaxios";

const SESSION_KEY = "cgbd.session";
const TOKEN_KEY = "token";

/** Strip anything that must never reach the UI (defense-in-depth). */
const sanitizeUser = (u) => {
  if (!u) return null;
  const safe = { ...u };
  delete safe.password;
  delete safe.otp;
  delete safe.otp_created_at;
  delete safe.is_superuser;
  delete safe.is_staff;
  return safe;
};

export const authService = {
  async login(username, password) {
    try {
      const response = await myaxios.post("auth/login/", { username, password });
      const token = response.data?.token;
      if (!token) throw new Error("লগইন টোকেন পাওয়া যায়নি");

      localStorage.setItem(TOKEN_KEY, token);
      const user = await this.me();
      if (!user) throw new Error("ব্যবহারকারীর তথ্য পাওয়া যায়নি");
      return user;
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(SESSION_KEY);
      const message = error.response?.data?.error || error.message;
      throw new Error(message || "লগইন করা যায়নি", { cause: error });
    }
  },

  async me() {
  try {
    const response = await myaxios.get("users/me/");

    const profile = response.data?.data;

    if (!profile) return null;

    let volunteerProfile = null;
    if (profile.role === "COMMUNITY_VOLUNTEER") {
      try {
        const profileResponse = await myaxios.get("users/me/profile/");
        volunteerProfile = profileResponse.data?.data;
      } catch (error) {
        console.error("Failed to fetch volunteer profile:", error);
      }
    }

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
        ? volunteerProfile?.availability_status || "AVAILABLE"
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
    void myaxios.post("auth/logout/").catch(() => undefined);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
  },
};
