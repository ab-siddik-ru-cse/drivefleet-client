"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { api, API_BASE } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);

  /**
   * After ANY successful Better Auth sign-in (email or social), we call
   * /api/session/issue-jwt to mint our own JWT cookie. The middleware
   * on the server reads THAT cookie on protected routes.
   */
  const issueJwt = useCallback(async () => {
    const { user } = await api("/api/session/issue-jwt", { method: "POST" });
    setUser(user);
    return user;
  }, []);

  /**
   * Refresh the user state from the server. Called on mount in some pages
   * and after any auth change.
   */
  const refresh = useCallback(async () => {
    try {
      const { user } = await api("/api/session/me");
      setUser(user ?? null);
      return user;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  /**
   * Email + password sign-in.
   * Step 1: Better Auth verifies credentials → sets its session cookie.
   * Step 2: We mint our df_token cookie.
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      await api("/api/auth/sign-in/email", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const u = await issueJwt();
      return { ok: true, user: u };
    } catch (err) {
      return { ok: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Email + password sign-up.
   * Better Auth creates the user, then we issue the JWT.
   *
   * Note: Better Auth's sign-up/email expects `name`, `email`, `password`.
   */
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      await api("/api/auth/sign-up/email", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      const u = await issueJwt();
      return { ok: true, user: u };
    } catch (err) {
      return { ok: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Google sign-in.
   * Better Auth returns a URL we should redirect to. After Google sends
   * the user back to our /auth-callback page, that page calls issueJwt().
   */
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const res = await api("/api/auth/sign-in/social", {
        method: "POST",
        body: JSON.stringify({
          provider: "google",
          callbackURL: `${window.location.origin}/auth-callback`,
        }),
      });
      if (!res?.url) {
        return { ok: false, error: "Could not start Google sign-in." };
      }
      // Hand off to Google. Browser navigates away; nothing else to do here.
      window.location.href = res.url;
      return { ok: true };
    } catch (err) {
      setLoading(false);
      return { ok: false, error: err.message };
    }
  };

  /**
   * Logout — clears both Better Auth session and our df_token cookie.
   */
  const logout = async () => {
    try {
      await api("/api/session/logout", { method: "POST" });
    } catch {
      // Even if the call fails (network), wipe local state.
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        refresh,
        issueJwt,
        apiBase: API_BASE,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
