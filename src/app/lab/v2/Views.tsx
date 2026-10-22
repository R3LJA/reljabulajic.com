"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useState } from "react";
import SystemScene from "@/components/SystemScene";
import { aiCases, iosApps } from "./data";
import { EASE, MaskLine } from "./Hero";
import { spotHandlers } from "./Practices";
import { FooterLinks } from "./Sections";

/* ── AI: an index with a live scene that follows the cursor ───────────── */

export function AiView() {
  const reduced = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 26, mass: 0.6 });
  const y = useSpring(my, { stiffness: 220, damping: 26, mass: 0.6 });
  const spot = spotHandlers();

  return (
    <div
      className="v2-night v2-spot v2-grain relative min-h-[100svh] px-[5vw] pb-40 pt-[22vh] md:px-[9vw]"
      onPointerMove={(e) => {
        spot.onPointerMove(e);
        mx.set(e.clientX);
        my.set(e.clientY);
      }}
    >
      <div className="relative z-[2]">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--night-muted)]">AI systems</p>
        <h1 className="v2-display mt-6 text-[15vw] md:text-[8vw]">
          <MaskLine>My work.</MaskLine>
        </h1>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[var(--night-muted)]">
          {({ 5: "Five", 6: "Six", 7: "Seven", 8: "Eight" } as Record<number, string>)[aiCases.length] ?? aiCases.length} AI systems I designed and built myself, end to end. Open one to see how it works.
        </p>

        <ul className="mt-20 border-t border-white/10">
          {aiCases.map((item, i) => (
            <li key={item.slug} className="border-b border-white/10">
              <Link
                href={item.href}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-4 py-8 md:grid-cols-[4rem_1fr_1.3fr]"
              >
                <span className="font-mono text-xs text-[var(--night-muted)]">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[9vw] leading-none tracking-[-0.045em] transition-[transform,color] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-3 group-hover:text-[var(--gold)] md:text-[3.6vw]">
                  {item.name}
                </span>
                <span className="col-start-2 text-[15px] text-[var(--night-muted)] md:col-start-auto">
                  {item.headline}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {!reduced && (
        <motion.div className="pointer-events-none fixed left-0 top-0 z-30 hidden md:block" style={{ x, y }}>
          <AnimatePresence>
            {hover !== null && (
              <motion.div
                key={aiCases[hover].slug}
                initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="relative -ml-[10rem] -mt-[8rem] h-[16rem] w-[20rem] overflow-hidden rounded-[18px] border border-white/10 bg-[var(--night-2)] shadow-2xl [&>*]:h-full"
              >
                <SystemScene slug={aiCases[hover].slug} accent={aiCases[hover].accent} compact />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

/* ── iOS: the shelf ───────────────────────────────────────────────────── */

export function IosView() {
  return (
    <div className="min-h-[100svh] bg-[var(--day)] px-[5vw] pb-40 pt-[22vh] text-[var(--ink)] md:px-[9vw]">
      <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">iOS Apps</p>
      <h1 className="v2-display mt-6 text-[15vw] md:text-[8vw]">
        <MaskLine>Apps.</MaskLine>
      </h1>
      <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[var(--muted)]">
        Native SwiftUI, from the first sketch to the App Store. Each one designed, built and run by me.
      </p>
      <div className="mt-20 grid grid-cols-2 gap-x-5 gap-y-14 md:grid-cols-4 md:gap-x-8">
        {iosApps.map((a, i) => (
          <motion.div
            key={a.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, ease: EASE, delay: (i % 4) * 0.07 }}
          >
            <Link href={a.href} className="group block">
              <div
                className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[22px]"
                style={{ background: `color-mix(in srgb, ${a.accent} 22%, var(--day-2))` }}
              >
                <div className="v2-phone w-[52%] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-2 group-hover:scale-[1.04]">
                  <div>
                    <Image src={a.screen} alt="" fill sizes="(min-width: 768px) 12vw, 26vw" className="object-cover" />
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xl font-medium tracking-[-0.03em]">{a.name}</p>
              <p className="mt-1 text-[14px] leading-snug text-[var(--muted)]">{a.tagline}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── About ────────────────────────────────────────────────────────────── */

const FACTS = [
  ["Based", "Belgrade, Serbia. My afternoons and evenings cover the US East Coast workday."],
  ["Education", "B.Eng. in software engineering."],
  ["Upwork", "Top Rated, 100% Job Success, 14 contracts."],
  ["Own products", "10 iOS apps live on the App Store, built solo."],
  ["Open source", "Gatehouse MCP: every risky agent action waits for a signed human approval."],
];

const HOW = [
  ["Your workflow first", "I start from the job your team does today, not from a model."],
  ["Nothing moves unapproved", "Agents propose; a named person approves anything that touches money or customers."],
  ["Measured, then shipped", "Every release passes evals on real cases before it reaches your users."],
];

export function AboutView() {
  return (
    <div className="min-h-[100svh] bg-[var(--day)] px-[5vw] pb-40 pt-[22vh] text-[var(--ink)] md:px-[9vw]">
      <div className="grid gap-16 md:grid-cols-[1.25fr_1fr] md:gap-[6vw]">
        <div>
          <h1 className="v2-display text-[15vw] md:text-[7vw]">
            <MaskLine>One person.</MaskLine>
            <MaskLine delay={0.1}>Whole system.</MaskLine>
          </h1>
          <p className="mt-10 max-w-xl text-xl leading-snug tracking-[-0.02em] md:text-2xl">
            I&apos;m Relja, a software engineer who builds AI agents for businesses and iOS apps
            for myself. I own every layer: the prompts and evals, the backend, the approval flow
            and the app your customers hold.
          </p>
          <dl className="mt-16 border-t border-[var(--ink)]/15">
            {FACTS.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 border-b border-[var(--ink)]/15 py-4 text-[15px]">
                <dt className="text-[var(--muted)]">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative">
          <div className="sticky top-[14vh] overflow-hidden rounded-[26px] bg-[var(--day-2)]">
            <div className="relative aspect-[4/5]">
              <Image
                src="/photos/v2/about.jpg"
                alt="Relja Bulajić"
                fill
                sizes="(min-width: 768px) 36vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <h2 className="v2-display mt-[16vh] text-[12vw] md:text-[5.5vw]">
        <MaskLine>How I work</MaskLine>
      </h2>
      <div className="mt-12 grid gap-10 md:grid-cols-3">
        {HOW.map(([t, d], i) => (
          <div key={t} className="border-t border-[var(--ink)]/20 pt-6">
            <p className="font-mono text-xs text-[var(--muted)]">0{i + 1}</p>
            <p className="mt-4 text-2xl font-medium tracking-[-0.03em]">{t}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">{d}</p>
          </div>
        ))}
      </div>

      <div className="mt-[14vh] border-t border-[var(--ink)]/15 pt-8">
        <FooterLinks dark={false} />
      </div>
    </div>
  );
}
