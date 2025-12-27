"use client";

import { useEffect, useState, useCallback } from "react";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Read initial theme from DOM (set by inline script in layout)
    const currentTheme = document.documentElement.getAttribute("data-theme") as Theme;
    if (currentTheme) {
      setTheme(currentTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  }, [theme]);

  // Render placeholder during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <span
        className="text-[var(--bullet)] inline-block w-3"
        aria-hidden="true"
      >
        *
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="text-[var(--bullet)] hover:text-[var(--link)] hover:underline cursor-pointer transition-colors"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      *
    </button>
  );
}
