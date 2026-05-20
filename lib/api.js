/**
 * Central fetch helper for talking to drivefleet-server.
 *
 * Why this exists:
 *  - Every request must include credentials: "include" so the browser
 *    sends/receives the auth cookies (Better Auth's session + our df_token).
 *  - All requests share the same base URL from NEXT_PUBLIC_API_URL.
 *  - Errors are normalized: server returns { error: "..." } on failure,
 *    we throw with that message so toast.error(err.message) just works.
 *
 * Two flavors:
 *  - api(path, opts)        → for client components (browser fetch).
 *  - apiServer(path, opts)  → for server components (forwards the
 *                              cookie header from the incoming request).
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Client-side fetch. Use inside "use client" components.
 */
export async function api(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const isFormData = options.body instanceof FormData;

  const res = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // Some endpoints (e.g. logout) may return empty bodies — that's fine.
  }

  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data ?? {};
}

/**
 * Server-side fetch — for use in Server Components like the Home page
 * and the Car Details page. Forwards the incoming request's Cookie
 * header so the server can identify the user (e.g. to know if they're
 * the owner of a car).
 *
 * Pass `cookieHeader` from next/headers like:
 *   import { cookies } from "next/headers";
 *   const ch = cookies().toString();
 *   await apiServer("/api/cars", ch);
 */
export async function apiServer(path, cookieHeader = "", options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    // For server components we'd rather return null than throw, so the page
    // can render a friendly empty state.
    return null;
  }
  return res.json();
}
