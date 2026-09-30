/**
 * Profile service — Django backend via custom axios (myaxios).
 *
 * GET  /api/profiles/me/
 * PATCH /api/profiles/me/
 *
 * Contract:
 *   { status: true, data: profileObject }
 *   { status: true, message: "...", data: profileObject }
 */

import myaxios from "../../../utils/myaxios";

export async function getProfile() {
  const { data } = await myaxios.get("/profiles/me/");
  if (!data?.status) {
    throw new Error(data?.message || "Failed to load profile");
  }
  return data;
}

/**
 * Payload matches ProfileEditModal.buildPayload():
 * {
 *   full_name, email, date_of_birth, district, address,
 *   profile: {
 *     organization?, designation?, responder_type?,
 *     availability_status?, administrative_area?,
 *     administrative_areas?
 *   }
 * }
 */
export async function updateProfile(updates) {
  const { data } = await myaxios.patch("/profiles/me/", updates);
  if (!data?.status) {
    const err = new Error(data?.message || "Failed to update profile");
    err.errors = data?.errors;
    throw err;
  }
  return data;
}

export const profileService = { getProfile, updateProfile };