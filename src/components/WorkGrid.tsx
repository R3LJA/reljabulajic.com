"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import type { AppProject } from "@/lib/apps";

type Platform = "all" | "ios" | "web";
type Origin = "all" | "client" | "solo";

const platformFilters: { key: Platform; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ios", label: "iOS apps" },
  { key: "web", label: "Web apps" },
];

const originFilters: { key: Origin; label: string }[] = [
  { key: "all", label: "Everything" },
  { key: "client", label: "Client work" },
  { key: "solo", label: "Solo / founder" },
];

export default function WorkGrid({
  items,
}: {
  items: { app: AppProject; screenshot?: string }[];
}) {
  const [platform, setPlatform] = useState<Platform>("all");
  const [origin, setOrigin] = useState<Origin>("all");

  const matchesOrigin = (app: AppProject) =>
    origin === "all" ||
    (origin === "client" ? !!app.client : !app.client);

  const matchesPlatform = (app: AppProject) =>
    platform === "all" || app.platform === platform;

  const visible = items.filter(
    ({ app }) => matchesPlatform(app) && matchesOrigin(app)
  );

  return (
    <div>
      {/* filters */}
      <div className="mb-12 flex flex-wrap items-center gap-x-8 gap-y-4">
        {/* platform — primary segmented control */}
        <div className="inline-flex items-center gap-1 rounded-full border border-hairline bg-surface p-1.5">
          {platformFilters.map((f) => {
            const active = platform === f.key;
            const count = items.filter(
              ({ app }) =>
                (f.key === "all" || app.platform === f.key) &&
                matchesOrigin(app)
            ).length;
            return (
              <button
                key={f.key}
                onClick={() => setPlatform(f.key)}
                className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  active ? "text-background" : "text-muted hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="work-platform-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-full bg-foreground"
                  />
                )}
                <span className="relative">
                  {f.label}
                  <span
                    className={`ml-1.5 text-[11px] ${
                      active ? "text-background/60" : "text-faint"
                    }`}
                  >
                    {count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* origin — secondary, lighter pills */}
        <div className="inline-flex items-center gap-1.5">
          {originFilters.map((f) => {
            const active = origin === f.key;
            const count = items.filter(
              ({ app }) =>
                matchesPlatform(app) &&
                (f.key === "all"
                  ? true
                  : f.key === "client"
                    ? !!app.client
                    : !app.client)
            ).length;
            return (
              <button
                key={f.key}
                onClick={() => setOrigin(f.key)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "border-accent/50 bg-accent/10 text-accent"
                    : "border-hairline text-muted hover:border-hairline-strong hover:text-foreground"
                }`}
              >
                {f.label}
                <span
                  className={`ml-1.5 text-[10px] ${active ? "text-accent/70" : "text-faint"}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="py-20 text-center text-sm text-muted">
          No projects match that combination.
        </p>
      ) : (
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map(({ app, screenshot }, i) => (
              <motion.div
                key={app.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.21, 0.6, 0.35, 1] }}
              >
                <ProjectCard app={app} screenshot={screenshot} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
