"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, API_BASE, setStoredToken, clearStoredToken, getStoredToken } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);

  const issueJwt = useCallback(async () => {
    const res = await api("/api/session/issue-jwt", { method: "POST" });
    if (res.token) setStoredToken(res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const refresh = useCallback(async () => {
    try {
      const { user } = await api("/api/session/me");
      setUser(user ?? null);
      if (!user) clearStoredToken();
      return user;
    } catch {
      setUser(null);
      clearStoredToken();
      return null;
    }
  }, []);

  // On mount, if we have a stored token, verify it with the server.
  useEffect(() => {
    if (initialUser) return;
    if (getStoredToken()) refresh();
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

  /**
   * Google sign-in: redirect to server's Better Auth endpoint.
   *
   * KEY: callbackURL points to the SERVER's google-handoff endpoint,
   * NOT the client. Server reads its own session (cookies work
   * same-origin there), mints a JWT, and redirects to client's
   * /auth-callback with the token in URL hash.
   *
   * Why? In cross-origin deployment, the client can NEVER reliably
   * read Better Auth's session cookie (it's on the server's domain).
   * So we do the JWT handoff entirely on the server side.
   */
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const res = await api("/api/auth/sign-in/social", {
        method: "POST",
        body: JSON.stringify({
          provider: "google",
          // After Google authenticates, Better Auth lands here on the SERVER.
          callbackURL: `${API_BASE}/api/session/google-handoff`,
        }),
      });
      if (!res?.url) {
        setLoading(false);
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
    clearStoredToken();
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