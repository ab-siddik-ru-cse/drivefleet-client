"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { api, API_URL } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const { user } = await api("/api/session/me");
      setUser(user ?? null);
    } catch {
      setUser(null);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const r1 = await fetch(`${API_URL}/api/auth/sign-in/email`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!r1.ok) {
        const data = await r1.json().catch(() => ({}));
        return {
          ok: false,
          error: data.message || data.error || "Invalid email or password.",
        };
      }

      const { user } = await api("/api/session/issue-jwt", { method: "POST" });
      setUser(user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message || "Login failed." };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const r1 = await fetch(`${API_URL}/api/auth/sign-up/email`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!r1.ok) {
        const data = await r1.json().catch(() => ({}));
        return {
          ok: false,
          error: data.message || data.error || "Could not create account.",
        };
      }

      const { user } = await api("/api/session/issue-jwt", { method: "POST" });
      setUser(user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message || "Registration failed." };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (redirectAfter = "/") => {
    setLoading(true);
    try {
      const callbackURL = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectAfter)}`;
      const res = await fetch(`${API_URL}/api/auth/sign-in/social`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "google",
          callbackURL,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setLoading(false);
        return {
          ok: false,
          error: data.message || data.error || "Could not start Google sign-in.",
        };
      }
      window.location.href = data.url;
      return { ok: true };
    } catch (err) {
      setLoading(false);
      return { ok: false, error: err.message || "Google sign-in failed." };
    }
  };

  const logout = async () => {
    try {
      await api("/api/session/logout", { method: "POST" });
    } catch {
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, loginWithGoogle, logout, refresh }}
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