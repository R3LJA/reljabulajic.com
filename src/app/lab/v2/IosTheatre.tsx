"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import { iosApps } from "./data";
import { EASE, MaskLine } from "./Hero";

/**
 * One phone on a stage. Scrolling swaps the app on its screen, the name
 * behind it and the colour of the light around it. The phone leans toward
 * the cursor.
 */
export default function IosTheatre() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const n = iosApps.length;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(n - 1, Math.max(0, Math.floor(v * n)));
    setActive((prev) => (prev === i ? prev : i));
  });
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // cursor tilt
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 120, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 120, damping: 18 });

  const app = iosApps[active];

  return (
    <section id="v2-ios" className="relative bg-[var(--day)] text-[var(--ink)]">
      <div className="px-[5vw] pb-[6vh] pt-[18vh]">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Also · iOS Apps</p>
        <h2 className="v2-display mt-6 text-[14vw] md:text-[8vw]">
          <MaskLine>Shipped to the</MaskLine>
          <MaskLine delay={0.08}>App Store, solo.</MaskLine>
        </h2>
      </div>

      <div ref={ref} className="relative" style={{ height: `${n * 75}svh` }}>
        <div
          className="sticky top-0 flex h-[100svh] items-center overflow-hidden"
          onPointerMove={(e) => {
            if (reduced) return;
            const r = e.currentTarget.getBoundingClientRect();
            ry.set(((e.clientX - r.left) / r.width - 0.5) * 18);
            rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
          }}
          onPointerLeave={() => {
            rx.set(0);
            ry.set(0);
          }}
        >
          {/* coloured light behind the phone */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
            animate={{ backgroundColor: app.accent, opacity: 0.38 }}
            transition={{ duration: 0.9, ease: EASE }}
          />

          {/* the app's name, huge, behind the phone */}
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={app.slug}
                className="v2-display block whitespace-nowrap text-[22vw] text-[var(--ink)]/[0.07] md:text-[15vw]"
                initial={{ y: "40%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-40%", opacity: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                {app.name}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* index on the left */}
          <ol className="absolute left-[5vw] top-1/2 z-[2] hidden -translate-y-1/2 space-y-2 md:block">
            {iosApps.map((a, i) => (
              <li
                key={a.slug}
                className={`flex items-center gap-3 text-[15px] transition-[color,transform] duration-500 ${
                  i === active ? "translate-x-2 text-[var(--ink)]" : "text-[var(--ink)]/30"
                }`}
              >
                <span
                  className="h-px bg-current transition-[width] duration-500"
                  style={{ width: i === active ? 28 : 12 }}
                />
                {a.name}
              </li>
            ))}
          </ol>

          {/* the phone */}
          <div className="relative z-[2] mx-auto w-[min(62vw,300px)] [perspective:1400px] md:w-[min(21vw,330px)]">
            <motion.div style={{ rotateX, rotateY }} className="v2-phone v2-will">
              <div>
                <AnimatePresence initial={false}>
                  <motion.div
                    key={app.slug}
                    className="absolute inset-0"
                    initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 1.08 }}
                    animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
                    exit={{ opacity: 0.6 }}
                    transition={{ duration: 0.75, ease: EASE }}
                  >
                    <Image src={app.screen} alt={`${app.name} screen`} fill sizes="330px" className="object-cover" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* details on the right */}
          <div className="absolute bottom-[12svh] left-[5vw] right-[5vw] z-[2] md:bottom-auto md:left-auto md:right-[6vw] md:top-1/2 md:w-[22rem] md:-translate-y-1/2">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={app.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <p className="font-mono text-xs text-[var(--muted)]">
                  {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                </p>
                <p className="mt-3 text-3xl font-medium tracking-[-0.035em]">{app.name}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--muted)]">{app.tagline}</p>
                {app.storeUrl && (
                  <a
                    href={app.storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--ink)]/15 px-4 py-2 text-sm transition-colors hover:bg-[var(--ink)] hover:text-[var(--day)]"
                  >
                    App Store ↗
                  </a>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* progress */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--ink)]/10">
            <motion.div className="h-full bg-[var(--ink)]" style={{ width: bar }} />
          </div>
        </div>
      </div>
    </section>
  );
}
