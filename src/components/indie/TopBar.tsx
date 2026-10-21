"use client";

import { useEffect, useState } from "react";
import SubscribeForm from "@/components/SubscribeForm";

// Thin sticky bar. Once the big signup in the header scrolls away, a compact
// signup slides into this bar, so the email field is always on screen
// without covering the page.
export default function TopBar({ watch, children }: { watch: string; children: React.ReactNode }) {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const target = document.getElementById(watch);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setShowForm(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [watch]);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--i-line)] bg-[color-mix(in_srgb,var(--i-bg)_86%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-5 sm:px-8">
        <span
          className={`indie-display shrink-0 text-lg font-bold transition-opacity ${
            showForm ? "max-sm:hidden" : ""
          }`}
        >
          Relja Bulajić
        </span>
        <div
          aria-hidden={!showForm}
          className={`min-w-0 flex-1 transition-all duration-300 sm:ml-auto sm:max-w-md ${
            showForm ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0 max-sm:hidden"
          }`}
        >
          <SubscribeForm
            formClassName="flex"
            buttonLabel="Subscribe"
            placeholder="Your email"
            inputClassName="min-w-0 flex-1 rounded-l-full border border-r-0 border-[var(--i-line-strong)] bg-[var(--i-surface)] px-4 py-2 text-sm outline-none transition-colors placeholder:text-[var(--i-faint)] focus:border-[var(--i-ink)]"
            buttonClassName="shrink-0 rounded-r-full bg-[var(--i-ink)] px-4 py-2 text-sm font-semibold text-[var(--i-bg)] transition-opacity hover:opacity-90 disabled:opacity-60"
            doneClassName="rounded-full bg-[var(--i-mark)] px-4 py-2 text-center text-sm font-medium text-[var(--i-mark-ink)]"
          />
        </div>
        <div className={`flex shrink-0 items-center gap-0.5 ${showForm ? "max-sm:hidden" : "ml-auto sm:ml-0"}`}>
          {children}
        </div>
      </div>
    </header>
  );
}
