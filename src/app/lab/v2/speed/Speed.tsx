"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { EASE, MaskLine } from "../Hero";
import data from "./commits.json";

// Every number here is read from Relja's git history (his own author emails,
// all local repos incl. client work, counted only) for Oct 20, 2025 to
// Oct 19, 2026. Regenerate with the script described in the brief.

const fmt = (n: number) => n.toLocaleString("en-US");

const BUILDS = [
  { name: "SupportAgent", days: 1, what: "Claude agent, multi-app knowledge, human handoff", proof: "22 commits in one day" },
  { name: "Atelier", days: 15, what: "My Rust and React ADE that runs agent teams", proof: "about 23,000 lines · 47 Rust tests · 73 commits" },
  { name: "Sage", days: 42, what: "iOS app, idea to App Store", proof: "42 commits · live on the App Store" },
  { name: "LaunchPilot", days: 76, what: "Multi-model agent platform", proof: "Claude tool loop · 4 model providers · 57 commits" },
  { name: "Vael", days: 189, what: "AI wardrobe: iOS, web and Chrome extension on one backend", proof: "514 commits · 33 Edge Functions · 128 migrations" },
];

function level(n: number) {
  if (!n) return 0;
  if (n <= 2) return 1;
  if (n <= 6) return 2;
  if (n <= 15) return 3;
  return 4;
}
const SHADES = ["rgba(255,255,255,0.05)", "rgba(203,180,138,0.28)", "rgba(203,180,138,0.5)", "rgba(203,180,138,0.75)", "#e6d4b0"];

function Heatmap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const [tip, setTip] = useState<{ d: string; n: number } | null>(null);

  const weeks = useMemo(() => {
    const days = data.days as Record<string, number>;
    const start = new Date(`${data.start}T00:00:00Z`);
    // begin on the Monday on or before the start
    const offset = (start.getUTCDay() + 6) % 7;
    const first = new Date(start.getTime() - offset * 86400000);
    const end = new Date(`${data.end}T00:00:00Z`);
    const out: { d: string; n: number; inRange: boolean }[][] = [];
    for (let t = first.getTime(); t <= end.getTime(); t += 7 * 86400000) {
      const col = [];
      for (let k = 0; k < 7; k++) {
        const day = new Date(t + k * 86400000);
        const key = day.toISOString().slice(0, 10);
        col.push({ d: key, n: days[key] ?? 0, inRange: day >= start && day <= end });
      }
      out.push(col);
    }
    return out;
  }, []);

  const months = useMemo(() => {
    const seen = new Set<string>();
    return weeks.map((w) => {
      const m = w[0].d.slice(0, 7);
      if (seen.has(m)) return "";
      seen.add(m);
      return new Date(`${w[0].d}T00:00:00Z`).toLocaleString("en-US", { month: "short", timeZone: "UTC" });
    });
  }, [weeks]);

  return (
    <div ref={ref} className="relative">
      <div className="overflow-x-auto pb-2 [scrollbar-width:none]">
        <div className="inline-flex min-w-full flex-col gap-2">
          <div className="flex gap-[3px] pl-0 font-mono text-[10px] text-[var(--night-muted)]">
            {months.map((m, i) => (
              <span key={i} className="w-[13px] shrink-0 overflow-visible whitespace-nowrap md:w-[15px]">{m}</span>
            ))}
          </div>
          <div className="flex gap-[3px]">
            {weeks.map((w, i) => (
              <div key={i} className="flex flex-col gap-[3px]">
                {w.map((c) => (
                  <motion.span
                    key={c.d}
                    onPointerEnter={() => c.inRange && setTip({ d: c.d, n: c.n })}
                    onPointerLeave={() => setTip(null)}
                    className="block size-[13px] rounded-[3px] md:size-[15px]"
                    style={{ background: c.inRange ? SHADES[level(c.n)] : "transparent" }}
                    initial={reduced ? false : { opacity: 0, scale: 0.4 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: i * 0.018, duration: 0.35, ease: EASE }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-[var(--night-muted)]">
        <span className="min-h-[1rem]">
          {tip
            ? `${new Date(`${tip.d}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })} · ${tip.n} commit${tip.n === 1 ? "" : "s"}`
            : "Hover a day"}
        </span>
        <span className="flex items-center gap-1.5">
          Less
          {SHADES.map((s) => (
            <span key={s} className="size-[11px] rounded-[2px]" style={{ background: s }} />
          ))}
          More
        </span>
      </div>
    </div>
  );
}

function BuildLog() {
  return (
    <div className="-mx-[5vw] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[5vw] pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:px-0">
      {BUILDS.map((b, i) => (
        <motion.div
          key={b.name}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
          className="flex w-[64vw] shrink-0 snap-start flex-col rounded-[22px] border border-white/[0.08] bg-[var(--night-2)] p-6 md:w-auto"
        >
          <p className="v2-display text-[14vw] text-[var(--gold)] md:text-[3.4vw]">
            {b.days === 1 ? "1 day" : b.days < 60 ? `${b.days} days` : `${Math.round(b.days / 30)} mo`}
          </p>
          <p className="mt-6 text-xl tracking-[-0.03em]">{b.name}</p>
          <p className="mt-2 flex-1 text-[14px] leading-relaxed text-[var(--night-muted)]">{b.what}</p>
          <p className="mt-5 border-t border-white/[0.08] pt-4 font-mono text-[11px] leading-relaxed text-[var(--night-muted)]">{b.proof}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default function Speed() {
  const stats = [
    [fmt(data.total), "commits in 12 months"],
    [fmt(data.activeDays), "days with shipped work"],
    [String(data.repos), "repositories"],
    [`${data.longestStreak} days`, "longest streak"],
  ];
  return (
    <section className="v2-night v2-grain relative px-[5vw] py-[14vh] md:px-[9vw]">
      <div className="relative z-[2]">
        <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--night-muted)]">How fast</p>
            <h2 className="v2-display mt-6 text-[14vw] md:text-[6.4vw]">
              <MaskLine>Fast,</MaskLine>
              <MaskLine delay={0.08}>
                <span className="v2-gold">with receipts.</span>
              </MaskLine>
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[var(--night-muted)]">
              Straight from my git history, October 2025 to October 2026. The pace, not my word for it.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {stats.map(([v, l], i) => (
              <motion.div
                key={l}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
                className="rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-5"
              >
                <p className="v2-display text-[11vw] md:text-[3.2vw]">{v}</p>
                <p className="mt-2 text-[13px] text-[var(--night-muted)]">{l}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-[8vh] rounded-[24px] border border-white/[0.08] bg-[var(--night-2)] p-6 md:p-10">
          <div className="mb-6 flex items-baseline justify-between">
            <p className="text-lg tracking-[-0.02em]">Every day of the last year</p>
            <p className="font-mono text-[11px] text-[var(--night-muted)]">
              busiest day: {data.busiest[1]} commits
            </p>
          </div>
          <Heatmap />
        </div>

        <div className="mt-[12vh] flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h3 className="v2-display text-[10vw] md:text-[4vw]">
            <MaskLine>Idea to working system</MaskLine>
          </h3>
          <p className="font-mono text-[11px] text-[var(--night-muted)]">first to last commit in each repository</p>
        </div>
        <div className="mt-8">
          <BuildLog />
        </div>
      </div>
    </section>
  );
}
