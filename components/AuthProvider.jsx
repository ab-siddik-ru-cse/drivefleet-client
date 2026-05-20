"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const API_URL = "http://localhost:5000";

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // Get Current Session User
  const refresh = useCallback(async () => {

    try {

      const res = await fetch(
        `${API_URL}/api/auth/session`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await res.json();

      // Better Auth session structure
      if (data?.user) {

        setUser({
          uid: data.user.id,
          email: data.user.email,
          name: data.user.name,
          image: data.user.image,
        });

      } else {
        setUser(null);
      }

    } catch (error) {

      console.error("SESSION ERROR:", error);

      setUser(null);

    } finally {

      setLoading(false);

    }

  }, []);

  // Email Login
  const login = async (email, password) => {

    setLoading(true);

    try {

      const res = await fetch(
        `${API_URL}/api/auth/sign-in/email`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return {
          ok: false,
          error: data.message || "Login failed",
        };
      }

      await refresh();

      return {
        ok: true,
      };

    } catch (error) {

      console.error("LOGIN ERROR:", error);

      return {
        ok: false,
        error: "Something went wrong",
      };

    } finally {

      setLoading(false);

    }
  };

  // Register User
  const register = async (name, email, password) => {

    setLoading(true);

    try {

      const res = await fetch(
        `${API_URL}/api/auth/sign-up/email`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return {
          ok: false,
          error: data.message || "Registration failed",
        };
      }

      await refresh();

      return {
        ok: true,
      };

    } catch (error) {

      console.error("REGISTER ERROR:", error);

      return {
        ok: false,
        error: "Something went wrong",
      };

    } finally {

      setLoading(false);

    }
  };

  // Google Login
  const loginWithGoogle = async () => {

    try {

      window.location.href =
        `${API_URL}/api/auth/sign-in/social?provider=google`;

    } catch (error) {

      console.error("GOOGLE LOGIN ERROR:", error);

    }
  };

  // Logout
  const logout = async () => {

    try {

      await fetch(
        `${API_URL}/api/auth/sign-out`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      setUser(null);

    } catch (error) {

      console.error("LOGOUT ERROR:", error);

    }
  };

  // Initial Session Load
  useEffect(() => {
    refresh();
  }, [refresh]);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {

  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;
}