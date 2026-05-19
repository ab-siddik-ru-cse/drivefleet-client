"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggle, mounted } = useTheme();

  // Avoid hydration mismatch — render a neutral placeholder until mounted.
  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className={`grid h-9 w-9 place-items-center rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}
      />
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`grid h-9 w-9 place-items-center rounded-lg border border-gray-200 text-gray-700 transition hover:border-brand-500 hover:text-brand-600 dark:border-gray-700 dark:text-gray-300 ${className}`}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
