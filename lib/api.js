export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function api(path, options = {}) {
  const { body, headers, ...rest } = options;

  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: body && typeof body !== "string" ? JSON.stringify(body) : body,
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
  }

  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}


export async function apiServer(path, options = {}) {
  const { cookies } = await import("next/headers");
  const cookieHeader = cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const { body, headers, ...rest } = options;

  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    ...rest,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
      ...(headers || {}),
    },
    body: body && typeof body !== "string" ? JSON.stringify(body) : body,
  });

  let data = {};
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}