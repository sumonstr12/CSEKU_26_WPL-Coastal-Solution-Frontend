/**
 * ============================================================
 *  DASHBOARD SERVICE  (mock-backed — swap internals for DRF)
 * ============================================================
 *  Components never touch mockData directly; they call these
 *  functions. Each returns a Promise via the transport layer
 *  so loading / error / retry states behave like the real API.
 * ============================================================
 */
import myaxios from "../../utils/myaxios";
import { DISASTER_TYPES } from "../config/disasterTypes";
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
const criticalDisasters = () =>
  activeDisasters.filter((d) => d.severity === "CRITICAL" || d.severity === "HIGH");

const sessionRole = () => {
  try {
    return JSON.parse(localStorage.getItem("cgbd.session") || "{}")?.role;
  } catch {
    return null;
  }
};

const isOfficer = (role) =>
  (role || sessionRole()) === "DISASTER_MANAGEMENT_OFFICER";

const OFFICER_SECTIONS = [
  "monitoring",
  "verification",
  "rescue-operations",
  "risk-analysis",
  "areas",
];

const normalizeIncidentStatus = (status) => {
  const statusMap = {
    submitted: "PENDING",
    under_review: "PENDING",
    verified: "VERIFIED",
    assigned: "ASSIGNED",
    in_progress: "IN_PROGRESS",
    resolved: "RESOLVED",
    rejected: "REJECTED",
    duplicate: "DUPLICATE",
    closed: "CLOSED",
  };
  const value = String(status || "").toLowerCase();
  return statusMap[value] || value.toUpperCase();
};

const normalizeIncidentSeverity = (severity) => {
  const numericMap = {
    1: "LOW",
    2: "LOW",
    3: "MODERATE",
    4: "HIGH",
    5: "CRITICAL",
  };
  const stringMap = {
    low: "LOW",
    medium: "MODERATE",
    moderate: "MODERATE",
    high: "HIGH",
    critical: "CRITICAL",
  };
  if (severity == null || severity === "") return "UNKNOWN";
  const numericSeverity = Number(severity);
  if (Number.isInteger(numericSeverity) && numericMap[numericSeverity]) {
    return numericMap[numericSeverity];
  }
  return stringMap[String(severity).toLowerCase()] || "UNKNOWN";
};

/* ================= Public / shared getters ================= */

export const dashboardService = {
  /* ---------- Sidebar badges ---------- */
  async getBadgeCounts(role) {
    const response = await myaxios.get("notifications/");

    const notificationData = response.data?.data || [];

    if (role === "COMMUNITY_VOLUNTEER") {
      const [incidentsResponse, overview] = await Promise.all([
        myaxios.get("incidents/"),
        this.getVolunteerOverview(),
      ]);
      const incidentCount = incidentsResponse.data?.count ?? incidentsResponse.data?.data?.length ?? 0;
      const activeTaskCount = overview.stats?.find((stat) => stat.key === "tasks")?.value ?? 0;

      return {
        notifications: notificationData.filter((notification) => !notification.read).length,
        reports: incidentCount,
        myReports: 0,
        verification: 0,
        requests: 0,
        missions: 0,
        operations: 0,
        community: incidentCount,
        assistance: activeTaskCount,
        monitoring: 0,
      };
    }

    return {
      notifications: notificationData.filter(
        (notification) => !notification.read
      ).length,

      // এগুলো আপাতত আগের মতো mock থাকবে
    if (isOfficer(role)) {
      const { data } = await myaxios.get("dashboard/officer/badges/");
      return data;
    }

    return mockRequest(() => ({
      notifications: unread(role),
      reports: role === "CITIZEN" ? myReports.length : reports.length,
      myReports: myReports.length,
      verification: pendingCount(),
      requests: openRequests().length,
      missions: missions.filter((m) => m.status !== "DONE").length,
      operations: operations.filter((o) => o.status === "IN_PROGRESS").length,
      community: reports.filter(
        (r) => r.upazila === "কয়রা" || r.district === "খুলনা"
      ).length,
      assistance: assistanceTasks.filter((t) => t.status !== "DONE").length,
      monitoring: criticalDisasters().length,
    };
  },

  async getNotifications() {
    const response = await myaxios.get("notifications/");

    const notifications = response.data?.data || [];

    const typeMap = {
      report_submission: "report",
      report_update: "report",
      alert: "alert",
      critical_alert: "alert",
      assignment: "mission",
      reminder: "system",
      broadcast: "system",
    };

    return notifications.map((notification) => ({
      id: notification.id,
      kind: typeMap[notification.type] || "system",
      title: notification.subject,
      body: notification.body,
      read: notification.read,
      time: notification.created_at,
      status: notification.status,
      incidentId: notification.incident_id,
      alertId: notification.alert_id,
    }));
  },

  async markAllNotificationsRead() {
    const response = await myaxios.post("notifications/read-all/");
    return response.data;
  },

  async markNotificationRead(id) {
    const response = await myaxios.post(`notifications/${id}/read/`);
    return response.data;
  async getNotifications(role) {
    if (isOfficer(role)) {
      const { data } = await myaxios.get("dashboard/officer/notifications/");
      return data;
    }
    return mockRequest(() => notifications[role] || notifications.default || []);
  },

  async markAllNotificationsRead(role) {
    if (isOfficer(role)) {
      const { data } = await myaxios.post("dashboard/officer/notifications/read-all/");
      return data;
    }
    mockMarkAllRead(role);
    return mockRequest(() => notifications[role] || []);
  },

  async getReports(scope = "all", user) {
    if (isOfficer(user?.role)) {
      const { data } = await myaxios.get("dashboard/officer/reports/");
      return data;
    }

    const response = await myaxios.get("incidents/");
    const result = response.data;
    const incidents = result.results || result.data || result || [];

    const normalizedIncidents = incidents.map((incident) => ({
      ...incident,
      type: incident.type || null,
      status: normalizeIncidentStatus(incident.status),
      severity: normalizeIncidentSeverity(incident.severity),
      upazila: incident.upazila || "",
      district: incident.district || "",
      description: incident.description || "",
      affected: incident.affected ?? incident.affected_people_estimate ?? null,
      time:
        incident.time ??
        incident.incident_time ??
        incident.report_time ??
        incident.created_at ??
        null,
      reporter: incident.reporter_name
        ? { name: incident.reporter_name }
        : null,
    }));

    if (scope === "mine") {
      const currentUserName = (user?.name || user?.nameEn || "").trim().toLowerCase();
      return normalizedIncidents.filter((incident) => {
        const reporterName = (incident.reporter_name || "").trim().toLowerCase();
        return (
          reporterName === currentUserName ||
          incident.reporter_name === user?.name ||
          incident.reporter_name === user?.nameEn
        );
      });
    }

    return normalizedIncidents;
  },
  async getShelters(filter = {}, user) {
    if (user?.role === "COMMUNITY_VOLUNTEER") {
      const response = await myaxios.get("dashboard/volunteer/shelters/", {
        params: filter.incidentId ? { incident: filter.incidentId } : undefined,
      });
      const rows = response.data?.data || [];
      return filter.incidentId
        ? { shelters: rows, incident: response.data?.incident || null }
        : rows;
    }


  async getShelters(filter = {}) {
    if (isOfficer()) {
      const { data } = await myaxios.get("dashboard/officer/shelters/");
      const rows = data || [];
      if (filter.district && filter.district !== "সব") {
        return rows.filter((s) => s.district === filter.district);
      }
      return rows;
    }

    return mockRequest(() =>
      shelters.filter(
        (s) => !filter.district || filter.district === "সব" || s.district === filter.district
      )
    );
  },

  async getMapData(user) {
    if (user?.role === "COMMUNITY_VOLUNTEER") {
      const [reportsResult, sheltersResult, overviewResult] = await Promise.allSettled([
        this.getReports("all", user),
        this.getShelters({}, user),
        this.getVolunteerOverview(),
      ]);

      return {
        liveVolunteerMap: true,
        reports: reportsResult.status === "fulfilled" ? reportsResult.value : [],
        shelters: sheltersResult.status === "fulfilled" ? sheltersResult.value : [],
        area: overviewResult.status === "fulfilled" ? overviewResult.value.area : null,
        errors: {
          reports: reportsResult.status === "rejected" ? "রিপোর্টের অবস্থান লোড করা যায়নি।" : "",
          shelters: sheltersResult.status === "rejected" ? "আশ্রয়কেন্দ্রের অবস্থান লোড করা যায়নি।" : "",
          area: overviewResult.status === "rejected" ? "নির্ধারিত এলাকার তথ্য লোড করা যায়নি।" : "",
        },
      };
  async getMapData() {
    if (isOfficer()) {
      const { data } = await myaxios.get("dashboard/officer/map/");
      return data;
    }
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

  async getCitizenOverview() {
    const { data } = await myaxios.get("dashboard/citizen/overview/");
    return data;
  },

  async getVolunteerOverview() {
    const response = await myaxios.get("dashboard/volunteer/overview/");
    return response.data?.data || response.data;
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

  async getOfficerOverview() {
    const { data } = await myaxios.get("dashboard/officer/overview/");
    return data;
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

  async getSectionData(key, user) {
    const role = user?.role;

    if (key === "my-area" && role === "COMMUNITY_VOLUNTEER") {
      const [overview, areaReports] = await Promise.all([
        this.getVolunteerOverview(),
        this.getReports("all", user),
      ]);
      const area = overview.area || {};

      return {
        stats: [
          { label: "সক্রিয় ঘটনা", value: area.incidents ?? 0, tone: "amber", icon: "Activity" },
          { label: "আশ্রয়কেন্দ্র", value: area.shelters ?? 0, tone: "sky", icon: "Warehouse" },
          { label: "নিবন্ধিত স্বেচ্ছাসেবক", value: area.volunteers ?? 0, tone: "emerald", icon: "HandHeart" },
        ],
        blocks: [
          {
            type: "areaPanel",
            title: "আপনার দায়িত্বপূর্ণ এলাকা",
            subtitle: "প্রোফাইলে নির্ধারিত এলাকা",
            area: {
              volunteerArea: true,
              district: area.district,
              upazila: area.upazila,
              incidents: area.incidents ?? 0,
              shelters: area.shelters ?? 0,
              volunteers: area.volunteers ?? 0,
            },
          },
          {
            type: "reportTable",
            title: "এলাকার সাম্প্রতিক রিপোর্ট",
            items: areaReports,
          },
        ],
      };
    }

    if (key === "assistance" && role === "COMMUNITY_VOLUNTEER") {
      const overview = await this.getVolunteerOverview();
      const tasks = (overview.tasks || []).map((task) => ({
        ...task,
        status: task.status === "DONE" || task.status === "completed"
          ? "DONE"
          : ["ONGOING", "IN_PROGRESS", "accepted", "in_progress"].includes(task.status)
            ? "ONGOING"
            : "PENDING",
      }));

      return {
        stats: [
          { label: "নির্ধারিত কার্যক্রম", value: tasks.filter((task) => task.status !== "DONE").length, tone: "lagoon", icon: "ListChecks" },
          { label: "চলমান", value: tasks.filter((task) => task.status === "ONGOING").length, tone: "amber", icon: "Activity" },
          { label: "সম্পন্ন কার্যক্রম", value: tasks.filter((task) => task.status === "DONE").length, tone: "emerald", icon: "CircleCheck" },
        ],
        blocks: [{ type: "taskCards", title: "সহায়তা কার্যক্রম", items: tasks }],
      };
    if (isOfficer(user?.role) && OFFICER_SECTIONS.includes(key)) {
      const { data } = await myaxios.get(`dashboard/officer/section/${key}/`);
      return data;
    }

    const builders = {
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

  async getProfileData(user) {
    console.log("🔥 getProfileData CALLED");

    const response = await myaxios.get("users/me/profile/");

    const profile = response.data?.data || {};

    return {
      profile,
      stats: [],
      activities: [],
    };
    if (isOfficer(user?.role)) {
      const { data } = await myaxios.get("dashboard/officer/profile/");
      return data;
    }

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
    const selectedType = DISASTER_TYPES[payload.type];

    if (!selectedType?.backendId) {
      throw new Error("Invalid disaster category");
    }

    const formData = new FormData();

    formData.append("category", String(selectedType.backendId));
    formData.append("description", payload.description);
    formData.append("description_bn", payload.description);
    formData.append("situation", "worsening");
    formData.append(
      "address",
      payload.place || `${user?.upazila || ""}, ${user?.district || ""}`
    );

    if (user?.upazila) formData.append("upazila", user.upazila);
    if (user?.district) formData.append("district", user.district);

    formData.append("is_anonymous", "false");

    if (user?.name) formData.append("reporter_name", user.name);
    if (user?.phone) formData.append("reporter_phone", user.phone);

    formData.append("incident_time", new Date().toISOString());

    if (payload.affected != null) {
      formData.append("affected_people_estimate", String(payload.affected));
    }

    formData.append("is_sos", "false");

    if (payload.photo) {
      formData.append("files", payload.photo);
    }

    const response = await myaxios.post("incidents/create/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data?.data || response.data;
  },

  async verifyReport(id, action) {
    if (isOfficer()) {
      const { data } = await myaxios.post(`dashboard/officer/reports/${id}/verify/`, { action });
      return data;
    }
    mockVerifyReport(id, action);
    return mockRequest({ id, action });
  },

  async setAvailability(user, status) {
    if (user?.role === "COMMUNITY_VOLUNTEER") {
      const response = await myaxios.patch("users/me/profile/", {
        availability_status: status,
      });
      return response.data?.data || response.data;
    }

    mockSetAvailability(user, status);
    return mockRequest({ status });
  },

  async completeTask(id) {
    const response = await myaxios.patch(
      `dashboard/volunteer/tasks/${id}/status/`,
      { status: "completed" }
    );
    return response.data?.data || response.data;
  },
};