import { useState, useEffect, useCallback } from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "vanya_theme";
const CHANGE_EVENT = "vanya-theme-change";

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme): ResolvedTheme {
  if (typeof document === "undefined") return "dark";
  const resolved = theme === "system" ? getSystemTheme() : theme;
  const root = document.documentElement;

  if (resolved === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
  }

  root.dataset.theme = resolved;
  return resolved;
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme;
      if (stored === "light" || stored === "dark" || stored === "system") {
        return stored;
      }
    } catch {
      // fallback
    }
    return "system"; // по умолчанию системная
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    applyTheme(theme)
  );

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // ignore
    }
    const resolved = applyTheme(newTheme);
    setResolvedTheme(resolved);
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: newTheme }));
  }, []);

  // Header and catalogue controls share the same page theme, not separate owners.
  useEffect(() => {
    const receive = (value: unknown) => {
      if (value === "light" || value === "dark" || value === "system") setThemeState(value);
    };
    const local = (event: Event) => receive((event as CustomEvent).detail);
    const storage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) receive(event.newValue ?? "system");
    };
    window.addEventListener(CHANGE_EVENT, local);
    window.addEventListener("storage", storage);
    return () => {
      window.removeEventListener(CHANGE_EVENT, local);
      window.removeEventListener("storage", storage);
    };
  }, []);

  // Слушатель системной смены темы при theme === 'system'
  useEffect(() => {
    const resolved = applyTheme(theme);
    setResolvedTheme(resolved);

    if (theme !== "system" || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const updated = applyTheme("system");
      setResolvedTheme(updated);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return { theme, resolvedTheme, setTheme };
}
