"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);

  /**
   * After Better Auth sign-in, ask server to issue our JWT cookie.
   * Server reads its session, signs a JWT, sets df_token cookie.
   * Cookie is same-origin so browser stores and sends it naturally.
   */
  const issueJwt = useCallback(async () => {
    const { user } = await api("/api/session/issue-jwt", { method: "POST" });
    setUser(user);
    return user;
  }, []);

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
   * On mount, verify session from server. Cookies are sent automatically
   * because they're first-party (thanks to next.config rewrites).
   */
  useEffect(() => {
    if (initialUser) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const register = async (name, email, password, image) => {
    setLoading(true);
    try {
      await api("/api/auth/sign-up/email", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      const u = await issueJwt();

      if (image && image.trim()) {
        try {
          await api("/api/users/me", {
            method: "PATCH",
            body: JSON.stringify({ image: image.trim() }),
          });
          await refresh();
        } catch (imgErr) {
          console.warn("Profile photo could not be saved:", imgErr.message);
        }
      }

      return { ok: true, user: u };
    } catch (err) {
      return { ok: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

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
      window.location.href = res.url;
      return { ok: true };
    } catch (err) {
      setLoading(false);
      return { ok: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await api("/api/session/logout", { method: "POST" });
    } catch {
      /* ignore */
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
