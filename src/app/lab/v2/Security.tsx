"use client";

import { motion } from "framer-motion";
import { EASE, MaskLine } from "./Hero";

// MOCKUP ONLY, PARTLY NOT TRUE (Oct 22, 2026). AirPosture's 5,000+ users is
// Relja's real number; every other figure, the status board and the event log
// are placeholders until he gives the real ones.
const SHOW = true; // mocks shown live on Relja's request (Oct 22, 2026)

const FIGURES = [
  { value: "5,000+", label: "people on AirPosture, on servers I run" },
  { value: "99.98%", label: "uptime, last 12 months" },
  { value: "0", label: "data breaches, ever" },
  { value: "3 yrs", label: "still securing a platform I sold" },
];

const SERVICES = [
  { name: "AirPosture API", uptime: "99.99%", dip: -1 },
  { name: "Dispatch platform", uptime: "99.97%", dip: 61 },
  { name: "LaunchPilot", uptime: "99.98%", dip: 34 },
  { name: "VoiceVault", uptime: "100%", dip: -1 },
];

const EVENTS = [
  { t: "2h ago", text: "Blocked 1,284 login attempts from one network", tone: "gold" },
  { t: "Oct 20", text: "Backup restored to a test server: passed", tone: "ok" },
  { t: "Oct 18", text: "Security patches applied to 6 servers", tone: "ok" },
];

const PRACTICES = [
  {
    icon: "target",
    title: "I attack it before anyone else does",
    body: "Before every release I test my own systems the way an attacker would: logins, payments, file uploads, every open door.",
  },
  {
    icon: "lock",
    title: "Locked-down servers",
    body: "Keys instead of passwords, closed ports, security patches applied automatically, and secrets kept out of the code.",
  },
  {
    icon: "data",
    title: "Data encrypted, backups proven",
    body: "Customer data is encrypted at rest and in transit. Backups are restored on a schedule, so I know they work.",
  },
  {
    icon: "eye",
    title: "Watched around the clock",
    body: "Monitoring and alerts on every server. If something breaks at 3 a.m., I know before your customers do.",
  },
];

const OK = "#7EE0A5";
const DAYS = 90;

function Icon({ name }: { name: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      {name === "target" && (
        <>
          <circle cx="12" cy="12" r="8" {...p} />
          <circle cx="12" cy="12" r="4" {...p} />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" {...p} />
        </>
      )}
      {name === "lock" && (
        <>
          <rect x="5" y="11" width="14" height="9" rx="2" {...p} />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" {...p} />
        </>
      )}
      {name === "data" && (
        <>
          <ellipse cx="12" cy="6" rx="7" ry="3" {...p} />
          <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" {...p} />
        </>
      )}
      {name === "eye" && (
        <>
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" {...p} />
          <circle cx="12" cy="12" r="3" {...p} />
        </>
      )}
    </svg>
  );
}

/** A status-page style board: every system I run, 90 days of uptime. */
function StatusBoard() {
  return (
    <div className="relative overflow-hidden rounded-[26px] border border-white/[0.08] bg-[var(--night-2)] p-6 md:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[var(--gold)]/[0.06] blur-3xl" />
      <div className="relative flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--night-muted)]">Systems I run</p>
        <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12px]" style={{ color: OK, borderColor: `${OK}40`, background: `${OK}10` }}>
          <span className="relative inline-flex size-2">
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ background: OK }}
              animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="relative size-2 rounded-full" style={{ background: OK }} />
          </span>
          All systems operational
        </span>
      </div>

      <div className="relative mt-7 space-y-6">
        {SERVICES.map((s, row) => (
          <div key={s.name}>
            <div className="mb-2 flex items-baseline justify-between">
              <p className="text-[15px]">{s.name}</p>
              <p className="font-mono text-[12px] text-[var(--night-muted)]">{s.uptime}</p>
            </div>
            <div className="flex h-7 gap-[2px]">
              {Array.from({ length: DAYS }).map((_, d) => (
                <motion.span
                  key={d}
                  className={`flex-1 rounded-[2px] ${d < DAYS / 2 ? "hidden md:block" : ""}`}
                  style={{ background: d === s.dip ? "var(--gold)" : `${OK}b3` }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: EASE, delay: row * 0.12 + d * 0.006 }}
                />
              ))}
            </div>
          </div>
        ))}
        <div className="flex justify-between font-mono text-[10px] text-[var(--night-muted)]">
          <span>
            <span className="md:hidden">45 days ago</span>
            <span className="hidden md:inline">90 days ago</span>
          </span>
          <span>today</span>
        </div>
      </div>

      <ul className="relative mt-7 space-y-2.5 border-t border-white/[0.08] pt-6">
        {EVENTS.map((e, k) => (
          <motion.li
            key={e.text}
            className="flex items-start gap-3 text-[13px]"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.6 + k * 0.12 }}
          >
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ background: e.tone === "ok" ? OK : "var(--gold)" }} />
            <span className="flex-1 text-[var(--night-ink)]/85">{e.text}</span>
            <span className="shrink-0 font-mono text-[11px] text-[var(--night-muted)]">{e.t}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Security and upkeep: the part clients worry about once AI touches their
 * data. The promise and figures beside a live-looking status board, then four
 * plain practices.
 */
export default function Security() {
  if (!SHOW) return null;
  return (
    <section id="v2-security" className="v2-night v2-grain relative px-[5vw] py-[14vh] md:px-[9vw]">
      <div className="relative z-[2]">
        <div className="grid gap-12 md:grid-cols-[1fr_1.05fr] md:gap-[5vw]">
          <div className="flex flex-col">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--night-muted)]">Security · after launch</p>
            <h2 className="v2-display mt-6 text-[13vw] md:text-[5.4vw]">
              <MaskLine>I don’t ship it</MaskLine>
              <MaskLine delay={0.08}>
                <span className="v2-gold">and disappear.</span>
              </MaskLine>
            </h2>
            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-[var(--night-ink)]/75">
              I run the servers behind everything I build: security, updates, backups and monitoring. Including a trucking
              dispatch platform I sold, which I still keep secure today.
            </p>

            <div className="mt-auto grid grid-cols-2 gap-3 pt-10">
              {FIGURES.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
                  className="rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-5"
                >
                  <p className="v2-display text-[11vw] text-[var(--gold)] md:text-[3vw]">{f.value}</p>
                  <p className="mt-2 text-[13px] leading-snug text-[var(--night-muted)]">{f.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <StatusBoard />
          </motion.div>
        </div>

        <ul className="mt-[10vh] grid gap-4 md:grid-cols-4">
          {PRACTICES.map((p, i) => (
            <motion.li
              key={p.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
              className="group rounded-[22px] border border-white/[0.08] bg-[var(--night-2)] p-6 transition-colors hover:border-[var(--gold)]/40"
            >
              <span className="flex size-11 items-center justify-center rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/[0.06] text-[var(--gold)] transition-colors group-hover:bg-[var(--gold)]/15">
                <Icon name={p.icon} />
              </span>
              <p className="mt-6 text-lg leading-snug tracking-[-0.02em]">{p.title}</p>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--night-muted)]">{p.body}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
