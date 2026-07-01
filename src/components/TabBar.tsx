"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

type Tab = {
  href: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
};

// SF-Symbols-inspired stroke icons
const tabs: Tab[] = [
  {
    href: "/",
    label: "Home",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="size-[22px]">
        <path
          d="M3.5 10.5 12 3.5l8.5 7v8a2 2 0 0 1-2 2h-4v-6h-5v6h-4a2 2 0 0 1-2-2v-8Z"
          stroke="currentColor"
          strokeWidth={active ? 2 : 1.6}
          strokeLinejoin="round"
          fill={active ? "currentColor" : "none"}
          fillOpacity={active ? 0.16 : 0}
        />
      </svg>
    ),
  },
  {
    href: "/work",
    label: "Work",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="size-[22px]">
        <rect
          x="3.5"
          y="3.5"
          width="7.4"
          height="7.4"
          rx="2"
          stroke="currentColor"
          strokeWidth={active ? 2 : 1.6}
          fill={active ? "currentColor" : "none"}
          fillOpacity={active ? 0.16 : 0}
        />
        <rect x="13.1" y="3.5" width="7.4" height="7.4" rx="2" stroke="currentColor" strokeWidth={active ? 2 : 1.6} fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.16 : 0} />
        <rect x="3.5" y="13.1" width="7.4" height="7.4" rx="2" stroke="currentColor" strokeWidth={active ? 2 : 1.6} fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.16 : 0} />
        <rect x="13.1" y="13.1" width="7.4" height="7.4" rx="2" stroke="currentColor" strokeWidth={active ? 2 : 1.6} fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.16 : 0} />
      </svg>
    ),
  },
  {
    href: "/about",
    label: "About",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="size-[22px]">
        <circle
          cx="12"
          cy="8.2"
          r="3.6"
          stroke="currentColor"
          strokeWidth={active ? 2 : 1.6}
          fill={active ? "currentColor" : "none"}
          fillOpacity={active ? 0.16 : 0}
        />
        <path
          d="M4.8 20c.9-3.4 3.8-5.4 7.2-5.4s6.3 2 7.2 5.4"
          stroke="currentColor"
          strokeWidth={active ? 2 : 1.6}
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function TabBar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2"
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.15 }}
        className="tabbar-surface flex items-center gap-1 rounded-[26px] border border-hairline-strong px-2 py-2 backdrop-blur-2xl"
      >
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className="relative flex flex-col items-center gap-0.5 rounded-[18px] px-5 py-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent/60"
            >
              {active && (
                <motion.span
                  layoutId="tab-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-[18px] bg-foreground/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                />
              )}
              <motion.span
                whileTap={{ scale: 0.86 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                className={`relative ${active ? "text-accent" : "text-muted"}`}
              >
                {tab.icon(active)}
              </motion.span>
              <span
                className={`relative text-[10px] font-medium tracking-wide ${
                  active ? "text-foreground" : "text-faint"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </motion.div>
    </nav>
  );
}
