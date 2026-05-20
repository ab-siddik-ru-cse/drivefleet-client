import { apiServer } from "@/lib/api";

export async function getCurrentUser() {
  try {
    const { user } = await apiServer("/api/session/me");
    return user ?? null;
  } catch (err) {
    console.error("[getCurrentUser] failed:", err.message);
    return null;
  }
}