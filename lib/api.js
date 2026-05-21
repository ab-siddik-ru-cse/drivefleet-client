/**
 * API helper for talking to drivefleet-server via Next.js rewrites.
 *
 * Why is this so simple now?
 * Because of the rewrites() in next.config.js, the browser sends every
 * /api/* request to OUR domain. Next.js forwards it to the Express server
 * behind the scenes. From the browser's point of view, it's same-origin —
 * so cookies are first-party and "just work" without any extra config.
 *
 * No more credentials:"include", no more Authorization headers, no more
 * localStorage. Just plain cookie-based auth like any classic web app.
 */

export async function api(path, options = {}) {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(path, {
    // credentials:"same-origin" is the default; cookies for our domain
    // are sent automatically. We include it explicitly for clarity.
    credentials: "same-origin",
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
    /* some endpoints return empty bodies */
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
 * Server-side fetch (for use in Server Components).
 *
 * IMPORTANT: server-side rendering happens in the Next.js Node process,
 * NOT in the browser. So fetch("/api/...") would fail with "Invalid URL".
 * We must use an absolute URL — and that URL must point DIRECTLY at the
 * Express server (the rewrites() only applies to browser requests).
 *
 * Caller passes the cookie header so the server can identify the user.
 */
const SERVER_FETCH_BASE =
  process.env.API_URL ||                // Server-side env (Node only)
  process.env.NEXT_PUBLIC_API_URL ||   // Fallback
  "http://localhost:5000";

export async function apiServer(path, cookieHeader = "", options = {}) {
  const url = `${SERVER_FETCH_BASE}${path}`;
  const res = await fetch(url, {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) return null;
  return res.json();
}
