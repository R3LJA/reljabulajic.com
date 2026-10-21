"use client";

import { AnimatePresence, motion } from "framer-motion";

// Building blocks for the step-synced demos on the case-study pages. Each
// demo renders one state per pipeline step; these keep them consistent.

export const EASE = [0.22, 1, 0.36, 1] as const;
export const OK = "#7EE0A5";
export const BAD = "#F08C6B";
export const GOLD = "#CBB48A";

export type DemoProps = { step: number };

/** Swaps the whole stage content when the step changes. */
export function Scene({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={step}
        className="absolute inset-0 p-5 md:p-7"
        initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/** Children appear one after another. */
export function Stagger({
  children,
  gap = 0.12,
  delay = 0.1,
  className = "",
}: {
  children: React.ReactNode[];
  gap?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {children.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE, delay: delay + i * gap }}
        >
          {c}
        </motion.div>
      ))}
    </div>
  );
}

export function Card({
  children,
  className = "",
  glow,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-[#1b1b1e]/90 p-4 ${className}`}
      style={glow ? { boxShadow: `0 0 0 1px ${glow}55, 0 18px 50px -20px ${glow}66` } : undefined}
    >
      {children}
    </div>
  );
}

export function Label({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45" style={color ? { color } : undefined}>
      {children}
    </p>
  );
}

export function Mono({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`font-mono text-[12px] ${className}`}>{children}</span>;
}

export function Pill({ children, color = GOLD }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em]"
      style={{ color, borderColor: `${color}55`, background: `${color}14` }}
    >
      {children}
    </span>
  );
}

/** A check that resolves to pass or fail after a delay. */
export function Check({ label, pass, delay = 0 }: { label: string; pass: boolean; delay?: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
      <Mono className="text-white/75">{label}</Mono>
      <span className="relative h-4 w-14 text-right">
        <motion.span
          className="absolute inset-0 font-mono text-[11px] text-white/35"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: delay + 0.35, duration: 0.2 }}
        >
          …
        </motion.span>
        <motion.span
          className="absolute inset-0 font-mono text-[11px]"
          style={{ color: pass ? OK : BAD }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.45, type: "spring", stiffness: 500, damping: 22 }}
        >
          {pass ? "pass" : "fail"}
        </motion.span>
      </span>
    </div>
  );
}

/** Text typed in character by character. */
export function Typed({ text, delay = 0, speed = 0.018, className = "" }: { text: string; delay?: number; speed?: number; className?: string }) {
  return (
    <span className={className}>
      {text.split("").map((ch, i) => (
        <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + i * speed, duration: 0.01 }}>
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

/** Horizontal bar that fills to `value` (0-1). */
export function Bar({ value, color = GOLD, delay = 0 }: { value: number; color?: string; delay?: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: 0.9, ease: EASE, delay }}
      />
    </div>
  );
}

/** A soft pulsing dot for "live" states. */
export function Live({ color = OK }: { color?: string }) {
  return (
    <span className="relative inline-flex size-2">
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ background: color }}
        animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
      />
      <span className="relative size-2 rounded-full" style={{ background: color }} />
    </span>
  );
}
