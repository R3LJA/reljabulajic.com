"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { LiveDot, useSequence } from "./scenes/primitives";

/**
 * The system's operating loop as a live pipeline: a pulse walks through the
 * stages on repeat, the way a request actually moves through the system.
 */
export default function SystemFlow({
  flow,
  accent,
}: {
  flow: string[];
  accent: string;
}) {
  const durations = useMemo(() => flow.map(() => 1600), [flow]);
  const active = useSequence(durations);

  return (
    <section className="mt-8 rounded-3xl border border-hairline bg-surface px-6 py-7 sm:px-8">
      <div className="flex items-center gap-2.5">
        <LiveDot color={accent} size={6} />
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
          Operating loop
        </p>
      </div>

      {/* pipeline: single rail on sm+, two-column grid on mobile */}
      <div className="mt-6 hidden items-start sm:flex">
        {flow.map((stage, i) => {
          const isActive = i === active;
          const passed = i < active;
          return (
            <div key={stage} className="flex min-w-0 flex-1 items-start last:flex-none">
              <div className="flex min-w-0 flex-col items-center gap-2.5 text-center">
                <motion.span
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border font-mono text-[10px]"
                  animate={{
                    borderColor: isActive
                      ? accent
                      : passed
                        ? `${accent}55`
                        : "var(--hairline-strong)",
                    color: isActive ? "#0a0a0c" : passed ? accent : "var(--faint)",
                    background: isActive ? accent : "transparent",
                    boxShadow: isActive ? `0 0 22px -6px ${accent}` : "0 0 0px rgba(0,0,0,0)",
                  }}
                  transition={{ duration: 0.45 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </motion.span>
                <motion.span
                  className="max-w-24 text-[11px] leading-tight lg:max-w-28 lg:text-xs"
                  animate={{
                    color: isActive ? "var(--foreground)" : "var(--muted)",
                    opacity: isActive ? 1 : 0.75,
                  }}
                  transition={{ duration: 0.45 }}
                >
                  {stage}
                </motion.span>
              </div>
              {i < flow.length - 1 && (
                <div className="relative mx-2 mt-4 h-px flex-1 overflow-hidden rounded-full bg-hairline lg:mx-3">
                  {isActive && (
                    <motion.span
                      key={active}
                      className="absolute inset-y-0 w-1/3 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                      }}
                      initial={{ left: "-35%" }}
                      animate={{ left: "105%" }}
                      transition={{ duration: 1.1, delay: 0.35, ease: "easeInOut" }}
                    />
                  )}
                  {passed && (
                    <span
                      className="absolute inset-0"
                      style={{ background: `${accent}40` }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2.5 sm:hidden">
        {flow.map((stage, i) => {
          const isActive = i === active;
          return (
            <motion.div
              key={stage}
              className="flex items-center gap-2.5 rounded-2xl border px-3 py-2.5"
              animate={{
                borderColor: isActive ? `${accent}66` : "var(--hairline)",
                opacity: isActive ? 1 : 0.65,
              }}
              transition={{ duration: 0.45 }}
            >
              <span
                className="font-mono text-[10px]"
                style={{ color: isActive ? accent : "var(--faint)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[11px] leading-tight text-foreground/85">{stage}</span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
