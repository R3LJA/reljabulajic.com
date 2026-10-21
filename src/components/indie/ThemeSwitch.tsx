"use client";

import { useEffect } from "react";

// Light by default. The current theme lives on #indie-root's data-theme, and
// indie.css shows the matching icon, so this component keeps no state.
const KEY = "indie-theme";

function root() {
  return document.getElementById("indie-root");
}

export default function ThemeSwitch({
  className = "flex size-10 items-center justify-center rounded-full border border-[var(--i-line-strong)] bg-[var(--i-surface)] text-[var(--i-ink)] transition-transform hover:rotate-12",
}: {
  className?: string;
}) {
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "dark" || saved === "light") root()?.setAttribute("data-theme", saved);
    } catch {
      // Storage can be blocked; light stays the default.
    }
  }, []);

  function toggle() {
    const el = root();
    if (!el) return;
    const next = el.getAttribute("data-theme") === "dark" ? "light" : "dark";
    el.setAttribute("data-theme", next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // Not saved; the switch still works for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      className={className}
    >
      <svg viewBox="0 0 24 24" fill="none" className="indie-icon-moon size-[18px]">
        <path
          d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
      <svg viewBox="0 0 24 24" fill="none" className="indie-icon-sun size-[18px]">
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
