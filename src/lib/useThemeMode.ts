"use client";

import { useEffect, useState } from "react";

/**
 * Reactively tracks the active site theme by observing the `light` class on
 * <html>, which ThemeToggle flips. Returns "light" | "dark".
 * SSR-safe: defaults to "dark" (the site default) and syncs on mount.
 */
export function useThemeMode(): "light" | "dark" {
  const [mode, setMode] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const root = document.documentElement;
    const read = () =>
      setMode(root.classList.contains("light") ? "light" : "dark");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return mode;
}
