"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "df-theme";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  // On mount, read the saved preference (or fall back to system)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
    } else if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
    setMounted(true);
  }, []);

  // Apply theme to <html> and persist
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, mounted]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
