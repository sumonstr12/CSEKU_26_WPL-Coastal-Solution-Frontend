/**
 * Mock "database" of demo user profiles, keyed by role.
 *
 * This replaces the Next.js API route + Postgres backend: the app now
 * runs entirely client-side against this local seed data (kept fresh
 * per role for the current session by src/services/profileService.js).
 */

const HOUR = 3_600_000;
const MINUTE = 60_000;
const DAY = 24 * HOUR;

export function seedUsers() {
  const now = Date.now();
  return {
    CITIZEN: {
      id: 41,
      username: "rumana_48213",
      full_name: "রুমানা আক্তার",
      phone_number: "01712435560",
      email: null,
      role: "CITIZEN",
      date_of_birth: "1995-03-21",
      district: "সাতক্ষীরা",
      address: "গ্রাম: গাবুরা, ডাকঘর: শ্যামনগর",
      date_joined: "2025-11-03T04:30:00.000Z",
      last_login: new Date(now - 5 * HOUR - 20 * MINUTE).toISOString(),
      account_status: "ACTIVE",
      profile: {
        administrative_area: {
          division: "খুলনা",
          district: "সাতক্ষীরা",
          upazila: "শ্যামনগর",
          union: "গাবুরা",
        },
      },
    },
    COMMUNITY_VOLUNTEER: {
      id: 12,
      username: "sumon_roy",
      full_name: "সুমন রায়",
      phone_number: "01715432108",
      email: "sumon.roy@example.com",
      role: "COMMUNITY_VOLUNTEER",
      date_of_birth: "2002-05-10",
      district: "খুলনা",
      address: null,
      date_joined: "2026-08-12T05:45:00.000Z",
      last_login: new Date(now - 42 * MINUTE).toISOString(),
      account_status: "ACTIVE",
      profile: {
        organization: "বাংলাদেশ রেড ক্রিসেন্ট সোসাইটি",
        availability_status: "AVAILABLE",
        administrative_area: {
          division: "খুলনা",
          district: "খুলনা",
          upazila: "কয়রা",
          union: "মহারাজপুর",
        },
      },
    },
    RESPONDER: {
      id: 27,
      username: "delowar_rsp",
      full_name: "দেলোয়ার হোসেন",
      phone_number: "01819476632",
      email: null,
      role: "RESPONDER",
      date_of_birth: "1990-01-17",
      district: "খুলনা",
      address: null,
      date_joined: "2025-06-20T06:10:00.000Z",
      last_login: new Date(now - 70 * MINUTE).toISOString(),
      account_status: "ACTIVE",
      profile: {
        responder_type: "RESCUE_TEAM",
        organization: "ফায়ার সার্ভিস ও সিভিল ডিফেন্স",
        availability_status: "ON_MISSION",
        administrative_areas: [
          { division: "খুলনা", district: "খুলনা" },
          { division: "খুলনা", district: "খুলনা", upazila: "কয়রা" },
          { division: "খুলনা", district: "খুলনা", upazila: "দাকোপ" },
          { division: "খুলনা", district: "খুলনা", upazila: "পাইকগাছা" },
        ],
      },
    },
    LOCAL_AUTHORITY: {
      id: 58,
      username: "farhana_uno",
      full_name: "ফারহানা ইয়াসমিন",
      phone_number: "01711320894",
      email: "uno.koyra@example.gov.bd",
      role: "LOCAL_AUTHORITY",
      date_of_birth: "1985-09-02",
      district: "খুলনা",
      address: null,
      date_joined: "2024-12-01T03:20:00.000Z",
      last_login: new Date(now - DAY - 2 * HOUR).toISOString(),
      account_status: "ACTIVE",
      profile: {
        organization: "কয়রা উপজেলা প্রশাসন",
        designation: "উপজেলা নির্বাহী কর্মকর্তা",
        administrative_area: {
          division: "খুলনা",
          district: "খুলনা",
          upazila: "কয়রা",
        },
      },
    },
    DISASTER_MANAGEMENT_OFFICER: {
      id: 63,
      username: "ariful_dmo",
      full_name: "মোঃ আরিফুল ইসলাম",
      phone_number: "01709112245",
      email: "ariful.islam@example.gov.bd",
      role: "DISASTER_MANAGEMENT_OFFICER",
      date_of_birth: "1982-12-25",
      district: "খুলনা",
      address: null,
      date_joined: "2024-05-14T07:00:00.000Z",
      last_login: new Date(now - 2 * DAY - 3 * HOUR).toISOString(),
      account_status: "ACTIVE",
      profile: {
        organization: "দুর্যোগ ব্যবস্থাপনা অধিদপ্তর",
        designation: "দুর্যোগ ব্যবস্থাপনা কর্মকর্তা",
        administrative_area: { division: "খুলনা", district: "খুলনা" },
      },
    },
    SYSTEM_ADMINISTRATOR: {
      id: 5,
      username: "nusrat_admin",
      full_name: "নুসরাত জাহান",
      phone_number: "01556677889",
      email: "nusrat@coastalguard.example.gov.bd",
      role: "SYSTEM_ADMINISTRATOR",
      date_of_birth: "1988-07-09",
      district: "ঢাকা",
      address: null,
      date_joined: "2024-01-08T04:00:00.000Z",
      last_login: new Date(now - 3 * MINUTE).toISOString(),
      account_status: "ACTIVE",
      profile: { designation: "সিস্টেম প্রশাসক" },
    },
  };
}
