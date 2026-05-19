import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "df_token";
const SEVEN_DAYS = 60 * 60 * 24 * 7;

function getSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set.");
  return s;
}

export function signToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, getSecret());
  } catch {
    return null;
  }
}

export function setAuthCookie(token) {
  cookies().set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SEVEN_DAYS,
  });
}

export function clearAuthCookie() {
  cookies().set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Read the current user from the auth cookie. Returns null if unauthenticated.
 * Returns: { uid, email, name }
 */
export async function getCurrentUser() {
  const token = cookies().get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded === "string") return null;
  return {
    uid: decoded.uid,
    email: decoded.email,
    name: decoded.name,
  };
}
