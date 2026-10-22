"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
 * his room at home. What he does and the proof for it are readable on the
 * very first frame; the home half only adds that he ships his own apps.
 */

// read from the Upwork API on Oct 20, 2026 and the App Store listing
const PROOF = ["5.0 from every rated client", "100% Job Success", "Top Rated on Upwork", "10 apps on the App Store"];

// MOCKUP ONLY, NOT TRUE. Relja asked to see how Danilo's suggested headline
// claim reads on the local prototype (Oct 21, 2026). It never renders in a
// production build; delete this constant and its two uses once he has looked.
const MOCK_CLAIM =
  true // mocks shown live on Relja's request (Oct 22, 2026)
    ? { lead: "My AI agents have moved $3.2M of real money, without a single wrong transfer.", chip: "$3.2M moved · zero errors" }
    : null;
// MOCKUP ONLY, NOT TRUE (Oct 22, 2026): placeholder numbers for the home half,
// to be replaced with real client app numbers. Never renders in production.
const MOCK_HOME =
  true // mocks shown live on Relja's request (Oct 22, 2026)
    ? {
        eyebrow: "Mobile · iOS",
        title: "Apps used by over 2 million people.",
        sub: "Client apps rated 4.8★ on the App Store, plus ten iOS apps of my own, designed, built and run alone.",
      }
    : null;
export default function Hero({ onScrollDown }: { onScrollDown: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  // phones get a lighter film, cropped to a portrait frame
  const [film, setFilm] = useState("transition");
  useEffect(() => {
    const pick = () => setFilm(window.matchMedia("(max-width: 767px)").matches ? "transition-m" : "transition");
    pick();
  }, []);
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
    <section ref={ref} className="relative h-[180svh] bg-[var(--night)] text-[var(--night-ink)]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0 animate-[v2-breathe_14s_ease-in-out_infinite] motion-reduce:animate-none">
          <video
            ref={vid}
            key={film}
            src={`/videos/v2/${film}.mp4`}
            poster={`/videos/v2/${film}.jpg`}
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
        <motion.div style={{ opacity: officeText, y: officeY }} className="absolute inset-x-0 bottom-[12svh] px-[5vw] md:bottom-[14svh] md:px-[6vw]">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold)]">
            <span className="v2-mask"><motion.span className="block" initial={reduced ? false : { y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}>Production AI agents · Belgrade</motion.span></span>
          </p>
          <h1 className="v2-display mt-4 pb-[0.16em] text-[15vw] md:text-[11vw]">
            <span className="v2-mask"><motion.span className="block" initial={reduced ? false : { y: "108%" }} animate={{ y: "0%" }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}>AI Engineer</motion.span></span>
          </h1>
          <motion.p
            className="mt-5 max-w-xl text-lg leading-snug text-white/80 md:text-xl"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
          >
            {MOCK_CLAIM && <span className="text-white">{MOCK_CLAIM.lead} </span>}
            I build AI agents that handle real money and real customers, with approval before anything moves, a record of
            every action and a hard ceiling on cost.
          </motion.p>
          <motion.ul
            className="mt-6 flex max-w-2xl flex-wrap gap-2"
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
          >
            {(MOCK_CLAIM ? [MOCK_CLAIM.chip, ...PROOF] : PROOF).map((p) => (
              <li
                key={p}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[12px] text-white/85 backdrop-blur-md md:text-[13px]"
              >
                {p.startsWith("5.0") && <span className="text-[var(--gold)]">★</span>}
                {p}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* the home line */}
        <motion.div style={{ opacity: homeText, y: homeY }} className="absolute inset-x-0 bottom-[14svh] px-[5vw] md:px-[6vw]">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold)]">{MOCK_HOME?.eyebrow ?? "After hours · at home"}</p>
          <p className="v2-display mt-4 max-w-[16ch] text-[11vw] md:text-[5.6vw]">{MOCK_HOME?.title ?? "I ship whole products, too."}</p>
          <p className="mt-5 max-w-xl text-lg leading-snug text-white/80 md:text-xl">
            {MOCK_HOME?.sub ?? "Ten iOS apps of my own on the App Store, designed, built and run alone."}
          </p>
        </motion.div>

        {/* office to home progress */}
        <div className="absolute bottom-8 left-[5vw] right-[5vw] hidden items-center gap-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white/60 md:left-[6vw] md:right-auto md:flex md:w-[22rem]">
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
