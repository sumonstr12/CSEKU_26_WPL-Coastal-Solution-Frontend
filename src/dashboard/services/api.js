/**
 * ============================================================
 *  API TRANSPORT LAYER
 * ============================================================
 *  Currently mock-backed. To connect the Django REST Framework
 *  backend, set VITE_API_URL and replace `mockRequest` calls in
 *  the service modules with `http()` calls below.
 *
 *  Planned DRF endpoints:
 *    POST  /api/auth/login/            { phone, password }
 *    GET   /api/auth/me/
 *    GET   /api/dashboard/overview/
 *    GET   /api/reports/?scope=mine|area|pending
 *    POST  /api/reports/
 *    GET   /api/shelters/?district=
 *    GET   /api/notifications/
 *    ...etc
 * ============================================================
 */

const API_URL = import.meta.env.VITE_API_URL || "/api";
const MOCK_LATENCY = [140, 420]; // min / max ms — simulates network

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

/** Resolve a mock resolver with simulated latency, returning a deep copy. */
export async function mockRequest(resolver, latency = MOCK_LATENCY) {
  const [min, max] = latency;
  await sleep(min + Math.random() * (max - min));
  const data = typeof resolver === "function" ? resolver() : resolver;
  return data ? JSON.parse(JSON.stringify(data)) : data;
}

/** Real HTTP client — ready for the DRF backend (kept small on purpose). */
export async function http(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new ApiError(detail || "সার্ভারে সমস্যা হয়েছে", res.status);
  }
  if (res.status === 204) return null;
  return res.json();
}
