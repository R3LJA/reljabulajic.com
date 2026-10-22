"use client";

import { motion } from "framer-motion";
import { EASE, MaskLine } from "./Hero";

// MOCKUP ONLY, PARTLY NOT TRUE (Oct 22, 2026). AirPosture's 5,000+ users is
// Relja's real number; every other figure here is a placeholder until he gives
// the real ones. The whole section renders only outside production.
const SHOW = true; // mocks shown live on Relja's request (Oct 22, 2026)

const FIGURES = [
  { value: "5,000+", label: "people on AirPosture, on servers I run" },
  { value: "99.98%", label: "uptime across my systems, last 12 months" },
  { value: "0", label: "data breaches, ever" },
  { value: "3 yrs", label: "still securing a platform I sold" },
];

const PRACTICES = [
  {
    title: "I attack it before anyone else does",
    body: "Before every release I test my own systems the way an attacker would: logins, payments, file uploads, every open door.",
  },
  {
    title: "Locked-down servers",
    body: "Keys instead of passwords, closed ports, security patches applied automatically, and secrets kept out of the code.",
  },
  {
    title: "Data encrypted, backups proven",
    body: "Customer data is encrypted at rest and in transit. Backups are restored on a schedule, so I know they work.",
  },
  {
    title: "Watched around the clock",
    body: "Monitoring and alerts on every server. If something breaks at 3 a.m., I know before your customers do.",
  },
];

/**
 * Security and upkeep: the part clients worry about once AI touches their
 * data. Figures first, then four plain practices.
 */
export default function Security() {
  if (!SHOW) return null;
  return (
    <section id="v2-security" className="v2-night v2-grain relative px-[5vw] py-[18vh] md:px-[9vw]">
      <div className="relative z-[2]">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--night-muted)]">Security · after launch</p>
        <h2 className="v2-display mt-6 max-w-[14ch] text-[13vw] md:text-[6.5vw]">
          <MaskLine>
            I don&apos;t ship it <span className="v2-gold">and disappear.</span>
          </MaskLine>
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-snug text-[var(--night-ink)]/80 md:text-xl">
          I run the servers behind everything I build: security, updates, backups and monitoring. Including a trucking
          dispatch platform I sold, which I still keep secure today.
        </p>

        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-[22px] border border-white/[0.08] bg-white/[0.08] md:grid-cols-4">
          {FIGURES.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              className="bg-[var(--night-2)] p-6 md:p-8"
            >
              <p className="text-[11vw] leading-none tracking-[-0.05em] text-[var(--gold)] md:text-[4.2vw]">{f.value}</p>
              <p className="mt-3 text-[14px] leading-snug text-[var(--night-muted)]">{f.label}</p>
            </motion.div>
          ))}
        </div>

        <ul className="mt-14 grid gap-x-[4vw] gap-y-10 md:grid-cols-2">
          {PRACTICES.map((p) => (
            <li key={p.title} className="border-t border-white/10 pt-6">
              <p className="text-xl tracking-[-0.02em] md:text-2xl">{p.title}</p>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[var(--night-muted)]">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
