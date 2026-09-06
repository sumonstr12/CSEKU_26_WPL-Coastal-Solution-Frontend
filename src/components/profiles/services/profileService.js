import { seedUsers } from "@/components/profiles/data/users";

/**
 * Profile "service" layer — client-only, no backend/database required.
 *
 * Mirrors the exact same async contract the app previously used against
 * a Next.js API route ({ status, data } / { status, message }), so
 * src/hooks/useProfile.jsx did not need any logic changes: only the
 * underlying data source moved, from a server route + Postgres to the
 * local seed data in src/data/users.js.
 */

const DEFAULT_ROLE = "COMMUNITY_VOLUNTEER";

const BASE_USERS = seedUsers();
const store = new Map();

function isRole(value) {
  return Boolean(value && value in BASE_USERS);
}

function clean(value, fallback) {
  if (value === undefined) return fallback;
  if (value === null) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function getUser(role) {
  const existing = store.get(role);
  if (existing) return existing;
  const fresh = structuredClone(BASE_USERS[role]);
  store.set(role, fresh);
  return fresh;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProfile(role) {
  const resolvedRole = isRole(role) ? role : DEFAULT_ROLE;
  await sleep(550);
  return { status: true, data: getUser(resolvedRole) };
}

export async function updateProfile(role, updates) {
  const resolvedRole = isRole(role) ? role : DEFAULT_ROLE;
  await sleep(650);

  const current = getUser(resolvedRole);
  const merged = {
    ...current,
    full_name:
      updates.full_name && updates.full_name.trim()
        ? updates.full_name.trim()
        : current.full_name,
    email: clean(updates.email, current.email),
    date_of_birth: clean(updates.date_of_birth, current.date_of_birth),
    district: clean(updates.district, current.district),
    address: clean(updates.address ?? undefined, current.address ?? null),
    profile: { ...current.profile, ...(updates.profile ?? {}) },
  };

  store.set(resolvedRole, merged);
  return { status: true, message: "প্রোফাইল আপডেট হয়েছে", data: merged };
}

export const profileService = { getProfile, updateProfile };
