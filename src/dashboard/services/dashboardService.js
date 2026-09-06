/**
 * ============================================================
 *  DASHBOARD SERVICE  (mock-backed — swap internals for DRF)
 * ============================================================
 *  Components never touch mockData directly; they call these
 *  functions. Each returns a Promise via the transport layer
 *  so loading / error / retry states behave like the real API.
 * ============================================================
 */
import { mockRequest } from "./api";
import {
  activeDisasters,
  activities,
  adminUserRows,
  areaTree,
  assistanceTasks,
  availabilityLog,
  awarenessItems,
  disasterTypeRows,
  districtRisk,
  mapDistricts,
  missions,
  mockAddReport,
  mockCompleteTask,
  mockMarkAllRead,
  mockSetAvailability,
  mockVerifyReport,
  monthlyTrend,
  myReports,
  notifications,
  operations,
  reports,
  reportsByType,
  rescueRequests,
  shelters,
  systemActivity,
  systemServices,
  teams,
  userDistribution,
} from "./mock/mockData";

const pendingCount = () => reports.filter((r) => r.status === "PENDING").length;
const openRequests = () => rescueRequests.filter((r) => r.status === "OPEN");
const unread = (role) => (notifications[role] || []).filter((n) => !n.read).length;
const criticalDisasters = () => activeDisasters.filter((d) => d.severity === "CRITICAL" || d.severity === "HIGH");

/* ================= Public / shared getters ================= */

export const dashboardService = {
  /* ---------- Sidebar badges ---------- */
  getBadgeCounts(role) {
    return mockRequest(() => ({
      notifications: unread(role),
      reports: role === "CITIZEN" ? myReports.length : reports.length,
      myReports: myReports.length,
      verification: pendingCount(),
      requests: openRequests().length,
      missions: missions.filter((m) => m.status !== "DONE").length,
      operations: operations.filter((o) => o.status === "IN_PROGRESS").length,
      community: reports.filter((r) => r.upazila === "কয়রা" || r.district === "খুলনা").length,
      assistance: assistanceTasks.filter((t) => t.status !== "DONE").length,
      monitoring: criticalDisasters().length,
    }));
  },

  getNotifications(role) {
    return mockRequest(() => notifications[role] || notifications.default || []);
  },

  async markAllNotificationsRead(role) {
    mockMarkAllRead(role);
    return mockRequest(() => notifications[role] || []);
  },

  getReports(scope = "all", user) {
    return mockRequest(() => {
      if (scope === "mine") return myReports;
      if (scope === "community") return reports.filter((r) => ["খুলনা", "সাতক্ষীরা", "বাগেরহাট"].includes(r.district));
      if (scope === "pending") return reports.filter((r) => r.status === "PENDING");
      return reports;
    });
  },

  getShelters(filter = {}) {
    return mockRequest(() =>
      shelters.filter((s) => !filter.district || filter.district === "সব" || s.district === filter.district)
    );
  },

  getMapData() {
    return mockRequest(() => ({ reports, shelters, activeDisasters, mapDistricts }));
  },

  getAwareness() {
    return mockRequest(() => awarenessItems);
  },

  getPublicOverview() {
    return mockRequest(() => ({
      stats: {
        activeDisasters: activeDisasters.length,
        shelters: shelters.length,
        volunteers: 312,
        reportsToday: 48,
      },
      alert: criticalDisasters()[0] || null,
      shelters: shelters.slice(0, 3),
      mapDistricts,
      reports: reports.slice(0, 5),
    }));
  },

  /* ================= Role overview payloads ================= */

  getCitizenOverview() {
    return mockRequest(() => ({
      stats: [
        { key: "myReports", label: "আমার রিপোর্ট", value: myReports.length, hint: "মোট জমা দেওয়া রিপোর্ট", tone: "lagoon", icon: "NotebookPen" },
        { key: "active", label: "সক্রিয় দুর্যোগ", value: activeDisasters.length, hint: "আপনার অঞ্চলের আশেপাশে", tone: "amber", icon: "TriangleAlert", delta: { dir: "up", label: "২টি নতুন এ সপ্তাহে" } },
        { key: "shelters", label: "নিকটস্থ আশ্রয়কেন্দ্র", value: shelters.filter((s) => s.district === "খুলনা").length, hint: "কয়রা অঞ্চলে সক্রিয়", tone: "sky", icon: "Warehouse" },
        { key: "warning", label: "জরুরি সতর্কতা", valueText: "বিপৎ সংকেত ৬", hint: "ঘূর্ণিঝড় সতর্কতা জারি আছে", tone: "red", icon: "Siren" },
      ],
      alert: criticalDisasters()[0],
      activities: activities.CITIZEN,
      myReports: myReports.slice(0, 4),
      shelters: shelters.filter((s) => s.district === "খুলনা").slice(0, 3),
    }));
  },

  getVolunteerOverview() {
    return mockRequest(() => ({
      stats: [
        { key: "incidents", label: "স্থানীয় সক্রিয় ঘটনা", value: 8, hint: "খুলনা অঞ্চলে", tone: "amber", icon: "Activity", delta: { dir: "up", label: "৩টি নতুন আজ" } },
        { key: "pending", label: "অপেক্ষমাণ রিপোর্ট", value: pendingCount(), hint: "যাচাই প্রয়োজন", tone: "lagoon", icon: "ClipboardList" },
        { key: "tasks", label: "নির্ধারিত কার্যক্রম", value: assistanceTasks.filter((t) => t.status !== "DONE").length, hint: "আপনার জন্য বরাদ্দ", tone: "sky", icon: "ListChecks" },
        { key: "people", label: "সহায়তাপ্রয়োজন মানুষ", value: 23, hint: "নিবন্ধিত তালিকা অনুযায়ী", tone: "emerald", icon: "HandHeart" },
      ],
      alert: criticalDisasters()[0],
      tasks: assistanceTasks,
      communityReports: reports.filter((r) => ["খুলনা", "সাতক্ষীরা"].includes(r.district)).slice(0, 5),
      activities: activities.COMMUNITY_VOLUNTEER,
      area: { district: "খুলনা", upazila: "কয়রা", incidents: 8, shelters: 3, volunteers: 24 },
    }));
  },

  getResponderOverview() {
    return mockRequest(() => ({
      stats: [
        { key: "missions", label: "সক্রিয় মিশন", value: missions.filter((m) => m.status === "IN_PROGRESS").length, hint: "এই মুহূর্তে চলমান", tone: "red", icon: "Target" },
        { key: "requests", label: "অপেক্ষমাণ জরুরি অনুরোধ", value: openRequests().length, hint: "সাড়া প্রয়োজন", tone: "amber", icon: "Siren", delta: { dir: "up", label: "২টি নতুন" } },
        { key: "critical", label: "উচ্চ অগ্রাধিকার ঘটনা", value: reports.filter((r) => ["HIGH", "CRITICAL"].includes(r.severity) && r.status !== "RESOLVED").length, hint: "খুলনা অঞ্চলে", tone: "orange", icon: "ShieldAlert" },
        { key: "done", label: "সম্পন্ন মিশন", value: 28, hint: "চলতি বছরে", tone: "emerald", icon: "CircleCheck" },
      ],
      alert: criticalDisasters()[0],
      missions,
      requests: rescueRequests.slice(0, 5),
      activities: activities.default,
    }));
  },

  getAuthorityOverview() {
    return mockRequest(() => ({
      stats: [
        { key: "total", label: "সর্বমোট স্থানীয় রিপোর্ট", value: 45, hint: "কয়রা উপজেলায়", tone: "lagoon", icon: "FileText" },
        { key: "pending", label: "যাচাই অপেক্ষিত", value: pendingCount(), hint: "দ্রুত পদক্ষেপ প্রয়োজন", tone: "amber", icon: "BadgeCheck" },
        { key: "active", label: "সক্রিয় দুর্যোগ", value: activeDisasters.length, hint: "অঞ্চল জুড়ে", tone: "orange", icon: "TriangleAlert" },
        { key: "shelters", label: "সক্রিয় আশ্রয়কেন্দ্র", value: shelters.filter((s) => s.status !== "READY").length, hint: "জনবল ও মজুদ সচল", tone: "sky", icon: "Warehouse" },
        { key: "ops", label: "চলমান উদ্ধার অভিযান", value: operations.filter((o) => o.status === "IN_PROGRESS").length, hint: "সমন্বয়াধীন", tone: "emerald", icon: "LifeBuoy" },
      ],
      alert: criticalDisasters()[0],
      verificationQueue: reports.filter((r) => r.status === "PENDING").slice(0, 6),
      shelters: shelters.filter((s) => s.district === "খুলনা").slice(0, 4),
      operations,
      area: { district: "খুলনা জেলা", upazila: "কয়রা উপজেলা", unions: 7, villages: 42, population: "১.৬৫ লক্ষ" },
      activities: activities.default,
    }));
  },

  getOfficerOverview() {
    return mockRequest(() => ({
      stats: [
        { key: "active", label: "সক্রিয় দুর্যোগ", value: activeDisasters.length, hint: "খুলনা অঞ্চল", tone: "red", icon: "Radar" },
        { key: "riskAreas", label: "উচ্চ ঝুঁকিপূর্ণ এলাকা", value: districtRisk.filter((d) => d.risk >= 60).length, hint: "পূর্বাভাস বিশ্লেষণে", tone: "amber", icon: "MapPinned" },
        { key: "pending", label: "অপেক্ষমাণ রিপোর্ট", value: 18, hint: "যাচাই সারিতে", tone: "lagoon", icon: "ClipboardList" },
        { key: "ops", label: "চলমান উদ্ধার অভিযান", value: operations.filter((o) => o.status === "IN_PROGRESS").length, hint: "৩টি জেলায়", tone: "sky", icon: "LifeBuoy" },
        { key: "shelters", label: "উপলব্ধ আশ্রয়কেন্দ্র", value: shelters.filter((s) => ["OPEN", "READY"].includes(s.status)).length, hint: "মোট ধারণক্ষমতা ১৬,৭০০", tone: "emerald", icon: "Warehouse" },
        { key: "verified", label: "যাচাইকৃত ঘটনা", value: reports.filter((r) => r.status === "VERIFIED").length + 26, hint: "চলতি মৌসুমে", tone: "sand", icon: "BadgeCheck" },
      ],
      alert: criticalDisasters()[0],
      region: { name: "খুলনা অঞ্চল", alerts: 4, highRisk: 7, pending: 18, districts: districtRisk.slice(0, 5) },
      reportsByType,
      monthlyTrend,
      priorityReports: reports.filter((r) => ["HIGH", "CRITICAL"].includes(r.severity) && r.status !== "RESOLVED").slice(0, 5),
      operations,
    }));
  },

  getAdminOverview() {
    return mockRequest(() => ({
      stats: [
        { key: "users", label: "মোট ব্যবহারকারী", value: 2332, hint: "সব ভূমিকা মিলিয়ে", tone: "lagoon", icon: "Users", delta: { dir: "up", label: "২১৪ জন এ সপ্তাহে" } },
        { key: "citizens", label: "সক্রিয় নাগরিক", value: 1840, hint: "গত ৩০ দিনে সক্রিয়", tone: "sky", icon: "CircleUser" },
        { key: "volunteers", label: "সক্রিয় স্বেচ্ছাসেবক", value: 312, hint: "১৪টি জেলায়", tone: "emerald", icon: "HandHeart" },
        { key: "responders", label: "সক্রিয় উদ্ধারকারী", value: 96, hint: "প্রস্তুত ও মিশনে", tone: "amber", icon: "LifeBuoy" },
        { key: "reports", label: "মোট দুর্যোগ রিপোর্ট", value: reports.length + 241, hint: "চলতি মৌসুমে", tone: "orange", icon: "FileText" },
        { key: "active", label: "সক্রিয় দুর্যোগ", value: activeDisasters.length, hint: "দেশজুড়ে", tone: "red", icon: "TriangleAlert" },
        { key: "shelters", label: "নিবন্ধিত আশ্রয়কেন্দ্র", value: shelters.length + 108, hint: "১৯টি উপকূলীয় জেলায়", tone: "sky", icon: "Warehouse" },
        { key: "pending", label: "যাচাই অপেক্ষিত", value: 18, hint: "ভূমিকা-ভিত্তিক সারি", tone: "sand", icon: "BadgeCheck" },
      ],
      userDistribution,
      reportsByType,
      monthlyTrend,
      systemActivity,
      services: systemServices,
    }));
  },

  /* ================= Section page data (generic) ================= */

  getSectionData(key, user) {
    const role = user?.role;
    const builders = {
      /* ----- shared-ish ----- */
      missions: () => ({
        stats: [
          { label: "সক্রিয় মিশন", value: missions.filter((m) => m.status === "IN_PROGRESS").length, tone: "red", icon: "Target" },
          { label: "বরাদ্দকৃত", value: missions.filter((m) => m.status === "ASSIGNED").length, tone: "amber", icon: "ClipboardList" },
          { label: "সম্পন্ন", value: 28, tone: "emerald", icon: "CircleCheck" },
        ],
        blocks: [{ type: "missionCards", title: "আপনার মিশনসমূহ", items: missions }],
      }),
      "rescue-requests": () => ({
        stats: [
          { label: "খোলা অনুরোধ", value: openRequests().length, tone: "red", icon: "Siren" },
          { label: "বরাদ্দকৃত", value: rescueRequests.filter((r) => r.status === "ASSIGNED").length, tone: "amber", icon: "UserCheck" },
          { label: "আজ সম্পন্ন", value: 6, tone: "emerald", icon: "CircleCheck" },
        ],
        blocks: [{ type: "requestCards", title: "জরুরি অনুরোধসমূহ", items: rescueRequests }],
      }),
      "rescue-operations": () => ({
        stats: [
          { label: "চলমান অভিযান", value: operations.filter((o) => o.status === "IN_PROGRESS").length, tone: "red", icon: "LifeBuoy" },
          { label: "মোতায়েন দল", value: operations.filter((o) => o.status === "IN_PROGRESS").reduce((a, o) => a + o.teams, 0), tone: "sky", icon: "Users" },
          { label: "উদ্ধারকৃত (৭২ ঘণ্টা)", value: operations.reduce((a, o) => a + o.rescued, 0), tone: "emerald", icon: "HandHeart" },
        ],
        blocks: [{ type: "operationCards", title: "উদ্ধার অভিযানসমূহ", items: operations }],
      }),
      verification: () => ({
        stats: [
          { label: "যাচাই অপেক্ষিত", value: pendingCount(), tone: "amber", icon: "BadgeCheck" },
          { label: "আজ যাচাইকৃত", value: 9, tone: "emerald", icon: "CircleCheck" },
          { label: "গড় সাড়াদান", valueText: "২.৪ ঘণ্টা", tone: "lagoon", icon: "Timer" },
        ],
        blocks: [{ type: "verificationTable", title: "যাচাই সারি", items: reports.filter((r) => r.status === "PENDING") }],
      }),
      "community-reports": () => ({
        stats: [
          { label: "আজকের রিপোর্ট", value: 12, tone: "lagoon", icon: "FileText", delta: { dir: "up", label: "৪টি নতুন" } },
          { label: "যাচাই অপেক্ষিত", value: pendingCount(), tone: "amber", icon: "BadgeCheck" },
          { label: "উচ্চ অগ্রাধিকার", value: 5, tone: "red", icon: "ShieldAlert" },
        ],
        blocks: [{ type: "reportTable", title: "কমিউনিটি রিপোর্ট (খুলনা অঞ্চল)", items: reports.filter((r) => ["খুলনা", "সাতক্ষীরা", "বাগেরহাট"].includes(r.district)) }],
      }),
      assistance: () => ({
        stats: [
          { label: "নির্ধারিত কার্যক্রম", value: assistanceTasks.filter((t) => t.status !== "DONE").length, tone: "lagoon", icon: "ListChecks" },
          { label: "চলমান", value: assistanceTasks.filter((t) => t.status === "ONGOING").length, tone: "amber", icon: "Activity" },
          { label: "এ মাসে সম্পন্ন", value: 11, tone: "emerald", icon: "CircleCheck" },
        ],
        blocks: [{ type: "taskCards", title: "সহায়তা কার্যক্রম", items: assistanceTasks }],
      }),
      "my-area": () => ({
        stats: [
          { label: "সক্রিয় ঘটনা", value: 8, tone: "amber", icon: "Activity" },
          { label: "আশ্রয়কেন্দ্র", value: 3, tone: "sky", icon: "Warehouse" },
          { label: "নিবন্ধিত স্বেচ্ছাসেবক", value: 24, tone: "emerald", icon: "HandHeart" },
        ],
        blocks: [
          { type: "areaPanel", title: "কয়রা, খুলনা", subtitle: "আপনার দায়িত্বপূর্ণ এলাকা", area: { unions: 7, villages: 42, population: "১.৬৫ লক্ষ", risk: districtRisk.find((d) => d.district === "খুলনা") } },
          { type: "reportTable", title: "এলাকার সাম্প্রতিক রিপোর্ট", items: reports.filter((r) => r.district === "খুলনা").slice(0, 5) },
        ],
      }),
      awareness: () => ({
        stats: [],
        blocks: [{ type: "awarenessCards", items: awarenessItems }],
      }),
      /* ----- officer ----- */
      monitoring: () => ({
        stats: [
          { label: "সক্রিয় সতর্কতা", value: 4, tone: "red", icon: "Radar" },
          { label: "পর্যবেক্ষণাধীন এলাকা", value: 9, tone: "amber", icon: "MapPinned" },
          { label: "চলমান অভিযান", value: 3, tone: "sky", icon: "LifeBuoy" },
        ],
        blocks: [
          { type: "disasterCards", title: "সক্রিয় দুর্যোগ পরিস্থিতি", items: activeDisasters },
          { type: "riskBars", title: "জেলাভিত্তিক ঝুঁকি সূচক", items: districtRisk },
        ],
      }),
      "risk-analysis": () => ({
        stats: [
          { label: "উচ্চ ঝুঁকি জেলা", value: districtRisk.filter((d) => d.risk >= 60).length, tone: "red", icon: "MapPinned" },
          { label: "বর্ধমান প্রবণতা", value: districtRisk.filter((d) => d.trend === "up").length, tone: "amber", icon: "TrendingUp" },
          { label: "মোট পর্যবেক্ষণ পয়েন্ট", value: 118, tone: "lagoon", icon: "Radar" },
        ],
        blocks: [
          { type: "riskBars", title: "জেলাভিত্তিক ঝুঁকি সূচক (শতাংশ)", items: districtRisk },
          { type: "typeDonut", title: "ধরনভিত্তিক ঘটনা বন্টন", items: reportsByType },
        ],
      }),
      areas: () => ({
        stats: [
          { label: "বিভাগ", value: 3, tone: "lagoon", icon: "Landmark" },
          { label: "উপকূলীয় জেলা", value: 10, tone: "sky", icon: "MapPinned" },
          { label: "দুর্যোগপ্রবণ ইউনিয়ন", value: 134, tone: "amber", icon: "TriangleAlert" },
        ],
        blocks: [{ type: "areaTreeCards", title: "প্রশাসনিক কাঠামো", items: areaTree }],
      }),
      /* ----- admin ----- */
      users: () => ({
        stats: [
          { label: "মোট ব্যবহারকারী", value: 2332, tone: "lagoon", icon: "Users", delta: { dir: "up", label: "২১৪ জন এ সপ্তাহে" } },
          { label: "আজ যোগদান", value: 26, tone: "emerald", icon: "UserCheck" },
          { label: "যাচাই বাকি", value: 11, tone: "amber", icon: "BadgeCheck" },
        ],
        blocks: [{ type: "userTable", title: "সাম্প্রতিক নিবন্ধিত ব্যবহারকারী", items: adminUserRows }],
      }),
      "disaster-types": () => ({
        stats: [
          { label: "সংজ্ঞায়িত ধরন", value: 6, tone: "lagoon", icon: "Layers" },
          { label: "সক্রিয় সতর্কতা", value: disasterTypeRows.reduce((a, t) => a + t.activeAlerts, 0), tone: "red", icon: "Siren" },
          { label: "এ মৌসুমে ঘটনা", value: disasterTypeRows.reduce((a, t) => a + t.occurrences, 0), tone: "sky", icon: "ChartColumn" },
        ],
        blocks: [{ type: "typeCards", title: "দুর্যোগের ধরনসমূহ", items: disasterTypeRows }],
      }),
      "rescue-teams": () => ({
        stats: [
          { label: "মোট দল", value: teams.length + 24, tone: "lagoon", icon: "Users" },
          { label: "মিশনে নিয়োজিত", value: teams.filter((t) => t.status === "ON_MISSION").length, tone: "amber", icon: "Target" },
          { label: "প্রস্তুত দল", value: teams.filter((t) => t.status === "READY").length + 14, tone: "emerald", icon: "CircleCheck" },
        ],
        blocks: [{ type: "teamCards", title: "উদ্ধারকারী দলসমূহ", items: teams }],
      }),
      "system-monitoring": () => ({
        stats: [
          { label: "সকল সার্ভিস সচল", valueText: "৪/৫", tone: "lagoon", icon: "Server" },
          { label: "API আপটাইম", valueText: "৯৯.৯৭%", tone: "emerald", icon: "Gauge" },
          { label: "গড় প্রতিক্রিয়া", valueText: "১৪২ মি.সে.", tone: "sky", icon: "Timer" },
        ],
        blocks: [
          { type: "healthList", title: "সার্ভিস স্বাস্থ্য", items: systemServices },
          { type: "timeline", title: "সাম্প্রতিক সিস্টেম কার্যক্রম", items: systemActivity },
        ],
      }),
    };

    const builder = builders[key];
    if (!builder) return mockRequest(() => ({ stats: [], blocks: [] }));
    return mockRequest(builder);
  },

  getAvailabilityHistory() {
    return mockRequest(() => availabilityLog);
  },

  getProfileData(user) {
    const statsByRole = {
      CITIZEN: [
        { label: "মোট রিপোর্ট", value: myReports.length, tone: "lagoon", icon: "NotebookPen" },
        { label: "যাচাইকৃত", value: myReports.filter((r) => ["VERIFIED", "IN_PROGRESS", "RESOLVED"].includes(r.status)).length, tone: "emerald", icon: "BadgeCheck" },
        { label: "সমাধান হয়েছে", value: myReports.filter((r) => r.status === "RESOLVED").length, tone: "sky", icon: "CircleCheck" },
      ],
      COMMUNITY_VOLUNTEER: [
        { label: "সম্পন্ন কার্যক্রম", value: 11, tone: "emerald", icon: "CircleCheck" },
        { label: "নির্ধারিত আছে", value: assistanceTasks.filter((t) => t.status !== "DONE").length, tone: "amber", icon: "ClipboardList" },
        { label: "যাচাই সহায়তা", value: 34, tone: "lagoon", icon: "BadgeCheck" },
      ],
      RESPONDER: [
        { label: "সম্পন্ন মিশন", value: 28, tone: "emerald", icon: "CircleCheck" },
        { label: "সক্রিয় মিশন", value: missions.filter((m) => m.status === "IN_PROGRESS").length, tone: "red", icon: "Target" },
        { label: "উদ্ধার (চলতি বছর)", value: 164, tone: "sky", icon: "LifeBuoy" },
      ],
      _default: [
        { label: "যাচাইকৃত রিপোর্ট", value: 96, tone: "lagoon", icon: "BadgeCheck" },
        { label: "সমন্বিত অভিযান", value: 12, tone: "sky", icon: "LifeBuoy" },
        { label: "সক্রিয় দিন", value: 240, tone: "emerald", icon: "CalendarDays" },
      ],
    };
    return mockRequest(() => ({
      stats: statsByRole[user.role] || statsByRole._default,
      activities: activities[user.role] || activities.default,
    }));
  },

  /* ================= Mutations ================= */

  async submitReport(payload, user) {
    const report = mockAddReport({
      ...payload,
      reporter: { name: user.name, role: user.role },
      district: user.district,
      upazila: user.upazila,
    });
    return mockRequest(report, [400, 700]);
  },

  async verifyReport(id, action) {
    mockVerifyReport(id, action);
    return mockRequest({ id, action });
  },

  async setAvailability(user, status) {
    mockSetAvailability(user, status);
    return mockRequest({ status });
  },

  async completeTask(id) {
    mockCompleteTask(id);
    return mockRequest({ id });
  },
};
