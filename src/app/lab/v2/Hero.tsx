"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** A line of display type that rises out of its own mask. */
export function MaskLine({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <span className={`v2-mask ${className}`}>
      <motion.span
        className="block"
        initial={reduced ? false : { y: "108%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
        transition={{ duration: 1.15, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

const ramp = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));

/**
 * Opening: one continuous film, scrubbed by scroll. Relja stands still while
 * the high-rise office around him breaks into gold particles and rebuilds as
 * his room at home. The type follows: "AI Engineer" in the office,
 * "& iOS Developer" at home.
 */
export default function Hero({ onScrollDown }: { onScrollDown: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const seek = (v: number) => {
    const el = vid.current;
    if (!el || !el.duration) return;
    el.currentTime = ramp(v, 0.04, 0.86) * (el.duration - 0.05);
  };
  useMotionValueEvent(scrollYProgress, "change", seek);
  useEffect(() => {
    const el = vid.current;
    if (!el) return;
    const onReady = () => seek(scrollYProgress.get());
    el.addEventListener("loadedmetadata", onReady);
    return () => el.removeEventListener("loadedmetadata", onReady);
  });

  // computed in JS so framer-motion keeps them off the browser's ScrollTimeline
  const officeText = useTransform(scrollYProgress, (v) => 1 - ramp(v, 0.22, 0.4));
  const officeY = useTransform(scrollYProgress, (v) => (reduced ? 0 : ramp(v, 0.22, 0.4) * -60));
  const homeText = useTransform(scrollYProgress, (v) => ramp(v, 0.62, 0.8));
  const homeY = useTransform(scrollYProgress, (v) => (reduced ? 0 : (1 - ramp(v, 0.62, 0.8)) * 60));
  const bar = useTransform(scrollYProgress, (v) => `${ramp(v, 0.04, 0.86) * 100}%`);
  const veil = useTransform(scrollYProgress, (v) => ramp(v, 0.9, 1) * 0.7);

  return (
    <section ref={ref} className="relative h-[240svh] bg-[var(--night)] text-[var(--night-ink)]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0 animate-[v2-breathe_14s_ease-in-out_infinite] motion-reduce:animate-none">
          <video
            ref={vid}
            src="/videos/v2/transition.mp4"
            poster="/videos/v2/transition.jpg"
            muted
            playsInline
            preload="auto"
            aria-label="Relja Bulajić, in an office that turns into his room at home"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--night)] via-[var(--night)]/10 to-[var(--night)]/45" />
        <motion.div style={{ opacity: veil }} className="absolute inset-0 bg-[var(--night)]" />

        {/* the office line */}
        <motion.div style={{ opacity: officeText, y: officeY }} className="absolute inset-x-0 bottom-[14svh] px-[5vw] md:px-[6vw]">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold)]">
            <span className="v2-mask"><motion.span className="block" initial={reduced ? false : { y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}>For teams · the office</motion.span></span>
          </p>
          <h1 className="v2-display mt-4 text-[17vw] md:text-[11vw]">
            <span className="v2-mask"><motion.span className="block" initial={reduced ? false : { y: "108%" }} animate={{ y: "0%" }} transition={{ duration: 1.15, ease: EASE, delay: 0.2 }}>AI Engineer</motion.span></span>
          </h1>
          <motion.p
            className="mt-5 max-w-xl text-lg leading-snug text-white/80 md:text-xl"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}
          >
            I build AI agents that touch real money and real customers, and the part after the demo that makes them safe.
          </motion.p>
        </motion.div>

        {/* the home line */}
        <motion.div style={{ opacity: homeText, y: homeY }} className="absolute inset-x-0 bottom-[14svh] px-[5vw] md:px-[6vw]">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold)]">For myself · at home</p>
          <p className="v2-display mt-4 text-[15vw] md:text-[10vw]">&amp; iOS Developer</p>
          <p className="mt-5 max-w-xl text-lg leading-snug text-white/80 md:text-xl">
            And I ship my own iOS apps to the App Store, alone, from Belgrade.
          </p>
        </motion.div>

        {/* office to home progress */}
        <div className="absolute bottom-8 left-[5vw] right-[5vw] flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white/60 md:left-[6vw] md:right-auto md:w-[22rem]">
          <span>Office</span>
          <span className="relative h-px flex-1 bg-white/20">
            <motion.span className="absolute inset-y-0 left-0 bg-[var(--gold)]" style={{ width: bar }} />
          </span>
          <span>Home</span>
        </div>
        <motion.button
          type="button"
          onClick={onScrollDown}
          aria-label="Skip to the next section"
          className="absolute bottom-6 right-[5vw] hidden size-14 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-black md:flex"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <motion.span animate={reduced ? undefined : { y: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
            ↓
          </motion.span>
        </motion.button>
      </div>
    </section>
  );
}
