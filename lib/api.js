export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const TOKEN_KEY = "df_token";

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token) {
  if (typeof window === "undefined") return;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
  }
}

export function clearStoredToken() {
  setStoredToken(null);
}

export async function api(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const isFormData = options.body instanceof FormData;
  const token = getStoredToken();

  const res = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
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
export async function apiServer(path, _cookieHeader = "", options = {}) {
  const url = `${API_BASE}${path}`;

  const fetchWithTimeout = (timeoutMs) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    }).finally(() => clearTimeout(id));
  };


  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const timeoutMs = attempt === 1 ? 8000 : 10000;
      const res = await fetchWithTimeout(timeoutMs);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      const isLastAttempt = attempt === 2;
      if (isLastAttempt) {
        console.error("[apiServer] failed after retries:", err.message);
        return null;
      }
      console.warn(`[apiServer] attempt ${attempt} failed (${err.message}), retrying…`);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  return null;
}