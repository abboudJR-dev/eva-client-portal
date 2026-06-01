"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

/**
 * Reads/writes the `data-theme` attribute on <html> and persists to
 * localStorage under "eva-theme". The initial attribute is set by the
 * no-FOUC script in the root layout, so this hook only mirrors and mutates it.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme | null>(null);

  useEffect(() => {
    const current = (document.documentElement.getAttribute("data-theme") as Theme) || "light";
    setThemeState(current);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("eva-theme", next);
    } catch {
      /* storage unavailable — attribute still applied */
    }
    setThemeState(next);
  }, []);

  const toggle = useCallback(() => {
    const current = (document.documentElement.getAttribute("data-theme") as Theme) || "light";
    setTheme(current === "light" ? "dark" : "light");
  }, [setTheme]);

  return { theme, setTheme, toggle };
}
